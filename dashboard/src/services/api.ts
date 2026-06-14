import { DEMO_FLAGS } from "../data/demoData";
import type { MiniFlag, SpiderResponse } from "../lib/demoState";

function simulatedResponse(flag: MiniFlag): SpiderResponse {
  const detectedAt = new Date(flag.ts * 1000).toISOString();
  const event = {
    id: `event-${flag.nid}-${flag.ts}`,
    node_id: flag.nid,
    threat_type: flag.t,
    confidence: flag.c,
    severity: flag.t === "vehicle" ? "medium" : "critical",
    status: "alerted",
    lat: flag.lat,
    lng: flag.lng,
    detected_at: detectedAt
  } satisfies SpiderResponse["event"];

  return {
    event,
    alertLogs: [
      {
        id: `alert-${event.id}-1`,
        event_id: event.id,
        recipient_type: "community",
        channel: "whatsapp",
        recipient: "Community leader",
        status: "simulated",
        body: `EcoEye alert: ${flag.t} detected by ${flag.nid} at ${flag.lat}, ${flag.lng}.`
      },
      {
        id: `alert-${event.id}-2`,
        event_id: event.id,
        recipient_type: "ibama",
        channel: "sms",
        recipient: "IBAMA regional",
        status: "simulated",
        body: `EcoEye alert: ${flag.t} detected by ${flag.nid} at ${flag.lat}, ${flag.lng}.`
      }
    ],
    evidence: {
      provider: "EcoProof",
      status: "pending",
      chain_of_custody: "queued",
      event_id: event.id
    }
  };
}

export async function ingestDemoFlag(flag: MiniFlag = DEMO_FLAGS.chainsaw): Promise<SpiderResponse> {
  try {
    const response = await fetch("/api/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(flag)
    });

    if (!response.ok) {
      throw new Error(`Spider ingest failed with status ${response.status}.`);
    }

    return (await response.json()) as SpiderResponse;
  } catch (_error) {
    return simulatedResponse(flag);
  }
}
