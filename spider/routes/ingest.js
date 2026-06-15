import { Router } from "express";
import { sendAlerts } from "../services/notifier.js";
import { ValidationError, miniFlagToEvent } from "../services/validator.js";

function evidenceFor(event) {
  return {
    provider: "EcoProof",
    status: "pending",
    chain_of_custody: "queued",
    event_id: event.id
  };
}

export function createIngestRouter(options = {}) {
  const router = Router();
  const notify = options.notify ?? sendAlerts;

  router.post("/ingest", async (request, response) => {
    try {
      const event = miniFlagToEvent(request.body);
      const alertLogs = await notify(event, { env: process.env });

      response.status(201).json({
        event,
        alertLogs,
        evidence: evidenceFor(event)
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        response.status(error.statusCode).json({ error: error.message });
        return;
      }

      response.status(500).json({ error: "Spider failed to ingest mini flag." });
    }
  });

  return router;
}
