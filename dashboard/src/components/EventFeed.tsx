import { Flame } from "lucide-react";
import type { DemoEvent } from "../lib/demoState";

type EventFeedProps = {
  events: DemoEvent[];
};

export function EventFeed({ events }: EventFeedProps) {
  return (
    <section className="rail-panel">
      <div className="rail-heading">
        <h2>Live event feed</h2>
        <Flame size={18} />
      </div>
      {events.length === 0 ? (
        <p className="empty-state">Awaiting first mini flag from the territory.</p>
      ) : (
        <div className="event-stack">
          {events.map((event) => (
            <article className="event-card" key={event.id}>
              <div>
                <strong>Spider received</strong>
                <span>{event.threat_type}</span>
              </div>
              <p>
                {event.node_id} reported {Math.round(event.confidence * 100)}% confidence at{" "}
                {event.lat.toFixed(4)}, {event.lng.toFixed(4)}.
              </p>
              <small>{event.severity} severity</small>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
