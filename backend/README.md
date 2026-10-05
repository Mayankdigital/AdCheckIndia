# AdCheck India — Backend

FastAPI + ChromaDB + Gemini AI backend for Indian ad compliance checking.

## Stack
| Layer | Technology |
|---|---|
| Framework | FastAPI |
| Vector DB | ChromaDB (persistent) |
| AI Model | Gemini 1.5 Flash (Vision + Text) |
| Embeddings | Gemini text-embedding-004 |
| Python | 3.11+ |

## Setup

### 1. Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and set your GEMINI_API_KEY
```

### 3. Run the server
```bash
uvicorn main:app --reload --port 8000
```

The server will **automatically seed all rules into ChromaDB** on first startup.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `GET` | `/health` | DB status + rule count |
| `POST` | `/api/v1/analyze` | Analyze an ad |
| `GET` | `/api/v1/rules/` | List all rules |
| `POST` | `/api/v1/rules/seed` | Re-seed rules |
| `POST` | `/api/v1/rules/reset` | Reset + re-seed |
| `GET` | `/api/v1/rules/search?q=...` | Semantic rule search |
| `GET` | `/docs` | Interactive Swagger UI |

## How It Works (RAG Pipeline)

```
Ad Upload → Extract Caption/Image
        ↓
  Build Search Query
        ↓
  ChromaDB Semantic Search  ←── Rules Database (35+ ASCI/CCPA rules)
        ↓
  Retrieve Top-10 Relevant Rules
        ↓
  Build Prompt (Rules + Image + Caption)
        ↓
  Gemini 1.5 Flash Vision Analysis
        ↓
  Structured JSON Report
```

## Project Structure
```
backend/
├── main.py               # FastAPI app + startup
├── config.py             # Settings from .env
├── requirements.txt
├── .env.example
├── data/
│   └── rules_seed.py     # 35+ ASCI/CCPA rules
├── services/
│   ├── vector_db.py      # ChromaDB + Gemini embeddings
│   └── analyzer.py       # RAG + Gemini Vision pipeline
└── routes/
    ├── analysis.py       # POST /analyze
    └── rules.py          # Rules CRUD
```
