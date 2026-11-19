"use client";

import { useState } from "react";
import { EMAIL } from "@/lib/site";

/**
 * The enquiry as a coupon to clip out. No form backend: sending composes an
 * email with the visitor's answers filled in.
 */
export default function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", what: "", where: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const subject = `Site enquiry${f.name ? ` from ${f.name}` : ""}`;
  const body = [
    "Hello Infiniti Tech Labs,",
    "",
    `We need to measure: ${f.what || "(tell us what)"}`,
    `The site is: ${f.where || "(where)"}`,
    "Readings needed every: ",
    "Power on site: ",
    "",
    [f.name, f.email].filter(Boolean).join(", "),
  ].join("\n");
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="coupon" data-reveal>
      <div className="coupon-stub">
        <h2 id="contact-title" className="coupon-title">
          Tell us about your site.
        </h2>
        <p>
          Sending opens your email with these answers filled in. We reply with a board, an enclosure and the firmware to
          run it.
        </p>
      </div>
      <form
        className="coupon-form"
        onSubmit={(e) => {
          e.preventDefault();
          window.location.href = href;
        }}
      >
        <label>
          <span className="sr">Your name</span>
          <input value={f.name} onChange={set("name")} placeholder="Your name" autoComplete="name" />
        </label>
        <label>
          <span className="sr">Your email</span>
          <input type="email" value={f.email} onChange={set("email")} placeholder="Your email" autoComplete="email" />
        </label>
        <label>
          <span className="sr">What should it measure?</span>
          <input value={f.what} onChange={set("what")} placeholder="What should it measure?" />
        </label>
        <label>
          <span className="sr">Where is the site?</span>
          <input value={f.where} onChange={set("where")} placeholder="Where is the site?" />
        </label>
        <button type="submit" className="coupon-send">
          Send the enquiry
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
            <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.6" />
          </svg>
        </button>
      </form>
    </div>
  );
}
