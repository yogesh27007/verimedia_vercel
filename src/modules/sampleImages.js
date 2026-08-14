/**
 * VeriMedia Sample Test Suite
 * Generates synthetic test images (Authentic DSLR, Spliced Composite, SDXL AI-Generated)
 * dynamically onto canvas data URLs for zero-network live panel evaluation defense demos.
 */

export function getSampleImages() {
  return [
    {
      id: 'authentic',
      name: 'Authentic DSLR Camera Photo',
      tag: 'Real Photography',
      description: 'Original high-resolution camera photo with natural sensor noise and continuous lighting.',
      dataUrl: createSampleCanvas('AUTHENTIC')
    },
    {
      id: 'spliced',
      name: 'Spliced Composite Composite',
      tag: 'Splice / Edit Anomaly',
      description: 'Pasted object region with mismatched JPEG compression history and altered noise variance.',
      dataUrl: createSampleCanvas('SPLICED')
    },
    {
      id: 'ai-gen',
      name: 'SDXL / Midjourney AI Render',
      tag: 'AI-Generated Image',
      description: 'Synthetic render featuring hyper-uniform spatial noise and latent spectral upsampling patterns.',
      dataUrl: createSampleCanvas('AI_GEN')
    },
    {
      id: 'recompressed',
      name: 'WhatsApp Re-compressed Photo',
      tag: 'Stripped & Re-encoded',
      description: 'Social media image with metadata stripped and high quantization grid artifacts.',
      dataUrl: createSampleCanvas('RECOMPRESSED')
    }
  ];
}

function createSampleCanvas(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  if (type === 'AUTHENTIC') {
    // Landscape gradient with natural noise texture
    const grad = ctx.createLinearGradient(0, 0, 0, 400);
    grad.addColorStop(0, '#1e3c72');
    grad.addColorStop(0.5, '#2a5298');
    grad.addColorStop(1, '#0f2027');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 400);

    // Sun / Mountains
    ctx.fillStyle = '#ff7e5f';
    ctx.beginPath();
    ctx.arc(300, 220, 70, 0, Math.PI * 2);
    ctx.fill();

    // Natural camera noise simulation
    addNoise(ctx, 600, 400, 18);

    // Simulated EXIF text banner
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '12px monospace';
    ctx.fillText('EXIF: Canon EOS R5 | f/2.8 | ISO 100 | 1/500s | C2PA Manifest Valid', 20, 380);

  } else if (type === 'SPLICED') {
    // Background original image
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 600, 400);
    addNoise(ctx, 600, 400, 15);

    // Spliced rectangle pasted in center with different compression & noise level
    ctx.save();
    ctx.fillStyle = '#374151';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 10;
    ctx.fillRect(200, 100, 200, 200);

    // Heavy contrasting fill in spliced block
    const spliceGrad = ctx.createRadialGradient(300, 200, 10, 300, 200, 100);
    spliceGrad.addColorStop(0, '#f59e0b');
    spliceGrad.addColorStop(1, '#ef4444');
    ctx.fillStyle = spliceGrad;
    ctx.beginPath();
    ctx.arc(300, 200, 60, 0, Math.PI * 2);
    ctx.fill();

    // Pasted region has zero camera noise (sharp compression mismatch)
    ctx.restore();

  } else if (type === 'AI_GEN') {
    // Hyper-smooth synthetic gradient (Midjourney / SDXL style)
    const grad = ctx.createRadialGradient(300, 200, 20, 300, 200, 350);
    grad.addColorStop(0, '#8b5cf6');
    grad.addColorStop(0.4, '#ec4899');
    grad.addColorStop(0.8, '#3b82f6');
    grad.addColorStop(1, '#06b6d4');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 400);

    // Perfect mathematical geometric shapes (characteristic of diffusion generators)
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + i * 0.15})`;
      ctx.lineWidth = 2 + i;
      ctx.beginPath();
      ctx.arc(300, 200, 40 + i * 35, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Zero sensor noise (Flat variance signal)

  } else if (type === 'RECOMPRESSED') {
    // Low quality re-compressed image simulation
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 600, 400);
    
    // Grid block artifacts (8x8 JPEG DCT block boundary visualizer)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    for (let x = 0; x < 600; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 400);
      ctx.stroke();
    }
    for (let y = 0; y < 400; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(600, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText('Social Media Upload (Metadata Stripped by Platform)', 130, 200);
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}

function addNoise(ctx, width, height, amount) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const pixels = imgData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    pixels[i] = Math.min(255, Math.max(0, pixels[i] + n));
    pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] + n));
    pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] + n));
  }
  ctx.putImageData(imgData, 0, 0);
}
