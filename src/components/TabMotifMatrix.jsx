import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

export default function TabMotifMatrix({ motifs = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMotifs = useMemo(() => {
    if (!searchQuery.trim()) return motifs;
    const q = searchQuery.toLowerCase();
    return motifs.filter(
      (m) =>
        m.motif.toLowerCase().includes(q) ||
        m.significance.toLowerCase().includes(q) ||
        m.length.toString().includes(q)
    );
  }, [motifs, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 brand-font">Genomic Motif Discovery Matrix</h3>
            <p className="text-xs text-slate-400">
              Identification of recurring K-mer repeat patterns, microsatellites, and promoter elements.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search motif pattern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-slate-100 focus:outline-none w-48 font-mono text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900/60">
                <th className="py-3 px-4">Motif Pattern</th>
                <th className="py-3 px-4">Length</th>
                <th className="py-3 px-4">Frequency Count</th>
                <th className="py-3 px-4">Coverage %</th>
                <th className="py-3 px-4">Biological Significance</th>
              </tr>
            </thead>
            <tbody>
              {filteredMotifs.length > 0 ? (
                filteredMotifs.map((mt, idx) => (
                  <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-xs font-bold text-purple-400">{mt.motif}</td>
                    <td className="py-2.5 px-4 text-xs text-slate-300">{mt.length} bp</td>
                    <td className="py-2.5 px-4 text-xs font-bold text-cyan-400">{mt.count}x</td>
                    <td className="py-2.5 px-4 text-xs text-slate-300">{mt.percentage}%</td>
                    <td className="py-2.5 px-4 text-xs text-emerald-400 font-medium">{mt.significance}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-500 text-xs">
                    No motifs match the search query.
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
