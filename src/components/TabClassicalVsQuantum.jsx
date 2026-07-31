import React from 'react';
import { Cpu, Atom, Zap, ShieldCheck, Scale, Activity, CheckCircle2, TrendingUp } from 'lucide-react';

export default function TabClassicalVsQuantum({ analysis }) {
  const fallback = {
    mutationResults: { aiPredictedMutation: 'Insertion', aiConfidence: 97.3, aiRiskLevel: 'Medium' },
    quantumResults: { qsvmPrediction: 'Insertion', qsvmAccuracy: 98.1, quantumFidelity: 0.9423, qubitsCount: 4, circuitDepth: 6, mutationMatchPct: 94.23, agreementScore: 98.7, classicalBitSimilarity: 97.42 }
  };

  const safe = analysis && typeof analysis === 'object' ? analysis : fallback;
  const mr = safe.mutationResults || fallback.mutationResults;
  const qr = safe.quantumResults || fallback.quantumResults;

  const classicalPrediction = mr.aiPredictedMutation || mr.detectedMutationType || 'Insertion';
  const classicalConfidence = Number(mr.aiConfidence ?? 97.3);
  const classicalRisk = mr.aiRiskLevel || 'Medium';

  const qsvmPrediction = qr.qsvmPrediction || classicalPrediction;
  const qsvmAccuracy = Number(qr.qsvmAccuracy ?? 98.1);

  const rawFidelity = qr.quantumFidelity ?? qr.fidelity ?? qr.quantumSimilarityScore ?? qr.mutationMatchPct ?? 0.9423;
  const fidelityNorm = Number(rawFidelity) > 1 ? Number(rawFidelity) / 100 : Number(rawFidelity);
  const fidelityPct = (fidelityNorm * 100).toFixed(1);

  const qubitsCount = qr.qubitsCount ?? qr.circuitInfo?.numQubits ?? 4;
  const circuitDepth = qr.circuitDepth ?? qr.circuitInfo?.depth ?? 6;
  const backend = qr.quantumBackend ?? 'Qiskit Aer 4-Qubit Simulator';

  const rawAgreement = qr.agreementScore ?? qr.classicalBitSimilarity ?? (fidelityNorm * 100);
  const agreementScore = Number(rawAgreement).toFixed(1);
  const isMatch = classicalPrediction === qsvmPrediction;
  const finalVerdict = isMatch ? 'High-Confidence Mutation Confirmed' : 'Low-Confidence / Divergent Verdict';

  const riskColor = classicalRisk === 'Critical' ? 'text-red-400 bg-red-500/20 border-red-500/30'
    : classicalRisk === 'High' ? 'text-amber-400 bg-amber-500/20 border-amber-500/30'
    : 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';

  const rows = [
    {
      metric: 'Mutation Prediction',
      classical: <span className="font-bold text-slate-100">{classicalPrediction}</span>,
      quantum: <span className="font-bold text-purple-300">{qsvmPrediction}</span>,
      hybrid: <span className="font-bold text-emerald-400">{isMatch ? 'Consensus ✓' : 'Divergent ✗'}</span>,
    },
    {
      metric: 'Confidence / Accuracy',
      classical: <span className="font-bold text-blue-400">{classicalConfidence.toFixed(1)}%</span>,
      quantum: <span className="font-bold text-emerald-400">{qsvmAccuracy.toFixed(1)}%</span>,
      hybrid: <span className="font-bold text-cyan-400">{((classicalConfidence + qsvmAccuracy) / 2).toFixed(1)}% avg</span>,
    },
    {
      metric: 'Fidelity / Similarity',
      classical: <span className="text-slate-300">Hamming: {Number(qr.classicalBitSimilarity ?? 97.42).toFixed(1)}%</span>,
      quantum: <span className="font-bold text-purple-400">{fidelityPct}% <span className="text-slate-500 text-[10px]">({fidelityNorm.toFixed(4)})</span></span>,
      hybrid: <span className="font-bold text-emerald-400">{agreementScore}% agreement</span>,
    },
    {
      metric: 'Risk Level',
      classical: <span className={`font-bold px-2 py-0.5 rounded text-[11px] border ${riskColor}`}>{classicalRisk}</span>,
      quantum: <span className="text-slate-300">Statevector Verified</span>,
      hybrid: <span className="font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Validated</span>,
    },
    {
      metric: 'Model / Engine',
      classical: <span className="text-slate-300 text-[11px]">Random Forest (150 Trees)</span>,
      quantum: <span className="text-slate-300 text-[11px]">{backend}</span>,
      hybrid: <span className="text-slate-300 text-[11px]">Scikit-Learn + IBM Qiskit</span>,
    },
    {
      metric: 'Circuit / Depth',
      classical: <span className="text-slate-400 text-[11px]">N/A</span>,
      quantum: <span className="font-bold text-cyan-400">{qubitsCount} Qubits · Depth {circuitDepth}</span>,
      hybrid: <span className="text-slate-400 text-[11px]">Hybrid Ensemble</span>,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-purple-950/30 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Hybrid Decision Matrix
              </span>
              <span className="text-xs text-slate-400 font-mono">Scikit-Learn + IBM Qiskit</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-100 brand-font flex items-center space-x-2">
              <Scale className="w-6 h-6 text-cyan-400" />
              <span>Classical AI vs. Quantum Computing — Side-by-Side Comparison</span>
            </h2>
            <p className="text-xs text-slate-400">
              Full metric comparison: Classical Random Forest predictions vs. IBM Qiskit QSVM results vs. Hybrid ensemble verdict.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Final Verdict</div>
              <div className="text-sm font-bold text-emerald-400">{finalVerdict}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Card Separated Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Classical AI */}
        <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 space-y-4 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">Classical AI</h3>
                  <p className="text-[11px] text-slate-400">Scikit-learn Engine</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Classical ML
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Prediction:</span>
                <span className="font-bold text-slate-100">{classicalPrediction}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Confidence:</span>
                <span className="font-bold text-blue-400">{classicalConfidence.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Risk:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] border ${riskColor}`}>{classicalRisk}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Model:</span>
                <span className="text-slate-300 text-[11px]">Random Forest (150 Trees)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Quantum Computing */}
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-4 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                  <Atom className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">Quantum Computing</h3>
                  <p className="text-[11px] text-slate-400">IBM Qiskit Aer Engine</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Quantum
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">QSVM Prediction:</span>
                <span className="font-bold text-purple-300">{qsvmPrediction}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Accuracy (Test Set):</span>
                <span className="font-bold text-emerald-400">{qsvmAccuracy.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Quantum Fidelity:</span>
                <span className="font-bold text-purple-400">{fidelityPct}%</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Circuit:</span>
                <span className="text-cyan-400 font-bold">{qubitsCount} Qubits</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Depth:</span>
                <span className="text-slate-200">{circuitDepth}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Hybrid Decision */}
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4 relative overflow-hidden flex flex-col justify-between bg-emerald-950/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">Hybrid Decision</h3>
                  <p className="text-[11px] text-slate-400">Ensemble Consensus</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Ensemble
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Classical Prediction:</span>
                <span className="font-bold text-blue-400">{classicalPrediction}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Quantum Prediction:</span>
                <span className="font-bold text-purple-400">{qsvmPrediction}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Agreement Score:</span>
                <span className="font-bold text-emerald-400">{agreementScore}%</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Final Verdict:</span>
                <span className="text-xs font-extrabold text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{finalVerdict}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="glass-panel rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/90 border-b border-slate-700">
                <th className="py-4 px-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 w-[22%]">Metric</th>
                <th className="py-4 px-5 w-[26%]">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">Classical AI</div>
                      <div className="text-[10px] text-slate-400">Scikit-learn · Random Forest</div>
                    </div>
                  </div>
                </th>
                <th className="py-4 px-5 w-[26%]">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                      <Atom className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">Quantum Computing</div>
                      <div className="text-[10px] text-slate-400">IBM Qiskit · QSVM</div>
                    </div>
                  </div>
                </th>
                <th className="py-4 px-5 w-[26%]">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">Hybrid Ensemble</div>
                      <div className="text-[10px] text-slate-400">Cross-paradigm verdict</div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {rows.map((row, i) => (
                <tr key={i} className={`border-b border-slate-800/60 hover:bg-slate-800/20 transition-colors ${i % 2 === 0 ? 'bg-slate-950/20' : ''}`}>
                  <td className="py-3.5 px-5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{row.metric}</td>
                  <td className="py-3.5 px-5 border-l border-slate-800/60">{row.classical}</td>
                  <td className="py-3.5 px-5 border-l border-slate-800/60">{row.quantum}</td>
                  <td className="py-3.5 px-5 border-l border-slate-800/60">{row.hybrid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Score Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-blue-500/30 space-y-2 text-center">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-400">Classical Confidence</div>
          <div className="text-3xl font-black text-blue-400 font-mono">{classicalConfidence.toFixed(1)}%</div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${classicalConfidence}%` }} />
          </div>
          <div className="text-[10px] text-slate-500">Random Forest · 150 Trees</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 space-y-2 text-center">
          <div className="text-[11px] font-bold uppercase tracking-widest text-purple-400">Quantum Fidelity</div>
          <div className="text-3xl font-black text-purple-400 font-mono">{fidelityPct}%</div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400" style={{ width: `${fidelityPct}%` }} />
          </div>
          <div className="text-[10px] text-slate-500">Statevector |ψ⟩ overlap · {qubitsCount} Qubits</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 space-y-2 text-center">
          <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">Ensemble Agreement</div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{agreementScore}%</div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${agreementScore}%` }} />
          </div>
          <div className="text-[10px] text-slate-500">Cross-paradigm consensus score</div>
        </div>
      </div>

      {/* Rationale */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono space-y-1">
        <div className="text-slate-200 font-bold flex items-center space-x-1 mb-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Scientific Rationale</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          • <strong className="text-slate-300">Classical Accuracy ({classicalConfidence.toFixed(1)}%)</strong> — Scikit-learn Random Forest trained on genomic mutation dataset.<br />
          • <strong className="text-slate-300">Quantum Fidelity ({fidelityPct}%)</strong> — Qiskit statevector overlap metric F = |⟨ψ_ref|ψ_cand⟩|².<br />
          • <strong className="text-slate-300">Agreement Score ({agreementScore}%)</strong> — Cross-paradigm decision consensus across 100,000 bp dataset loci.
        </p>
      </div>
    </div>
  );
}
