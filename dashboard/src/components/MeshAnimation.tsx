import { Radio } from "lucide-react";
import type { DemoNode, DemoPhase } from "../lib/demoState";

type MeshAnimationProps = {
  route: DemoNode[];
  activeHop: number;
  phase: DemoPhase;
};

export function MeshAnimation({ route, activeHop, phase }: MeshAnimationProps) {
  const received = phase === "spider-received";

  return (
    <section className="rail-panel">
      <div className="rail-heading">
        <h2>Mini flag route</h2>
        <Radio size={18} />
      </div>
      <ol className="route-list">
        {route.map((node, index) => (
          <li
            key={node.id}
            className={[
              index < activeHop ? "complete" : "",
              index === activeHop ? "active" : ""
            ].join(" ")}
          >
            <span className="route-dot" />
            <div>
              <strong>{node.label}</strong>
              <small>{node.role}</small>
            </div>
          </li>
        ))}
      </ol>
      <p className="route-status">
        {received ? "Spider has the mini flag" : "Mini flag is moving through relay phones"}
      </p>
    </section>
  );
}
