"""app/db.py — SQLModel engine + session dependency."""

from sqlmodel import SQLModel, create_engine, Session
from app.config import get_settings

settings = get_settings()

connect_args = (
    {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
)
engine = create_engine(settings.database_url, connect_args=connect_args, echo=False)


def create_db_tables() -> None:
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
