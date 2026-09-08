import hashlib
from datetime import timedelta
from types import SimpleNamespace
from unittest.mock import patch

from conftest import TestingSession
from sqlalchemy import select

from app.assistant import AssistantReply, generate_reply
from app.config import Settings
from app.models import PasswordReset, User, utcnow


def test_provider_contract_hides_credentials_and_uses_structured_response(client, auth):
    config = Settings(openai_api_key="test-only-key")
    parsed = AssistantReply(text="Vamos começar por uma equação.", suggestions=[])
    with (
        TestingSession() as db,
        patch("app.assistant.get_settings", return_value=config),
        patch("app.assistant.OpenAI") as sdk,
    ):
        user = db.scalar(select(User))
        sdk.return_value.responses.parse.return_value = SimpleNamespace(output_parsed=parsed)
        result = generate_reply(user, [], "Como estudar álgebra?", "estudar", "curto", "Contexto desativado.")
        assert result.text == parsed.text
        args = sdk.return_value.responses.parse.call_args.kwargs
        assert args["store"] is False
        assert args["text_format"] == AssistantReply
        assert len(args["safety_identifier"]) == 32
        assert user.email not in str(args)
        assert user.password_hash not in str(args)
        assert args["input"][0]["content"] == "Como estudar álgebra?"


def test_password_reset_is_one_use_and_revokes_old_session(client, auth):
    token = "test-reset-token-" + "a" * 40
    cookie = client.cookies.get("woofy_session")
    with TestingSession() as db:
        user = db.scalar(select(User))
        db.add(
            PasswordReset(
                digest=hashlib.sha256(token.encode()).hexdigest(),
                user_id=user.id,
                expires_at=utcnow() + timedelta(minutes=30),
            )
        )
        db.commit()
    assert (
        client.post(
            "/api/v1/auth/reset-password", json={"token": token, "password": "nova-senha-segura"}
        ).status_code
        == 200
    )
    assert (
        client.post(
            "/api/v1/auth/reset-password", json={"token": token, "password": "outra-senha-segura"}
        ).status_code
        == 400
    )
    client.cookies.set("woofy_session", cookie)
    assert client.get("/api/v1/bootstrap").status_code == 401
    assert (
        client.post(
            "/api/v1/auth/login", json={"email": "kaua@example.com", "password": "nova-senha-segura"}
        ).status_code
        == 200
    )


def test_production_refuses_placeholder_credentials():
    import pytest

    with pytest.raises(RuntimeError):
        Settings(app_env="production").validate_production()
    settings = Settings(
        app_env="production",
        secret_key="a" * 48,
        cookie_secure=True,
        frontend_origins=["https://woofy.example"],
    )
    settings.validate_production()


def test_contact_and_missing_email_configuration(client):
    response = client.post(
        "/api/v1/contact",
        json={
            "name": "Teste",
            "email": "teste@example.com",
            "subject": "Suporte",
            "message": "Mensagem de teste do formulário.",
        },
    )
    assert response.status_code == 201
    assert client.post("/api/v1/auth/forgot-password", json={"email": "teste@example.com"}).status_code == 503


def test_login_throttling(client):
    for _ in range(10):
        client.post("/api/v1/auth/login", json={"email": "ninguem@example.com", "password": "invalida"})
    assert (
        client.post(
            "/api/v1/auth/login", json={"email": "ninguem@example.com", "password": "invalida"}
        ).status_code
        == 429
    )
