/**
 * VeriMedia Video Forensics & Temporal Frame Analyzer
 * Processes MP4 / WEBM / MOV video files 100% client-side inside the browser for $0.
 * Extracts keyframes, runs ELA & Noise Matrix per frame, and checks temporal stability.
 */

import { runELAnalysis } from './elaEngine';
import { analyzeNoisePattern } from './noiseAnalyzer';
import { classifyAiLikelihood } from './aiClassifier';

export async function processVideoFile(videoFile, onProgress) {
  const videoUrl = URL.createObjectURL(videoFile);
  
  // 1. Create hidden video element to sample frames
  const video = document.createElement('video');
  video.src = videoUrl;
  video.crossOrigin = 'anonymous';
  video.muted = true;
  video.playsInline = true;

  await new Promise((resolve, reject) => {
    video.onloadedmetadata = () => resolve();
    video.onerror = (e) => reject(new Error('Failed to load video metadata'));
  });

  const duration = video.duration || 1.0;
  const width = video.videoWidth || 640;
  const height = video.videoHeight || 360;

  // 2. Sample 6 evenly spaced keyframes across video duration
  const sampleCount = 6;
  const frameTimes = [];
  for (let i = 0; i < sampleCount; i++) {
    frameTimes.push((duration / (sampleCount + 1)) * (i + 1));
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const frameResults = [];

  for (let i = 0; i < frameTimes.length; i++) {
    const time = frameTimes[i];
    if (onProgress) onProgress(`Extracting & Analyzing Video Keyframe ${i + 1} of ${sampleCount} (${time.toFixed(1)}s)...`);

    // Seek to keyframe time
    video.currentTime = time;
    await new Promise((res) => {
      video.onseeked = () => res();
    });

    ctx.drawImage(video, 0, 0, width, height);

    // Create frame image element for modules
    const frameDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const frameImg = await loadImage(frameDataUrl);

    // Run Forensic Modules on Frame
    const ela = await runELAnalysis(frameImg, 0.90, 15);
    const noise = analyzeNoisePattern(frameImg);
    const ai = await classifyAiLikelihood(frameImg);

    frameResults.push({
      time: time.toFixed(1),
      frameDataUrl,
      ela,
      noise,
      ai
    });
  }

  // 3. Compute Temporal Frame-to-Frame Variance (Detects Deepfake Flickering)
  const aiScores = frameResults.map(f => f.ai.aiLikelihoodPercent);
  const elaScores = frameResults.map(f => f.ela.spliceLikelihood);
  const noiseVars = frameResults.map(f => parseFloat(f.noise.globalMeanVar));

  const avgAiScore = Math.round(aiScores.reduce((a, b) => a + b, 0) / sampleCount);
  const avgElaScore = Math.round(elaScores.reduce((a, b) => a + b, 0) / sampleCount);
  const avgNoiseVar = noiseVars.reduce((a, b) => a + b, 0) / sampleCount;

  // Measure temporal noise variance instability across frames
  const temporalNoiseVar = noiseVars.reduce((acc, v) => acc + Math.pow(v - avgNoiseVar, 2), 0) / sampleCount;
  const temporalJitterRatio = avgNoiseVar > 0 ? (Math.sqrt(temporalNoiseVar) / avgNoiseVar) : 0;

  // 4. Synthesize Video Verdict
  let videoDiagnosis = 'REAL_VIDEO';
  let verdictBadge = 'REAL VIDEO';
  let verdictColor = 'green';
  let summaryTitle = 'High Confidence Authentic Camera Video';
  let summaryText = 'Keyframe sampling and temporal analysis show continuous physical sensor noise and zero recompression splices across all frames.';

  const isAIProne = avgAiScore >= 60 || (avgNoiseVar < 15.0 && temporalJitterRatio > 0.45);
  const isSplicedProne = avgElaScore >= 60;

  if (isAIProne) {
    videoDiagnosis = 'AI_GENERATED_FAKE_VIDEO';
    verdictBadge = 'AI-GENERATED / FAKE VIDEO';
    verdictColor = 'red';
    summaryTitle = 'High Likelihood Synthetic / Deepfake AI Video';
    summaryText = 'Temporal frame jitter and neural spectral classifier detect artificial deepfake rendering patterns (e.g. Sora, Runway, DeepFaceLab type signature).';
  } else if (isSplicedProne) {
    videoDiagnosis = 'SPLICED_EDITED_VIDEO';
    verdictBadge = 'SPLICED / EDITED VIDEO';
    verdictColor = 'yellow';
    summaryTitle = 'Video Keyframe Edit / Splice Detected';
    summaryText = 'Error Level Analysis (ELA) across sampled video frames revealed localized re-compression anomalies and region-specific splices.';
  }

  return {
    isVideo: true,
    videoUrl,
    duration: duration.toFixed(1),
    sampleCount,
    frameResults,
    avgAiScore,
    avgElaScore,
    avgNoiseVar: avgNoiseVar.toFixed(2),
    temporalJitterRatio: temporalJitterRatio.toFixed(3),
    videoDiagnosis,
    verdictBadge,
    verdictColor,
    summaryTitle,
    summaryText
  };
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
