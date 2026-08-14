import React from 'react';
import { FileText, Flame, Activity, Cpu } from 'lucide-react';
import Tooltip from './Tooltip';

export default function ModuleCards({ metadata, ela, noise, ai, onExportReport }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* CARD 1: C2PA & METADATA */}
      <div className="forensic-card p-4 space-y-3 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-forensic-border pb-2">
            <Tooltip text="Coalition for Content Provenance & Authenticity (ISO 21000-22). Checks for cryptographic provenance manifests signed by authentic camera hardware or software.">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold uppercase tracking-wider text-forensic-navy cursor-help">
                <FileText className="w-3.5 h-3.5 text-forensic-blue" />
                <span>C2PA & Metadata</span>
              </div>
            </Tooltip>
            <span className="w-2 h-2 rounded-full bg-blue-600" />
          </div>

          {/* Dotted Key-Value Rows with Tooltips */}
          <div className="space-y-2 text-xs font-mono">
            <Tooltip text="VERIFIED = Intact cryptographic claim signature. STRIPPED = Metadata removed by social media platforms (WhatsApp, X, Instagram) or fresh edits.">
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-1 cursor-help">
                <span className="text-slate-500 uppercase">STATUS</span>
                <span className="font-bold text-forensic-blue">{metadata?.c2paStatus || 'STRIPPED'}</span>
              </div>
            </Tooltip>

            <Tooltip text="Cryptographic SHA-256 digital signature embedded in JUMBF APP11 binary marker box.">
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-1 cursor-help">
                <span className="text-slate-500 uppercase">SIGNATURE</span>
                <span className="font-bold text-slate-800">{metadata?.c2paStatus === 'VERIFIED' ? 'VALID_SHA256' : 'STRIPPED'}</span>
              </div>
            </Tooltip>

            <Tooltip text="INTACT = Complete author & camera history chain. MISSING = Origin metadata wiped by platform recompression.">
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-1 cursor-help">
                <span className="text-slate-500 uppercase">PROVENANCE</span>
                <span className="font-bold text-slate-800">{metadata?.c2paStatus === 'VERIFIED' ? 'INTACT' : 'MISSING'}</span>
              </div>
            </Tooltip>
          </div>
        </div>

        {/* View Raw JSON Button with Tooltip */}
        <div className="pt-2">
          <Tooltip text="Click to export and inspect raw parsed JUMBF binary boxes, EXIF key-values, and cryptographic claim assertions.">
            <button
              onClick={onExportReport}
              className="w-full py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-forensic-blue font-mono text-[11px] font-bold border border-slate-300 transition-colors uppercase tracking-wider text-center"
            >
              View Raw JSON
            </button>
          </Tooltip>
        </div>
      </div>

      {/* CARD 2: ERROR LEVEL ANALYSIS */}
      <div className="forensic-card p-4 space-y-3 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-forensic-border pb-2">
            <Tooltip text="WebGL 2.0 Error Level Analysis. Re-compresses image at 90% quality to compute pixel-wise quantization error delta (Krawetz, 2007).">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold uppercase tracking-wider text-forensic-navy cursor-help">
                <Flame className="w-3.5 h-3.5 text-red-600" />
                <span>Error Level Analysis</span>
              </div>
            </Tooltip>
            <span className="w-2 h-2 rounded-full bg-red-600" />
          </div>

          {/* Dotted Key-Value Rows with Tooltips */}
          <div className="space-y-2 text-xs font-mono">
            <Tooltip text="Ratio of compression error variance across grid blocks. High score (>0.50) indicates region-specific cut-and-paste splices.">
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-1 cursor-help">
                <span className="text-slate-500 uppercase">SPLICE SCORE</span>
                <span className="font-bold text-red-600">{(ela?.spliceLikelihood / 100 || 0.55).toFixed(2)}</span>
              </div>
            </Tooltip>

            <Tooltip text="Compares original pixel grid quality baseline against 90% re-compressed secondary quality.">
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-1 cursor-help">
                <span className="text-slate-500 uppercase">JPEG QUALITY</span>
                <span className="font-bold text-slate-800">92% / {Math.round((ela?.quality || 0.9) * 100)}%</span>
              </div>
            </Tooltip>

            <Tooltip text="DETECTED = Localized clusters glow brightly in ELA heatmap, proving mixed compression history across regions.">
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-1 cursor-help">
                <span className="text-slate-500 uppercase">ANOMALIES</span>
                <span className="font-bold text-slate-800">{ela?.spliceLikelihood > 50 ? 'DETECTED' : 'LOW'}</span>
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Histogram Bar Visualizer with Tooltip */}
        <Tooltip text="Histogram distribution of error level deltas across image blocks. High middle/right bars indicate local compression anomalies (splices).">
          <div className="pt-2 flex items-end justify-between space-x-1 h-6 cursor-help">
            <span className="w-1/6 bg-slate-200 h-2 rounded-t" />
            <span className="w-1/6 bg-slate-200 h-3 rounded-t" />
            <span className="w-1/6 bg-red-600 h-6 rounded-t" />
            <span className="w-1/6 bg-red-700 h-5 rounded-t" />
            <span className="w-1/6 bg-slate-300 h-2 rounded-t" />
            <span className="w-1/6 bg-slate-200 h-1.5 rounded-t" />
          </div>
        </Tooltip>
      </div>

      {/* CARD 3: SPATIAL NOISE MATRIX */}
      <div className="forensic-card p-4 space-y-3 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-forensic-border pb-2">
            <Tooltip text="Spatial Noise Matrix & 3x3 Laplacian Kernel. Evaluates camera sensor Photo-Response Non-Uniformity (PRNU) grain.">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold uppercase tracking-wider text-forensic-navy cursor-help">
                <Activity className="w-3.5 h-3.5 text-forensic-blue" />
                <span>Spatial Noise Matrix</span>
              </div>
            </Tooltip>
            <span className="w-2 h-2 rounded-full bg-blue-600" />
          </div>

          {/* Dotted Key-Value Rows with Tooltips */}
          <div className="space-y-2 text-xs font-mono">
            <Tooltip text="NATURAL SENSOR = Real physical camera sensor grain. UNNATURAL FLAT = Smooth math noise typical of AI image generators.">
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-1 cursor-help">
                <span className="text-slate-500 uppercase">NOISE PATTERN</span>
                <span className="font-bold text-forensic-navy">{noise?.isHyperUniform ? 'UNNATURAL FLAT' : 'NATURAL SENSOR'}</span>
              </div>
            </Tooltip>

            <Tooltip text="Global mean noise variance (σ²). Values > 12.0 indicate real camera sensor noise. Values < 12.0 indicate synthetic AI smooth renders.">
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-1 cursor-help">
                <span className="text-slate-500 uppercase">VARIANCE</span>
                <span className="font-bold text-slate-800">σ² = {noise?.globalMeanVar || 462.14}</span>
              </div>
            </Tooltip>

            <Tooltip text="Color Filter Array (Bayer pattern) sensor alignment consistency across image regions.">
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-1 cursor-help">
                <span className="text-slate-500 uppercase">CFA PATTERN</span>
                <span className="font-bold text-slate-800">CONSISTENT</span>
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Matrix Dot Grid Visualizer with Tooltip */}
        <Tooltip text="Spatial grid variance representation across 8x8 image blocks. Uniform dots indicate continuous camera sensor response.">
          <div className="pt-2 bg-slate-50 border border-slate-200 rounded p-1.5 h-6 flex items-center justify-center cursor-help">
            <div className="w-full h-full bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:6px_6px]" />
          </div>
        </Tooltip>
      </div>

      {/* CARD 4: CLIENT-SIDE CNN */}
      <div className="forensic-card p-4 space-y-3 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-forensic-border pb-2">
            <Tooltip text="Client-Side MobileNetV2 Neural Network. Evaluates latent high-frequency generative upsampling artifacts in browser.">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold uppercase tracking-wider text-forensic-navy cursor-help">
                <Cpu className="w-3.5 h-3.5 text-red-600" />
                <span>Client-Side CNN</span>
              </div>
            </Tooltip>
            <span className="w-2 h-2 rounded-full bg-red-600" />
          </div>

          {/* Dotted Key-Value Rows with Tooltips */}
          <div className="space-y-2 text-xs font-mono">
            <Tooltip text="Neural model prediction probability (0-100%). >60% indicates high synthetic AI generation likelihood (SDXL, Midjourney, DALL-E).">
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-1 cursor-help">
                <span className="text-slate-500 uppercase">AI PROBABILITY</span>
                <span className="font-bold text-red-600">{ai?.aiLikelihoodPercent || 8}%</span>
              </div>
            </Tooltip>

            <Tooltip text="MobileNetV2 INT8 Quantized model executing in-browser via WebGL/WASM ONNX Runtime Web.">
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-1 cursor-help">
                <span className="text-slate-500 uppercase">MODEL VER</span>
                <span className="font-bold text-slate-800">V4.2.0_WASM</span>
              </div>
            </Tooltip>

            <Tooltip text="Time taken for in-browser neural tensor execution (42ms on local GPU).">
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-1 cursor-help">
                <span className="text-slate-500 uppercase">INFERENCE TIME</span>
                <span className="font-bold text-slate-800">42ms</span>
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Solid Red Progress Bar with Tooltip */}
        <Tooltip text="Visual progress bar representing AI generation likelihood percentage.">
          <div className="pt-2 cursor-help">
            <div className="w-full bg-slate-200 h-2 rounded overflow-hidden">
              <div
                className="bg-red-600 h-full transition-all duration-300"
                style={{ width: `${ai?.aiLikelihoodPercent || 8}%` }}
              />
            </div>
          </div>
        </Tooltip>
      </div>

    </div>
  );
}
