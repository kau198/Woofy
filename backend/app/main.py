import json
import secrets
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from datetime import UTC, date, timedelta
from pathlib import Path
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from sqlalchemy import delete, func, select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.staticfiles import StaticFiles

from .account import register_account_routes
from .assistant import AssistantUnavailable, generate_reply
from .config import get_settings
from .database import engine, get_db
from .models import (
    Accessory,
    AuthSession,
    ChatMessage,
    FocusSession,
    Habit,
    HabitLog,
    PawTransaction,
    Pet,
    RateBucket,
    Subtask,
    Task,
    User,
    UserAccessory,
    today,
    utcnow,
)
from .schemas import (
    ChatInput,
    FocusInput,
    GoogleLoginInput,
    HabitCompletion,
    HabitInput,
    LoginInput,
    PetUpdate,
    ProfileUpdate,
    RegisterInput,
    SubtaskInput,
    SuggestionInput,
    TaskInput,
    TaskUpdate,
)
from .security import create_access_token, decode_access_token, hash_password, verify_password

settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


@asynccontextmanager
async def lifespan(_app):
    # Schema changes are applied explicitly with Alembic before startup.
    with Session(engine) as db:
        if not db.scalar(select(func.count(Accessory.id))):
            db.add_all(
                [
                    Accessory(slug=a, name=b, kind=c, price=d, color=e, mascot_accessory=f)
                    for a, b, c, d, e, f in ACCESSORIES
                ]
            )
            db.commit()
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url="/docs" if not settings.is_production else None,
    redoc_url=None,
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Woofy-Client"],
)

ACCESSORIES = [
    ("bandana-terracota", "Bandana terracota", "Bandanas", 0, "#C95F43", "bandana"),
    ("laco-amarelo", "Laço amarelo", "Laços", 80, "#F2B84B", "bow"),
    ("coleira-verde", "Coleira verde", "Coleiras", 120, "#287465", None),
    ("gravata-azul", "Gravata azul", "Gravatas", 160, "#5C80A8", None),
    ("oculos-redondos", "Óculos redondos", "Especiais", 240, "#765B4B", None),
    ("mochila-aventura", "Mochila aventura", "Mochilas", 320, "#B4763B", None),
]


_attempts: dict[str, deque] = defaultdict(deque)


@app.middleware("http")
async def request_guards(request: Request, call_next):
    if request.method in {"POST", "PATCH", "DELETE"}:
        origin = request.headers.get("origin")
        if request.headers.get("x-woofy-client") != "woofy" or (
            origin and origin not in settings.frontend_origins
        ):
            return JSONResponse({"detail": "Origem da solicitação não permitida."}, status_code=403)
        if request.url.path.startswith("/api/v1/auth/") or request.url.path == "/api/v1/contact":
            now = time.monotonic()
            key = f"{request.client.host if request.client else 'unknown'}:{request.url.path}"
            if len(_attempts) > 10000:
                _attempts.clear()
            bucket = _attempts[key]
            while bucket and bucket[0] < now - 60:
                bucket.popleft()
            if len(bucket) >= 10:
                return JSONResponse({"detail": "Muitas tentativas. Aguarde um minuto."}, status_code=429)
            bucket.append(now)
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store"
    return response


def current_user(
    request: Request,
    token: Annotated[str | None, Depends(oauth2_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    # Serialize mutations per account; SQLite requires the lock before the first read.
    writing = request.method in {"POST", "PATCH", "DELETE"}
    if writing and db.bind.dialect.name == "sqlite":
        db.execute(text("BEGIN IMMEDIATE"))
    claims = decode_access_token(token or request.cookies.get("woofy_session", ""))
    session = db.get(AuthSession, claims.get("jti")) if claims and claims.get("jti") else None
    user = None
    if session and session.expires_at.replace(tzinfo=UTC) > utcnow():
        query = (
            select(User)
            .options(selectinload(User.pet))
            .where(User.id == int(claims["sub"]), User.id == session.user_id)
        )
        if writing:
            query = query.with_for_update()
        user = db.scalar(query)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sessão inválida ou expirada.")
    return user


Db = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(current_user)]


def issue_session(user: User, db: Session, response: Response) -> dict:
    session_id = secrets.token_urlsafe(32)
    db.add(
        AuthSession(
            id=session_id,
            user_id=user.id,
            expires_at=utcnow() + timedelta(minutes=settings.access_token_expire_minutes),
        )
    )
    db.commit()
    response.set_cookie(
        "woofy_session",
        create_access_token(user.id, session_id),
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )
    return {"user": {"id": user.id, "name": user.full_name, "email": user.email}}


def parse_due(value: str) -> date:
    if value in {"Hoje", "Amanhã"}:
        return today() + timedelta(days=int(value == "Amanhã"))
    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise HTTPException(422, "Informe uma data válida.") from exc


def pt_date(value: date) -> str:
    months = (
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
    )
    return f"{value.day:02d} de {months[value.month - 1]} de {value.year}"


def task_payload(item: Task) -> dict:
    return {
        "id": item.id,
        "title": item.title,
        "description": item.description,
        "category": item.category,
        "priority": item.priority,
        "date": "Hoje"
        if item.due_date == today()
        else "Amanhã"
        if item.due_date == today() + timedelta(days=1)
        else item.due_date.isoformat(),
        "dueDate": item.due_date.isoformat(),
        "time": item.due_time,
        "completed": item.completed,
        "subtasks": [{"id": sub.id, "title": sub.title, "completed": sub.completed} for sub in item.subtasks],
    }


def habit_payload(item: Habit, completed: bool) -> dict:
    return {
        "id": item.id,
        "name": item.name,
        "icon": item.icon,
        "time": item.target,
        "completed": completed,
        "color": item.color,
    }


def balance(db: Session, user_id: int) -> int:
    return int(
        db.scalar(
            select(func.coalesce(func.sum(PawTransaction.amount), 0)).where(PawTransaction.user_id == user_id)
        )
        or 0
    )


def profile_payload(user: User) -> dict:
    pet = user.pet
    return {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "interests": json.loads(user.interests_json or "[]"),
        "darkMode": user.dark_mode,
        "notifications": {
            "tasks": user.notify_tasks,
            "habits": user.notify_habits,
            "companion": user.notify_companion,
        },
        "adopted": bool(pet and pet.adopted),
        "pet": {
            "name": pet.name,
            "gender": pet.gender,
            "coat": pet.coat,
            "personality": pet.personality,
            "objective": pet.objective,
            "adoptionDate": pt_date(pet.adoption_date),
            "accessory": pet.equipped_accessory,
        }
        if pet
        else None,
    }


def create_user_resources(db: Session, user: User) -> None:
    pet = Pet(user_id=user.id)
    welcome = PawTransaction(user_id=user.id, amount=50, description="Boas-vindas ao Woofy")
    bandana = db.scalar(select(Accessory).where(Accessory.slug == "bandana-terracota"))
    db.add_all([pet, welcome])
    if bandana:
        db.add(UserAccessory(user_id=user.id, accessory_id=bandana.id, equipped=True))


@app.get("/health")
def health(db: Db) -> dict:
    db.execute(text("SELECT 1"))
    return {"status": "ok"}


@app.get("/api/v1/meta")
def meta() -> dict:
    return {
        "assistantConfigured": bool(settings.groq_api_key or settings.openai_api_key),
        "googleClientId": settings.google_client_id,
        "passwordResetConfigured": bool(settings.smtp_host and settings.smtp_from),
    }


@app.post("/api/v1/auth/register", status_code=status.HTTP_201_CREATED)
def register(data: RegisterInput, db: Db, response: Response) -> dict:
    email = data.email.lower().strip()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=409, detail="Já existe uma conta com este e-mail.")
    if len(data.name.strip()) < 2:
        raise HTTPException(422, "Informe seu nome.")
    user = User(email=email, full_name=data.name.strip(), password_hash=hash_password(data.password))
    db.add(user)
    db.flush()
    create_user_resources(db, user)
    db.commit()
    db.refresh(user)
    return issue_session(user, db, response)


@app.post("/api/v1/auth/login")
def login(data: LoginInput, db: Db, response: Response) -> dict:
    user = db.scalar(select(User).where(User.email == data.email.lower().strip()))
    valid = verify_password(data.password, user.password_hash if user else None)
    if not user or not user.password_hash or not valid:
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")
    return issue_session(user, db, response)


@app.post("/api/v1/auth/google")
def google_login(data: GoogleLoginInput, db: Db, response: Response) -> dict:
    if not settings.google_client_id:
        raise HTTPException(status_code=503, detail="Login com Google ainda não foi configurado no servidor.")
    try:
        claims = id_token.verify_oauth2_token(
            data.credential, google_requests.Request(), settings.google_client_id
        )
    except ValueError as exc:
        raise HTTPException(status_code=401, detail="Credencial do Google inválida.") from exc
    subject, email = claims.get("sub"), claims.get("email")
    if not subject or not email or not claims.get("email_verified"):
        raise HTTPException(status_code=401, detail="Não foi possível confirmar este e-mail do Google.")
    user = db.scalar(select(User).where(User.google_sub == subject))
    if not user:
        user = db.scalar(select(User).where(User.email == email.lower()))
        if user and user.google_sub and user.google_sub != subject:
            raise HTTPException(status_code=409, detail="Este e-mail já está vinculado a outra conta.")
        if user:
            raise HTTPException(409, "Este e-mail já possui senha. Entre usando sua senha.")
        else:
            user = User(email=email.lower(), full_name=claims.get("name") or "Pessoa", google_sub=subject)
            db.add(user)
            db.flush()
            create_user_resources(db, user)
        db.commit()
    return issue_session(user, db, response)


@app.post("/api/v1/auth/logout", status_code=204)
def logout(request: Request, response: Response, user: CurrentUser, db: Db):
    claims = decode_access_token(request.cookies.get("woofy_session", ""))
    if claims:
        db.execute(delete(AuthSession).where(AuthSession.id == claims["jti"], AuthSession.user_id == user.id))
        db.commit()
    response.delete_cookie(
        "woofy_session", path="/", secure=settings.cookie_secure, samesite=settings.cookie_samesite
    )


@app.get("/api/v1/bootstrap")
def bootstrap(user: CurrentUser, db: Db) -> dict:
    tasks = db.scalars(
        select(Task)
        .options(selectinload(Task.subtasks))
        .where(Task.user_id == user.id)
        .order_by(Task.id.desc())
    ).all()
    habits = db.scalars(select(Habit).where(Habit.user_id == user.id).order_by(Habit.id)).all()
    today_logs = {
        log.habit_id: log.completed
        for log in db.scalars(
            select(HabitLog).join(Habit).where(Habit.user_id == user.id, HabitLog.day == today())
        ).all()
    }
    transactions = db.scalars(
        select(PawTransaction)
        .where(PawTransaction.user_id == user.id)
        .order_by(PawTransaction.id.desc())
        .limit(30)
    ).all()
    return {
        "profile": profile_payload(user),
        "tasks": [task_payload(item) for item in tasks],
        "habits": [habit_payload(item, today_logs.get(item.id, False)) for item in habits],
        "paws": balance(db, user.id),
        "focusMinutes": db.scalar(
            select(func.coalesce(func.sum(FocusSession.minutes), 0)).where(
                FocusSession.user_id == user.id, FocusSession.completed_at.is_not(None)
            )
        ),
        "transactions": [
            {
                "id": item.id,
                "amount": item.amount,
                "description": item.description,
                "date": item.created_at.astimezone().strftime("%d/%m, %H:%M"),
            }
            for item in transactions
        ],
    }


@app.patch("/api/v1/profile")
def update_profile(data: ProfileUpdate, user: CurrentUser, db: Db) -> dict:
    values = data.model_dump(exclude_unset=True)
    if "name" in values:
        user.full_name = values["name"].strip()
    if "interests" in values:
        user.interests_json = json.dumps(
            [item.strip()[:50] for item in values.pop("interests") if item.strip()], ensure_ascii=False
        )
    for field in ("dark_mode", "notify_tasks", "notify_habits", "notify_companion"):
        if field in values:
            setattr(user, field, values[field])
    db.commit()
    return profile_payload(user)


@app.patch("/api/v1/pet")
def update_pet(data: PetUpdate, user: CurrentUser, db: Db) -> dict:
    pet = user.pet or Pet(user_id=user.id)
    db.add(pet)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(pet, field, value.strip() if isinstance(value, str) else value)
    db.commit()
    return profile_payload(user)["pet"]


@app.post("/api/v1/tasks", status_code=201)
def create_task(data: TaskInput, user: CurrentUser, db: Db) -> dict:
    item = Task(
        user_id=user.id,
        title=data.title.strip(),
        description=data.description,
        category=data.category,
        priority=data.priority,
        due_date=parse_due(data.date),
        due_time=data.time,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return task_payload(item)


@app.patch("/api/v1/tasks/{task_id}")
def update_task(task_id: int, data: TaskUpdate, user: CurrentUser, db: Db) -> dict:
    item = db.scalar(
        select(Task).options(selectinload(Task.subtasks)).where(Task.id == task_id, Task.user_id == user.id)
    )
    if not item:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada.")
    values = data.model_dump(exclude_unset=True)
    completed_before = item.completed
    mapping = {"date": "due_date", "time": "due_time"}
    for field, value in values.items():
        setattr(item, mapping.get(field, field), parse_due(value) if field == "date" else value)
    if not completed_before and item.completed and not item.reward_granted:
        db.add(PawTransaction(user_id=user.id, amount=10, description=f"Tarefa concluída: {item.title}"))
        item.reward_granted = True
    db.commit()
    return task_payload(item)


@app.delete("/api/v1/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, user: CurrentUser, db: Db) -> Response:
    item = db.scalar(select(Task).where(Task.id == task_id, Task.user_id == user.id))
    if not item:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada.")
    db.delete(item)
    db.commit()
    return Response(status_code=204)


@app.post("/api/v1/habits", status_code=201)
def create_habit(data: HabitInput, user: CurrentUser, db: Db) -> dict:
    item = Habit(user_id=user.id, name=data.name.strip(), icon=data.icon, target=data.time, color=data.color)
    db.add(item)
    db.commit()
    db.refresh(item)
    return habit_payload(item, False)


@app.patch("/api/v1/habits/{habit_id}/toggle")
def toggle_habit(habit_id: int, user: CurrentUser, db: Db, data: HabitCompletion | None = None) -> dict:
    item = db.scalar(select(Habit).where(Habit.id == habit_id, Habit.user_id == user.id))
    if not item:
        raise HTTPException(status_code=404, detail="Hábito não encontrado.")
    log = db.scalar(select(HabitLog).where(HabitLog.habit_id == item.id, HabitLog.day == today()))
    if not log:
        if data and not data.completed:
            return habit_payload(item, False)
        log = HabitLog(habit_id=item.id, day=today(), completed=True)
        db.add(log)
        db.add(PawTransaction(user_id=user.id, amount=5, description=f"Hábito concluído: {item.name}"))
    else:
        log.completed = data.completed if data else not log.completed
    db.commit()
    return habit_payload(item, log.completed)


@app.delete("/api/v1/habits/{habit_id}", status_code=204)
def delete_habit(habit_id: int, user: CurrentUser, db: Db) -> Response:
    item = db.scalar(select(Habit).where(Habit.id == habit_id, Habit.user_id == user.id))
    if not item:
        raise HTTPException(status_code=404, detail="Hábito não encontrado.")
    db.delete(item)
    db.commit()
    return Response(status_code=204)


@app.post("/api/v1/focus-sessions", status_code=201)
def start_focus(data: FocusInput, user: CurrentUser, db: Db) -> dict:
    active = db.scalar(
        select(FocusSession).where(
            FocusSession.user_id == user.id,
            FocusSession.completed_at.is_(None),
            FocusSession.cancelled.is_(False),
        )
    )
    if active:
        return focus_payload(active)
    item = FocusSession(
        user_id=user.id,
        minutes=data.minutes,
        reward=max(5, int(data.minutes / 2 + 0.5)),
        running_since=utcnow(),
    )
    db.add(item)
    db.commit()
    return focus_payload(item)


def focus_payload(item: FocusSession) -> dict:
    elapsed = item.elapsed_seconds
    if item.running_since:
        elapsed += max(0, int((utcnow() - item.running_since.replace(tzinfo=UTC)).total_seconds()))
    return {
        "id": item.id,
        "minutes": item.minutes,
        "reward": item.reward,
        "secondsLeft": max(0, item.minutes * 60 - elapsed),
        "running": item.running_since is not None,
        "completed": item.completed_at is not None,
    }


@app.get("/api/v1/focus-sessions/active")
def active_focus(user: CurrentUser, db: Db):
    item = db.scalar(
        select(FocusSession).where(
            FocusSession.user_id == user.id,
            FocusSession.completed_at.is_(None),
            FocusSession.cancelled.is_(False),
        )
    )
    return focus_payload(item) if item else None


@app.post("/api/v1/focus-sessions/{session_id}/{action}")
def change_focus(session_id: int, action: str, user: CurrentUser, db: Db):
    item = db.scalar(
        select(FocusSession).where(FocusSession.id == session_id, FocusSession.user_id == user.id)
    )
    if not item or item.cancelled:
        raise HTTPException(404, "Sessão não encontrada.")
    if action not in {"pause", "resume", "complete", "cancel"}:
        raise HTTPException(404, "Ação não encontrada.")
    if item.completed_at:
        return focus_payload(item)
    if item.running_since:
        item.elapsed_seconds += max(
            0, int((utcnow() - item.running_since.replace(tzinfo=UTC)).total_seconds())
        )
    item.running_since = None
    if action == "resume":
        item.running_since = utcnow()
    elif action == "cancel":
        item.cancelled = True
    elif action == "complete":
        if item.elapsed_seconds < item.minutes * 60:
            raise HTTPException(409, "A sessão ainda não terminou.")
        item.completed_at = utcnow()
        db.add(PawTransaction(user_id=user.id, amount=item.reward, description="Sessão de foco concluída"))
    db.commit()
    return focus_payload(item)


@app.get("/api/v1/chat/messages")
def chat_history(user: CurrentUser, db: Db, conversation: str = "default") -> list[dict]:
    items = db.scalars(
        select(ChatMessage)
        .where(ChatMessage.user_id == user.id, ChatMessage.conversation == conversation)
        .order_by(ChatMessage.id.desc())
        .limit(60)
    ).all()
    return [
        {
            "id": item.id,
            "sender": "pet" if item.role == "assistant" else "user",
            "text": item.text,
            "accepted": item.suggestions_accepted,
            "suggestions": json.loads(item.suggestion_json) if item.suggestion_json else [],
        }
        for item in reversed(items)
    ]


@app.get("/api/v1/chat/conversations")
def conversations(user: CurrentUser, db: Db):
    rows = db.execute(
        select(ChatMessage.conversation, func.min(ChatMessage.id), func.max(ChatMessage.id))
        .where(ChatMessage.user_id == user.id)
        .group_by(ChatMessage.conversation)
        .order_by(func.max(ChatMessage.id).desc())
        .limit(30)
    ).all()
    return [{"id": conv, "title": db.get(ChatMessage, first).text[:60]} for conv, first, _ in rows]


@app.delete("/api/v1/chat/messages", status_code=204)
def clear_chat(user: CurrentUser, db: Db, conversation: str = "default") -> Response:
    for item in db.scalars(
        select(ChatMessage).where(ChatMessage.user_id == user.id, ChatMessage.conversation == conversation)
    ).all():
        db.delete(item)
    db.commit()
    return Response(status_code=204)


@app.post("/api/v1/chat/messages")
def send_chat(data: ChatInput, user: CurrentUser, db: Db) -> dict:
    key = f"chat:{user.id}:{today()}"
    bucket = db.get(RateBucket, key)
    if bucket and bucket.count >= settings.chat_daily_limit:
        raise HTTPException(429, "Você atingiu o limite de conversas de hoje. Volte amanhã.")
    if not bucket:
        bucket = RateBucket(key=key, count=0)
        db.add(bucket)
    bucket.count += 1
    db.commit()
    history = db.scalars(
        select(ChatMessage)
        .where(ChatMessage.user_id == user.id, ChatMessage.conversation == data.conversation)
        .order_by(ChatMessage.id.desc())
        .limit(16)
    ).all()
    history = list(reversed(history))
    tasks = db.scalars(select(Task).where(Task.user_id == user.id, Task.completed.is_(False)).limit(8)).all()
    habits = db.scalars(select(Habit).where(Habit.user_id == user.id).limit(8)).all()
    routine = "Contexto desativado pelo usuário."
    if data.use_routine:
        routine = json.dumps(
            {
                "tarefas": [item.title for item in tasks],
                "habitos": [item.name for item in habits],
                "interesses": json.loads(user.interests_json),
            },
            ensure_ascii=False,
        )
    message_text = data.message + (
        "\n\nArquivo de texto enviado:\n" + data.attachment if data.attachment else ""
    )
    try:
        reply = generate_reply(user, history, message_text, data.mode, data.detail, routine)
    except AssistantUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    suggestions = [item.model_dump() for item in reply.suggestions]
    user_message = ChatMessage(
        user_id=user.id, role="user", text=message_text, mode=data.mode, conversation=data.conversation
    )
    assistant_message = ChatMessage(
        user_id=user.id,
        role="assistant",
        text=reply.text,
        mode=data.mode,
        conversation=data.conversation,
        suggestion_json=json.dumps(suggestions, ensure_ascii=False) if suggestions else None,
    )
    db.add_all([user_message, assistant_message])
    db.commit()
    return {
        "id": assistant_message.id,
        "sender": "pet",
        "text": reply.text,
        "suggestions": suggestions,
        "accepted": False,
    }


@app.post("/api/v1/chat/messages/{message_id}/accept")
def accept_suggestions(message_id: int, data: SuggestionInput, user: CurrentUser, db: Db):
    message = db.scalar(
        select(ChatMessage).where(
            ChatMessage.id == message_id, ChatMessage.user_id == user.id, ChatMessage.role == "assistant"
        )
    )
    if not message or not message.suggestion_json:
        raise HTTPException(404, "Sugestão não encontrada.")
    if message.suggestions_accepted:
        return {"accepted": True}
    for item in data.tasks:
        db.add(
            Task(
                user_id=user.id,
                title=item.title,
                description=item.description,
                category=item.category,
                priority=item.priority,
                due_date=parse_due(item.date),
                due_time=item.time,
            )
        )
    message.suggestions_accepted = True
    db.commit()
    return {"accepted": True}


@app.patch("/api/v1/habits/{habit_id}")
def update_habit(habit_id: int, data: HabitInput, user: CurrentUser, db: Db):
    item = db.scalar(select(Habit).where(Habit.id == habit_id, Habit.user_id == user.id))
    if not item:
        raise HTTPException(404, "Hábito não encontrado.")
    item.name, item.icon, item.target, item.color = data.name, data.icon, data.time, data.color
    db.commit()
    return {"ok": True}


@app.post("/api/v1/tasks/{task_id}/subtasks", status_code=201)
def add_subtask(task_id: int, data: SubtaskInput, user: CurrentUser, db: Db):
    task = db.scalar(select(Task).where(Task.id == task_id, Task.user_id == user.id))
    if not task:
        raise HTTPException(404, "Tarefa não encontrada.")
    item = Subtask(task_id=task.id, title=data.title, completed=data.completed)
    db.add(item)
    db.commit()
    return {"id": item.id, "title": item.title, "completed": item.completed}


@app.patch("/api/v1/subtasks/{subtask_id}")
def edit_subtask(subtask_id: int, data: SubtaskInput, user: CurrentUser, db: Db):
    item = db.scalar(select(Subtask).join(Task).where(Subtask.id == subtask_id, Task.user_id == user.id))
    if not item:
        raise HTTPException(404, "Etapa não encontrada.")
    item.title, item.completed = data.title, data.completed
    db.commit()
    return {"ok": True}


@app.delete("/api/v1/subtasks/{subtask_id}", status_code=204)
def delete_subtask(subtask_id: int, user: CurrentUser, db: Db):
    item = db.scalar(select(Subtask).join(Task).where(Subtask.id == subtask_id, Task.user_id == user.id))
    if not item:
        raise HTTPException(404, "Etapa não encontrada.")
    db.delete(item)
    db.commit()


@app.get("/api/v1/accessories")
def list_accessories(user: CurrentUser, db: Db) -> list[dict]:
    owned = {
        row.accessory_id: row
        for row in db.scalars(select(UserAccessory).where(UserAccessory.user_id == user.id)).all()
    }
    items = db.scalars(select(Accessory).order_by(Accessory.id)).all()
    return [
        {
            "id": item.id,
            "slug": item.slug,
            "name": item.name,
            "type": item.kind,
            "price": item.price,
            "color": item.color,
            "mascotAccessory": item.mascot_accessory,
            "owned": item.id in owned,
            "equipped": owned.get(item.id).equipped if item.id in owned else False,
        }
        for item in items
    ]


@app.post("/api/v1/accessories/{accessory_id}/equip")
def equip_accessory(accessory_id: int, user: CurrentUser, db: Db) -> dict:
    item = db.get(Accessory, accessory_id)
    if not item:
        raise HTTPException(status_code=404, detail="Acessório não encontrado.")
    ownership = db.scalar(
        select(UserAccessory).where(UserAccessory.user_id == user.id, UserAccessory.accessory_id == item.id)
    )
    if not ownership:
        if balance(db, user.id) < item.price:
            raise HTTPException(status_code=409, detail="Você ainda não tem patinhas suficientes.")
        ownership = UserAccessory(user_id=user.id, accessory_id=item.id)
        db.add(ownership)
        if item.price:
            db.add(PawTransaction(user_id=user.id, amount=-item.price, description=f"Acessório: {item.name}"))
    for row in db.scalars(select(UserAccessory).where(UserAccessory.user_id == user.id)).all():
        row.equipped = False
    ownership.equipped = True
    if user.pet:
        user.pet.equipped_accessory = item.slug
    db.commit()
    return {"ok": True, "paws": balance(db, user.id)}


register_account_routes(app, settings, current_user, get_db)


@app.exception_handler(IntegrityError)
async def handle_integrity(_request: Request, _error: IntegrityError):
    return JSONResponse(
        {"detail": "Este registro já existe ou foi alterado. Atualize e tente novamente."}, status_code=409
    )


class SPAFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        if path.startswith("api/"):
            raise StarletteHTTPException(404)
        try:
            return await super().get_response(path, scope)
        except StarletteHTTPException as error:
            if error.status_code != 404 or Path(path).suffix:
                raise
            return await super().get_response("index.html", scope)


static_directory = Path(settings.static_dir).resolve()
if static_directory.is_dir():
    app.mount("/", SPAFiles(directory=static_directory, html=True), name="frontend")
