from unittest.mock import patch

from app.assistant import AssistantReply, SuggestedTask


def test_register_login_and_bootstrap(client):
    registered = client.post(
        "/api/v1/auth/register", json={"name": "Kauã", "email": "kaua@example.com", "password": "segredo123"}
    )
    assert registered.status_code == 201
    assert "HttpOnly" in registered.headers["set-cookie"]
    assert "accessToken" not in registered.json()
    bootstrap = client.get("/api/v1/bootstrap")
    assert bootstrap.status_code == 200
    assert bootstrap.json()["profile"]["name"] == "Kauã"
    assert bootstrap.json()["paws"] == 50
    assert "password" not in str(bootstrap.json()).lower()
    login = client.post("/api/v1/auth/login", json={"email": "kaua@example.com", "password": "segredo123"})
    assert login.status_code == 200


def test_wrong_password_is_rejected(client, auth):
    response = client.post("/api/v1/auth/login", json={"email": "kaua@example.com", "password": "errada"})
    assert response.status_code == 401


def test_tasks_habits_and_rewards(client, auth):
    created = client.post(
        "/api/v1/tasks",
        headers=auth,
        json={"title": "Finalizar o projeto", "category": "Trabalho", "priority": "Alta"},
    )
    assert created.status_code == 201
    task_id = created.json()["id"]
    assert client.patch(f"/api/v1/tasks/{task_id}", headers=auth, json={"completed": True}).status_code == 200
    habit = client.post(
        "/api/v1/habits",
        headers=auth,
        json={"name": "Beber água", "icon": "water", "time": "8 copos", "color": "sky"},
    )
    assert habit.status_code == 201
    assert (
        client.patch(f"/api/v1/habits/{habit.json()['id']}/toggle", headers=auth).json()["completed"] is True
    )
    data = client.get("/api/v1/bootstrap", headers=auth).json()
    assert data["paws"] == 65


def test_chat_persists_generated_answer(client, auth):
    with patch(
        "app.main.generate_reply",
        return_value=AssistantReply(
            text="Vamos estudar equações.",
            suggestions=[
                SuggestedTask(
                    title="Praticar equações de segundo grau",
                    category="Estudos",
                    priority="Alta",
                    date="Hoje",
                )
            ],
        ),
    ):
        response = client.post(
            "/api/v1/chat/messages",
            headers=auth,
            json={"message": "Preciso estudar matemática", "mode": "estudar"},
        )
    assert response.status_code == 200
    assert len(response.json()["suggestions"]) == 1
    history = client.get("/api/v1/chat/messages", headers=auth).json()
    assert [message["sender"] for message in history] == ["user", "pet"]


def test_user_cannot_access_another_users_task(client, auth):
    first = client.post("/api/v1/tasks", headers=auth, json={"title": "Privada"}).json()
    client.post(
        "/api/v1/auth/register",
        json={"name": "Outra", "email": "outra@example.com", "password": "segredo123"},
    )
    assert client.patch(f"/api/v1/tasks/{first['id']}", json={"completed": True}).status_code == 404
