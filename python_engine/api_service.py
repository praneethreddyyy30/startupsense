"""
Evifacto FastAPI Microservice
==============================
Exposes FastMCP tool server capabilities and Agentic Validation endpoints.
Built for high-concurrency production agent workflows.
"""

from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List

from python_engine.agent_orchestrator import (
    IdeaInput,
    ValidationReport,
    AgenticValidationEngine
)
from python_engine.mcp_server import (
    search_reddit_pain_points,
    search_hacker_news_discussions,
    audit_github_tech_stack,
    check_dns_domain_viability,
    query_google_search_intent
)

app = FastAPI(
    title="Evifacto Agentic AI Engine",
    description="Production FastMCP & FastAPI Agentic RAG Service for Venture Intelligence",
    version="2.0.0"
)

# Enable CORS for cross-origin frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = AgenticValidationEngine()


@app.get("/health")
async def health_check():
    """Service health and readiness probe."""
    return {
        "status": "healthy",
        "service": "Evifacto FastMCP & FastAPI Engine",
        "mcp_tools_registered": 5
    }


@app.get("/api/v1/tools")
async def list_mcp_tools():
    """
    List all active FastMCP tools available to autonomous agents.
    """
    return {
        "tools": [
            {
                "name": "search_reddit_pain_points",
                "description": "Scrapes community pain points and customer complaints across subreddits.",
                "parameters": {"keyword": "str", "subreddits": "list[str]"}
            },
            {
                "name": "search_hacker_news_discussions",
                "description": "Queries Algolia HN search for developer discussions and YC stories.",
                "parameters": {"keyword": "str", "max_hits": "int"}
            },
            {
                "name": "audit_github_tech_stack",
                "description": "Audits GitHub repositories, stargazers, and open-source maturity.",
                "parameters": {"tech_query": "str"}
            },
            {
                "name": "check_dns_domain_viability",
                "description": "Performs socket-level domain resolution on .com, .io, and .ai.",
                "parameters": {"domain_name": "str"}
            },
            {
                "name": "query_google_search_intent",
                "description": "Fetches live Google Autocomplete search queries.",
                "parameters": {"query": "str"}
            }
        ]
    }


@app.post("/api/v1/tools/call")
async def execute_mcp_tool(tool_name: str, arguments: Dict[str, Any] = Body(...)):
    """
    Directly execute an MCP tool dynamically by name.
    """
    if tool_name == "search_reddit_pain_points":
        return await search_reddit_pain_points(arguments.get("keyword", "saas"))
    elif tool_name == "search_hacker_news_discussions":
        return await search_hacker_news_discussions(arguments.get("keyword", "saas"))
    elif tool_name == "audit_github_tech_stack":
        return await audit_github_tech_stack(arguments.get("tech_query", "web"))
    elif tool_name == "check_dns_domain_viability":
        return await check_dns_domain_viability(arguments.get("domain_name", "test"))
    elif tool_name == "query_google_search_intent":
        return await query_google_search_intent(arguments.get("query", "test"))
    else:
        raise HTTPException(status_code=404, detail=f"Tool '{tool_name}' not found in FastMCP registry.")


@app.post("/api/v1/validate", response_model=ValidationReport)
async def validate_startup_idea(idea: IdeaInput):
    """
    End-to-end Agentic Validation:
    Invokes FastMCP tools, aggregates market evidence, applies anti-sycophancy guardrails,
    and returns a structured Pydantic ValidationReport.
    """
    return await engine.validate_idea(idea)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("python_engine.api_service:app", host="0.0.0.0", port=8000, reload=True)
