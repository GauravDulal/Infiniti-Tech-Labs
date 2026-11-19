// Functional block diagrams, drawn the way a datasheet draws them: filled
// blocks, labelled, with heavy arrows for the signal path. One per product
// that has no photograph yet.

const Arrow = ({ d }) => <path className="dg-arrow" d={d} markerEnd="url(#dg-head)" />;

function Block({ x, y, w, h, label, sub, tone = "ink" }) {
  return (
    <g className={`dg-block dg-${tone}`}>
      <rect x={x} y={y} width={w} height={h} />
      <text x={x + 18} y={y + 34} className="dg-label">
        {label}
      </text>
      {sub ? (
        <text x={x + 18} y={y + 58} className="dg-sub">
          {sub}
        </text>
      ) : null}
    </g>
  );
}

function Defs() {
  return (
    <defs>
      <marker id="dg-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 Z" className="dg-head" />
      </marker>
    </defs>
  );
}

export default function Diagram({ kind }) {
  if (kind === "gateway") {
    return (
      <svg
        className="diagram"
        viewBox="0 0 640 520"
        role="img"
        aria-label="Block diagram: antenna to LoRa concentrator to host processor, with local storage, out to Ethernet, Wi-Fi or cellular"
      >
        <Defs />
        <g className="dg-antenna">
          <rect x="52" y="70" width="10" height="90" />
          <rect x="34" y="150" width="46" height="14" />
        </g>
        <Arrow d="M80 190 L80 236" />
        <Block x={30} y={240} w={190} h={92} label="LoRa" sub="concentrator" tone="accent" />
        <Arrow d="M220 286 L262 286" />
        <Block x={266} y={240} w={170} h={92} label="Host CPU" sub="Linux" />
        <Arrow d="M351 332 L351 378" />
        <Block x={266} y={382} w={170} h={92} label="Local store" sub="buffer" tone="tone" />
        <Arrow d="M436 286 L478 286" />
        <Block x={482} y={150} w={130} h={74} label="Ethernet" tone="tone" />
        <Block x={482} y={250} w={130} h={74} label="Wi-Fi" tone="tone" />
        <Block x={482} y={350} w={130} h={74} label="Cellular" tone="tone" />
      </svg>
    );
  }
  if (kind === "io") {
    return (
      <svg
        className="diagram"
        viewBox="0 0 640 520"
        role="img"
        aria-label="Block diagram: digital and analog inputs into a microcontroller with a LoRa radio, driving relay outputs"
      >
        <Defs />
        <Block x={30} y={120} w={160} h={92} label="Digital in" sub="contacts" tone="tone" />
        <Block x={30} y={306} w={160} h={92} label="Analog in" sub="4–20 mA, 0–10 V" tone="tone" />
        <Arrow d="M190 166 L238 228" />
        <Arrow d="M190 352 L238 292" />
        <Block x={242} y={214} w={160} h={92} label="MCU" sub="local rules" />
        <Arrow d="M322 214 L322 150" />
        <Block x={242} y={56} w={160} h={92} label="LoRa" sub="downlink" tone="accent" />
        <Arrow d="M402 260 L446 260" />
        <Block x={450} y={120} w={160} h={74} label="Relay" sub="pump" tone="tone" />
        <Block x={450} y={223} w={160} h={74} label="Relay" sub="fan" tone="tone" />
        <Block x={450} y={326} w={160} h={74} label="Relay" sub="alarm" tone="tone" />
      </svg>
    );
  }
  return null;
}
