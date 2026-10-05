"""
ChromaDB Vector Database Service
Uses sentence-transformers for local embeddings (no API key needed).
"""
import chromadb
from chromadb import EmbeddingFunction, Documents, Embeddings
from sentence_transformers import SentenceTransformer
from config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()


class LocalEmbeddingFunction(EmbeddingFunction):
    """
    Local embedding function using sentence-transformers.
    Model: all-MiniLM-L6-v2 — small, fast, good quality.
    Downloads once (~80MB), then runs fully offline.
    """

    def __init__(self):
        logger.info("Loading sentence-transformer model (downloads once if not cached)...")
        self._model = SentenceTransformer("all-MiniLM-L6-v2")
        logger.info("Embedding model loaded.")

    def __call__(self, input: Documents) -> Embeddings:
        embeddings = self._model.encode(list(input), normalize_embeddings=True)
        return embeddings.tolist()


class VectorDB:
    """
    Singleton ChromaDB client.
    Collection: adcheck_rules — stores all regulatory rules.
    """

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True

        self.client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
        self.embed_fn = LocalEmbeddingFunction()

        self.rules_collection = self.client.get_or_create_collection(
            name="adcheck_rules",
            embedding_function=self.embed_fn,
            metadata={"hnsw:space": "cosine"},
        )
        logger.info(
            f"ChromaDB ready. Rules in DB: {self.rules_collection.count()}"
        )

    # ─── Ingestion ─────────────────────────────────────────────────────────

    def ingest_rules(self, rules: list[dict]) -> int:
        """Add rules to ChromaDB, skipping ones that already exist."""
        existing_ids = set(self.rules_collection.get()["ids"])
        new_rules = [r for r in rules if r["id"] not in existing_ids]

        if not new_rules:
            logger.info("All rules already in ChromaDB. Skipping ingest.")
            return 0

        documents, metadatas, ids = [], [], []

        for rule in new_rules:
            # Build a rich searchable document
            doc = (
                f"Rule ID: {rule['id']}\n"
                f"Title: {rule['title']}\n"
                f"Category: {rule['category']}\n"
                f"Description: {rule['body']}\n"
                f"Keywords: {', '.join(rule.get('keywords', []))}"
            )
            documents.append(doc)
            metadatas.append({
                "rule_id":  rule["id"],
                "title":    rule["title"],
                "category": rule["category"],
                "severity": rule.get("severity", "medium"),
                "body":     rule["body"],
                "keywords": ", ".join(rule.get("keywords", [])),
            })
            ids.append(rule["id"])

        self.rules_collection.add(documents=documents, metadatas=metadatas, ids=ids)
        logger.info(f"Ingested {len(new_rules)} new rules into ChromaDB.")
        return len(new_rules)

    # ─── Search ────────────────────────────────────────────────────────────

    def search_relevant_rules(
        self,
        query: str,
        category: str = None,
        n_results: int = 10,
    ) -> list[dict]:
        """
        Semantic search: given extracted claims/text, find the most relevant rules.
        Optionally filter by category + always include general/influencer rules.
        """
        total = self.rules_collection.count()
        if total == 0:
            return []

        where_filter = None
        if category and category not in ("other", "general"):
            where_filter = {
                "$or": [
                    {"category": {"$eq": category}},
                    {"category": {"$eq": "general"}},
                    {"category": {"$eq": "influencer"}},
                ]
            }

        results = self.rules_collection.query(
            query_texts=[query],
            n_results=min(n_results, total),
            where=where_filter,
            include=["documents", "metadatas", "distances"],
        )

        rules = []
        if results and results["ids"] and results["ids"][0]:
            for i, rule_id in enumerate(results["ids"][0]):
                meta = results["metadatas"][0][i]
                distance = results["distances"][0][i]
                rules.append({
                    "rule_id":        rule_id,
                    "title":          meta.get("title", ""),
                    "category":       meta.get("category", ""),
                    "severity":       meta.get("severity", "medium"),
                    "body":           meta.get("body", ""),
                    "keywords":       meta.get("keywords", ""),
                    "relevance_score": round(1 - distance, 4),
                })

        return sorted(rules, key=lambda x: x["relevance_score"], reverse=True)

    # ─── Utility ───────────────────────────────────────────────────────────

    def get_all_rules(self) -> list[dict]:
        result = self.rules_collection.get(include=["metadatas"])
        return [
            {
                "rule_id":  result["ids"][i],
                "title":    result["metadatas"][i].get("title", ""),
                "category": result["metadatas"][i].get("category", ""),
                "severity": result["metadatas"][i].get("severity", "medium"),
            }
            for i in range(len(result["ids"]))
        ]

    def get_rule_count(self) -> int:
        return self.rules_collection.count()

    def reset_rules(self):
        self.client.delete_collection("adcheck_rules")
        self.rules_collection = self.client.get_or_create_collection(
            name="adcheck_rules",
            embedding_function=self.embed_fn,
            metadata={"hnsw:space": "cosine"},
        )
        logger.warning("Rules collection reset.")


def get_vector_db() -> VectorDB:
    return VectorDB()
