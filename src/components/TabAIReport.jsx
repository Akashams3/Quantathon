import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';

export default function TabAIReport({ analysis, onExportPDF, onExportCSV }) {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-100 brand-font">Download Analytical Research Artifacts</h3>
            <p className="text-xs text-slate-400">
              Export publication-ready PDF reports and structured raw CSV dataset files.
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onExportPDF}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </button>
            <button
              onClick={onExportCSV}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3 text-xs text-slate-400">
          <div className="font-bold text-slate-200">PDF & Data Export Document Features:</div>
          <ul className="list-disc list-inside space-y-1">
            <li>Includes complete sequence header metadata & length statistics.</li>
            <li>Contains automated AI Biological Research synthesis & clinical recommendations.</li>
            <li>Includes Qiskit quantum circuit parameters & inner product fidelity scores.</li>
            <li>Contains position-by-position mutation table and K-mer motif distribution.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
