import React, { useEffect, useState, useRef } from 'react';
import { 
  Terminal,
  ShieldCheck,
  Globe2,
  Play,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ResearchOrchestratorModalProps {
  isOpen: boolean;
  ideaTitle: string;
  streamEvents: any[];
}

export const ResearchOrchestratorModal: React.FC<ResearchOrchestratorModalProps> = ({
  isOpen,
  ideaTitle,
  streamEvents = []
}) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Determine current active step index for visual timeline
  // Steps: 0 = Idle/Und., 1 = Google Trends, 2 = Reddit/HN, 3 = GitHub, 4 = Competitor/Synthesizing
  const getActiveStep = () => {
    if (streamEvents.length === 0) return 0;
    const lastEvent = streamEvents[streamEvents.length - 1];
    
    if (lastEvent.stage === 'understanding') return 0;
    if (lastEvent.stage === 'google_trends') return 1;
    if (lastEvent.stage === 'google_autocomplete') return 2;
    if (lastEvent.stage === 'reddit_community') return 3;
    if (lastEvent.stage === 'github_tech') return 4;
    if (lastEvent.stage === 'product_hunt_auditor') return 5;
    if (lastEvent.stage === 'domain_check' || lastEvent.stage === 'gemini_synthesis') return 6;
    return 0;
  };

  const activeStep = getActiveStep();

  // Accumulate terminal logs in real-time as streamEvents grow
  useEffect(() => {
    if (!isOpen) {
      setTerminalLogs([]);
      setElapsedTime(0);
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (streamEvents.length === 0) {
      setTerminalLogs(['[SYSTEM] Initializing Validation Pipeline...', '[SYSTEM] Waiting for backend stream...']);
      return;
    }

    const lastEvent = streamEvents[streamEvents.length - 1];
    const newLogs: string[] = [];

    // Format current stage title
    const stageTag = `[${lastEvent.stage.toUpperCase()}]`;

    // Process new logs
    if (lastEvent.status === 'active' && lastEvent.logs) {
      lastEvent.logs.forEach((log: string) => {
        newLogs.push(`${stageTag} ${log}`);
      });
    } else if (lastEvent.status === 'completed') {
      newLogs.push(`${stageTag} Stage completed successfully.`);
      
      // Inject real crawler data outputs into terminal logs
      if (lastEvent.stage === 'google_autocomplete' && lastEvent.data) {
        newLogs.push(`[AUTOCOMPLETE] Found related user searches.`);
        (lastEvent.data || []).forEach((s: string) => {
          newLogs.push(`   › Suggestion: "${s}"`);
        });
      }
      if (lastEvent.stage === 'reddit_community' && lastEvent.data) {
        newLogs.push(`[REDDIT] Crawled ${lastEvent.data.count} recent community discussions.`);
        lastEvent.data.posts?.forEach((post: any) => {
          newLogs.push(`   › Found post: "${post.title}" in ${post.subreddit}`);
        });
      }
      if (lastEvent.stage === 'hn_feedback' && lastEvent.data) {
        newLogs.push(`[HACKER_NEWS] Gathered developer threads.`);
        lastEvent.data.posts?.forEach((post: any) => {
          newLogs.push(`   › Thread: "${post.title}" (${post.points} points, ${post.commentsCount} comments)`);
        });
      }
      if (lastEvent.stage === 'github_tech' && lastEvent.data) {
        newLogs.push(`[GITHUB] Analyzed repositories.`);
        lastEvent.data.repos?.forEach((repo: any) => {
          newLogs.push(`   › Repo: ${repo.name} | Star count: ★${repo.stars} | Language: ${repo.language}`);
        });
      }
      if (lastEvent.stage === 'product_hunt_auditor') {
        newLogs.push(`[PRODUCT_HUNT] Searched launch database for similar concepts.`);
        newLogs.push(`[INDIE_HACKERS] Scanned failure post-mortems and revenue case studies.`);
      }
      if (lastEvent.stage === 'domain_check' && lastEvent.data) {
        newLogs.push(`[DNS_DOMAIN] Resolved availability status:`);
        lastEvent.data.forEach((dom: any) => {
          newLogs.push(`   › ${dom.domain} ── ${dom.available ? 'AVAILABLE' : 'REGISTERED'}`);
        });
      }
    }

    setTerminalLogs((prev) => {
      // Avoid duplicate logs from same state updates
      const filteredNewLogs = newLogs.filter(n => !prev.includes(n));
      if (filteredNewLogs.length === 0) return prev;
      return [...prev, ...filteredNewLogs];
    });
  }, [streamEvents]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  if (!isOpen) return null;

  // Visual Coordinates matching the User Mockup Brackets and Ticks
  // Width bounds: Trends = 15%, Reddit = 40%, GitHub = 65%, Competitors = 90%
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#E5E2D9] rounded-3xl max-w-4xl w-full p-6 sm:p-8 text-slate-800 shadow-2xl overflow-hidden relative">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E5E2D9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A3D2F]/10 border border-[#1A3D2F]/20 flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-[#1A3D2F] animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1A3D2F]">Live Research Orchestrator</h3>
              <p className="text-xs text-slate-500 font-body">Validating Concept: <span className="text-[#A98453] font-bold font-mono">{ideaTitle}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E5E2D9] text-xs font-mono">
            <span className="text-slate-500 font-medium">Pipeline Time:</span>
            <span className="text-emerald-700 font-bold">{elapsedTime}s</span>
          </div>
        </div>
        {/* Visual Progress Timeline (Direct layout of the User Mockup Drawing expanded to 6 stages) */}
        <div className="py-6 bg-white rounded-2xl border border-[#E5E2D9] px-4 my-6 select-none relative shadow-sm">
          
          {/* Neon Diagram Canvas */}
          <div className="w-full h-24 relative">
            <svg className="w-full h-full" viewBox="0 0 800 100" preserveAspectRatio="none">
              
              {/* Upper Bracket Path (Trends to Reddit connection) */}
              <path 
                d="M 100 20 L 100 10 L 340 10 L 340 20" 
                fill="none" 
                stroke={activeStep >= 3 ? '#1A3D2F' : '#E5E2D9'} 
                strokeWidth="2"
                strokeDasharray={activeStep < 3 ? "4 4" : "0"}
                className="transition-colors duration-500"
              />
 
              {/* Lower Timeline connection bar (Spans all the way from Trends to Synthesis) */}
              <path 
                d="M 100 85 L 100 95 L 700 95 L 700 85" 
                fill="none" 
                stroke={activeStep >= 6 ? '#A98453' : '#E5E2D9'} 
                strokeWidth="2"
                strokeDasharray={activeStep < 6 ? "4 4" : "0"}
                className="transition-colors duration-500"
              />
 
              {/* Middle Main connector line */}
              <line 
                x1="100" y1="50" x2="700" y2="50" 
                stroke="#F1EFEA" 
                strokeWidth="3" 
              />
              
              {/* Active Step colored segment */}
              <line 
                x1="100" y1="50" 
                x2={activeStep === 0 ? 100 : activeStep === 1 ? 100 : activeStep === 2 ? 220 : activeStep === 3 ? 340 : activeStep === 4 ? 460 : activeStep === 5 ? 580 : 700} 
                y2="50" 
                stroke="#1A3D2F" 
                strokeWidth="3" 
                className="transition-all duration-700 ease-in-out"
              />
 
              {/* Mockup Tick Marks */}
              <circle cx="100" cy="50" r="5" fill={activeStep >= 1 ? '#1A3D2F' : '#E5E2D9'} />
              <circle cx="220" cy="50" r="5" fill={activeStep >= 2 ? '#1A3D2F' : '#E5E2D9'} />
              <circle cx="340" cy="50" r="5" fill={activeStep >= 3 ? '#1A3D2F' : '#E5E2D9'} />
              <circle cx="460" cy="50" r="5" fill={activeStep >= 4 ? '#1A3D2F' : '#E5E2D9'} />
              <circle cx="580" cy="50" r="5" fill={activeStep >= 5 ? '#1A3D2F' : '#E5E2D9'} />
              <circle cx="700" cy="50" r="5" fill={activeStep >= 6 ? '#A98453' : '#E5E2D9'} />
            </svg>
 
            {/* Downward Triangles / Carets indicating active processing */}
            <div className="absolute inset-0 pointer-events-none">
              
              {/* Caret 1: Google Trends */}
              <div 
                className={`absolute top-[28px] left-[12.5%] -translate-x-1/2 transition-all duration-300 ${
                  activeStep === 1 ? 'opacity-100 scale-100 animate-bounce' : 'opacity-0 scale-75'
                }`}
              >
                <div className="text-[#1A3D2F] font-bold text-base">▼</div>
              </div>
 
              {/* Caret 2: Autocomplete */}
              <div 
                className={`absolute top-[28px] left-[27.5%] -translate-x-1/2 transition-all duration-300 ${
                  activeStep === 2 ? 'opacity-100 scale-100 animate-bounce' : 'opacity-0 scale-75'
                }`}
              >
                <div className="text-[#1A3D2F] font-bold text-base">▼</div>
              </div>
 
              {/* Caret 3: Reddit & HN */}
              <div 
                className={`absolute top-[28px] left-[42.5%] -translate-x-1/2 transition-all duration-300 ${
                  activeStep === 3 ? 'opacity-100 scale-100 animate-bounce' : 'opacity-0 scale-75'
                }`}
              >
                <div className="text-[#1A3D2F] font-bold text-base">▼</div>
              </div>
 
              {/* Caret 4: GitHub Stack */}
              <div 
                className={`absolute top-[28px] left-[57.5%] -translate-x-1/2 transition-all duration-300 ${
                  activeStep === 4 ? 'opacity-100 scale-100 animate-bounce' : 'opacity-0 scale-75'
                }`}
              >
                <div className="text-[#1A3D2F] font-bold text-base">▼</div>
              </div>

              {/* Caret 5: Product Hunt & IH */}
              <div 
                className={`absolute top-[28px] left-[72.5%] -translate-x-1/2 transition-all duration-300 ${
                  activeStep === 5 ? 'opacity-100 scale-100 animate-bounce' : 'opacity-0 scale-75'
                }`}
              >
                <div className="text-[#1A3D2F] font-bold text-base">▼</div>
              </div>
 
              {/* Caret 6: Competitor Search / Synthesis */}
              <div 
                className={`absolute top-[28px] left-[87.5%] -translate-x-1/2 transition-all duration-300 ${
                  activeStep === 6 ? 'opacity-100 scale-100 animate-bounce' : 'opacity-0 scale-75'
                }`}
              >
                <div className="text-[#A98453] font-bold text-base">▼</div>
              </div>
            </div>
 
            {/* Labels beneath ticks (hidden on small screens to prevent overlap) */}
            <div className="absolute top-[62px] inset-x-0 hidden sm:flex justify-between px-[3%] text-[9px] font-bold tracking-wide text-slate-400 font-mono">
              <span className={`w-20 text-center transition-colors ${activeStep === 1 ? 'text-[#1A3D2F]' : activeStep > 1 ? 'text-slate-650' : ''}`}>Google Trends</span>
              <span className={`w-20 text-center transition-colors ${activeStep === 2 ? 'text-[#1A3D2F]' : activeStep > 2 ? 'text-slate-655' : ''}`}>Autocomplete</span>
              <span className={`w-20 text-center transition-colors ${activeStep === 3 ? 'text-[#1A3D2F]' : activeStep > 3 ? 'text-slate-655' : ''}`}>Reddit & HN</span>
              <span className={`w-20 text-center transition-colors ${activeStep === 4 ? 'text-[#1A3D2F]' : activeStep > 4 ? 'text-slate-655' : ''}`}>GitHub Stack</span>
              <span className={`w-24 text-center transition-colors ${activeStep === 5 ? 'text-[#1A3D2F]' : activeStep > 5 ? 'text-slate-655' : ''}`}>Product Hunt & IH</span>
              <span className={`w-24 text-center transition-colors ${activeStep === 6 ? 'text-[#A98453] font-extrabold' : ''}`}>Competitor Synthesis</span>
            </div>
          </div>

          {/* Mobile active step label */}
          <div className="sm:hidden text-center text-[10px] font-mono font-bold text-[#1A3D2F] mt-2 border-t border-[#E5E2D9]/40 pt-2 animate-pulse">
            Active Agent: {activeStep === 0 && 'Extracting inputs...'}
            {activeStep === 1 && 'Google Trends Engine'}
            {activeStep === 2 && 'Google Autocomplete'}
            {activeStep === 3 && 'Reddit & HN Miner'}
            {activeStep === 4 && 'GitHub Tech Stack'}
            {activeStep === 5 && 'Product Hunt & IH Auditor'}
            {activeStep === 6 && 'Competitor Synthesis'}
          </div>
        </div>
 
        {/* Live Terminal Log Stream Panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-605 px-1 font-mono">
            <span className="flex items-center gap-1.5 text-[#1A3D2F] font-bold">
              <Terminal className="w-3.5 h-3.5 text-[#1A3D2F]" />
              <span>Real-Time Research Agent Logs</span>
            </span>
            <span className="text-slate-450 text-[10px]">Auto-scrolling stream active</span>
          </div>
 
          <div className="h-64 overflow-y-auto bg-[#1F2B3E] border border-[#E5E2D9] rounded-2xl p-4 font-mono text-[11px] text-slate-200 leading-relaxed shadow-inner space-y-1.5 scrollbar-thin">
            {terminalLogs.map((log, i) => {
              let color = 'text-slate-300';
              if (log.includes('[SYSTEM]')) color = 'text-white font-semibold';
              else if (log.includes('[REDDIT]')) color = 'text-orange-600';
              else if (log.includes('[HACKER_NEWS]')) color = 'text-amber-600';
              else if (log.includes('[GITHUB]')) color = 'text-cyan-600';
              else if (log.includes('[AUTOCOMPLETE]')) color = 'text-[#A98453] font-bold';
              else if (log.includes('[PRODUCT_HUNT]')) color = 'text-rose-700 font-bold';
              else if (log.includes('[INDIE_HACKERS]')) color = 'text-emerald-700 font-bold';
              else if (log.includes('[DNS_DOMAIN]')) color = 'text-purple-600';
              else if (log.includes('[GEMINI_SYNTHESIS]')) color = 'text-emerald-700 font-bold';
 
              return (
                <div key={i} className={`flex items-start gap-2 animate-fadeIn ${color}`}>
                  <span className="opacity-40 select-none">[{i.toString().padStart(3, '0')}]</span>
                  <span className="opacity-70">›</span>
                  <span className="flex-1 whitespace-pre-wrap">{log}</span>
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>
        </div>
 
        {/* Footer Progress info */}
        <div className="pt-5 mt-6 border-t border-[#E5E2D9] flex items-center justify-between text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            {activeStep === 6 ? (
              <CheckCircle className="w-4.5 h-4.5 text-emerald-700 animate-pulse" />
            ) : (
              <Play className="w-4 h-4 text-[#1A3D2F] animate-pulse" />
            )}
            <span className="font-bold text-[#1A3D2F]">
              {activeStep === 0 && 'Extracting inputs...'}
              {activeStep === 1 && 'Querying Trends indices...'}
              {activeStep === 2 && 'Mining search query autocomplete suggestions...'}
              {activeStep === 3 && 'Scraping Reddit and HN forums...'}
              {activeStep === 4 && 'Evaluating GitHub developer framework adoption...'}
              {activeStep === 5 && 'Auditing Product Hunt & Indie Hackers launch history...'}
              {activeStep === 6 && 'Synthesizing final validation report with Gemini...'}
            </span>
          </div>
          <span className="text-[10px] text-slate-455 font-bold">
            {activeStep === 6 ? 'Normalizing report details...' : 'Fetching live data...'}
          </span>
        </div>
      </div>
    </div>
  );
};
