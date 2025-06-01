import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Simulator } from "./runner/Simulator";
import "./app.css";

function getViewboxDimensions() {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  console.log(vh, vw)
  return { vw, vh };
}

async function main() {
  let { vw, vh } = getViewboxDimensions();
  const sim = await Simulator.create(vw, vh);
  sim.start();

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App sim={sim} />
    </React.StrictMode>
  );
}

main();