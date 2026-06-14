import cors from "cors";
import express from "express";
import { pathToFileURL } from "node:url";
import { createIngestRouter } from "./routes/ingest.js";

export function createApp(options = {}) {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "64kb" }));
  app.get("/api/health", (_request, response) => {
    response.json({ ok: true, service: "ecoeye-spider" });
  });
  app.use("/api", createIngestRouter(options));

  return app;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 8787);
  createApp().listen(port, "127.0.0.1", () => {
    console.log(`EcoEye Spider API listening on http://127.0.0.1:${port}`);
  });
}
