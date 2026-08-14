import React from 'react';
import { Eye, Flame, Activity, Cpu, SplitSquareVertical, UploadCloud } from 'lucide-react';
import Tooltip from './Tooltip';

export default function Sidebar({ activeTab, onTabChange, onUploadClick }) {
  const navItems = [
    { id: 'original', label: 'Original', icon: Eye, desc: 'Display baseline unmodified original media file.' },
    { id: 'ela', label: 'ELA', icon: Flame, desc: 'WebGL 2.0 Error Level Analysis shader highlighting JPEG recompression splices.' },
    { id: 'noise', label: 'Noise', icon: Activity, desc: '3x3 Laplacian high-pass spatial noise variance matrix.' },
    { id: 'ai', label: 'AI Map', icon: Cpu, desc: 'Neural spectrum feature activation map highlighting generative AI patterns.' },
    { id: 'split', label: 'Split Loupe', icon: SplitSquareVertical, desc: 'Interactive side-by-side comparison slider.' },
  ];

  return (
    <aside className="w-full lg:w-56 shrink-0 flex flex-col justify-between forensic-card p-4 space-y-6">
      <div className="space-y-4">
        {/* Title */}
        <div>
          <h2 className="text-sm font-extrabold text-forensic-navy">Toolbox</h2>
          <p className="text-[11px] text-forensic-muted font-mono uppercase tracking-wider">Analysis Modes</p>
        </div>

        {/* Navigation Mode List with Tooltips */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Tooltip key={item.id} text={item.desc} position="right">
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-forensic-blue border-l-4 border-forensic-blue font-bold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-forensic-blue' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              </Tooltip>
            );
          })}
        </nav>

        {/* Upload Button with Tooltip */}
        <div className="pt-2 border-t border-forensic-border">
          <Tooltip text="Click or drop a new image/video to run a fresh forensic pass.">
            <button
              onClick={onUploadClick}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors"
            >
              <UploadCloud className="w-4 h-4 text-forensic-blue" />
              <span>Upload New Media</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* System Status Box at bottom with Tooltip */}
      <Tooltip text="Local WebGL/WASM engine is active and ready to process media tensors instantly.">
        <div className="p-3 rounded-lg bg-forensic-bg border border-forensic-border space-y-1 cursor-help">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-forensic-slate">
            System Status
          </div>
          <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-forensic-blue animate-pulse" />
            <span>Online & Processing</span>
          </div>
        </div>
      </Tooltip>
    </aside>
  );
}
