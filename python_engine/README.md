# Evifacto AI — Agentic FastMCP & FastAPI Engine

An enterprise-grade **Agentic AI Market Intelligence System** built with **Python**, **FastAPI**, and Anthropic's **FastMCP** (Model Context Protocol).

---

## 🏛️ Architecture Overview

```
[ User / Client ]
       │
       ▼
[ FastAPI Microservice (`api_service.py`) ]
       │
       ▼
[ Agentic Orchestrator (`agent_orchestrator.py`) ] ── (Pydantic Schema & Anti-Sycophancy Guardrails)
       │
       ▼
[ FastMCP Tool Server (`mcp_server.py`) ]
   ├── 🛠️ `search_reddit_pain_points`      (Community complaints & sentiment)
   ├── 🛠️ `search_hacker_news_discussions` (YC feedback & upvoted discussions)
   ├── 🛠️ `audit_github_tech_stack`        (Open-source stars & ecosystem readiness)
   ├── 🛠️ `check_dns_domain_viability`     (Socket-level ICANN domain resolution)
   └── 🛠️ `query_google_search_intent`     (Live Google search predictions)
```

---

## 📁 Component Directory

| File | Purpose |
| :--- | :--- |
| `mcp_server.py` | Exposes 5 standardized FastMCP `@mcp.tool()` endpoints for autonomous agent discovery. |
| `agent_orchestrator.py` | Multi-agent execution loop with Pydantic structured output models and anti-sycophancy rules. |
| `api_service.py` | High-concurrency FastAPI microservice with CORS, `/health`, `/tools`, and `/validate` routes. |
| `test_eval_harness.py` | Multi-turn testing & evaluation harness grading agent accuracy before production deployment. |
| `requirements.txt` | Python package dependencies (`fastmcp`, `fastapi`, `mcp`, `pydantic`, `httpx`). |

---

## 🧪 Testing & Evaluation Harness

The project includes an automated evaluation harness (`test_eval_harness.py`) designed to test agent reliability, guardrails, and latency:

```bash
python python_engine/test_eval_harness.py
```

### Benchmark Suite Tested:
1. **Viable B2B SaaS Benchmark**: Ensures the agent invokes $\ge 4$ FastMCP tools and produces a grounded, high-confidence score.
2. **Anti-Sycophancy Guardrail Trap**: Tests commodity ideas (e.g. $4.99/mo QR code scanner) to prove the agent strictly flags them as `NO_GO` ($\le 35/100$) rather than giving false praise.
3. **Pydantic Data Contract Compliance**: Validates 100% schema integrity across all score ranges and output fields.

---

## 🚀 Running the FastAPI Service

To launch the FastAPI server locally:

```bash
python python_engine/api_service.py
```

* **Swagger API Docs**: `http://localhost:8000/docs`
* **Health Check**: `http://localhost:8000/health`
* **Tool Registry**: `http://localhost:8000/api/v1/tools`
