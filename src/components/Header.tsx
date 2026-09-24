import React, { useState } from 'react';
import { Shield, AlertTriangle, Radio, Info, Plus, RotateCcw, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  totalReports: number;
  onOpenReportModal: () => void;
  onResetData: () => void;
  onOpenTestingGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalReports,
  onOpenReportModal,
  onResetData,
  onOpenTestingGuide,
}) => {
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  return (
    <header className="relative w-full border-b border-slate-800/80 bg-[#0d1322]/95 backdrop-blur-md sticky top-0 z-[100]">
      {/* Top safety emergency gradient accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 shadow-[0_0_12px_rgba(239,68,68,0.4)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Tagline */}
          <div className="flex items-start gap-3.5">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30 text-orange-400 shadow-inner flex-shrink-0">
              <Shield className="w-7 h-7 text-orange-400" />
              <div className="absolute -bottom-1 -right-1 p-1 bg-red-600 rounded-full border-2 border-[#0d1322]">
                <AlertTriangle className="w-3 h-3 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
                  Stay<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-300">Safe</span>
                </h1>
                <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-300 border border-orange-500/25">
                  Nsukka Transit
                </span>

                {/* Honest Demo Data Badge */}
                <div className="relative inline-block">
                  <button
                    onClick={() => setShowDemoInfo(!showDemoInfo)}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
                    title="Click for data source information"
                  >
                    <Info className="w-3 h-3 text-amber-400" />
                    <span>Sample signals</span>
                  </button>

                  {showDemoInfo && (
                    <div className="absolute left-0 mt-2 w-72 sm:w-80 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[99999] text-xs text-slate-300 space-y-2">
                      <div className="flex items-center justify-between text-white font-semibold">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Demo & Sample Signals
                        </span>
                        <button
                          onClick={() => setShowDemoInfo(false)}
                          className="text-slate-400 hover:text-white p-0.5"
                        >
                          ✕
                        </button>
                      </div>
                      <p>
                        This is a client-side prototype seeded with realistic transit hazards for Nsukka, Enugu State. Reports you add or verify persist in your local browser storage.
                      </p>
                      <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">UN SDG 11: Sustainable Cities</span>
                        <button
                          onClick={() => {
                            setShowDemoInfo(false);
                            onResetData();
                          }}
                          className="text-[11px] text-orange-400 hover:underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reset to seed data
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Required Exact Tagline */}
              <p className="text-xs sm:text-sm text-slate-400 font-normal mt-0.5">
                "Because in Nigeria, knowing where's safe shouldn't be a guess."
              </p>
            </div>
          </div>

          {/* Right Actions: Live counter & Report Button */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Live Indicator derived from same reports array */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium">Live Map:</span>
              <span className="text-white font-bold px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700/50">
                {totalReports} reports
              </span>
            </div>

            {/* Quick Test Guide Trigger */}
            <button
              onClick={onOpenTestingGuide}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition flex items-center gap-1.5"
              title="View verification checklist"
            >
              <span>🧪 Test Guide</span>
            </button>

            {/* Report Danger Zone Button */}
            <button
              onClick={onOpenReportModal}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-950/40 hover:shadow-red-700/20 active:scale-95 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Report Danger Zone</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
