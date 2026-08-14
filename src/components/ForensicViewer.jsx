import React, { useState } from 'react';
import { Eye, Layers, Sliders, SplitSquareVertical, Flame, Activity, Cpu } from 'lucide-react';

export default function ForensicViewer({
  originalUrl,
  elaData,
  noiseData,
  aiData,
  onScaleChange,
  elaScale
}) {
  const [activeTab, setActiveTab] = useState('ela'); // 'original' | 'ela' | 'noise' | 'ai' | 'split'
  const [splitPos, setSplitPos] = useState(50); // percentage for split screen

  const activeOverlayUrl = 
    activeTab === 'ela' ? elaData?.elaDataUrl :
    activeTab === 'noise' ? noiseData?.noiseDataUrl :
    activeTab === 'ai' ? aiData?.featureCanvasUrl :
    originalUrl;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 space-y-4">
      
      {/* Top Overlay Mode Selector Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyber-border pb-4">
        
        {/* Tab Buttons */}
        <div className="flex items-center flex-wrap gap-1.5 bg-cyber-dark p-1 rounded-xl border border-cyber-border">
          <button
            onClick={() => setActiveTab('original')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'original'
                ? 'bg-cyber-accent text-cyber-dark shadow-md shadow-cyber-accent/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Original</span>
          </button>

          <button
            onClick={() => setActiveTab('ela')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ela'
                ? 'bg-cyber-yellow text-cyber-dark shadow-md shadow-cyber-yellow/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>WebGL ELA Shader</span>
          </button>

          <button
            onClick={() => setActiveTab('noise')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'noise'
                ? 'bg-cyber-neon text-white shadow-md shadow-cyber-neon/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Noise Grid Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ai'
                ? 'bg-cyber-pink text-white shadow-md shadow-cyber-pink/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Feature Map</span>
          </button>

          <button
            onClick={() => setActiveTab('split')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'split'
                ? 'bg-cyber-green text-cyber-dark shadow-md shadow-cyber-green/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Split Loupe</span>
          </button>
        </div>

        {/* Dynamic ELA Scale Slider (Only active when ELA tab is selected) */}
        {activeTab === 'ela' && (
          <div className="flex items-center space-x-3 bg-cyber-dark/80 px-3.5 py-1.5 rounded-xl border border-cyber-border">
            <Sliders className="w-4 h-4 text-cyber-yellow" />
            <span className="text-xs font-mono text-slate-300">
              ELA Amplification Scale: <strong className="text-cyber-yellow">{elaScale}x</strong>
            </span>
            <input
              type="range"
              min="1"
              max="30"
              value={elaScale}
              onChange={(e) => onScaleChange(parseInt(e.target.value))}
              className="w-24 accent-cyber-yellow cursor-pointer"
            />
          </div>
        )}

      </div>

      {/* Main Forensic Canvas Display Workspace */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-black border border-cyber-border flex items-center justify-center">
        
        {/* Standard Single Canvas View */}
        {activeTab !== 'split' ? (
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <img
              src={activeOverlayUrl}
              alt="Forensic View"
              className="max-w-full max-h-full object-contain select-none"
            />
            {/* View Overlay Tag */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-cyber-dark/80 backdrop-blur-md border border-cyber-border text-xs font-mono text-cyber-accent">
              Mode: {activeTab.toUpperCase()} OVERLAY
            </div>
          </div>
        ) : (
          /* Interactive Dual Split-Screen Comparison Loupe */
          <div
            className="relative w-full h-full select-none cursor-col-resize overflow-hidden"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              setSplitPos(Math.min(95, Math.max(5, (x / rect.width) * 100)));
            }}
          >
            {/* Original Image (Left Side) */}
            <img
              src={originalUrl}
              alt="Original"
              className="absolute inset-0 w-full h-full object-contain"
            />

            {/* Forensic Overlay Image (Right Side Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${splitPos}%)` }}
            >
              <img
                src={elaData?.elaDataUrl || originalUrl}
                alt="ELA Overlay"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Split Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyber-accent shadow-[0_0_15px_#00f0ff]"
              style={{ left: `${splitPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-cyber-accent text-cyber-dark font-bold text-xs flex items-center justify-center shadow-lg">
                ↔
              </div>
            </div>

            {/* Split Screen Labels */}
            <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded bg-black/80 backdrop-blur text-[11px] font-mono text-slate-300">
              Original Photo
            </div>
            <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded bg-black/80 backdrop-blur text-[11px] font-mono text-cyber-yellow">
              WebGL ELA Heatmap
            </div>
          </div>
        )}

      </div>

      {/* Legend / Guidance Footer */}
      <div className="p-3 rounded-xl bg-cyber-dark/60 border border-cyber-border flex items-start space-x-3">
        <div className="w-2 h-2 rounded-full bg-cyber-accent mt-1.5 shadow-[0_0_8px_#00f0ff]" />
        <p className="text-xs text-slate-400 leading-relaxed">
          {activeTab === 'ela' && (elaData?.limitationNotice || 'ELA highlights localized compression discrepancies. Bright uniform clusters indicate pasted objects.')}
          {activeTab === 'noise' && (noiseData?.verdict || 'Laplacian matrix detects spatial sensor variance inconsistencies across image regions.')}
          {activeTab === 'ai' && (aiData?.confidenceCategory || 'Spectrum classifier detects latent high-frequency generative patterns.')}
          {activeTab === 'original' && 'Original unmodified input image rendering for baseline visual inspection.'}
          {activeTab === 'split' && 'Drag divider horizontally to perform side-by-side microscopic comparison.'}
        </p>
      </div>

    </div>
  );
}
