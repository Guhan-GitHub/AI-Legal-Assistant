import hashlib
from typing import Dict


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


# Demo users for the project – DO NOT use these patterns in production.
_USERS: Dict[str, str] = {
    "admin": _hash_password("Admin@1234"),
    "lawyer1": _hash_password("Lawyer@2024"),
    "student": _hash_password("Student@final1"),
}


def verify_user(username: str, password: str) -> bool:
    """
    Verify a username/password against the in-memory demo user store.
    Passwords are stored as SHA-256 hashes for demonstration only.
    """
    if username not in _USERS:
        return False
    return _USERS[username] == _hash_password(password)


def list_usernames() -> list[str]:
    """Return the list of configured demo usernames."""
    return sorted(_USERS.keys())


def add_user(username: str, password: str) -> None:
    """
    Register a new user in the in-memory store.
    This is for demo purposes only and is not persisted across restarts.
    """
    clean_username = username.strip()
    if not clean_username:
        raise ValueError("Username is required.")
    if clean_username in _USERS:
        raise ValueError("Username already exists.")
    _USERS[clean_username] = _hash_password(password)

