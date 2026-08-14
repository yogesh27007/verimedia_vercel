import React, { useState } from 'react';
import { Eye, Download, Sliders } from 'lucide-react';

export default function ForensicViewer({
  originalUrl,
  elaData,
  noiseData,
  aiData,
  activeTab,
  onScaleChange,
  elaScale,
  onExportReport
}) {
  const [splitPos, setSplitPos] = useState(50); // percentage for split screen

  const activeOverlayUrl = 
    activeTab === 'ela' ? elaData?.elaDataUrl :
    activeTab === 'noise' ? noiseData?.noiseDataUrl :
    activeTab === 'ai' ? aiData?.featureCanvasUrl :
    originalUrl;

  const overlayLabel = 
    activeTab === 'ela' ? 'ELA OVERLAY' :
    activeTab === 'noise' ? 'NOISE MAP' :
    activeTab === 'ai' ? 'AI FEATURE MAP' :
    'ORIGINAL';

  return (
    <div className="forensic-card p-4 space-y-4 flex-1">
      
      {/* Top Card Header */}
      <div className="flex items-center justify-between border-b border-forensic-border pb-3">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-forensic-navy" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-forensic-navy">
            Evidence Viewer
          </h2>
        </div>

        <button
          onClick={onExportReport}
          className="flex items-center space-x-1.5 px-3 py-1 rounded bg-forensic-navy hover:bg-slate-800 text-white font-mono text-xs font-bold transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>EXPORT</span>
        </button>
      </div>

      {/* Main Forensic Canvas Display Workspace */}
      <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-900 border border-forensic-border flex items-center justify-center">
        
        {/* Standard Single Canvas View */}
        {activeTab !== 'split' ? (
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <img
              src={activeOverlayUrl}
              alt="Forensic View"
              className="max-w-full max-h-full object-contain select-none"
            />
            {/* View Overlay Tag */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 text-white text-[10px] font-mono font-bold tracking-widest border border-white/20">
              {overlayLabel}
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
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 shadow-[0_0_10px_#3b82f6]"
              style={{ left: `${splitPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                ↔
              </div>
            </div>

            {/* Split Screen Labels */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 text-white text-[10px] font-mono font-bold tracking-widest border border-white/20">
              ORIGINAL
            </div>
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-black/80 text-blue-400 text-[10px] font-mono font-bold tracking-widest border border-blue-400/40">
              NOISE / ELA MAP
            </div>
          </div>
        )}

      </div>

      {/* Dynamic ELA Scale Slider (Only active when ELA tab is selected) */}
      {activeTab === 'ela' && (
        <div className="flex items-center justify-between bg-slate-50 px-3.5 py-2 rounded-lg border border-forensic-border text-xs font-mono">
          <div className="flex items-center space-x-2 text-slate-700">
            <Sliders className="w-4 h-4 text-forensic-blue" />
            <span>ELA Amplification Scale: <strong className="text-forensic-blue">{elaScale}x</strong></span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={elaScale}
            onChange={(e) => onScaleChange(parseInt(e.target.value))}
            className="w-36 accent-forensic-blue cursor-pointer"
          />
        </div>
      )}

      {/* Guidance Footer */}
      <div className="text-[11px] text-slate-500 font-mono bg-slate-50 p-2.5 rounded border border-slate-200">
        {activeTab === 'ela' && (elaData?.limitationNotice || 'ELA highlights localized compression discrepancies. Bright uniform clusters indicate pasted objects.')}
        {activeTab === 'noise' && (noiseData?.verdict || 'Laplacian matrix detects spatial sensor variance inconsistencies across image regions.')}
        {activeTab === 'ai' && (aiData?.confidenceCategory || 'Spectrum classifier detects latent high-frequency generative patterns.')}
        {activeTab === 'original' && 'Original unmodified input image rendering for baseline visual inspection.'}
        {activeTab === 'split' && 'Drag divider horizontally to perform side-by-side microscopic comparison.'}
      </div>

    </div>
  );
}
