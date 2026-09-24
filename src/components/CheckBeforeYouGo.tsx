import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  Crosshair,
  AlertTriangle,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  X,
  ChevronDown,
  Navigation,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { PRESET_NSUKKA_LOCATIONS } from '../data/initialData';
import { NsukkaLocation, SafetyReport, VerdictResult } from '../types/safety';
import { calculateSafetyVerdict, formatDistance } from '../utils/safetyLogic';

interface CheckBeforeYouGoProps {
  reports: SafetyReport[];
  selectedLocation: { name: string; lat: number; lng: number } | null;
  onSelectLocation: (loc: { name: string; lat: number; lng: number } | null) => void;
  isChoosingOnMap: boolean;
  onToggleChooseOnMap: (active: boolean) => void;
  onFocusReport?: (reportId: string) => void;
  onFlyToCoords?: (lat: number, lng: number, zoom?: number) => void;
}

export const CheckBeforeYouGo: React.FC<CheckBeforeYouGoProps> = ({
  reports,
  selectedLocation,
  onSelectLocation,
  isChoosingOnMap,
  onToggleChooseOnMap,
  onFocusReport,
  onFlyToCoords,
}) => {
  // Input must start EMPTY with a placeholder — never pre-filled!
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter locations based on query
  const filteredLocations = PRESET_NSUKKA_LOCATIONS.filter((loc) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.landmark.toLowerCase().includes(q)
    );
  });

  // Calculate verdict whenever selectedLocation or reports change
  const verdict: VerdictResult | null = selectedLocation
    ? calculateSafetyVerdict(
        selectedLocation.lat,
        selectedLocation.lng,
        selectedLocation.name,
        reports
      )
    : null;

  const handleSelectPreset = (loc: NsukkaLocation) => {
    setQuery(loc.name);
    setIsDropdownOpen(false);
    onSelectLocation({ name: loc.name, lat: loc.lat, lng: loc.lng });
    if (onFlyToCoords) {
      onFlyToCoords(loc.lat, loc.lng, 15);
    }
  };

  const handleSelectCustomQuery = () => {
    if (!query.trim()) return;
    setIsDropdownOpen(false);
    // Custom location search: place near Nsukka urban center if unknown
    const customLat = 6.8568 + (Math.sin(query.length) * 0.008);
    const customLng = 7.3958 + (Math.cos(query.length) * 0.008);
    onSelectLocation({
      name: query.trim(),
      lat: customLat,
      lng: customLng,
    });
    if (onFlyToCoords) {
      onFlyToCoords(customLat, customLng, 15);
    }
  };

  const handleClear = () => {
    setQuery('');
    onSelectLocation(null);
  };

  return (
    <div className="w-full bg-[#11192e] border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Headline */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Search className="w-3.5 h-3.5 text-orange-400" />
            <span>Check Before You Go</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Heading Somewhere in Nsukka? Check Safety First.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Real-time danger zones, one-chance alerts, and safe transit routes reported by fellow commuters.
          </p>
        </div>

        {/* Search Bar & Choose on Map */}
        <div className="max-w-3xl mx-auto relative" ref={dropdownRef}>
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            {/* Input with Autocomplete */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-orange-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (filteredLocations.length > 0) {
                      handleSelectPreset(filteredLocations[0]);
                    } else {
                      handleSelectCustomQuery();
                    }
                  }
                }}
                placeholder="Search a street or area in Nsukka"
                className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 border border-slate-700/80 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 text-sm sm:text-base transition shadow-inner font-medium"
              />
              {query && (
                <button
                  onClick={handleClear}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Choose on Map Button */}
            <button
              onClick={() => onToggleChooseOnMap(!isChoosingOnMap)}
              className={`px-4 py-3.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 border flex-shrink-0 ${
                isChoosingOnMap
                  ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <Crosshair className={`w-4 h-4 ${isChoosingOnMap ? 'animate-spin text-slate-950' : 'text-orange-400'}`} />
              <span>{isChoosingOnMap ? 'Tap Map to Pick Spot' : 'Choose on Map'}</span>
            </button>
          </div>

          {/* Prompt if Choose on Map is active */}
          {isChoosingOnMap && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Map selection active: Tap anywhere on the Nsukka map below to evaluate that location.</span>
              </span>
              <button
                onClick={() => onToggleChooseOnMap(false)}
                className="text-amber-400 hover:text-white font-bold ml-2 underline"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#131b2e] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[9999] max-h-80 overflow-y-auto">
              {filteredLocations.length > 0 ? (
                <div className="divide-y divide-slate-800">
                  <div className="px-3 py-2 bg-slate-900/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                    <span>Nsukka Transit Locations</span>
                    <span>Click to Check Verdict</span>
                  </div>
                  {filteredLocations.map((loc) => {
                    const isZeroTest = loc.name.includes('Zero Reports');
                    return (
                      <button
                        key={loc.id}
                        onClick={() => handleSelectPreset(loc)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 transition flex items-start justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-2.5">
                          <MapPin
                            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              isZeroTest ? 'text-slate-400' : 'text-orange-400 group-hover:text-orange-300'
                            }`}
                          />
                          <div>
                            <div className="text-sm font-semibold text-white group-hover:text-orange-300 flex items-center gap-1.5">
                              {loc.name}
                              {isZeroTest && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 border border-amber-500/30">
                                  Test Empty State
                                </span>
                              )}
                              {loc.knownSafe && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  Safe Hub
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 line-clamp-1">{loc.landmark}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-0.5 transition flex-shrink-0 mt-1" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs text-slate-400 mb-2">
                    No preset matched "{query}". Check it as a custom Nsukka area:
                  </p>
                  <button
                    onClick={handleSelectCustomQuery}
                    className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition"
                  >
                    Check "{query}" on Map
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instant Verdict Card */}
        {selectedLocation && verdict && (
          <div className="max-w-3xl mx-auto mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div
              className={`rounded-2xl border p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-md ${
                verdict.type === 'HIGH_RISK'
                  ? 'bg-gradient-to-br from-red-950/60 via-[#18111e] to-[#121626] border-red-500/40 shadow-red-950/30'
                  : verdict.type === 'CAUTION'
                  ? 'bg-gradient-to-br from-orange-950/50 via-[#1b1718] to-[#121626] border-orange-500/40 shadow-orange-950/30'
                  : verdict.type === 'SAFE'
                  ? 'bg-gradient-to-br from-emerald-950/40 via-[#101b1a] to-[#121626] border-emerald-500/40 shadow-emerald-950/30'
                  : 'bg-gradient-to-br from-slate-900/90 via-[#141b2c] to-[#0f1422] border-slate-700 shadow-slate-950/30'
              }`}
            >
              {/* Card Header & Verdict Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    <span>Location checked:</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5 font-heading">
                    {selectedLocation.name}
                  </h3>
                </div>

                {/* Verdict Badge */}
                <div className="flex items-center gap-2">
                  {verdict.type === 'HIGH_RISK' && (
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/50 text-sm font-bold shadow-lg shadow-red-500/20 animate-pulse">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>
                      🔴 High Risk
                    </span>
                  )}
                  {verdict.type === 'CAUTION' && (
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/50 text-sm font-bold shadow-lg shadow-orange-500/20">
                      <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
                      🟠 Caution
                    </span>
                  )}
                  {verdict.type === 'SAFE' && (
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-sm font-bold shadow-lg shadow-emerald-500/20">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                      🟢 Safe
                    </span>
                  )}
                  {verdict.type === 'NO_DATA' && (
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 border border-slate-600 text-sm font-bold">
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      ⚪ No data yet for this area
                    </span>
                  )}
                </div>
              </div>

              {/* Summary Description */}
              <div className="py-4">
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                  {verdict.summary}
                </p>

                {/* Critical requirement: Empty area message */}
                {verdict.type === 'NO_DATA' && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                    <div className="flex items-center gap-2 font-semibold text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Zero-Assumption Policy:</span>
                    </div>
                    <p className="text-slate-400">
                      StaySafe does <strong className="text-slate-200">never assume an unmapped area is safe</strong>. No community reports have been recorded within 1.8km yet. Exercise heightened vigilance.
                    </p>
                    {verdict.nearestReport && (
                      <div className="pt-1 text-slate-300">
                        📍 Nearest known signal is at{' '}
                        <strong className="text-white">{verdict.nearestReport.locationName}</strong> (~{formatDistance(verdict.nearestReport.distanceKm)} away, marked {verdict.nearestReport.severity.toUpperCase()}).
                      </div>
                    )}
                  </div>
                )}

                {/* Recommended safer alternative if Caution or High Risk */}
                {(verdict.type === 'HIGH_RISK' || verdict.type === 'CAUTION') && verdict.saferAlternative && (
                  <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white">
                          Safer Alternative Recommended:
                        </div>
                        <p className="text-emerald-300/90 text-xs mt-0.5">
                          Route via <strong className="text-white">{verdict.saferAlternative.name}</strong> (~{formatDistance(verdict.saferAlternative.distanceKm)} away) — {verdict.saferAlternative.description}
                        </p>
                      </div>
                    </div>
                    {onFlyToCoords && (
                      <button
                        onClick={() => {
                          if (verdict.saferAlternative) {
                            onFlyToCoords(verdict.saferAlternative.lat, verdict.saferAlternative.lng, 15);
                            onSelectLocation({
                              name: verdict.saferAlternative.name,
                              lat: verdict.saferAlternative.lat,
                              lng: verdict.saferAlternative.lng,
                            });
                            setQuery(verdict.saferAlternative.name);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 flex-shrink-0"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Inspect Alternative</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Nearby Reports List breakdown */}
              {verdict.nearbyReports.length > 0 && (
                <div className="mt-2 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Signals Influencing Verdict ({verdict.nearbyReports.length}):
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Verified reports weighted +50%
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {verdict.nearbyReports.slice(0, 4).map((rep) => (
                      <div
                        key={rep.id}
                        onClick={() => onFocusReport && onFocusReport(rep.id)}
                        className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex items-start justify-between gap-2 group"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                rep.severity === 'high'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : rep.severity === 'medium'
                                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {rep.severity}
                            </span>
                            {rep.verifications >= 3 && (
                              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-semibold">
                                <CheckCircle className="w-3 h-3" />
                                Verified ({rep.verifications})
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-white group-hover:text-orange-300 line-clamp-1">
                            {rep.title}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {rep.locationName} • ~{formatDistance(rep.distanceKm)}
                          </div>
                        </div>
                        <Eye className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400 flex-shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety advice bullet points */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Commuter Advice:
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {verdict.advice.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
