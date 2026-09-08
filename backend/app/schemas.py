from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator


class CleanInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)


class RegisterInput(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class GoogleLoginInput(BaseModel):
    credential: str = Field(min_length=20)


class ProfileUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    interests: list[str] | None = Field(default=None, max_length=8)
    dark_mode: bool | None = None
    notify_tasks: bool | None = None
    notify_habits: bool | None = None
    notify_companion: bool | None = None

    @model_validator(mode="after")
    def non_null(self):
        if any(getattr(self, key) is None for key in self.model_fields_set):
            raise ValueError("Campos enviados não podem ser nulos.")
        if self.name is not None and len(self.name.strip()) < 2:
            raise ValueError("Informe um nome válido.")
        return self


class PetUpdate(CleanInput):
    name: str | None = Field(default=None, min_length=1, max_length=30)
    gender: Literal["male", "female"] | None = None
    coat: Literal["cream", "golden", "honey", "caramel", "red"] | None = None
    personality: Literal["carinhoso", "calmo", "divertido", "animado"] | None = None
    objective: str | None = Field(default=None, min_length=2, max_length=160)
    adopted: bool | None = None

    @model_validator(mode="after")
    def non_null(self):
        if any(getattr(self, key) is None for key in self.model_fields_set):
            raise ValueError("Campos enviados não podem ser nulos.")
        return self


class TaskInput(CleanInput):
    title: str = Field(min_length=1, max_length=180)
    description: str | None = Field(default=None, max_length=2000)
    category: Literal["Pessoal", "Estudos", "Trabalho", "Saúde", "Casa", "Outros"] = "Pessoal"
    priority: Literal["Baixa", "Média", "Alta"] = "Média"
    date: str = Field(default="Hoje", max_length=30)
    time: str | None = Field(default=None, max_length=10)


class TaskUpdate(CleanInput):
    title: str | None = Field(default=None, min_length=1, max_length=180)
    description: str | None = Field(default=None, max_length=2000)
    category: Literal["Pessoal", "Estudos", "Trabalho", "Saúde", "Casa", "Outros"] | None = None
    priority: Literal["Baixa", "Média", "Alta"] | None = None
    date: str | None = Field(default=None, max_length=30)
    time: str | None = Field(default=None, max_length=10)
    completed: bool | None = None

    @model_validator(mode="after")
    def non_null(self):
        if any(getattr(self, key) is None for key in self.model_fields_set - {"description", "time"}):
            raise ValueError("Campo obrigatório não pode ser nulo.")
        return self


class HabitInput(CleanInput):
    name: str = Field(min_length=1, max_length=180)
    icon: Literal["water", "book", "coffee", "sleep"] = "water"
    time: str = Field(default="10 min", min_length=1, max_length=60)
    color: Literal["sky", "amber", "rose", "lavender"] = "sky"


class FocusInput(BaseModel):
    minutes: int = Field(ge=1, le=240)


class HabitCompletion(BaseModel):
    completed: bool


class ChatInput(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    mode: Literal["livre", "explorar", "planejar", "estudar", "idiomas"] = "livre"
    detail: Literal["curto", "equilibrado", "detalhado"] = "equilibrado"
    use_routine: bool = True
    conversation: str = Field(default="default", pattern=r"^[a-zA-Z0-9-]{1,64}$")
    attachment: str = Field(default="", max_length=12000)

    @model_validator(mode="after")
    def strip_message(self):
        self.message = self.message.strip()
        if not self.message:
            raise ValueError("A mensagem não pode ficar vazia.")
        return self


class SubtaskInput(CleanInput):
    title: str = Field(min_length=1, max_length=180)
    completed: bool = False


class SuggestionInput(BaseModel):
    tasks: list[TaskInput] = Field(min_length=1, max_length=5)


class ForgotInput(BaseModel):
    email: EmailStr


class ResetInput(BaseModel):
    token: str = Field(min_length=32, max_length=128)
    password: str = Field(min_length=8, max_length=128)


class ContactInput(CleanInput):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    subject: str = Field(min_length=2, max_length=100)
    message: str = Field(min_length=10, max_length=4000)
