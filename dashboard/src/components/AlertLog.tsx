import { MessageSquareText } from "lucide-react";
import type { AlertLog as AlertLogEntry } from "../lib/demoState";

type AlertLogProps = {
  alertLogs: AlertLogEntry[];
};

function channelLabel(channel: AlertLogEntry["channel"]) {
  return channel === "whatsapp" ? "WhatsApp" : "SMS";
}

export function AlertLog({ alertLogs }: AlertLogProps) {
  return (
    <section className="rail-panel">
      <div className="rail-heading">
        <h2>Alert log</h2>
        <MessageSquareText size={18} />
      </div>
      {alertLogs.length === 0 ? (
        <p className="empty-state">No community or agency alerts sent yet.</p>
      ) : (
        <div className="alert-stack">
          {alertLogs.map((log) => (
            <article className="alert-card" key={log.id}>
              <div>
                <strong>
                  {channelLabel(log.channel)} {log.status}
                </strong>
                <span>{log.recipient}</span>
              </div>
              <p>{log.body}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
