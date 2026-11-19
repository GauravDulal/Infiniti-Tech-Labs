// Single source of truth for client-supplied copy.
// Every value marked TODO must be confirmed or replaced by Infiniti Tech Labs
// before launch. Nothing here is a certification, customer or measured metric.

export const COMPANY = "Infiniti Tech Labs Pvt Ltd";
export const SHORT_NAME = "Infiniti Tech Labs";

// TODO(client): replace with the real contact address.
export const EMAIL = "hello@example.com";

// TODO(client): replace with the real city / region.
export const LOCATION = "Location to be confirmed";

// The one real photograph the opening chapter is built from.
export const NODE_PHOTO = {
  jpg: "/media/node-open.jpg",
  webp: "/media/node-open.webp",
  w: 1116,
  h: 1146,
  alt: "An open field enclosure held in a hand: a blue LoRa module with a u.FL pigtail to the antenna, above an ESP32 board on perfboard",
};

// Beats of the opening chapter; `at` is the scroll fraction where each takes
// over. The 3D stage (components/three/stage.js) moves on the same fractions.
export const BEATS = [
  { at: 0, title: "Sealed", text: "A grey ABS field enclosure with flanged mounting ears, closed the way it ships." },
  { at: 0.1, title: "Four screws", text: "Pan-head screws hold the lid down on its seal. They come out first." },
  { at: 0.2, title: "Lid off", text: "Everything the node needs sits on one perfboard inside the box." },
  { at: 0.34, title: "The antenna", text: "A stub antenna on an SMA bulkhead through the end wall, so the boards stay sealed in." },
  { at: 0.46, title: "The LoRa radio", text: "A sub-GHz LoRa module on its breakout. A u.FL coax loops round it to the bulkhead." },
  { at: 0.6, title: "The ESP32", text: "The controller reads the sensors, keeps time and sleeps between readings to save the battery." },
  { at: 0.74, title: "Every layer", text: "Lid, radio, controller, board, wiring. We design each layer and build the whole node." },
  { at: 0.88, title: "Closed, and online", text: "Screws back in, status light blinking. It is ready for the site." },
];

// The build traveler: the stages a node passes through, grouped where they
// happen. Each row is what is done (left) and what it leaves behind (right).
export const TRAVELER = [
  {
    where: "At the bench",
    rows: [
      ["Flash the firmware", "Own ID and keys"],
      ["Bench test, every board", "Test log kept"],
      ["Seal the enclosure", "Gasket, four screws"],
    ],
  },
  {
    where: "On site",
    rows: [
      ["Mount and join the network", "Join accepted"],
      ["Settle the data rate", "SF set by distance"],
    ],
  },
  {
    where: "In service",
    rows: [
      ["Stream readings", "Gaps flagged, not hidden"],
      ["Act on thresholds", "Relays and alerts"],
      ["Update over the air", "Rolls back if it fails"],
    ],
  },
];
export const TRAVELER_RESULT = ["A node that reports on its own", "Nobody drives out"];

// TODO(client): supply real model names and specs. Values here are descriptive.
export const PRODUCTS = [
  {
    id: "node",
    code: "ITL-FN", // TODO(client): real part numbers
    visual: "photo",
    name: "LoRa field node",
    summary:
      "A sealed enclosure carrying a LoRa radio and an ESP32 controller. It wakes, measures, transmits and sleeps, so it can run on a battery for long periods.",
    specs: [
      ["Radio", "LoRa, sub-GHz"],
      ["Controller", "ESP32 family"],
      ["Power", "Battery or external supply"],
    ],
  },
  {
    id: "gateway",
    code: "ITL-GW",
    visual: "gateway",
    name: "Site gateway",
    summary:
      "Collects uplinks from every node on a site and forwards them over Ethernet, Wi-Fi or cellular. When the backhaul drops, it keeps the data and sends it later.",
    specs: [
      ["Radio", "LoRa concentrator"],
      ["Backhaul", "Ethernet, Wi-Fi or cellular"],
      ["Buffering", "Store and forward"],
    ],
  },
  {
    id: "io",
    code: "ITL-IO",
    visual: "io",
    name: "Relay and I/O board",
    summary:
      "Closes the loop on site. Relay outputs and digital inputs switch pumps, fans and alarms when a threshold is crossed, on the device or from the cloud.",
    specs: [
      ["Outputs", "Relay channels"],
      ["Inputs", "Digital and analog"],
      ["Control", "Local rules or downlink"],
    ],
  },
  {
    id: "firmware",
    code: "ITL-FW",
    visual: "code",
    name: "Custom firmware",
    summary:
      "Written for your sensors and your duty cycle: drivers, power budgeting, secure provisioning and over-the-air updates that roll back if a release fails.",
    specs: [
      ["Targets", "ESP32 family, others on request"],
      ["Updates", "Over the air, with rollback"],
      ["Security", "Per-device keys"],
    ],
  },
];

export const FAQ = [
  {
    q: "What do you need from us to start?",
    a: "What you want to measure, where the site is, how often you need a reading and what power is available there. A few photos of the site are worth sending too.",
  },
  {
    q: "Can you use the sensors we already have?",
    a: "Usually, if they speak analog, I²C, SPI, RS-485 or Modbus, or give a pulse output. Send the part numbers and we will confirm before quoting.",
  },
  {
    q: "How long will the battery last?",
    a: "It depends on how often the node reports, the spreading factor it needs and the sensors it powers. We size the battery from your reporting interval and show you the calculation, not a headline figure.",
  },
  {
    q: "Which LoRa band do you build for?",
    a: "The one your country allows, such as IN865, EU868 or US915. The radio, antenna and duty-cycle limits in the firmware are set to match.",
  },
  {
    q: "Who owns the firmware?",
    // TODO(client): confirm handover terms.
    a: "Source handover and licence terms are agreed per project before work starts. Tell us what you need and it goes in the quote.",
  },
  {
    q: "Can we start with a few units?",
    // TODO(client): confirm pilot policy.
    a: "Yes. A pilot of a handful of nodes on one site is the usual way to start, before anything is built in quantity.",
  },
  {
    q: "What if the site has no mobile signal?",
    a: "LoRa does not need it. Nodes talk to a gateway on site, and only the gateway needs a way out: Ethernet, Wi-Fi or cellular, wherever one of them reaches.",
  },
  {
    q: "Do you build the enclosure too?",
    // TODO(client): confirm enclosure work.
    a: "We choose and machine the enclosure, fit the bulkheads and glands, and seal the boards in. The node arrives ready to mount.",
  },
  {
    q: "Where does the data go?",
    a: "Wherever you need it: your own server, a cloud platform, or a simple dashboard we set up. The gateway forwards readings in a standard format.",
  },
];
