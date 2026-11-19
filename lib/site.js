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

export const STAGES = [
  {
    id: "provision",
    title: "Provision",
    body: "Each board is flashed at the bench with its own identity and keys, tested and logged before it is sealed into an enclosure.",
  },
  {
    id: "connect",
    title: "Connect",
    body: "Installed on site, the node joins the network and settles on a data rate that suits its distance from the gateway.",
  },
  {
    id: "stream",
    title: "Stream",
    body: "Readings go out as small packets. Gateways forward them, and missed packets are flagged rather than hidden.",
  },
  {
    id: "act",
    title: "Act",
    body: "Thresholds switch relays, raise alerts and wake pumps, so the site responds without anyone driving out to it.",
  },
  {
    id: "update",
    title: "Update",
    body: "New firmware goes out over the air in small blocks. A node that fails to boot the new image rolls back to the last good one.",
  },
];

// TODO(client): supply real model names and specs. Values here are descriptive.
export const PRODUCTS = [
  {
    id: "node",
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
];
