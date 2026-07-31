import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCw, ZoomIn, ZoomOut, Dna, Atom, Bot, Sparkles, Activity, ShieldCheck, AlertTriangle, Layers, Eye } from 'lucide-react';

const BASE_COLORS = {
  A: { fill: '#10b981', border: '#059669', glow: 'rgba(16, 185, 129, 0.4)', pair: 'T' },
  T: { fill: '#f59e0b', border: '#d97706', glow: 'rgba(245, 158, 11, 0.4)', pair: 'A' },
  G: { fill: '#06b6d4', border: '#0284c7', glow: 'rgba(6, 182, 212, 0.4)', pair: 'C' },
  C: { fill: '#a855f7', border: '#7e22ce', glow: 'rgba(168, 85, 247, 0.4)', pair: 'G' }
};

const MUTATION_LOCI = [
  { pos: 8, type: "Insertion", ref: "A", cand: "ATG", risk: "Medium", impact: "Frameshift Shift (+2bp)", codon: "c.24A>ATG (p.Lys8dup)", shift: "1.57 rad (90°)", aiConfidence: 87 },
  { pos: 15, type: "SNP (Substitution)", ref: "C", cand: "T", risk: "High", impact: "Missense Variant (Arg->Cys)", codon: "c.45C>T (p.Arg15Cys)", shift: "3.14 rad (180°)", aiConfidence: 94 },
  { pos: 24, type: "Deletion", ref: "G", cand: "-", risk: "Critical", impact: "Nonsense Mutation (Stop Codon)", codon: "c.72delG (p.Trp24Ter)", shift: "4.71 rad (270°)", aiConfidence: 98 }
];

const NUCLEOTIDE_THETA = { A: 0.00, T: 1.57, G: 3.14, C: 4.71 };

const TWIN_MODE_INFO = {
  helix: { label: "3D Double Helix", desc: "Standard structural view — base-pair colours, hydrogen bonds, and mutation loci.", color: "emerald" },
  quantum: { label: "Qubit Spin Angles", desc: "Quantum encoding view — Ry rotation angles θ per nucleotide mapped to |ψ⟩ statevectors.", color: "purple" },
  ai: { label: "AI Variant Hotspots", desc: "AI risk overlay — non-variant loci dimmed, hotspot loci glow with confidence scores.", color: "amber" },
};

export default function DNADigitalTwin({ analysis }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [rotationSpeed, setRotationSpeed] = useState(1.5);
  const [twinMode, setTwinMode] = useState("helix"); // "helix" | "quantum" | "ai"
  const [selectedLocusPos, setSelectedLocusPos] = useState(15);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  const requestRef = useRef(null);

  const sequence = "GAATTCTTGTGTTTATATAATAAGATGTCCTATAATTTCTG";

  // Animation Loop for 3D Helix Rotation
  useEffect(() => {
    let lastTime = performance.now();
    const animate = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      if (isPlaying) {
        setRotationAngle((prev) => (prev + rotationSpeed * delta * 50) % 360);
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, rotationSpeed]);

  // Compute 3D Projected Base Pairs
  const helixPairs = useMemo(() => {
    const pairs = [];
    const numPairs = 30;
    const radius = 90 * zoomLevel;
    const dy = 22 * zoomLevel;
    const startY = 40;

    for (let i = 0; i < numPairs; i++) {
      const pos = i + 1;
      const baseA = sequence[i % sequence.length] || 'A';
      const baseB = BASE_COLORS[baseA]?.pair || 'T';

      const mutInfo = MUTATION_LOCI.find((m) => m.pos === pos);

      const angleRad = ((rotationAngle + i * 25) * Math.PI) / 180;
      const x1 = Math.cos(angleRad) * radius;
      const z1 = Math.sin(angleRad) * radius;
      const x2 = -x1;
      const z2 = -z1;
      const y = startY + i * dy;

      const opacity = Math.min(1.0, Math.max(0.35, (z1 + 120) / 240));

      pairs.push({
        index: pos,
        baseA,
        baseB,
        x1,
        y,
        z1,
        x2,
        z2,
        scale1: (z1 + 180) / 280,
        scale2: (z2 + 180) / 280,
        opacity,
        mutInfo
      });
    }
    return pairs;
  }, [rotationAngle, sequence, zoomLevel]);

  const activePair = helixPairs.find((p) => p.index === selectedLocusPos) || helixPairs[14];
  const activeMut = activePair.mutInfo;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Digital Twin Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-purple-950/20 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Real-Time DNA Digital Twin Engine</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">3D Double-Helix + Quantum Statevector Map</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-100 brand-font flex items-center space-x-2">
              <Dna className="w-6 h-6 text-emerald-400" />
              <span>Interactive 3D Genomic Digital Twin & Mutation Hotspot Viewer</span>
            </h2>
            <p className="text-xs text-slate-400">
              Three distinct twin modes — switch below to explore structural helix, quantum qubit angles, or AI variant hotspots.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setTwinMode("helix")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                twinMode === "helix"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Dna className="w-3.5 h-3.5" />
              <span>3D Double Helix</span>
            </button>

            <button
              onClick={() => setTwinMode("quantum")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                twinMode === "quantum"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Qubit Spin Angles</span>
            </button>

            <button
              onClick={() => setTwinMode("ai")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                twinMode === "ai"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Variant Hotspots</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Digital Twin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D Animated Canvas Viewport */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 relative flex flex-col justify-between min-h-[540px] overflow-hidden">
          
          {/* Active Mode Banner */}
          <div className={`z-10 px-3 py-2 rounded-xl border text-xs font-mono ${
            twinMode === 'helix' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' :
            twinMode === 'quantum' ? 'bg-purple-950/40 border-purple-500/30 text-purple-300' :
            'bg-amber-950/40 border-amber-500/30 text-amber-300'
          }`}>
            <span className="font-bold">{TWIN_MODE_INFO[twinMode].label}</span>
            <span className="text-slate-400 mx-2">—</span>
            <span className="text-slate-400">{TWIN_MODE_INFO[twinMode].desc}</span>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-cyan-400 hover:border-cyan-500 transition-all cursor-pointer"
                title={isPlaying ? "Pause Rotation" : "Play Rotation"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setRotationAngle((prev) => (prev + 45) % 360)}
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-cyan-400 hover:border-cyan-500 transition-all cursor-pointer"
                title="Rotate 45°"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl text-xs text-slate-400">
                <span>Speed:</span>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                  className="w-20 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(0.6, prev - 0.1))}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-100"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <span className="text-xs font-mono text-slate-400">{(zoomLevel * 100).toFixed(0)}%</span>

              <button
                onClick={() => setZoomLevel((prev) => Math.min(1.5, prev + 0.1))}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-100"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG 3D Double Helix Render Viewport */}
          <div className="relative w-full h-[420px] flex items-center justify-center">
            <svg className="w-full h-full" viewBox="-200 0 400 720" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="glow-mut" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Render Base Pairs with Hydrogen Bond Connector Lines */}
              {helixPairs.map((pair) => {
                const colorA = BASE_COLORS[pair.baseA] || BASE_COLORS.A;
                const colorB = BASE_COLORS[pair.baseB] || BASE_COLORS.T;
                const isSelected = selectedLocusPos === pair.index;
                const mut = pair.mutInfo;
                const theta = NUCLEOTIDE_THETA[pair.baseA] ?? 0;
                const isAiMode = twinMode === 'ai';
                const isQuantumMode = twinMode === 'quantum';
                const isHelixMode = twinMode === 'helix';
                const isHotspot = !!mut;
                const pairOpacity = isAiMode && !isHotspot ? pair.opacity * 0.25 : pair.opacity;

                const bondStroke = isQuantumMode ? '#a855f7'
                  : isAiMode && isHotspot ? (mut.risk === 'Critical' ? '#ef4444' : mut.risk === 'High' ? '#f59e0b' : '#3b82f6')
                  : isHelixMode && mut ? (mut.risk === 'Critical' ? '#ef4444' : mut.risk === 'High' ? '#f59e0b' : '#3b82f6')
                  : '#334155';

                const nodeFillA = isQuantumMode ? colorA.fill
                  : isAiMode && isHotspot ? (mut.risk === 'Critical' ? '#ef4444' : mut.risk === 'High' ? '#f59e0b' : '#3b82f6')
                  : isHelixMode && mut ? (mut.risk === 'Critical' ? '#ef4444' : mut.risk === 'High' ? '#f59e0b' : '#3b82f6')
                  : colorA.fill;

                const nodeFillB = isQuantumMode ? colorB.fill
                  : isAiMode && isHotspot ? (mut.risk === 'Critical' ? '#ef4444' : mut.risk === 'High' ? '#f59e0b' : '#3b82f6')
                  : isHelixMode && mut ? (mut.risk === 'Critical' ? '#ef4444' : mut.risk === 'High' ? '#f59e0b' : '#3b82f6')
                  : colorB.fill;

                const showGlow = isSelected || (isAiMode && isHotspot) || (isHelixMode && mut);

                return (
                  <g
                    key={pair.index}
                    onClick={() => setSelectedLocusPos(pair.index)}
                    className="cursor-pointer transition-all hover:opacity-100"
                    opacity={pairOpacity}
                  >
                    <line
                      x1={pair.x1}
                      y1={pair.y}
                      x2={pair.x2}
                      y2={pair.y}
                      stroke={bondStroke}
                      strokeWidth={isSelected ? 4 : (isAiMode && isHotspot) || (isHelixMode && mut) ? 3 : isQuantumMode ? 2.5 : 2}
                      strokeDasharray={isQuantumMode ? '3,2' : (isHelixMode || isAiMode) && mut ? '4,3' : 'none'}
                    />

                    <circle
                      cx={pair.x1}
                      cy={pair.y}
                      r={(isAiMode && isHotspot) || (isHelixMode && mut) ? 12 * pair.scale1 : 8.5 * pair.scale1}
                      fill={nodeFillA}
                      stroke={isSelected ? '#ffffff' : isQuantumMode ? '#c084fc' : colorA.border}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      filter={showGlow ? "url(#glow-mut)" : ""}
                    />
                    <text
                      x={pair.x1}
                      y={pair.y + 4 * pair.scale1}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={10 * pair.scale1}
                      fontWeight="bold"
                      fontFamily="monospace"
                      pointerEvents="none"
                    >
                      {isQuantumMode ? `${pair.baseA}` : pair.baseA}
                    </text>

                    <circle
                      cx={pair.x2}
                      cy={pair.y}
                      r={(isAiMode && isHotspot) || (isHelixMode && mut) ? 12 * pair.scale2 : 8.5 * pair.scale2}
                      fill={nodeFillB}
                      stroke={isSelected ? '#ffffff' : isQuantumMode ? '#c084fc' : colorB.border}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      filter={showGlow ? "url(#glow-mut)" : ""}
                    />
                    <text
                      x={pair.x2}
                      y={pair.y + 4 * pair.scale2}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={10 * pair.scale2}
                      fontWeight="bold"
                      fontFamily="monospace"
                      pointerEvents="none"
                    >
                      {pair.baseB}
                    </text>

                    {/* Helix mode: mutation callout badges */}
                    {isHelixMode && mut && (
                      <g transform={`translate(${pair.x2 + 25}, ${pair.y - 8})`}>
                        <rect x="0" y="0" width="75" height="16" rx="4" fill="#0f172a" stroke={mut.risk === 'Critical' ? '#ef4444' : '#f59e0b'} strokeWidth="1" />
                        <text x="37" y="11" textAnchor="middle" fill={mut.risk === 'Critical' ? '#fca5a5' : '#fde047'} fontSize="9" fontWeight="bold" fontFamily="monospace">
                          #{mut.pos} {mut.type.split(" ")[0]}
                        </text>
                      </g>
                    )}

                    {/* Quantum mode: qubit state + theta angle */}
                    {isQuantumMode && (
                      <g>
                        <text x={(pair.x1 + pair.x2) / 2} y={pair.y - 8} textAnchor="middle" fill="#c084fc" fontSize={8} fontWeight="bold" fontFamily="monospace">
                          |ψ{pair.index % 4}⟩
                        </text>
                        <text x={(pair.x1 + pair.x2) / 2} y={pair.y + 16} textAnchor="middle" fill="#e879f9" fontSize={7} fontFamily="monospace">
                          θ={theta.toFixed(2)}
                        </text>
                        <line x1={pair.x1} y1={pair.y - 14} x2={pair.x1 + Math.cos(theta + rotationAngle * Math.PI / 180) * 10} y2={pair.y - 14 + Math.sin(theta + rotationAngle * Math.PI / 180) * 10} stroke="#c084fc" strokeWidth={1.5} />
                      </g>
                    )}

                    {/* AI mode: confidence badge on hotspots only */}
                    {isAiMode && isHotspot && (
                      <g transform={`translate(${pair.x2 + 20}, ${pair.y - 10})`}>
                        <rect x="0" y="0" width="62" height="18" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" filter="url(#glow-mut)" />
                        <text x="31" y="12" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="bold" fontFamily="monospace">
                          AI {mut.aiConfidence}%
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Visual Legend — changes per mode */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-3 border-t border-slate-800">
            {twinMode === 'helix' && (
              <>
                <div className="flex items-center space-x-3">
                  {[['emerald', 'A'], ['amber', 'T'], ['cyan', 'G'], ['purple', 'C']].map(([c, b]) => (
                    <span key={b} className="flex items-center space-x-1">
                      <span className={`w-3 h-3 rounded-full bg-${c}-500 inline-block`}></span>
                      <span className="text-slate-300">{b}</span>
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="text-blue-400 font-bold">Insertion (#8)</span>
                  <span className="text-amber-400 font-bold">SNP (#15)</span>
                  <span className="text-rose-400 font-bold">Deletion (#24)</span>
                </div>
              </>
            )}
            {twinMode === 'quantum' && (
              <div className="flex items-center space-x-4 text-[11px]">
                <span className="text-purple-400 font-bold">|ψ⟩ Qubit States</span>
                {[['A', '0.00'], ['T', '1.57'], ['G', '3.14'], ['C', '4.71']].map(([b, t]) => (
                  <span key={b} className="text-slate-300">{b}: θ={t} rad</span>
                ))}
              </div>
            )}
            {twinMode === 'ai' && (
              <div className="flex items-center space-x-4 text-[11px]">
                <span className="text-amber-400 font-bold">AI Hotspot Overlay</span>
                <span className="text-slate-500">Dimmed = wildtype</span>
                <span className="text-amber-300">Glowing = AI-detected variant</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Digital Twin Mutation & Health Inspector */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Nucleotide Inspector Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2 brand-font">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Selected Locus Inspector</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Pos #{activePair.index}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Wildtype Reference Base:</span>
                <span className="font-bold text-emerald-400">{activePair.baseA} (Complement {activePair.baseB})</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Variant Classification:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  activeMut ? (activeMut.risk === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40') : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {activeMut ? activeMut.type : "Wildtype Normal"}
                </span>
              </div>

              {activeMut && (
                <>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">HGVS Codon Nomenclature:</span>
                    <span className="font-bold text-cyan-300">{activeMut.codon}</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">Functional Impact:</span>
                    <span className="text-slate-200">{activeMut.impact}</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400">Qiskit Phase Shift (Δθ):</span>
                    <span className="text-purple-400 font-bold">{activeMut.shift}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Genomic Hotspots Table */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2 brand-font">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Mutation Hotspot Registry</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                    <th className="py-2 px-2">Pos</th>
                    <th className="py-2 px-2">Type</th>
                    <th className="py-2 px-2">Ref→Mut</th>
                    <th className="py-2 px-2">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {MUTATION_LOCI.map((m) => (
                    <tr
                      key={m.pos}
                      onClick={() => setSelectedLocusPos(m.pos)}
                      className={`border-b border-slate-800/60 hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        selectedLocusPos === m.pos ? "bg-slate-800/60" : ""
                      }`}
                    >
                      <td className="py-2 px-2 font-bold text-cyan-400">#{m.pos}</td>
                      <td className="py-2 px-2 text-slate-300">{m.type.split(" ")[0]}</td>
                      <td className="py-2 px-2 text-purple-300">{m.ref} → {m.cand}</td>
                      <td className="py-2 px-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          m.risk === 'Critical' ? 'bg-red-500/20 text-red-400' :
                          m.risk === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {m.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
