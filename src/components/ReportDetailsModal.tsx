import React from 'react';
import { SafetyReport } from '../types/safety';
import {
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Clock,
  ThumbsUp,
  X,
  Share2,
  CheckCircle,
  AlertTriangle,
  Flame,
  Radio,
} from 'lucide-react';

interface ReportDetailsModalProps {
  report: SafetyReport | null;
  onClose: () => void;
  onVerify: (reportId: string) => void;
  hasUserVerified: boolean;
}

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  report,
  onClose,
  onVerify,
  hasUserVerified,
}) => {
  if (!report) return null;

  const isVerified = report.verifications >= 3;
  const isHigh = report.severity === 'high';
  const isMedium = report.severity === 'medium';

  const handleShare = () => {
    const text = `StaySafe Nsukka Alert: ${report.title} at ${report.locationName} (${report.severity.toUpperCase()} RISK). Take precautions!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Alert copied to clipboard! Share with your loved ones.');
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#141d33] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with severity accent */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-b ${
            isHigh
              ? 'bg-gradient-to-r from-red-950/80 via-red-900/40 to-slate-900 border-red-500/30'
              : isMedium
              ? 'bg-gradient-to-r from-orange-950/80 via-orange-900/40 to-slate-900 border-orange-500/30'
              : 'bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-slate-900 border-emerald-500/30'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`p-2 rounded-xl flex items-center justify-center ${
                isHigh
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : isMedium
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {isHigh ? (
                <ShieldAlert className="w-5 h-5 text-red-400" />
              ) : isMedium ? (
                <AlertTriangle className="w-5 h-5 text-orange-400" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              )}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${
                    isHigh
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : isMedium
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {report.severity === 'high'
                    ? '🔴 High Risk'
                    : report.severity === 'medium'
                    ? '🟠 Medium Caution'
                    : '🟢 Low Risk / Safe'}
                </span>
                {isVerified && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    Community Verified
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Category: {report.category}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-200">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
              {report.title}
            </h3>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-slate-300 font-medium">{report.locationName}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{report.timestamp}</span>
              </span>
            </div>
          </div>

          {/* Commuter Note / Incident Details */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-sm leading-relaxed text-slate-200 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Commuter Intel & Description:
            </span>
            <p className="whitespace-pre-line text-slate-300">
              {report.notes}
            </p>
          </div>

          {/* Verification Status & Impact Box */}
          <div className="p-4 rounded-xl bg-[#10172a] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-slate-400">Community Trust Signal</div>
              <div className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span className="text-emerald-400">Verified by {report.verifications} people</span>
                {report.verifications < 3 && (
                  <span className="text-xs font-normal text-slate-400">
                    ({3 - report.verifications} more needed for ✅ verified badge)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Once a report reaches 3+ verifications, it is community-verified and weighted 1.5x in area risk verdicts.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer with Required Prominently-Styled Verification Button */}
        <div className="px-5 py-4 bg-[#0e1424] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4 text-orange-400" />
            <span>Share Alert</span>
          </button>

          {/* Solid styled Verify Button (capped at 1 per device) */}
          <button
            onClick={() => onVerify(report.id)}
            disabled={hasUserVerified}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 ${
              hasUserVerified
                ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40 hover:shadow-emerald-700/20 active:scale-95'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${hasUserVerified ? 'text-slate-500' : 'text-emerald-200'}`} />
            <span>
              {hasUserVerified ? '✓ You Verified This Report' : 'Verify This Report (+1)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
