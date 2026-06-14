# EcoEye MVP Proof Of Concept Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a small, straightforward local proof of concept that shows an EcoEye mesh detection traveling through phone nodes to the Spider server, then appearing as a live map event with alert and evidence status.

**Architecture:** Use a Vite React dashboard for the demo surface and a tiny Express Spider API for simulated ingest. Keep persistent state in memory for the hackathon demo, put reusable behavior in small pure modules, and make all hardware, ML, database, Twilio, and EcoProof behavior simulated unless credentials are configured.

**Tech Stack:** React, TypeScript, Vite, React Leaflet/Leaflet, Express, Vitest, Testing Library, Supertest, optional Twilio SDK.

---

## Source Spec And Visual Concept

- Spec: `README.md`
- Concept image: `docs/superpowers/concepts/ecoeye-mvp-dashboard-concept.png`
- MVP scope:
  - `dashboard/WebMap.tsx`: territory map with 5-6 nodes shown as a mesh web.
  - `dashboard/MeshAnimation.tsx`: mini flag route from edge node through 3-4 nodes to Spider.
  - `spider/routes/ingest.js`: receives a simulated mini flag.
  - `spider/services/notifier.js`: sends a Twilio WhatsApp/SMS notification when credentials exist, otherwise returns a visible simulated notification log.
  - Live event appears on the map when Spider receives the flag.
- Nice-to-have inside this small MVP:
  - Multiple threat buttons.
  - On-screen WhatsApp message.
  - EcoProof pending/created status strip.
- Explicitly out of scope:
  - Real Meshtastic hardware.
  - Real MediaPipe inference.
  - PostgreSQL/Neon persistence.
  - Auth.
  - Multiple territories.

## File Structure

- Create: `package.json`
  - Root scripts for `dev`, `dev:dashboard`, `dev:api`, `build`, `test`, `typecheck`.
- Create: `index.html`
  - Vite entry shell.
- Create: `vite.config.ts`
  - React plugin, root project config, proxy `/api` to the Spider API.
- Create: `tsconfig.json`
  - Strict TypeScript configuration for dashboard code and tests.
- Create: `vitest.config.ts`
  - Node + jsdom test support.
- Create: `dashboard/src/test/setup.ts`
  - Shared Vitest setup for Testing Library assertions.
- Create: `dashboard/src/main.tsx`
  - React root mount.
- Create: `dashboard/src/App.tsx`
  - Composes the demo shell, simulation controls, map, feed, alerts, and evidence strip.
- Create: `dashboard/src/App.test.tsx`
  - Covers the user demo path with the API client injected.
- Create: `dashboard/src/data/demoData.ts`
  - Territory nodes, mesh links, route definitions, sample flags, and contacts.
- Create: `dashboard/src/lib/demoState.ts`
  - Pure state helpers for route/hop/event updates.
- Create: `dashboard/src/lib/demoState.test.ts`
  - TDD coverage for route selection and event merge behavior.
- Create: `dashboard/src/services/api.ts`
  - `ingestDemoFlag()` fetch wrapper with local fallback for static demos.
- Create: `dashboard/src/components/WebMap.tsx`
  - Leaflet map canvas and vector node/link/event rendering.
- Create: `dashboard/src/components/MeshAnimation.tsx`
  - Route hop status and animated flag timeline.
- Create: `dashboard/src/components/EventFeed.tsx`
  - Live event list.
- Create: `dashboard/src/components/AlertLog.tsx`
  - On-screen notification log.
- Create: `dashboard/src/components/NodeCard.tsx`
  - Compact node status rows/cards.
- Create: `dashboard/src/components/EvidenceStrip.tsx`
  - EcoProof evidence status strip.
- Create: `dashboard/src/styles.css`
  - Design tokens, layout, responsive rules, Leaflet styling, animation.
- Create: `spider/server.js`
  - Express app factory and local server start.
- Create: `spider/routes/ingest.js`
  - `POST /api/ingest`.
- Create: `spider/services/validator.js`
  - Mini flag validation, normalization, severity calculation.
- Create: `spider/services/rule_engine.js`
  - Recipient/channel choice by threat type.
- Create: `spider/services/notifier.js`
  - Twilio or simulation notification service.
- Create: `spider/tests/ingest.test.js`
  - HTTP ingest tests.
- Create: `spider/tests/notifier.test.js`
  - Notification tests.
- Create: `docs/DEMO_SCRIPT.md`
  - Five-minute demo script from README, aligned to the implemented controls.
- Modify: `progress.md`
  - Add this implementation slice summary.
- Modify: `learnings.md`
  - Record tested assumptions and setup decisions.

## Design System From Concept

- Layout: full-screen operational dashboard, compact header, map canvas occupying the left/center, right rail for live feed and alerts, bottom/side strip for evidence.
- Palette:
  - Background: `#071f18`
  - Surface: `#f4f7f1`
  - Surface muted: `#dfe8dc`
  - Text dark: `#13251d`
  - Text light: `#f5f8f2`
  - Muted text: `#6d7d73`
  - Forest accent: `#1f6b4b`
  - Mesh line: `#76b58b`
  - Warning: `#f0b429`
  - Critical: `#d94343`
  - Evidence blue: `#4e8ab8`
- Typography: system sans stack, no viewport-scaled font sizes, no negative letter spacing, compact UI labels.
- Container model: one dashboard shell, un-nested panels, map canvas as the primary surface, repeated alert/event items as small cards with `8px` radius.
- Motion: hop advances every 900-1100ms while simulation runs; pulse the active mini flag and critical node; respect `prefers-reduced-motion`.

## Local Task Slices

### Slice 1: Project Scaffold And Test Harness

**Overview:** Add the Vite/React/Express project shell and test tooling without implementing feature behavior.

**Requirements:**
- Keep the root repository lightweight.
- Use React + Vite for the dashboard.
- Use Express for the Spider API.
- Use Vitest for both dashboard and server tests.

**Dependencies:** None.

**Definition of done:**
- `npm install` succeeds.
- `npm run test` can run and initially has no feature tests or only failing feature tests from later slices.

**Acceptance criteria:**
- `package.json`, `vite.config.ts`, `tsconfig.json`, `vitest.config.ts`, and `dashboard/src/test/setup.ts` exist.
- No production MVP behavior is implemented before failing tests in later tasks.

#### Task 1: Add Tooling Files

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `dashboard/src/test/setup.ts`

- [ ] **Step 1: Create `package.json`**

Use this content:

```json
{
  "name": "ecoeye",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "concurrently \"npm:dev:api\" \"npm:dev:dashboard\"",
    "dev:dashboard": "vite --host 127.0.0.1 --port 5173",
    "dev:api": "node spider/server.js",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1 --port 4173",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "concurrently": "^9.0.0",
    "cors": "^2.8.5",
    "express": "^5.0.0",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.468.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-leaflet": "^5.0.0",
    "twilio": "^5.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/leaflet": "^1.9.16",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "supertest": "^7.0.0",
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `index.html`**

Use this content:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EcoEye MVP</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/dashboard/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Create Vite and TypeScript config**

`vite.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8787"
    }
  }
});
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": true,
    "checkJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["dashboard/src", "spider", "vite.config.ts", "vitest.config.ts"]
}
```

`vitest.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environmentMatchGlobs: [
      ["dashboard/src/**/*.test.tsx", "jsdom"],
      ["dashboard/src/**/*.test.ts", "jsdom"],
      ["spider/**/*.test.js", "node"]
    ],
    setupFiles: ["dashboard/src/test/setup.ts"]
  }
});
```

- [ ] **Step 4: Create test setup file**

Create `dashboard/src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Install dependencies**

Run:

```bash
npm install
```

Expected: `package-lock.json` is created and install exits 0.

- [ ] **Step 6: Commit scaffold**

Run:

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig.json vitest.config.ts dashboard/src/test/setup.ts
git commit -m "chore: scaffold EcoEye MVP app"
```

### Slice 2: Spider Ingest API

**Overview:** Build the backend path that receives a mini flag, validates it, derives an event, and produces notification logs.

**Requirements:**
- Accept the README mini flag shape: `nid`, `t`, `c`, `lat`, `lng`, `ts`.
- Reject unknown threat types and low confidence flags.
- Return event data, route hints, alert logs, and evidence status.
- Keep Twilio optional for local demos.

**Dependencies:** Slice 1.

**Definition of done:**
- `npm run test -- spider` passes.
- `POST /api/ingest` returns a live event for a valid flag.

**Acceptance criteria:**
- Valid chainsaw flag returns status 201 with `event.threat_type === "chainsaw"` and at least two alert logs.
- Invalid confidence returns 400.
- Notifier returns simulated status without credentials and does not throw.

#### Task 2: Write Failing Spider Tests

**Files:**
- Create: `spider/tests/ingest.test.js`
- Create: `spider/tests/notifier.test.js`

- [ ] **Step 1: Write ingest route tests**

Create `spider/tests/ingest.test.js`:

```js
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
```

- [ ] **Step 2: Write notifier tests**

Create `spider/tests/notifier.test.js`:

```js
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
```

- [ ] **Step 3: Run tests and verify RED**

Run:

```bash
npm run test -- spider
```

Expected: FAIL because `spider/server.js` and `spider/services/notifier.js` do not exist yet.

#### Task 3: Implement Spider API

**Files:**
- Create: `spider/server.js`
- Create: `spider/routes/ingest.js`
- Create: `spider/services/validator.js`
- Create: `spider/services/rule_engine.js`
- Create: `spider/services/notifier.js`

- [ ] **Step 1: Implement validator and rule engine**

Implement `validator.js` with:
- `THREAT_THRESHOLDS`
- `normalizeFlag(flag)`
- `miniFlagToEvent(flag)`

Implement `rule_engine.js` with:
- `recipientsForThreat(threatType)`

Behavior:
- `chainsaw`, `fire`, and `gunshot` are `critical`.
- `smoke` and night `human` are `high`.
- `vehicle` is `medium`.
- Confidence must meet the README threshold per threat.

- [ ] **Step 2: Implement notifier**

Implement:
- `buildAlertMessages(event)`
- `sendAlerts(event, options = {})`

Rules:
- Without Twilio env vars, return simulated logs with `status: "simulated"`.
- With env vars and a provided or constructed client, call `client.messages.create`.
- Community receives WhatsApp.
- IBAMA receives SMS.

- [ ] **Step 3: Implement route and server**

Implement:
- `createIngestRouter()`
- `createApp()`
- Local server listen on port `8787` when `spider/server.js` is run directly.

Response body for success:

```js
{
  event,
  alertLogs,
  evidence: {
    provider: "EcoProof",
    status: "pending",
    chain_of_custody: "queued"
  }
}
```

- [ ] **Step 4: Run tests and verify GREEN**

Run:

```bash
npm run test -- spider
```

Expected: PASS.

- [ ] **Step 5: Commit backend slice**

Run:

```bash
git add spider package.json package-lock.json
git commit -m "feat: add simulated Spider ingest API"
```

### Slice 3: Dashboard Demo State

**Overview:** Add deterministic sample territory data and pure state helpers so the UI can show route hops, live events, and alert logs.

**Requirements:**
- Use 6 nodes in one territory.
- Route a chainsaw flag across at least 4 nodes before Spider.
- Convert Spider API response into dashboard state.

**Dependencies:** Slice 2.

**Definition of done:**
- `npm run test -- dashboard/src/lib` passes.

**Acceptance criteria:**
- `routeForThreat("chainsaw")` includes `node-01` and `spider`.
- `advanceHop()` stops at the final hop.
- `mergeSpiderEvent()` adds one event and alert logs without losing node state.

#### Task 4: Write Failing Dashboard State Tests

**Files:**
- Create: `dashboard/src/lib/demoState.test.ts`

- [ ] **Step 1: Write demo state tests**

Create `dashboard/src/lib/demoState.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
npm run test -- dashboard/src/lib
```

Expected: FAIL because `dashboard/src/lib/demoState.ts` does not exist yet.

#### Task 5: Implement Dashboard Data And State

**Files:**
- Create: `dashboard/src/data/demoData.ts`
- Create: `dashboard/src/lib/demoState.ts`
- Create: `dashboard/src/services/api.ts`

- [ ] **Step 1: Implement demo data**

Create:
- `DEMO_NODES`
- `MESH_LINKS`
- `THREAT_ROUTES`
- `DEMO_FLAGS`

Data requirements:
- Include nodes `node-01`, `node-02`, `node-03`, `node-04`, `node-05`, `node-06`, and `spider`.
- Coordinates should cluster around Xingu Indigenous Land.
- Use statuses `active`, `relay`, `alert`, `spider`.

- [ ] **Step 2: Implement state helpers**

Exports:
- `createInitialDemoState()`
- `routeForThreat(threatType)`
- `advanceHop(state)`
- `mergeSpiderResponse(state, response)`

Types:
- `ThreatType`
- `DemoNode`
- `DemoEvent`
- `AlertLog`
- `EvidenceStatus`
- `DemoState`

- [ ] **Step 3: Implement API service**

Create `ingestDemoFlag(flag)`:
- POST to `/api/ingest`.
- If fetch fails, return a local simulated Spider response so the static dashboard remains demoable.

- [ ] **Step 4: Run tests and verify GREEN**

Run:

```bash
npm run test -- dashboard/src/lib
```

Expected: PASS.

- [ ] **Step 5: Commit state slice**

Run:

```bash
git add dashboard/src/data dashboard/src/lib dashboard/src/services dashboard/src/test
git commit -m "feat: add dashboard demo state"
```

### Slice 4: Dashboard UI And Demo Workflow

**Overview:** Build the visible demo screen that matches the concept: map-first layout, route animation, event feed, alert log, and evidence strip.

**Requirements:**
- First screen is the app, not a landing page.
- `Simulate detection` triggers the route and Spider ingest.
- Live event appears on the map and feed.
- Alert log displays WhatsApp/SMS status.
- Responsive layout does not overlap or clip text at desktop or mobile widths.

**Dependencies:** Slices 2 and 3.

**Definition of done:**
- `npm run test -- dashboard/src/App.test.tsx` passes.
- `npm run build` passes.

**Acceptance criteria:**
- App renders `EcoEye`, `Territorial Web`, and `Simulate detection`.
- Clicking the simulate button eventually displays `Spider received`, `WhatsApp`, and `EcoProof`.
- The map displays 6 node labels and a Spider label.

#### Task 6: Write Failing App Workflow Test

**Files:**
- Create: `dashboard/src/App.test.tsx`

- [ ] **Step 1: Write app test with API injection**

Create `dashboard/src/App.test.tsx`:

```tsx
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
});
```

- [ ] **Step 2: Run app test and verify RED**

Run:

```bash
npm run test -- dashboard/src/App.test.tsx
```

Expected: FAIL because `dashboard/src/App.tsx` does not exist yet.

#### Task 7: Implement Dashboard Components

**Files:**
- Create: `dashboard/src/main.tsx`
- Create: `dashboard/src/App.tsx`
- Create: `dashboard/src/components/WebMap.tsx`
- Create: `dashboard/src/components/MeshAnimation.tsx`
- Create: `dashboard/src/components/EventFeed.tsx`
- Create: `dashboard/src/components/AlertLog.tsx`
- Create: `dashboard/src/components/NodeCard.tsx`
- Create: `dashboard/src/components/EvidenceStrip.tsx`
- Create: `dashboard/src/styles.css`

- [ ] **Step 1: Implement app composition**

`App` should:
- Accept optional prop `ingestFlag`.
- Hold `DemoState`.
- Start animation immediately when `Simulate detection` is clicked.
- Call `ingestFlag(DEMO_FLAGS.chainsaw)` and merge the Spider response.
- Advance hops on a timer until Spider receives the flag.

- [ ] **Step 2: Implement Leaflet map**

`WebMap` should:
- Render `MapContainer` centered on the territory.
- Use no remote tiles; use CSS map background and Leaflet vector overlays.
- Render all nodes as `CircleMarker`.
- Render `MESH_LINKS` as polylines.
- Render the active route as highlighted polylines.
- Render critical event point when an event exists.

- [ ] **Step 3: Implement UI panels**

Components should render:
- `MeshAnimation`: route list and active hop.
- `EventFeed`: latest events.
- `AlertLog`: simulated/sent notification logs.
- `NodeCard`: compact node status.
- `EvidenceStrip`: EcoProof pending/queued status.

- [ ] **Step 4: Implement styling**

Style to match the concept:
- Dense operational layout.
- No nested cards.
- `8px` radius or less for cards.
- No decorative orbs.
- Map-first screen.
- Mobile stacks map, controls, feed, and alerts without overlap.

- [ ] **Step 5: Run app test and verify GREEN**

Run:

```bash
npm run test -- dashboard/src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit dashboard UI**

Run:

```bash
git add dashboard/src
git commit -m "feat: build EcoEye demo dashboard"
```

### Slice 5: Documentation, Verification, And Handoff

**Overview:** Add the demo script, update progress/learnings, and run the full verification suite.

**Requirements:**
- Record what was built.
- Capture assumptions in `learnings.md`.
- Verify tests, typecheck, build, and browser behavior.

**Dependencies:** Slices 1-4.

**Definition of done:**
- `npm run test` passes.
- `npm run typecheck` passes.
- `npm run build` passes.
- Browser verification checks desktop and mobile.

**Acceptance criteria:**
- Demo can be run with `npm run dev`.
- Clicking `Simulate detection` shows event, alert, and evidence status.
- `progress.md` and `learnings.md` are updated.

#### Task 8: Write Demo Documentation

**Files:**
- Create: `docs/DEMO_SCRIPT.md`
- Modify: `README.md`

- [ ] **Step 1: Create demo script**

Create `docs/DEMO_SCRIPT.md` with:
- Setup command: `npm install`
- Run command: `npm run dev`
- Demo flow:
  1. Open `http://127.0.0.1:5173`.
  2. Show the territorial web.
  3. Click `Simulate detection`.
  4. Watch the mini flag route to Spider.
  5. Show event feed.
  6. Show WhatsApp/SMS alert log.
  7. Show EcoProof pending status.

- [ ] **Step 2: Update README MVP checklist**

Mark the implemented MVP items as complete and add local run instructions near the Hackathon MVP section.

#### Task 9: Update Progress And Learnings

**Files:**
- Modify: `progress.md`
- Modify: `learnings.md`

- [ ] **Step 1: Append progress entry**

Add:
- Plan path.
- Slices implemented.
- Commands run.
- Browser verification notes.

- [ ] **Step 2: Append learnings entry**

Record:
- README contains the product spec, not code.
- Twilio must be optional for local hackathon demo.
- Leaflet can be used with vector overlays and a CSS map background to avoid remote tile dependency.
- For the POC, in-memory server state is enough.

#### Task 10: Run Final Verification

**Files:**
- No file edits unless verification finds defects.

- [ ] **Step 1: Run full tests**

Run:

```bash
npm run test
```

Expected: PASS.

- [ ] **Step 2: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Run build**

Run:

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 4: Browser verify**

Run:

```bash
npm run dev
```

Open `http://127.0.0.1:5173` in Browser/IAB.

Verify:
- Desktop view loads with map-first layout.
- Click `Simulate detection`.
- Event appears on map and in feed.
- Alert log shows WhatsApp and SMS.
- Evidence strip shows EcoProof pending/queued.
- Mobile viewport has no clipped or overlapping text.

- [ ] **Step 5: Capture and inspect screenshots**

Use Browser/IAB screenshots plus `view_image` for:
- Concept: `docs/superpowers/concepts/ecoeye-mvp-dashboard-concept.png`
- Latest rendered app screenshot.

Compare at least:
- Copy.
- Layout.
- Palette.
- Map prominence.
- Event/alert rail.
- Evidence strip.
- Responsive behavior.

- [ ] **Step 6: Commit docs and fixes**

Run:

```bash
git add README.md docs progress.md learnings.md
git commit -m "docs: add EcoEye MVP demo notes"
```

If visual or verification fixes were needed, include those files in the same commit with a message that still reflects the final scope.

## Self-Review

- Spec coverage:
  - Map/web: covered by Slice 4.
  - Mesh animation: covered by Slice 4.
  - Ingest route: covered by Slice 2.
  - Notifier: covered by Slice 2.
  - Live event on map: covered by Slices 3 and 4.
  - Multiple simulated threats: only chainsaw is required for the smallest MVP; data structure allows adding more.
  - WhatsApp display: covered by AlertLog.
  - EcoProof: covered by EvidenceStrip as pending/queued simulation.
  - Real Meshtastic, MediaPipe, DB, auth: intentionally out of scope.
- Placeholder scan:
  - No unresolved markers or incomplete implementation placeholders are required by the plan.
- Type consistency:
  - `DemoState`, `DemoEvent`, `AlertLog`, and `EvidenceStatus` names are introduced before use.
  - Spider response shape is consistent across tests, services, and UI.
- Risk notes:
  - Real Twilio delivery cannot be verified without credentials and a test number; the implementation must simulate by default and send for real only when env vars exist.
  - Browser tile/network dependency is avoided by using Leaflet vectors over a CSS territory background.
