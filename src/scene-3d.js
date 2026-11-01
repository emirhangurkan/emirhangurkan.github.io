// Starts automatically after the first paint; renders only on interaction or layout changes.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createProjectWorlds } from './project-worlds.js';

export function createScene({ canvas, shell, onFailure }) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
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
  const { getWorld, animate } = createProjectWorlds();
  const names = ['intro', 'play', 'story', 'connect'];
  const colors = { intro: 0xb7d5c4, play: 0x48bfe8, story: 0xe8b35a, connect: 0xd5b478 };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let state = { position: 0, world: 'intro', muted: false };
  let active = false, contextLost = false, frame = 0, dragging = false;
  let pointerX = 0, dragRotation = 0, tiltX = 0, tiltY = 0;
  let lastWidth = 0, lastHeight = 0;
  let fittedWorld = '', fittedWidth = 0, fittedHeight = 0;
  const compact = matchMedia('(max-width: 900px), (max-height: 500px)');
  const bounds = new THREE.Box3(), size = new THREE.Vector3(), center = new THREE.Vector3();

  function render() {
    frame = 0;
    if (!active || contextLost || state.muted || document.hidden) return;
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (width < 1 || height < 1) return;
    if (width !== lastWidth || height !== lastHeight) {
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25, Math.sqrt(1200000 / (width * height))));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      lastWidth = width; lastHeight = height;
    }
    root.rotation.set(reduced.matches ? 0 : tiltY, dragRotation + (reduced.matches ? 0 : tiltX), 0);
    root.scale.setScalar(.7 + .14 * Math.max(0, 1 - state.position));
    for (const [index, name] of names.entries()) {
      const distance = index - state.position;
      const visible = Math.abs(distance) < .999;
      // Do not construct a model until its first visible frame.
      const sculpture = getWorld(name, visible);
      if (!sculpture) continue;
      if (!sculpture.parent) root.add(sculpture);
      sculpture.visible = visible;
      if (!visible) continue;
      const amount = Math.min(1, Math.abs(distance));
      sculpture.scale.setScalar(1 - amount * .28);
      sculpture.position.set(distance * .28, -distance * 5.2, -amount * 1.3);
      sculpture.rotation.y = distance * .3;
    }
    // A stable pose follows the scroll; no continuously running clock.
    animate(reduced.matches ? 0 : state.position * 2);
    if (compact.matches) {
      if (fittedWorld !== state.world || fittedWidth !== width || fittedHeight !== height) {
        root.updateMatrixWorld(true);
        bounds.setFromObject(getWorld(state.world));
        bounds.getSize(size); bounds.getCenter(center);
        const distance = Math.max(size.y, size.x / camera.aspect) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * .82) + size.z / 2;
        camera.position.set(center.x, center.y, Math.max(3.8, distance));
        fittedWorld = state.world; fittedWidth = width; fittedHeight = height;
      }
    } else {
      camera.position.set(0, .05, 8.2);
      fittedWorld = '';
    }
    rim.color.setHex(colors[state.world]);
    renderer.render(scene, camera);
  }
  function requestRender() {
    if (!frame && active && !state.muted && !document.hidden && !contextLost) frame = requestAnimationFrame(render);
  }
  new ResizeObserver(requestRender).observe(shell);
  canvas.addEventListener('pointermove', event => {
    if (!active || event.pointerType === 'touch' || (reduced.matches && !dragging)) return;
    const rect = canvas.getBoundingClientRect();
    tiltX = ((event.clientX - rect.left) / rect.width - .5) * .24;
    tiltY = ((event.clientY - rect.top) / rect.height - .5) * .14;
    if (dragging) { dragRotation += (event.clientX - pointerX) * .008; pointerX = event.clientX; }
    requestRender();
  }, { passive: true });
  canvas.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') return;
    dragging = true;
    pointerX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointerup', () => { dragging = false; });
  canvas.addEventListener('pointercancel', () => { dragging = false; });
  canvas.addEventListener('pointerleave', () => { dragging = false; tiltX = tiltY = 0; requestRender(); });
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); contextLost = true; active = false;
    cancelAnimationFrame(frame); frame = 0; onFailure();
  });
  canvas.addEventListener('webglcontextrestored', () => { contextLost = false; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else requestRender();
  });
  return {
    update(next) {
      if (contextLost) throw new Error('WebGL context is unavailable');
      const changed = !active || next.position !== state.position || next.world !== state.world || next.muted !== state.muted;
      state = next; active = true; if (changed) requestRender();
    },
    pause() { active = false; cancelAnimationFrame(frame); frame = 0; }
  };
}
