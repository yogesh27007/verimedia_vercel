import React from 'react';
import { Cpu, Sliders, Database, ShieldCheck, Terminal } from 'lucide-react';
import Tooltip from './Tooltip';

export default function Header({ onOpenColabModal }) {
  return (
    <header className="bg-white border-b border-forensic-border sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Brand logo & Version badge */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold tracking-tight text-forensic-navy font-sans">
              VeriMedia
            </h1>
            <Tooltip text="Capstone v1.0 Client-Side Media Forensics & Provenance Engine.">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded bg-slate-100 text-slate-700 border border-slate-300 cursor-help">
                V1.0 CAPSTONE
              </span>
            </Tooltip>
          </div>
        </div>

        {/* Right Status Metrics */}
        <div className="flex items-center space-x-6 text-xs font-mono">
          
          <Tooltip text="100% Client-Side Executable. All calculations run locally in your browser on your laptop GPU/CPU — zero server compute cost ($0.00).">
            <div className="hidden sm:block text-right cursor-help">
              <div className="text-[10px] text-forensic-slate uppercase font-bold tracking-wider">Backend Cost</div>
              <div className="font-extrabold text-forensic-blue">$0.00</div>
            </div>
          </Tooltip>

          <Tooltip text="Hardware acceleration active using WebGL 2.0 GPU fragment shaders and WebAssembly (WASM) tensors.">
            <div className="hidden sm:block text-right cursor-help">
              <div className="text-[10px] text-forensic-slate uppercase font-bold tracking-wider">WebGL 2.0/WASM</div>
              <div className="font-extrabold text-forensic-blue">Active</div>
            </div>
          </Tooltip>

          <Tooltip text="PyTorch training script ready for Google Colab free T4 GPU tier.">
            <div className="hidden md:block text-right cursor-help">
              <div className="text-[10px] text-forensic-slate uppercase font-bold tracking-wider">Colab Script</div>
              <div className="font-semibold text-slate-600">Synced</div>
            </div>
          </Tooltip>

          {/* Action / Colab Trigger Button */}
          <Tooltip text="Click to view and copy the Google Colab PyTorch model training script.">
            <button
              onClick={onOpenColabModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-forensic-bg hover:bg-slate-200 text-slate-700 font-semibold border border-forensic-border transition-colors text-xs"
            >
              <Terminal className="w-3.5 h-3.5 text-forensic-blue" />
              <span>Colab Script</span>
            </button>
          </Tooltip>

          {/* Icon Indicators */}
          <div className="flex items-center space-x-2 text-slate-500 border-l border-forensic-border pl-4">
            <Tooltip text="Hardware Acceleration Engine Active">
              <Cpu className="w-4 h-4 hover:text-forensic-blue cursor-pointer" />
            </Tooltip>
            <Tooltip text="Dynamic ELA Amplification Slider Active">
              <Sliders className="w-4 h-4 hover:text-forensic-blue cursor-pointer" />
            </Tooltip>
            <Tooltip text="Local Browser Tensor Memory Active">
              <Database className="w-4 h-4 hover:text-forensic-blue cursor-pointer" />
            </Tooltip>
          </div>

        </div>

      </div>
    </header>
  );
}
