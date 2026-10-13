"""
Unit Tests for LangChain Multi-Source Data Tools
"""

import sys
import os
import asyncio

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from langchain_core.tools import BaseTool
from app.agents.tools import (
    search_hacker_news_discussions,
    search_reddit_pain_points,
    audit_github_tech_stack,
    check_dns_domain_viability,
    query_google_search_intent
)


async def run_tool_tests():
    print("Testing LangChain Tools Unit Suite...\n")

    # Hacker News
    assert isinstance(search_hacker_news_discussions, BaseTool)
    hn_res = await search_hacker_news_discussions.ainvoke({"keyword": "saas", "max_hits": 2})
    assert len(hn_res) >= 1
    print("[PASS] Hacker News Tool: returned", len(hn_res), "items.")

    # Reddit
    assert isinstance(search_reddit_pain_points, BaseTool)
    reddit_res = await search_reddit_pain_points.ainvoke({"keyword": "churn"})
    assert len(reddit_res) >= 1
    print("[PASS] Reddit Tool: returned", len(reddit_res), "items.")

    # GitHub
    assert isinstance(audit_github_tech_stack, BaseTool)
    gh_res = await audit_github_tech_stack.ainvoke({"tech_query": "fastapi"})
    assert len(gh_res) >= 1
    print("[PASS] GitHub Tool: returned", len(gh_res), "items.")

    # DNS
    assert isinstance(check_dns_domain_viability, BaseTool)
    dns_res = check_dns_domain_viability.invoke({"domain_name": "evifacto"})
    assert "domain_tested" in dns_res
    print("[PASS] DNS Tool: returned", dns_res["tld_status"])

    # Google Intent
    assert isinstance(query_google_search_intent, BaseTool)
    intent_res = await query_google_search_intent.ainvoke({"query": "startup"})
    assert len(intent_res) >= 1
    print("[PASS] Google Intent Tool: returned", len(intent_res), "items.")

    print("\n[SUCCESS] All 5 LangChain Tools Passed Unit Testing!")


if __name__ == "__main__":
    asyncio.run(run_tool_tests())
