import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.js'
import { Simulator } from './runner/Simulator.js';

let { vw, vh } = getViewboxDimensions();
const sim = await Simulator.create(vw, vh);
sim.start();

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App
        sim={sim}
      />
    </StrictMode>,
  );
}

function getViewboxDimensions() {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) - 350;
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  return { vw, vh }
}