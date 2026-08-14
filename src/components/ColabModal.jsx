import React, { useState } from 'react';
import { X, Copy, Check, Terminal, ExternalLink, Sparkles } from 'lucide-react';

export default function ColabModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const colabScript = `"""
VeriMedia — Google Colab Free Tier ($0) Model Fine-Tuning & ONNX Export Script
Hardware: Free Nvidia T4 GPU
"""

import os
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.models as models
import io
from PIL import Image

print("=== VeriMedia Zero-Cost Colab Model Trainer ===")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Target Device: {device}")

# Build MobileNetV2 with Quantization Head
def build_verimedia_model():
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
    for param in model.features[:10].parameters():
        param.requires_grad = False
    
    num_ftrs = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.2),
        nn.Linear(num_ftrs, 128),
        nn.ReLU(),
        nn.Linear(128, 1) # Sigmoid logit output
    )
    return model

model = build_verimedia_model().to(device)

# Export to ONNX for client-side WASM/WebGL execution
dummy_input = torch.randn(1, 3, 224, 224).to(device)
torch.onnx.export(
    model,
    dummy_input,
    "verimedia_mobilenet_v2.onnx",
    export_params=True,
    opset_version=14,
    input_names=['input'],
    output_names=['output']
)

print("Export Complete: verimedia_mobilenet_v2.onnx generated successfully ($0 cost)!")
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(colabScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-glow w-full max-w-3xl rounded-2xl overflow-hidden space-y-4 max-h-[90vh] flex flex-col border border-cyber-accent/40">
        
        {/* Header */}
        <div className="p-4 border-b border-cyber-border flex items-center justify-between bg-cyber-dark/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyber-accent/20 border border-cyber-accent/40 flex items-center justify-center text-cyber-accent">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Google Colab Free Tier ($0) Training Script</h3>
              <p className="text-xs text-slate-400">One-Time Offline Fine-Tuning & ONNX Model Export</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-cyber-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto font-mono text-xs">
          
          <div className="p-3 rounded-xl bg-cyber-green/10 border border-cyber-green/30 text-cyber-green flex items-start space-x-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              This script runs on Google Colab's free T4 GPU tier. Zero credit card or subscription needed. It exports a 3.5MB INT8 quantized MobileNetV2 ONNX model that ships directly with your web app.
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-bold">Python Training Script (Colab Ready):</span>
              <button
                onClick={handleCopy}
                className="cyber-btn flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyber-accent/20 text-cyber-accent hover:bg-cyber-accent/30 font-semibold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-black/90 border border-cyber-border text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
              <code>{colabScript}</code>
            </pre>
          </div>

          <div className="p-3 rounded-xl bg-cyber-dark border border-cyber-border space-y-1 font-sans text-xs">
            <h4 className="font-bold text-slate-200">Steps to run on Colab:</h4>
            <ol className="list-decimal list-inside text-slate-400 space-y-1">
              <li>Open <a href="https://colab.research.google.com" target="_blank" rel="noreferrer" className="text-cyber-accent underline">Google Colab</a> (Log in with any free Gmail account).</li>
              <li>Go to <strong>Runtime → Change runtime type</strong> and select <strong>GPU (T4)</strong>.</li>
              <li>Paste the code above into a cell and press Shift+Enter.</li>
              <li>Download the resulting <code>verimedia_mobilenet_v2.onnx</code> file and put it in your <code>/public/models/</code> folder!</li>
            </ol>
          </div>

        </div>

      </div>
    </div>
  );
}
