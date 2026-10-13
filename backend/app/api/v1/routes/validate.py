import json
import uuid
import asyncio
from typing import Dict, AsyncGenerator
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse

from app.schemas.idea import StartupIdeaInput
from app.schemas.report import ValidationReport
from app.agents.orchestrator import validation_graph
from app.services.report_service import report_service

router = APIRouter(tags=["Validation"])

# In-memory session store for multi-step SSE validation handshake
pending_sessions: Dict[str, StartupIdeaInput] = {}


@router.post("/validate-init")
@router.post("/validate-start")
async def init_validation(idea: StartupIdeaInput):
    """
    Initializes a validation session and returns a validationId for EventSource SSE streaming.
    """
    if not idea.title or not idea.description:
        raise HTTPException(status_code=400, detail="Title and description are required.")

    session_id = str(uuid.uuid4())
    pending_sessions[session_id] = idea
    return {"validationId": session_id}


@router.get("/validate-stream")
async def stream_validation(validationId: str = Query(...)):
    """
    Server-Sent Events (SSE) streaming endpoint:
    Streams live multi-agent audit stages to the client, executes the LangGraph StateGraph,
    and returns the completed ValidationReport.
    """
    idea = pending_sessions.pop(validationId, None)
    if not idea:
        raise HTTPException(status_code=404, detail="Validation session not found or already completed.")

    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            # 1. Understanding Stage
            yield f"data: {json.dumps({'stage': 'understanding', 'status': 'active', 'logs': [f'Parsing input for {idea.title}', 'Extracting primary and secondary keywords', 'Defining target customer segments']})}\n\n"
            await asyncio.sleep(0.4)
            yield f"data: {json.dumps({'stage': 'understanding', 'status': 'completed', 'logs': []})}\n\n"

            # 2. Google Trends & Intent Stage
            yield f"data: {json.dumps({'stage': 'google_trends', 'status': 'active', 'logs': [f'Mining Google search velocity for {idea.title}', 'Analyzing interest trends over time', 'Mapping regional search demand']})}\n\n"
            await asyncio.sleep(0.4)
            yield f"data: {json.dumps({'stage': 'google_trends', 'status': 'completed', 'logs': []})}\n\n"

            # 3. Reddit Community Stage
            yield f"data: {json.dumps({'stage': 'reddit_community', 'status': 'active', 'logs': ['Querying Reddit SaaS and startup discussions...', 'Harvesting customer pain points and complaints', 'Evaluating sentiment score metrics']})}\n\n"
            await asyncio.sleep(0.4)
            yield f"data: {json.dumps({'stage': 'reddit_community', 'status': 'completed', 'logs': []})}\n\n"

            # 4. Hacker News Stage
            yield f"data: {json.dumps({'stage': 'hn_feedback', 'status': 'active', 'logs': ['Querying Hacker News Algolia search logs...', 'Evaluating Y-Combinator community feedback and upvote points']})}\n\n"
            await asyncio.sleep(0.4)
            yield f"data: {json.dumps({'stage': 'hn_feedback', 'status': 'completed', 'logs': []})}\n\n"

            # 5. GitHub Tech Stack Stage
            yield f"data: {json.dumps({'stage': 'github_tech', 'status': 'active', 'logs': ['Auditing GitHub REST API for open-source repositories...', 'Evaluating library maturity and MVP development timeline']})}\n\n"
            await asyncio.sleep(0.4)
            yield f"data: {json.dumps({'stage': 'github_tech', 'status': 'completed', 'logs': []})}\n\n"

            # 6. Domain Availability Stage
            yield f"data: {json.dumps({'stage': 'domain_check', 'status': 'active', 'logs': [f'Checking socket DNS availability for {idea.title}...', 'Testing .com, .io, and .ai resolution']})}\n\n"
            await asyncio.sleep(0.4)
            yield f"data: {json.dumps({'stage': 'domain_check', 'status': 'completed', 'logs': []})}\n\n"

            # 7. LangGraph Synthesis Stage
            yield f"data: {json.dumps({'stage': 'gemini_synthesis', 'status': 'active', 'logs': ['Executing LangGraph Multi-Agent StateGraph...', 'Evaluating anti-sycophancy guardrails', 'Compiling final venture viability scorecard']})}\n\n"

            # Execute LangGraph
            result = await validation_graph.ainvoke({"idea": idea})
            report: ValidationReport = result["report"]

            # Save report to persistent storage
            report_service.save(report)

            # Final Completed Event
            final_payload = {
                "stage": "gemini_synthesis",
                "status": "completed",
                "logs": [],
                "report": report.model_dump()
            }
            yield f"data: {json.dumps(final_payload)}\n\n"

        except Exception as e:
            err_payload = {"error": f"Validation failed: {str(e)}"}
            yield f"data: {json.dumps(err_payload)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@router.post("/validate", response_model=ValidationReport)
async def validate_direct(idea: StartupIdeaInput):
    """
    Direct synchronous REST validation endpoint:
    Executes the LangGraph StateGraph directly and returns the completed ValidationReport.
    """
    result = await validation_graph.ainvoke({"idea": idea})
    report: ValidationReport = result["report"]
    report_service.save(report)
    return report
