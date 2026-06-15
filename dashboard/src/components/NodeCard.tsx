import { BatteryMedium, Signal } from "lucide-react";
import type { DemoNode } from "../lib/demoState";

type NodeCardProps = {
  node: DemoNode;
};

export function NodeCard({ node }: NodeCardProps) {
  return (
    <article className={`node-card node-${node.status}`}>
      <div>
        <strong>{node.label}</strong>
        <span>{node.role}</span>
      </div>
      <div className="node-metrics">
        <span>
          <Signal size={14} />
          {node.signal}%
        </span>
        <span>
          <BatteryMedium size={14} />
          {node.battery}%
        </span>
      </div>
    </article>
  );
}
