"use client";

import { useState } from "react";
import { STAGES } from "@/lib/site";

// Horizontal accordion: the open stage is wide, the rest are slivers.
// Order is carried by colour, dark to light. Vertical on phones.
export default function Stages() {
  const [open, setOpen] = useState(0);
  return (
    <div className="stages">
      {STAGES.map((s, i) => {
        const on = i === open;
        return (
          <div key={s.id} className="stage-panel" data-on={on ? "1" : undefined} style={{ "--tone": `var(--tone-${i + 1})` }}>
            <h3 className="stage-h">
              <button
                type="button"
                className="stage-btn"
                aria-expanded={on}
                aria-controls={`stage-${s.id}`}
                onClick={() => setOpen(i)}
              >
                {s.title}
              </button>
            </h3>
            <div id={`stage-${s.id}`} className="stage-body" hidden={!on}>
              <p>{s.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
