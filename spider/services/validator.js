export const THREAT_THRESHOLDS = {
  fire: { confidence: 0.8, severity: "critical" },
  smoke: { confidence: 0.75, severity: "high" },
  chainsaw: { confidence: 0.85, severity: "critical" },
  gunshot: { confidence: 0.9, severity: "critical" },
  human: { confidence: 0.7, severity: "high" },
  vehicle: { confidence: 0.7, severity: "medium" }
};

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

function assertFiniteNumber(value, field) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new ValidationError(`Mini flag field "${field}" must be a finite number.`);
  }
}

export function normalizeFlag(flag) {
  if (!flag || typeof flag !== "object") {
    throw new ValidationError("Mini flag body is required.");
  }

  const nodeId = String(flag.nid ?? "").trim();
  const threatType = String(flag.t ?? "").trim().toLowerCase();
  const threshold = THREAT_THRESHOLDS[threatType];

  if (!nodeId) {
    throw new ValidationError("Mini flag field \"nid\" is required.");
  }

  if (!threshold) {
    throw new ValidationError(`Unknown threat type "${threatType}".`);
  }

  assertFiniteNumber(flag.c, "c");
  assertFiniteNumber(flag.lat, "lat");
  assertFiniteNumber(flag.lng, "lng");
  assertFiniteNumber(flag.ts, "ts");

  if (flag.c < threshold.confidence) {
    throw new ValidationError(
      `${threatType} confidence ${flag.c} is below threshold ${threshold.confidence}.`
    );
  }

  return {
    nid: nodeId,
    t: threatType,
    c: Number(flag.c.toFixed(3)),
    lat: Number(flag.lat.toFixed(6)),
    lng: Number(flag.lng.toFixed(6)),
    ts: Math.trunc(flag.ts)
  };
}

export function miniFlagToEvent(flag) {
  const normalized = normalizeFlag(flag);
  const threshold = THREAT_THRESHOLDS[normalized.t];
  const detectedAt = new Date(normalized.ts * 1000).toISOString();

  return {
    id: `event-${normalized.nid}-${normalized.ts}`,
    node_id: normalized.nid,
    threat_type: normalized.t,
    confidence: normalized.c,
    lat: normalized.lat,
    lng: normalized.lng,
    severity: threshold.severity,
    status: "alerted",
    raw_flag: normalized,
    detected_at: detectedAt,
    created_at: new Date().toISOString()
  };
}
