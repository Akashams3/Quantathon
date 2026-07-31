import os
import sys
import argparse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Add paths to sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(BACKEND_DIR, ".."))

for path in [BACKEND_DIR, PROJECT_ROOT]:
    if path not in sys.path:
        sys.path.insert(0, path)

from app.config.database import engine, Base
import app.models  # Register all ORM models
from app.routers import upload, analysis, mutation, quantum
from app.routers import demo

# Auto-create MySQL tables on app initialization
Base.metadata.create_all(bind=engine)

# Initialize FastAPI App
backend_app = FastAPI(
    title="Quantum DNA-X: Phase 1-4 Full Stack API (Qiskit + AI + MySQL)",
    description="FastAPI Backend integrated with MySQL DB, Phase 1 DNA Engine, Phase 3 AI Mutation Detector, and Phase 4 IBM Qiskit Quantum Simulator.",
    version="4.0.0"
)
app = backend_app

# Enable CORS for React Frontend
backend_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for generated charts and report files
REPORTS_DIR = os.path.join(BACKEND_DIR, "reports")
CHARTS_DIR = os.path.join(REPORTS_DIR, "charts")
os.makedirs(CHARTS_DIR, exist_ok=True)

backend_app.mount("/static/charts", StaticFiles(directory=CHARTS_DIR), name="charts")
backend_app.mount("/static/reports", StaticFiles(directory=REPORTS_DIR), name="reports")

# Include Routers
backend_app.include_router(upload.router)
backend_app.include_router(analysis.router)
backend_app.include_router(mutation.router)
backend_app.include_router(quantum.router)
backend_app.include_router(demo.router)


@backend_app.get("/")
def root():
    return {
        "project": "Quantum DNA-X",
        "phase": 2,
        "description": "Backend Development API (MySQL + FastAPI)",
        "database": str(engine.url),
        "status": "Online",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }


@backend_app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "phase": 2,
        "database_connected": True
    }


if __name__ == "__main__":
    import uvicorn
    parser = argparse.ArgumentParser(description="Quantum DNA-X Phase 2 FastAPI Backend Server")
    parser.add_argument("--port", type=int, default=8000, help="Port to run backend server on (default: 8000)")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Host address (default: 127.0.0.1)")

    args = parser.parse_args()

    print(f"[SERVER] Starting Phase 2 FastAPI Backend on http://{args.host}:{args.port}...")
    uvicorn.run("app.main:app", host=args.host, port=args.port, reload=True)
