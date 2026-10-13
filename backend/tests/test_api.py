"""
Integration Tests for FastAPI HTTP Endpoints
"""

import sys
import os
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"
    print("[PASS] GET /health returns 200 healthy")


def test_reports_crud():
    res = client.get("/api/reports")
    assert res.status_code == 200
    assert isinstance(res.json(), list)
    print("[PASS] GET /api/reports returns list")


def test_validation_handshake():
    res = client.post("/api/validate-start", json={
        "title": "CloudLog AI",
        "description": "Log anomaly detection for microservices",
        "industry": "DevOps",
        "keywords": ["log analysis", "observability"]
    })
    assert res.status_code == 200
    v_id = res.json()["validationId"]
    assert v_id is not None
    print(f"[PASS] POST /api/validate-start returned session: {v_id[:8]}...")

    # Stream SSE
    with client.stream("GET", f"/api/validate-stream?validationId={v_id}") as stream_res:
        assert stream_res.status_code == 200
        events = []
        for line in stream_res.iter_lines():
            if line and line.startswith("data: "):
                events.append(json.loads(line.replace("data: ", "")))
        assert len(events) >= 5
        assert events[-1]["status"] == "completed"
        print(f"[PASS] GET /api/validate-stream received {len(events)} events with final report.")


def test_direct_validate_rest():
    res = client.post("/api/v1/validate", json={
        "title": "QuickScan Barcode",
        "description": "Barcode scanner tool",
        "keywords": ["qr code scanner"]
    })
    assert res.status_code == 200
    report = res.json()
    assert report["recommendation"] == "NO_GO"
    assert report["validationScore"] <= 35
    print(f"[PASS] POST /api/v1/validate rejected commodity trap (Score: {report['validationScore']})")


if __name__ == "__main__":
    print("Testing FastAPI HTTP Endpoints Suite...\n")
    test_health()
    test_reports_crud()
    test_validation_handshake()
    test_direct_validate_rest()
    print("\n[SUCCESS] All FastAPI HTTP Endpoints Passed Integration Testing!")
