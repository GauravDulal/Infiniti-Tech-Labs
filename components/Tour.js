"use client";

import { useEffect, useRef, useState } from "react";
import { BEATS, SHORT_NAME } from "@/lib/site";

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (x) => x * x * (3 - 2 * x);
const seg = (v, a, b) => smooth(clamp((v - a) / (b - a)));

/**
 * The first screen and the opening chapter as one pinned scene. The 3D node
 * on the right is driven by scroll (screws out, lid off, the radio and the
 * controller lift, every layer apart, then it closes again); the words on the
 * left hand over from the headline to a caption per beat.
 */
export default function Tour() {
  const section = useRef(null);
  const canvas = useRef(null);
  const intro = useRef(null);
  const chapter = useRef(null);
  const [beat, setBeat] = useState(0);
  const [failed, setFailed] = useState(false);

  // the 3D stage, loaded only in the browser
  useEffect(() => {
    let dispose = null;
    let cancelled = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    import("./three/stage")
      .then(({ initStage }) => initStage(canvas.current, section.current, { reduced }))
      .then((d) => {
        if (cancelled) d?.();
        else dispose = d;
      })
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  // words: headline hands over to the captions, one caption per beat
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const el = section.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const p = clamp(-r.top / (r.height - vh));
      let i = 0;
      BEATS.forEach((b, k) => {
        if (p >= b.at) i = k;
      });
      if (i !== last) {
        last = i;
        setBeat(i);
      }
      const k = seg(p, 0.03, 0.1);
      intro.current.style.opacity = String(1 - k);
      intro.current.style.transform = `translateY(${(-40 * k).toFixed(1)}px)`;
      intro.current.style.visibility = k > 0.99 ? "hidden" : "visible";
      chapter.current.style.opacity = String(k);
      chapter.current.style.transform = `translateY(${(30 * (1 - k)).toFixed(1)}px)`;
      chapter.current.style.visibility = k > 0.01 ? "visible" : "hidden";
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="tour" id="top" ref={section} data-ink="light" aria-labelledby="hero-title">
      <span id="inside" className="anchor" aria-hidden="true" />
      <div className="tour-pin">
        <div className="tour-stage" data-failed={failed ? "1" : undefined}>
          <canvas ref={canvas} aria-hidden="true" />
        </div>

        <div className="tour-text">
          <div className="tour-intro" ref={intro}>
            <h1 id="hero-title" className="display">
              <span className="sr">{SHORT_NAME}: </span>
              Built to be left.
            </h1>
            <p className="lead">
              Infiniti Tech Labs designs LoRa sensor nodes, gateways and the ESP32 firmware that runs them, for sites
              nobody wants to drive out to.
            </p>
            <div className="intro-actions">
              <a href="#contact" className="btn btn-accent">
                Tell us about your site
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                  <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" />
                </svg>
              </a>
              <span className="scroll-cue">Scroll to open it</span>
            </div>
          </div>

          <div className="tour-chapter" ref={chapter}>
            <h2 className="h-section">Open the box.</h2>
            <ol className="beat-list">
              {BEATS.map((x, i) => (
                <li key={x.title} className="beat" data-on={i === beat ? "1" : undefined} aria-current={i === beat ? "step" : undefined}>
                  <h3 className="beat-title">{x.title}</h3>
                  <p className="beat-text">{x.text}</p>
                </li>
              ))}
            </ol>
            <div className="beat-track" aria-hidden="true">
              {BEATS.map((x, i) => (
                <span key={x.title} data-on={i <= beat ? "1" : undefined} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
