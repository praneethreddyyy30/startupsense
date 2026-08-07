import React from 'react';
import { Sparkles, Compass, Bookmark, GitCompare, PlusCircle, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'input' | 'report' | 'saved' | 'compare';
  setActiveTab: (tab: 'input' | 'report' | 'saved' | 'compare') => void;
  savedCount: number;
  onNewValidation: () => void;
  hasActiveReport: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onNewValidation,
  hasActiveReport,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E5E2D9] text-[#1A3D2F] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={onNewValidation}
          className="flex items-center gap-3 cursor-pointer group"
          id="navbar-brand-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A3D2F] via-[#2D5A46] to-[#A98453] p-0.5 shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#FBF9F6] rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-[#1A3D2F] group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl tracking-tight text-[#1A3D2F]">
                Evifacto
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-[#1A3D2F]/10 text-[#1A3D2F] border border-[#1A3D2F]/20">
                B2B SaaS
              </span>
            </div>
            <p className="text-[10px] font-serif italic text-[#A98453] hidden sm:block">Market Intelligence & Idea Validation</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-btn-new"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onNewValidation();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'input'
                ? 'bg-[#1A3D2F] text-white shadow-sm hover:bg-[#153025]'
                : 'text-slate-600 hover:text-[#1A3D2F] hover:bg-[#E5E2D9]/40'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Idea</span>
          </button>

          {hasActiveReport && (
            <button
              id="nav-btn-active-report"
              type="button"
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'report'
                  ? 'bg-[#A98453] text-white shadow-sm hover:bg-[#927145]'
                  : 'text-slate-600 hover:text-[#A98453] hover:bg-[#E5E2D9]/40'
              }`}
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Current Report</span>
            </button>
          )}

          <button
            id="nav-btn-saved"
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-[#1F2B3E] text-white shadow-sm hover:bg-[#161F2C]'
                : 'text-slate-600 hover:text-[#1F2B3E] hover:bg-[#E5E2D9]/40'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-[#1F2B3E]/10 text-[#1F2B3E] rounded-full border border-[#1F2B3E]/20">
                {savedCount}
              </span>
            )}
          </button>

          <button
            id="nav-btn-compare"
            type="button"
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-[#1F2B3E] text-white shadow-sm hover:bg-[#161F2C]'
                : 'text-slate-600 hover:text-[#1F2B3E] hover:bg-[#E5E2D9]/40'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span>
          </button>
        </nav>

        {/* Engine Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FBF9F6] border border-[#E5E2D9] text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#1A3D2F]" />
            <span className="text-[#1A3D2F] font-mono text-[10px] font-bold">Gemini 3.6 Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
