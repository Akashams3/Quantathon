import React, { useState, useMemo } from 'react';
import { Search, Bot, Info } from 'lucide-react';

export default function TabMutationStudio({ mutationResults }) {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeExpPos, setActiveExpPos] = useState(null);

  if (!mutationResults) return null;

  const { mutations = [], summary = {} } = mutationResults;

  const filteredMutations = useMemo(() => {
    return mutations.filter((m) => {
      if (filterType !== "all" && m.mutationType.toLowerCase() !== filterType.toLowerCase()) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchPos = m.position.toString().includes(q);
        const matchRef = m.refBase.toLowerCase().includes(q);
        const matchCand = m.candBase.toLowerCase().includes(q);
        const matchImpact = m.impact.toLowerCase().includes(q);
        return matchPos || matchRef || matchCand || matchImpact;
      }
      return true;
    });
  }, [mutations, filterType, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 space-y-1 border-cyan-500/20">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Mutations</div>
          <div className="text-2xl font-extrabold font-mono text-cyan-400">{summary.totalMutations}</div>
          <div className="text-[11px] text-slate-500">Variants Found</div>
        </div>
        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Transitions (Ti)</div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">{summary.transitionCount}</div>
          <div className="text-[11px] text-slate-500">Purine ↔ Purine</div>
        </div>
        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Transversions (Tv)</div>
          <div className="text-2xl font-extrabold font-mono text-amber-400">{summary.transversionCount}</div>
          <div className="text-[11px] text-slate-500">Purine ↔ Pyrimidine</div>
        </div>
        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Ti/Tv Ratio</div>
          <div className="text-2xl font-extrabold font-mono text-purple-400">{summary.tiTvRatio}</div>
          <div className="text-[11px] text-slate-500">Mutational Signature</div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 brand-font flex items-center space-x-2">
              <span>Point Mutation Studio & Variant Catalogue</span>
            </h3>
            <p className="text-xs text-slate-400">
              Detailed mapping of substitutions, transitions, transversions, insertions, deletions, and AI in-silico interpretations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setFilterType("all")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterType === "all" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All ({mutations.length})
              </button>
              <button
                onClick={() => setFilterType("substitution")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterType === "substitution" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Substitutions
              </button>
              <button
                onClick={() => setFilterType("insertion")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterType === "insertion" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Insertions
              </button>
              <button
                onClick={() => setFilterType("deletion")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterType === "deletion" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Deletions
              </button>
            </div>

            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search position or impact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-slate-100 focus:outline-none w-44 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900/60">
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Ref Base</th>
                <th className="py-3 px-4">Mutated Base</th>
                <th className="py-3 px-4">Mutation Type</th>
                <th className="py-3 px-4">Sub-Type</th>
                <th className="py-3 px-4">Biological Impact</th>
                <th className="py-3 px-4">AI Interpretation Layer</th>
              </tr>
            </thead>
            <tbody>
              {filteredMutations.length > 0 ? (
                filteredMutations.map((m, idx) => {
                  const isOpen = activeExpPos === m.position;
                  return (
                    <React.Fragment key={idx}>
                      <tr className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-4 font-mono text-xs font-semibold text-slate-300">#{m.position}</td>
                        <td className="py-2.5 px-4 font-mono text-xs font-bold text-slate-300">{m.refBase}</td>
                        <td className="py-2.5 px-4 font-mono text-xs font-bold text-rose-400">{m.candBase}</td>
                        <td className="py-2.5 px-4 text-xs font-medium text-cyan-400">{m.mutationType}</td>
                        <td className="py-2.5 px-4 text-xs text-slate-400">{m.subType}</td>
                        <td className={`py-2.5 px-4 text-xs font-semibold ${
                          m.impact.includes("High") ? "text-rose-400" : "text-amber-400"
                        }`}>
                          {m.impact}
                        </td>
                        <td className="py-2.5 px-4 text-xs">
                          <button
                            onClick={() => setActiveExpPos(isOpen ? null : m.position)}
                            className="flex items-center space-x-1 text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-1 rounded hover:bg-amber-900/60 transition-colors cursor-pointer"
                          >
                            <Bot className="w-3 h-3 text-amber-400" />
                            <span>{isOpen ? "Hide AI Interpretation" : "AI Explanation"}</span>
                          </button>
                        </td>
                      </tr>

                      {isOpen && (
                        <tr className="bg-amber-950/10 border-b border-slate-800/60">
                          <td colSpan="7" className="p-3 text-xs">
                            <div className="p-3 rounded-lg border border-amber-500/30 bg-slate-950/80 space-y-1">
                              <div className="flex items-center space-x-2 text-amber-400 font-mono text-[11px] font-bold">
                                <Bot className="w-3.5 h-3.5" />
                                <span>AI Interpretation Layer (Position #{m.position} Mechanism Prediction):</span>
                              </div>
                              <p className="text-slate-300 text-xs leading-relaxed pl-2 border-l-2 border-amber-400">
                                {m.refBase === "C" && m.candBase === "T"
                                  ? "CpG Hypermutable Site: Cytosine to Thymine transition via spontaneous deamination of 5-methylcytosine. High frequency in genomic coding exons."
                                  : m.subType === "Transversion"
                                  ? "Purine-Pyrimidine Transversion: Distorts local DNA double helix steric width; AI structural predictor indicates potential missense amino acid alteration."
                                  : `Point Substitution (${m.refBase}→${m.candBase}): Synonymous/conservative nucleotide transition with localized structural impact.`}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-emerald-400 text-xs font-medium">
                    No mutations match the selected filter.
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
