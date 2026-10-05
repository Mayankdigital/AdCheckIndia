"""
AdCheck India - FastAPI Backend Entry Point
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from services.vector_db import get_vector_db
from data.rules_seed import RULES
from routes.analysis import router as analysis_router
from routes.rules import router as rules_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)s  %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Auto-seed ChromaDB on startup if it is empty."""
    logger.info("Starting AdCheck India backend...")
    db = get_vector_db()
    if db.get_rule_count() == 0:
        logger.info("ChromaDB is empty — seeding rules...")
        ingested = db.ingest_rules(RULES)
        logger.info(f"Seeded {ingested} rules into ChromaDB.")
    else:
        logger.info(f"ChromaDB already has {db.get_rule_count()} rules. Skipping seed.")
    yield
    logger.info("Shutting down AdCheck India backend.")


app = FastAPI(
    title="AdCheck India API",
    description="AI-powered ad compliance checking for Indian regulations (ASCI, CCPA, FSSAI, SEBI, RERA).",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(analysis_router)
app.include_router(rules_router)


@app.get("/")
def root():
    return {
        "name": "AdCheck India API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    db = get_vector_db()
    return {
        "status": "ok",
        "chroma_rules_count": db.get_rule_count(),
    }
