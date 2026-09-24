import React from 'react';
import { SafetyReport } from '../types/safety';
import {
  X,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Filter,
} from 'lucide-react';

interface StatDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  filter: 'all' | 'medium_high' | 'verified';
  reports: SafetyReport[];
  onSelectReport: (report: SafetyReport) => void;
  onFlyToReport: (lat: number, lng: number) => void;
}

export const StatDetailsModal: React.FC<StatDetailsModalProps> = ({
  isOpen,
  onClose,
  filter,
  reports,
  onSelectReport,
  onFlyToReport,
}) => {
  if (!isOpen) return null;

  // Derive strictly from the exact same reports array
  const filteredReports = reports.filter((rep) => {
    if (filter === 'medium_high') {
      return rep.severity === 'high' || rep.severity === 'medium';
    }
    if (filter === 'verified') {
      return rep.verifications >= 3;
    }
    return true;
  });

  const getTitle = () => {
    if (filter === 'medium_high') return 'Medium & High Risk Incidents';
    if (filter === 'verified') return 'Community Verified Safety Signals';
    return 'All Active Reports on Map';
  };

  const getSubtitle = () => {
    if (filter === 'medium_high') {
      return `Listing all ${filteredReports.length} caution and high risk transit warnings in Nsukka`;
    }
    if (filter === 'verified') {
      return `Listing all ${filteredReports.length} reports confirmed by 3+ local commuters`;
    }
    return `Listing all ${filteredReports.length} community safety signals currently on the map`;
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#141d33] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                {getTitle()}
              </h3>
              <p className="text-xs text-slate-400">{getSubtitle()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content / Reports List */}
        <div className="p-5 overflow-y-auto space-y-3 divide-y divide-slate-800/80">
          {filteredReports.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No reports match this criteria currently.
            </div>
          ) : (
            filteredReports.map((report) => {
              const isHigh = report.severity === 'high';
              const isMedium = report.severity === 'medium';
              const isVerified = report.verifications >= 3;

              return (
                <div
                  key={report.id}
                  onClick={() => {
                    onClose();
                    onFlyToReport(report.lat, report.lng);
                    onSelectReport(report);
                  }}
                  className="pt-3 first:pt-0 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/70 border border-transparent hover:border-slate-700 transition cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          isHigh
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : isMedium
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {report.severity === 'high'
                          ? 'High Risk'
                          : report.severity === 'medium'
                          ? 'Medium Caution'
                          : 'Safe Zone'}
                      </span>

                      {isVerified ? (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" />
                          Verified ({report.verifications})
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          {report.verifications} verification{report.verifications !== 1 ? 's' : ''}
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400">
                        • {report.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-orange-300 transition">
                      {report.title}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-orange-400" />
                        <span>{report.locationName}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{report.timestamp}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {report.notes}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 flex-shrink-0">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-800 group-hover:bg-orange-600 text-slate-300 group-hover:text-white text-xs font-semibold transition flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View on Map</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Click any report to locate and verify on map</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
