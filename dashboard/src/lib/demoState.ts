import { DEMO_FLAGS, DEMO_NODES, THREAT_ROUTES } from "../data/demoData";

export type ThreatType = "fire" | "smoke" | "chainsaw" | "gunshot" | "human" | "vehicle";
export type NodeStatus = "active" | "relay" | "alert" | "spider" | "offline";
export type DemoPhase = "idle" | "broadcasting" | "hopping" | "spider-received";

export type DemoNode = {
  id: string;
  label: string;
  territory: string;
  lat: number;
  lng: number;
  status: NodeStatus;
  battery: number;
  signal: number;
  role: string;
};

export type MeshLink = {
  from: string;
  to: string;
  quality: number;
};

export type MiniFlag = {
  nid: string;
  t: ThreatType;
  c: number;
  lat: number;
  lng: number;
  ts: number;
};

export type DemoEvent = {
  id: string;
  node_id: string;
  threat_type: ThreatType;
  confidence: number;
  severity: "low" | "medium" | "high" | "critical";
  status: "pending" | "alerted" | "resolved" | "false_positive";
  lat: number;
  lng: number;
  detected_at: string;
  created_at?: string;
};

export type AlertLog = {
  id: string;
  event_id: string;
  recipient_type: "community" | "ibama" | "federal_police";
  channel: "whatsapp" | "sms";
  recipient: string;
  status: "simulated" | "sent" | "failed";
  body: string;
  sent_at?: string;
};

export type EvidenceStatus = {
  provider: "EcoProof";
  status: "standby" | "pending" | "created";
  chain_of_custody: "not_started" | "queued" | "sealed";
  event_id?: string;
};

export type SpiderResponse = {
  event: DemoEvent;
  alertLogs: AlertLog[];
  evidence: EvidenceStatus;
};

export type DemoState = {
  nodes: DemoNode[];
  route: DemoNode[];
  activeHop: number;
  phase: DemoPhase;
  events: DemoEvent[];
  alertLogs: AlertLog[];
  evidence: EvidenceStatus;
  selectedThreat: ThreatType;
  isRunning: boolean;
  lastFlag: MiniFlag;
};

export function routeForThreat(threatType: ThreatType): DemoNode[] {
  const nodeById = new Map(DEMO_NODES.map((node) => [node.id, node]));
  const route = THREAT_ROUTES[threatType].map((id) => {
    const node = nodeById.get(id);
    if (!node) {
      throw new Error(`Route for ${threatType} references missing node ${id}.`);
    }
    return node;
  });

  return route;
}

export function createInitialDemoState(): DemoState {
  const selectedThreat: ThreatType = "chainsaw";

  return {
    nodes: DEMO_NODES.map((node) => ({ ...node })),
    route: routeForThreat(selectedThreat),
    activeHop: 0,
    phase: "idle",
    events: [],
    alertLogs: [],
    evidence: {
      provider: "EcoProof",
      status: "standby",
      chain_of_custody: "not_started"
    },
    selectedThreat,
    isRunning: false,
    lastFlag: DEMO_FLAGS[selectedThreat]
  };
}

export function advanceHop(state: DemoState): DemoState {
  const finalHop = state.route.length - 1;

  if (state.activeHop >= finalHop) {
    return {
      ...state,
      activeHop: finalHop,
      phase: "spider-received",
      isRunning: false
    };
  }

  const nextHop = state.activeHop + 1;

  return {
    ...state,
    activeHop: nextHop,
    phase: nextHop >= finalHop ? "spider-received" : "hopping",
    isRunning: nextHop < finalHop
  };
}

export function mergeSpiderResponse(state: DemoState, response: SpiderResponse): DemoState {
  const routeIds = new Set(state.route.map((node) => node.id));
  const sourceNodeId = response.event.node_id;

  const nodes = state.nodes.map((node) => {
    if (node.id === "spider") {
      return { ...node, status: "spider" as const };
    }

    if (node.id === sourceNodeId) {
      return { ...node, status: "alert" as const };
    }

    if (routeIds.has(node.id)) {
      return { ...node, status: "relay" as const };
    }

    return { ...node, status: node.status === "alert" ? "active" : node.status };
  });

  return {
    ...state,
    nodes,
    activeHop: state.route.length - 1,
    phase: "spider-received",
    events: [response.event, ...state.events],
    alertLogs: [...response.alertLogs, ...state.alertLogs],
    evidence: response.evidence,
    isRunning: false
  };
}
