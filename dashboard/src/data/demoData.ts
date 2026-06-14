import type { DemoNode, MeshLink, MiniFlag, ThreatType } from "../lib/demoState";

export const DEMO_NODES: DemoNode[] = [
  {
    id: "node-01",
    label: "Node-01",
    territory: "Xingu Indigenous Land",
    lat: -2.8651,
    lng: -52.4552,
    status: "active",
    battery: 82,
    signal: 92,
    role: "edge phone"
  },
  {
    id: "node-02",
    label: "Node-02",
    territory: "Xingu Indigenous Land",
    lat: -2.8245,
    lng: -52.469,
    status: "active",
    battery: 69,
    signal: 78,
    role: "river watch"
  },
  {
    id: "node-03",
    label: "Node-03",
    territory: "Xingu Indigenous Land",
    lat: -2.8421,
    lng: -52.4245,
    status: "relay",
    battery: 76,
    signal: 88,
    role: "relay phone"
  },
  {
    id: "node-04",
    label: "Node-04",
    territory: "Xingu Indigenous Land",
    lat: -2.8065,
    lng: -52.4024,
    status: "relay",
    battery: 61,
    signal: 81,
    role: "ridge relay"
  },
  {
    id: "node-05",
    label: "Node-05",
    territory: "Xingu Indigenous Land",
    lat: -2.8818,
    lng: -52.3854,
    status: "active",
    battery: 94,
    signal: 75,
    role: "south guard"
  },
  {
    id: "node-06",
    label: "Node-06",
    territory: "Xingu Indigenous Land",
    lat: -2.8325,
    lng: -52.3568,
    status: "relay",
    battery: 58,
    signal: 84,
    role: "last hop"
  },
  {
    id: "spider",
    label: "Spider",
    territory: "Xingu Indigenous Land",
    lat: -2.815,
    lng: -52.325,
    status: "spider",
    battery: 100,
    signal: 100,
    role: "server gateway"
  }
];

export const MESH_LINKS: MeshLink[] = [
  { from: "node-01", to: "node-02", quality: 0.72 },
  { from: "node-01", to: "node-03", quality: 0.91 },
  { from: "node-02", to: "node-03", quality: 0.78 },
  { from: "node-03", to: "node-04", quality: 0.88 },
  { from: "node-03", to: "node-05", quality: 0.74 },
  { from: "node-04", to: "node-06", quality: 0.85 },
  { from: "node-05", to: "node-06", quality: 0.69 },
  { from: "node-06", to: "spider", quality: 0.94 }
];

export const THREAT_ROUTES: Record<ThreatType, string[]> = {
  chainsaw: ["node-01", "node-03", "node-04", "node-06", "spider"],
  fire: ["node-05", "node-06", "spider"],
  smoke: ["node-05", "node-03", "node-04", "node-06", "spider"],
  gunshot: ["node-02", "node-03", "node-04", "node-06", "spider"],
  human: ["node-02", "node-03", "node-04", "node-06", "spider"],
  vehicle: ["node-01", "node-02", "node-03", "node-04", "node-06", "spider"]
};

export const DEMO_FLAGS: Record<ThreatType, MiniFlag> = {
  chainsaw: {
    nid: "node-01",
    t: "chainsaw",
    c: 0.91,
    lat: -2.8451,
    lng: -52.4142,
    ts: 1781385600
  },
  fire: {
    nid: "node-05",
    t: "fire",
    c: 0.86,
    lat: -2.879,
    lng: -52.389,
    ts: 1781385600
  },
  smoke: {
    nid: "node-05",
    t: "smoke",
    c: 0.79,
    lat: -2.879,
    lng: -52.389,
    ts: 1781385600
  },
  gunshot: {
    nid: "node-02",
    t: "gunshot",
    c: 0.93,
    lat: -2.825,
    lng: -52.466,
    ts: 1781385600
  },
  human: {
    nid: "node-02",
    t: "human",
    c: 0.74,
    lat: -2.825,
    lng: -52.466,
    ts: 1781385600
  },
  vehicle: {
    nid: "node-01",
    t: "vehicle",
    c: 0.76,
    lat: -2.865,
    lng: -52.455,
    ts: 1781385600
  }
};
