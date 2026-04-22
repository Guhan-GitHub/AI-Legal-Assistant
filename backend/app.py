from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from .search_engine import search_engine
from .summarizer import summarize_text, suggest_precedents
from .seed_cases import load_seed_cases
from .auth import verify_user, list_usernames, add_user


class UploadCaseRequest(BaseModel):
    title: str
    text: str
    jurisdiction: Optional[str] = None
    court: Optional[str] = None
    year: Optional[int] = None


class SearchRequest(BaseModel):
    query: str
    k: int = 5


class PrecedentRequest(BaseModel):
    matter_description: str
    k: int = 5


class CaseIdRequest(BaseModel):
    case_id: int


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    password: str


app = FastAPI(title="AI-Powered Legal Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load a set of synthetic example cases into memory on startup
try:
    load_seed_cases()
except Exception as exc:
    # In a demo setting, we do not want seed loading failures to break the API
    print(f"Warning: failed to load seed cases: {exc}")


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/upload_case")
def upload_case(case: UploadCaseRequest):
    try:
        case_id = search_engine.add_case(
            title=case.title,
            text=case.text,
            meta={
                "jurisdiction": case.jurisdiction,
                "court": case.court,
                "year": case.year,
            },
        )
        summary = summarize_text(case.text)
        return {"case_id": case_id, "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/search")
def search(request: SearchRequest):
    try:
        results = search_engine.search(request.query, k=request.k)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/precedents")
def precedents(request: PrecedentRequest):
    try:
        search_results = search_engine.search(request.matter_description, k=request.k)
        suggestions = suggest_precedents(request.matter_description, search_results)
        return {"precedents": suggestions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/case_details")
def case_details(request: CaseIdRequest):
    try:
        case = search_engine.get_case_by_id(request.case_id)
        if not case:
            raise HTTPException(status_code=404, detail="Case not found")
        return {"case": case}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/login")
def login(request: LoginRequest):
    username = request.username.strip()
    password = request.password

    # Basic server-side validations
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required.")
    if len(username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters.")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    if not verify_user(username, password):
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    # For this project we do not issue real tokens; we just confirm success.
    return {"success": True, "username": username}


@app.get("/demo_users")
def demo_users():
    """
    Return the list of configured demo usernames.
    NOTE: Passwords are not exposed for security reasons.
    """
    return {"users": list_usernames()}


@app.post("/register")
def register(request: RegisterRequest):
    username = request.username.strip()
    password = request.password

    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required.")
    if len(username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters.")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    try:
        add_user(username, password)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return {"success": True, "username": username}

