import React, { useState, useEffect } from 'react';
import { Dna, Activity, Cpu, Sparkles } from 'lucide-react';

export default function QuantumLoaderModal({ isOpen, stepText, progress }) {
  const [baseStream, setBaseStream] = useState([]);
  const [qScore, setQScore] = useState(99.7);

  useEffect(() => {
    if (!isOpen) return;

    const bases = ["A", "T", "G", "C"];
    const colors = {
      A: "text-emerald-400 border-emerald-500/40 bg-emerald-950/40",
      T: "text-amber-400 border-amber-500/40 bg-amber-950/40",
      G: "text-cyan-400 border-cyan-500/40 bg-cyan-950/40",
      C: "text-purple-400 border-purple-500/40 bg-purple-950/40"
    };

    const interval = setInterval(() => {
      const nextBase = bases[Math.floor(Math.random() * bases.length)];
      setBaseStream((prev) => [
        { id: Date.now() + Math.random(), base: nextBase, style: colors[nextBase] },
        ...prev.slice(0, 11)
      ]);
      setQScore(Number((99.5 + Math.random() * 0.4).toFixed(2)));
    }, 180);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 select-none">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-7 space-y-6 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        
        {/* Glowing Background Glows */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
              <Dna className="w-5 h-5 text-cyan-400 animate-spin" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-100 brand-font">High-Throughput DNA Sequencing</h4>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Nanopore Flow-Cell + Qiskit Simulator</p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Q30 {qScore}%</span>
          </span>
        </div>

        {/* DNA Nanopore Sequencing Base Call Flow Cell Animation */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="flex items-center space-x-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Nanopore Base-Calling Stream</span>
            </span>
            <span className="text-cyan-300 font-bold">1,024 bps</span>
          </div>

          <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center h-20 shadow-inner">
            
            {/* Pore Sensor Aperture Indicator */}
            <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-cyan-500/10 border-x border-cyan-400/40 z-10 flex items-center justify-center pointer-events-none">
              <div className="w-full h-0.5 bg-cyan-400 shadow-lg shadow-cyan-400/80 animate-pulse"></div>
            </div>

            {/* Base Stream */}
            <div className="flex space-x-2.5 overflow-hidden w-full justify-center">
              {baseStream.map((b) => (
                <span
                  key={b.id}
                  className={`w-9 h-11 rounded-xl border text-sm font-mono font-bold flex items-center justify-center transition-all duration-300 transform scale-100 hover:scale-110 shadow-md ${b.style}`}
                >
                  {b.base}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Simulated Electropherogram Fluorescence Waveform */}
        <div className="h-10 w-full flex items-center justify-center opacity-70">
          <svg className="w-full h-full" viewBox="0 0 300 40" fill="none">
            <path
              d="M0 25 Q 15 5, 30 25 T 60 25 T 90 8 T 120 25 T 150 12 T 180 25 T 210 5 T 240 25 T 270 15 T 300 25"
              stroke="url(#gradient-seq)"
              strokeWidth="2.5"
              fill="none"
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="gradient-seq" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="33%" stopColor="#f59e0b" />
                <stop offset="66%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Execution Status Step */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-cyan-400 font-medium flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400 animate-spin" />
              <span>{stepText}</span>
            </span>
            <span className="font-mono font-bold text-slate-300">{progress}%</span>
          </div>

          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/20"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 text-center flex items-center justify-center space-x-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>IBM Qiskit State Vector |\psi\rangle & Needleman-Wunsch Alignment</span>
        </div>
      </div>
    </div>
  );
}
