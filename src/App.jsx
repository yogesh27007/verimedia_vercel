import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DropZone from './components/DropZone';
import ForensicViewer from './components/ForensicViewer';
import ModuleCards from './components/ModuleCards';
import FusionReport from './components/FusionReport';
import ColabModal from './components/ColabModal';

import { parseMetadata } from './modules/c2paParser';
import { runELAnalysis } from './modules/elaEngine';
import { analyzeNoisePattern } from './modules/noiseAnalyzer';
import { classifyAiLikelihood, initOnnxModel } from './modules/aiClassifier';
import { fuseForensicEvidence } from './modules/fusionEngine';
import { processVideoFile } from './modules/videoProcessor';

import { RefreshCw, ShieldCheck, Cpu, ArrowLeft, Film, Video, CheckCircle2, AlertTriangle, XCircle, Download } from 'lucide-react';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  
  // Image analysis states
  const [metadataResult, setMetadataResult] = useState(null);
  const [elaResult, setElaResult] = useState(null);
  const [noiseResult, setNoiseResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [fusionResult, setFusionResult] = useState(null);

  // Video analysis state
  const [videoResult, setVideoResult] = useState(null);

  // ELA Scale dynamic state
  const [elaScale, setElaScale] = useState(15);
  const [currentImageElement, setCurrentImageElement] = useState(null);

  // Colab Modal state
  const [isColabModalOpen, setIsColabModalOpen] = useState(false);

  // Pre-initialize ONNX session asynchronously & listen for clipboard Ctrl+V image paste
  useEffect(() => {
    initOnnxModel();

    const handlePaste = (e) => {
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files[0]) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          handleFileSelected(file);
        }
      } else if (e.clipboardData && e.clipboardData.items) {
        for (const item of e.clipboardData.items) {
          if (item.type.startsWith('image/') || item.type.startsWith('video/')) {
            const blob = item.getAsFile();
            if (blob) {
              const file = new File([blob], `pasted_media_${Date.now()}.${item.type.includes('video') ? 'mp4' : 'png'}`, { type: blob.type });
              handleFileSelected(file);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Handle media file processing pipeline (Images & Videos)
  const handleFileSelected = async (file) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setMetadataResult(null);
    setElaResult(null);
    setNoiseResult(null);
    setAiResult(null);
    setFusionResult(null);
    setVideoResult(null);

    const mediaUrl = URL.createObjectURL(file);
    setOriginalUrl(mediaUrl);

    try {
      if (file.type.startsWith('video/')) {
        // Run Video Keyframe Forensics
        setProcessingStep('Initializing Client-Side Video Keyframe Extractor...');
        const videoRes = await processVideoFile(file, (stepMsg) => setProcessingStep(stepMsg));
        setVideoResult(videoRes);
      } else {
        // Run Image Forensics Pipeline
        setProcessingStep('Module 1: Parsing C2PA & JUMBF Binary Metadata...');
        const arrayBuffer = await file.arrayBuffer();
        const metadata = await parseMetadata(file, arrayBuffer);
        setMetadataResult(metadata);

        const img = await loadImage(mediaUrl);
        setCurrentImageElement(img);

        setProcessingStep('Module 2: Executing WebGL Error Level Analysis (ELA) Shader Pass...');
        const ela = await runELAnalysis(img, 0.90, elaScale);
        setElaResult(ela);

        setProcessingStep('Module 3: Computing 3x3 Laplacian Spatial Noise Matrix & Grid Variance...');
        const noise = analyzeNoisePattern(img);
        setNoiseResult(noise);

        setProcessingStep('Module 4: Running Client-Side ONNX Tensor Classifier & Feature Spectrum...');
        const ai = await classifyAiLikelihood(img);
        setAiResult(ai);

        setProcessingStep('Step 5: Calibrating Multi-Signal Evidence Fusion...');
        const fusion = fuseForensicEvidence({ metadata, ela, noise, ai });
        setFusionResult(fusion);
      }
    } catch (err) {
      console.error('Forensic processing error:', err);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleScaleChange = async (newScale) => {
    setElaScale(newScale);
    if (currentImageElement) {
      const updatedEla = await runELAnalysis(currentImageElement, 0.90, newScale);
      setElaResult(updatedEla);

      if (metadataResult && noiseResult && aiResult) {
        const updatedFusion = fuseForensicEvidence({
          metadata: metadataResult,
          ela: updatedEla,
          noise: noiseResult,
          ai: aiResult
        });
        setFusionResult(updatedFusion);
      }
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setOriginalUrl(null);
    setMetadataResult(null);
    setElaResult(null);
    setNoiseResult(null);
    setAiResult(null);
    setFusionResult(null);
    setVideoResult(null);
    setCurrentImageElement(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-slate-100">
      
      {/* Top Header */}
      <Header onOpenColabModal={() => setIsColabModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner Section */}
        {!selectedFile && (
          <div className="text-center space-y-3 max-w-3xl mx-auto py-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side Executable — Zero Cloud Cost ($0)</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyber-accent bg-clip-text text-transparent">
              In-Browser Image & Video Forensics Engine
            </h2>

            <p className="text-sm text-slate-400 leading-relaxed">
              Detect image & video manipulation, re-compression splices, stripped C2PA metadata, and AI-generated deepfakes directly on your laptop GPU/CPU with zero server roundtrips.
            </p>
          </div>
        )}

        {/* Upload Zone / State Selector */}
        {!selectedFile ? (
          <DropZone onFileSelected={handleFileSelected} isProcessing={isProcessing} />
        ) : (
          /* Active Analysis View */
          <div className="space-y-8">
            
            {/* Top Toolbar Navigation */}
            <div className="flex items-center justify-between border-b border-cyber-border pb-4">
              <button
                onClick={handleReset}
                className="cyber-btn flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyber-card hover:bg-cyber-border text-slate-300 text-xs font-semibold border border-cyber-border transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Upload Different File</span>
              </button>

              <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                <span>File: <strong className="text-slate-200">{selectedFile.name}</strong></span>
                <span>•</span>
                <span>Size: <strong className="text-cyber-accent">{(selectedFile.size / 1024).toFixed(1)} KB</strong></span>
              </div>
            </div>

            {/* Processing Spinner Bar */}
            {isProcessing ? (
              <div className="glass-panel rounded-2xl p-12 text-center space-y-4">
                <div className="w-12 h-12 mx-auto border-4 border-cyber-accent border-t-transparent rounded-full animate-spin" />
                <div>
                  <h3 className="text-base font-bold text-slate-200">{processingStep}</h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Executing WebGL shaders & WASM tensors on local GPU...</p>
                </div>
              </div>
            ) : videoResult ? (
              /* Video Analysis Dashboard */
              <div className="space-y-8 animate-fadeIn">
                
                {/* Video Player & Main Verdict Banner */}
                <div className="glass-panel rounded-2xl p-6 space-y-6">
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-cyber-accent/20 border border-cyber-accent/40 flex items-center justify-center text-cyber-accent">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-100">{videoResult.summaryTitle}</h2>
                        <p className="text-xs text-slate-400 font-mono">Video Duration: {videoResult.duration}s • {videoResult.sampleCount} Keyframes Sampled</p>
                      </div>
                    </div>

                    <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-extrabold tracking-wider uppercase ${
                      videoResult.verdictColor === 'red' ? 'bg-cyber-red/20 text-cyber-red border border-cyber-red/40' :
                      videoResult.verdictColor === 'yellow' ? 'bg-cyber-yellow/20 text-cyber-yellow border border-cyber-yellow/40' :
                      'bg-cyber-green/20 text-cyber-green border border-cyber-green/40'
                    }`}>
                      {videoResult.verdictBadge}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                    
                    {/* HTML5 Video Preview Player */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-cyber-border shadow-inner">
                      <video
                        src={videoResult.videoUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Keyframe Forensic Breakdown */}
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-cyber-dark/90 border border-cyber-border space-y-3 font-mono text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Average AI Likelihood:</span>
                          <span className={videoResult.avgAiScore > 50 ? 'text-cyber-red font-bold' : 'text-cyber-green'}>{videoResult.avgAiScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Average ELA Splice Delta:</span>
                          <span className="text-cyber-yellow">{videoResult.avgElaScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Average Noise Variance (σ²):</span>
                          <span className="text-slate-200">{videoResult.avgNoiseVar}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Temporal Jitter / Jitter Index:</span>
                          <span className="text-cyber-accent">{videoResult.temporalJitterRatio}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed bg-cyber-card p-3 rounded-xl border border-cyber-border">
                        {videoResult.summaryText}
                      </p>
                    </div>

                  </div>

                  {/* Keyframe Timeline Thumbnails */}
                  <div className="space-y-3 border-t border-cyber-border pt-4">
                    <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                      Extracted Keyframe Forensic Heatmap Samples
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {videoResult.frameResults.map((frame, idx) => (
                        <div key={idx} className="glass-panel p-2 rounded-xl space-y-1.5 border border-cyber-border">
                          <div className="aspect-video rounded overflow-hidden bg-black border border-white/10">
                            <img src={frame.ela.elaDataUrl} alt={`Frame ${idx}`} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-slate-400">{frame.time}s</span>
                            <span className={frame.ai.aiLikelihoodPercent > 50 ? 'text-cyber-pink' : 'text-cyber-green'}>
                              AI: {frame.ai.aiLikelihoodPercent}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              /* Image Forensic Dashboard Results */
              <div className="space-y-8 animate-fadeIn">
                <ForensicViewer
                  originalUrl={originalUrl}
                  elaData={elaResult}
                  noiseData={noiseResult}
                  aiData={aiResult}
                  onScaleChange={handleScaleChange}
                  elaScale={elaScale}
                />

                <FusionReport fusionData={fusionResult} />

                <ModuleCards
                  metadata={metadataResult}
                  ela={elaResult}
                  noise={noiseResult}
                  ai={aiResult}
                />
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border bg-cyber-dark py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-xs text-slate-500 font-mono">
            VeriMedia Capstone Project — 100% Client-Side Image & Video Forensics Engine ($0 Deployment Guarantee)
          </p>
          <p className="text-[11px] text-slate-600">
            Open-Source MIT / Apache 2.0 • WebGL 2.0 • WebAssembly • ONNX Runtime Web • HTML5 Video Frame Extractor
          </p>
        </div>
      </footer>

      {/* Google Colab Modal */}
      <ColabModal
        isOpen={isColabModalOpen}
        onClose={() => setIsColabModalOpen(false)}
      />

    </div>
  );
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}
