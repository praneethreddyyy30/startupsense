from typing import List
from fastapi import APIRouter, HTTPException
from app.schemas.report import ValidationReport
from app.services.report_service import report_service

router = APIRouter(tags=["Reports"])

@router.get("/reports", response_model=List[ValidationReport])
async def get_all_reports():
    """Retrieve all previously generated and saved validation reports."""
    return report_service.get_all()

@router.get("/reports/{report_id}", response_model=ValidationReport)
async def get_report_by_id(report_id: str):
    """Retrieve a specific validation report by ID."""
    report = report_service.get_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.post("/reports", response_model=ValidationReport)
async def save_report(report: ValidationReport):
    """Save or update a validation report."""
    return report_service.save(report)

@router.delete("/reports/{report_id}")
async def delete_report(report_id: str):
    """Delete a saved validation report."""
    success = report_service.delete(report_id)
    if not success:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"success": True, "deleted_id": report_id}
