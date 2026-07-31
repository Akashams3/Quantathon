import React, { useMemo, useState } from 'react';
import { Dna, Search, Activity } from 'lucide-react';
import DNA3DViewer from './DNA3DViewer.jsx';

export default function TabDigitalTwin({ analysis }) {
  const [zoom, setZoom] = useState(100);
  const [rotationSpeed, setRotationSpeed] = useState(1.5);

  if (!analysis) return null;

  const mutations = analysis.mutationResults?.mutations || [];
  const topMutations = useMemo(() => mutations.slice(0, 6), [mutations]);

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-100 brand-font flex items-center space-x-2">
              <Dna className="w-5 h-5 text-cyan-400" />
              <span>3D DNA Explorer • Digital Twin Helix Viewer</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl">
              Explore the interactive 3D double-helix and inspect variant loci in a digital twin environment. Adjust zoom and rotation speed while tracking top mutation positions in real time.
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 bg-slate-900/70 px-3 py-1 rounded-full border border-slate-800">
            Live 3D Helix • Zoom 60% - 150%
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          <div>
            <DNA3DViewer zoom={zoom} rotationSpeed={rotationSpeed} />
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Guide Navigation</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Click and drag to orbit the helix, then use the sliders to tune zoom and rotation speed. This digital twin view highlights how the 3D structure evolves while the underlying variant map remains stable.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span>Zoom</span>
                    <span>{zoom}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="150"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span>Rotation Speed</span>
                    <span>{rotationSpeed.toFixed(1)}°/frame</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="2.8"
                    step="0.1"
                    value={rotationSpeed}
                    onChange={(e) => setRotationSpeed(Number(e.target.value))}
                    className="w-full accent-purple-400"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Mutation Locus Inspector</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                This panel surfaces the most significant variant positions detected in the current sequence. Use the digital twin view to correlate these loci with helix structure and relation to neighboring base pairs.
              </p>

              <div className="space-y-2">
                {topMutations.length ? (
                  topMutations.map((m, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-[11px] text-slate-300"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-cyan-300">Position #{m.position}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${m.impact.includes("High") ? "bg-rose-950 text-rose-300" : "bg-amber-950 text-amber-300"}`}>
                          {m.impact}
                        </span>
                      </div>
                      <div className="mt-1 text-slate-400 text-[10px]">
                        {m.refBase} → {m.candBase} · {m.mutationType} {m.subType ? `(${m.subType})` : ''}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[11px] text-slate-500">No variant loci detected in the current sequence.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
