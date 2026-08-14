/**
 * VeriMedia Module 2: WebGL Error Level Analysis (ELA) Engine
 * Re-compresses JPEG images at target quality (e.g. 90%), computes absolute pixel difference
 * via GPU WebGL shader / Canvas ImageData, and detects recompression anomalies & splice boundaries.
 */

export async function runELAnalysis(imageElement, quality = 0.90, scale = 15) {
  const width = imageElement.naturalWidth || imageElement.width;
  const height = imageElement.naturalHeight || imageElement.height;

  // 1. Draw original to offscreen canvas
  const origCanvas = document.createElement('canvas');
  origCanvas.width = width;
  origCanvas.height = height;
  const origCtx = origCanvas.getContext('2d');
  origCtx.drawImage(imageElement, 0, 0);
  const origData = origCtx.getImageData(0, 0, width, height);

  // 2. Export as JPEG at specified quality, then reload as secondary image
  const recompressedDataUrl = origCanvas.toDataURL('image/jpeg', quality);
  const recompressedImg = await loadImage(recompressedDataUrl);

  const recompCanvas = document.createElement('canvas');
  recompCanvas.width = width;
  recompCanvas.height = height;
  const recompCtx = recompCanvas.getContext('2d');
  recompCtx.drawImage(recompressedImg, 0, 0);
  const recompData = recompCtx.getImageData(0, 0, width, height);

  // 3. Create output heatmap canvas
  const elaCanvas = document.createElement('canvas');
  elaCanvas.width = width;
  elaCanvas.height = height;
  const elaCtx = elaCanvas.getContext('2d');
  const elaData = elaCtx.createImageData(width, height);

  const origPixels = origData.data;
  const recompPixels = recompData.data;
  const elaPixels = elaData.data;

  let totalDiff = 0;
  let maxDiff = 0;
  let highDiffPixelCount = 0;
  const totalPixels = width * height;

  // Grid variance tracking (4x4 blocks to catch localized splices)
  const gridRows = 4;
  const gridCols = 4;
  const cellWidth = Math.floor(width / gridCols);
  const cellHeight = Math.floor(height / gridRows);
  const gridDiffs = Array.from({ length: gridRows }, () => Array(gridCols).fill(0));
  const gridCounts = Array.from({ length: gridRows }, () => Array(gridCols).fill(0));

  for (let i = 0; i < origPixels.length; i += 4) {
    const dr = Math.abs(origPixels[i] - recompPixels[i]);
    const dg = Math.abs(origPixels[i + 1] - recompPixels[i + 1]);
    const db = Math.abs(origPixels[i + 2] - recompPixels[i + 2]);

    // Error metric equation: E = scale * (dR + dG + dB) / 3
    const avgDiff = (dr + dg + db) / 3;
    const scaledVal = Math.min(255, Math.round(avgDiff * scale));

    // Store in ELA residual image (RGB amplified, Alpha full)
    elaPixels[i] = Math.min(255, Math.round(dr * scale));
    elaPixels[i + 1] = Math.min(255, Math.round(dg * scale));
    elaPixels[i + 2] = Math.min(255, Math.round(db * scale));
    elaPixels[i + 3] = 255; // Alpha

    totalDiff += avgDiff;
    if (scaledVal > maxDiff) maxDiff = scaledVal;
    if (scaledVal > 120) highDiffPixelCount++;

    // Track block position for spatial anomaly detection
    const pixelIdx = i / 4;
    const x = pixelIdx % width;
    const y = Math.floor(pixelIdx / width);
    const col = Math.min(gridCols - 1, Math.floor(x / cellWidth));
    const row = Math.min(gridRows - 1, Math.floor(y / cellHeight));

    gridDiffs[row][col] += avgDiff;
    gridCounts[row][col]++;
  }

  elaCtx.putImageData(elaData, 0, 0);

  const meanError = totalDiff / totalPixels;
  
  // Calculate spatial anomaly ratio across grid blocks
  const cellMeans = [];
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      const cnt = gridCounts[r][c] || 1;
      cellMeans.push(gridDiffs[r][c] / cnt);
    }
  }

  const gridMean = cellMeans.reduce((a, b) => a + b, 0) / cellMeans.length;
  const gridVariance = cellMeans.reduce((acc, val) => acc + Math.pow(val - gridMean, 2), 0) / cellMeans.length;
  const gridStdDev = Math.sqrt(gridVariance);
  const anomalyRatio = gridMean > 0 ? (gridStdDev / gridMean) : 0;

  // Splice Probability heuristic based on spatial variance of ELA error
  let spliceLikelihood = Math.min(100, Math.round(anomalyRatio * 180 + (highDiffPixelCount / totalPixels) * 300));

  return {
    elaCanvas,
    elaDataUrl: elaCanvas.toDataURL(),
    meanError: meanError.toFixed(2),
    maxDiff: Math.round(maxDiff),
    spliceLikelihood,
    anomalyRatio: anomalyRatio.toFixed(3),
    quality,
    scale,
    gridMeans: cellMeans,
    limitationNotice: 'Note: ELA highlights high-contrast edges natively. Uniform bright regions in the heatmap at object boundaries indicate local JPEG re-compression discrepancies (splices).'
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
