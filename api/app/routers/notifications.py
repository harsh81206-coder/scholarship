"""app/routers/notifications.py — notifications endpoints."""

from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db import get_session
from app.deps import get_current_user, CurrentUser
from app.models.core import Notification

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
def list_notifications(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    items = session.exec(
        select(Notification)
        .where(Notification.recipient_id == user.sub)
        .order_by(Notification.created_at.desc())  # type: ignore
    ).all()
    return {
        "items": [
            {
                "id": n.id,
                "type": n.notif_type,
                "title_en": n.title_en,
                "title_gu": n.title_gu,
                "body": n.body,
                "read": n.read,
                "created_at": n.created_at.isoformat(),
            }
            for n in items
        ],
        "unread_count": sum(1 for n in items if not n.read),
    }


@router.post("/read-all")
def mark_all_read(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    items = session.exec(
        select(Notification).where(
            Notification.recipient_id == user.sub, Notification.read.is_(False)
        )
    ).all()
    for n in items:
        n.read = True
    session.commit()
    return {"success": True, "marked": len(items)}


@router.patch("/{notif_id}/read")
def mark_read(
    notif_id: int,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    n = session.get(Notification, notif_id)
    if not n or n.recipient_id != user.sub:
        raise HTTPException(404)
    n.read = True
    session.commit()
    return {"success": True}
