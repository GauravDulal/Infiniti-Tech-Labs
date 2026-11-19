// A procedural model of the client's real field node, matched to their bench
// photograph: a grey ABS enclosure with flanged mounting ears, a screw-down
// lid, a stub antenna on an SMA bulkhead, a dark green perfboard carrying a
// blue LoRa breakout (u.FL coax looped round it) and an ESP32 DevKit on
// header strips. Units: 1 = 50 mm. The box lies on its back, opening to +Y,
// long axis along Z, antenna end at -Z.
import * as THREE from "three";

export const W = 1.3; // 65 mm
export const L = 2.3; // 115 mm
export const H = 0.8; // 40 mm
const R = 0.12;
const WALL = 0.075;
const LID_T = 0.11;

// ---------------------------------------------------------------- helpers ---

function rr(w, d, r, PathType = THREE.Shape) {
  const s = new PathType();
  const x = -w / 2;
  const y = -d / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + d - r);
  s.absarc(x + w - r, y + d - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + d);
  s.absarc(x + r, y + d - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

function circle(cx, cy, r) {
  const p = new THREE.Path();
  p.absarc(cx, cy, r, 0, Math.PI * 2, true);
  return p;
}

// Extrude a shape up along +Y from y=0 (shape y maps to -Z).
function up(shape, depth, bevel = 0) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    curveSegments: 18,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
  });
  g.rotateX(-Math.PI / 2);
  if (bevel > 0) g.translate(0, bevel, 0);
  return g;
}

function tex(w, h, draw, srgb = true) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// WebGL cast and received shadows on 3D parts. taste-skill-ignore
const mark = (m) => {
  m.castShadow = true; // taste-skill-ignore: WebGL shadow
  m.receiveShadow = true; // taste-skill-ignore: WebGL shadow
  return m;
};

// --------------------------------------------------------------- textures ---

function grainTexture() {
  // fine moulded-plastic grain, used as a bump and roughness variation
  return tex(
    512,
    512,
    (g, w, h) => {
      const rand = rng(11);
      const img = g.createImageData(w, h);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 118 + rand() * 30;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
    },
    false
  );
}

function perfboardTexture() {
  return tex(1024, 2048, (g, w, h) => {
    g.fillStyle = "#33401f";
    g.fillRect(0, 0, w, h);
    const rand = rng(5);
    for (let i = 0; i < 9000; i++) {
      g.fillStyle = `rgba(0,0,0,${rand() * 0.06})`;
      g.fillRect(rand() * w, rand() * h, 3, 3);
    }
    const step = 32;
    for (let y = step / 2; y < h; y += step) {
      for (let x = step / 2; x < w; x += step) {
        g.fillStyle = "#9c7a3c";
        g.beginPath();
        g.arc(x, y, 9, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = "#0d0f0a";
        g.beginPath();
        g.arc(x, y, 4.5, 0, Math.PI * 2);
        g.fill();
      }
    }
  });
}

function devkitTexture() {
  return tex(2048, 1124, (g, w, h) => {
    g.fillStyle = "#141516";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#e8e8e4";
    g.font = "600 40px Arial, sans-serif";
    const left = ["3V3", "EN", "VP", "VN", "D34", "D35", "D32", "D33", "D25", "D26", "D27", "D14", "D12", "D13", "GND"];
    const right = ["VIN", "GND", "D15", "D2", "D4", "RX2", "TX2", "D5", "D18", "D19", "D21", "RX0", "TX0", "D22", "D23"];
    left.forEach((t, i) => g.fillText(t, 110 + i * 122, 200));
    right.forEach((t, i) => g.fillText(t, 110 + i * 122, h - 160));
    g.font = "600 46px Arial, sans-serif";
    g.fillText("ESP32 DEVKIT V1", 1180, 560);
    g.strokeStyle = "#e8e8e4";
    g.lineWidth = 5;
    g.strokeRect(1660, 640, 150, 150);
    g.fillText("BOOT", 1500, 880);
    g.fillText("EN", 1500, 330);
  });
}

function shieldTexture(lines, small) {
  return tex(1024, 1024, (g, w, h) => {
    g.fillStyle = "#c3c6c9";
    g.fillRect(0, 0, w, h);
    const rand = rng(9);
    for (let i = 0; i < 18000; i++) {
      g.fillStyle = `rgba(${rand() > 0.5 ? "255,255,255" : "0,0,0"},${rand() * 0.06})`;
      g.fillRect(rand() * w, rand() * h, 2, 2);
    }
    g.fillStyle = "#3c4045";
    g.font = "700 92px Arial, sans-serif";
    lines.forEach((t, i) => g.fillText(t, 70, 190 + i * 118));
    g.font = "500 54px Arial, sans-serif";
    small.forEach((t, i) => g.fillText(t, 70, h - 260 + i * 74));
    g.fillStyle = "#52575d";
    g.fillRect(w - 300, h - 300, 220, 220);
    g.fillStyle = "#c3c6c9";
    for (let i = 0; i < 100; i++) {
      if (rand() > 0.5) g.fillRect(w - 290 + (i % 10) * 20, h - 290 + Math.floor(i / 10) * 20, 18, 18);
    }
  });
}

function loraBoardTexture() {
  return tex(1024, 896, (g, w) => {
    g.fillStyle = "#1c4fae";
    g.fillRect(0, 0, w, 896);
    g.fillStyle = "#f1f1ee";
    g.font = "600 34px Arial, sans-serif";
    const pins = ["GND", "3V3", "RST", "DIO0", "DIO1", "DIO2", "DIO3", "GND"];
    const pins2 = ["GND", "DIO4", "DIO5", "SCK", "MISO", "MOSI", "NSS", "GND"];
    pins.forEach((t, i) => g.fillText(t, 22, 80 + i * 100));
    pins2.forEach((t, i) => g.fillText(t, w - 130, 80 + i * 100));
  });
}

// --------------------------------------------------------------- materials ---

export function makeMaterials() {
  const grain = grainTexture();
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  grain.repeat.set(3, 3);
  const abs = new THREE.MeshPhysicalMaterial({
    color: "#c7c9c4",
    roughness: 0.62,
    roughnessMap: grain,
    bumpMap: grain,
    bumpScale: 0.6,
    clearcoat: 0.08,
    clearcoatRoughness: 0.6,
    sheen: 0.15,
    sheenColor: new THREE.Color("#ffffff"),
  });
  const absInner = abs.clone();
  absInner.color = new THREE.Color("#b3b5b0");
  return {
    abs,
    absInner,
    steel: new THREE.MeshStandardMaterial({ color: "#c9ccd0", metalness: 1, roughness: 0.32 }),
    darkSteel: new THREE.MeshStandardMaterial({ color: "#55595e", metalness: 0.9, roughness: 0.45 }),
    gold: new THREE.MeshStandardMaterial({ color: "#d9b25a", metalness: 1, roughness: 0.28 }),
    brass: new THREE.MeshStandardMaterial({ color: "#c7a356", metalness: 1, roughness: 0.3 }),
    rubber: new THREE.MeshStandardMaterial({ color: "#151617", roughness: 0.78 }),
    coax: new THREE.MeshStandardMaterial({ color: "#121314", roughness: 0.42 }),
    header: new THREE.MeshStandardMaterial({ color: "#151515", roughness: 0.55 }),
    chip: new THREE.MeshStandardMaterial({ color: "#1b1c1d", roughness: 0.4 }),
    pcbEdgeBlack: new THREE.MeshStandardMaterial({ color: "#121314", roughness: 0.5 }),
    pcbEdgeBlue: new THREE.MeshStandardMaterial({ color: "#1a4aa6", roughness: 0.5 }),
    pcbEdgeGreen: new THREE.MeshStandardMaterial({ color: "#2e3a1c", roughness: 0.7 }),
    hole: new THREE.MeshStandardMaterial({ color: "#191a19", roughness: 0.9 }),
    ledRed: new THREE.MeshStandardMaterial({ color: "#550000", emissive: "#ff2a1a", emissiveIntensity: 2.2 }),
    ledBlue: new THREE.MeshStandardMaterial({ color: "#001044", emissive: "#2f7bff", emissiveIntensity: 0 }),
    wireRed: new THREE.MeshStandardMaterial({ color: "#b0221b", roughness: 0.45 }),
    wireBlack: new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.45 }),
    wireYellow: new THREE.MeshStandardMaterial({ color: "#d4a41c", roughness: 0.45 }),
    wireGreen: new THREE.MeshStandardMaterial({ color: "#2f7d3a", roughness: 0.45 }),
  };
}

// A row of square header pins along X, as one instanced mesh.
function pinRow(M, count, pitch, length) {
  const geo = new THREE.BoxGeometry(0.016, length, 0.016);
  const m = new THREE.InstancedMesh(geo, M.gold, count);
  const o = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    o.position.set((i - (count - 1) / 2) * pitch, 0, 0);
    o.updateMatrix();
    m.setMatrixAt(i, o.matrix);
  }
  m.castShadow = true; // taste-skill-ignore: WebGL shadow
  return m;
}

// ---------------------------------------------------------------- the node ---

export function buildEnclosure(M) {
  const root = new THREE.Group();
  const P = { root };

  // ----- base: floor, walls, corner bosses ----------------------------------
  root.add(mark(new THREE.Mesh(up(rr(W, L, R), 0.07, 0.015), M.abs)));
  const wall = rr(W, L, R);
  wall.holes.push(rr(W - WALL * 2, L - WALL * 2, R - WALL * 0.7, THREE.Path));
  root.add(mark(new THREE.Mesh(up(wall, H - 0.03, 0.015), M.abs)));
  const floorIn = new THREE.Mesh(up(rr(W - WALL * 2, L - WALL * 2, R - WALL), 0.004), M.absInner);
  floorIn.position.y = 0.088;
  floorIn.receiveShadow = true; // taste-skill-ignore: WebGL shadow
  root.add(floorIn);

  const corners = [
    [W / 2 - 0.13, L / 2 - 0.13],
    [-W / 2 + 0.13, L / 2 - 0.13],
    [W / 2 - 0.13, -L / 2 + 0.13],
    [-W / 2 + 0.13, -L / 2 + 0.13],
  ];
  const bossGeo = new THREE.CylinderGeometry(0.07, 0.08, H - 0.1, 24);
  const bossHole = new THREE.CircleGeometry(0.026, 18);
  for (const [x, z] of corners) {
    const b = mark(new THREE.Mesh(bossGeo, M.absInner));
    b.position.set(x, (H - 0.1) / 2 + 0.07, z);
    root.add(b);
    const h = new THREE.Mesh(bossHole, M.hole);
    h.rotation.x = -Math.PI / 2;
    h.position.set(x, H - 0.029, z);
    root.add(h);
  }

  // flanged mounting ears on both short ends, two holes each
  for (const sz of [-1, 1]) {
    const ear = new THREE.Shape();
    const ew = 0.95;
    const ed = 0.3;
    ear.moveTo(-ew / 2, 0);
    ear.lineTo(ew / 2, 0);
    ear.lineTo(ew / 2, ed - 0.08);
    ear.absarc(ew / 2 - 0.08, ed - 0.08, 0.08, 0, Math.PI / 2, false);
    ear.lineTo(-ew / 2 + 0.08, ed);
    ear.absarc(-ew / 2 + 0.08, ed - 0.08, 0.08, Math.PI / 2, Math.PI, false);
    ear.lineTo(-ew / 2, 0);
    ear.holes.push(circle(-0.27, 0.15, 0.055), circle(0.27, 0.15, 0.055));
    const m = mark(new THREE.Mesh(up(ear, 0.06, 0.01), M.abs));
    m.position.set(0, 0, sz * (L / 2 - 0.01));
    if (sz > 0) m.rotation.y = Math.PI;
    root.add(m);
  }

  // ----- lid (lifts off) -------------------------------------------------------
  const lid = new THREE.Group();
  lid.position.y = H + 0.004;
  root.add(lid);
  lid.add(mark(new THREE.Mesh(up(rr(W, L, R), LID_T - 0.05, 0.025), M.abs)));
  const lip = rr(W - WALL * 2.2, L - WALL * 2.2, R - 0.06);
  lip.holes.push(rr(W - WALL * 3.4, L - WALL * 3.4, R - 0.08, THREE.Path));
  const lipM = new THREE.Mesh(up(lip, 0.05), M.absInner);
  lipM.position.y = -0.05;
  lid.add(lipM);
  P.lid = lid;

  // ----- four pan-head screws -------------------------------------------------
  const headGeo = new THREE.LatheGeometry(
    [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.058, 0),
      new THREE.Vector2(0.058, 0.012),
      new THREE.Vector2(0.05, 0.03),
      new THREE.Vector2(0.03, 0.04),
      new THREE.Vector2(0, 0.043),
    ],
    28
  );
  const slotGeo = new THREE.BoxGeometry(0.07, 0.016, 0.014);
  const shaftGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 12);
  P.screws = corners.map(([x, z]) => {
    const s = new THREE.Group();
    s.add(mark(new THREE.Mesh(headGeo, M.steel)));
    for (const r of [0, Math.PI / 2]) {
      const sl = new THREE.Mesh(slotGeo, M.darkSteel);
      sl.position.y = 0.036;
      sl.rotation.y = r;
      s.add(sl);
    }
    const sh = new THREE.Mesh(shaftGeo, M.steel);
    sh.position.y = -0.25;
    s.add(sh);
    s.userData.home = new THREE.Vector3(x, H + LID_T + 0.004, z);
    s.position.copy(s.userData.home);
    root.add(s);
    return s;
  });

  // ----- SMA bulkhead + stub antenna on the -Z end wall ----------------------
  const ant = new THREE.Group();
  ant.position.set(0, H * 0.62, -L / 2);
  root.add(ant);
  const nutOut = mark(new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.05, 6), M.brass));
  nutOut.rotation.x = Math.PI / 2;
  nutOut.position.z = -0.03;
  ant.add(nutOut);
  const barrel = mark(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 20), M.gold));
  barrel.rotation.x = Math.PI / 2;
  barrel.position.z = -0.12;
  ant.add(barrel);
  const stub = new THREE.Group();
  stub.position.z = -0.2;
  stub.rotation.x = -Math.PI / 2 + 0.35; // points out along -Z, tipped up
  ant.add(stub);
  stub.add(
    mark(
      new THREE.Mesh(
        new THREE.LatheGeometry(
          [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.068, 0),
            new THREE.Vector2(0.07, 0.08),
            new THREE.Vector2(0.085, 0.14),
            new THREE.Vector2(0.088, 0.38),
            new THREE.Vector2(0.075, 0.47),
            new THREE.Vector2(0.04, 0.52),
            new THREE.Vector2(0, 0.535),
          ],
          32
        ),
        M.rubber
      )
    )
  );
  P.antenna = ant;

  const nutIn = mark(new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.04, 6), M.brass));
  nutIn.rotation.x = Math.PI / 2;
  nutIn.position.set(0, H * 0.62, -L / 2 + WALL + 0.02);
  root.add(nutIn);
  const smaIn = new THREE.Object3D();
  smaIn.position.set(0, H * 0.62, -L / 2 + WALL + 0.05);
  root.add(smaIn);

  // ----- perfboard -------------------------------------------------------------
  const board = new THREE.Group();
  board.position.y = 0.14;
  root.add(board);
  const BW = W - WALL * 2 - 0.06;
  const BL = L - WALL * 2 - 0.26;
  const pb = perfboardTexture();
  const perfTop = new THREE.MeshStandardMaterial({ map: pb, roughness: 0.75, bumpMap: pb, bumpScale: 0.8 });
  board.add(
    mark(
      new THREE.Mesh(new THREE.BoxGeometry(BW, 0.032, BL), [
        M.pcbEdgeGreen,
        M.pcbEdgeGreen,
        perfTop,
        M.pcbEdgeGreen,
        M.pcbEdgeGreen,
        M.pcbEdgeGreen,
      ])
    )
  );
  P.board = board;
  const top = 0.016;

  // ----- ESP32 DevKit on two header strips (long axis along X) ---------------
  const dk = new THREE.Group();
  dk.position.set(0, top, 0.5);
  board.add(dk);
  const DKL = 1.02;
  const DKW = 0.56;
  const HDR = 0.17;
  for (const sz of [-1, 1]) {
    const strip = mark(new THREE.Mesh(new THREE.BoxGeometry(DKL - 0.06, 0.05, 0.05), M.header));
    strip.position.set(0, 0.025, sz * (DKW / 2 - 0.05));
    dk.add(strip);
    const pinsDown = pinRow(M, 15, 0.0635, HDR);
    pinsDown.position.set(0, HDR / 2, sz * (DKW / 2 - 0.05));
    dk.add(pinsDown);
  }
  const dkPcb = new THREE.Group();
  dkPcb.position.y = HDR;
  dk.add(dkPcb);
  const dkTop = new THREE.MeshStandardMaterial({ map: devkitTexture(), roughness: 0.42 });
  dkPcb.add(
    mark(
      new THREE.Mesh(new THREE.BoxGeometry(DKL, 0.03, DKW), [
        M.pcbEdgeBlack,
        M.pcbEdgeBlack,
        dkTop,
        M.pcbEdgeBlack,
        M.pcbEdgeBlack,
        M.pcbEdgeBlack,
      ])
    )
  );
  const wroom = new THREE.Group();
  wroom.position.set(-0.2, 0.015, 0);
  dkPcb.add(wroom);
  wroom.add(mark(new THREE.Mesh(new THREE.BoxGeometry(0.51, 0.016, 0.36), M.pcbEdgeBlack)));
  const can = mark(
    new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.31), [
      M.steel,
      M.steel,
      new THREE.MeshStandardMaterial({
        map: shieldTexture(["ESP32-WROOM-32"], ["Wi-Fi + BLE", "MCU module"]),
        metalness: 0.85,
        roughness: 0.34,
      }),
      M.steel,
      M.steel,
      M.steel,
    ])
  );
  can.position.set(0.07, 0.033, 0);
  wroom.add(can);
  const meander = new THREE.Mesh(
    new THREE.PlaneGeometry(0.1, 0.3),
    new THREE.MeshStandardMaterial({
      map: tex(128, 384, (g, w, h) => {
        g.fillStyle = "#16181b";
        g.fillRect(0, 0, w, h);
        g.strokeStyle = "#c9a14a";
        g.lineWidth = 8;
        g.beginPath();
        g.moveTo(w - 12, 10);
        for (let i = 0; i < 7; i++) {
          const y = 20 + i * 50;
          g.lineTo(14, y);
          g.lineTo(14, y + 25);
          g.lineTo(w - 14, y + 25);
          g.lineTo(w - 14, y + 50);
        }
        g.stroke();
      }),
      roughness: 0.45,
    })
  );
  meander.rotation.x = -Math.PI / 2;
  meander.position.set(-0.2, 0.0085, 0);
  wroom.add(meander);
  const usb = mark(new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.055, 0.15), M.steel));
  usb.position.set(DKL / 2 - 0.05, 0.043, 0);
  dkPcb.add(usb);
  const btnBase = new THREE.BoxGeometry(0.075, 0.03, 0.075);
  const btnCap = new THREE.CylinderGeometry(0.02, 0.02, 0.02, 14);
  for (const sz of [-1, 1]) {
    const b = mark(new THREE.Mesh(btnBase, M.steel));
    b.position.set(DKL / 2 - 0.2, 0.03, sz * 0.18);
    dkPcb.add(b);
    const c = new THREE.Mesh(btnCap, M.chip);
    c.position.set(DKL / 2 - 0.2, 0.054, sz * 0.18);
    dkPcb.add(c);
  }
  const uart = mark(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.1), M.chip));
  uart.position.set(0.27, 0.025, 0.02);
  dkPcb.add(uart);
  const reg = mark(new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 0.06), M.chip));
  reg.position.set(0.14, 0.035, -0.17);
  dkPcb.add(reg);
  const tab = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.008, 0.04), M.steel);
  tab.position.set(0.14, 0.02, -0.215);
  dkPcb.add(tab);
  const ledGeo = new THREE.BoxGeometry(0.03, 0.015, 0.018);
  const ledR = new THREE.Mesh(ledGeo, M.ledRed);
  ledR.position.set(0.3, 0.022, -0.16);
  dkPcb.add(ledR);
  const ledB = new THREE.Mesh(ledGeo, M.ledBlue);
  ledB.position.set(0.3, 0.022, 0.16);
  dkPcb.add(ledB);
  for (const sz of [-1, 1]) {
    const pinsUp = pinRow(M, 15, 0.0635, 0.06);
    pinsUp.position.set(0, 0.03, sz * (DKW / 2 - 0.05));
    dkPcb.add(pinsUp);
  }
  P.devkit = dk;

  // ----- LoRa breakout (blue) carrying the radio module ----------------------
  const lo = new THREE.Group();
  lo.position.set(0, top, -0.28);
  board.add(lo);
  for (const sx of [-1, 1]) {
    const strip = mark(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.5), M.header));
    strip.position.set(sx * 0.21, 0.025, 0);
    lo.add(strip);
    const pins = pinRow(M, 8, 0.0635, 0.14);
    pins.rotation.y = Math.PI / 2;
    pins.position.set(sx * 0.21, 0.07, 0);
    lo.add(pins);
  }
  const loPcb = new THREE.Group();
  loPcb.position.y = 0.14;
  lo.add(loPcb);
  const loTop = new THREE.MeshStandardMaterial({ map: loraBoardTexture(), roughness: 0.38 });
  loPcb.add(
    mark(
      new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.026, 0.56), [
        M.pcbEdgeBlue,
        M.pcbEdgeBlue,
        loTop,
        M.pcbEdgeBlue,
        M.pcbEdgeBlue,
        M.pcbEdgeBlue,
      ])
    )
  );
  const mod = new THREE.Group();
  mod.position.y = 0.013;
  loPcb.add(mod);
  mod.add(mark(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.016, 0.34), M.pcbEdgeBlue)));
  const castGeo = new THREE.BoxGeometry(0.02, 0.018, 0.028);
  for (let i = 0; i < 8; i++) {
    for (const sx of [-1, 1]) {
      const c = new THREE.Mesh(castGeo, M.gold);
      c.position.set(sx * 0.168, 0, -0.14 + i * 0.04);
      mod.add(c);
    }
  }
  const loCan = mark(
    new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.28), [
      M.steel,
      M.steel,
      new THREE.MeshStandardMaterial({
        map: shieldTexture(["LoRa"], ["SX1278 class", "433 / 868 MHz"]),
        metalness: 0.85,
        roughness: 0.3,
      }),
      M.steel,
      M.steel,
      M.steel,
    ])
  );
  loCan.position.y = 0.028;
  mod.add(loCan);
  const ufl = mark(new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.024, 18), M.gold));
  ufl.position.set(-0.13, 0.02, -0.13);
  mod.add(ufl);
  const uflTip = new THREE.Object3D();
  uflTip.position.set(-0.13, 0.034, -0.13);
  mod.add(uflTip);
  P.lora = lo;

  // ----- cables: coax loop to the bulkhead, jumpers to the DevKit -------------
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const cables = [];
  const addCable = (from, to, mat, radius, shape) => {
    const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat);
    mesh.castShadow = true; // taste-skill-ignore: WebGL shadow
    root.add(mesh);
    cables.push({ from, to, mesh, radius, shape, key: "" });
  };
  addCable(uflTip, smaIn, M.coax, 0.013, (p0, p1) => {
    const c = new THREE.Vector3(p0.x + 0.13, p0.y, p0.z + 0.13);
    const r = 0.33;
    const pts = [p0.clone(), new THREE.Vector3(p0.x - 0.05, p0.y + 0.06, p0.z - 0.08)];
    for (let k = 0; k <= 10; k++) {
      const t = Math.PI * 1.25 + (k / 10) * Math.PI * 1.7;
      pts.push(new THREE.Vector3(c.x + Math.cos(t) * r, p0.y + 0.03 + 0.01 * Math.sin(k), c.z + Math.sin(t) * r * 1.05));
    }
    pts.push(new THREE.Vector3(p1.x + 0.08, p1.y - 0.05, p1.z + 0.16), p1.clone());
    return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.4);
  });
  [M.wireRed, M.wireBlack, M.wireYellow, M.wireGreen].forEach((mat, i) => {
    const from = new THREE.Object3D();
    from.position.set(-0.21, 0.15, 0.06 + i * 0.0635);
    lo.add(from);
    const to = new THREE.Object3D();
    to.position.set(-0.3 + i * 0.0635 * 2, HDR + 0.06, -(DKW / 2 - 0.05));
    dk.add(to);
    addCable(from, to, mat, 0.011, (p0, p1) => {
      const mid = p0.clone().lerp(p1, 0.5);
      mid.y = Math.max(p0.y, p1.y) + 0.12 + i * 0.02;
      mid.x -= 0.12;
      return new THREE.CatmullRomCurve3([p0.clone(), mid, p1.clone()]);
    });
  });

  P.updateCables = () => {
    root.updateMatrixWorld(true);
    for (const c of cables) {
      c.from.getWorldPosition(a);
      c.to.getWorldPosition(b);
      root.worldToLocal(a);
      root.worldToLocal(b);
      const key = `${a.x.toFixed(3)}${a.y.toFixed(3)}${a.z.toFixed(3)}${b.x.toFixed(3)}${b.y.toFixed(3)}${b.z.toFixed(3)}`;
      if (key === c.key) continue;
      c.key = key;
      c.mesh.geometry.dispose();
      c.mesh.geometry = new THREE.TubeGeometry(c.shape(a, b), 40, c.radius, 6);
    }
  };
  P.updateCables();
  P.ledBlue = M.ledBlue;
  return P;
}
