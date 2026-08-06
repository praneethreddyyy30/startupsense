import React from 'react';
import { ValidationReport } from '../types';
import { GitCompare, CheckCircle2, AlertTriangle, Sparkles, Trophy } from 'lucide-react';

interface ComparisonViewProps {
  report1: ValidationReport;
  report2: ValidationReport;
  onBackToSaved: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  report1,
  report2,
  onBackToSaved,
}) => {
  const winner = report1.validationScore >= report2.validationScore ? report1 : report2;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E2D9] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#A98453] font-bold text-xs uppercase tracking-wider mb-1 font-mono">
            <GitCompare className="w-4 h-4" />
            <span>Side-by-Side Market Intelligence Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1A3D2F] tracking-tight">
            Startup Idea Head-to-Head Evaluation
          </h1>
        </div>

        <button
          onClick={onBackToSaved}
          className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E5E2D9]/40 text-slate-700 font-bold text-xs border border-[#E5E2D9] transition-colors cursor-pointer"
        >
          ← Back to History
        </button>
      </div>

      {/* Winner Spotlight Banner */}
      <div className="bg-gradient-to-r from-[#1A3D2F] via-[#245441] to-[#1A3D2F] rounded-3xl p-6 text-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-amber-300 tracking-wider font-mono">Higher Viability Winner</span>
            <h3 className="text-xl font-serif font-bold text-white">{winner.ideaInput.title}</h3>
            <p className="text-xs text-slate-200">
              Outperformed with a Validation Score of <strong className="text-emerald-300 font-mono">{winner.validationScore}/100</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[report1, report2].map((report, idx) => (
          <div key={report.id} className="bg-white border border-[#E5E2D9] shadow-sm rounded-3xl p-6 space-y-6">
            <div className="border-b border-[#E5E2D9] pb-4">
              <span className="text-[9px] font-bold uppercase px-2.5 py-0.5 rounded bg-[#1A3D2F]/10 text-[#1A3D2F] border border-[#1A3D2F]/20 font-mono">
                Option #{idx + 1}: {report.ideaInput.industry}
              </span>
              <h2 className="text-xl font-serif font-bold text-[#1A3D2F] mt-2">{report.ideaInput.title}</h2>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-body">{report.ideaInput.description}</p>
            </div>

            {/* Score & Verdict */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E2D9] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-450 font-bold uppercase block font-mono">Validation Score</span>
                <span className="text-3xl font-black text-[#1A3D2F] font-mono">{report.validationScore}<span className="text-sm font-normal text-slate-400">/100</span></span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-455 font-bold uppercase block font-mono">Verdict</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#1A3D2F]/10 text-[#1A3D2F] border border-[#1A3D2F]/20 inline-block mt-0.5 font-mono">
                  {report.recommendation}
                </span>
              </div>
            </div>

            {/* Scores Table */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#1A3D2F] uppercase tracking-wider text-[10px] font-mono">Dimension Breakdown</h4>
              <div className="space-y-1.5 bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E2D9] text-slate-700 font-mono">
                <div className="flex justify-between">
                  <span>Market Demand Velocity</span>
                  <strong className="text-emerald-700 font-bold">{report.scores.marketDemand}/100</strong>
                </div>
                <div className="flex justify-between">
                  <span>Customer Pain Severity</span>
                  <strong className="text-amber-800 font-bold">{report.scores.painSeverity}/100</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tech Feasibility</span>
                  <strong className="text-cyan-700 font-bold">{report.scores.techFeasibility}/100</strong>
                </div>
                <div className="flex justify-between">
                  <span>Competition Gap</span>
                  <strong className="text-purple-700 font-bold">{report.scores.competitionGap}/100</strong>
                </div>
                <div className="flex justify-between">
                  <span>Monetization Potential</span>
                  <strong className="text-[#1A3D2F] font-bold">{report.scores.monetizationPotential}/100</strong>
                </div>
              </div>
            </div>

            {/* Advantages & Risks */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 space-y-1 font-body">
                <strong className="font-serif font-bold flex items-center gap-1 text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Key Advantages:
                </strong>
                <ul className="list-disc list-inside space-y-0.5 pl-1 text-xs">
                  {(report.keyStrengths || []).slice(0, 2).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 space-y-1 font-body">
                <strong className="font-serif font-bold flex items-center gap-1 text-rose-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                  Primary Risk:
                </strong>
                <p className="pl-1 text-xs">{(report.criticalRisksSummary || [])[0] || 'Market saturation'}</p>
              </div>
            </div>

            {/* Execution Stats */}
            <div className="pt-3 border-t border-[#E5E2D9] flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Est. MVP Dev: <strong className="text-slate-800">{report.technicalEcosystem?.insights?.estimatedDevTimeWeeks || 4} Weeks</strong></span>
              <span>TAM: <strong className="text-slate-800">{report.marketOpportunity?.tamEstimate || 'N/A'}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
