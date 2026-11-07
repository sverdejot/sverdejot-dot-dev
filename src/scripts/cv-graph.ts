// Draws the CV as a git graph next to the entries rendered by cv.astro:
// work on one branch, education on another, maths branching off the master,
// and certifications as short branches that fork off work and merge back.

const graph = document.querySelector<HTMLElement>('[data-cv-graph]');

if (graph) {
  const rails = graph.querySelector<SVGSVGElement>('svg.rails')!;
  const rows = Array.from(graph.querySelectorAll<HTMLElement>('.commit'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ongoing entries: keep the duration fresh between deploys */
  const now = new Date();
  for (const row of rows) {
    const from = row.dataset.from;
    const out = row.querySelector('.dur');
    if (!from || !out) continue;
    const [y, m] = from.split('-').map(Number);
    const n = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
    const yy = Math.floor(n / 12);
    const mm = n % 12;
    out.textContent = [yy && `${yy}y`, mm && `${mm}m`].filter(Boolean).join(' ') || '<1m';
  }

  type Point = { x: number; y: number; lane: number; cert: boolean; color: string };

  const draw = () => {
    const narrow = window.matchMedia('(max-width: 680px)').matches;
    const W = narrow ? 64 : 120;
    // lanes left to right: work, certifications, education, maths
    const X: Record<string, number> = narrow
      ? { '0': 10, '-1': 25, '1': 40, '2': 55 }
      : { '0': 24, '-1': 50, '1': 76, '2': 104 };
    const box = graph.getBoundingClientRect();
    const H = graph.offsetHeight;
    const pts: Record<string, Point> = {};

    for (const row of rows) {
      const title = row.querySelector('h3')!.getBoundingClientRect();
      pts[row.dataset.id!] = {
        x: X[row.dataset.lane!],
        y: title.top + title.height / 2 - box.top,
        lane: Number(row.dataset.lane),
        cert: row.classList.contains('cert'),
        color: row.style.getPropertyValue('--c'),
      };
    }

    let s = '';
    const line = (x1: number, y1: number, x2: number, y2: number, color: string) => {
      s += `<path d="M${x1} ${y1} L${x2} ${y2}" style="stroke:${color};stroke-width:3;fill:none;stroke-linecap:round"/>`;
    };
    const curve = (x1: number, y1: number, x2: number, y2: number, color: string) => {
      const my = (y1 + y2) / 2;
      s += `<path d="M${x1} ${y1} C${x1} ${my}, ${x2} ${my}, ${x2} ${y2}" style="stroke:${color};stroke-width:3;fill:none"/>`;
    };

    const top = pts.cabify.y;
    // work: first job up to Cabify, the latest commit
    line(X['0'], top, X['0'], pts.opinator.y, 'var(--ink)');
    // certifications: fork out of work, run alongside, commit, merge back
    for (const p of Object.values(pts)) {
      if (!p.cert) continue;
      const OUT = 44;
      const IN = 16;
      curve(X['0'], p.y + OUT, p.x, p.y + IN, 'var(--red)');
      line(p.x, p.y + IN, p.x, p.y - IN, 'var(--red)');
      curve(p.x, p.y - IN, X['0'], p.y - OUT, 'var(--red)');
    }
    // the BSc merges into work when it ends (first job)
    curve(X['1'], pts.bsc.y, X['0'], pts.opinator.y, 'var(--green)');
    // education: from the start up to the top (the master is still open)
    line(X['1'], H, X['1'], top, 'var(--green)');
    // maths branches off the master
    curve(X['1'], pts.msc.y, X['2'], pts.msc.y - 70, 'var(--green)');
    line(X['2'], top, X['2'], pts.msc.y - 70, 'var(--green)');

    // nodes, each with a short dashed connector towards its text
    for (const [id, p] of Object.entries(pts)) {
      const edge = p.lane === 0 && !narrow ? -14 : W + 14;
      s += `<path d="M${p.x} ${p.y} L${edge} ${p.y}" style="stroke:${p.color};stroke-width:1.5;stroke-dasharray:3 4;fill:none"/>`;
      if (id === 'cabify') s += `<circle class="pulse" cx="${p.x}" cy="${p.y}" r="8" style="fill:var(--orange)"/>`;
      const fill = id === 'cabify' ? 'var(--orange)' : id === 'maths' ? 'var(--green)' : 'var(--paper)';
      s += `<circle class="node" data-id="${id}" cx="${p.x}" cy="${p.y}" r="${p.cert ? 6 : 8}" style="fill:${fill};stroke:${p.color};stroke-width:3.5"/>`;
    }

    // hand-drawn wobble, same trick as the avatar on the home page
    const defs =
      '<defs><filter id="rails-boil" x="-30%" y="-2%" width="160%" height="104%">' +
      '<feTurbulence id="rails-noise" type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1" result="n"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';

    rails.setAttribute('viewBox', `0 0 ${W} ${H}`);
    rails.innerHTML = `${defs}<g filter="url(#rails-boil)">${s}</g>`;
  };

  draw();
  window.addEventListener('resize', draw);
  document.fonts?.ready.then(draw);

  /* hover: highlight the entry and grow its node */
  for (const row of rows) {
    const setHot = (on: boolean) => {
      row.classList.toggle('hot', on);
      rails.querySelector(`.node[data-id="${row.dataset.id}"]`)?.classList.toggle('hot', on);
    };
    row.addEventListener('pointerenter', () => setHot(true));
    row.addEventListener('pointerleave', () => setHot(false));
  }

  /* line boil: swap the noise seed a few times per second */
  if (!reduceMotion) {
    let seed = 1;
    setInterval(() => {
      if (document.hidden) return;
      seed = (seed % 4) + 1;
      document.getElementById('rails-noise')?.setAttribute('seed', String(seed));
    }, 140);
  }
}
