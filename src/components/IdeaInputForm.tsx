import React, { useState } from 'react';
import { StartupIdeaInput } from '../types';
import { SAMPLE_IDEAS, SampleIdeaPreset } from '../data/sampleIdeas';
import { Sparkles, Rocket, Zap, Search, Target, DollarSign, Layers, ArrowRight, Lightbulb, RotateCcw } from 'lucide-react';

interface IdeaInputFormProps {
  onSubmit: (input: StartupIdeaInput) => void;
  isLoading: boolean;
}

export const IdeaInputForm: React.FC<IdeaInputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<StartupIdeaInput>({
    title: '',
    industry: 'SaaS & Software',
    targetAudience: '',
    description: '',
    problemStatement: '',
    monetizationModel: 'Freemium / Monthly Subscription',
    keywords: [],
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const handleSelectPreset = (preset: SampleIdeaPreset) => {
    setSelectedPresetId(preset.id);
    setFormData({
      title: preset.title,
      industry: preset.industry,
      targetAudience: preset.targetAudience,
      description: preset.description,
      problemStatement: preset.problemStatement || '',
      monetizationModel: preset.monetizationModel || 'Monthly Subscription',
      keywords: preset.keywords || [],
    });
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords?.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...(formData.keywords || []), keywordInput.trim()],
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setFormData({
      ...formData,
      keywords: (formData.keywords || []).filter((k) => k !== kw),
    });
  };

  const handleResetForm = () => {
    setFormData({
      title: '',
      industry: 'SaaS & Software',
      targetAudience: '',
      description: '',
      problemStatement: '',
      monetizationModel: 'Freemium / Monthly Subscription',
      keywords: [],
    });
    setSelectedPresetId(null);
    setKeywordInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please enter a startup title and detailed description.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A3D2F]/10 border border-[#1A3D2F]/20 text-[#1A3D2F] text-xs font-bold uppercase tracking-wider mb-4 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-[#A98453]" />
          <span>Evidence-Based Startup Evaluation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#1A3D2F] tracking-tight mb-4 leading-tight">
          Validate Your Startup Idea with <br className="hidden sm:inline" />
          <span className="text-[#A98453] italic">Multi-Source Market Evidence</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-body">
          Stop relying on guesswork. StartupSense automatically extracts evidence across Google Trends, Reddit discussions, Hacker News threads, GitHub repositories, and DNS domain availability to generate explainable GO/NO-GO reports.
        </p>
      </div>

      {/* Preset Ideas Carousel / Cards */}
      <div className="mb-10 bg-white rounded-3xl p-6 text-slate-800 shadow-sm border border-[#E5E2D9]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#A98453]" />
            <h3 className="font-serif font-bold text-lg text-[#1A3D2F]">Need inspiration? Try a preset startup concept:</h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline font-mono">1-Click Fast Validation Test</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SAMPLE_IDEAS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <div
                key={preset.id}
                id={`preset-card-${preset.id}`}
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#1A3D2F]/5 border-[#1A3D2F] shadow-sm ring-1 ring-[#1A3D2F]'
                    : 'bg-[#FAF8F5]/80 border-[#E5E2D9] hover:border-[#1A3D2F]/40 hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#1A3D2F]/10 text-[#1A3D2F] border border-[#1A3D2F]/20 font-mono">
                    {preset.badge}
                  </span>
                  {isSelected && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 font-mono">
                      Selected ✓
                    </span>
                  )}
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1A3D2F] line-clamp-1 mb-1">{preset.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-body">{preset.tagline}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Box */}
      <form onSubmit={handleSubmit} id="startup-idea-form" className="bg-white border border-[#E5E2D9] shadow-xl rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E5E2D9] pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#1A3D2F]" />
            <h2 className="text-lg font-serif font-bold text-[#1A3D2F]">Startup Idea Details</h2>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={handleResetForm}
              className="text-slate-600 hover:text-[#1A3D2F] font-semibold px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#E5E2D9]/40 transition-colors flex items-center gap-1 border border-[#E5E2D9]"
              title="Reset all form fields"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Form</span>
            </button>
            <span className="text-slate-400 hidden sm:inline">* Required fields</span>
          </div>
        </div>

        {/* Title & Industry */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 font-mono">
              Startup Title / Concept Name *
            </label>
            <input
              id="input-title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., LexiGuard AI: Contract Risk Auditor for SMBs"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E2D9] text-[#1A3D2F] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A3D2F] focus:border-[#1A3D2F] transition-all text-sm font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 font-mono">Industry / Domain</label>
            <select
              id="input-industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E2D9] text-[#1A3D2F] focus:outline-none focus:ring-2 focus:ring-[#1A3D2F] focus:border-[#1A3D2F] text-sm font-semibold"
            >
              <option value="SaaS & Developer Tools">SaaS & Developer Tools</option>
              <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
              <option value="FinTech & InsurTech">FinTech & InsurTech</option>
              <option value="HealthTech & Digital Health">HealthTech & Digital Health</option>
              <option value="LegalTech & Compliance">LegalTech & Compliance</option>
              <option value="CleanTech & Renewable Energy">CleanTech & Renewable Energy</option>
              <option value="E-Commerce & B2B Marketplaces">E-Commerce & B2B Marketplaces</option>
              <option value="HR Tech & Workplace Productivity">HR Tech & Workplace Productivity</option>
              <option value="EdTech & Learning Platforms">EdTech & Learning Platforms</option>
            </select>
          </div>
        </div>

        {/* Target Audience & Monetization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#A98453]" />
              <span>Target Audience / Customer Persona</span>
            </label>
            <input
              id="input-target-audience"
              type="text"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              placeholder="e.g., Small business owners, freelance directors, non-tech founders"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E2D9] text-[#1A3D2F] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A3D2F] text-sm font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-700" />
              <span>Monetization / Business Model</span>
            </label>
            <input
              id="input-monetization"
              type="text"
              value={formData.monetizationModel}
              onChange={(e) => setFormData({ ...formData, monetizationModel: e.target.value })}
              placeholder="e.g., $49/month SaaS subscription or 10% commission per deal"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E2D9] text-[#1A3D2F] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A3D2F] text-sm font-semibold"
            />
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 font-mono">
              Detailed Idea Description & Core Value Proposition *
            </label>
            <span className="text-[11px] text-slate-450 font-serif italic">Explain what it does, how it works, and key features</span>
          </div>
          <textarea
            id="input-description"
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the product experience, core features, and how it solves the problem for users..."
            className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E5E2D9] text-[#1A3D2F] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A3D2F] text-sm font-body leading-relaxed"
          />
        </div>

        {/* Problem Statement */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 font-mono">Problem Statement (Why do existing solutions fail?)</label>
          <textarea
            id="input-problem-statement"
            rows={2}
            value={formData.problemStatement}
            onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
            placeholder="What current manual pain point or frustration causes customers to seek a better solution?"
            className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E2D9] text-[#1A3D2F] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A3D2F] text-sm font-body leading-relaxed"
          />
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
            <Search className="w-4 h-4 text-[#A98453]" />
            <span>Target Search Keywords (for Google Trends & Community Crawls)</span>
          </label>
          <div className="flex gap-2">
            <input
              id="input-keyword-tag"
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
              placeholder="e.g. contract scanner, legal risk AI, small business lawyer"
              className="flex-1 px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5E2D9] text-[#1A3D2F] placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D2F]"
            />
            <button
              type="button"
              id="btn-add-keyword"
              onClick={handleAddKeyword}
              className="px-4 py-2 bg-[#1A3D2F] hover:bg-[#153025] text-white rounded-xl font-bold text-xs font-mono transition-colors"
            >
              Add Keyword
            </button>
          </div>

          {formData.keywords && formData.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A3D2F]/5 text-[#1A3D2F] border border-[#1A3D2F]/20 text-xs font-bold font-mono"
                >
                  #{kw}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="hover:text-red-600 text-[#A98453] font-black ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#E5E2D9]">
          <button
            type="submit"
            id="btn-submit-validation"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-xl bg-[#1A3D2F] hover:bg-[#153025] text-white font-bold text-base shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="font-mono text-sm">Orchestrating Live Data Connectors...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 text-[#C5A880] animate-pulse" />
                <span className="font-serif">Launch StartupSense Validation Engine</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
