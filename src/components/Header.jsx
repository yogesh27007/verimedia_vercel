import React from 'react';
import { ShieldCheck, Cpu, Code2, Sparkles, Terminal } from 'lucide-react';

export default function Header({ onOpenColabModal }) {
  return (
    <header className="border-b border-cyber-border bg-cyber-dark/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand logo & title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-accent via-cyber-neon to-cyber-pink p-0.5 shadow-lg shadow-cyber-accent/20">
            <div className="w-full h-full bg-cyber-dark rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-cyber-accent drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyber-accent bg-clip-text text-transparent">
                VeriMedia
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wider rounded bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30">
                v1.0 Capstone
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Client-Side Media Forensics & Provenance Engine
            </p>
          </div>
        </div>

        {/* Feature status badges & action buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* $0 Guarantee Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyber-green/10 text-cyber-green text-xs font-mono border border-cyber-green/30">
            <Sparkles className="w-3.5 h-3.5 text-cyber-green" />
            <span>$0 Backend Cost</span>
          </div>

          {/* WebGL/WASM Acceleration Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyber-neon/10 text-cyber-accent text-xs font-mono border border-cyber-neon/30">
            <Cpu className="w-3.5 h-3.5 text-cyber-accent" />
            <span>WebGL 2.0 / WASM</span>
          </div>

          {/* Open Colab Modal Button */}
          <button
            onClick={onOpenColabModal}
            className="cyber-btn flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-cyber-card hover:bg-cyber-border text-slate-200 text-xs font-semibold border border-cyber-border transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-cyber-accent" />
            <span>Colab Model Script ($0)</span>
          </button>
        </div>

      </div>
    </header>
  );
}
