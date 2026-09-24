/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SafetyReport, ReportSeverity } from './types/safety';
import { INITIAL_SAFETY_REPORTS, PRESET_NSUKKA_LOCATIONS, NSUKKA_CENTER } from './data/initialData';
import { Header } from './components/Header';
import { CheckBeforeYouGo } from './components/CheckBeforeYouGo';
import { LiveStatsCards } from './components/LiveStatsCards';
import { SafetyMap } from './components/SafetyMap';
import { HowItWorksStrip } from './components/HowItWorksStrip';
import { MapLegend } from './components/MapLegend';
import { ReportDetailsModal } from './components/ReportDetailsModal';
import { ReportDangerModal } from './components/ReportDangerModal';
import { StatDetailsModal } from './components/StatDetailsModal';
import { TestingGuideModal } from './components/TestingGuideModal';
import { CheckCircle2, AlertTriangle, ShieldCheck, Heart } from 'lucide-react';

const STORAGE_KEY_REPORTS = 'staysafe_nsukka_reports_v1';
const STORAGE_KEY_VERIFIED = 'staysafe_nsukka_verified_ids_v1';

export default function App() {
  // Synchronized state for reports — all counts and verdicts derive from here
  const [reports, setReports] = useState<SafetyReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load reports from localStorage', e);
    }
    return INITIAL_SAFETY_REPORTS;
  });

  // Store user-verified report IDs (capped at 1 per device)
  const [userVerifiedIds, setUserVerifiedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VERIFIED);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load verified IDs', e);
    }
    return [];
  });

  // Persist reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save reports to localStorage', e);
    }
  }, [reports]);

  // Persist user verified IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VERIFIED, JSON.stringify(userVerifiedIds));
    } catch (e) {
      console.error('Failed to save verified IDs', e);
    }
  }, [userVerifiedIds]);

  // UI Navigation & Interaction states
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(null);

  const [selectedReport, setSelectedReport] = useState<SafetyReport | null>(null);
  const [isChoosingOnMap, setIsChoosingOnMap] = useState<boolean>(false);
  const [isReportingOnMap, setIsReportingOnMap] = useState<boolean>(false);
  const [pendingReportCoords, setPendingReportCoords] = useState<{
    lat: number;
    lng: number;
    locationName?: string;
  } | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [statModalFilter, setStatModalFilter] = useState<'all' | 'medium_high' | 'verified' | null>(null);
  const [isTestingGuideOpen, setIsTestingGuideOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Map camera trigger
  const [flyToTrigger, setFlyToTrigger] = useState<{
    lat: number;
    lng: number;
    zoom?: number;
    id: number;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Fly map to coordinates
  const triggerFlyTo = (lat: number, lng: number, zoom = 15) => {
    setFlyToTrigger({
      lat,
      lng,
      zoom,
      id: Date.now(),
    });
  };

  // Handle "Choose on Map" click
  const handleMapPickLocation = (lat: number, lng: number) => {
    if (lat === 0 && lng === 0) {
      setIsChoosingOnMap(false);
      return;
    }
    setIsChoosingOnMap(false);
    // Find closest preset or format coordinates
    const clickedLocationName = `Pinned Point near Nsukka (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    setSelectedLocation({
      name: clickedLocationName,
      lat,
      lng,
    });
    triggerFlyTo(lat, lng, 15);
    showToast(`Checked safety for point (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
  };

  // Handle Map Tap when in "Report Danger Zone" mode
  const handleMapDropReportLocation = (lat: number, lng: number) => {
    setIsReportingOnMap(false);
    setPendingReportCoords({
      lat,
      lng,
      locationName: `Nsukka Spot (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    });
    setIsReportModalOpen(true);
  };

  // Handle new report submission
  const handleCreateReport = (
    newRep: Omit<SafetyReport, 'id' | 'createdAt' | 'verifications' | 'isCustom'>
  ) => {
    const createdReport: SafetyReport = {
      ...newRep,
      id: `rep-custom-${Date.now()}`,
      createdAt: Date.now(),
      verifications: 0,
      isCustom: true,
    };

    // Update reports array — all counters, verdicts, and stat cards instantly update
    setReports((prev) => [createdReport, ...prev]);

    // Also auto-select this new report on the map
    setSelectedReport(createdReport);
    triggerFlyTo(createdReport.lat, createdReport.lng, 15);
    showToast(`Incident published! Pin added to ${createdReport.locationName}`);
  };

  // Handle Verification of a report (capped at 1 per device)
  const handleVerifyReport = (reportId: string) => {
    if (userVerifiedIds.includes(reportId)) {
      showToast('You have already verified this report on this device.');
      return;
    }

    setUserVerifiedIds((prev) => [...prev, reportId]);

    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          const updatedVerifications = rep.verifications + 1;
          const updatedRep = {
            ...rep,
            verifications: updatedVerifications,
          };
          // Update selected report if currently open
          if (selectedReport && selectedReport.id === reportId) {
            setSelectedReport(updatedRep);
          }
          return updatedRep;
        }
        return rep;
      })
    );

    showToast('Thank you! Verification recorded and safety weight increased.');
  };

  // Reset to default seed data
  const handleResetData = () => {
    localStorage.removeItem(STORAGE_KEY_REPORTS);
    localStorage.removeItem(STORAGE_KEY_VERIFIED);
    setReports(INITIAL_SAFETY_REPORTS);
    setUserVerifiedIds([]);
    setSelectedLocation(null);
    setSelectedReport(null);
    triggerFlyTo(NSUKKA_CENTER.lat, NSUKKA_CENTER.lng, NSUKKA_CENTER.zoom);
    showToast('Reset to default Nsukka seeded safety signals.');
  };

  // 1-Click test for empty area (Requirement 1 test)
  const handleTestEmptyArea = () => {
    const emptyLoc = PRESET_NSUKKA_LOCATIONS.find((l) => l.name.includes('Zero Reports')) || {
      name: 'Alor-Uno Link (Zero Reports)',
      lat: 6.9050,
      lng: 7.3600,
      id: 'test-zero',
      landmark: 'Outer outskirts with zero reports',
    };
    setSelectedLocation({
      name: emptyLoc.name,
      lat: emptyLoc.lat,
      lng: emptyLoc.lng,
    });
    triggerFlyTo(emptyLoc.lat, emptyLoc.lng, 14);
    showToast('Loaded empty test area: check verdict shows "No data yet for this area"!');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-orange-500/30 selection:text-orange-200">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[100000] max-w-sm px-4 py-3 rounded-xl bg-slate-900 border border-orange-500/50 text-white shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        totalReports={reports.length}
        onOpenReportModal={() => {
          setPendingReportCoords(null);
          setIsReportModalOpen(true);
        }}
        onResetData={handleResetData}
        onOpenTestingGuide={() => setIsTestingGuideOpen(true)}
      />

      {/* Hero: Check Before You Go */}
      <CheckBeforeYouGo
        reports={reports}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        isChoosingOnMap={isChoosingOnMap}
        onToggleChooseOnMap={(active) => {
          setIsChoosingOnMap(active);
          if (active) setIsReportingOnMap(false);
        }}
        onFocusReport={(reportId) => {
          const rep = reports.find((r) => r.id === reportId);
          if (rep) {
            setSelectedReport(rep);
            triggerFlyTo(rep.lat, rep.lng, 16);
          }
        }}
        onFlyToCoords={triggerFlyTo}
      />

      {/* Live Stats Clickable Cards */}
      <LiveStatsCards
        reports={reports}
        onOpenStatModal={(filter) => setStatModalFilter(filter)}
      />

      {/* Interactive Safety Map Section */}
      <main className="w-full relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-1 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Nsukka Live Commuter Map
            </span>
            <span>•</span>
            <span className="text-slate-400">
              Showing {reports.length} danger & safe zone pins
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Drag to pan smoothly • Pinch/scroll to zoom
          </span>
        </div>

        <SafetyMap
          reports={reports}
          selectedReportId={selectedReport?.id || null}
          onSelectReport={(rep) => setSelectedReport(rep)}
          isChoosingOnMap={isChoosingOnMap}
          onMapPickLocation={handleMapPickLocation}
          isReportingOnMap={isReportingOnMap}
          onMapDropReportLocation={handleMapDropReportLocation}
          onToggleReportingMode={(active) => {
            setIsReportingOnMap(active);
            if (active) setIsChoosingOnMap(false);
          }}
          selectedLocation={selectedLocation}
          flyToTrigger={flyToTrigger}
        />
      </main>

      {/* Map Legend */}
      <MapLegend />

      {/* How It Works Strip */}
      <HowItWorksStrip />

      {/* Footer */}
      <footer className="w-full bg-[#0a0e17] border-t border-slate-800/80 py-8 px-4 sm:px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <div className="font-bold text-slate-200 text-sm">
              StaySafe Nsukka
            </div>
            <p className="text-slate-400 mt-1 max-w-md">
              A community-powered transit safety map designed to safeguard commuters across Nsukka, Enugu State. Supporting UN SDG 11: Sustainable & Safe Communities.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setIsTestingGuideOpen(true)}
              className="text-orange-400 hover:text-orange-300 font-semibold underline"
            >
              Run Acceptance Tests
            </button>
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-white"
            >
              Reset Seed Data
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">
              Client-side Community Demo • LocalStorage Enabled
            </span>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODALS RENDERED AT z-[99999] OUTSIDE MAP CONTAINER (FIXES STACKING/CLIPPING) */}
      {/* ========================================================================= */}

      {/* 1. Report Details Modal & Verification Action */}
      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onVerify={handleVerifyReport}
          hasUserVerified={userVerifiedIds.includes(selectedReport.id)}
        />
      )}

      {/* 2. Report Danger Zone Creation Modal */}
      {isReportModalOpen && (
        <ReportDangerModal
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            setPendingReportCoords(null);
          }}
          onSubmit={handleCreateReport}
          initialCoords={pendingReportCoords}
        />
      )}

      {/* 3. Stat Details Modal (Reports on Map / Medium-High Risk) */}
      {statModalFilter && (
        <StatDetailsModal
          isOpen={Boolean(statModalFilter)}
          onClose={() => setStatModalFilter(null)}
          filter={statModalFilter}
          reports={reports}
          onSelectReport={(rep) => setSelectedReport(rep)}
          onFlyToReport={(lat, lng) => triggerFlyTo(lat, lng, 16)}
        />
      )}

      {/* 4. Interactive Testing Guide Modal */}
      <TestingGuideModal
        isOpen={isTestingGuideOpen}
        onClose={() => setIsTestingGuideOpen(false)}
        onTestEmptyArea={handleTestEmptyArea}
        onOpenStatModal={(filter) => setStatModalFilter(filter)}
        onOpenReportModal={() => {
          setPendingReportCoords(null);
          setIsReportModalOpen(true);
        }}
        onResetData={handleResetData}
      />
    </div>
  );
}
