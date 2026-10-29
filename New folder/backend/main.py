"""
Internship Academy — Admin Panel API

Run from the backend directory:
    uvicorn main:app --reload --port 8000

The API lives under /api/* and the frontend is served from / .
"""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from admin.router import router as admin_router
from roles.router import router as roles_router
from system_settings.router import router as settings_router
from dashboard.router import router as dashboard_router
from config.seed import seed_database
from utils.response import error_response, validation_error_response

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"


@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_database()
    yield


app = FastAPI(
    title="Internship Academy API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================
# Consistent error envelopes
# ==========================

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(str(exc.detail)),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [
        {
            "field": ".".join(str(part) for part in err["loc"][1:]),
            "message": err["msg"],
        }
        for err in exc.errors()
    ]
    return JSONResponse(
        status_code=422,
        content=validation_error_response(errors),
    )


# ==========================
# API routes
# ==========================

app.include_router(admin_router, prefix="/api")
app.include_router(roles_router, prefix="/api")
app.include_router(settings_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")


# ==========================
# Frontend (static files)
# ==========================

if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")


def _pick_port(preferred: int) -> int:
    """Use the preferred port when free, otherwise ask the OS for one."""
    import socket

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        if sock.connect_ex(("127.0.0.1", preferred)) != 0:
            return preferred

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


if __name__ == "__main__":
    import os
    import threading
    import webbrowser

    import uvicorn

    port = int(os.getenv("PORT", "0")) or _pick_port(8000)
    url = f"http://localhost:{port}"

    print("=" * 52)
    print("  Internship Academy Admin Panel")
    print(f"  App:      {url}")
    print(f"  API docs: {url}/docs")
    print("=" * 52)

    if not os.getenv("PORT"):
        threading.Timer(1.2, webbrowser.open, args=[url]).start()

    uvicorn.run(app, host="127.0.0.1", port=port)
