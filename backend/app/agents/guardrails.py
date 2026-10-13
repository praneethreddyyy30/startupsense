from typing import Tuple
from app.schemas.idea import StartupIdeaInput

COMMODITY_TRAP_KEYWORDS = [
    "qr code",
    "qr scanner",
    "barcode scanner",
    "flashlight",
    "sms weather",
    "weather alert",
    "pet rock",
    "fax machine",
    "sidewalk nap",
    "goldfish walker",
    "prescription sharing",
    "used toothbrush"
]

def check_anti_sycophancy_guardrail(idea: StartupIdeaInput) -> Tuple[bool, str]:
    """
    Checks if an idea falls into a known solved commodity utility trap.
    Returns (is_trap, reasoning).
    """
    combined = f"{idea.title} {idea.description} {idea.problemStatement or ''} {' '.join(idea.keywords or [])}".lower()
    
    for trap in COMMODITY_TRAP_KEYWORDS:
        if trap in combined:
            return True, (
                f"The concept monetizes '{trap}', a solved utility natively provided for free by iOS/Android "
                "or obsolete technology with near-zero willingness to pay and zero market defensibility."
            )
            
    return False, ""
