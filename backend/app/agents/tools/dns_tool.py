from typing import Dict, Any
import socket
from langchain_core.tools import tool

@tool
def check_dns_domain_viability(domain_name: str) -> Dict[str, Any]:
    """
    Perform low-level socket ICANN DNS lookups to verify commercial domain name availability (.com, .io, .ai).
    
    Args:
        domain_name: The brand name or startup domain to test.
    """
    clean_name = "".join(c for c in domain_name.lower() if c.isalnum() or c == "-")
    results = {}

    for tld in [".com", ".io", ".ai"]:
        host = f"{clean_name}{tld}"
        try:
            socket.gethostbyname(host)
            results[host] = "TAKEN"
        except socket.gaierror:
            results[host] = "AVAILABLE"
        except Exception:
            results[host] = "UNKNOWN"

    available_count = sum(1 for v in results.values() if v == "AVAILABLE")
    return {
        "domain_tested": clean_name,
        "tld_status": results,
        "available_count": available_count,
        "recommendation": "Secure brand domain immediately" if available_count > 0 else "Consider creative brand prefix"
    }
