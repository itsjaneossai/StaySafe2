import { PRESET_NSUKKA_LOCATIONS } from '../data/initialData';
import { SaferAlternative, SafetyReport, VerdictResult } from '../types/safety';

export function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

const VICINITY_RADIUS_KM = 1.8;

export function calculateSafetyVerdict(
  targetLat: number,
  targetLng: number,
  locationName: string,
  reports: SafetyReport[]
): VerdictResult {
  // Compute distance for all reports
  const reportsWithDist = reports.map((rep) => ({
    ...rep,
    distanceKm: getDistanceKm(targetLat, targetLng, rep.lat, rep.lng),
  }));

  // Sort by distance
  reportsWithDist.sort((a, b) => a.distanceKm - b.distanceKm);

  const nearestReport = reportsWithDist[0];
  const nearbyReports = reportsWithDist.filter(
    (rep) => rep.distanceKm <= VICINITY_RADIUS_KM
  );

  const highRiskReports = nearbyReports.filter((r) => r.severity === 'high');
  const mediumRiskReports = nearbyReports.filter((r) => r.severity === 'medium');
  const lowRiskReports = nearbyReports.filter((r) => r.severity === 'low');

  // CRITICAL REQUIREMENT:
  // If no data exists for a searched/selected location, do NOT default to "Safe".
  // Show a neutral "No data yet for this area" state instead.
  if (nearbyReports.length === 0) {
    const nearestMsg = nearestReport
      ? `Nearest reported signal is at ${nearestReport.locationName} (${formatDistance(nearestReport.distanceKm)} away).`
      : 'No incidents logged across the area yet.';

    return {
      type: 'NO_DATA',
      score: 0,
      nearbyReports: [],
      nearbyReportsCount: 0,
      highRiskCount: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      nearestReport: nearestReport || undefined,
      headline: 'No data yet for this area',
      summary: `Zero safety reports recorded within ${VICINITY_RADIUS_KM}km. ${nearestMsg}`,
      advice: [
        'Stay alert and avoid walking isolated paths alone after dusk.',
        'Board only registered yellow commercial kekes with clear number plates.',
        'If you spot an active risk or safe zone here, submit a community report below.',
      ],
    };
  }

  // Weight verified reports (>= 3 verifications) more heavily (1.5x)
  let riskScore = 0;
  for (const rep of nearbyReports) {
    const isVerified = rep.verifications >= 3;
    const verificationWeight = isVerified ? 1.5 : 1.0;

    // Distance decay: closer reports have higher impact
    const proximityMultiplier = Math.max(0.4, 1 - rep.distanceKm / (VICINITY_RADIUS_KM * 1.2));

    if (rep.severity === 'high') {
      riskScore += 30 * verificationWeight * proximityMultiplier;
    } else if (rep.severity === 'medium') {
      riskScore += 14 * verificationWeight * proximityMultiplier;
    } else {
      // Safe / Low risk decreases the risk score
      riskScore -= 10 * verificationWeight * proximityMultiplier;
    }
  }

  // Find a safer alternative nearby if Caution or High Risk
  const findSaferAlternative = (): SaferAlternative | undefined => {
    // Check known safe hubs or other preset locations
    const candidateHubs = PRESET_NSUKKA_LOCATIONS.filter(
      (loc) => loc.name !== locationName && loc.knownSafe
    );

    // If no preset tagged knownSafe, find location with least reports
    const candidates = candidateHubs.length > 0 ? candidateHubs : PRESET_NSUKKA_LOCATIONS;

    let bestHub: SaferAlternative | undefined;
    let minCandidateDist = Infinity;

    for (const hub of candidates) {
      const dist = getDistanceKm(targetLat, targetLng, hub.lat, hub.lng);
      // Check if this hub has high risk nearby
      const hubNearby = reports.filter(
        (r) => getDistanceKm(hub.lat, hub.lng, r.lat, r.lng) <= 1.0 && r.severity === 'high'
      );
      if (hubNearby.length === 0 && dist < minCandidateDist && dist > 0.3) {
        minCandidateDist = dist;
        bestHub = {
          name: hub.name,
          distanceKm: dist,
          lat: hub.lat,
          lng: hub.lng,
          description: hub.description || 'Manned checkpoints and active foot traffic.',
        };
      }
    }

    if (!bestHub && candidateHubs[0]) {
      const hub = candidateHubs[0];
      const dist = getDistanceKm(targetLat, targetLng, hub.lat, hub.lng);
      bestHub = {
        name: hub.name,
        distanceKm: dist,
        lat: hub.lat,
        lng: hub.lng,
        description: hub.description || 'Manned checkpoints and active foot traffic.',
      };
    }

    return bestHub;
  };

  // Determine Verdict
  if (highRiskReports.length > 0 || riskScore >= 25) {
    const verifiedHigh = highRiskReports.filter((r) => r.verifications >= 3).length;
    const saferAlt = findSaferAlternative();

    return {
      type: 'HIGH_RISK',
      score: Math.round(riskScore),
      nearbyReports,
      nearbyReportsCount: nearbyReports.length,
      highRiskCount: highRiskReports.length,
      mediumRiskCount: mediumRiskReports.length,
      lowRiskCount: lowRiskReports.length,
      nearestReport: nearbyReports[0],
      saferAlternative: saferAlt,
      headline: 'High Risk Area',
      summary: `Critical danger alerts flagged nearby (${highRiskReports.length} high-risk incident${highRiskReports.length > 1 ? 's' : ''}${verifiedHigh > 0 ? `, ${verifiedHigh} community-verified` : ''}). Extreme caution required.`,
      advice: [
        'Avoid this transit point during late hours or unlit night periods.',
        'Do not wait alone on unlit road shoulders or sawmill junctions.',
        saferAlt
          ? `Safer alternative: Route through ${saferAlt.name} (~${formatDistance(saferAlt.distanceKm)} away) which has no active high-risk alerts.`
          : 'Seek alternative well-lit arterial roads like UNN Main Gate corridor.',
        'Share your real-time whereabouts with a trusted contact before boarding.',
      ],
    };
  }

  if (mediumRiskReports.length > 0 || riskScore >= 10) {
    const saferAlt = findSaferAlternative();

    return {
      type: 'CAUTION',
      score: Math.round(riskScore),
      nearbyReports,
      nearbyReportsCount: nearbyReports.length,
      highRiskCount: highRiskReports.length,
      mediumRiskCount: mediumRiskReports.length,
      lowRiskCount: lowRiskReports.length,
      nearestReport: nearbyReports[0],
      saferAlternative: saferAlt,
      headline: 'Caution Advised',
      summary: `Moderate transit risks reported (${mediumRiskReports.length} caution alert${mediumRiskReports.length > 1 ? 's' : ''}). Stay vigilant around touts and crowded stops.`,
      advice: [
        'Keep phones, bags, and valuables securely held in front, especially during peak rush.',
        'Confirm keke fare and driver route prior to entering; reject unannounced detours.',
        saferAlt
          ? `Safer nearby alternative: ${saferAlt.name} (~${formatDistance(saferAlt.distanceKm)} away).`
          : 'Wait for transport in well-lit commercial storefronts rather than empty corners.',
      ],
    };
  }

  // Safe verdict
  return {
    type: 'SAFE',
    score: Math.max(0, Math.round(riskScore)),
    nearbyReports,
    nearbyReportsCount: nearbyReports.length,
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: lowRiskReports.length,
    nearestReport: nearbyReports[0],
    headline: 'Relatively Safe Area',
    summary: `Regular foot traffic, active commercial lighting, or manned security posts recorded within ${VICINITY_RADIUS_KM}km.`,
    advice: [
      'Normal commuter vigilance applies — keep possessions secure.',
      'Shuttles and registered tricycles regularly ply this corridor.',
      'Report any suspicious activity if conditions change unexpectedly.',
    ],
  };
}
