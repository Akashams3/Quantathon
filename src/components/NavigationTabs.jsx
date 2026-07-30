import React from 'react';
import { LayoutDashboard, Dna, GitCommit, Atom, Repeat, FileText } from 'lucide-react';

export default function NavigationTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: "overview", label: "Overview & Dashboard", Icon: LayoutDashboard, color: "text-slate-300" },
    { id: "sequence", label: "Nucleotide Viewer", Icon: Dna, color: "text-slate-300" },
    { id: "mutations", label: "Mutation Studio", Icon: GitCommit, color: "text-slate-300" },
    { id: "quantum", label: "Qiskit Quantum Lab", Icon: Atom, color: "text-purple-400" },
    { id: "motifs", label: "Pattern & Motif Matrix", Icon: Repeat, color: "text-emerald-400" },
    { id: "ai-report", label: "AI Report & PDF Export", Icon: FileText, color: "text-amber-400" }
  ];

  return (
    <nav className="bg-slate-900/90 border-b border-slate-800 px-6 backdrop-blur sticky top-[61px] z-30">
      <div className="max-w-7xl mx-auto flex space-x-1 overflow-x-auto text-xs font-semibold py-2">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          const TabIcon = t.Icon;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-400 border-b-2 border-cyan-500 shadow-sm"
                  : "text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40"
              }`}
            >
              <TabIcon className={`w-4 h-4 ${t.color}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
