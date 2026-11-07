// Brings every doodle avatar on the page to life: blinking, eyes that follow
// the cursor, wobbly ink lines, and a talking reaction when the hero is poked.

const avatars = Array.from(document.querySelectorAll<SVGSVGElement>('svg[data-avatar]'));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function restartClass(el: Element, cls: string) {
  el.classList.remove(cls);
  void (el as SVGElement).getBoundingClientRect();
  el.classList.add(cls);
}

/* ---------- blink: random intervals, sometimes a double blink ---------- */
function blinkOnce() {
  avatars.forEach((a) => restartClass(a, 'blink'));
  setTimeout(() => avatars.forEach((a) => a.classList.remove('blink')), 200);
}
function scheduleBlink() {
  setTimeout(() => {
    if (!document.hidden) {
      blinkOnce();
      if (Math.random() < 0.25) setTimeout(blinkOnce, 260);
    }
    scheduleBlink();
  }, 1800 + Math.random() * 3800);
}
if (avatars.length) scheduleBlink();

/* ---------- eyes follow the cursor ---------- */
type Follower = { svg: SVGSVGElement; eyes: SVGGElement; brows: SVGGElement; tx: number; ty: number; x: number; y: number };
const followers: Follower[] = avatars
  .map((svg) => ({
    svg,
    eyes: svg.querySelector<SVGGElement>('[data-eyes]')!,
    brows: svg.querySelector<SVGGElement>('[data-brows]')!,
    tx: 0,
    ty: 0,
    x: 0,
    y: 0,
  }))
  .filter((f) => f.eyes && f.brows);

if (!reduceMotion && followers.length) {
  window.addEventListener('pointermove', (e) => {
    for (const f of followers) {
      const r = f.svg.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width * 0.6);
      const dy = e.clientY - (r.top + r.height * 0.42);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 400);
      f.tx = (dx / d) * 9 * k;
      f.ty = (dy / d) * 7 * k;
    }
  });
  const tick = () => {
    for (const f of followers) {
      f.x += (f.tx - f.x) * 0.15;
      f.y += (f.ty - f.y) * 0.15;
      f.eyes.setAttribute('transform', `translate(${f.x.toFixed(2)} ${f.y.toFixed(2)})`);
      f.brows.setAttribute('transform', `translate(${(f.x * 0.4).toFixed(2)} ${(f.y * 0.4).toFixed(2)})`);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- line boil + misregistration jitter ---------- */
const noise = document.getElementById('boil-noise');
const misregs = avatars.map((a) => a.querySelector('.misreg')).filter(Boolean) as Element[];
if (!reduceMotion && noise) {
  let seed = 1;
  setInterval(() => {
    if (document.hidden) return;
    seed = (seed % 4) + 1;
    noise.setAttribute('seed', String(seed));
    for (const m of misregs) {
      const jx = 10 + (Math.random() * 3 - 1.5);
      const jy = 7 + (Math.random() * 3 - 1.5);
      m.setAttribute('transform', `translate(${jx.toFixed(1)} ${jy.toFixed(1)})`);
    }
  }, 130);
}

/* ---------- poke the hero: it talks ---------- */
const lines = [
  'hello, world',
  'it works on my cluster',
  'kubectl get coffee',
  'inbox zero. ask me how',
  'git commit -m "wip"',
  'ok, that tickles',
];
const hero = avatars.find((a) => a.dataset.avatar === 'hero');
const bubble = document.querySelector<HTMLElement>('[data-bubble]');
if (hero && bubble) {
  let i = 0;
  let hideTimer: number | undefined;
  hero.addEventListener('click', () => {
    blinkOnce();
    restartClass(hero, 'talk');
    bubble.textContent = lines[i++ % lines.length];
    bubble.classList.add('show');
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      bubble.classList.remove('show');
      hero.classList.remove('talk');
    }, 1800);
  });
}

/* ---------- raised eyebrows when hovering anything marked data-surprise ---------- */
document.querySelectorAll('[data-surprise]').forEach((el) => {
  el.addEventListener('pointerenter', () => avatars.forEach((a) => a.classList.add('surprised')));
  el.addEventListener('pointerleave', () => avatars.forEach((a) => a.classList.remove('surprised')));
});
