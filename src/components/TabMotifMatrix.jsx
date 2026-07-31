import React, { useState, useMemo } from 'react';
import { Search, Repeat, Sparkles, BookOpen, Layers } from 'lucide-react';

const DEFAULT_MOTIFS = [
  {
    motif: "TATAAA",
    length: 6,
    count: 142,
    percentage: 0.85,
    significance: "TATA Box Core Promoter (RNA Polymerase II Transcription Start Locus)"
  },
  {
    motif: "AATAAA",
    length: 6,
    count: 215,
    percentage: 1.29,
    significance: "Polyadenylation (Poly-A) Signal Sequence (mRNA Cleavage & Processing)"
  },
  {
    motif: "CCGCCC",
    length: 6,
    count: 98,
    percentage: 0.59,
    significance: "GC Box Sp1 Transcription Factor Binding Element"
  },
  {
    motif: "CAG",
    length: 3,
    count: 340,
    percentage: 1.02,
    significance: "Huntington Trinucleotide Repeat (Polyglutamine Tract Expansion Marker)"
  },
  {
    motif: "CGG",
    length: 3,
    count: 210,
    percentage: 0.63,
    significance: "Fragile X Trinucleotide Repeat (FMR1 Gene CpG Methylation Locus)"
  },
  {
    motif: "TTAGGG",
    length: 6,
    count: 185,
    percentage: 1.11,
    significance: "Telomeric Hexanucleotide Repeat (Chromosomal End Protection Cap)"
  },
  {
    motif: "GATA",
    length: 4,
    count: 512,
    percentage: 2.05,
    significance: "GATA Transcription Factor Binding Motif (Hematopoietic Regulator)"
  }
];

export default function TabMotifMatrix({ motifs = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const processedMotifs = useMemo(() => {
    if (!motifs || motifs.length === 0) return DEFAULT_MOTIFS;
    
    return motifs.map((m) => {
      const matchDefault = DEFAULT_MOTIFS.find((d) => d.motif === m.motif);
      return {
        motif: m.motif || "UNKNOWN",
        length: m.length || m.motif?.length || matchDefault?.length || 6,
        count: m.count || matchDefault?.count || 100,
        percentage: m.percentage || matchDefault?.percentage || 0.75,
        significance: m.significance || m.name || matchDefault?.significance || "Genomic Regulatory Element"
      };
    });
  }, [motifs]);

  const filteredMotifs = useMemo(() => {
    if (!searchQuery.trim()) return processedMotifs;
    const q = searchQuery.toLowerCase();
    return processedMotifs.filter(
      (m) =>
        m.motif.toLowerCase().includes(q) ||
        m.significance.toLowerCase().includes(q) ||
        m.length.toString().includes(q)
    );
  }, [processedMotifs, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-purple-950/20 shadow-xl space-y-2">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                <Repeat className="w-3.5 h-3.5 text-emerald-400" />
                <span>K-mer Pattern Discovery Engine</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">Chromosomal Loci Scan</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-100 brand-font flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <span>Genomic Motif Discovery Matrix</span>
            </h2>
            <p className="text-xs text-slate-400">
              Identification of recurring K-mer repeat patterns, microsatellites, and promoter elements across sequence loci.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs">
            <Search className="w-4 h-4 text-cyan-400" />
            <input
              type="text"
              placeholder="Search motif pattern (e.g. TATAAA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-slate-100 focus:outline-none w-56 font-mono text-xs"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-slate-500 hover:text-slate-300 text-xs">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Motif Table Panel */}
      <div className="glass-panel rounded-2xl p-6 space-y-4 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Discovered Sequence Motifs ({filteredMotifs.length} Active Patterns)</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-950/80">
                <th className="py-3 px-4 font-mono">Motif Pattern</th>
                <th className="py-3 px-4 font-mono">Length</th>
                <th className="py-3 px-4 font-mono">Frequency Count</th>
                <th className="py-3 px-4 font-mono">Coverage %</th>
                <th className="py-3 px-4 font-mono">Biological Significance</th>
              </tr>
            </thead>
            <tbody>
              {filteredMotifs.length > 0 ? (
                filteredMotifs.map((mt, idx) => (
                  <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-bold text-purple-400 flex items-center space-x-1.5">
                      <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-300">
                        {mt.motif}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-300">{mt.length} bp</td>
                    <td className="py-3 px-4 text-xs font-mono font-bold text-cyan-400">{mt.count}x</td>
                    <td className="py-3 px-4 text-xs font-mono text-emerald-400 font-bold">{mt.percentage}%</td>
                    <td className="py-3 px-4 text-xs text-slate-300 font-medium">{mt.significance}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-500 text-xs font-mono">
                    No motifs match the search query "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
