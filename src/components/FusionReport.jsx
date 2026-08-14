import React from 'react';
import { Radar } from 'react-chartjs-2';
import Tooltip from './Tooltip';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend);

export default function FusionReport({ fusionData }) {
  if (!fusionData) return null;

  const {
    compositeSuspicion,
    badgeColor,
    radarData,
  } = fusionData;

  const chartOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(15, 23, 42, 0.1)' },
        grid: { color: 'rgba(15, 23, 42, 0.1)' },
        pointLabels: {
          color: '#475569',
          font: { size: 9, family: 'Fira Code' }
        },
        ticks: {
          color: '#94a3b8',
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

  const styledRadarData = {
    ...radarData,
    datasets: radarData.datasets.map(ds => ({
      ...ds,
      backgroundColor: 'rgba(37, 99, 235, 0.15)',
      borderColor: '#1d4ed8',
      pointBackgroundColor: '#1d4ed8',
      pointBorderColor: '#ffffff',
    }))
  };

  return (
    <div className="w-full lg:w-80 shrink-0 space-y-4">
      
      {/* EVIDENCE FUSION REPORT CARD */}
      <div className="forensic-card p-4 space-y-4">
        
        {/* Title */}
        <div className="border-b border-forensic-border pb-2.5">
          <Tooltip text="Transparent evidence fusion combining metadata, ELA recompression, spatial noise variance, and CNN classifier output.">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-forensic-navy cursor-help">
              Evidence Fusion Report
            </h2>
          </Tooltip>
        </div>

        {/* Circular Suspicion Gauge Meter with Tooltip */}
        <Tooltip text="Calibrated overall suspicion percentage score. Scores >60% indicate heavy edits or synthetic AI generation.">
          <div className="p-4 rounded-lg bg-slate-50 border border-forensic-border text-center space-y-3 flex flex-col items-center justify-center cursor-help">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={compositeSuspicion > 60 ? 'text-red-600' : compositeSuspicion > 30 ? 'text-amber-600' : 'text-blue-700'}
                  strokeDasharray={`${compositeSuspicion}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold tracking-tight font-sans text-forensic-navy">
                  {compositeSuspicion}%
                </span>
                <span className="text-[10px] text-forensic-slate uppercase font-mono tracking-widest font-bold">
                  SUSPICION
                </span>
              </div>
            </div>

            {/* Status Badge below circle */}
            <div className="w-full">
              <span className={`inline-block w-full py-1.5 px-3 rounded text-center text-xs font-mono font-bold uppercase tracking-wider ${
                badgeColor === 'red' ? 'bg-red-100 text-red-700 border border-red-200' :
                badgeColor === 'yellow' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                badgeColor === 'cyan' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {badgeColor === 'red' ? 'SYNTHETIC / SPLICED' : badgeColor === 'yellow' ? 'MODIFIED / UNKNOWN' : 'NATURAL PHOTO'}
              </span>
            </div>
          </div>
        </Tooltip>

        {/* Lower Radar Chart Box with Tooltip */}
        <Tooltip text="Multi-dimensional radar metrics chart comparing C2PA, ELA delta, noise variance, and CNN responses.">
          <div className="p-3 rounded-lg bg-slate-50 border border-forensic-border space-y-2 cursor-help">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-1">
              C2PA Provenance Metrics
            </div>

            <div className="w-full h-44">
              <Radar data={styledRadarData} options={chartOptions} />
            </div>
          </div>
        </Tooltip>

      </div>

    </div>
  );
}
