import hashlib
import secrets
import smtplib
from datetime import UTC, timedelta
from email.message import EmailMessage

from fastapi import HTTPException, Response
from sqlalchemy import delete, select, text

from .models import (
    AuthSession,
    ChatMessage,
    ContactMessage,
    FocusSession,
    PasswordReset,
    PawTransaction,
    User,
    UserAccessory,
    utcnow,
)
from .schemas import ContactInput, ForgotInput, ResetInput
from .security import hash_password


def register_account_routes(app, settings, current_user, get_db):
    from typing import Annotated

    from fastapi import Depends
    from sqlalchemy.orm import Session

    Db = Annotated[Session, Depends(get_db)]
    CurrentUser = Annotated[User, Depends(current_user)]

    @app.post("/api/v1/auth/forgot-password")
    def forgot_password(data: ForgotInput, db: Db):
        if not settings.smtp_host or not settings.smtp_from:
            raise HTTPException(503, "A recuperação por e-mail ainda não está disponível.")
        user = db.scalar(select(User).where(User.email == data.email.lower()))
        if user:
            token = secrets.token_urlsafe(40)
            db.execute(delete(PasswordReset).where(PasswordReset.user_id == user.id))
            db.add(
                PasswordReset(
                    digest=hashlib.sha256(token.encode()).hexdigest(),
                    user_id=user.id,
                    expires_at=utcnow() + timedelta(minutes=30),
                )
            )
            mail = EmailMessage()
            mail["Subject"] = "Redefina sua senha do Woofy"
            mail["From"], mail["To"] = settings.smtp_from, user.email
            mail.set_content(
                f"Para redefinir sua senha, abra este link em até 30 minutos:\n\n{settings.public_url.rstrip('/')}/recuperar?token={token}\n\nSe não foi você, ignore este e-mail."
            )
            try:
                with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
                    smtp.starttls()
                    if settings.smtp_user:
                        smtp.login(settings.smtp_user, settings.smtp_password)
                    smtp.send_message(mail)
            except (OSError, smtplib.SMTPException) as exc:
                raise HTTPException(503, "Não foi possível enviar o e-mail agora.") from exc
            db.commit()
        return {"message": "Se houver uma conta com esse e-mail, enviaremos as instruções."}

    @app.post("/api/v1/auth/reset-password")
    def reset_password(data: ResetInput, db: Db):
        if db.bind.dialect.name == "sqlite":
            db.execute(text("BEGIN IMMEDIATE"))
        digest = hashlib.sha256(data.token.encode()).hexdigest()
        reset = db.scalar(select(PasswordReset).where(PasswordReset.digest == digest).with_for_update())
        if not reset or reset.expires_at.replace(tzinfo=UTC) <= utcnow():
            raise HTTPException(400, "O link expirou ou já foi usado. Solicite outro.")
        user = db.get(User, reset.user_id)
        user.password_hash = hash_password(data.password)
        db.execute(delete(AuthSession).where(AuthSession.user_id == user.id))
        db.execute(delete(PasswordReset).where(PasswordReset.user_id == user.id))
        db.commit()
        return {"message": "Senha atualizada. Entre novamente."}

    @app.get("/api/v1/account/export")
    def export_account(user: CurrentUser, db: Db):
        from .main import bootstrap

        data = bootstrap(user, db)
        data["messages"] = [
            {"role": m.role, "text": m.text, "conversation": m.conversation}
            for m in db.scalars(select(ChatMessage).where(ChatMessage.user_id == user.id))
        ]
        data["focusSessions"] = [
            {"minutes": s.minutes, "completedAt": s.completed_at}
            for s in db.scalars(select(FocusSession).where(FocusSession.user_id == user.id))
        ]
        data["transactions"] = [
            {"amount": t.amount, "description": t.description, "createdAt": t.created_at}
            for t in db.scalars(select(PawTransaction).where(PawTransaction.user_id == user.id))
        ]
        return data

    @app.delete("/api/v1/account", status_code=204)
    def delete_account(user: CurrentUser, db: Db, response: Response):
        for model in (AuthSession, PasswordReset, ChatMessage, FocusSession, PawTransaction, UserAccessory):
            db.execute(delete(model).where(model.user_id == user.id))
        db.delete(user)
        db.commit()
        response.delete_cookie(
            "woofy_session", path="/", secure=settings.cookie_secure, samesite=settings.cookie_samesite
        )

    @app.post("/api/v1/contact", status_code=201)
    def contact(data: ContactInput, db: Db):
        message = ContactMessage(**data.model_dump())
        db.add(message)
        db.commit()
        return {"message": "Mensagem recebida. Obrigado por falar com o Woofy!"}
