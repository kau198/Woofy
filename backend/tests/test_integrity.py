from datetime import timedelta
from unittest.mock import patch

from conftest import TestingSession
from sqlalchemy import select

from app.assistant import AssistantReply, AssistantUnavailable, SuggestedTask
from app.models import FocusSession, User, utcnow


def test_password_is_argon2_and_logout_revokes_session(client, auth):
    with TestingSession() as db:
        user = db.scalar(select(User))
        assert user.password_hash.startswith("$argon2id$")
        assert "segredo123" not in user.password_hash
    cookie = client.cookies.get("woofy_session")
    assert client.post("/api/v1/auth/logout").status_code == 204
    client.cookies.set("woofy_session", cookie)
    assert client.get("/api/v1/bootstrap").status_code == 401


def test_csrf_and_validation(client, auth):
    assert (
        client.post(
            "/api/v1/tasks", json={"title": "Privada"}, headers={"Origin": "https://evil.example"}
        ).status_code
        == 403
    )
    assert client.post("/api/v1/tasks", json={"title": "   "}).status_code == 422
    assert client.patch("/api/v1/profile", json={"name": None}).status_code == 422
    assert client.patch("/api/v1/pet", json={"name": None}).status_code == 422


def test_rewards_cannot_be_farmed_by_toggling(client, auth):
    task = client.post("/api/v1/tasks", json={"title": "Estudar"}).json()
    for value in (True, False, True, False, True):
        assert client.patch(f"/api/v1/tasks/{task['id']}", json={"completed": value}).status_code == 200
    habit = client.post("/api/v1/habits", json={"name": "Ler"}).json()
    for _ in range(5):
        assert client.patch(f"/api/v1/habits/{habit['id']}/toggle").status_code == 200
    assert client.get("/api/v1/bootstrap").json()["paws"] == 65


def test_focus_requires_elapsed_time_and_pays_once(client, auth):
    started = client.post("/api/v1/focus-sessions", json={"minutes": 1}).json()
    path = f"/api/v1/focus-sessions/{started['id']}"
    assert client.post(path + "/complete").status_code == 409
    assert client.post(path + "/pause").status_code == 200
    assert not client.get("/api/v1/focus-sessions/active").json()["running"]
    assert client.post(path + "/resume").status_code == 200
    with TestingSession() as db:
        item = db.get(FocusSession, started["id"])
        item.running_since = utcnow() - timedelta(seconds=65)
        db.commit()
    assert client.post(path + "/complete").status_code == 200
    assert client.post(path + "/complete").status_code == 200
    assert client.get("/api/v1/bootstrap").json()["paws"] == 55


def test_generated_suggestions_are_edited_and_accepted_once(client, auth):
    reply = AssistantReply(
        text="Vamos praticar.",
        suggestions=[
            SuggestedTask(title="Revisar equações", category="Estudos", priority="Alta", date="Hoje")
        ],
    )
    with patch("app.main.generate_reply", return_value=reply):
        message = client.post(
            "/api/v1/chat/messages", json={"message": "Estudar álgebra", "conversation": "algebra"}
        ).json()
    assert not client.get("/api/v1/bootstrap").json()["tasks"]
    data = {"tasks": [{"title": "Resolver 4 equações", "category": "Estudos"}]}
    path = f"/api/v1/chat/messages/{message['id']}/accept"
    assert client.post(path, json=data).status_code == 200
    assert client.post(path, json=data).status_code == 200
    tasks = client.get("/api/v1/bootstrap").json()["tasks"]
    assert len(tasks) == 1 and tasks[0]["title"] == "Resolver 4 equações"
    assert client.get("/api/v1/chat/messages").json() == []
    assert len(client.get("/api/v1/chat/messages?conversation=algebra").json()) == 2


def test_unconfigured_chat_does_not_fake_reply(client, auth):
    with patch("app.main.generate_reply", side_effect=AssistantUnavailable("Serviço indisponível")):
        assert client.post("/api/v1/chat/messages", json={"message": "Oi"}).status_code == 503
    assert client.get("/api/v1/chat/messages").json() == []


def test_account_export_and_delete(client, auth):
    client.post("/api/v1/tasks", json={"title": "Minha tarefa"})
    exported = client.get("/api/v1/account/export")
    assert exported.status_code == 200 and exported.json()["tasks"]
    assert "password_hash" not in exported.text
    assert client.delete("/api/v1/account").status_code == 204
    assert client.get("/api/v1/bootstrap").status_code == 401


def test_store_balance_and_free_item(client, auth):
    items = client.get("/api/v1/accessories").json()
    assert client.post(f"/api/v1/accessories/{items[1]['id']}/equip").status_code == 409
    assert client.post(f"/api/v1/accessories/{items[0]['id']}/equip").status_code == 200
    assert client.get("/api/v1/bootstrap").json()["paws"] == 50


def test_task_date_and_subtasks(client, auth):
    task = client.post("/api/v1/tasks", json={"title": "Projeto", "date": "2030-02-20"}).json()
    assert task["dueDate"] == "2030-02-20"
    step = client.post(f"/api/v1/tasks/{task['id']}/subtasks", json={"title": "Primeira etapa"}).json()
    assert (
        client.patch(
            f"/api/v1/subtasks/{step['id']}", json={"title": "Primeira etapa", "completed": True}
        ).status_code
        == 200
    )
    assert client.get("/api/v1/bootstrap").json()["tasks"][0]["subtasks"][0]["completed"]
    assert client.delete(f"/api/v1/tasks/{task['id']}").status_code == 204
