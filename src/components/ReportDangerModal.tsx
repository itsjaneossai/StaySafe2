import React, { useState } from 'react';
import { ReportSeverity, SafetyReport } from '../types/safety';
import { PRESET_NSUKKA_LOCATIONS } from '../data/initialData';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Send,
  HelpCircle,
} from 'lucide-react';

interface ReportDangerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: Omit<SafetyReport, 'id' | 'createdAt' | 'verifications' | 'isCustom'>) => void;
  initialCoords?: { lat: number; lng: number; locationName?: string } | null;
}

const CATEGORIES = [
  'One-Chance Bus / Keke Scams',
  'Armed Robbery / Snatching',
  'Extortion / Illegal Touts',
  'Dark / Unlit Transit Route',
  'Cult Clash / Violence Threat',
  'Kidnapping Ambush Spot',
  'Safe Haven / Manned Checkpoint',
  'Other Transit Hazard',
];

export const ReportDangerModal: React.FC<ReportDangerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialCoords,
}) => {
  const [severity, setSeverity] = useState<ReportSeverity>('high');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [locationName, setLocationName] = useState(
    initialCoords?.locationName || (initialCoords ? `Nsukka Point (${initialCoords.lat.toFixed(4)}, ${initialCoords.lng.toFixed(4)})` : '')
  );
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName.trim()) {
      setError('Please provide a location or street name in Nsukka.');
      return;
    }
    if (!title.trim()) {
      setError('Please provide a brief title describing the incident.');
      return;
    }
    if (!notes.trim() || notes.length < 10) {
      setError('Please provide commuter details/advice (at least 10 characters).');
      return;
    }

    // Determine coordinates
    let lat = initialCoords?.lat;
    let lng = initialCoords?.lng;

    if (!lat || !lng) {
      // Look up preset location or place near Nsukka central coordinates
      const matched = PRESET_NSUKKA_LOCATIONS.find(
        (loc) => loc.name.toLowerCase() === locationName.toLowerCase()
      );
      if (matched) {
        lat = matched.lat;
        lng = matched.lng;
      } else {
        // Pseudo offset for custom street around Nsukka center
        lat = 6.8568 + (Math.sin(locationName.length * 2) * 0.012);
        lng = 7.3958 + (Math.cos(locationName.length * 2) * 0.012);
      }
    }

    onSubmit({
      title: title.trim(),
      category,
      severity,
      locationName: locationName.trim(),
      lat,
      lng,
      timestamp: 'Just now',
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#141d33] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-red-600/90 via-orange-600/90 to-amber-600/90 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-black/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading">Report Danger Zone</h3>
              <p className="text-xs text-white/80">
                Help fellow commuters navigate Nsukka safely
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-200">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Severity Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Severity Level *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* High Risk */}
              <button
                type="button"
                onClick={() => setSeverity('high')}
                className={`p-3 rounded-xl border flex flex-col items-center text-center transition ${
                  severity === 'high'
                    ? 'bg-red-500/20 border-red-500 text-white ring-2 ring-red-500/40 shadow-lg shadow-red-950/40'
                    : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:border-slate-600'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 mb-1.5 shadow-[0_0_8px_#ef4444]"></span>
                <span className="text-xs font-bold text-red-300">High Risk</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Robbery, violence, ambush</span>
              </button>

              {/* Medium Caution */}
              <button
                type="button"
                onClick={() => setSeverity('medium')}
                className={`p-3 rounded-xl border flex flex-col items-center text-center transition ${
                  severity === 'medium'
                    ? 'bg-orange-500/20 border-orange-500 text-white ring-2 ring-orange-500/40 shadow-lg shadow-orange-950/40'
                    : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:border-slate-600'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-orange-500 mb-1.5 shadow-[0_0_8px_#f97316]"></span>
                <span className="text-xs font-bold text-orange-300">Medium</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Touts, snatching, unlit</span>
              </button>

              {/* Low / Safe Haven */}
              <button
                type="button"
                onClick={() => setSeverity('low')}
                className={`p-3 rounded-xl border flex flex-col items-center text-center transition ${
                  severity === 'low'
                    ? 'bg-emerald-500/20 border-emerald-500 text-white ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/40'
                    : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:border-slate-600'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 mb-1.5 shadow-[0_0_8px_#10b981]"></span>
                <span className="text-xs font-bold text-emerald-300">Low / Safe</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Manned post, safe zone</span>
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Incident Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-orange-500 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Location / Street Name in Nsukka *
              </label>
              {initialCoords && (
                <span className="text-[11px] text-orange-400">
                  📍 Pinned from map ({initialCoords.lat.toFixed(3)}, {initialCoords.lng.toFixed(3)})
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Behind Timber Shed, near the old saw mill"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Incident Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Brief Alert Headline *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Armed phone snatching by motorcycle gang"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Commuter Note */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Incident Details & Commuter Advice *
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Explain what happened or when caution is needed (e.g. after 8 PM, stay on the asphalt road, watch out for black kekes...)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-orange-500 focus:outline-none resize-none"
            />
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-950/40 transition flex items-center gap-2 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Publish Alert to Map</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
