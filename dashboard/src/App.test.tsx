import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";
import App from "./App";

vi.mock("react-leaflet", () => ({
  CircleMarker: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  MapContainer: ({ children }: { children?: ReactNode }) => (
    <section aria-label="Territory map">{children}</section>
  ),
  Polyline: () => <div data-testid="mesh-line" />,
  Popup: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  Tooltip: ({ children }: { children?: ReactNode }) => <span>{children}</span>
}));

describe("App", () => {
  test("runs the core demo path from simulated detection to alert evidence", async () => {
    const user = userEvent.setup();
    const ingestFlag = vi.fn().mockResolvedValue({
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
          body: "EcoEye alert: chainsaw near node-01"
        },
        {
          id: "alert-2",
          event_id: "event-1",
          recipient_type: "ibama",
          channel: "sms",
          recipient: "IBAMA regional",
          status: "simulated",
          body: "EcoEye alert: chainsaw near node-01"
        }
      ],
      evidence: {
        provider: "EcoProof",
        status: "pending",
        chain_of_custody: "queued"
      }
    });

    render(<App ingestFlag={ingestFlag} />);

    expect(screen.getByText("EcoEye")).toBeInTheDocument();
    expect(screen.getByText("Territorial Web")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /simulate detection/i }));

    expect(ingestFlag).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(/Spider received/i)).toBeInTheDocument();
    expect(screen.getByText(/WhatsApp/i)).toBeInTheDocument();
    expect(screen.getByText(/EcoProof/i)).toBeInTheDocument();
  });

  test("can auto-start the demo for booth screenshots", async () => {
    const ingestFlag = vi.fn().mockResolvedValue({
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
          body: "EcoEye alert: chainsaw near node-01"
        }
      ],
      evidence: {
        provider: "EcoProof",
        status: "pending",
        chain_of_custody: "queued"
      }
    });

    render(<App ingestFlag={ingestFlag} autoStart />);

    expect(await screen.findByText(/Spider received/i)).toBeInTheDocument();
    expect(ingestFlag).toHaveBeenCalledTimes(1);
  });
});
