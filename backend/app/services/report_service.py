import os
import json
from typing import List, Optional, Dict
from app.schemas.report import ValidationReport
from app.config import settings

class ReportService:
    def __init__(self, file_path: str = settings.REPORTS_FILE_PATH):
        self.file_path = file_path
        self._store: Dict[str, ValidationReport] = {}
        self._load_from_file()

    def _load_from_file(self):
        try:
            if os.path.exists(self.file_path):
                with open(self.file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        for item in data:
                            try:
                                report = ValidationReport.model_validate(item)
                                self._store[report.id] = report
                            except Exception:
                                continue
        except Exception as e:
            print(f"Failed to load reports from {self.file_path}: {e}")

    def _save_to_file(self):
        try:
            reports_list = [r.model_dump(by_alias=True) for r in self._store.values()]
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump(reports_list, f, indent=2)
        except Exception as e:
            print(f"Failed to save reports to {self.file_path}: {e}")

    def get_all(self) -> List[ValidationReport]:
        return list(self._store.values())

    def get_by_id(self, report_id: str) -> Optional[ValidationReport]:
        return self._store.get(report_id)

    def save(self, report: ValidationReport) -> ValidationReport:
        self._store[report.id] = report
        self._save_to_file()
        return report

    def delete(self, report_id: str) -> bool:
        if report_id in self._store:
            del self._store[report_id]
            self._save_to_file()
            return True
        return False

report_service = ReportService()
