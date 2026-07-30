import React from 'react';
import { Atom } from 'lucide-react';

export default function TabQuantumLab({ quantumResults }) {
  if (!quantumResults) return null;

  const {
    quantumSimilarityScore,
    classicalBitSimilarity,
    probabilities = {},
    circuitInfo = {}
  } = quantumResults;

  const gates = circuitInfo.gates || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2 brand-font">
                  <Atom className="w-5 h-5 text-purple-400" />
                  <span>Qiskit 4-Qubit Circuit Simulator</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Encoding 2-bit nucleotides into quantum state vectors |\psi\rangle
                </p>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded border border-purple-500/30">
                Backend: {circuitInfo.backend || "ibmq_qasm_simulator"}
              </span>
            </div>

            <div className="p-6 bg-slate-950/80 rounded-xl border border-slate-800 space-y-4 font-mono text-xs overflow-x-auto">
              <div className="text-cyan-400 font-semibold mb-2">
                Qiskit Quantum Circuit Architecture (4-Qubit Quantum Fourier Transform Register):
              </div>
              
              <div className="flex items-center space-x-2 min-w-[500px]">
                <span className="text-purple-400 font-bold w-12">q₀: |0⟩</span>
                <div className="flex-1 h-0.5 bg-cyan-500/40 flex items-center justify-around px-2">
                  <span className="px-2 py-1 bg-cyan-950 border border-cyan-400 text-cyan-300 rounded shadow">H</span>
                  <span className="px-2 py-1 bg-purple-950 border border-purple-400 text-purple-300 rounded shadow">● (Control)</span>
                  <span className="px-2 py-1 bg-slate-900 border border-slate-700 text-slate-300 rounded shadow">
                    RZ({gates[6] ? gates[6].theta : "0.79 rad"})
                  </span>
                  <span className="px-2 py-1 bg-emerald-950 border border-emerald-400 text-emerald-300 rounded shadow">M 🎛️</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 min-w-[500px]">
                <span className="text-purple-400 font-bold w-12">q₁: |0⟩</span>
                <div className="flex-1 h-0.5 bg-cyan-500/40 flex items-center justify-around px-2">
                  <span className="px-2 py-1 bg-cyan-950 border border-cyan-400 text-cyan-300 rounded shadow">H</span>
                  <span className="px-2 py-1 bg-purple-950 border border-purple-400 text-purple-300 rounded shadow">⊕ (Target)</span>
                  <span className="px-2 py-1 bg-slate-900 border border-slate-700 text-slate-300 rounded shadow">
                    RZ({gates[7] ? gates[7].theta : "0.79 rad"})
                  </span>
                  <span className="px-2 py-1 bg-emerald-950 border border-emerald-400 text-emerald-300 rounded shadow">M 🎛️</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 min-w-[500px]">
                <span className="text-purple-400 font-bold w-12">q₂: |0⟩</span>
                <div className="flex-1 h-0.5 bg-cyan-500/40 flex items-center justify-around px-2">
                  <span className="px-2 py-1 bg-cyan-950 border border-cyan-400 text-cyan-300 rounded shadow">H</span>
                  <span className="px-2 py-1 bg-purple-950 border border-purple-400 text-purple-300 rounded shadow">● (Control)</span>
                  <span className="px-2 py-1 bg-slate-900 border border-slate-700 text-slate-300 rounded shadow">I</span>
                  <span className="px-2 py-1 bg-emerald-950 border border-emerald-400 text-emerald-300 rounded shadow">M 🎛️</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 min-w-[500px]">
                <span className="text-purple-400 font-bold w-12">q₃: |0⟩</span>
                <div className="flex-1 h-0.5 bg-cyan-500/40 flex items-center justify-around px-2">
                  <span className="px-2 py-1 bg-cyan-950 border border-cyan-400 text-cyan-300 rounded shadow">H</span>
                  <span className="px-2 py-1 bg-purple-950 border border-purple-400 text-purple-300 rounded shadow">⊕ (Target)</span>
                  <span className="px-2 py-1 bg-slate-900 border border-slate-700 text-slate-300 rounded shadow">I</span>
                  <span className="px-2 py-1 bg-emerald-950 border border-emerald-400 text-emerald-300 rounded shadow">M 🎛️</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="font-bold text-slate-200">Nucleotide Qubit Mapping Scheme:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                <span className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-400">A → |00⟩</span>
                <span className="p-2 rounded bg-slate-950 border border-slate-800 text-amber-400">C → |01⟩</span>
                <span className="p-2 rounded bg-slate-950 border border-slate-800 text-cyan-400">G → |10⟩</span>
                <span className="p-2 rounded bg-slate-950 border border-slate-800 text-purple-400">T → |11⟩</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 brand-font">Quantum State Vector Fidelity</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Quantum Fidelity Score:</span>
                <span className="text-xl font-black font-mono text-purple-400">{quantumSimilarityScore}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  style={{ width: `${quantumSimilarityScore}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>Classical Hamming: {classicalBitSimilarity}%</span>
                <span>Phase Shift Superposition Overlap</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 brand-font">
              Qubit State Vector Measurement Probabilities
            </h3>
            <div className="space-y-4">
              {Object.entries(probabilities).map(([st, prob]) => {
                const pct = (prob * 100).toFixed(1);
                return (
                  <div key={st} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-slate-300">
                      <span>{st}</span>
                      <span className="text-cyan-400 font-bold">{pct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        style={{ width: `${Math.min(prob * 100 * 3.2, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
