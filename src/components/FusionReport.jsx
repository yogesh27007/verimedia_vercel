import React from 'react';
import { ShieldCheck, ShieldAlert, Download, FileCheck, HelpCircle, CheckCircle, BarChart3 } from 'lucide-react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function FusionReport({ fusionData }) {
  if (!fusionData) return null;

  const {
    compositeSuspicion,
    summaryTitle,
    summaryText,
    badgeColor,
    radarData,
    c2paScore,
    elaScore,
    noiseScore,
    aiScore,
    weights,
    reportExport
  } = fusionData;

  const handleDownloadReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `VeriMedia_Forensic_Report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: {
          color: '#94a3b8',
          font: { size: 10, family: 'Fira Code' }
        },
        ticks: {
          color: '#64748b',
          backdropColor: 'transparent',
          min: 0,
          max: 100
        }
      }
    },
    plugins: {
      legend: { display: false }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-6">
      
      {/* Header Verdict Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase text-cyber-accent tracking-wider font-bold">
              Evidence Fusion Report
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyber-dark text-slate-400 border border-cyber-border">
              Client-Side Calibrated Weights
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-100">{summaryTitle}</h2>
          <p className="text-xs text-slate-400 max-w-2xl">{summaryText}</p>
        </div>

        {/* Download Report Button */}
        <button
          onClick={handleDownloadReport}
          className="cyber-btn flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyber-accent to-cyber-neon text-cyber-dark font-extrabold text-xs shadow-lg shadow-cyber-accent/20 transition-all hover:scale-105"
        >
          <Download className="w-4 h-4" />
          <span>Export JSON Forensic Audit</span>
        </button>
      </div>

      {/* Grid Layout: Gauge + Radar Chart + Weighted Formula Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        
        {/* Suspicion Score Gauge */}
        <div className="p-5 rounded-2xl bg-cyber-dark/90 border border-cyber-border text-center space-y-3 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Circular Progress Meter */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-cyber-border"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={compositeSuspicion > 60 ? 'text-cyber-red' : compositeSuspicion > 30 ? 'text-cyber-yellow' : 'text-cyber-accent'}
                strokeDasharray={`${compositeSuspicion}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold tracking-tight font-mono text-slate-100">
                {compositeSuspicion}%
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest mt-0.5">
                Suspicion
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
              badgeColor === 'red' ? 'bg-cyber-red/20 text-cyber-red border border-cyber-red/40' :
              badgeColor === 'yellow' ? 'bg-cyber-yellow/20 text-cyber-yellow border border-cyber-yellow/40' :
              badgeColor === 'cyan' ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/40' :
              'bg-cyber-green/20 text-cyber-green border border-cyber-green/40'
            }`}>
              {badgeColor === 'red' ? 'SYNTHETIC / SPLICED' : badgeColor === 'yellow' ? 'MODIFIED / UNKNOWN' : 'NATURAL PHOTO'}
            </span>
            <p className="text-[11px] text-slate-400 font-mono">
              Fused Evidence Risk Metric
            </p>
          </div>
        </div>

        {/* Multi-Dimensional Radar Chart */}
        <div className="p-4 rounded-2xl bg-cyber-dark/90 border border-cyber-border h-64 relative flex flex-col items-center justify-center">
          <div className="w-full h-full">
            <Radar data={radarData} options={chartOptions} />
          </div>
        </div>

        {/* Weighted Formula transparent table */}
        <div className="p-4 rounded-2xl bg-cyber-dark/90 border border-cyber-border space-y-3">
          <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300 flex items-center space-x-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-cyber-accent" />
            <span>Calibrated Fusion Weight Formula</span>
          </h4>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center p-2 rounded bg-cyber-card">
              <span className="text-slate-400">C2PA Manifest (w={weights.c2pa}):</span>
              <span className="text-cyber-accent">{c2paScore}%</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-cyber-card">
              <span className="text-slate-400">WebGL ELA Shader (w={weights.ela}):</span>
              <span className="text-cyber-yellow">{elaScore}%</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-cyber-card">
              <span className="text-slate-400">Spatial Noise Grid (w={weights.noise}):</span>
              <span className="text-cyber-neon">{noiseScore}%</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-cyber-card">
              <span className="text-slate-400">CNN AI Classifier (w={weights.ai}):</span>
              <span className="text-cyber-pink">{aiScore}%</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal">
            * C2PA manifest presence redistributes weights transparently so social media metadata stripping does not create false positive verdicts.
          </p>
        </div>

      </div>

      {/* Capstone Defense Panel Checklist */}
      <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-accent font-mono">
          Capstone Course Outcomes (CO) Alignment Verification
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start space-x-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
            <span><strong>CO1/CO4:</strong> Literature survey & WebGL ELA / Laplacian shader math implementation.</span>
          </div>
          <div className="flex items-start space-x-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
            <span><strong>CO2/CO3:</strong> SWE architecture, client-side WASM, zero server cost security guarantee.</span>
          </div>
          <div className="flex items-start space-x-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
            <span><strong>CO5/CO6:</strong> Functional UI, downloadable JSON benchmark reports & 4-student team workflow.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
