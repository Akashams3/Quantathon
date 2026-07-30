import React from 'react';

export default function StatCardGrid({ analysis }) {
  if (!analysis) return null;

  const { stats, mutationResults, quantumResults, motifs } = analysis;

  const cards = [
    { title: "Sequence Length", value: `${stats.length}`, sub: "Base Pairs (bp)", valColor: "text-slate-100", titleColor: "text-slate-400" },
    { title: "Mutations Found", value: `${mutationResults.summary.totalMutations}`, sub: "Point Variants", valColor: "text-rose-400", titleColor: "text-rose-400", border: "border-rose-500/20" },
    { title: "Mutation Density", value: `${mutationResults.summary.mutationRate}%`, sub: "Genomic Frequency", valColor: "text-amber-400", titleColor: "text-amber-400" },
    { title: "GC Content", value: `${stats.gcContent}%`, sub: "Thermal Stability", valColor: "text-emerald-400", titleColor: "text-emerald-400" },
    { title: "AT Content", value: `${stats.atContent}%`, sub: "Complement %", valColor: "text-cyan-400", titleColor: "text-cyan-400" },
    { title: "Quantum Similarity", value: `${quantumResults.quantumSimilarityScore}%`, sub: "Qiskit Fidelity |ψ⟩", valColor: "text-purple-400", titleColor: "text-purple-400", border: "border-purple-500/20" },
    { title: "Genomic Stability", value: `${mutationResults.summary.genomicStability}%`, sub: "Conservation Index", valColor: "text-cyan-300", titleColor: "text-cyan-300" },
    { title: "Motifs Discovered", value: `${motifs.length}`, sub: "K-mer Repeats", valColor: "text-emerald-300", titleColor: "text-emerald-300" }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      {cards.map((c, i) => (
        <div key={i} className={`glass-card rounded-xl p-3.5 space-y-1 ${c.border || ""}`}>
          <div className={`text-[10px] font-bold uppercase tracking-wider ${c.titleColor}`}>
            {c.title}
          </div>
          <div className={`text-xl font-extrabold font-mono ${c.valColor}`}>
            {c.value}
          </div>
          <div className="text-[10px] text-slate-500">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
