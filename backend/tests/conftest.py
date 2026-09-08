# Set the isolated test database before importing application settings.
# ruff: noqa: E402
import os

TEST_URL = os.environ.get("TEST_DATABASE_URL", "sqlite://")
if not TEST_URL.startswith("sqlite") and not TEST_URL.endswith("/woofy_test"):
    raise RuntimeError("Os testes só podem usar o banco isolado woofy_test.")
os.environ["DATABASE_URL"] = TEST_URL
os.environ["SECRET_KEY"] = "test-secret-key-that-is-long-enough-for-tests"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import StaticPool, create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app

engine = create_engine(
    TEST_URL,
    **(
        {"connect_args": {"check_same_thread": False}, "poolclass": StaticPool}
        if TEST_URL.startswith("sqlite")
        else {}
    ),
)
TestingSession = sessionmaker(bind=engine, expire_on_commit=False)


def override_db():
    with TestingSession() as session:
        yield session


app.dependency_overrides[get_db] = override_db


@pytest.fixture(autouse=True)
def reset_db(monkeypatch):
    import app.main as main

    monkeypatch.setattr(main, "engine", engine)
    main._attempts.clear()
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)


@pytest.fixture
def client():
    with TestingSession() as db:
        from app.main import ACCESSORIES
        from app.models import Accessory

        db.add_all(
            [
                Accessory(slug=a, name=b, kind=c, price=d, color=e, mascot_accessory=f)
                for a, b, c, d, e, f in ACCESSORIES
            ]
        )
        db.commit()
    with TestClient(app, headers={"X-Woofy-Client": "woofy"}) as test_client:
        yield test_client


@pytest.fixture
def auth(client):
    response = client.post(
        "/api/v1/auth/register", json={"name": "Kauã", "email": "kaua@example.com", "password": "segredo123"}
    )
    assert response.status_code == 201
    return {"X-Woofy-Client": "woofy"}
