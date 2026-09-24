import React from 'react';
import { PlusCircle, ThumbsUp, ShieldCheck, ArrowRight } from 'lucide-react';

export const HowItWorksStrip: React.FC = () => {
  return (
    <div className="w-full bg-[#0d1322] border-y border-slate-800/80 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
            How It Works
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white font-heading mt-1">
            Community-Powered Transit Safety in 3 Steps
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Step 1: Report */}
          <div className="p-4 rounded-2xl bg-[#141d33]/60 border border-slate-800 flex items-start gap-3.5 relative">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex-shrink-0">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider">
                  Step 1
                </span>
                <span className="text-sm font-bold text-white">Report</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Commuters drop pins on active danger spots — one-chance kekes, tout extortion, robbery zones, or safe gates.
              </p>
            </div>
          </div>

          {/* Step 2: Verify */}
          <div className="p-4 rounded-2xl bg-[#141d33]/60 border border-slate-800 flex items-start gap-3.5 relative">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">
              <ThumbsUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                  Step 2
                </span>
                <span className="text-sm font-bold text-white">Verify</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Locals confirm observations. At 3+ verifications, reports turn <strong className="text-emerald-300">✅ Community Verified</strong> with +50% verdict weight.
              </p>
            </div>
          </div>

          {/* Step 3: Stay Safe */}
          <div className="p-4 rounded-2xl bg-[#141d33]/60 border border-slate-800 flex items-start gap-3.5 relative">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                  Step 3
                </span>
                <span className="text-sm font-bold text-white">Stay Safe</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Search before boarding. Get instant Safe, Caution, or High Risk verdicts and find safer detour routes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
