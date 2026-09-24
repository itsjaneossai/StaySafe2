import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const MapLegend: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <div className="p-4 rounded-2xl bg-[#141d33]/80 border border-slate-800 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Map Legend
            </span>
            <span className="text-[11px] text-slate-500">
              Pin icons on Nsukka commuter map
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* High Risk Pin */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            {/* SVG Pin Icon */}
            <div className="flex-shrink-0">
              <svg width="24" height="30" viewBox="0 0 38 46" fill="none">
                <path
                  d="M19 0C8.50659 0 0 8.50659 0 19C0 29.5 16.5 44 19 46C21.5 44 38 29.5 38 19C38 8.50659 29.4934 0 19 0Z"
                  fill="#ef4444"
                  stroke="#0b0f19"
                  strokeWidth="2"
                />
                <circle cx="19" cy="18" r="9" fill="#0b0f19" />
                <path d="M19 13V19M19 22H19.01" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-red-400 flex items-center gap-1.5">
                <span>High Risk (Red Pin)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Armed robbery, mugging, violence, or dangerous ambush spot
              </div>
            </div>
          </div>

          {/* Medium Caution Pin */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            {/* SVG Pin Icon */}
            <div className="flex-shrink-0">
              <svg width="24" height="30" viewBox="0 0 38 46" fill="none">
                <path
                  d="M19 0C8.50659 0 0 8.50659 0 19C0 29.5 16.5 44 19 46C21.5 44 38 29.5 38 19C38 8.50659 29.4934 0 19 0Z"
                  fill="#f97316"
                  stroke="#0b0f19"
                  strokeWidth="2"
                />
                <circle cx="19" cy="18" r="9" fill="#0b0f19" />
                <path d="M19 13V18M19 21H19.01" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-orange-400 flex items-center gap-1.5">
                <span>Medium Caution (Orange Pin)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                One-chance scams, tout extortion, snatching, unlit dark stretch
              </div>
            </div>
          </div>

          {/* Low / Safe Pin */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            {/* SVG Pin Icon */}
            <div className="flex-shrink-0">
              <svg width="24" height="30" viewBox="0 0 38 46" fill="none">
                <path
                  d="M19 0C8.50659 0 0 8.50659 0 19C0 29.5 16.5 44 19 46C21.5 44 38 29.5 38 19C38 8.50659 29.4934 0 19 0Z"
                  fill="#10b981"
                  stroke="#0b0f19"
                  strokeWidth="2"
                />
                <circle cx="19" cy="18" r="9" fill="#0b0f19" />
                <circle cx="19" cy="18" r="3.5" fill="#10b981" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <span>Low / Safe Zone (Green Pin)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Manned security post, well-lit street market, safe shuttle park
              </div>
            </div>
          </div>

          {/* Community Verified Badge */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <span>✅ Community Verified</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Backed by 3+ independent local commuters (1.5x risk weight)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
