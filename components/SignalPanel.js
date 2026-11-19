"use client";

import { useState } from "react";
import { PAYLOAD_BYTES, SENSITIVITY, SFS, airtimeMs, rangeFactor, uplinksPerHour } from "@/lib/lora";

// Illustrative site on the plate: a gateway and six nodes at rising distances.
const NODES = [
  [62, 200],
  [100, 320],
  [134, 40],
  [168, 128],
  [204, 252],
  [246, 12],
].map(([r, deg]) => {
  const a = (deg * Math.PI) / 180;
  return { r, x: 300 + r * Math.cos(a), y: 300 + r * Math.sin(a) };
});
const R7 = 72;

/**
 * The live thing, set as a datasheet spread: a square plate with the site
 * drawn on it, and a characteristics table that changes with the spreading
 * factor picked on the tabs. Figures follow the SX1276 datasheet formulas.
 */
export default function SignalPanel() {
  const [sf, setSf] = useState(9);
  const ms = airtimeMs(sf);
  const range = R7 * rangeFactor(sf) ** 0.72;
  const reach = NODES.filter((n) => n.r <= range).length;
  const period = 1.1 + (ms / airtimeMs(12)) * 2.6;

  const onKey = (e) => {
    const i = SFS.indexOf(sf);
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setSf(SFS[Math.min(SFS.length - 1, i + 1)]);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setSf(SFS[Math.max(0, i - 1)]);
    }
  };

  return (
    <div className="spread">
      <figure className="plate" data-reveal>
        <svg viewBox="0 0 600 600" role="img" aria-label={`At SF${sf}, ${reach} of ${NODES.length} nodes reach the gateway`}>
          <circle className="plate-range" cx="300" cy="300" r={range} />
          <circle key={`a${sf}`} className="plate-pulse" cx="300" cy="300" r={range} style={{ animationDuration: `${period}s` }} />
          <circle
            key={`b${sf}`}
            className="plate-pulse"
            cx="300"
            cy="300"
            r={range}
            style={{ animationDuration: `${period}s`, animationDelay: `${period / 2}s` }}
          />
          {NODES.map((n, i) => (
            <g key={i} className={n.r <= range ? "plate-node on" : "plate-node"}>
              <rect x={n.x - 20} y={n.y - 14} width="40" height="28" />
              <rect className="ear" x={n.x - 27} y={n.y - 5} width="54" height="10" />
            </g>
          ))}
          <g className="plate-gw">
            <rect x="291" y="262" width="18" height="52" />
            <rect x="282" y="306" width="36" height="12" />
            <rect x="297" y="236" width="6" height="30" />
          </g>
        </svg>
        <figcaption>
          <span>
            {reach} of {NODES.length} nodes reach the gateway
          </span>
          <span>Site drawing, illustrative</span>
        </figcaption>
      </figure>

      <div className="spread-text">
        <div className="tabs" role="radiogroup" aria-label="Spreading factor" onKeyDown={onKey}>
          {SFS.map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={v === sf}
              tabIndex={v === sf ? 0 : -1}
              className="tab"
              onClick={() => setSf(v)}
            >
              SF{v}
            </button>
          ))}
        </div>

        <div className="spread-body" data-reveal>
          <h2 id="signal-title" className="h-section">
            Range, paid in airtime.
          </h2>
          <p className="spread-lede">
            Every LoRa design trades the same two things. A higher spreading factor reaches further and spends longer on
            air for each reading. Pick one and see what it costs.
          </p>
        </div>

        <table className="chars">
          <caption className="sr">Characteristics at SF{sf}</caption>
          <thead className="sr">
            <tr>
              <th scope="col">Parameter</th>
              <th scope="col">Value</th>
              <th scope="col">Unit</th>
            </tr>
          </thead>
          <tbody aria-live="polite">
            <tr>
              <th scope="row">Time on air, {PAYLOAD_BYTES}-byte uplink</th>
              <td>{ms < 100 ? ms.toFixed(1) : Math.round(ms)}</td>
              <td>ms</td>
            </tr>
            <tr>
              <th scope="row">Receiver sensitivity</th>
              <td>{SENSITIVITY[sf]}</td>
              <td>dBm</td>
            </tr>
            <tr>
              <th scope="row">Uplinks an hour, 1% duty cycle</th>
              <td>{uplinksPerHour(sf)}</td>
              <td>/h</td>
            </tr>
            <tr>
              <th scope="row">Range against SF7, free space</th>
              <td>×{rangeFactor(sf).toFixed(1)}</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
        <p className="fine">125 kHz bandwidth, coding rate 4/5. Sensitivity from the SX1276 datasheet.</p>

        <div className="cells">
          <a className="cell-a cell-ink" href="#contact">
            Send us your distances
          </a>
          <a className="cell-a cell-tone" href="#hardware">
            Read the datasheet
          </a>
        </div>
      </div>
    </div>
  );
}
