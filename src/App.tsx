import React, { useState, useEffect } from 'react';
import { StartupIdeaInput, ValidationReport } from './types';
import { Navbar } from './components/Navbar';
import { IdeaInputForm } from './components/IdeaInputForm';
import { ResearchOrchestratorModal } from './components/ResearchOrchestratorModal';
import { ValidationReportView } from './components/ValidationReportView';
import { SavedReportsModal } from './components/SavedReportsModal';
import { ComparisonView } from './components/ComparisonView';
import { ApiKeyModal } from './components/ApiKeyModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'input' | 'report' | 'saved' | 'compare'>('input');
  const [activeReport, setActiveReport] = useState<ValidationReport | null>(null);
  const [savedReports, setSavedReports] = useState<ValidationReport[]>([]);
  const [isOrchestrating, setIsOrchestrating] = useState<boolean>(false);
  const [currentValidatingTitle, setCurrentValidatingTitle] = useState<string>('');
  const [comparisonPair, setComparisonPair] = useState<[ValidationReport, ValidationReport] | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [formKey, setFormKey] = useState<number>(0);
  const [streamEvents, setStreamEvents] = useState<any[]>([]);

  const handleNewValidation = () => {
    setIsOrchestrating(false);
    setIsApiKeyModalOpen(false);
    setFormKey((prev) => prev + 1);
    setStreamEvents([]);
    setActiveTab('input');
    
    setTimeout(() => {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        window.scrollTo(0, 0);
      }
      const titleInput = document.getElementById('input-title');
      if (titleInput) {
        titleInput.focus();
      }
    }, 50);
  };

  // Load saved reports from backend on mount
  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSavedReports(data);
        }
      })
      .catch((err) => console.log('Saved reports init:', err));
  }, []);

  const handleValidateIdea = (input: StartupIdeaInput) => {
    setCurrentValidatingTitle(input.title);
    setStreamEvents([]);
    setIsOrchestrating(true);

    fetch('/api/validate-start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to start validation session.');
        }
        return res.json();
      })
      .then((data) => {
        const { validationId } = data;
        const eventSource = new EventSource(`/api/validate-stream?validationId=${validationId}`);

        eventSource.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            if (payload.error) {
              throw new Error(payload.error);
            }

            setStreamEvents((prev) => [...prev, payload]);

            if (payload.stage === 'gemini_synthesis' && payload.status === 'completed' && payload.report) {
              const report: ValidationReport = payload.report;
              setActiveReport(report);
              setSavedReports((prev) => [report, ...prev.filter((r) => r.id !== report.id)]);
              setActiveTab('report');
              eventSource.close();
              setIsOrchestrating(false);
            }
          } catch (err: any) {
            alert(`Validation error: ${err.message || 'Stream error occurred'}`);
            eventSource.close();
            setIsOrchestrating(false);
          }
        };

        eventSource.onerror = (err) => {
          console.error('EventSource closed/failed:', err);
          eventSource.close();
          setIsOrchestrating(false);
          alert('Failed to connect to validation stream. Please check server logs.');
        };
      })
      .catch((err: any) => {
        console.error('Failed to initiate validation:', err);
        alert(`Validation error: ${err.message || 'Failed to start validation session'}`);
        setIsOrchestrating(false);
      });
  };

  const handleSaveReport = (report: ValidationReport) => {
    if (!savedReports.some((r) => r.id === report.id)) {
      setSavedReports([report, ...savedReports]);
      fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      }).catch(console.error);
    }
  };

  const handleDeleteReport = (id: string) => {
    setSavedReports(savedReports.filter((r) => r.id !== id));
    if (activeReport?.id === id) {
      setActiveReport(null);
      if (activeTab === 'report') setActiveTab('input');
    }
    fetch(`/api/reports/${id}`, {
      method: 'DELETE',
    }).catch(console.error);
  };

  const handleCompareSelect = (id1: string, id2: string) => {
    const r1 = savedReports.find((r) => r.id === id1);
    const r2 = savedReports.find((r) => r.id === id2);
    if (r1 && r2) {
      setComparisonPair([r1, r2]);
      setActiveTab('compare');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-sans antialiased selection:bg-[#1A3D2F] selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedReports.length}
        onNewValidation={handleNewValidation}
        hasActiveReport={!!activeReport}
      />

      {/* Main Content View Switcher */}
      <main className="pb-16">
        {activeTab === 'input' && (
          <IdeaInputForm key={formKey} onSubmit={handleValidateIdea} isLoading={isOrchestrating} />
        )}

        {activeTab === 'report' && activeReport && (
          <ValidationReportView
            report={activeReport}
            onSaveReport={handleSaveReport}
            isSaved={savedReports.some((r) => r.id === activeReport.id)}
            onNewValidation={handleNewValidation}
          />
        )}

        {activeTab === 'saved' && (
          <SavedReportsModal
            reports={savedReports}
            onSelectReport={(r) => {
              setActiveReport(r);
              setActiveTab('report');
            }}
            onDeleteReport={handleDeleteReport}
            onCompareSelect={handleCompareSelect}
            onNewValidation={handleNewValidation}
          />
        )}

        {activeTab === 'compare' && comparisonPair && (
          <ComparisonView
            report1={comparisonPair[0]}
            report2={comparisonPair[1]}
            onBackToSaved={() => setActiveTab('saved')}
          />
        )}

        {activeTab === 'compare' && !comparisonPair && (
          <div className="max-w-md mx-auto my-16 p-8 text-center bg-white border border-[#E5E2D9] rounded-2xl">
            <p className="text-slate-650 text-sm mb-4 font-body">
              Select two reports from your saved history to perform a side-by-side comparison.
            </p>
            <button
              onClick={() => setActiveTab('saved')}
              className="px-4 py-2 bg-[#1A3D2F] hover:bg-[#153025] text-white rounded-xl font-bold text-xs font-mono cursor-pointer"
            >
              Go to Saved Reports
            </button>
          </div>
        )}
      </main>

      {/* Real-time Research Orchestrator Modal */}
      <ResearchOrchestratorModal
        isOpen={isOrchestrating}
        ideaTitle={currentValidatingTitle}
        streamEvents={streamEvents}
      />

      {/* API Key Instructions Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
}
