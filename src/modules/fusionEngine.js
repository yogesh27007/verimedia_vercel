/**
 * VeriMedia Evidence Fusion Engine
 * Combines signals from C2PA Provenance, WebGL ELA, Laplacian Spatial Noise, and AI CNN Classifier.
 * Implements literature-backed transparent weighting (no single opaque score).
 */

export function fuseForensicEvidence({ metadata, ela, noise, ai }) {
  let c2paScore = 0;
  let elaScore = ela ? ela.spliceLikelihood : 0;
  let noiseScore = noise ? (noise.isHyperUniform ? 80 : Math.round(parseFloat(noise.noiseInconsistencyRatio) * 100)) : 0;
  let aiScore = ai ? ai.aiLikelihoodPercent : 0;

  // Weight configuration (Literature reference: Multi-Domain Media Forensics Fusion)
  let weights = {
    c2pa: 0.40,
    ela: 0.20,
    noise: 0.20,
    ai: 0.20
  };

  // If C2PA manifest is cryptographically verified intact
  if (metadata && metadata.c2paStatus === 'VERIFIED') {
    c2paScore = 100; // Provenance verified
    weights = { c2pa: 0.70, ela: 0.10, noise: 0.10, ai: 0.10 };
  } else {
    // C2PA stripped (typical on web images) -> redistribute weight to forensic signal processing
    c2paScore = 0;
    weights = { c2pa: 0.00, ela: 0.35, noise: 0.30, ai: 0.35 };
  }

  // Calculate weighted overall suspicion grade (0-100%)
  const compositeSuspicion = Math.round(
    (c2paScore * weights.c2pa) +
    (elaScore * weights.ela) +
    (noiseScore * weights.noise) +
    (aiScore * weights.ai)
  );

  // Determine Categorical Diagnosis
  let diagnosis = 'AUTHENTIC_PHOTO';
  let badgeColor = 'green';
  let summaryTitle = 'High Confidence Authentic Media';
  let summaryText = 'No significant digital manipulation, recompression splices, or generative artifacts detected across all 4 forensic modules.';

  if (metadata && metadata.c2paStatus === 'VERIFIED') {
    diagnosis = 'CRYPTOGRAPHICALLY_VERIFIED';
    badgeColor = 'cyan';
    summaryTitle = 'Verified Provenance Chain (C2PA)';
    summaryText = 'Image contains an intact cryptographic manifest signed by an authenticated content generator or camera device.';
  } else if (aiScore >= 70 && noise.isHyperUniform) {
    diagnosis = 'AI_GENERATED_SYNTHETIC';
    badgeColor = 'red';
    summaryTitle = 'High Likelihood AI-Generated Image';
    summaryText = 'Module 4 CNN classification and Module 3 noise uniformity strongly indicate synthetic generation (SDXL/Midjourney type signature).';
  } else if (elaScore >= 60 || noiseScore >= 70) {
    diagnosis = 'SPLICED_COMPOSITE_EDIT';
    badgeColor = 'yellow';
    summaryTitle = 'Localized Splice / Edit Detected';
    summaryText = 'Error Level Analysis (ELA) and Spatial Noise Variance indicate region-specific recompression anomalies or mismatched camera sensor noise.';
  } else if (compositeSuspicion > 45) {
    diagnosis = 'MODIFIED_OR_UNKNOWN';
    badgeColor = 'yellow';
    summaryTitle = 'Metadata Stripped / Moderate Artifacts';
    summaryText = 'Standard digital image with stripped metadata and moderate compression artifacts. Exercise normal verification caution.';
  }

  // Radar Chart Breakdown
  const radarData = {
    labels: ['C2PA Provenance', 'ELA Splice Delta', 'Spatial Noise Inconsistency', 'AI Spectrum Classifier', 'Global Compression'],
    datasets: [
      {
        label: 'Forensic Response Level',
        data: [
          c2paScore,
          elaScore,
          noiseScore,
          aiScore,
          ela ? Math.min(100, Math.round(parseFloat(ela.meanError) * 15)) : 20
        ],
        backgroundColor: 'rgba(0, 240, 255, 0.25)',
        borderColor: '#00f0ff',
        pointBackgroundColor: '#7000ff',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#00f0ff'
      }
    ]
  };

  // Build JSON Report Object for Defense Presentation Export
  const reportExport = {
    metadata: {
      timestamp: new Date().toISOString(),
      engine: 'VeriMedia Client-Side Forensics Engine v1.0',
      fileName: metadata?.fileName || 'analyzed_image.jpg',
      fileSizeKB: metadata?.fileSizeKB || 0,
      computeCost: '$0.00 (Client-Side WebGL/WASM Browser Execution)'
    },
    verdict: {
      diagnosis,
      compositeSuspicionGrade: compositeSuspicion,
      summaryTitle,
      summaryText
    },
    moduleBreakdown: {
      module1_C2PA: {
        status: metadata?.c2paStatus,
        exifFound: Object.keys(metadata?.exif || {}).length > 0,
        exifData: metadata?.exif
      },
      module2_ELA: {
        meanErrorLevel: ela?.meanError,
        maxDiff: ela?.maxDiff,
        spliceLikelihood: ela?.spliceLikelihood,
        gridAnomalyRatio: ela?.anomalyRatio
      },
      module3_Noise: {
        globalMeanVar: noise?.globalMeanVar,
        noiseInconsistencyRatio: noise?.noiseInconsistencyRatio,
        isHyperUniform: noise?.isHyperUniform
      },
      module4_AiClassifier: {
        aiProbability: ai?.aiProbability,
        aiLikelihoodPercent: ai?.aiLikelihoodPercent,
        backend: ai?.executionBackend
      }
    },
    weightsApplied: weights
  };

  return {
    c2paScore,
    elaScore,
    noiseScore,
    aiScore,
    weights,
    compositeSuspicion,
    diagnosis,
    badgeColor,
    summaryTitle,
    summaryText,
    radarData,
    reportExport
  };
}
