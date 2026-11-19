import Motion from "@/components/Motion";
import Tour from "@/components/Tour";
import SignalPanel from "@/components/SignalPanel";
import Diagram from "@/components/Diagram";
import ContactForm from "@/components/ContactForm";
import { COMPANY, EMAIL, FAQ, LOCATION, NODE_PHOTO, PRODUCTS, SHORT_NAME, TRAVELER, TRAVELER_RESULT } from "@/lib/site";

function Mark({ size = 34 }) {
  // A lemniscate drawn like a PCB trace, with two vias.
  return (
    <svg viewBox="0 0 40 20" width={size} height={size / 2} aria-hidden="true" focusable="false">
      <path
        d="M20 10 C 14 2, 4 2, 4 10 S 14 18, 20 10 S 36 2, 36 10 S 26 18, 20 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <circle cx="4" cy="10" r="2.8" fill="currentColor" />
      <circle cx="36" cy="10" r="2.8" fill="currentColor" />
    </svg>
  );
}

const FIRMWARE = `void loop() {
  reading_t r = sensors_read();     // soil, air, battery
  lora_send(&r, sizeof r);          // 12 bytes, SF set by ADR
  if (ota_pending()) ota_apply();   // rolls back on a bad boot
  esp_deep_sleep(REPORT_INTERVAL);  // and back to sleep
}`;

// the email breaks once, before the @, when it is set as the footer headline
const [MAIL_USER, MAIL_HOST] = EMAIL.split("@");

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
          <a href="#hardware">Datasheet</a>
        </nav>
        <a href="#contact" className="btn btn-nav">
          Start a project
        </a>
      </header>

      <Motion />

      <main id="main">
        <Tour />

        {/* ------------------------------------------- characteristics spread */}
        <section className="signal" id="signal" data-ink="dark" aria-labelledby="signal-title">
          <SignalPanel />
        </section>

        {/* ------------------------------------------------ the build traveler */}
        <section className="process" id="process" data-ink="light" aria-labelledby="process-title">
          <div className="process-grid">
            <div className="process-head" data-reveal>
              <h2 id="process-title" className="h-section">
                Bench to field.
              </h2>
              <p className="body-l">
                Every node goes through the same stages, from a bare board on the bench to a site that looks after
                itself. This is the slip that travels with it.
              </p>
            </div>
            <div className="slip" data-reveal>
              <p className="slip-head">
                <span>Build traveler</span>
                <span>{PRODUCTS[0].code}</span>
              </p>
              {TRAVELER.map((g) => (
                <div key={g.where} className="slip-group">
                  <h3 className="slip-where">{g.where}</h3>
                  <ul>
                    {g.rows.map(([what, value]) => (
                      <li key={what} className="slip-row">
                        <span>{what}</span>
                        <span className="leader" aria-hidden="true" />
                        <span className="slip-val">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="slip-result">
                <span>{TRAVELER_RESULT[0]}</span>
                <span>{TRAVELER_RESULT[1]}</span>
              </p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- the datasheet */}
        <section className="hardware" id="hardware" data-ink="light" aria-labelledby="hardware-title">
          <div className="hardware-head" data-reveal>
            <h2 id="hardware-title" className="h-section">
              The datasheet.
            </h2>
            <p className="body-l">Four products, designed to work together, each documented the way we ship it.</p>
          </div>
          <div className="sheets">
            {PRODUCTS.map((p, i) => (
              <article key={p.id} className={`sheet sheet-${i + 1}`} style={{ "--n": i }} data-ink={i === 3 ? "light" : "dark"} aria-labelledby={`p-${p.id}`}>
                <header className="sheet-band">
                  <h3 id={`p-${p.id}`} className="sheet-name">
                    {p.name}
                  </h3>
                  <span className="sheet-code">{p.code}</span>
                </header>
                <div className="sheet-body">
                  <div className="sheet-text">
                    <p className="sheet-sum">{p.summary}</p>
                    <table className="spec">
                      <caption className="sr">{p.name} specifications</caption>
                      <tbody>
                        {p.specs.map(([k, v]) => (
                          <tr key={k}>
                            <th scope="row">{k}</th>
                            <td>{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="sheet-visual">
                    {p.visual === "photo" ? (
                      <picture>
                        <source srcSet={NODE_PHOTO.webp} type="image/webp" />
                        <img src={NODE_PHOTO.jpg} width={NODE_PHOTO.w} height={NODE_PHOTO.h} alt={NODE_PHOTO.alt} />
                      </picture>
                    ) : p.visual === "code" ? (
                      <pre className="code">
                        <code>{FIRMWARE}</code>
                      </pre>
                    ) : (
                      <Diagram kind={p.visual} />
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ notes */}
        <section className="faq" id="faq" data-ink="dark" aria-labelledby="faq-title">
          <div className="faq-grid">
            <h2 id="faq-title" className="faq-title" data-reveal>
              Questions, answered.
            </h2>
            <div className="faq-text" data-reveal>
              {FAQ.map((f) => (
                <p key={f.q} className="faq-p">
                  <strong>{f.q}</strong> {f.a}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- coupon */}
        <section className="contact" id="contact" data-ink="light" aria-labelledby="contact-title">
          <ContactForm />
        </section>
      </main>

      {/* ------------------------------------------------ the back cover */}
      <footer className="foot" id="footer" data-ink="dark">
        <div className="foot-top">
          <p className="foot-brand">
            <Mark size={40} />
            {SHORT_NAME}
          </p>
          <p>LoRa hardware and firmware</p>
          {/* TODO(client): confirm location. */}
          <p>{LOCATION}</p>
          <a href="#top" className="foot-up">
            Back to the top
          </a>
        </div>
        <a className="foot-mail" href={`mailto:${EMAIL}`}>
          <span>{MAIL_USER}</span>
          <span>@{MAIL_HOST}</span>
        </a>
        <div className="foot-meta">
          <nav aria-label="Footer">
            <a href="#inside">Inside</a>
            <a href="#signal">Signal</a>
            <a href="#process">Process</a>
            <a href="#hardware">Datasheet</a>
            <a href="#faq">Questions</a>
          </nav>
          <p>Signal figures follow the SX1276 datasheet.</p>
          <p>
            © {year} {COMPANY}
          </p>
        </div>
      </footer>
    </>
  );
}
