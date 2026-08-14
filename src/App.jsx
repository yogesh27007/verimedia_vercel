import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
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
import { getSampleImages } from './modules/sampleImages';

import { Video, Sparkles, UploadCloud } from 'lucide-react';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  
  // Navigation active tab
  const [activeTab, setActiveTab] = useState('ela'); // 'original' | 'ela' | 'noise' | 'ai' | 'split'

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

  // Colab Modal state & Sample selector modal state
  const [isColabModalOpen, setIsColabModalOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  // Hidden File Input Ref for direct sidebar file picker
  const fileInputRef = useRef(null);

  const sampleImages = getSampleImages();

  // Load default sample image on app load so Dashboard opens DIRECTLY
  useEffect(() => {
    initOnnxModel();

    if (sampleImages && sampleImages[0]) {
      handleSampleClick(sampleImages[0]);
    }

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

  const handleSampleClick = async (sample) => {
    setIsSampleModalOpen(false);
    const res = await fetch(sample.dataUrl);
    const blob = await res.blob();
    const file = new File([blob], `${sample.id}_sample.jpg`, { type: 'image/jpeg' });
    handleFileSelected(file);
  };

  // Trigger native browser file picker directly from Sidebar button
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

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
        setProcessingStep('Initializing Client-Side Video Keyframe Extractor...');
        const videoRes = await processVideoFile(file, (stepMsg) => setProcessingStep(stepMsg));
        setVideoResult(videoRes);
      } else {
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

  const handleExportReport = () => {
    if (fusionResult?.reportExport) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fusionResult.reportExport, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `VeriMedia_Forensic_Report_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-forensic-bg text-forensic-navy font-sans">
      
      {/* Hidden File Input for Direct File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/ogg,video/quicktime"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Top Header */}
      <Header onOpenColabModal={() => setIsColabModalOpen(true)} />

      {/* Main Content Area — DIRECT DASHBOARD VIEW ONLY */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
        
        {/* Top Sample Test Button Bar */}
        <div className="flex items-center justify-between bg-white border border-forensic-border p-2.5 rounded-lg text-xs font-mono">
          <div className="flex items-center space-x-2 text-slate-700">
            <Sparkles className="w-4 h-4 text-forensic-blue" />
            <span className="font-bold uppercase tracking-wider">Evaluation Test Suite:</span>
            <span className="text-slate-500 hidden sm:inline">1-Click Test Scenarios Available</span>
          </div>

          <button
            onClick={() => setIsSampleModalOpen(true)}
            className="px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 text-forensic-blue font-bold border border-blue-200 transition-colors uppercase tracking-wider"
          >
            Select Test Scenario
          </button>
        </div>

        {/* Processing Spinner State */}
        {isProcessing ? (
          <div className="forensic-card p-12 text-center space-y-4">
            <div className="w-10 h-10 mx-auto border-3 border-forensic-blue border-t-transparent rounded-full animate-spin" />
            <div>
              <h3 className="text-base font-bold text-slate-800 font-mono">{processingStep}</h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">Executing WebGL shaders & WASM tensors on local GPU...</p>
            </div>
          </div>
        ) : videoResult ? (
          /* Video Dashboard Result */
          <div className="space-y-4 animate-fadeIn">
            <div className="forensic-card p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-forensic-border pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-forensic-blue">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-forensic-navy">{videoResult.summaryTitle}</h2>
                    <p className="text-xs text-slate-500 font-mono">Video Duration: {videoResult.duration}s • {videoResult.sampleCount} Keyframes Sampled</p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider ${
                  videoResult.verdictColor === 'red' ? 'bg-red-100 text-red-700 border border-red-200' :
                  videoResult.verdictColor === 'yellow' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  {videoResult.verdictBadge}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 border border-forensic-border">
                  <video src={videoResult.videoUrl} controls className="w-full h-full object-contain" />
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-forensic-border space-y-3 font-mono text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Average AI Likelihood:</span><span className="font-bold text-red-600">{videoResult.avgAiScore}%</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Average ELA Splice Delta:</span><span className="font-bold text-amber-700">{videoResult.avgElaScore}%</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Average Noise Variance (σ²):</span><span className="font-bold text-slate-800">{videoResult.avgNoiseVar}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Temporal Jitter Index:</span><span className="font-bold text-forensic-blue">{videoResult.temporalJitterRatio}</span></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Image Dashboard (DIRECT DASHBOARD VIEW ONLY) */
          <div className="space-y-4 animate-fadeIn">
            
            {/* Top Workspace Row: Sidebar + Evidence Viewer + Evidence Fusion Report */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              
              {/* Left Toolbox Sidebar */}
              <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onUploadClick={handleUploadClick}
              />

              {/* Center Evidence Canvas Viewer */}
              <ForensicViewer
                originalUrl={originalUrl}
                elaData={elaResult}
                noiseData={noiseResult}
                aiData={aiResult}
                activeTab={activeTab}
                onScaleChange={handleScaleChange}
                elaScale={elaScale}
                onExportReport={handleExportReport}
              />

              {/* Right Evidence Fusion Report Panel */}
              <FusionReport fusionData={fusionResult} />

            </div>

            {/* Bottom 4-Module Cards Grid */}
            <ModuleCards
              metadata={metadataResult}
              ela={elaResult}
              noise={noiseResult}
              ai={aiResult}
              onExportReport={handleExportReport}
            />

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-forensic-border py-3 text-xs font-mono text-slate-500 mt-auto">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
          <div>© 2026 VeriMedia Forensic Systems</div>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-forensic-blue transition-colors">Documentation</a>
            <a href="#" className="hover:text-forensic-blue transition-colors">Legal</a>
            <a href="#" className="hover:text-forensic-blue transition-colors">Security Audit</a>
          </div>
        </div>
      </footer>

      {/* Google Colab Modal */}
      <ColabModal
        isOpen={isColabModalOpen}
        onClose={() => setIsColabModalOpen(false)}
      />

      {/* Sample Test Scenario Selection Modal */}
      {isSampleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-2xl w-full p-5 space-y-4 border border-forensic-border shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-forensic-navy font-mono text-sm">Select Evaluation Test Scenario</h3>
              <button onClick={() => setIsSampleModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sampleImages.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSampleClick(s)}
                  className="p-3 text-left border rounded-lg hover:border-forensic-blue hover:bg-blue-50/50 transition-colors space-y-1"
                >
                  <div className="font-bold text-xs text-forensic-navy">{s.name}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-2">{s.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
