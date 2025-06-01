import React, { useEffect, useRef, useState } from "react";
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from "react-sparklines";
import { Simulator } from "../runner/Simulator";
import "../app.css";

type MetricsPanelProps = { sim: Simulator };

const AVERAGE_WINDOW_MS = 3000, HISTORY_LENGTH = 100;

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ sim }) => {
  const [avgFps, setAvgFps] = useState(0), [history, setHistory] = useState<number[]>([]);
  const fpsBuffer = useRef<{ value: number; time: number }[]>([]);
  const lastAvgRef = useRef({ value: 0, time: performance.now() });
  const prevAvgRef = useRef({ value: 0, time: performance.now() });
  const lastUpdateRef = useRef(performance.now());

  useEffect(() => {
    sim.onFpsUpdate = (val: number) => {
      const now = performance.now();
      fpsBuffer.current.push({ value: val, time: now });
      fpsBuffer.current = fpsBuffer.current.filter(e => now - e.time <= AVERAGE_WINDOW_MS);
    };
  }, [sim]);

  useEffect(() => {
    let running = true;
    function avgUpdate() {
      if (!running) return;
      const now = performance.now();
      if (now - lastUpdateRef.current > 150) {
        fpsBuffer.current = fpsBuffer.current.filter(e => now - e.time <= AVERAGE_WINDOW_MS);
        const sum = fpsBuffer.current.reduce((acc, e) => acc + e.value, 0);
        const avg = fpsBuffer.current.length ? Math.round(sum / fpsBuffer.current.length) : 0;
        prevAvgRef.current = { ...lastAvgRef.current };
        lastAvgRef.current = { value: avg, time: now };
        setAvgFps(avg);
        lastUpdateRef.current = now;
      }
      requestAnimationFrame(avgUpdate);
    }
    let req = requestAnimationFrame(avgUpdate);
    return () => { running = false; if (req) cancelAnimationFrame(req); };
  }, []);

  useEffect(() => {
    let running = true;
    function animate() {
      if (!running) return;
      const now = performance.now();
      const { value: p, time: pt } = prevAvgRef.current, { value: l, time: lt } = lastAvgRef.current;
      let interp = l;
      if (lt !== pt) {
        const t = Math.min((now - lt) / (lt - pt), 1);
        interp = p + (l - p) * t;
      }
      setHistory(prev => {
        const next = [...prev, interp];
        return next.length > HISTORY_LENGTH ? next.slice(-HISTORY_LENGTH) : next;
      });
      requestAnimationFrame(animate);
    }
    let req = requestAnimationFrame(animate);
    return () => { running = false; if (req) cancelAnimationFrame(req); };
  }, []);

  return (
    <div className="metrics-panel">
      <Sparklines data={history} width={180} height={32} margin={4}>
        <SparklinesLine color="#2D9CDB" style={{ fill: "none" }} curve="basis" />
        <SparklinesReferenceLine type="custom" value={60} style={{ stroke: "#aaa", strokeDasharray: "2,2" }} />
      </Sparklines>
      <div className="metrics-panel__fps">
        {avgFps} FPS <span>(3s avg)</span>
      </div>
    </div>
  );
};