import { CircleMarker, MapContainer, Polyline, Popup, Tooltip } from "react-leaflet";
import type { DemoEvent, DemoNode, MeshLink } from "../lib/demoState";

type WebMapProps = {
  nodes: DemoNode[];
  links: MeshLink[];
  route: DemoNode[];
  activeHop: number;
  events: DemoEvent[];
};

function pathForLink(nodesById: Map<string, DemoNode>, link: MeshLink): [number, number][] {
  const from = nodesById.get(link.from);
  const to = nodesById.get(link.to);

  if (!from || !to) {
    return [];
  }

  return [
    [from.lat, from.lng],
    [to.lat, to.lng]
  ];
}

function nodeColor(node: DemoNode) {
  if (node.status === "alert") {
    return "#d94343";
  }

  if (node.status === "spider") {
    return "#4e8ab8";
  }

  if (node.status === "relay") {
    return "#f0b429";
  }

  return "#76b58b";
}

export function WebMap({ nodes, links, route, activeHop, events }: WebMapProps) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const activeRoute = route.slice(0, activeHop + 1);
  const latestEvent = events[0];

  return (
    <div className="map-frame">
      <MapContainer
        center={[-2.84, -52.395]}
        zoom={11}
        zoomControl={false}
        attributionControl={false}
        className="territory-map"
      >
        {links.map((link) => {
          const path = pathForLink(nodesById, link);
          if (path.length === 0) {
            return null;
          }

          return (
            <Polyline
              key={`${link.from}-${link.to}`}
              positions={path}
              pathOptions={{
                color: "#76b58b",
                weight: 2,
                opacity: 0.5
              }}
            />
          );
        })}

        {activeRoute.slice(0, -1).map((node, index) => {
          const next = activeRoute[index + 1];
          return (
            <Polyline
              key={`active-${node.id}-${next.id}`}
              positions={[
                [node.lat, node.lng],
                [next.lat, next.lng]
              ]}
              pathOptions={{
                color: "#f0b429",
                weight: 5,
                opacity: 0.95
              }}
            />
          );
        })}

        {nodes.map((node) => (
          <CircleMarker
            key={node.id}
            center={[node.lat, node.lng]}
            radius={node.id === "spider" ? 13 : 9}
            pathOptions={{
              color: "#f5f8f2",
              fillColor: nodeColor(node),
              fillOpacity: 0.95,
              weight: node.id === route[activeHop]?.id ? 4 : 2
            }}
          >
            <Tooltip permanent direction="top" offset={[0, -8]}>
              {node.label}
            </Tooltip>
            <Popup>
              <strong>{node.label}</strong>
              <br />
              {node.role}
            </Popup>
          </CircleMarker>
        ))}

        {latestEvent ? (
          <CircleMarker
            center={[latestEvent.lat, latestEvent.lng]}
            radius={16}
            pathOptions={{
              color: "#d94343",
              fillColor: "#d94343",
              fillOpacity: 0.24,
              weight: 3
            }}
          >
            <Tooltip permanent direction="right">
              {latestEvent.threat_type} {Math.round(latestEvent.confidence * 100)}%
            </Tooltip>
          </CircleMarker>
        ) : null}
      </MapContainer>
      <div className="map-watermark">Forest mesh view</div>
    </div>
  );
}
