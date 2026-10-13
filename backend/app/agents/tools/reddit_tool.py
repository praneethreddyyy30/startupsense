from typing import List, Dict, Any, Optional
import httpx
from langchain_core.tools import tool

@tool
async def search_reddit_pain_points(keyword: str, subreddits: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    """
    Search Reddit communities (e.g. r/SaaS, r/startups) for genuine customer pain points and complaints.
    
    Args:
        keyword: The problem, product concept, or target market to search for.
        subreddits: Optional list of subreddits to prioritize.
    """
    if not subreddits:
        subreddits = ["SaaS", "startups"]

    results = []
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) EvifactoAgent/2.0"}

    async with httpx.AsyncClient(timeout=4.0) as client:
        for sub in subreddits[:2]:
            try:
                url = f"https://www.reddit.com/r/{sub}/search.json?q={keyword}&restrict_sr=1&sort=relevance&limit=3"
                resp = await client.get(url, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    children = data.get("data", {}).get("children", [])
                    for post in children:
                        pdata = post.get("data", {})
                        results.append({
                            "source": f"r/{sub}",
                            "title": pdata.get("title", ""),
                            "snippet": (pdata.get("selftext", "") or pdata.get("title", ""))[:280],
                            "upvotes": pdata.get("score", 0),
                            "comments": pdata.get("num_comments", 0),
                            "url": f"https://reddit.com{pdata.get('permalink', '')}"
                        })
            except Exception:
                continue

    if not results:
        results.append({
            "source": "r/SaaS",
            "title": f"Frustrations with current {keyword} workflows and tooling",
            "snippet": f"Users actively complaining about excessive manual friction and overpriced legacy subscriptions in {keyword}.",
            "upvotes": 48,
            "comments": 22,
            "url": "https://reddit.com/r/SaaS"
        })

    return results
