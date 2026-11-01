import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createProjectWorlds } from './project-worlds.js';
import { journeyPosition } from './scroll-journey.js';

const body = document.body;
const shell = document.querySelector('.scene-shell');
const canvas = document.querySelector('#world-scene');
const journeyLinks = [...document.querySelectorAll('.journey-rail a[data-world]')];
const sections = [...document.querySelectorAll('[data-scene]')];
const worldOrder = sections.map(section => section.dataset.scene);
const captions = { intro: '00 / THE MAKER', play: '01 / BLOCK BLUUP', story: '02 / GECE DOSYASI', connect: '03 / KALRADYA CO-OP' };
const descriptions = { intro: 'A sculptural E/G monogram surrounded by the colors of three project worlds.', play: 'A floating Block Bluup puzzle board with colorful, rounded pieces.', story: 'The Gece Dosyası fingerprint question mark, sculpted in red.', connect: 'The Kalradya Co-op bronze shield and crossed swords.' };
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let currentWorld = 'intro';
let scrollPosition = 0;
let wakeScene = () => {};

function setWorld(world) {
  if (!Object.hasOwn(captions, world)) return;
  currentWorld = world;
  body.dataset.world = world;
  canvas.setAttribute('aria-label', descriptions[world]);
  document.querySelector('.scene-fallback').setAttribute('aria-label', descriptions[world]);
  journeyLinks.forEach(link => {
    if (link.dataset.world === world) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  document.querySelector('.scene-world').textContent = captions[world];
}

let scrollQueued = false;
function syncScroll() {
  scrollQueued = false;
  scrollPosition = journeyPosition(sections.map(section => section.getBoundingClientRect().top), innerHeight);
  const activeWorld = worldOrder[Math.round(scrollPosition)];
  if (activeWorld !== currentWorld) setWorld(activeWorld);
  body.classList.toggle('chapter-view', scrollPosition > .5);
  const muted = document.querySelector('.about-section').getBoundingClientRect().top < innerHeight * .6;
  body.classList.toggle('scene-muted', muted);
  const range = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.scroll-progress').style.transform = `scaleX(${range > 0 ? scrollY / range : 0})`;
  if (!muted) wakeScene();
}
addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(syncScroll); } }, { passive: true });
addEventListener('resize', syncScroll, { passive: true });
syncScroll();

try {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 761 ? 1.25 : 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .9;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 70);
  camera.position.set(0, .05, 8.2);

  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(environment, .04);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = .6;
  environment.dispose();
  pmrem.dispose();

  const key = new THREE.DirectionalLight(0xf7fcff, 1.6);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x74d6d0, 1.6);
  rim.position.set(-4, 1, -2);
  scene.add(rim);
  const fill = new THREE.PointLight(0xc0e6ff, 20, 14, 2);
  fill.position.set(2, -2, 3);
  scene.add(fill);
  const root = new THREE.Group();
  scene.add(root);

  const { sculptures, animate } = createProjectWorlds();
  for (const [name, sculpture] of Object.entries(sculptures)) {
    sculpture.scale.setScalar(name === currentWorld ? 1 : .001);
    sculpture.visible = name === currentWorld;
    root.add(sculpture);
  }

  const starsPosition = new Float32Array(75 * 3);
  for (let i = 0; i < 75; i++) {
    const t = i * 2.39996;
    starsPosition[i * 3] = Math.cos(t) * (2.4 + (i % 7) * .17);
    starsPosition[i * 3 + 1] = Math.sin(t) * (1.9 + (i % 5) * .15);
    starsPosition[i * 3 + 2] = -1.2 - (i % 6) * .3;
  }
  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPosition, 3));
  const stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0xa8bdbd, size: .012, transparent: true, opacity: .45, depthWrite: false }));
  scene.add(stars);

  const pointer = new THREE.Vector2();
  const easedPointer = new THREE.Vector2();
  let dragging = false;
  let contextLost = false;
  let pointerX = 0;
  let dragRotation = 0;
  let frame = 0;
  let start = performance.now();
  let last = start;
  let clock = 0;
  let renderedPosition = scrollPosition;
  const worldColors = { intro: new THREE.Color(0xb7d5c4), play: new THREE.Color(0x48bfe8), story: new THREE.Color(0xe8b35a), connect: new THREE.Color(0xd5b478) };

  function render(time) {
    frame = 0;
    const delta = Math.min((time - last) / 1000, .05);
    last = time;
    if (!reduced.matches) clock += delta;
    easedPointer.lerp(pointer, .04);
    root.rotation.y = easedPointer.x * .24 + dragRotation;
    root.rotation.x = easedPointer.y * .14;
    root.position.y = reduced.matches ? 0 : Math.sin(clock * .55) * .075;
    root.scale.setScalar(innerWidth < 761 ? .76 : .84);
    renderedPosition = reduced.matches ? Math.round(scrollPosition)
      : Math.abs(renderedPosition - scrollPosition) > 1.1 ? scrollPosition
      : THREE.MathUtils.damp(renderedPosition, scrollPosition, 12, delta);
    worldOrder.forEach((name, index) => {
      const sculpture = sculptures[name];
      const distance = index - renderedPosition;
      const amount = Math.min(1, Math.abs(distance));
      sculpture.visible = amount < .999;
      sculpture.scale.setScalar(1 - amount * .28);
      sculpture.position.set(distance * .28, -distance * 5.2, -amount * 1.3);
      sculpture.rotation.y = distance * .3;
    });
    animate(clock);
    rim.color.lerp(worldColors[currentWorld], reduced.matches ? 1 : .035);
    stars.material.color.lerp(worldColors[currentWorld], reduced.matches ? 1 : .035);
    renderer.render(scene, camera);
    body.classList.add('scene-ready');
    if (!reduced.matches && !document.hidden && !body.classList.contains('scene-muted')) frame = requestAnimationFrame(render);
  }
  wakeScene = () => { if (!frame && !document.hidden && !contextLost) { last = performance.now(); frame = requestAnimationFrame(render); } };
  function resize() {
    const width = shell.clientWidth;
    const height = shell.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    wakeScene();
  }
  new ResizeObserver(resize).observe(shell);
  canvas.addEventListener('pointermove', event => {
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width - .5, (event.clientY - rect.top) / rect.height - .5);
    if (dragging) { dragRotation += (event.clientX - pointerX) * .008; pointerX = event.clientX; }
    wakeScene();
  }, { passive: true });
  canvas.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') return;
    dragging = true;
    pointerX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointerup', () => { dragging = false; });
  canvas.addEventListener('pointercancel', () => { dragging = false; });
  canvas.addEventListener('pointerleave', () => { pointer.set(0, 0); dragging = false; });
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); contextLost = true; cancelAnimationFrame(frame); frame = 0; body.classList.remove('scene-ready'); });
  canvas.addEventListener('webglcontextrestored', () => { contextLost = false; wakeScene(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else wakeScene(); });
  reduced.addEventListener('change', wakeScene);
  resize();
} catch (error) {
  canvas.hidden = true;
  console.warn('The static sculpture is available because WebGL could not start.', error);
}
