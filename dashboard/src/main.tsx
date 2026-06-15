import "leaflet/dist/leaflet.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const autoStart = new URLSearchParams(window.location.search).get("autorun") === "1";

createRoot(document.getElementById("root") as HTMLElement).render(<App autoStart={autoStart} />);
