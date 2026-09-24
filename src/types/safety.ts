export type ReportSeverity = 'low' | 'medium' | 'high';

export interface SafetyReport {
  id: string;
  title: string;
  category: string;
  severity: ReportSeverity;
  locationName: string;
  lat: number;
  lng: number;
  timestamp: string;
  createdAt: number;
  notes: string;
  verifications: number;
  isCustom?: boolean;
}

export type VerdictType = 'SAFE' | 'CAUTION' | 'HIGH_RISK' | 'NO_DATA';

export interface SaferAlternative {
  name: string;
  distanceKm: number;
  lat: number;
  lng: number;
  description: string;
}

export interface VerdictResult {
  type: VerdictType;
  score: number;
  nearbyReports: (SafetyReport & { distanceKm: number })[];
  nearbyReportsCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  nearestReport?: SafetyReport & { distanceKm: number };
  saferAlternative?: SaferAlternative;
  headline: string;
  summary: string;
  advice: string[];
}

export interface NsukkaLocation {
  id: string;
  name: string;
  landmark: string;
  lat: number;
  lng: number;
  description?: string;
  knownSafe?: boolean;
}
