"use client";

import { useState } from "react";
import { PAYLOAD_BYTES, SENSITIVITY, SFS, airtimeMs, rangeFactor, uplinksPerHour } from "@/lib/lora";

// Illustrative site: a gateway and six nodes at increasing distances.
const NODES = [
  [70, 205],
  [115, 325],
  [150, 40],
  [185, 120],
  [220, 255],
  [265, 15],
].map(([r, deg]) => {
  const a = (deg * Math.PI) / 180;
  return { r, x: 280 + r * Math.cos(a), y: 220 + r * Math.sin(a) * 0.62 };
});
const R7 = 80; // drawn radius at SF7

/**
 * The live thing: pick a spreading factor and see the trade every LoRa design
 * makes. Figures are computed (SX1276 datasheet formula); the site is drawn.
 */
export default function SignalPanel() {
  const [sf, setSf] = useState(9);
  const ms = airtimeMs(sf);
  const range = R7 * rangeFactor(sf) ** 0.75;
  const reach = NODES.filter((n) => n.r <= range).length;
  const period = 1.2 + (ms / airtimeMs(12)) * 2.4;

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
    <div className="signal-grid">
      <div className="signal-controls">
        <div className="sf-picker" role="radiogroup" aria-label="Spreading factor" onKeyDown={onKey}>
          {SFS.map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={v === sf}
              tabIndex={v === sf ? 0 : -1}
              className="sf"
              onClick={() => setSf(v)}
            >
              SF{v}
            </button>
          ))}
        </div>
        <dl className="readouts" aria-live="polite">
          <div>
            <dt>Time on air</dt>
            <dd>
              {ms < 100 ? ms.toFixed(1) : Math.round(ms)}
              <small> ms</small>
            </dd>
          </div>
          <div>
            <dt>Sensitivity</dt>
            <dd>
              {SENSITIVITY[sf]}
              <small> dBm</small>
            </dd>
          </div>
          <div>
            <dt>Uplinks an hour</dt>
            <dd>{uplinksPerHour(sf)}</dd>
          </div>
          <div>
            <dt>Range against SF7</dt>
            <dd>×{rangeFactor(sf).toFixed(1)}</dd>
          </div>
        </dl>
        <p className="fine">
          A {PAYLOAD_BYTES}-byte uplink at 125 kHz, coding rate 4/5. Sensitivity from the SX1276 datasheet; uplinks an
          hour under a 1% duty cycle; range is the free-space estimate. The site drawing is illustrative.
        </p>
      </div>

      <figure className="signal-fig">
        <svg viewBox="0 0 560 440" role="img" aria-label={`At SF${sf}, ${reach} of ${NODES.length} nodes reach the gateway`}>
          <ellipse className="range" cx="280" cy="220" rx={range} ry={range * 0.62} />
          <ellipse
            key={sf}
            className="pulse"
            cx="280"
            cy="220"
            rx={range}
            ry={range * 0.62}
            style={{ animationDuration: `${period}s` }}
          />
          {NODES.map((n, i) => (
            <rect
              key={i}
              className={n.r <= range ? "node node-on" : "node"}
              x={n.x - 9}
              y={n.y - 9}
              width="18"
              height="18"
            />
          ))}
          <path className="gw" d="M280 186 L292 222 L268 222 Z" />
          <circle className="gw" cx="280" cy="182" r="6" />
          <text x="280" y="246" textAnchor="middle" className="gw-label">
            Gateway
          </text>
        </svg>
        <figcaption>
          {reach} of {NODES.length} nodes in reach at SF{sf}
        </figcaption>
      </figure>
    </div>
  );
}
