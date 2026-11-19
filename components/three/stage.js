// Renders the field node in the right-hand stage of the first chapter and
// drives it from the scroll progress of that chapter (0..1):
//   0.00 sealed, idling          0.10 screws back out      0.20 lid lifts off
//   0.36 the antenna             0.48 LoRa board rises     0.62 ESP32 rises
//   0.76 every layer, exploded   0.88 it all goes back together, LED blinks
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { buildEnclosure, makeMaterials } from "./enclosure";

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (x) => x * x * (3 - 2 * x);
const seg = (v, a, b) => smooth(clamp((v - a) / (b - a)));
const lerp = (a, b, t) => a + (b - a) * t;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const KEYS = [
  { p: 0.0, pos: V(2.7, 3.1, 3.9), tgt: V(0, 0.35, 0.05), fov: 30 },
  { p: 0.1, pos: V(2.2, 3.5, 3.4), tgt: V(0, 0.45, 0), fov: 30 },
  { p: 0.3, pos: V(1.5, 4.6, 2.7), tgt: V(0, 0.45, 0), fov: 30 },
  { p: 0.38, pos: V(2.5, 2.1, -3.9), tgt: V(0, 0.5, -1.15), fov: 28 },
  { p: 0.44, pos: V(2.5, 2.1, -3.9), tgt: V(0, 0.5, -1.15), fov: 28 },
  { p: 0.53, pos: V(1.9, 3.2, 1.6), tgt: V(0, 0.8, -0.3), fov: 27 },
  { p: 0.58, pos: V(1.9, 3.2, 1.6), tgt: V(0, 0.8, -0.3), fov: 27 },
  { p: 0.67, pos: V(-2.1, 2.9, 3.2), tgt: V(0, 0.55, 0.45), fov: 28 },
  { p: 0.72, pos: V(-2.1, 2.9, 3.2), tgt: V(0, 0.55, 0.45), fov: 28 },
  { p: 0.8, pos: V(3.9, 3.2, 4.4), tgt: V(0, 1.05, 0), fov: 32 },
  { p: 0.86, pos: V(3.9, 3.2, 4.4), tgt: V(0, 1.05, 0), fov: 32 },
  { p: 0.96, pos: V(2.7, 3.1, 3.9), tgt: V(0, 0.35, 0.05), fov: 30 },
  { p: 1.0, pos: V(2.7, 3.1, 3.9), tgt: V(0, 0.35, 0.05), fov: 30 },
];

function poseAt(p, out) {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const u = smooth(clamp((p - a.p) / (b.p - a.p)));
  out.pos.lerpVectors(a.pos, b.pos, u);
  out.tgt.lerpVectors(a.tgt, b.tgt, u);
  out.fov = lerp(a.fov, b.fov, u);
  return out;
}

export async function initStage(canvas, section, { reduced }) {
  if (document.fonts?.ready) await document.fonts.ready;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; // taste-skill-ignore: WebGL shadow map
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // taste-skill-ignore: WebGL shadow map

  const BG = new THREE.Color("#181715");
  const scene = new THREE.Scene();
  scene.background = BG;
  scene.fog = new THREE.Fog(BG, 7, 15);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 60);

  // studio light: a soft key from the front-left, a cool rim, a low fill
  const key = new THREE.DirectionalLight("#fff3e6", 2.6);
  key.position.set(-3.5, 7, 4);
  key.castShadow = true; // taste-skill-ignore: WebGL shadow
  key.shadow.mapSize.set(2048, 2048); // taste-skill-ignore: WebGL shadow map
  key.shadow.bias = -0.0003; // taste-skill-ignore: WebGL shadow
  key.shadow.normalBias = 0.015; // taste-skill-ignore: WebGL shadow
  key.shadow.radius = 5; // taste-skill-ignore: WebGL shadow
  const sc = key.shadow.camera; // taste-skill-ignore: WebGL shadow
  sc.left = -3;
  sc.right = 3;
  sc.top = 3;
  sc.bottom = -3;
  sc.near = 1;
  sc.far = 20;
  scene.add(key);
  const rim = new THREE.DirectionalLight("#cfdcff", 1.4);
  rim.position.set(4, 3, -5);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight("#ffffff", "#2a2a28", 0.35));

  // an endless dark studio floor that fades into the page
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({ color: "#23211e", roughness: 0.92 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true; // taste-skill-ignore: WebGL shadow
  scene.add(floor);

  const node = buildEnclosure(makeMaterials());
  scene.add(node.root);

  // post: ambient occlusion makes parts sit on each other like real objects
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const ao = new GTAOPass(scene, camera, 1, 1);
  ao.updateGtaoMaterial({ radius: 0.32, distanceExponent: 1.6, thickness: 1.4, scale: 1.25, samples: 12 });
  ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 5, rings: 2, samples: 12 });
  composer.addPass(ao);
  composer.addPass(new OutputPass());

  let w = 0;
  let h = 0;
  // quality steps the stage drops through if frames run long: 0 full, 1 no AO, 2 lower resolution
  let quality = 0;
  const resize = () => {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio, quality >= 2 ? 1 : 1.25);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(dpr);
    composer.setSize(w, h);
    // ambient occlusion is soft by nature: compute it at half resolution
    ao.setSize(Math.round((w * dpr) / 2), Math.round((h * dpr) / 2));
    camera.aspect = w / h;
    // wide screens: the stage runs full-bleed behind the words, so the frame
    // is shifted to put the node in the right-hand two thirds
    if (w >= 900) camera.setViewOffset(w, h, -w * 0.17, 0, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  let px = 0;
  let spx = 0;
  const onPointer = (e) => {
    px = (e.clientX / window.innerWidth) * 2 - 1;
  };
  if (!reduced && window.matchMedia("(pointer: fine)").matches) window.addEventListener("pointermove", onPointer, { passive: true });

  const pose = { pos: new THREE.Vector3(), tgt: new THREE.Vector3(), fov: 30 };
  const cam = { pos: new THREE.Vector3(), tgt: new THREE.Vector3(), fov: 30, init: false };
  const clock = new THREE.Clock();
  let raf = 0;
  let sp = 0;
  let last = performance.now();
  let slow = 0; // running average frame time (ms)
  let slowFor = 0;
  let lastKey = "";

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const now = performance.now();
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.bottom < -50 || r.top > vh + 50) return;
    const target = clamp(-r.top / (r.height - vh));
    // Frame-rate independent easing toward the scroll position. A mouse wheel
    // moves the page in steps; this turns each step into a glide, so the
    // hardware moves like it has mass instead of jumping between poses.
    const ease = 1 - Math.exp(-dt * 6);
    sp += (target - sp) * ease;
    if (Math.abs(target - sp) < 0.00005) sp = target;
    const p = sp;
    const t = clock.getElapsedTime();

    // adaptive quality: if frames keep running long, drop AO, then resolution
    slow = slow * 0.95 + dt * 1000 * 0.05;
    slowFor = slow > 26 ? slowFor + dt : 0;
    if (slowFor > 1.2 && quality < 2) {
      quality += 1;
      slowFor = 0;
      if (quality === 1) ao.enabled = false;
      resize();
    }

    // --- the node -------------------------------------------------------
    const idle = 1 - seg(p, 0.02, 0.1);
    spx += (px - spx) * 0.05;
    node.root.rotation.y = reduced ? 0 : (Math.sin(t * 0.4) * 0.12 + spx * 0.2) * idle;

    const screwsOut = seg(p, 0.1, 0.2) * (1 - seg(p, 0.93, 0.99));
    node.screws.forEach((s, i) => {
      const u = clamp(screwsOut * 1.2 - i * 0.06);
      s.position.copy(s.userData.home);
      s.position.y += u * 0.75;
      s.rotation.y = -u * Math.PI * 7;
    });

    const lidOff = seg(p, 0.19, 0.32) * (1 - seg(p, 0.9, 0.97));
    const lidHigh = seg(p, 0.74, 0.8) * (1 - seg(p, 0.86, 0.92));
    node.lid.position.set(0, 0.804 + lidOff * 1.15 + lidHigh * 0.6, -lidOff * 0.35);
    node.lid.rotation.x = -lidOff * 0.32;

    const apart = 1 - seg(p, 0.86, 0.93);
    const loraUp = seg(p, 0.47, 0.55) * apart + seg(p, 0.74, 0.8) * apart * 0.35;
    node.lora.position.y = 0.016 + loraUp * 0.62;
    node.lora.rotation.x = seg(p, 0.47, 0.55) * apart * 0.18;
    const dkUp = seg(p, 0.61, 0.69) * apart + seg(p, 0.74, 0.8) * apart * 0.2;
    node.devkit.position.y = 0.016 + dkUp * 0.34;
    node.devkit.rotation.x = -seg(p, 0.61, 0.69) * apart * 0.1;
    node.board.position.y = 0.14 + seg(p, 0.74, 0.8) * apart * 0.14;
    node.updateCables();

    // once it is closed again, the radio's status LED blinks: it is online
    const online = seg(p, 0.95, 0.99);
    node.ledBlue.emissiveIntensity = online * (reduced ? 2 : Math.sin(t * 6) > 0.4 ? 3 : 0.2);

    // --- camera ---------------------------------------------------------
    poseAt(p, pose);
    if (w < 700) {
      // narrow stage: step back so the whole box stays in frame
      pose.pos.sub(pose.tgt).multiplyScalar(1.22).add(pose.tgt);
    }
    if (!cam.init) {
      cam.pos.copy(pose.pos);
      cam.tgt.copy(pose.tgt);
      cam.fov = pose.fov;
      cam.init = true;
    } else {
      const k = 1 - Math.exp(-dt * 8);
      cam.pos.lerp(pose.pos, k);
      cam.tgt.lerp(pose.tgt, k);
      cam.fov += (pose.fov - cam.fov) * k;
    }
    camera.position.copy(cam.pos);
    camera.lookAt(cam.tgt);
    if (Math.abs(camera.fov - cam.fov) > 0.001) {
      camera.fov = cam.fov;
      camera.updateProjectionMatrix();
    }

    // render only when something on screen changed (still frames cost nothing)
    const key = `${sp.toFixed(5)}|${cam.pos.x.toFixed(4)},${cam.pos.y.toFixed(4)},${cam.pos.z.toFixed(4)}|${node.root.rotation.y.toFixed(4)}|${node.ledBlue.emissiveIntensity}|${w}x${h}|${quality}`;
    if (key === lastKey) return;
    lastKey = key;
    composer.render();
    if (!canvas.dataset.ready) canvas.dataset.ready = "1";
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    composer.dispose();
    renderer.dispose();
    pmrem.dispose();
  };
}
