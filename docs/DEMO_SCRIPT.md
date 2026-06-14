# EcoEye MVP Demo Script

## Setup

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

For unattended booth screenshots or QA captures, open `http://127.0.0.1:5173/?autorun=1`.

## Five-Minute Flow

1. Open the dashboard and point to the territorial web: six donated-phone nodes plus the Spider gateway.
2. Click `Simulate detection`.
3. Describe Node-01 detecting a chainsaw signal and sending a tiny mini flag through the mesh.
4. Watch the route highlight toward the Spider.
5. Show `Spider received` in the event feed with the confidence and coordinates.
6. Show the alert log: WhatsApp for the community leader and SMS for IBAMA.
7. Show the EcoProof strip as the evidence handoff queue.
8. Close with: "Any donated smartphone becomes a guardian. The forest builds its own nervous system."

## Notes

- Twilio delivery is simulated unless Twilio environment variables are configured.
- The map uses Leaflet vector overlays and a local CSS terrain background, so it does not depend on remote map tiles for the hackathon demo.
- The Spider API keeps events in the response only; there is no database requirement for this proof of concept.
