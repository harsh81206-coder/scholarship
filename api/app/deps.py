"""app/deps.py — FastAPI dependencies: auth, RBAC, pagination."""

from __future__ import annotations
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from app.security import decode_token

bearer = HTTPBearer(auto_error=False)


class CurrentUser:
    def __init__(
        self,
        sub: str,
        role: str,
        name: str,
        school_id: int | None,
        taluka_id: int | None,
        district_id: int | None,
    ):
        self.sub = sub  # cts_id or officer_id
        self.role = role
        self.name = name
        self.school_id = school_id
        self.taluka_id = taluka_id
        self.district_id = district_id

    def is_student(self) -> bool:
        return self.role == "student"


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> CurrentUser:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = decode_token(credentials.credentials)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return CurrentUser(
        sub=payload["sub"],
        role=payload["role"],
        name=payload.get("name", ""),
        school_id=payload.get("school_id"),
        taluka_id=payload.get("taluka_id"),
        district_id=payload.get("district_id"),
    )


def require_roles(*roles: str):
    def dep(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        if user.role not in roles:
            raise HTTPException(
                status_code=403,
                detail=f"Role '{user.role}' not permitted. Required: {roles}",
            )
        return user

    return dep


# Pagination
class PaginationParams:
    def __init__(self, page: int = 1, size: int = 20):
        self.page = max(1, page)
        self.size = min(100, max(1, size))
        self.offset = (self.page - 1) * self.size
