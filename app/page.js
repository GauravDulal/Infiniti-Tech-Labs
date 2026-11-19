import Motion from "@/components/Motion";
import Tour from "@/components/Tour";
import SignalPanel from "@/components/SignalPanel";
import Stages from "@/components/Stages";
import ContactForm from "@/components/ContactForm";
import { COMPANY, EMAIL, FAQ, LOCATION, NODE_PHOTO, PRODUCTS, SHORT_NAME } from "@/lib/site";

function Mark({ size = 34 }) {
  // A lemniscate drawn like a PCB trace, with two vias.
  return (
    <svg viewBox="0 0 40 20" width={size} height={size / 2} aria-hidden="true" focusable="false">
      <path
        d="M20 10 C 14 2, 4 2, 4 10 S 14 18, 20 10 S 36 2, 36 10 S 26 18, 20 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="4" cy="10" r="2.6" fill="currentColor" />
      <circle cx="36" cy="10" r="2.6" fill="currentColor" />
    </svg>
  );
}

const FIRMWARE = `void loop() {
  reading_t r = sensors_read();     // soil, air, battery
  lora_send(&r, sizeof r);          // 12 bytes, SF set by ADR
  if (ota_pending()) ota_apply();   // rolls back on a bad boot
  esp_deep_sleep(REPORT_INTERVAL);  // and back to sleep
}`;

export default function Home() {
  const year = new Date().getFullYear();
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="nav" data-ink="light">
        <a href="#top" className="brand" aria-label={`${SHORT_NAME}, back to top`}>
          <Mark />
          <span>{SHORT_NAME}</span>
        </a>
        <nav aria-label="Primary" className="nav-links">
          <a href="#inside">Inside</a>
          <a href="#signal">Signal</a>
          <a href="#process">Process</a>
          <a href="#hardware">Hardware</a>
        </nav>
        <a href="#contact" className="btn btn-nav">
          Start a project
        </a>
      </header>

      <Motion />

      <main id="main">
        <Tour />

        {/* -------------------------------------------------------- signal */}
        <section className="signal" id="signal" data-ink="dark" aria-labelledby="signal-title">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <h2 id="signal-title" className="h-section">
                Then it talks.
              </h2>
              <p className="body-l">
                On site, each node wakes, sends a reading to the gateway and sleeps. Pick a spreading factor to see the
                trade every LoRa design makes: more reach costs more time on air.
              </p>
            </div>
            <SignalPanel />
          </div>
        </section>

        {/* ------------------------------------------------------- process */}
        <section className="process" id="process" data-ink="light" aria-labelledby="process-title">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <h2 id="process-title" className="h-section">
                Bench to field.
              </h2>
              <p className="body-l">
                One team takes a node from a flashed board to a site that looks after itself. Each stage is work we do,
                not a service we pass on.
              </p>
            </div>
            <Stages />
          </div>
        </section>

        {/* ------------------------------------------------------ hardware */}
        <section className="hardware" id="hardware" data-ink="dark" aria-labelledby="hardware-title">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <h2 id="hardware-title" className="h-section">
                What we build.
              </h2>
              <p className="body-l">Four things, designed to work together, and each one available on its own.</p>
            </div>
            <figure className="bench" data-reveal>
              <picture>
                <source srcSet={NODE_PHOTO.webp} type="image/webp" />
                <img src={NODE_PHOTO.jpg} width={NODE_PHOTO.w} height={NODE_PHOTO.h} alt={NODE_PHOTO.alt} />
              </picture>
              <figcaption>
                <h3 className="product-name">The real one, on the bench.</h3>
                <p>
                  The node you just took apart, with the lid off: a LoRa module and its coax loop above an ESP32
                  DevKit on perfboard, in the same grey enclosure.
                </p>
              </figcaption>
            </figure>
            <ul className="products">
              {PRODUCTS.map((p) => (
                <li key={p.id} className="product" data-reveal>
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-sum">{p.summary}</p>
                  <dl className="specs">
                    {p.specs.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                  {p.id === "firmware" ? (
                    <pre className="code">
                      <code>{FIRMWARE}</code>
                    </pre>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ----------------------------------------------------------- faq */}
        <section className="faq" id="faq" data-ink="dark" aria-labelledby="faq-title">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <h2 id="faq-title" className="h-section">
                Fair questions.
              </h2>
            </div>
            <div className="faq-list">
              {FAQ.map((f) => (
                <div key={f.q} className="faq-item" data-reveal>
                  <h3 className="faq-q">{f.q}</h3>
                  <p className="faq-a">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- contact */}
        <section className="contact" id="contact" data-ink="light" aria-labelledby="contact-title">
          <div className="wrap contact-grid">
            <div data-reveal>
              <h2 id="contact-title" className="h-section">
                Tell us about the site.
              </h2>
              <p className="body-l contact-lede">
                What you need to measure, where, and how often. We will come back with a board, an enclosure and the
                firmware to run it.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="foot" data-ink="light">
        <div className="wrap foot-grid">
          <p className="foot-word" aria-hidden="true">
            <Mark size={72} />
            Infiniti Tech Labs
          </p>
          <nav className="foot-nav" aria-label="Footer">
            <a href="#inside">Inside the node</a>
            <a href="#signal">Signal</a>
            <a href="#process">Process</a>
            <a href="#hardware">Hardware</a>
            <a href="#faq">Questions</a>
          </nav>
          <div className="foot-meta">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            {/* TODO(client): confirm location. */}
            <p>{LOCATION}</p>
            <p className="small">
              © {year} {COMPANY}. Signal figures follow the SX1276 datasheet.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
