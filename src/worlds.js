import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const body = document.body;
const shell = document.querySelector('.scene-shell');
const canvas = document.querySelector('#world-scene');
const switches = [...document.querySelectorAll('[data-world]')];
const sections = [...document.querySelectorAll('[data-scene]')];
const captions = { play: '01 / THE PLAY WORLD', story: '02 / THE WONDER WORLD', connect: '03 / THE CONNECT WORLD' };
const labels = { play: 'Block Bluup: a world to play in.', story: 'Gece Dosyası: a world to look closer at.', connect: 'Kalradya Co-op: a world to share.' };
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let currentSection = sections[0];
let currentWorld = 'play';
let setSculpture = () => {};
let wakeScene = () => {};

function setWorld(world, announce = false) {
  if (!Object.hasOwn(captions, world)) return;
  currentWorld = world;
  body.dataset.world = world;
  switches.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.world === world)));
  document.querySelector('.scene-world').textContent = captions[world];
  if (announce) document.querySelector('.world-announcement').textContent = labels[world];
  setSculpture(world);
}
switches.forEach(button => button.addEventListener('click', () => setWorld(button.dataset.world, true)));

let scrollQueued = false;
function syncScroll() {
  scrollQueued = false;
  const marker = innerHeight * .44;
  const active = sections.find(section => { const rect = section.getBoundingClientRect(); return rect.top <= marker && rect.bottom > marker; });
  if (active && active !== currentSection) {
    currentSection = active;
    setWorld(active.dataset.scene);
  }
  body.classList.toggle('chapter-view', currentSection !== sections[0]);
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
  renderer.toneMappingExposure = 1.25;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 70);
  camera.position.set(0, .05, 8.2);

  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(environment, .04);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = 1.05;
  environment.dispose();
  pmrem.dispose();

  const key = new THREE.DirectionalLight(0xe7fcff, 3.3);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x74d6d0, 2.5);
  rim.position.set(-4, 1, -2);
  scene.add(rim);
  const fill = new THREE.PointLight(0xe1b5ff, 45, 14, 2);
  fill.position.set(2, -2, 3);
  scene.add(fill);
  const root = new THREE.Group();
  scene.add(root);

  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: .87, roughness: .19, clearcoat: 1, clearcoatRoughness: .14, iridescence: .35, iridescenceIOR: 1.4 });
  const silver = new THREE.MeshStandardMaterial({ color: 0xd8e2e4, metalness: .92, roughness: .22 });
  const copper = new THREE.MeshPhysicalMaterial({ color: 0xff6042, metalness: .65, roughness: .23, clearcoat: 1, emissive: 0x4a100a, emissiveIntensity: .22 });
  const lilac = new THREE.MeshPhysicalMaterial({ color: 0xb8a0ff, metalness: .83, roughness: .18, clearcoat: 1 });
  const aqua = new THREE.MeshPhysicalMaterial({ color: 0x92e9d2, metalness: .82, roughness: .18, clearcoat: 1 });
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x43666e, transparent: true, opacity: .32 });

  function orbit(parent, color, radius = 2.05) {
    const orbitMaterial = lineMaterial.clone();
    orbitMaterial.color.set(color);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, .006, 5, 140), orbitMaterial);
    ring.rotation.set(.8, -.4, -.4);
    parent.add(ring);
    const marker = new THREE.Mesh(new THREE.SphereGeometry(.045, 12, 10), new THREE.MeshBasicMaterial({ color }));
    ring.add(marker);
    marker.position.set(radius, 0, 0);
    return ring;
  }

  const play = new THREE.Group();
  const cubeGeometry = new RoundedBoxGeometry(.3, .3, .3, 3, .055);
  const count = 112;
  const cubes = new THREE.InstancedMesh(cubeGeometry, chrome, count);
  const helper = new THREE.Object3D();
  const up = new THREE.Vector3(0, 1, 0);
  const palette = [0x9fe9d9, 0xc2d7e1, 0xb8abc9, 0x7ccdbf, 0xe2e7e1, 0xc5d3d6, 0xf4bd8c];
  function knot(t) {
    const r = 1.1 + .43 * Math.cos(3 * t);
    return new THREE.Vector3(r * Math.cos(2 * t), r * Math.sin(2 * t), .67 * Math.sin(3 * t));
  }
  for (let i = 0; i < count; i++) {
    const t = i / count * Math.PI * 2;
    const point = knot(t);
    const tangent = knot(t + .002).sub(point).normalize();
    helper.position.copy(point);
    helper.quaternion.setFromUnitVectors(up, tangent);
    helper.rotateY(.2);
    helper.updateMatrix();
    cubes.setMatrixAt(i, helper.matrix);
    cubes.setColorAt(i, new THREE.Color(palette[i % palette.length]));
  }
  cubes.instanceMatrix.needsUpdate = true;
  play.add(cubes);
  const playOrbit = orbit(play, 0x75d8c6, 2.02);
  for (let i = 0; i < 5; i++) {
    const cube = new THREE.Mesh(new RoundedBoxGeometry(.13, .13, .13, 2, .025), i % 2 ? silver : aqua);
    const t = i * 1.256;
    cube.position.set(Math.cos(t) * 1.99, Math.sin(t) * 1.99, Math.sin(t * 2) * .5);
    cube.rotation.set(t, t, t);
    play.add(cube);
  }

  const story = new THREE.Group();
  const question = new THREE.CurvePath();
  question.add(new THREE.CubicBezierCurve3(new THREE.Vector3(-1.08,.62,0),new THREE.Vector3(-1.25,2.02,0),new THREE.Vector3(1.42,2.13,0),new THREE.Vector3(1.37,.78,0)));
  question.add(new THREE.CubicBezierCurve3(new THREE.Vector3(1.37,.78,0),new THREE.Vector3(1.4,.05,0),new THREE.Vector3(.04,.23,0),new THREE.Vector3(.04,-.91,0)));
  for (let i = -4; i <= 4; i++) {
    const points = [];
    for (let step = 0; step <= 100; step++) {
      const t = step / 100;
      const point = question.getPoint(t);
      const tangent = question.getTangent(t);
      const normal = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
      point.addScaledVector(normal, i * .092);
      point.z = Math.sin(t * Math.PI) * .3 + i * .038;
      points.push(point);
    }
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 130, .038, 8, false), copper);
    story.add(tube);
  }
  const dot = new THREE.Mesh(new THREE.SphereGeometry(.24, 32, 20), copper);
  dot.position.set(.04, -1.55, 0);
  story.add(dot);
  story.position.y = -.12;
  orbit(story, 0xb75d4b, 2.04);

  const connect = new THREE.Group();
  const ringGeometry = new THREE.TorusGeometry(1.03, .25, 24, 120);
  const linkOne = new THREE.Mesh(ringGeometry, lilac);
  linkOne.position.x = -.72;
  linkOne.rotation.y = .16;
  const linkTwo = new THREE.Mesh(ringGeometry, aqua);
  linkTwo.position.x = .72;
  linkTwo.rotation.x = Math.PI / 2;
  connect.add(linkOne, linkTwo);
  const connectOrbit = orbit(connect, 0xb5a0fa, 2.2);
  const linkNode = new THREE.Mesh(new THREE.SphereGeometry(.115, 20, 14), new THREE.MeshBasicMaterial({ color: 0xf0e5ff }));
  linkOne.add(linkNode);

  const sculptures = { play, story, connect };
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

  function render(time) {
    frame = 0;
    const delta = Math.min((time - last) / 1000, .05);
    last = time;
    if (!reduced.matches) clock += delta;
    easedPointer.lerp(pointer, .04);
    root.rotation.y = easedPointer.x * .24 + dragRotation;
    root.rotation.x = easedPointer.y * .14;
    root.position.y = reduced.matches ? 0 : Math.sin(clock * .55) * .075;
    root.scale.setScalar(innerWidth < 761 ? .84 : 1);
    play.rotation.set(.25 + Math.sin(clock * .18) * .1, -.3 + clock * .065, -.18);
    story.rotation.set(.04, -.15 + Math.sin(clock * .24) * .22, -.08);
    connect.rotation.set(.5, -.32 + Math.sin(clock * .19) * .2, -.35);
    playOrbit.rotation.z = clock * .05;
    connectOrbit.rotation.y = clock * .07;
    linkNode.position.set(Math.cos(clock * .5) * 1.03, Math.sin(clock * .5) * 1.03, 0);
    for (const [name, sculpture] of Object.entries(sculptures)) {
      const target = name === currentWorld ? 1 : .001;
      const size = reduced.matches ? target : THREE.MathUtils.damp(sculpture.scale.x, target, 6, delta);
      sculpture.scale.setScalar(size);
      sculpture.visible = size > .004;
    }
    const color = currentWorld === 'story' ? 0xffb59f : currentWorld === 'connect' ? 0xa59af6 : 0x74d6d0;
    rim.color.lerp(new THREE.Color(color), .035);
    renderer.render(scene, camera);
    body.classList.add('scene-ready');
    if (!reduced.matches && !document.hidden && !body.classList.contains('scene-muted')) frame = requestAnimationFrame(render);
  }
  wakeScene = () => { if (!frame && !document.hidden && !contextLost) { last = performance.now(); frame = requestAnimationFrame(render); } };
  setSculpture = () => wakeScene();
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
