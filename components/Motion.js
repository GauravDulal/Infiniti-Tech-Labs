"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Page-wide motion: smooth scroll, staggered entrances, and the header taking
// the ink of the chapter beneath it.
export default function Motion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    // footage holds its poster frame when the visitor asks for less motion
    if (reduced) document.querySelectorAll("video[autoplay]").forEach((v) => v.pause());

    // --- smooth scroll ---------------------------------------------------------
    let lenis = null;
    let raf = 0;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      const loop = (t) => {
        lenis.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      const el = id.length > 1 && document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { duration: 1.4 });
      else el.scrollIntoView();
      history.replaceState(null, "", id);
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    // --- entrances: each group's children rise in turn, once ------------------
    const groups = document.querySelectorAll("[data-reveal]");
    groups.forEach((g) => {
      [...g.children].forEach((c, i) => c.style.setProperty("--i", i));
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    groups.forEach((g) => io.observe(g));

    // --- header ink follows the chapter under it --------------------------------
    const header = document.querySelector(".nav");
    const chapters = [...document.querySelectorAll("[data-ink]")];
    let lastInk = "";
    let ticking = false;
    const probe = () => {
      ticking = false;
      const y = 36;
      // the last match is the innermost (a product sheet inside its section), or the topmost sheet
      let ink = null;
      for (const c of chapters) {
        const r = c.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) ink = c.dataset.ink;
      }
      if (ink && ink !== lastInk) {
        lastInk = ink;
        header.dataset.ink = ink;
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(probe);
      }
    };
    probe();
    window.addEventListener("scroll", onScroll, { passive: true });
    root.classList.add("motion-ready");

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      io.disconnect();
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
