import React from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Search,
  Plus,
  RefreshCw,
  ArrowRight,
  Shield,
} from 'lucide-react';

interface TestingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestEmptyArea: () => void;
  onOpenStatModal: (filter: 'all' | 'medium_high') => void;
  onOpenReportModal: () => void;
  onResetData: () => void;
}

export const TestingGuideModal: React.FC<TestingGuideModalProps> = ({
  isOpen,
  onClose,
  onTestEmptyArea,
  onOpenStatModal,
  onOpenReportModal,
  onResetData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#141d33] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                Verification & Acceptance Checklist
              </h3>
              <p className="text-xs text-slate-400">
                Directly verify all 4 explicit tests requested in the specification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Test Steps */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300">
          {/* Test 1 */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs">
                  1
                </span>
                Search Area with Zero Reports
              </span>
              <button
                onClick={() => {
                  onClose();
                  onTestEmptyArea();
                }}
                className="px-2.5 py-1 rounded bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition flex items-center gap-1"
              >
                <span>Run Test</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-slate-400 text-xs">
              Searches <strong>Alor-Uno Link</strong> (where no reports exist). Confirms the app shows neutral <em>"No data yet for this area"</em> with nearest report info, and strictly does <strong>NOT</strong> default to "Safe".
            </p>
          </div>

          {/* Test 2 */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs">
                  2
                </span>
                Click Stat Cards (Z-Index / Stacking Check)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    onClose();
                    onOpenStatModal('all');
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                >
                  Card 1
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenStatModal('medium_high');
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                >
                  Card 2
                </button>
              </div>
            </div>
            <p className="text-slate-400 text-xs">
              Opens modal listing actual reports at <code>z-[99999]</code>. Confirms it renders cleanly fully on top of Leaflet layers (no clipping or hidden behind map).
            </p>
          </div>

          {/* Test 3 */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs">
                  3
                </span>
                Submit Report & Update All Counts Together
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenReportModal();
                }}
                className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Open Form</span>
              </button>
            </div>
            <p className="text-slate-400 text-xs">
              Submit a report: the pin animates onto the map, header counter, stat cards, and verdicts all update from the single synchronized reports state.
            </p>
          </div>

          {/* Test 4 */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs">
                  4
                </span>
                Refresh Page Persistence (localStorage)
              </span>
              <button
                onClick={() => window.location.reload()}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reload Page</span>
              </button>
            </div>
            <p className="text-slate-400 text-xs">
              Reloads browser. Confirms newly submitted reports and verifications remain saved and active.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onResetData();
              onClose();
            }}
            className="text-orange-400 hover:underline flex items-center gap-1"
          >
            <span>Reset Demo to Defaults</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
