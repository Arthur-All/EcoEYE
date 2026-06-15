import { describe, expect, test, vi } from "vitest";
import { buildAlertMessages, sendAlerts } from "../services/notifier.js";

const event = {
  id: "event-123",
  node_id: "node-01",
  threat_type: "chainsaw",
  confidence: 0.91,
  severity: "critical",
  lat: -2.8451,
  lng: -52.4142,
  detected_at: "2026-06-13T21:00:00.000Z"
};

describe("notifier", () => {
  test("builds community and IBAMA messages with GPS coordinates", () => {
    const messages = buildAlertMessages(event);

    expect(messages).toHaveLength(2);
    expect(messages[0].body).toContain("chainsaw");
    expect(messages[0].body).toContain("-2.8451, -52.4142");
    expect(messages.map((message) => message.channel)).toEqual(["whatsapp", "sms"]);
  });

  test("returns simulated logs when Twilio credentials are absent", async () => {
    const logs = await sendAlerts(event, { env: {} });

    expect(logs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ status: "simulated", recipient_type: "community" })
      ])
    );
  });

  test("uses Twilio client when credentials are configured", async () => {
    const create = vi.fn().mockResolvedValue({ sid: "SM123" });
    const client = { messages: { create } };

    const logs = await sendAlerts(event, {
      env: {
        TWILIO_FROM_WHATSAPP: "whatsapp:+15550000000",
        TWILIO_TO_WHATSAPP: "whatsapp:+15551111111",
        TWILIO_FROM_SMS: "+15550000000",
        TWILIO_TO_SMS: "+15552222222"
      },
      twilioClient: client
    });

    expect(create).toHaveBeenCalledTimes(2);
    expect(logs.every((log) => log.status === "sent")).toBe(true);
  });
});
