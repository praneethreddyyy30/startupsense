import React, { useState } from 'react';
import { ValidationReport, EvidenceSource, RecommendationStatus } from '../types';
import { exportReportToMarkdown, downloadFile } from '../lib/exportUtils';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';
import { 
  Sparkles, 
  TrendingUp, 
  MessageSquare, 
  Code2, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Download, 
  Share2, 
  Send, 
  Compass, 
  Clock, 
  FileText, 
  ShieldAlert, 
  Search,
  ExternalLink,
  ChevronRight,
  Bot,
  PlusCircle,
  Globe
} from 'lucide-react';

interface ValidationReportViewProps {
  report: ValidationReport;
  onSaveReport?: (report: ValidationReport) => void;
  isSaved?: boolean;
  onNewValidation?: () => void;
}

export const ValidationReportView: React.FC<ValidationReportViewProps> = ({
  report,
  onSaveReport,
  isSaved = false,
  onNewValidation,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'trends' | 'pain' | 'tech' | 'competitors' | 'mvp' | 'risks' | 'evidence' | 'copilot'
  >('overview');

  const [activeJustify, setActiveJustify] = useState<string | null>(null);

  // Evidence filter state
  const [evidenceSourceFilter, setEvidenceSourceFilter] = useState<EvidenceSource | 'all'>('all');
  const [evidenceSearchQuery, setEvidenceSearchQuery] = useState('');

  // Co-Pilot state
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotHistory, setCopilotHistory] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: `Hello! I am your StartupSense Co-Pilot AI. I have analyzed the validation evidence for "${report.ideaInput.title}". Ask me anything about market demand, risks, competitor differentiation, or how to execute your MVP!`,
    },
  ]);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);

  // Verdict style mapping
  const getVerdictBadge = (rec: RecommendationStatus) => {
    switch (rec) {
      case 'GO':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-250',
          label: 'GO - HIGH MARKET VIABILITY',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" />,
        };
      case 'CONDITIONAL_GO':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-250',
          label: 'CONDITIONAL GO - PROCEED WITH MITIGATIONS',
          icon: <Sparkles className="w-5 h-5 text-indigo-700" />,
        };
      case 'PIVOT':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-250',
          label: 'PIVOT - RESTRUCTURE BEFORE LAUNCH',
          icon: <Compass className="w-5 h-5 text-amber-700" />,
        };
      case 'NO_GO':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-250',
          label: 'NO GO - HIGH RISK / LOW DEMAND',
          icon: <XCircle className="w-5 h-5 text-rose-700" />,
        };
    }
  };

  const verdict = getVerdictBadge(report.recommendation);

  // Dimension Scores data for chart
  const dimensionData = [
    { name: 'Market Demand', score: report.scores.marketDemand, color: '#1A3D2F' },
    { name: 'Pain Severity', score: report.scores.painSeverity, color: '#A98453' },
    { name: 'Tech Feasibility', score: report.scores.techFeasibility, color: '#0891B2' },
    { name: 'Competition Gap', score: report.scores.competitionGap, color: '#7C3AED' },
    { name: 'Monetization', score: report.scores.monetizationPotential, color: '#1E3A8A' },
  ];

  // Export handlers
  const handleDownloadMarkdown = () => {
    const markdown = exportReportToMarkdown(report);
    downloadFile(markdown, `${report.ideaInput.title.replace(/[^a-z0-9]/gi, '_')}_validation.md`, 'text/markdown');
  };

  const handleDownloadJSON = () => {
    downloadFile(JSON.stringify(report, null, 2), `${report.ideaInput.title.replace(/[^a-z0-9]/gi, '_')}_validation.json`, 'application/json');
  };

  // Co-Pilot submission
  const handleSendCopilot = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!copilotInput.trim() || isCopilotLoading) return;

    const userText = copilotInput.trim();
    setCopilotInput('');
    setCopilotHistory((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsCopilotLoading(true);

    try {
      const res = await fetch('/api/chat-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report,
          question: userText,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setCopilotHistory((prev) => [...prev, { sender: 'assistant', text: data.text }]);
      } else {
        setCopilotHistory((prev) => [...prev, { sender: 'assistant', text: 'Sorry, I could not process your query at this time.' }]);
      }
    } catch (err) {
      setCopilotHistory((prev) => [...prev, { sender: 'assistant', text: 'Network connection error while reaching Co-Pilot.' }]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  // Filter evidence list
  const filteredEvidence = (report.evidenceList || []).filter((item) => {
    const matchesSource = evidenceSourceFilter === 'all' || item.source === evidenceSourceFilter;
    const matchesQuery =
      evidenceSearchQuery === '' ||
      item.title.toLowerCase().includes(evidenceSearchQuery.toLowerCase()) ||
      item.snippet.toLowerCase().includes(evidenceSearchQuery.toLowerCase()) ||
      item.quoteOrStat.toLowerCase().includes(evidenceSearchQuery.toLowerCase());
    return matchesSource && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Quota Notice Banner */}
      {report.quotaNotice && (
        <div className="bg-amber-950/60 border border-amber-500/40 rounded-2xl p-4 sm:p-5 text-amber-200 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 mt-0.5 sm:mt-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-300">Offline Heuristic Intelligence Report (Gemini Rate Limit Notice)</h4>
              <p className="text-xs text-amber-200/80 leading-relaxed mt-0.5">
                Gemini API rate limit or quota was reached (429 RESOURCE_EXHAUSTED). StartupSense automatically generated an offline heuristic validation report so your workflow remains uninterrupted.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
            Fallback Mode Active
          </span>
        </div>
      )}

      {/* HEADER BANNER & RECOMMENDATION SCORECARD */}
      <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-8 text-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1A3D2F]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E5E2D9]">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded bg-[#1A3D2F]/10 text-[#1A3D2F] border border-[#1A3D2F]/20 font-mono">
                {report.ideaInput.industry || 'Tech'}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                Validated {new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-[#1A3D2F] tracking-tight">
              {report.ideaInput.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-body leading-relaxed">
              {report.ideaInput.description}
            </p>
          </div>

          {/* Verdict Badge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5E2D9]">
            <div className="flex items-center gap-3 px-2">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Outer circle track */}
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    stroke="#E5E2D9"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  {/* Colored progress circle */}
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    stroke="#1A3D2F"
                    strokeWidth="4.5"
                    fill="transparent"
                    strokeDasharray={150.8}
                    strokeDashoffset={150.8 - (report.validationScore / 100) * 150.8}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute font-mono font-black text-[#1A3D2F] text-sm">
                  {report.validationScore}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
                  Validation Score
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Scale: 0 - 100</span>
              </div>
            </div>

            <div className="h-px sm:h-12 w-full sm:w-px bg-[#E5E2D9]"></div>

            <div className="space-y-1 pl-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
                Executive Verdict
              </span>
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-bold text-xs ${verdict.bg}`}>
                {verdict.icon}
                <span className="font-mono text-[10px] font-black">{verdict.label}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Confidence Rating: {report.confidenceScore}%</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-body">
            <Sparkles className="w-4 h-4 text-[#A98453]" />
            <span>Target Audience: <strong className="text-slate-800 font-semibold">{report.ideaInput.targetAudience}</strong></span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNewValidation && (
              <button
                id="btn-validate-another-idea"
                onClick={onNewValidation}
                className="px-3.5 py-2 rounded-xl bg-[#1F2B3E] hover:bg-[#161F2C] text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Validate Another Idea</span>
              </button>
            )}

            {onSaveReport && (
              <button
                id="btn-save-report"
                onClick={() => onSaveReport(report)}
                disabled={isSaved}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-250'
                    : 'bg-[#1A3D2F] hover:bg-[#153025] text-white shadow-sm'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSaved ? 'Saved to History' : 'Save Report'}</span>
              </button>
            )}

            <button
              id="btn-download-md"
              onClick={handleDownloadMarkdown}
              className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E5E2D9]/40 text-slate-700 text-xs font-bold font-mono flex items-center gap-1.5 transition-colors border border-[#E5E2D9] cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#A98453]" />
              <span>Markdown</span>
            </button>

            <button
              id="btn-download-json"
              onClick={handleDownloadJSON}
              className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E5E2D9]/40 text-slate-700 text-xs font-bold font-mono flex items-center gap-1.5 transition-colors border border-[#E5E2D9] cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-750" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-[#E5E2D9] overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Executive Scorecard', icon: <Compass className="w-4 h-4" /> },
          { id: 'trends', label: 'Google Trends', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'pain', label: 'Reddit Pain Miner', icon: <MessageSquare className="w-4 h-4" /> },
          { id: 'tech', label: 'GitHub Tech Stack', icon: <Code2 className="w-4 h-4" /> },
          { id: 'competitors', label: 'Competitor Landscape', icon: <Users className="w-4 h-4" /> },
          { id: 'mvp', label: 'MVP Features', icon: <Layers className="w-4 h-4" /> },
          { id: 'risks', label: 'Risk & Mitigation', icon: <AlertTriangle className="w-4 h-4" /> },
          { id: 'evidence', label: 'Evidence Vault', icon: <Search className="w-4 h-4" /> },
          { id: 'copilot', label: 'AI Co-Pilot', icon: <Bot className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1A3D2F] text-white shadow-sm'
                  : 'text-slate-500 hover:text-[#1A3D2F] hover:bg-[#E5E2D9]/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: EXECUTIVE SCORECARD OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn text-slate-800">
          {/* Executive Summary */}
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#1A3D2F] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#A98453]" />
              <span>Executive Synthesis</span>
            </h3>
            <p className="text-slate-700 text-base leading-relaxed font-body">{report.executiveSummary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E5E2D9]">
              {/* Key Strengths */}
              <div className="space-y-3 bg-emerald-50 border border-emerald-200 p-4 rounded-xl font-body">
                <h4 className="text-sm font-serif font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Key Market Advantages</span>
                </h4>
                <ul className="space-y-2">
                  {(report.keyStrengths || []).map((strength, i) => (
                    <li key={i} className="text-xs text-emerald-850 flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Critical Risks */}
              <div className="space-y-3 bg-rose-50 border border-rose-200 p-4 rounded-xl font-body">
                <h4 className="text-sm font-serif font-bold text-rose-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-700" />
                  <span>Critical Showstoppers & Risks</span>
                </h4>
                <ul className="space-y-2">
                  {(report.criticalRisksSummary || []).map((risk, i) => (
                    <li key={i} className="text-xs text-rose-850 flex items-start gap-2">
                      <span className="text-rose-700 font-bold">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 5-Dimension Scorecard Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-serif font-bold text-[#1A3D2F]">Validation Score Breakdown</h3>
              <p className="text-xs text-slate-500 font-body">Evaluation across 5 key startup success metrics (0 - 100)</p>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dimensionData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                    <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fill: '#475569' }} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fontSize: 10, fill: '#475569' }} width={95} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e2d9', color: '#1a3d2f' }} formatter={(value) => [`${value}/100`, 'Score']} />
                    <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                      {dimensionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Decision Factors */}
            <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-[#1A3D2F] mb-3">GO / NO-GO Decision Matrix</h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-4 font-body">{report.goNoGoReasoning?.verdict}</p>

                <div className="space-y-3 text-xs font-body">
                  <div>
                    <span className="font-bold text-emerald-800 block mb-1">Key Factors Supporting Execution:</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
                      {(report.goNoGoReasoning?.keyFactorsForGo || []).map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-rose-800 block mb-1">Key Factors Against Execution:</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
                      {(report.goNoGoReasoning?.keyFactorsAgainst || []).map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  {report.goNoGoReasoning?.recommendedPivot && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                      <strong className="block font-serif font-bold">Recommended Strategic Pivot:</strong>
                      <span>{report.goNoGoReasoning.recommendedPivot}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E2D9] flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>TAM Estimate: <strong className="text-slate-800">{report.marketOpportunity?.tamEstimate}</strong></span>
                <span>SOM (3-Yr): <strong className="text-slate-800">{report.marketOpportunity?.somEstimate}</strong></span>
              </div>
            </div>
          </div>

          {/* Source Evidence & Citations Justification List */}
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1A3D2F]">Source Evidence & Metric Justifications</h3>
            <p className="text-xs text-slate-500 font-body">Inspect the physical crawled resources and links that justify each score:</p>
            
            <div className="space-y-3 font-body text-xs">
              {/* Demand Justification */}
              <div className="border border-[#E5E2D9] rounded-xl bg-[#FAF8F5] p-4">
                <div className="flex items-center justify-between font-bold text-[#1A3D2F] mb-1">
                  <span>Market Demand Score Justification (Score: {report.scores.marketDemand}/100)</span>
                  <a 
                    href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(report.demandAnalysis?.trendsData?.keyword || report.ideaInput.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#A98453] hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>View Search Trends ↗</span>
                  </a>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Based on a 12-month keyword velocity of <strong>{report.demandAnalysis?.growthVelocity}</strong> with hotspots in {report.demandAnalysis?.trendsData?.regionalBreakdown?.slice(0, 3).map(r => r.region).join(', ') || 'major English-speaking regions'}.
                </p>
              </div>

              {/* Pain Point Justification */}
              <div className="border border-[#E5E2D9] rounded-xl bg-[#FAF8F5] p-4">
                <div className="flex items-center justify-between font-bold text-[#A98453] mb-1">
                  <span>Customer Pain Severity Justification (Score: {report.scores.painSeverity}/100)</span>
                  <button 
                    onClick={() => setActiveTab('pain')}
                    className="text-[10px] text-[#1A3D2F] hover:underline flex items-center gap-1 font-mono cursor-pointer bg-transparent border-none p-0"
                  >
                    <span>Inspect Mined Threads ↗</span>
                  </button>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Evidence gathered from {report.customerPainPoints?.insights?.targetSubreddits?.join(', ') || 'Reddit forums'} detailing direct user quotes: <span className="italic">"{(report.customerPainPoints?.insights?.painPoints?.[0]?.userQuote || 'Users frustrated with manual workflows').substring(0, 100)}..."</span>
                  {report.customerPainPoints?.insights?.painPoints?.[0] && (
                    <a 
                      href={`https://reddit.com/r/${report.customerPainPoints.insights.painPoints[0].subredditOrForum.replace('r/', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 font-bold text-[#1A3D2F] hover:underline"
                    >
                      [Query Subreddit ↗]
                    </a>
                  )}
                </p>
              </div>

              {/* Feasibility Justification */}
              <div className="border border-[#E5E2D9] rounded-xl bg-[#FAF8F5] p-4">
                <div className="flex items-center justify-between font-bold text-cyan-800 mb-1">
                  <span>Technical Feasibility Justification (Score: {report.scores.techFeasibility}/100)</span>
                  <button 
                    onClick={() => setActiveTab('tech')}
                    className="text-[10px] text-cyan-600 hover:underline flex items-center gap-1 font-mono cursor-pointer bg-transparent border-none p-0"
                  >
                    <span>Inspect Repositories ↗</span>
                  </button>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Based on {report.technicalEcosystem?.insights?.relevantRepositories?.length || 3} relevant open-source libraries (e.g. <strong>{report.technicalEcosystem?.insights?.relevantRepositories?.[0]?.name || 'relevant repositories'}</strong>) with Star maturity of up to ★{report.technicalEcosystem?.insights?.relevantRepositories?.[0]?.stars || 1500}.
                  {report.technicalEcosystem?.insights?.relevantRepositories?.[0]?.url && (
                    <a 
                      href={report.technicalEcosystem.insights.relevantRepositories[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 font-bold text-[#1A3D2F] hover:underline"
                    >
                      [Open Top Repo ↗]
                    </a>
                  )}
                </p>
              </div>

              {/* Competitor Justification */}
              <div className="border border-[#E5E2D9] rounded-xl bg-[#FAF8F5] p-4">
                <div className="flex items-center justify-between font-bold text-purple-800 mb-1">
                  <span>Competition Gap Justification (Score: {report.scores.competitionGap}/100)</span>
                  <button 
                    onClick={() => setActiveTab('competitors')}
                    className="text-[10px] text-purple-600 hover:underline flex items-center gap-1 font-mono cursor-pointer bg-transparent border-none p-0"
                  >
                    <span>Inspect Competitors ↗</span>
                  </button>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Identified market saturation level of <strong>{report.competitorLandscape?.saturationLevel}</strong>. Main market entries analyzed include: {report.competitorLandscape?.competitors?.directCompetitors?.slice(0, 3).map(c => c.name).join(', ') || 'several key players'}.
                </p>
              </div>
            </div>
          </div>

          {/* Domain Availability Check */}
          {report.domainAvailability && report.domainAvailability.length > 0 && (
            <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-serif font-bold text-[#1A3D2F] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#A98453]" />
                <span>Domain Name Feasibility Check</span>
              </h3>
              <p className="text-xs text-slate-500 font-body">DNS registration checks for naming variants related to "{report.ideaInput.title}"</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {report.domainAvailability.map((dom, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-xl border flex items-center justify-between font-mono overflow-hidden gap-3 ${
                      dom.available 
                        ? 'bg-[#1A3D2F]/5 border-[#1A3D2F]/30 text-[#1A3D2F]' 
                        : 'bg-[#FAF8F5] border-[#E5E2D9] text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs sm:text-sm font-bold block" style={{ wordBreak: 'break-all' }}>{dom.domain}</span>
                      <span className="text-[9px] uppercase font-bold">
                        {dom.available ? 'Available' : 'Registered'}
                      </span>
                    </div>
                    {dom.available ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse shadow-sm shadow-emerald-500" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Research Agent Team Audit Log */}
          {report.agentAudit && report.agentAudit.length > 0 && (
            <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-serif font-bold text-[#1A3D2F] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#A98453]" />
                <span>Validation Agent Orchestration Log</span>
              </h3>
              <p className="text-xs text-slate-500 font-body">Review the specific agent entities deployed in the background to validate your idea:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {report.agentAudit.map((agent, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#E5E2D9] bg-[#FAF8F5] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1A3D2F]/10 border border-[#1A3D2F]/20 flex items-center justify-center shrink-0 text-xs font-mono font-bold text-[#1A3D2F]">
                      0{idx + 1}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-xs text-[#1A3D2F]">{agent.agentName}</span>
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-850 border border-emerald-200 font-mono">
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold font-mono">Role: {agent.role}</p>
                      <p className="text-xs text-slate-650 leading-relaxed font-body">Processed: <strong className="text-slate-800 font-mono">{agent.datasetProcessed}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: GOOGLE TRENDS & DEMAND */}
      {activeTab === 'trends' && (
        <div className="space-y-6 animate-fadeIn text-slate-800">
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E2D9] pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1A3D2F] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#1A3D2F]" />
                  <span>Google Search Demand Velocity</span>
                </h3>
                <p className="text-xs text-slate-500 font-body">
                  12-Month search interest momentum for target keywords: #{report.demandAnalysis?.trendsData?.keyword || report.ideaInput.title}
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-[#1A3D2F]/10 text-[#1A3D2F] border border-[#1A3D2F]/20 font-bold">
                  Growth: {report.demandAnalysis?.growthVelocity}
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#A98453]/10 text-[#A98453] border border-[#A98453]/20 font-bold">
                  Interest Index: {report.demandAnalysis?.interestScore}/100
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-body">{report.demandAnalysis?.summary}</p>

            {/* Recharts Area Chart */}
            <div className="h-72 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={report.demandAnalysis?.trendsData?.searchInterestOverTime || []}>
                  <defs>
                    <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A3D2F" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1A3D2F" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11, fill: '#475569' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e2d9', color: '#1a3d2f' }} formatter={(val) => [`${val} / 100`, 'Search Interest']} />
                  <Area type="monotone" dataKey="interest" stroke="#1A3D2F" strokeWidth={3} fill="url(#interestGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Regional Hotspots */}
            <div className="bg-white border border-[#E5E2D9] p-6 shadow-sm rounded-3xl space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#1A3D2F]">Regional Search Demand Hotspots</h4>
              <div className="space-y-2 font-mono text-xs">
                {(report.demandAnalysis?.trendsData?.regionalBreakdown || []).map((r, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-650 font-medium font-body">{r.region}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-[#FAF8F5] rounded-full h-2 overflow-hidden border border-[#E5E2D9]">
                        <div className="bg-[#1A3D2F] h-full rounded-full" style={{ width: `${r.score}%` }}></div>
                      </div>
                      <span className="font-bold text-slate-800 w-8 text-right">{r.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Search Terms */}
            <div className="bg-white border border-[#E5E2D9] p-6 shadow-sm rounded-3xl space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#1A3D2F]">Breakout Related Search Queries</h4>
              <div className="space-y-2">
                {(report.demandAnalysis?.trendsData?.topRelatedQueries || []).map((q, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E2D9] flex items-center justify-between text-xs font-mono text-slate-800">
                    <span className="font-medium text-slate-850 font-body">"{q.query}"</span>
                    <span className="px-2 py-0.5 rounded bg-[#1A3D2F]/10 text-[#1A3D2F] font-bold border border-[#1A3D2F]/20">{q.growth}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: REDDIT PAIN MINER */}
      {activeTab === 'pain' && (
        <div className="space-y-6 animate-fadeIn text-slate-800">
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E2D9] pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1A3D2F] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#A98453]" />
                  <span>Customer Pain Point & Sentiment Analysis</span>
                </h3>
                <p className="text-xs text-slate-500 font-body">
                  Mined community complaints from subreddits: {(report.customerPainPoints?.insights?.targetSubreddits || []).join(', ')}
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-[#A98453]/10 text-[#A98453] border border-[#A98453]/20 font-bold">
                  Severity: {report.customerPainPoints?.severityScore}/100
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-250 font-bold">
                  Sentiment: {report.customerPainPoints?.insights?.overallSentimentScore || -0.45}
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-body">{report.customerPainPoints?.summary}</p>
          </div>

          {/* User Complaints & Quotes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(report.customerPainPoints?.insights?.painPoints || []).map((pain) => (
              <div key={pain.id} className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-3 relative overflow-hidden text-slate-850">
                <div className="flex items-center justify-between">
                  <a 
                    href={`https://reddit.com/${pain.subredditOrForum}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#FAF8F5] text-slate-650 border border-[#E5E2D9] font-mono hover:text-[#1A3D2F] hover:border-[#1A3D2F]"
                  >
                    {pain.subredditOrForum} ↗
                  </a>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                    pain.severity === 'CRITICAL' 
                      ? 'bg-rose-50 text-rose-850 border border-rose-250' 
                      : 'bg-[#FAF8F5] text-slate-500 border border-[#E5E2D9]'
                  }`}>
                    {pain.severity} SEVERITY
                  </span>
                </div>

                <h4 className="font-serif font-bold text-[#1A3D2F] text-base">{pain.title}</h4>

                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E2D9] text-xs text-slate-600 italic relative font-body leading-relaxed">
                  "{pain.userQuote}"
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 font-mono">
                  <span>Sentiment: <strong className="text-slate-750 font-body">{pain.sentiment}</strong></span>
                  <span>Frustration Index: <strong className="text-[#A98453]">{pain.frequencyScore}/100</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* User Desires */}
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#1A3D2F]">Key User Desires & Feature Expectations</h4>
            <div className="flex flex-wrap gap-2">
              {(report.customerPainPoints?.insights?.userDesires || []).map((desire, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-[#1A3D2F]/5 border border-[#1A3D2F]/20 text-[#1A3D2F] text-xs font-bold font-body">
                  ✓ {desire}
                </span>
              ))}
            </div>
          </div>

          {/* Hacker News Discussions */}
          {report.hackerNewsAnalysis && report.hackerNewsAnalysis.posts && report.hackerNewsAnalysis.posts.length > 0 && (
            <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#1A3D2F] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#A98453]" />
                <span>Hacker News Startup Community Discussions</span>
              </h4>
              <p className="text-xs text-slate-500 font-body">{report.hackerNewsAnalysis.summary}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.hackerNewsAnalysis.posts.map((post, idx) => (
                  <a
                    key={idx}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl border border-[#E5E2D9] bg-[#FAF8F5] hover:bg-[#FAF8F5]/85 hover:border-[#1A3D2F]/40 transition-all space-y-2 block group text-slate-800"
                  >
                    <div className="flex items-center justify-between font-mono text-[9px]">
                      <span className="font-bold uppercase px-2 py-0.5 rounded bg-[#1A3D2F]/10 text-[#1A3D2F] border border-[#1A3D2F]/20">
                        HN Story
                      </span>
                      <span className="text-slate-500 font-bold">
                        ★ {post.points} Points | {post.commentsCount} Comments
                      </span>
                    </div>
                    <h5 className="font-serif font-bold text-sm text-[#1A3D2F] group-hover:text-[#A98453] transition-colors line-clamp-2">
                      {post.title}
                    </h5>
                    <div className="flex items-center justify-end text-[10px] text-[#A98453] font-bold gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                      <span>View Thread ↗</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </a>
                ))}
            </div>
          </div>
        )}
      </div>
    )}

      {/* TAB CONTENT: GITHUB TECH STACK */}
      {activeTab === 'tech' && (
        <div className="space-y-6 animate-fadeIn text-slate-800">
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E2D9] pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1A3D2F] flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-[#1A3D2F]" />
                  <span>Technical Ecosystem & Open-Source Readiness</span>
                </h3>
                <p className="text-xs text-slate-500 font-body">
                  GitHub open-source library density & estimated build feasibility
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-850 border border-cyan-200 font-bold">
                  Feasibility: {report.technicalEcosystem?.feasibilityScore}/100
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#A98453]/10 text-[#A98453] border border-[#A98453]/20 font-bold">
                  Est. MVP Build: {report.technicalEcosystem?.insights?.estimatedDevTimeWeeks || 4} Weeks
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-body">{report.technicalEcosystem?.summary}</p>
          </div>

          {/* Supporting GitHub Repositories */}
          <div className="bg-white border border-[#E5E2D9] p-6 shadow-sm rounded-3xl space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#1A3D2F]">Relevant Open-Source Repositories & Libraries</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(report.technicalEcosystem?.insights?.relevantRepositories || []).map((repo, idx) => (
                <a 
                  key={idx} 
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border border-[#E5E2D9] bg-[#FAF8F5] hover:bg-[#FAF8F5]/85 hover:border-[#1A3D2F]/40 transition-colors space-y-2 block group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#1A3D2F] group-hover:text-[#A98453] flex items-center gap-1 transition-colors">
                      {repo.name}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs text-[#A98453] font-bold font-mono">★ {repo.stars} Stars</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 font-body leading-relaxed">{repo.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                    <span>Language: <strong>{repo.language}</strong></span>
                    <span>Updated: {repo.lastUpdated ? new Date(repo.lastUpdated).toLocaleDateString() : 'Recently'}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Recommended Tech Stack */}
          <div className="bg-white border border-[#E5E2D9] p-6 shadow-sm rounded-3xl space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#1A3D2F]">Recommended Production Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {(report.technicalEcosystem?.insights?.recommendedTechStack || []).map((stack, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E5E2D9] text-slate-800 font-mono text-xs font-bold">
                  {stack}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: COMPETITORS */}
      {activeTab === 'competitors' && (
        <div className="space-y-6 animate-fadeIn text-slate-800">
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E2D9] pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1A3D2F] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#1A3D2F]" />
                  <span>Competitor Landscape & Differentiation</span>
                </h3>
                <p className="text-xs text-slate-500 font-body">
                  Direct/indirect competitor analysis and unserved blue ocean market gap
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 font-bold text-xs font-mono">
                Saturation: {report.competitorLandscape?.saturationLevel}
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-body">{report.competitorLandscape?.summary}</p>
          </div>

          {/* Direct Competitor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(report.competitorLandscape?.competitors?.directCompetitors || []).map((comp, idx) => (
              <div key={idx} className="bg-white border border-[#E5E2D9] p-6 shadow-sm rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-3">
                  <a 
                    href={comp.url || `https://www.google.com/search?q=${encodeURIComponent(comp.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif font-bold text-base text-[#1A3D2F] hover:text-[#A98453] flex items-center gap-1 hover:underline transition-colors"
                  >
                    <span>{comp.name}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-mono">
                    {comp.pricingModel}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-body">
                  <div>
                    <strong className="text-slate-750 block mb-1">Key Strengths:</strong>
                    <div className="flex flex-wrap gap-1">
                      {comp.strengths?.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#FAF8F5] text-slate-600 border border-[#E5E2D9]">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <strong className="text-rose-800 block mb-1">Gaps / Customer Weaknesses:</strong>
                    <div className="flex flex-wrap gap-1">
                      {comp.weaknesses?.map((w, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">{w}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gap Opportunity */}
          <div className="bg-gradient-to-r from-[#1A3D2F] to-[#2D5A46] text-white rounded-3xl p-6 shadow-sm space-y-2 border border-[#E5E2D9]/20">
            <h4 className="font-serif font-bold text-base text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Identified Blue Ocean Market Gap</span>
            </h4>
            <p className="text-sm text-slate-100 leading-relaxed font-body">
              {report.competitorLandscape?.competitors?.gapOpportunity}
            </p>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MVP FEATURES ROADMAP */}
          {/* TAB CONTENT: MVP FEATURES ROADMAP */}
      {activeTab === 'mvp' && (
        <div className="space-y-6 animate-fadeIn text-slate-800">
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#1A3D2F] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#A98453]" />
              <span>Suggested MVP Feature Prioritization</span>
            </h3>
            <p className="text-xs text-slate-500 font-body">
              Recommended feature roadmap categorized by Must-Have, Should-Have, and Could-Have for maximum velocity.
            </p>

            <div className="space-y-3 pt-2">
              {report.mvpFeatures.map((feat) => (
                <div key={feat.id} className="p-4 rounded-xl border border-[#E5E2D9] bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                        feat.priority === 'MUST_HAVE'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : feat.priority === 'SHOULD_HAVE'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-200 text-slate-700 border border-slate-300'
                      }`}>
                        {feat.priority.replace('_', ' ')}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#1A3D2F]">{feat.name}</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-body">{feat.description}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs whitespace-nowrap font-mono">
                    <span className="text-slate-500">Est. Dev: <strong className="text-slate-800">{feat.estimatedDays} Days</strong></span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E5E2D9] font-bold text-slate-700 text-[10px]">
                      {feat.complexity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: RISK & MITIGATION */}
      {activeTab === 'risks' && (
        <div className="space-y-6 animate-fadeIn text-slate-800">
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#1A3D2F] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#A98453]" />
              <span>Comprehensive Risk Matrix & Mitigation Strategies</span>
            </h3>
            <p className="text-xs text-slate-500 font-body">
              Evaluation of market, technical, financial, and execution risks with proposed founder mitigation tactics.
            </p>

            <div className="space-y-4 pt-2">
              {report.riskAssessment.map((risk) => (
                <div key={risk.id} className="p-5 rounded-2xl border border-[#E5E2D9] bg-[#FAF8F5] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#1A3D2F]/10 text-[#1A3D2F] border border-[#1A3D2F]/20 font-mono">
                        {risk.category} Risk
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#1A3D2F]">{risk.riskTitle}</h4>
                    </div>
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full font-mono ${
                      risk.severity === 'HIGH'
                        ? 'bg-rose-50 text-rose-850 border border-rose-200'
                        : risk.severity === 'MEDIUM'
                        ? 'bg-amber-50 text-amber-850 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-850 border border-emerald-200'
                    }`}>
                      {risk.severity} SEVERITY
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-body">{risk.impactDescription}</p>

                  <div className="p-3 rounded-xl bg-white border border-[#E5E2D9] text-xs text-[#1A3D2F] font-body leading-relaxed">
                    <strong className="block text-[#A98453] font-serif font-bold mb-0.5">Proposed Mitigation Action:</strong>
                    <span>{risk.mitigationStrategy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: EVIDENCE VAULT */}
      {activeTab === 'evidence' && (
        <div className="space-y-6 animate-fadeIn text-slate-800">
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E2D9] pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1A3D2F] flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#1A3D2F]" />
                  <span>Evidence Vault (Multi-Source Provenance)</span>
                </h3>
                <p className="text-xs text-slate-500 font-body">
                  Every conclusion in this report is grounded in verified public market evidence items.
                </p>
              </div>

              {/* Source Filters */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                {['all', 'google_trends', 'reddit', 'github', 'competitor'].map((src) => (
                  <button
                    key={src}
                    onClick={() => setEvidenceSourceFilter(src as any)}
                    className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                      evidenceSourceFilter === src
                        ? 'bg-[#1A3D2F] text-white shadow-sm'
                        : 'bg-[#FAF8F5] text-slate-600 hover:bg-[#E5E2D9]/40 border border-[#E5E2D9]'
                    }`}
                  >
                    {src.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Evidence Cards */}
            <div className="space-y-3">
              {filteredEvidence.map((ev) => (
                <div key={ev.id} className="p-4 rounded-xl border border-[#E5E2D9] bg-[#FAF8F5] hover:bg-[#FAF8F5]/85 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-[#1A3D2F]/10 text-[#1A3D2F] border border-[#1A3D2F]/20 font-mono">
                      {ev.source.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-450 font-mono">Relevance: <strong className="text-slate-700">{ev.relevanceScore}%</strong></span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-[#1A3D2F]">{ev.title}</h4>
                  <p className="text-xs text-slate-650 leading-relaxed font-body">{ev.snippet}</p>

                  <div className="p-2.5 rounded-lg bg-white border border-[#E5E2D9] text-xs text-slate-600 font-mono leading-relaxed">
                    "{ev.quoteOrStat}"
                  </div>

                  {ev.urlOrRef && (
                    <div className="flex items-center justify-end pt-1">
                      <a 
                        href={ev.urlOrRef} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[10px] text-[#A98453] hover:underline font-mono font-bold flex items-center gap-1"
                      >
                        <span>Audit Source ↗</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: AI CO-PILOT CHAT */}
      {activeTab === 'copilot' && (
        <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-4 animate-fadeIn text-slate-800">
          <div className="flex items-center gap-2 border-b border-[#E5E2D9] pb-4">
            <Bot className="w-6 h-6 text-[#1A3D2F]" />
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1A3D2F]">StartupSense AI Co-Pilot</h3>
              <p className="text-xs text-slate-500 font-body">Grounded strictly in the validated report evidence for {report.ideaInput.title}</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto space-y-3 p-4 bg-[#FAF8F5] rounded-2xl border border-[#E5E2D9] text-xs font-body leading-relaxed">
            {copilotHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xl p-3.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-[#1F2B3E] text-white font-medium rounded-tr-none shadow-sm'
                      : 'bg-white text-slate-800 border border-[#E5E2D9] rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isCopilotLoading && (
              <div className="flex justify-start text-slate-500 items-center gap-2 font-mono">
                <Bot className="w-4 h-4 animate-spin text-[#1A3D2F]" />
                <span>Co-Pilot is evaluating report context...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendCopilot} className="flex gap-2">
            <input
              type="text"
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              placeholder="e.g. How can I differentiate from direct competitors? What is the biggest execution risk?"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E2D9] text-[#1A3D2F] placeholder:text-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1A3D2F]"
            />
            <button
              type="submit"
              disabled={isCopilotLoading || !copilotInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#1A3D2F] hover:bg-[#153025] text-white font-bold text-xs font-mono flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
