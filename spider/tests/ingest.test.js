import request from "supertest";
import { describe, expect, test } from "vitest";
import { createApp } from "../server.js";

describe("POST /api/ingest", () => {
  test("creates an event and alert log from a valid chainsaw mini flag", async () => {
    const app = createApp();

    const response = await request(app)
      .post("/api/ingest")
      .send({
        nid: "node-01",
        t: "chainsaw",
        c: 0.91,
        lat: -2.8451,
        lng: -52.4142,
        ts: 1718123456
      })
      .expect(201);

    expect(response.body.event).toMatchObject({
      node_id: "node-01",
      threat_type: "chainsaw",
      confidence: 0.91,
      severity: "critical",
      status: "alerted"
    });
    expect(response.body.alertLogs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ recipient_type: "community", channel: "whatsapp" }),
        expect.objectContaining({ recipient_type: "ibama", channel: "sms" })
      ])
    );
    expect(response.body.evidence).toMatchObject({
      provider: "EcoProof",
      status: "pending"
    });
  });

  test("rejects a low-confidence chainsaw mini flag", async () => {
    const app = createApp();

    const response = await request(app)
      .post("/api/ingest")
      .send({
        nid: "node-01",
        t: "chainsaw",
        c: 0.4,
        lat: -2.8451,
        lng: -52.4142,
        ts: 1718123456
      })
      .expect(400);

    expect(response.body.error).toContain("confidence");
  });
});
