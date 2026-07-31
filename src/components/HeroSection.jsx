import React from 'react';
import { Atom, CheckCircle, Cpu, Bot } from 'lucide-react';
import DNA3DViewer from './DNA3DViewer.jsx';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 border-b border-slate-800/60 px-6 py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Atom className="w-3.5 h-3.5 animate-spin" />
            <span>Qiskit Quantum Simulator + AI Genomic Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 tracking-tight leading-tight brand-font">
            Intelligent DNA Mutation &{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Quantum Pattern Detection
            </span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            Accelerate genomic research with a 3D digital twin double-helix explorer, quantum spin-angle circuit animation, and AI-assisted variant interpretation for immersive sequence insight.
          </p>
 
          <div className="flex flex-wrap gap-3 pt-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Interactive 3D DNA Explorer</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Animated Qubit Spin-Angle Circuit</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-purple-400 flex items-center space-x-1.5">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Variant Interpretation</span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 relative flex justify-center">
          <DNA3DViewer />
        </div>
      </div>
    </section>
  );
}
