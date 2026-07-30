import React, { useState, useMemo } from 'react';
import { Sparkles, GitCompare, PieChart, History, Bot, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export default function TabOverview({ analysis, history, onSelectHistory }) {
  const [showAllAIExpl, setShowAllAIExpl] = useState(false);

  if (!analysis) return null;

  const { aiSummary, alignment, stats } = analysis;
  const counts = stats.counts || { A: 0, T: 0, G: 0, C: 0 };
  const total = stats.length || 1;

  const pctA = ((counts.A / total) * 100).toFixed(1);
  const pctT = ((counts.T / total) * 100).toFixed(1);
  const pctG = ((counts.G / total) * 100).toFixed(1);
  const pctC = ((counts.C / total) * 100).toFixed(1);

  const positionExplanations = aiSummary.positionExplanations || [];
  const visibleExplanations = showAllAIExpl ? positionExplanations : positionExplanations.slice(0, 4);

  // Chunk Sequence Alignment for clean multi-line display
  const alignmentChunks = useMemo(() => {
    const chunkSize = 50;
    const chunks = [];
    const len = alignment.alignmentLength || 0;
    for (let i = 0; i < len; i += chunkSize) {
      chunks.push({
        start: i + 1,
        end: Math.min(i + chunkSize, len),
        ref: alignment.alignA.substring(i, i + chunkSize),
        match: alignment.matchLine.substring(i, i + chunkSize),
        mut: alignment.alignB.substring(i, i + chunkSize)
      });
    }
    return chunks;
  }, [alignment]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Biological Synthesis & Alignment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* AI Synthesis Card with Clear AI Interpretation Layer Identification */}
          <div className="glass-panel rounded-2xl p-6 space-y-5 border border-cyan-500/20 shadow-xl">
            
            {/* Header with Explicit AI Interpretation Layer Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-100 brand-font flex items-center space-x-2">
                    <span>AI Biological Summary & Interpretation Layer</span>
                  </h3>
                  <p className="text-[11px] font-mono text-cyan-400">Automated In-Silico Genomic Analysis Engine</p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-500/40 px-3 py-1 rounded-full flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>AI Interpretation Layer</span>
              </span>
            </div>

            {/* AI Summary Content Box */}
            <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-950/10 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full">
                  {aiSummary.stabilityClass}
                </span>
                <span className="text-[11px] font-mono text-slate-400">Model: Antigravity-Genomics-AI v2.4</span>
              </div>
              
              <p className="text-xs text-slate-300 leading-relaxed">{aiSummary.overviewParagraph}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{aiSummary.mutationParagraph}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{aiSummary.quantumParagraph}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{aiSummary.motifParagraph}</p>
              
              <div className="pt-3 border-t border-emerald-500/20 text-xs font-semibold text-emerald-300 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{aiSummary.recommendation}</span>
              </div>
            </div>

            {/* Position-Specific AI Mutation Interpretations */}
            {positionExplanations.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5 font-mono">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span>AI Variant Mechanisms & Impact Interpretations</span>
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">({positionExplanations.length} Detected)</span>
                </div>

                <div className="space-y-2">
                  {visibleExplanations.map((exp, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-cyan-400">
                          Position #{exp.position}: <span className="text-slate-300">{exp.refBase}</span> → <span className="text-rose-400">{exp.candBase}</span>
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          exp.impact.includes("High") ? "bg-rose-950 text-rose-300 border border-rose-500/30" : "bg-amber-950 text-amber-300 border border-amber-500/30"
                        }`}>
                          {exp.impact}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed pl-2 border-l-2 border-cyan-500/40">
                        {exp.explanation}
                      </p>
                    </div>
                  ))}
                </div>

                {positionExplanations.length > 4 && (
                  <button
                    onClick={() => setShowAllAIExpl(!showAllAIExpl)}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 pt-1 cursor-pointer"
                  >
                    <span>{showAllAIExpl ? "Show Less" : `Show All ${positionExplanations.length} AI Interpretations`}</span>
                    {showAllAIExpl ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            )}

            {/* Explicit AI Interpretation Layer Disclaimer */}
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start space-x-2 text-[11px] text-amber-300/90">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>AI Interpretation Layer Disclaimer:</strong> {aiSummary.disclaimer || "AI outputs represent an automated in-silico computational interpretation layer. Clinical validation via wet-lab Sanger or NGS sequencing is required prior to diagnostic or therapeutic application."}
              </span>
            </div>
          </div>

          {/* DNA Sequence Alignment Visualization */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2 brand-font">
                <GitCompare className="w-4 h-4 text-cyan-400" />
                <span>DNA Sequence Alignment Visualization</span>
              </h3>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30">
                Needleman-Wunsch Pairwise Engine
              </span>
            </div>
            
            {/* Multi-line Sequence Alignment Visualization */}
            <div className="font-mono text-xs overflow-x-auto p-4 bg-slate-950/90 rounded-xl border border-slate-800 space-y-4 max-h-[350px] overflow-y-auto">
              {alignmentChunks.map((chunk, idx) => (
                <div key={idx} className="space-y-1 pb-2 border-b border-slate-900 last:border-0 last:pb-0">
                  <div className="text-[10px] text-slate-500">Position {chunk.start} - {chunk.end}</div>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <span className="w-10 text-cyan-400 font-bold shrink-0">REF:</span>
                    <span className="tracking-widest text-slate-200">{chunk.ref}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                    <span className="w-10 text-slate-500 font-normal shrink-0">MATCH:</span>
                    <span className="tracking-widest text-cyan-400">{chunk.match}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-400">
                    <span className="w-10 text-purple-400 font-bold shrink-0">MUT:</span>
                    <span className="tracking-widest text-purple-300">{chunk.mut}</span>
                  </div>
                </div>
              ))}
              
              <div className="text-slate-500 pt-3 border-t border-slate-800 flex flex-wrap gap-4 text-[11px]">
                <span>Matches: <strong className="text-emerald-400">{alignment.matches}</strong></span>
                <span>Mismatches: <strong className="text-rose-400">{alignment.mismatches}</strong></span>
                <span>Alignment Length: <strong className="text-slate-300">{alignment.alignmentLength} bp</strong></span>
                <span>Similarity Score: <strong className="text-cyan-400">{alignment.similarityScore}%</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Base Composition & History */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2 brand-font">
              <PieChart className="w-4 h-4 text-purple-400" />
              <span>Nucleotide Base Composition</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-emerald-400 font-bold">Adenine (A)</span>
                <span className="text-slate-200">{pctA}% ({counts.A})</span>
              </div>
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
                <span className="text-amber-400 font-bold">Thymine (T)</span>
                <span className="text-slate-200">{pctT}% ({counts.T})</span>
              </div>
              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
                <span className="text-cyan-400 font-bold">Guanine (G)</span>
                <span className="text-slate-200">{pctG}% ({counts.G})</span>
              </div>
              <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/30 flex items-center justify-between">
                <span className="text-purple-400 font-bold">Cytosine (C)</span>
                <span className="text-slate-200">{pctC}% ({counts.C})</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2 brand-font">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Recent Session History</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="py-2 px-3">Time</th>
                    <th className="py-2 px-3">Locus</th>
                    <th className="py-2 px-3">Length</th>
                    <th className="py-2 px-3">Mutations</th>
                    <th className="py-2 px-3">Quantum</th>
                  </tr>
                </thead>
                <tbody>
                  {history && history.length > 0 ? (
                    history.slice(0, 5).map((h, idx) => (
                      <tr
                        key={idx}
                        onClick={() => onSelectHistory && onSelectHistory(h)}
                        className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors cursor-pointer"
                      >
                        <td className="py-2 px-3 text-xs text-slate-400 font-mono">{h.timestamp}</td>
                        <td className="py-2 px-3 text-xs font-medium text-slate-200 max-w-[120px] truncate">{h.sequenceInfo.header}</td>
                        <td className="py-2 px-3 text-xs text-cyan-400 font-bold font-mono">{h.stats.length} bp</td>
                        <td className="py-2 px-3 text-xs text-rose-400 font-bold font-mono">{h.mutationResults.summary.totalMutations}</td>
                        <td className="py-2 px-3 text-xs text-purple-400 font-bold font-mono">{h.quantumResults.quantumSimilarityScore}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-xs text-slate-500">No previous session runs.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
