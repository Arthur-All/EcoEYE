import twilio from "twilio";
import { recipientsForThreat } from "./rule_engine.js";

const CHANNEL_ENV = {
  whatsapp: {
    from: "TWILIO_FROM_WHATSAPP",
    to: "TWILIO_TO_WHATSAPP"
  },
  sms: {
    from: "TWILIO_FROM_SMS",
    to: "TWILIO_TO_SMS"
  }
};

function coordinatesFor(event) {
  return `${event.lat}, ${event.lng}`;
}

function getTwilioClient(env, twilioClient) {
  if (twilioClient) {
    return twilioClient;
  }

  if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
    return twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  }

  return null;
}

export function buildAlertMessages(event) {
  return recipientsForThreat(event.threat_type).map((recipient) => ({
    ...recipient,
    event_id: event.id,
    body:
      `EcoEye alert: ${event.threat_type} detected by ${event.node_id} ` +
      `(${Math.round(event.confidence * 100)}% confidence) at ${coordinatesFor(event)}. ` +
      `Severity: ${event.severity}.`
  }));
}

export async function sendAlerts(event, options = {}) {
  const env = options.env ?? process.env;
  const client = getTwilioClient(env, options.twilioClient);
  const messages = buildAlertMessages(event);

  const logs = [];

  for (const [index, message] of messages.entries()) {
    const channelEnv = CHANNEL_ENV[message.channel];
    const from = channelEnv ? env[channelEnv.from] : undefined;
    const to = channelEnv ? env[channelEnv.to] : undefined;

    if (client && from && to) {
      const result = await client.messages.create({
        from,
        to,
        body: message.body
      });

      logs.push({
        id: `alert-${event.id}-${index + 1}`,
        event_id: event.id,
        recipient_type: message.recipient_type,
        channel: message.channel,
        recipient: message.recipient,
        status: "sent",
        provider_id: result.sid,
        body: message.body,
        sent_at: new Date().toISOString()
      });
      continue;
    }

    logs.push({
      id: `alert-${event.id}-${index + 1}`,
      event_id: event.id,
      recipient_type: message.recipient_type,
      channel: message.channel,
      recipient: message.recipient,
      status: "simulated",
      body: message.body,
      sent_at: new Date().toISOString()
    });
  }

  return logs;
}
