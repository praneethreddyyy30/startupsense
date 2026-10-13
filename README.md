# 🏛️ Evifacto AI — Multi-Agent RAG Market Intelligence Engine

[![Python 3.12+](https://img.shields.io/badge/Python-3.12%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-orange.svg)](https://github.com/langchain-ai/langgraph)
[![FastMCP](https://img.shields.io/badge/FastMCP-Model_Context_Protocol-purple.svg)](https://github.com/jlowin/fastmcp)
[![Pydantic v2](https://img.shields.io/badge/Pydantic-v2.8%2B-red.svg)](https://docs.pydantic.dev/)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Evifacto AI** is an enterprise-grade **Agentic AI Market Intelligence & Venture Validation Engine**. Rather than relying on ungrounded LLM guesses and hallucinated metrics, Evifacto orchestrates a **LangGraph StateGraph** that consumes 5 standardized **FastMCP (Model Context Protocol)** tools to harvest real-time market evidence across Reddit, Hacker News, GitHub, ICANN DNS, and Google Autocomplete search intent.

---

## 🏛️ System Architecture

```
                       ┌────────────────────────────────────────┐
                       │          FastMCP Tool Server           │
                       │        (`backend/app/mcp_server.py`)   │
                       │                                        │
                       │   • search_reddit_pain_points          │
                       │   • search_hacker_news_discussions     │
                       │   • audit_github_tech_stack            │
                       │   • check_dns_domain_viability         │
                       │   • query_google_search_intent         │
                       └──────────────────┬─────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
       [ LangGraph Orchestrator ]                       [ FastAPI Microservice ]
    (`app/agents/orchestrator.py`)                           (`app/main.py`)
  Retrieval ➔ Guardrail ➔ Synthesis                 SSE Streaming & MCP Tool API
                  │                                               │
                  └───────────────────────┬───────────────────────┘
                                          ▼
                            [ React 19 Client UI ]
```

---

## 💎 Core Architectural Highlights

| Layer | Technology | Engineering Purpose |
| :--- | :--- | :--- |
| **Agentic Tooling** | **FastMCP (Model Context Protocol)** | Standardizes 5 data harvesters into an open MCP server; any MCP client (Claude Desktop, Cursor, LangGraph) can connect. |
| **Orchestration** | **LangGraph StateGraph** | Multi-node deterministic state machine coordinating `Retrieval ➔ Anti-Sycophancy Guardrail ➔ Gemini Synthesis`. |
| **API Backend** | **FastAPI + Uvicorn** | High-concurrency async web service with Server-Sent Events (SSE) streaming live audit steps to the client. |
| **Data Contracts** | **Pydantic v2 + AliasChoices** | Strict contract validation; seamlessly maps between React `camelCase` and Python `snake_case`. |
| **LLM Synthesis** | **Gemini 2.5 Flash** | Evidence-grounded synthesis with structured output generating Mom-Test interview scripts, go-to-market copy, and scorecards. |
| **Frontend** | **React 19 + TypeScript + Vite** | Premium analytical dashboard featuring radar scorecards and real-time validation log visualizers. |

---

## 🛡️ Anti-Sycophancy Guardrail Engine

Standard LLMs suffer from **sycophancy**—they tend to act as "yes-men", blindly praising unviable startup ideas (e.g., paid flashlight apps, QR code scanners). 

Evifacto enforces a dedicated **Guardrail Node** in the LangGraph workflow:
* Pre-filters commodity utility traps with zero market defensibility.
* Automatically forces an evidence-grounded rejection (`NO_GO`, score $\le 35$) without wasting LLM tokens.
* Explains the structural barrier (e.g., native iOS/Android features, zero recurring willingness to pay).

---

## 🧪 Automated Multi-Turn Evaluation Harness

Evifacto includes a production benchmark suite (`backend/tests/test_agent_harness.py`) that grades the agent against archetypes before deployment:

```bash
python backend/tests/test_agent_harness.py
```

### Benchmark Results:
```text
======================================================================
[*] EVIFACTO MULTI-TURN AGENT EVALUATION & TEST HARNESS
======================================================================
[TEST 1/3] Benchmarking Viable B2B SaaS Concept (DentalDesk AI)...
  * Title: DentalDesk AI
  * Recommendation: GO (Validation Score: 82/100)
  * Audit Agents Logged: 6
  [PASS] TEST 1: High-demand venture correctly scored with live signals.

[TEST 2/3] Benchmarking Anti-Sycophancy Guardrail (Commodity Trap)...
  * Title: QuickScan Pro (QR Scanner)
  * Recommendation: NO_GO (Validation Score: 24/100, Threshold <= 35)
  * Anti-Sycophancy Triggered: YES
  [PASS] TEST 2: Anti-sycophancy guardrail rejected commodity trap.

[TEST 3/3] Validating Pydantic Schema Contracts & Score Ranges...
  [PASS] TEST 3: 100% Pydantic data schema integrity verified.

======================================================================
[*] EVALUATION BENCHMARK SUMMARY
======================================================================
  * Total Tests Executed: 3
  * Passed: 3 / 3 (100.0%)
  * Anti-Sycophancy Guardrail Accuracy: 100%
  * Schema Compliance: 100%
======================================================================
[SUCCESS] ALL AGENT EVALUATION HARNESS TESTS PASSED SUCCESSFULLY!
```

---

## 📁 Repository Structure

```
startupsense/
├── backend/                              # Production Python Backend
│   ├── app/
│   │   ├── main.py                       # FastAPI entry point, CORS, static mount
│   │   ├── config.py                     # Pydantic Settings (ENV, API keys)
│   │   ├── mcp_server.py                 # FastMCP Tool Server (5 MCP tools)
│   │   ├── api/v1/routes/
│   │   │   ├── health.py                 # /health readiness probes
│   │   │   ├── tools.py                  # /api/v1/tools FastMCP registry & runner
│   │   │   ├── validate.py               # SSE live streaming & REST validation
│   │   │   └── reports.py                # Saved reports CRUD persistence
│   │   ├── agents/
│   │   │   ├── orchestrator.py           # LangGraph StateGraph workflow definition
│   │   │   ├── guardrails.py             # Anti-sycophancy commodity trap evaluator
│   │   │   └── tools/                    # Tool implementations
│   │   ├── schemas/
│   │   │   ├── idea.py                   # StartupIdeaInput schema
│   │   │   └── report.py                 # ValidationReport schema (Pydantic v2)
│   │   └── services/
│   │       └── report_service.py         # Thread-safe JSON persistence
│   ├── tests/
│   │   ├── test_agent_harness.py         # Multi-turn evaluation benchmark harness
│   │   ├── test_tools.py                 # LangChain/FastMCP tools unit tests
│   │   └── test_api.py                   # FastAPI HTTP & SSE integration tests
│   └── requirements.txt                  # Python dependencies
│
├── src/                                  # React 19 Frontend
│   ├── App.tsx                           # Main validation workspace & tabs
│   ├── components/                       # Dashboard, Scorecard, Pain Points
│   └── types.ts                          # TypeScript types matching Pydantic
├── vite.config.ts                        # Vite bundler with FastAPI proxy
└── package.json                          # Frontend dependencies
```

---

## 🚀 Quickstart & Running Locally

### 1. Prerequisites
* **Python 3.12+**
* **Node.js 18+**
* **Google Gemini API Key** ([Get free key from Google AI Studio](https://aistudio.google.com/))

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
```

### 3. Install Backend Dependencies
```bash
python -m pip install -r backend/requirements.txt
```

### 4. Run the Python FastAPI Backend
```bash
python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```
* **Swagger Interactive Docs**: `http://localhost:8000/docs`
* **Health Check**: `http://localhost:8000/health`
* **FastMCP Tool Registry**: `http://localhost:8000/api/v1/tools`

### 5. Run the React Frontend (Dev Server)
In a separate terminal:
```bash
npm install
npm run dev
```
Open `http://localhost:5173` (or port shown by Vite) to access the interactive dashboard.

### 6. Run the Test Suites
```bash
python backend/tests/test_tools.py
python backend/tests/test_api.py
python backend/tests/test_agent_harness.py
```

---

## 🛡️ License
MIT License. Built with passion for robust, fact-grounded Agentic AI systems.
