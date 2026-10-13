from .hackernews_tool import search_hacker_news_discussions
from .reddit_tool import search_reddit_pain_points
from .github_tool import audit_github_tech_stack
from .dns_tool import check_dns_domain_viability
from .google_intent_tool import query_google_search_intent

ALL_TOOLS = [
    search_hacker_news_discussions,
    search_reddit_pain_points,
    audit_github_tech_stack,
    check_dns_domain_viability,
    query_google_search_intent
]

__all__ = [
    "search_hacker_news_discussions",
    "search_reddit_pain_points",
    "audit_github_tech_stack",
    "check_dns_domain_viability",
    "query_google_search_intent",
    "ALL_TOOLS"
]
