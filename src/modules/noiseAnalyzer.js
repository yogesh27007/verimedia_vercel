/**
 * VeriMedia Module 3: Spatial Noise Matrix & Laplacian Variance Analyzer
 * Applies a 3x3 Laplacian filter high-pass kernel to calculate sensor noise residual and grid variance.
 */

export function analyzeNoisePattern(imageElement) {
  const width = imageElement.naturalWidth || imageElement.width;
  const height = imageElement.naturalHeight || imageElement.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0);

  const imgData = ctx.getImageData(0, 0, width, height);
  const src = imgData.data;

  // 1. Grayscale luminance array
  const gray = new Float32Array(width * height);
  for (let i = 0; i < src.length; i += 4) {
    gray[i / 4] = 0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2];
  }

  // 2. 3x3 Laplacian high-pass filter pass
  // Kernel: [ 0  -1   0 ]
  //         [-1   4  -1 ]
  //         [ 0  -1   0 ]
  const laplacian = new Float32Array(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const val = 4 * gray[idx] 
                - gray[idx - 1] 
                - gray[idx + 1] 
                - gray[idx - width] 
                - gray[idx + width];
      laplacian[idx] = Math.abs(val);
    }
  }

  // 3. Grid variance calculation (8x8 grid matrix)
  const gridRows = 8;
  const gridCols = 8;
  const cellW = Math.floor(width / gridCols);
  const cellH = Math.floor(height / gridRows);

  const gridVariances = [];
  const gridMeans = [];
  let globalNoiseSum = 0;

  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      const startX = c * cellW;
      const startY = r * cellH;
      const endX = Math.min(width, startX + cellW);
      const endY = Math.min(height, startY + cellH);

      let cellSum = 0;
      let count = 0;

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const v = laplacian[y * width + x];
          cellSum += v;
          count++;
        }
      }

      const mean = cellSum / (count || 1);
      gridMeans.push(mean);
      globalNoiseSum += cellSum;

      // Variance calculation for cell
      let varSum = 0;
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const v = laplacian[y * width + x];
          varSum += Math.pow(v - mean, 2);
        }
      }
      const cellVar = varSum / (count || 1);
      gridVariances.push(cellVar);
    }
  }

  // 4. Generate Noise Heatmap Visualization
  const noiseCanvas = document.createElement('canvas');
  noiseCanvas.width = width;
  noiseCanvas.height = height;
  const noiseCtx = noiseCanvas.getContext('2d');
  const noiseImgData = noiseCtx.createImageData(width, height);
  const dst = noiseImgData.data;

  // Max variance for normalization
  const maxVar = Math.max(...gridVariances, 1);

  for (let y = 0; y < height; y++) {
    const rIdx = Math.min(gridRows - 1, Math.floor(y / cellH));
    for (let x = 0; x < width; x++) {
      const cIdx = Math.min(gridCols - 1, Math.floor(x / cellW));
      const cellIdx = rIdx * gridCols + cIdx;
      const cellVar = gridVariances[cellIdx];
      const normVar = Math.min(1, cellVar / maxVar);

      const pIdx = (y * width + x) * 4;
      const lapVal = Math.min(255, laplacian[y * width + x] * 3);

      // Color mapping: Cold (blue) for unnatural flat noise, Warm (cyan/red) for natural high noise
      dst[pIdx] = Math.round(normVar * 255);                 // Red = high variance
      dst[pIdx + 1] = Math.round((1 - normVar) * 200);        // Green
      dst[pIdx + 2] = Math.round(lapVal);                     // Blue = laplacian high pass
      dst[pIdx + 3] = 255;
    }
  }

  noiseCtx.putImageData(noiseImgData, 0, 0);

  // Metrics summary
  const globalMeanVar = gridVariances.reduce((a, b) => a + b, 0) / gridVariances.length;
  const varOfVariances = gridVariances.reduce((acc, v) => acc + Math.pow(v - globalMeanVar, 2), 0) / gridVariances.length;
  const noiseInconsistencyRatio = globalMeanVar > 0 ? (Math.sqrt(varOfVariances) / globalMeanVar) : 0;

  // Heuristic reads:
  // Low global variance everywhere -> Unnaturally smooth synthetic image signal
  // High noise inconsistency -> Spliced image with mismatched camera sensor fingerprints
  const isHyperUniform = globalMeanVar < 12.0;

  return {
    noiseCanvas,
    noiseDataUrl: noiseCanvas.toDataURL(),
    gridVariances,
    globalMeanVar: globalMeanVar.toFixed(2),
    noiseInconsistencyRatio: noiseInconsistencyRatio.toFixed(3),
    isHyperUniform,
    verdict: isHyperUniform 
      ? 'Unnaturally low noise variance across grid (Characteristic of generative AI renderers)'
      : noiseInconsistencyRatio > 0.85 
        ? 'High noise inconsistency across regions (Potential composite splice)' 
        : 'Consistent natural physical sensor noise distribution'
  };
}
