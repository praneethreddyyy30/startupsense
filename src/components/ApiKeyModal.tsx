import React from 'react';
import { Key, ExternalLink, X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-slate-100 shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-white">How to Add Your Gemini API Key</h3>
            <p className="text-xs text-slate-400">Unlock live research grounding & unlimited validations</p>
          </div>
        </div>

        {/* Instructions Steps */}
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-300 text-sm">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
              <span>Get your API Key</span>
            </div>
            <p className="pl-7 text-slate-400 leading-relaxed">
              Visit Google AI Studio and create a free API key if you don't already have one:
            </p>
            <div className="pl-7 pt-1">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
              >
                <span>Get Gemini API Key</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-300 text-sm">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
              <span>Add to AI Studio Project Settings</span>
            </div>
            <ol className="pl-7 list-disc space-y-1 text-slate-400 leading-relaxed">
              <li>Click on the <strong>Settings</strong> menu in the upper right header of this AI Studio window.</li>
              <li>Select <strong>Secrets</strong> / <strong>Environment Variables</strong>.</li>
              <li>Set Variable Name: <code className="text-indigo-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded">GEMINI_API_KEY</code></li>
              <li>Paste your API key value and click <strong>Save</strong>.</li>
            </ol>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Automatic Failover Active</span>
            </div>
            <p className="text-[11px] text-emerald-300/80 leading-relaxed">
              StartupSense includes automatic fallback handling. If your quota is temporarily exhausted (429), the app automatically generates offline heuristic market intelligence reports without crashing!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
