import { journeyPosition } from './scroll-journey.js';
import { initLanguage, sceneCopy } from './language.js';

const body = document.body;
const shell = document.querySelector('.scene-shell');
const canvas = document.querySelector('#world-scene');
const hero = document.querySelector('.hero');
const chapters = [...document.querySelectorAll('.chapter[data-scene]')];
const artwork = [...document.querySelectorAll('.world-art')];
const worldOrder = ['intro', 'play', 'story', 'connect'];
const rail = [...document.querySelectorAll('.journey-rail a')];
const progressBar = document.querySelector('.scroll-progress');
const caption = document.querySelector('.scene-world');
const counter = document.querySelector('.reel-counter');
const toggle = document.querySelector('.scene-toggle');
const status = document.querySelector('.scene-status');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let language = 'en', world = '', position = 0, intro = true, muted = false, frame = 0;
let geometry, scene, enabled = false, loading = false;

function updateToggle() {
  toggle.textContent = loading ? (language === 'tr' ? '3D açılıyor…' : 'Opening 3D…')
    : enabled ? (language === 'tr' ? 'Hafif görünüm ↗' : 'Light view ↗')
    : (language === 'tr' ? '3D keşfet ↗' : 'Explore in 3D ↗');
  toggle.setAttribute('aria-pressed', String(enabled));
  toggle.setAttribute('aria-busy', String(loading));
  toggle.disabled = loading;
}
function setWorld(next, force = false) {
  if (world === next && !force) return;
  world = next;
  body.dataset.world = next;
  const [label, description] = sceneCopy[language][next];
  caption.textContent = label;
  counter.textContent = next === 'intro' ? 'EG / 00' : `0${worldOrder.indexOf(next)} / 03`;
  document.querySelector('.scene-topline > span:first-child').textContent = next === 'intro'
    ? (language === 'tr' ? 'EMIRHAN GÜRKAN / YAZILIM · OYUN · HİKÂYELER' : 'EMIRHAN GÜRKAN / SOFTWARE · PLAY · STORIES')
    : (language === 'tr' ? 'KURDUĞUM DÜNYALARDAN BİRKAÇI' : 'A FEW WORLDS I’VE BUILT');
  canvas.setAttribute('aria-label', description);
  document.querySelector('.scene-artwork').setAttribute('aria-label', description);
}
function syncScroll() {
  frame = 0;
  if (!geometry) return;
  const y = scrollY, height = innerHeight;
  intro = y < geometry.chapterTops[0] - height * .78;
  muted = geometry.aboutTop - y < height * .6;
  position = journeyPosition([geometry.heroTop, ...geometry.chapterTops].map(top => top - y), height);
  const painted = reduced.matches ? Math.round(position) : position;
  setWorld(worldOrder[Math.round(position)]);
  body.classList.toggle('chapter-view', !intro);
  body.classList.toggle('scene-muted', muted);
  rail.forEach(link => {
    const active = intro ? link.dataset.world === 'intro' : link.dataset.world === world;
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  artwork.forEach((element, index) => {
    const distance = index - painted;
    element.style.opacity = String(Math.max(0, 1 - Math.abs(distance)));
    element.style.transform = `translate3d(0,${distance * 28}%,0) rotate(${distance * 8}deg) scale(${1 - Math.min(1, Math.abs(distance)) * .12})`;
    element.style.visibility = Math.abs(distance) < 1 ? 'visible' : 'hidden';
  });
  progressBar.style.transform = `scaleX(${geometry.range > 0 ? Math.min(1, y / geometry.range) : 0})`;
  if (enabled) scene?.update({ position: painted, world, muted });
}
function queueScroll() { if (!frame) frame = requestAnimationFrame(syncScroll); }
// Cache section geometry after layout changes, never read it on every scroll frame.
function measure() {
  geometry = {
    heroTop: hero.getBoundingClientRect().top + scrollY,
    introTravel: Math.max(1, hero.offsetHeight - innerHeight),
    chapterTops: chapters.map(section => section.getBoundingClientRect().top + scrollY),
    aboutTop: document.querySelector('.about-section').getBoundingClientRect().top + scrollY,
    range: document.documentElement.scrollHeight - innerHeight
  };
  queueScroll();
}
addEventListener('scroll', queueScroll, { passive: true });
addEventListener('resize', measure, { passive: true });
addEventListener('pageshow', measure);
new ResizeObserver(measure).observe(document.querySelector('main'));
document.querySelector('.store-qr').addEventListener('toggle', measure);
reduced.addEventListener('change', queueScroll);
async function toggleScene() {
  if (loading) return;
  if (enabled) {
    enabled = false;
    scene.pause();
    body.classList.remove('scene-ready');
    canvas.hidden = true;
    updateToggle();
    return;
  }
  loading = true;
  status.textContent = '';
  updateToggle();
  try {
    if (!scene) {
      const { createScene } = await import('./scene-3d.js');
      scene = createScene({ canvas, shell, onFailure: () => {
        enabled = false;
        body.classList.remove('scene-ready');
        canvas.hidden = true;
        updateToggle();
      } });
    }
    enabled = true;
    canvas.hidden = false;
    scene.update({ position, world, muted });
    body.classList.add('scene-ready');
  } catch (error) {
    enabled = false;
    canvas.hidden = true;
    status.textContent = language === 'tr' ? '3D açılamadı. Çizimlerle devam edebilirsin.' : '3D is unavailable. The artwork is still here to explore.';
    console.warn('3D could not start.', error);
  } finally { loading = false; updateToggle(); }
}
toggle.addEventListener('click', toggleScene);
initLanguage(next => {
  language = next;
  setWorld(world || 'intro', true);
  status.textContent = '';
  updateToggle();
  measure();
});
toggle.hidden = false;
body.classList.add('journey-ready');
measure();

// Show the personal introduction first; start 3D automatically after the first paint.
requestAnimationFrame(() => requestAnimationFrame(() => { if (!enabled && !loading) toggleScene(); }));
