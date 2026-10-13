import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.api.v1.routes.health import router as health_router
from app.api.v1.routes.reports import router as reports_router
from app.api.v1.routes.validate import router as validate_router
from app.api.v1.routes.tools import router as tools_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade AI Venture Validation & Market Intelligence Engine powered by LangGraph, FastMCP, and FastAPI",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware for modern SPA clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Health check routes
app.include_router(health_router, prefix="", tags=["Health"])
app.include_router(health_router, prefix=settings.API_V1_STR, tags=["Health"])

# 2. FastMCP Tool Registry routes
app.include_router(tools_router, prefix="/api", tags=["MCP Tools"])
app.include_router(tools_router, prefix=settings.API_V1_STR, tags=["MCP Tools"])

# 3. Validation & SSE Streaming routes (LangGraph state engine)
app.include_router(validate_router, prefix="/api", tags=["Validation"])
app.include_router(validate_router, prefix=settings.API_V1_STR, tags=["Validation"])

# 4. Report Persistence routes
app.include_router(reports_router, prefix="/api", tags=["Reports"])
app.include_router(reports_router, prefix=settings.API_V1_STR, tags=["Reports"])

# 5. Mount React frontend (dist/) if compiled
dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "dist"))
if os.path.exists(dist_dir) and os.path.exists(os.path.join(dist_dir, "index.html")):
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="static")
else:
    @app.get("/")
    async def root():
        return {
            "message": "Welcome to Evifacto AI Backend",
            "docs": "/docs",
            "health": "/health",
            "version": settings.VERSION
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
