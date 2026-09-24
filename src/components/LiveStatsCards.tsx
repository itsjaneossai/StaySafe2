import React from 'react';
import { SafetyReport } from '../types/safety';
import {
  MapPin,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Activity,
} from 'lucide-react';

interface LiveStatsCardsProps {
  reports: SafetyReport[];
  onOpenStatModal: (filter: 'all' | 'medium_high' | 'verified') => void;
}

export const LiveStatsCards: React.FC<LiveStatsCardsProps> = ({
  reports,
  onOpenStatModal,
}) => {
  // MUST all derive from the exact same reports array:
  const totalCount = reports.length;
  const mediumHighCount = reports.filter(
    (r) => r.severity === 'high' || r.severity === 'medium'
  ).length;
  const verifiedCount = reports.filter((r) => r.verifications >= 3).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Card 1: Reports on Map (Clickable) */}
        <button
          onClick={() => onOpenStatModal('all')}
          className="group text-left p-4 rounded-2xl bg-[#141d33]/90 hover:bg-[#18233e] border border-slate-800 hover:border-slate-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <MapPin className="w-4 h-4" />
              </span>
              <span>Reports on Map</span>
            </div>
            <span className="text-[11px] text-orange-400 font-semibold group-hover:translate-x-0.5 transition flex items-center gap-0.5">
              <span>Tap for details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white tracking-tight font-heading">
              {totalCount}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live community total</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400 line-clamp-1">
            Active signals covering transit routes across Nsukka
          </div>
        </button>

        {/* Card 2: Medium/High (Clickable) */}
        <button
          onClick={() => onOpenStatModal('medium_high')}
          className="group text-left p-4 rounded-2xl bg-gradient-to-br from-[#1d1624]/90 to-[#141d33]/90 hover:from-[#241a2e] hover:to-[#1a2542] border border-red-500/30 hover:border-red-500/50 shadow-lg shadow-red-950/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-300">
              <span className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <span>Medium / High Risk</span>
            </div>
            <span className="text-[11px] text-red-400 font-semibold group-hover:translate-x-0.5 transition flex items-center gap-0.5">
              <span>Tap for details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-red-400 tracking-tight font-heading">
              {mediumHighCount}
            </div>
            <div className="text-xs text-red-300/80 font-medium">
              Requires commuter caution
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400 line-clamp-1">
            Robberies, tout extortion, and one-chance hotspots
          </div>
        </button>

        {/* Card 3: Community Verified (Clickable) */}
        <button
          onClick={() => onOpenStatModal('verified')}
          className="group text-left p-4 rounded-2xl bg-[#141d33]/90 hover:bg-[#18233e] border border-emerald-500/30 hover:border-emerald-500/50 shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span>Community Verified</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold group-hover:translate-x-0.5 transition flex items-center gap-0.5">
              <span>Tap for details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-emerald-400 tracking-tight font-heading">
              {verifiedCount}
            </div>
            <div className="text-xs text-emerald-400/80 font-medium">
              3+ peer confirmations
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400 line-clamp-1">
            High confidence signals with +50% verdict weight
          </div>
        </button>
      </div>
    </div>
  );
};
