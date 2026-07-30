import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import NavigationTabs from './components/NavigationTabs.jsx';
import StatCardGrid from './components/StatCardGrid.jsx';
import TabOverview from './components/TabOverview.jsx';
import TabNucleotideViewer from './components/TabNucleotideViewer.jsx';
import TabMutationStudio from './components/TabMutationStudio.jsx';
import TabQuantumLab from './components/TabQuantumLab.jsx';
import TabMotifMatrix from './components/TabMotifMatrix.jsx';
import TabAIReport from './components/TabAIReport.jsx';
import UploadModal from './components/UploadModal.jsx';
import QuantumLoaderModal from './components/QuantumLoaderModal.jsx';

import { SampleDatasets } from './utils/sampleData.js';
import { DNAEngine } from './utils/dnaEngine.js';
import { MutationDetector } from './utils/mutationDetector.js';
import { MotifFinder } from './utils/motifFinder.js';
import { QuantumSimulator } from './utils/quantumSimulator.js';
import { AISummaryEngine } from './utils/aiSummaryEngine.js';
import { PDFExporter } from './utils/pdfExporter.js';

// Synchronous initial analysis calculator so dashboards never start blank
function computeInitialAnalysis() {
  try {
    const dataset = SampleDatasets.brca1;
    const parsedRef = DNAEngine.parseInput(dataset.referenceSequence);
    const parsedCand = DNAEngine.parseInput(dataset.candidateSequence);
    const stats = DNAEngine.calculateStats(parsedCand.cleanedSequence);
    const mutationResults = MutationDetector.detectMutations(
      parsedRef.cleanedSequence,
      parsedCand.cleanedSequence
    );
    const motifs = MotifFinder.findMotifs(parsedCand.cleanedSequence);
    const alignment = MotifFinder.alignSequences(
      parsedRef.cleanedSequence,
      parsedCand.cleanedSequence
    );
    const quantumResults = QuantumSimulator.runQuantumAnalysis(
      parsedRef.cleanedSequence,
      parsedCand.cleanedSequence
    );
    const aiSummary = AISummaryEngine.generateSummary(
      stats,
      mutationResults,
      motifs,
      quantumResults,
      dataset.header
    );

    return {
      timestamp: new Date().toLocaleTimeString(),
      sequenceInfo: { header: dataset.header, fileType: dataset.fileType },
      stats,
      mutationResults,
      motifs,
      alignment,
      quantumResults,
      aiSummary
    };
  } catch (e) {
    console.error("Initial analysis error:", e);
    return null;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSample, setSelectedSample] = useState("brca1");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [loaderStepText, setLoaderStepText] = useState("Validating sequence integrity...");
  const [loaderProgress, setLoaderProgress] = useState(20);

  // Compute initial state synchronously
  const initialResult = useMemo(() => computeInitialAnalysis(), []);
  const [currentAnalysis, setCurrentAnalysis] = useState(initialResult);
  const [history, setHistory] = useState(initialResult ? [initialResult] : []);

  const performAnalysis = useCallback((refSeq, candSeq, seqInfo) => {
    const parsedRef = DNAEngine.parseInput(refSeq);
    const parsedCand = DNAEngine.parseInput(candSeq);
    const stats = DNAEngine.calculateStats(parsedCand.cleanedSequence);
    const mutationResults = MutationDetector.detectMutations(
      parsedRef.cleanedSequence,
      parsedCand.cleanedSequence
    );
    const motifs = MotifFinder.findMotifs(parsedCand.cleanedSequence);
    const alignment = MotifFinder.alignSequences(
      parsedRef.cleanedSequence,
      parsedCand.cleanedSequence
    );
    const quantumResults = QuantumSimulator.runQuantumAnalysis(
      parsedRef.cleanedSequence,
      parsedCand.cleanedSequence
    );
    const aiSummary = AISummaryEngine.generateSummary(
      stats,
      mutationResults,
      motifs,
      quantumResults,
      seqInfo.header
    );

    const result = {
      timestamp: new Date().toLocaleTimeString(),
      sequenceInfo: seqInfo,
      stats,
      mutationResults,
      motifs,
      alignment,
      quantumResults,
      aiSummary
    };

    setCurrentAnalysis(result);
    setHistory((prev) => [result, ...prev]);
  }, []);

  const triggerQuantumLoader = useCallback((onComplete) => {
    setIsLoaderOpen(true);
    const steps = [
      { text: "Validating FASTA/TXT sequence integrity...", progress: 20 },
      { text: "Computing GC/AT content & thermodynamic Tm...", progress: 40 },
      { text: "Executing position-by-position mutation search...", progress: 60 },
      { text: "Encoding nucleotides to Qubit State Vectors |ψ⟩...", progress: 80 },
      { text: "Running Qiskit IBM Quantum Circuit Simulation...", progress: 95 },
      { text: "Synthesizing AI Biological Report & PDF Artifacts...", progress: 100 }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLoaderStepText(steps[currentStep].text);
        setLoaderProgress(steps[currentStep].progress);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaderOpen(false);
          onComplete();
        }, 350);
      }
    }, 250);
  }, []);

  const handleSelectSample = (sampleKey) => {
    setSelectedSample(sampleKey);
    const dataset = SampleDatasets[sampleKey];
    if (dataset) {
      triggerQuantumLoader(() => {
        performAnalysis(dataset.referenceSequence, dataset.candidateSequence, {
          header: dataset.header,
          fileType: dataset.fileType
        });
      });
    }
  };

  const handleRunAnalysis = () => {
    const dataset = SampleDatasets[selectedSample] || SampleDatasets.brca1;
    triggerQuantumLoader(() => {
      performAnalysis(dataset.referenceSequence, dataset.candidateSequence, {
        header: dataset.header,
        fileType: dataset.fileType
      });
    });
  };

  const handleProcessCustomSequence = (header, sequence, fileType) => {
    const refSeq = SampleDatasets[selectedSample]
      ? SampleDatasets[selectedSample].referenceSequence
      : SampleDatasets.brca1.referenceSequence;

    triggerQuantumLoader(() => {
      performAnalysis(refSeq, sequence, {
        header,
        fileType
      });
    });
  };

  const handleToggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    document.body.classList.toggle("light-theme", !nextTheme);
  };

  const handleExportPDF = () => {
    if (currentAnalysis) {
      PDFExporter.exportPDF(currentAnalysis);
    }
  };

  const handleExportCSV = () => {
    if (currentAnalysis) {
      PDFExporter.exportCSV(currentAnalysis);
    }
  };

  const handleSelectHistory = (item) => {
    setCurrentAnalysis(item);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar
        selectedSample={selectedSample}
        onSelectSample={handleSelectSample}
        onRunAnalysis={handleRunAnalysis}
        onOpenUpload={() => setIsUploadOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      <HeroSection />

      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        <StatCardGrid analysis={currentAnalysis} />

        {activeTab === "overview" && (
          <TabOverview
            analysis={currentAnalysis}
            history={history}
            onSelectHistory={handleSelectHistory}
          />
        )}

        {activeTab === "sequence" && (
          <TabNucleotideViewer
            candSeq={currentAnalysis ? currentAnalysis.alignment.alignB : ""}
            mutations={currentAnalysis ? currentAnalysis.mutationResults.mutations : []}
          />
        )}

        {activeTab === "mutations" && (
          <TabMutationStudio
            mutationResults={currentAnalysis ? currentAnalysis.mutationResults : null}
          />
        )}

        {activeTab === "quantum" && (
          <TabQuantumLab
            quantumResults={currentAnalysis ? currentAnalysis.quantumResults : null}
          />
        )}

        {activeTab === "motifs" && (
          <TabMotifMatrix
            motifs={currentAnalysis ? currentAnalysis.motifs : []}
          />
        )}

        {activeTab === "ai-report" && (
          <TabAIReport
            analysis={currentAnalysis}
            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
          />
        )}
      </main>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onProcess={handleProcessCustomSequence}
      />

      <QuantumLoaderModal
        isOpen={isLoaderOpen}
        stepText={loaderStepText}
        progress={loaderProgress}
      />

      <footer className="border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500">
        QuantumDNA X • React AI + Quantum Hybrid Genomic Mutation Platform
      </footer>
    </div>
  );
}
