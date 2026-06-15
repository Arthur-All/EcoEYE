import { FileCheck2 } from "lucide-react";
import type { EvidenceStatus, MiniFlag } from "../lib/demoState";

type EvidenceStripProps = {
  evidence: EvidenceStatus;
  lastFlag: MiniFlag;
};

export function EvidenceStrip({ evidence, lastFlag }: EvidenceStripProps) {
  return (
    <section className="evidence-strip" aria-label="EcoProof evidence status">
      <div className="evidence-title">
        <FileCheck2 size={18} />
        <strong>EcoProof</strong>
      </div>
      <span>{evidence.status}</span>
      <span>{evidence.chain_of_custody}</span>
      <span>
        {lastFlag.nid} / {lastFlag.t} / {Math.round(lastFlag.c * 100)}%
      </span>
    </section>
  );
}
