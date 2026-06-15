import { Activity, Bell, RadioTower, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEMO_FLAGS, MESH_LINKS } from "./data/demoData";
import { AlertLog } from "./components/AlertLog";
import { EvidenceStrip } from "./components/EvidenceStrip";
import { EventFeed } from "./components/EventFeed";
import { MeshAnimation } from "./components/MeshAnimation";
import { NodeCard } from "./components/NodeCard";
import { WebMap } from "./components/WebMap";
import {
  advanceHop,
  createInitialDemoState,
  mergeSpiderResponse,
  routeForThreat,
  type MiniFlag,
  type SpiderResponse
} from "./lib/demoState";
import { ingestDemoFlag } from "./services/api";

type AppProps = {
  ingestFlag?: (flag: MiniFlag) => Promise<SpiderResponse>;
  autoStart?: boolean;
};

function phaseLabel(phase: string) {
  if (phase === "spider-received") {
    return "Received by Spider";
  }

  if (phase === "broadcasting" || phase === "hopping") {
    return "Mini flag hopping";
  }

  return "Ready";
}

export default function App({ ingestFlag = ingestDemoFlag, autoStart = false }: AppProps) {
  const [state, setState] = useState(createInitialDemoState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasAutoStarted = useRef(false);

  const criticalNodeCount = useMemo(
    () => state.nodes.filter((node) => node.status === "alert").length,
    [state.nodes]
  );

  useEffect(() => {
    if (!state.isRunning) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setState((current) => advanceHop(current));
    }, 950);

    return () => window.clearInterval(timer);
  }, [state.isRunning]);

  const handleSimulateDetection = useCallback(async () => {
    const flag = DEMO_FLAGS.chainsaw;
    setIsSubmitting(true);
    setState((current) => ({
      ...current,
      selectedThreat: "chainsaw",
      lastFlag: flag,
      route: routeForThreat("chainsaw"),
      activeHop: 0,
      phase: "broadcasting",
      isRunning: true
    }));

    const response = await ingestFlag(flag);
    setState((current) => mergeSpiderResponse(current, response));
    setIsSubmitting(false);
  }, [ingestFlag]);

  useEffect(() => {
    if (!autoStart || hasAutoStarted.current) {
      return;
    }

    hasAutoStarted.current = true;
    void handleSimulateDetection();
  }, [autoStart, handleSimulateDetection]);

  return (
    <main className="app-shell">
      <header className="topbar" aria-label="EcoEye demo status">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1>EcoEye</h1>
            <p>Territorial Web</p>
          </div>
        </div>

        <div className="status-strip" aria-label="Network summary">
          <span>
            <RadioTower size={16} />
            {state.nodes.length - 1} phones
          </span>
          <span>
            <Activity size={16} />
            {phaseLabel(state.phase)}
          </span>
          <span>
            <Bell size={16} />
            {criticalNodeCount} alert nodes
          </span>
        </div>

        <button
          className="simulate-button"
          type="button"
          onClick={handleSimulateDetection}
          disabled={isSubmitting}
        >
          <RadioTower size={18} />
          Simulate detection
        </button>
      </header>

      <section className="dashboard-grid" aria-label="EcoEye proof of concept">
        <section className="map-panel" aria-label="Territorial map panel">
          <div className="panel-heading">
            <div>
              <h2>Xingu Indigenous Land</h2>
              <p>Node-01 detected chainsaw audio and relays a mini flag through the mesh.</p>
            </div>
            <span className={`phase-chip phase-${state.phase}`}>{phaseLabel(state.phase)}</span>
          </div>

          <WebMap
            nodes={state.nodes}
            links={MESH_LINKS}
            route={state.route}
            activeHop={state.activeHop}
            events={state.events}
          />
        </section>

        <aside className="right-rail" aria-label="Live response rail">
          <MeshAnimation route={state.route} activeHop={state.activeHop} phase={state.phase} />
          <EventFeed events={state.events} />
          <AlertLog alertLogs={state.alertLogs} />
        </aside>

        <section className="node-rail" aria-label="Node status">
          {state.nodes.map((node) => (
            <NodeCard key={node.id} node={node} />
          ))}
        </section>

        <EvidenceStrip evidence={state.evidence} lastFlag={state.lastFlag} />
      </section>
    </main>
  );
}
