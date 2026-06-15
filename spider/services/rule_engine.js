const BASE_RECIPIENTS = [
  {
    recipient_type: "community",
    channel: "whatsapp",
    recipient: "Community leader"
  },
  {
    recipient_type: "ibama",
    channel: "sms",
    recipient: "IBAMA regional"
  }
];

const ESCALATION_RECIPIENT = {
  recipient_type: "federal_police",
  channel: "whatsapp",
  recipient: "Federal Police liaison"
};

export function recipientsForThreat(threatType) {
  if (threatType === "human" || threatType === "gunshot") {
    return [...BASE_RECIPIENTS, ESCALATION_RECIPIENT];
  }

  return BASE_RECIPIENTS;
}
