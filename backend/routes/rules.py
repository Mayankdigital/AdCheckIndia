"""
API Routes - Rules Management Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from services.vector_db import get_vector_db, VectorDB

router = APIRouter(prefix="/api/v1/rules", tags=["rules"])


@router.get("/")
def list_rules(db: VectorDB = Depends(get_vector_db)):
    """List all rules stored in ChromaDB."""
    return {"rules": db.get_all_rules(), "total": db.get_rule_count()}


@router.post("/seed")
def seed_rules(db: VectorDB = Depends(get_vector_db)):
    """
    Ingest all rules from the seed file into ChromaDB.
    Skips rules that already exist. Safe to call multiple times.
    """
    from data.rules_seed import RULES
    count = db.ingest_rules(RULES)
    return {
        "message": f"Seeded {count} new rules.",
        "total_in_db": db.get_rule_count(),
    }


@router.post("/reset")
def reset_rules(db: VectorDB = Depends(get_vector_db)):
    """
    ⚠️ DANGER: Delete all rules and re-seed from scratch.
    Use only for development / data refresh.
    """
    from data.rules_seed import RULES
    db.reset_rules()
    count = db.ingest_rules(RULES)
    return {
        "message": f"Rules reset and re-seeded with {count} rules.",
        "total_in_db": db.get_rule_count(),
    }


@router.get("/search")
def search_rules(q: str, category: str = None, db: VectorDB = Depends(get_vector_db)):
    """
    Semantic search across rules.
    Useful for debugging what rules would be retrieved for a given query.
    """
    if not q:
        raise HTTPException(status_code=422, detail="Query 'q' is required.")
    results = db.search_relevant_rules(query=q, category=category, n_results=5)
    return {"query": q, "category": category, "results": results}
