# Evifacto AI — Production LangGraph & FastAPI Venture Intelligence Engine

An enterprise-grade **Agentic AI Market Intelligence & Startup Validation System** engineered with **Python**, **FastAPI**, **LangChain**, and **LangGraph**.

---

## 🏛️ System Architecture

```
[ React 19 Frontend ]
         │ (HTTP / Server-Sent Events)
         ▼
[ FastAPI High-Concurrency Microservice (`app/main.py`) ]
   ├── `GET /health`               ── Readiness & Liveness Probes
   ├── `POST /api/validate-start`  ── Handshake Session Initializer
   ├── `GET /api/validate-stream`  ── Real-time SSE Multi-Agent Stream
   ├── `POST /api/v1/validate`     ── Direct REST LangGraph Execution
   └── `GET|POST|DELETE /api/reports` ── Persistent JSON Storage
         │
         ▼
[ LangGraph StateGraph Orchestrator (`app/agents/orchestrator.py`) ]
         │
         ├───▶ [ Node 1: Retrieval ]
         │       Concurrently invokes 5 LangChain `@tool` Data Workers:
         │       • `search_reddit_pain_points`      (r/SaaS customer complaints)
         │       • `search_hacker_news_discussions` (YC feedback & story points)
         │       • `audit_github_tech_stack`        (Open-source stars & maturity)
         │       • `check_dns_domain_viability`     (Socket-level ICANN resolution)
         │       • `query_google_search_intent`     (Live Google autocomplete predictions)
         │
         ├───▶ [ Node 2: Guardrail ]
         │       Enforces strict Anti-Sycophancy filters against commodity utility traps
         │       (e.g., QR scanners, flashlights, weather SMS).
         │
         └───▶ [ Node 3: Synthesis ]
                 Synthesizes multi-source evidence using Gemini LLM with structured output,
                 enforcing strict Pydantic schemas (`ValidationReport`).
```

---

## 📁 Production Directory Structure

```
backend/
├── app/
│   ├── main.py                     # FastAPI app entry point, CORS & static mount
│   ├── config.py                   # Pydantic Settings (environment & API keys)
│   ├── api/
│   │   └── v1/
│   │       └── routes/
│   │           ├── health.py       # Health probe router
│   │           ├── validate.py     # SSE Streaming & REST validation routes
│   │           └── reports.py      # Saved report CRUD persistence routes
│   ├── agents/
│   │   ├── orchestrator.py         # LangGraph StateGraph workflow definition
│   │   ├── guardrails.py           # Anti-sycophancy commodity trap evaluator
│   │   └── tools/                  # Standard LangChain @tool implementations
│   │       ├── hackernews_tool.py  # Hacker News Algolia search tool
│   │       ├── reddit_tool.py      # Reddit customer pain miner
│   │       ├── github_tool.py      # GitHub ecosystem auditor
│   │       ├── dns_tool.py         # Socket DNS availability tool
│   │       └── google_intent_tool.py # Google search intent miner
│   ├── schemas/
│   │   ├── idea.py                 # StartupIdeaInput Pydantic model
│   │   └── report.py               # ValidationReport Pydantic schema
│   └── services/
│       └── report_service.py       # Report persistence service (JSON store)
├── tests/
│   ├── test_agent_harness.py       # Multi-turn evaluation benchmark harness
│   ├── test_tools.py               # Unit tests for LangChain tools
│   └── test_api.py                 # Integration tests for FastAPI endpoints
└── requirements.txt                # Production package dependencies
```

---

## 🧪 Testing & Evaluation Harness

Run the automated evaluation benchmark harness:

```bash
python backend/tests/test_agent_harness.py
```

### Benchmark Suite:
1. **Viable B2B SaaS Benchmark**: Validates that the agent triggers concurrent tools, extracts 20+ live market signals, and returns high viability (`GO`).
2. **Anti-Sycophancy Guardrail Trap**: Verifies that commodity utility ideas are strictly rejected (`NO_GO`, score $\le 35$) rather than receiving ungrounded praise.
3. **Pydantic Schema Integrity**: Enforces 100% schema compliance across scores, competitor analysis, customer interview scripts, and landing page copy.

---

## 🚀 Running the Services

### 1. Start the FastAPI Production Service:
```bash
python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```
* **Interactive Swagger UI**: `http://localhost:8000/docs`
* **Health Check Probe**: `http://localhost:8000/health`
* **Full Application**: `http://localhost:8000/` (serves compiled React UI)

### 2. Run the Full Test Suite:
```bash
python backend/tests/test_tools.py
python backend/tests/test_api.py
python backend/tests/test_agent_harness.py
```
