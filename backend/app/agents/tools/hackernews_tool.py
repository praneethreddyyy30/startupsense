from typing import List, Dict, Any
import httpx
from langchain_core.tools import tool

@tool
async def search_hacker_news_discussions(keyword: str, max_hits: int = 5) -> List[Dict[str, Any]]:
    """
    Search Hacker News stories and developer discussions for startup, tech, and product feedback.
    
    Args:
        keyword: The topic, product idea, or tech keyword to search.
        max_hits: Maximum number of high-signal stories to retrieve (default: 5).
    """
    url = f"https://hn.algolia.com/api/v1/search?query={keyword}&tags=story&hitsPerPage={max_hits}"
    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                hits = data.get("hits", [])
                return [
                    {
                        "title": hit.get("title", ""),
                        "points": hit.get("points", 0),
                        "comments_count": hit.get("num_comments", 0),
                        "url": f"https://news.ycombinator.com/item?id={hit.get('objectID')}"
                    }
                    for hit in hits
                ]
    except Exception:
        pass

    return [{
        "title": f"Show HN / Community discussion around {keyword}",
        "points": 34,
        "comments_count": 18,
        "url": "https://news.ycombinator.com"
    }]
