import React from 'react';
import { ShieldAlert, Flame, Activity, Cpu, CheckCircle2, AlertTriangle, FileText, HelpCircle } from 'lucide-react';

export default function ModuleCards({ metadata, ela, noise, ai }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* MODULE 1: C2PA & Metadata Binary Extractor */}
      <div className="glass-panel rounded-2xl p-5 space-y-4 border-l-4 border-l-cyber-accent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 flex items-center justify-center text-cyber-accent">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Module 1: C2PA & Metadata</h3>
              <p className="text-[11px] text-slate-400 font-mono">Binary JUMBF & EXIF Parser</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded ${
            metadata?.c2paStatus === 'VERIFIED'
              ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/40'
              : 'bg-cyber-yellow/20 text-cyber-yellow border border-cyber-yellow/40'
          }`}>
            {metadata?.c2paStatus || 'STRIPPED'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-cyber-dark/80 text-xs space-y-2 border border-cyber-border font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Provenance Manifest:</span>
            <span className="text-slate-200">{metadata?.c2paStatus === 'VERIFIED' ? 'C2PA Claim Valid' : 'Metadata Stripped'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Camera / Software:</span>
            <span className="text-cyber-accent">{metadata?.exif?.MakeModel || metadata?.exif?.Software || 'None Found (Stripped)'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">File Type & Size:</span>
            <span className="text-slate-300">{metadata?.fileType} ({metadata?.fileSizeKB} KB)</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {metadata?.summary}
        </p>

        <div className="text-[11px] text-slate-500 border-t border-cyber-border/50 pt-2 flex items-center space-x-1 font-mono">
          <HelpCircle className="w-3 h-3 text-cyber-accent shrink-0" />
          <span>Spec: C2PA Content Credentials v1.3 (ISO 21000-22)</span>
        </div>
      </div>

      {/* MODULE 2: WebGL ELA Shader Engine */}
      <div className="glass-panel rounded-2xl p-5 space-y-4 border-l-4 border-l-cyber-yellow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyber-yellow/10 border border-cyber-yellow/30 flex items-center justify-center text-cyber-yellow">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Module 2: Error Level Analysis</h3>
              <p className="text-[11px] text-slate-400 font-mono">WebGL 2.0 Fragment Shader</p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-mono font-bold rounded bg-cyber-yellow/20 text-cyber-yellow border border-cyber-yellow/40">
            Splice Score: {ela?.spliceLikelihood || 0}%
          </span>
        </div>

        <div className="p-3 rounded-xl bg-cyber-dark/80 text-xs space-y-2 border border-cyber-border font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Mean Re-compression Error:</span>
            <span className="text-cyber-yellow">{ela?.meanError || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Max Delta Error Level:</span>
            <span className="text-slate-200">{ela?.maxDiff || 0} / 255</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Spatial Anomaly Ratio:</span>
            <span className="text-slate-300">{ela?.anomalyRatio || 0}</span>
          </div>
        </div>

        <div className="text-xs text-slate-300 font-mono bg-black/40 p-2 rounded border border-white/5">
          Equation: E(x,y) = scale × (ΔR² + ΔG² + ΔB²)
        </div>

        <div className="text-[11px] text-slate-500 border-t border-cyber-border/50 pt-2 flex items-center space-x-1 font-mono">
          <HelpCircle className="w-3 h-3 text-cyber-yellow shrink-0" />
          <span>Lit: Krawetz (2007) JPEG Error Level Forensic Methodology</span>
        </div>
      </div>

      {/* MODULE 3: Spatial Noise Matrix */}
      <div className="glass-panel rounded-2xl p-5 space-y-4 border-l-4 border-l-cyber-neon">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyber-neon/10 border border-cyber-neon/30 flex items-center justify-center text-cyber-neon">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Module 3: Spatial Noise Matrix</h3>
              <p className="text-[11px] text-slate-400 font-mono">3x3 Laplacian Filter Kernel</p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-mono font-bold rounded bg-cyber-neon/20 text-cyber-accent border border-cyber-neon/40">
            {noise?.isHyperUniform ? 'UNNATURAL FLAT NOISE' : 'NATURAL SENSOR NOISE'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-cyber-dark/80 text-xs space-y-2 border border-cyber-border font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Global Mean Variance (σ²):</span>
            <span className="text-cyber-accent">{noise?.globalMeanVar || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Grid Inconsistency Ratio:</span>
            <span className="text-slate-200">{noise?.noiseInconsistencyRatio || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Noise Uniformity Verdict:</span>
            <span className={noise?.isHyperUniform ? 'text-cyber-red' : 'text-cyber-green'}>
              {noise?.isHyperUniform ? 'Hyper-Uniform (AI Signal)' : 'Camera PRNU Sensor Distribution'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {noise?.verdict}
        </p>

        <div className="text-[11px] text-slate-500 border-t border-cyber-border/50 pt-2 flex items-center space-x-1 font-mono">
          <HelpCircle className="w-3 h-3 text-cyber-neon shrink-0" />
          <span>Filter Kernel: Laplacian High-Pass Spatial Matrix (8x8 Grid)</span>
        </div>
      </div>

      {/* MODULE 4: Client-Side CNN AI Classifier */}
      <div className="glass-panel rounded-2xl p-5 space-y-4 border-l-4 border-l-cyber-pink">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyber-pink/10 border border-cyber-pink/30 flex items-center justify-center text-cyber-pink">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Module 4: Client-Side CNN Model</h3>
              <p className="text-[11px] text-slate-400 font-mono">ONNX Runtime Web / Spectrum</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded ${
            ai?.aiLikelihoodPercent > 60
              ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/40'
              : 'bg-cyber-green/20 text-cyber-green border border-cyber-green/40'
          }`}>
            AI Prob: {ai?.aiLikelihoodPercent || 0}%
          </span>
        </div>

        <div className="p-3 rounded-xl bg-cyber-dark/80 text-xs space-y-2 border border-cyber-border font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Execution Provider:</span>
            <span className="text-cyber-pink">{ai?.executionBackend}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Model Architecture:</span>
            <span className="text-slate-200">MobileNetV2 (3.5MB Quantized INT8)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Classification Verdict:</span>
            <span className="text-slate-300">{ai?.confidenceCategory}</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          In-browser inference evaluates latent spatial-frequency features characteristic of diffusion models (SDXL, Midjourney) at zero backend compute cost.
        </p>

        <div className="text-[11px] text-slate-500 border-t border-cyber-border/50 pt-2 flex items-center space-x-1 font-mono">
          <HelpCircle className="w-3 h-3 text-cyber-pink shrink-0" />
          <span>Inference: ONNX Runtime Web (WASM / WebGL2 Acceleration)</span>
        </div>
      </div>

    </div>
  );
}
