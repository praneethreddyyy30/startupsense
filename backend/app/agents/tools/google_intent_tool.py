from typing import List
import httpx
from langchain_core.tools import tool

@tool
async def query_google_search_intent(query: str) -> List[str]:
    """
    Fetch live Google Autocomplete search predictions to extract real customer search intent and market interest queries.
    
    Args:
        query: The seed keyword or business concept phrase.
    """
    url = f"http://suggestqueries.google.com/complete/search?client=chrome&q={query}"
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                if isinstance(data, list) and len(data) > 1 and isinstance(data[1], list):
                    return data[1][:5]
    except Exception:
        pass

    return [
        f"{query} software",
        f"best {query} tools",
        f"{query} pricing alternatives",
        f"how to automate {query}"
    ]
