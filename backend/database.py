"""
CloudShift AI - FastAPI Backend
AI cloud migration and compliance readiness assistant
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from routers import auth, assessments, analysis, reports
from database import create_tables

app = FastAPI(
    title="CloudShift AI API",
    description="AI cloud migration and compliance readiness assistant",
    version="1.0.0"
)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(assessments.router, prefix="/api/assessments", tags=["Assessments"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])

os.makedirs(os.getenv("UPLOAD_DIR", "/app/uploads"), exist_ok=True)


@app.on_event("startup")
async def startup_event():
    await create_tables()
    print(f"CloudShift AI started!")
    print(f"Model: {os.getenv('OLLAMA_MODEL', 'qwen2.5:7b-instruct')}")


@app.get("/")
async def root():
    return {"app": "CloudShift AI", "version": "1.0.0", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
