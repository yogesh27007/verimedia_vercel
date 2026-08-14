import React, { useState } from 'react';
import { UploadCloud, Film, Image as ImageIcon, Sparkles, Play, Video } from 'lucide-react';
import { getSampleImages } from '../modules/sampleImages';

export default function DropZone({ onFileSelected, isProcessing }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const sampleImages = getSampleImages();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  const handleSampleClick = async (sample) => {
    const res = await fetch(sample.dataUrl);
    const blob = await res.blob();
    const file = new File([blob], `${sample.id}_sample.jpg`, { type: 'image/jpeg' });
    onFileSelected(file);
  };

  return (
    <div className="w-full space-y-6">
      {/* Primary Drag & Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-cyber-accent bg-cyber-accent/5 shadow-xl shadow-cyber-accent/10 scale-[1.01]'
            : 'border-cyber-border bg-cyber-card/60 hover:border-slate-600 hover:bg-cyber-card/90'
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/ogg,video/quicktime"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isProcessing}
        />

        <div className="max-w-md mx-auto space-y-4 pointer-events-none">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyber-dark/80 border border-cyber-border flex items-center justify-center text-cyber-accent shadow-inner">
            <UploadCloud className={`w-8 h-8 ${isProcessing ? 'animate-bounce' : ''}`} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-100">
              Drag & Drop Image / Video or Press <span className="px-2 py-0.5 rounded bg-cyber-accent/20 text-cyber-accent font-mono text-xs border border-cyber-accent/40">Ctrl + V</span> to Paste
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports JPEG, PNG, WEBP, MP4, WEBM — 100% Client-Side In-Browser Verification ($0 Cost).
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center space-x-3">
            <span className="px-4 py-2 rounded-xl bg-cyber-accent text-cyber-dark text-xs font-bold shadow-lg shadow-cyber-accent/20">
              Browse Image / Video File
            </span>
          </div>
        </div>
      </div>

      {/* Quick Sample Selector for Live Panel Defense */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyber-yellow" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Evaluation Defense Test Suite (Images & Video Keyframes)
            </h4>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">1-Click Test Scenarios</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sampleImages.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSampleClick(sample)}
              disabled={isProcessing}
              className="group glass-panel rounded-xl p-3 text-left hover:border-cyber-accent/50 hover:bg-cyber-card transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-cyber-dark border border-cyber-border">
                  <img
                    src={sample.dataUrl}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-cyber-dark/80 text-cyber-accent border border-cyber-accent/30 backdrop-blur-sm">
                    {sample.tag}
                  </span>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-200 group-hover:text-cyber-accent transition-colors">
                    {sample.name}
                  </h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                    {sample.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-cyber-border/50 flex items-center justify-between text-[11px] text-cyber-accent font-semibold">
                <span>Run Test Pass</span>
                <Play className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
