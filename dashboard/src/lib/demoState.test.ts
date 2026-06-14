import { describe, expect, test } from "vitest";
import {
  advanceHop,
  createInitialDemoState,
  mergeSpiderResponse,
  routeForThreat
} from "./demoState";

describe("demoState", () => {
  test("routes chainsaw flags through four nodes to the Spider", () => {
    const route = routeForThreat("chainsaw");

    expect(route.map((hop) => hop.id)).toEqual([
      "node-01",
      "node-03",
      "node-04",
      "node-06",
      "spider"
    ]);
  });

  test("advanceHop stops at the final Spider hop", () => {
    const state = createInitialDemoState();
    const final = state.route.length - 1;

    const advanced = advanceHop({ ...state, activeHop: final });

    expect(advanced.activeHop).toBe(final);
    expect(advanced.phase).toBe("spider-received");
  });

  test("mergeSpiderResponse adds event and alerts", () => {
    const state = createInitialDemoState();

    const merged = mergeSpiderResponse(state, {
      event: {
        id: "event-1",
        node_id: "node-01",
        threat_type: "chainsaw",
        confidence: 0.91,
        severity: "critical",
        status: "alerted",
        lat: -2.8451,
        lng: -52.4142,
        detected_at: "2026-06-13T21:00:00.000Z"
      },
      alertLogs: [
        {
          id: "alert-1",
          event_id: "event-1",
          recipient_type: "community",
          channel: "whatsapp",
          recipient: "Community leader",
          status: "simulated",
          body: "EcoEye alert"
        }
      ],
      evidence: {
        provider: "EcoProof",
        status: "pending",
        chain_of_custody: "queued"
      }
    });

    expect(merged.events).toHaveLength(1);
    expect(merged.alertLogs).toHaveLength(1);
    expect(merged.evidence.status).toBe("pending");
    expect(merged.nodes.find((node) => node.id === "node-01")?.status).toBe("alert");
  });
});
