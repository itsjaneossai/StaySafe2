import React, { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import { SafetyReport } from '../types/safety';
import { NSUKKA_CENTER } from '../data/initialData';
import { Crosshair, Plus, Shield, Layers, Compass, LocateFixed } from 'lucide-react';

interface SafetyMapProps {
  reports: SafetyReport[];
  selectedReportId: string | null;
  onSelectReport: (report: SafetyReport) => void;
  isChoosingOnMap: boolean;
  onMapPickLocation: (lat: number, lng: number) => void;
  isReportingOnMap: boolean;
  onMapDropReportLocation: (lat: number, lng: number) => void;
  onToggleReportingMode: (active: boolean) => void;
  selectedLocation: { name: string; lat: number; lng: number } | null;
  flyToTrigger: { lat: number; lng: number; zoom?: number; id: number } | null;
}

export const SafetyMap: React.FC<SafetyMapProps> = ({
  reports,
  selectedReportId,
  onSelectReport,
  isChoosingOnMap,
  onMapPickLocation,
  isReportingOnMap,
  onMapDropReportLocation,
  onToggleReportingMode,
  selectedLocation,
  flyToTrigger,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const selectionMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Leaflet Map centered on Nsukka
    const map = L.map(mapContainerRef.current, {
      center: [NSUKKA_CENTER.lat, NSUKKA_CENTER.lng],
      zoom: NSUKKA_CENTER.zoom,
      minZoom: 12,
      maxZoom: 18,
      zoomControl: false, // We'll add custom positioned zoom control
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
    });

    // Dark Matter CartoDB Basemap for modern commuter safety aesthetic
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    // Zoom controls positioned at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Layer group for all report markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle map click events based on active mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (isChoosingOnMap) {
        onMapPickLocation(lat, lng);
      } else if (isReportingOnMap) {
        onMapDropReportLocation(lat, lng);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isChoosingOnMap, isReportingOnMap, onMapPickLocation, onMapDropReportLocation]);

  // Handle fly-to requests
  useEffect(() => {
    if (flyToTrigger && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [flyToTrigger.lat, flyToTrigger.lng],
        flyToTrigger.zoom || 15,
        {
          duration: 1.2,
          easeLinearity: 0.25,
        }
      );
    }
  }, [flyToTrigger]);

  // Render selectedLocation indicator (if user searched or tapped to check)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectionMarkerRef.current) {
      selectionMarkerRef.current.remove();
      selectionMarkerRef.current = null;
    }

    if (selectedLocation) {
      const searchReticleIcon = L.divIcon({
        className: 'selection-reticle-icon',
        html: `
          <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 44px; height: 44px; border: 2px solid #38bdf8; border-radius: 50%; opacity: 0.8; animation: pulseEffect 2s infinite ease-out;"></div>
            <div style="position: absolute; width: 28px; height: 28px; border: 2px dashed #0284c7; border-radius: 50%;"></div>
            <div style="width: 12px; height: 12px; background: #38bdf8; border-radius: 50%; border: 2px solid #0f172a; box-shadow: 0 0 8px #38bdf8;"></div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });

      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        icon: searchReticleIcon,
        zIndexOffset: 1000,
      }).addTo(map);

      selectionMarkerRef.current = marker;
    }
  }, [selectedLocation]);

  // Render pins on map whenever reports change
  useEffect(() => {
    const markersLayer = markersLayerRef.current;
    if (!markersLayer) return;

    markersLayer.clearLayers();

    reports.forEach((report) => {
      const isSelected = report.id === selectedReportId;
      const isVerified = report.verifications >= 3;
      const isHigh = report.severity === 'high';
      const isMedium = report.severity === 'medium';

      const color = isHigh ? '#ef4444' : isMedium ? '#f97316' : '#10b981';
      const glow = isHigh
        ? 'rgba(239, 68, 68, 0.4)'
        : isMedium
        ? 'rgba(249, 115, 22, 0.4)'
        : 'rgba(16, 185, 129, 0.4)';

      // Pin SVG Icon with Verification Badge
      const pinHtml = `
        <div class="custom-pin-wrapper ${report.isCustom ? 'is-new' : ''}" style="width: 38px; height: 46px;">
          ${
            isSelected
              ? `<div class="pulse-ring" style="border: 2px solid ${color};"></div>`
              : ''
          }
          <svg width="38" height="46" viewBox="0 0 38 46" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.6));">
            <!-- Pin Body -->
            <path d="M19 0C8.50659 0 0 8.50659 0 19C0 29.5 16.5 44 19 46C21.5 44 38 29.5 38 19C38 8.50659 29.4934 0 19 0Z" fill="${color}" stroke="#0b0f19" stroke-width="2"/>
            <!-- Inner Circle -->
            <circle cx="19" cy="18" r="9" fill="#0b0f19" />
            <!-- Severity symbol or verified icon inside -->
            ${
              isVerified
                ? `<path d="M16 18L18 20L22 15" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
                : isHigh
                ? `<path d="M19 13V19M19 22H19.01" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>`
                : isMedium
                ? `<path d="M19 13V18M19 21H19.01" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>`
                : `<circle cx="19" cy="18" r="3.5" fill="#10b981" />`
            }
            <!-- Mini verified community ribbon -->
            ${
              isVerified
                ? `<circle cx="28" cy="10" r="5" fill="#10b981" stroke="#0b0f19" stroke-width="1.5"/>
                   <path d="M26.5 10L27.5 11L29.5 9" stroke="#ffffff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>`
                : ''
            }
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'stay-safe-pin',
        html: pinHtml,
        iconSize: [38, 46],
        iconAnchor: [19, 44],
        popupAnchor: [0, -42],
      });

      const marker = L.marker([report.lat, report.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 500 : isHigh ? 300 : isMedium ? 200 : 100,
      });

      // Tapping an existing pin triggers select report (which opens the z-99999 modal/sheet)
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectReport(report);
      });

      // Subtle hover tooltip
      marker.bindTooltip(
        `<div style="font-weight: 700; color: #fff;">${report.title}</div>
         <div style="color: #94a3b8; font-size: 11px;">${report.locationName} • ${
          isVerified ? '✅ Verified' : `${report.verifications} votes`
        }</div>`,
        {
          direction: 'top',
          offset: [0, -40],
          className: 'custom-leaflet-tooltip',
        }
      );

      marker.addTo(markersLayer);
    });
  }, [reports, selectedReportId, onSelectReport]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [NSUKKA_CENTER.lat, NSUKKA_CENTER.lng],
        NSUKKA_CENTER.zoom,
        { duration: 1.0 }
      );
    }
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] bg-[#0b0f19] border-y border-slate-800/80 overflow-hidden">
      {/* Map DOM Element */}
      <div
        ref={mapContainerRef}
        className={`w-full h-full map-touch-container ${
          isChoosingOnMap || isReportingOnMap ? 'cursor-crosshair' : 'cursor-grab'
        }`}
      />

      {/* Top Banner when in "Choose on Map" Mode */}
      {isChoosingOnMap && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] max-w-md w-[92%] px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <Crosshair className="w-5 h-5 animate-spin" />
            <span>Tap anywhere on the map to evaluate safety</span>
          </div>
          <button
            onClick={() => onMapPickLocation(0, 0)} // triggers cancel or exit in parent
            className="px-2 py-0.5 rounded bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
          >
            Done
          </button>
        </div>
      )}

      {/* Top Banner when in "Report Danger Zone" Mode */}
      {isReportingOnMap && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] max-w-md w-[92%] px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-xs sm:text-sm shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 animate-pulse" />
            <span>Tap the exact hazard location on the map to drop a pin</span>
          </div>
          <button
            onClick={() => onToggleReportingMode(false)}
            className="px-2 py-0.5 rounded bg-slate-900/80 text-slate-200 text-xs font-semibold hover:bg-slate-900 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Floating Action Controls on Top-Right */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        {/* Recenter Button */}
        <button
          onClick={handleRecenter}
          className="p-2.5 rounded-xl bg-[#162036]/90 hover:bg-[#1f2d4d] text-slate-200 hover:text-white border border-slate-700/80 shadow-lg backdrop-blur-md transition flex items-center gap-1.5 text-xs font-semibold"
          title="Recenter on Nsukka Center"
        >
          <LocateFixed className="w-4 h-4 text-orange-400" />
          <span className="hidden sm:inline">Nsukka Center</span>
        </button>

        {/* Report Danger Zone Direct Map Trigger */}
        <button
          onClick={() => onToggleReportingMode(!isReportingOnMap)}
          className={`p-2.5 rounded-xl border shadow-lg backdrop-blur-md transition flex items-center gap-1.5 text-xs font-semibold ${
            isReportingOnMap
              ? 'bg-red-600 text-white border-red-500 ring-2 ring-red-400/40 shadow-red-900/40'
              : 'bg-gradient-to-r from-red-600/90 to-orange-600/90 hover:from-red-500 hover:to-orange-500 text-white border-red-500/50'
          }`}
          title="Drop a safety report pin on the map"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{isReportingOnMap ? 'Clicking Map...' : 'Drop Pin on Map'}</span>
        </button>
      </div>

      {/* Bottom Floating Legend & Hint */}
      <div className="absolute bottom-4 left-4 z-[400] flex items-center gap-2 flex-wrap">
        <div className="px-3 py-1.5 rounded-lg bg-[#0d1322]/90 border border-slate-800 text-[11px] text-slate-300 backdrop-blur-md shadow-lg flex items-center gap-2.5">
          <span className="text-slate-400">Map Tip:</span>
          <span>Tap any pin to view incident report & verify</span>
        </div>
      </div>
    </div>
  );
};
