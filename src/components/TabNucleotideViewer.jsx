import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

export default function TabNucleotideViewer({ candSeq = "", mutations = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const mutationMap = useMemo(() => {
    const map = new Map();
    mutations.forEach((m) => map.set(m.position, m));
    return map;
  }, [mutations]);

  const sequenceBases = useMemo(() => {
    const bases = [];
    const query = searchQuery.trim().toUpperCase();

    for (let i = 0; i < candSeq.length; i++) {
      const pos = i + 1;
      const base = candSeq[i];
      const mut = mutationMap.get(pos);

      let isMatch = false;
      if (query) {
        if (!isNaN(query) && pos === parseInt(query, 10)) {
          isMatch = true;
        } else if (isNaN(query) && candSeq.substring(i, i + query.length).toUpperCase() === query) {
          isMatch = true;
        }
      }

      bases.push({ pos, base, mut, isMatch });
    }

    return bases;
  }, [candSeq, mutationMap, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 brand-font">Base-by-Base Colored DNA Sequence Viewer</h3>
            <p className="text-xs text-slate-400">
              Hover over any nucleotide base to inspect exact genomic position, mutation type, and biological impact.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search motif (e.g. CAG) or pos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-slate-100 focus:outline-none w-48 font-mono text-xs"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-slate-500 hover:text-slate-300 text-xs">
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono pt-1">
          <span className="px-2.5 py-1 rounded base-A font-bold">A: Adenine</span>
          <span className="px-2.5 py-1 rounded base-T font-bold">T: Thymine</span>
          <span className="px-2.5 py-1 rounded base-G font-bold">G: Guanine</span>
          <span className="px-2.5 py-1 rounded base-C font-bold">C: Cytosine</span>
          <span className="px-2.5 py-1 rounded base-mutation font-bold">Mutation Marker</span>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 max-h-[450px] overflow-y-auto leading-relaxed flex flex-wrap gap-1">
          {sequenceBases.map((b) => {
            const mut = b.mut;
            const tooltip = mut
              ? `Pos ${b.pos}: ${mut.refBase} → ${mut.candBase} (${mut.mutationType} - ${mut.impact})`
              : `Pos ${b.pos}: Base ${b.base}`;

            let classNames = "inline-flex items-center justify-center w-7 h-8 rounded text-xs font-mono font-bold cursor-pointer transition-transform hover:scale-125 select-none ";

            if (b.isMatch) {
              classNames += "ring-2 ring-amber-400 bg-amber-500/40 text-amber-200 ";
            } else if (mut) {
              classNames += "base-mutation ";
            } else {
              classNames += `base-${b.base} `;
            }

            return (
              <span key={b.pos} className={classNames} title={tooltip}>
                {b.base}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
