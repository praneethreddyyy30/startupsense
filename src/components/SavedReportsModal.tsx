import React from 'react';
import { ValidationReport, RecommendationStatus } from '../types';
import { Trash2, ExternalLink, GitCompare, Compass, Sparkles, CheckCircle2, XCircle, Clock, PlusCircle } from 'lucide-react';

interface SavedReportsModalProps {
  reports: ValidationReport[];
  onSelectReport: (report: ValidationReport) => void;
  onDeleteReport: (id: string) => void;
  onCompareSelect: (id1: string, id2: string) => void;
  onNewValidation?: () => void;
}

export const SavedReportsModal: React.FC<SavedReportsModalProps> = ({
  reports,
  onSelectReport,
  onDeleteReport,
  onCompareSelect,
  onNewValidation,
}) => {
  const [selectedForCompare, setSelectedForCompare] = React.useState<string[]>([]);

  const toggleCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((i) => i !== id));
    } else {
      if (selectedForCompare.length >= 2) {
        setSelectedForCompare([selectedForCompare[1], id]);
      } else {
        setSelectedForCompare([...selectedForCompare, id]);
      }
    }
  };

  const handleLaunchCompare = () => {
    if (selectedForCompare.length === 2) {
      onCompareSelect(selectedForCompare[0], selectedForCompare[1]);
    }
  };

  const getVerdictBadge = (rec: RecommendationStatus) => {
    switch (rec) {
      case 'GO':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'CONDITIONAL_GO':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'PIVOT':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'NO_GO':
        return 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1A3D2F] tracking-tight">
            Saved Startup Validation History
          </h1>
          <p className="text-sm text-slate-600 font-body">
            Review past multi-source validation reports or compare concepts side-by-side.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedForCompare.length === 2 && (
            <button
              onClick={handleLaunchCompare}
              className="px-4 py-2.5 rounded-xl bg-[#1F2B3E] hover:bg-[#161F2C] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all animate-bounce"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare Selected Ideas (2/2)</span>
            </button>
          )}

          {onNewValidation && (
            <button
              onClick={onNewValidation}
              className="px-4 py-2.5 rounded-xl bg-[#1A3D2F] hover:bg-[#153025] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Validate New Idea</span>
            </button>
          )}
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white border border-[#E5E2D9] rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] flex items-center justify-center mx-auto text-[#1A3D2F] border border-[#E5E2D9]">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#1A3D2F]">No Saved Reports Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto font-body">
            Submit a startup idea on the "New Idea" screen and click "Save Report" to preserve your validation history.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const isCompared = selectedForCompare.includes(report.id);
            return (
              <div
                key={report.id}
                className={`bg-white border rounded-2xl p-6 text-slate-800 shadow-sm flex flex-col justify-between transition-all relative ${
                  isCompared ? 'border-[#1A3D2F] ring-2 ring-[#1A3D2F]/20' : 'border-[#E5E2D9]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-bold px-2.5 py-0.5 rounded bg-[#1A3D2F]/10 text-[#1A3D2F] border border-[#1A3D2F]/20 font-mono">
                      {report.ideaInput.industry || 'Tech'}
                    </span>
                    <button
                      onClick={() => toggleCompare(report.id)}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        isCompared
                          ? 'bg-[#1A3D2F] text-white border-[#1A3D2F]'
                          : 'bg-[#FAF8F5] text-slate-600 border-[#E5E2D9] hover:text-[#1A3D2F] hover:border-[#1A3D2F]'
                      }`}
                    >
                      {isCompared ? 'Comparing ✓' : '+ Compare'}
                    </button>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#1A3D2F] line-clamp-1">{report.ideaInput.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-body">{report.executiveSummary}</p>

                  <div className="pt-2 flex items-center justify-between border-t border-[#E5E2D9]">
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="text-slate-400">Score:</span>
                      <span className="font-black text-[#1A3D2F] text-lg">{report.validationScore}</span>
                      <span className="text-slate-400">/100</span>
                    </div>

                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-lg border ${getVerdictBadge(report.recommendation)}`}>
                      {report.recommendation}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E2D9] flex items-center justify-between text-xs text-slate-500 mt-4 font-mono">
                  <span className="flex items-center gap-1 text-[10px]">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDeleteReport(report.id)}
                      className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-rose-50 border border-[#E5E2D9] hover:border-rose-200 text-slate-400 hover:text-rose-700 transition-colors cursor-pointer"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSelectReport(report)}
                      className="px-3 py-1.5 rounded-lg bg-[#1A3D2F] hover:bg-[#153025] text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
