import asyncio
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException
from app.mcp_server import mcp

router = APIRouter(tags=["MCP Tools"])


@router.get("/tools")
async def list_mcp_tools() -> Dict[str, Any]:
    """
    List all standardized tools registered in the FastMCP Market Intelligence Server.
    """
    tools = await mcp.list_tools() if asyncio.iscoroutinefunction(mcp.list_tools) else mcp.list_tools()
    return {
        "mcp_server": mcp.name,
        "protocol": "Model Context Protocol (MCP)",
        "tool_count": len(tools),
        "tools": [
            {
                "name": t.name,
                "description": t.description
            }
            for t in tools
        ]
    }


@router.post("/tools/{tool_name}/call")
async def call_mcp_tool(tool_name: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Directly invoke a registered tool from the FastMCP Tool Server.
    """
    tools = await mcp.list_tools() if asyncio.iscoroutinefunction(mcp.list_tools) else mcp.list_tools()
    tool_names = [t.name for t in tools]

    if tool_name not in tool_names:
        raise HTTPException(status_code=404, detail=f"Tool '{tool_name}' not found on FastMCP server.")

    try:
        result = await mcp.call_tool(tool_name, payload)
        return {
            "status": "success",
            "tool": tool_name,
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MCP Tool execution failed: {str(e)}")
