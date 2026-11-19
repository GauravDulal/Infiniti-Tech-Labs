"use client";

import { useState } from "react";
import { EMAIL } from "@/lib/site";

// No form backend: the bar composes an email with the visitor's answers.
export default function ContactForm() {
  const [name, setName] = useState("");
  const [what, setWhat] = useState("");

  const subject = `Site enquiry${name ? ` from ${name}` : ""}`;
  const body = `Hello Infiniti Tech Labs,\n\nWe need to measure: ${what || "(tell us what)"}\nThe site is: \nReadings needed every: \nPower on site: \n\n${name}`;
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <form
      className="bar"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = href;
      }}
    >
      <label className="cell">
        <span className="sr">Your name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
      </label>
      <label className="cell">
        <span className="sr">What should it measure?</span>
        <input value={what} onChange={(e) => setWhat(e.target.value)} placeholder="What should it measure?" />
      </label>
      <button className="cell cell-go" type="submit">
        Write to us
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.6" />
        </svg>
      </button>
      <p className="bar-note">
        Opens your email app with your answers filled in, or write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </form>
  );
}
