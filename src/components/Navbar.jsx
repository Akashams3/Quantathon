import React from 'react';
import { Dna, Sparkles, Upload, Sun, Moon } from 'lucide-react';

export default function Navbar({
  selectedSample,
  onSelectSample,
  onRunAnalysis,
  onOpenUpload,
  isDarkMode,
  onToggleTheme,
  isBackendOnline
}) {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Dna className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent brand-font">
              QuantumDNA X
            </h1>
            {isBackendOnline ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" title="Connected to FastAPI + MySQL Backend (http://127.0.0.1:8000)">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
                Backend API Connected
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30" title="FastAPI Backend offline (Running in local browser mode)">
                Local Mode
              </span>
            )}
          </div>
          <p className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">AI + Quantum Hybrid Genomic Platform</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
          <span className="text-slate-400">Sample Locus:</span>
          <select
            value={selectedSample}
            onChange={(e) => onSelectSample(e.target.value)}
            className="bg-transparent text-cyan-400 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="brca1" className="bg-slate-900 text-slate-100">Human BRCA1 Exon 11</option>
            <option value="sarscov2" className="bg-slate-900 text-slate-100">SARS-CoV-2 Spike RBD</option>
            <option value="huntington" className="bg-slate-900 text-slate-100">Huntington HTT CAG Expansion</option>
            <option value="crispr" className="bg-slate-900 text-slate-100">CRISPR-Cas9 Benchmark Site</option>
          </select>
        </div>

        <button
          onClick={onRunAnalysis}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Run Analysis</span>
        </button>

        <button
          onClick={onOpenUpload}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:inline">Upload FASTA</span>
        </button>

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
          title="Toggle Light/Dark Theme"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-purple-400" />
          )}
        </button>
      </div>
    </header>
  );
}
