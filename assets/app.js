(() => {
  'use strict';
  window.__cf = true;

  // Contatos oficiais da ClickFocus (DDI + DDD + número para o WhatsApp).
  const WHATSAPP_BUSINESS = '5527992249680';
  const CONTACT_EMAIL = 'igorestevam1900@gmail.com';

  // Endereços dos sites demonstrativos. Depois de publicar no Vercel, cole a URL aqui
  // (ex.: 'https://solare-beach-tennis.vercel.app/') e o botão "Visitar site" aparece sozinho.
  const DEMO_URLS = {
    solare: '',
    veio: ''
  };
  Object.entries(DEMO_URLS).forEach(([id, url]) => {
    if (!/^https?:\/\//.test(url)) return;
    document.querySelectorAll(`[data-demo-link="${id}"]`).forEach(a => { a.href = url; a.hidden = false; });
    document.querySelectorAll(`[data-demo-host="${id}"]`).forEach(el => { el.textContent = url.replace(/^https?:\/\//, '').replace(/\/$/, ''); });
  });

  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  let vw = window.innerWidth;
  let vh = window.innerHeight;

  /* ---------- Intro do hero (após as fontes) ---------- */
  const startIntro = () => root.classList.add('is-loaded');
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 900))]).then(startIntro);
  } else startIntro();

  /* ---------- Divide textos em palavras ---------- */
  function splitWords(el, cls) {
    let i = 0;
    const walk = node => {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(document.createTextNode(part)); return; }
            const s = document.createElement('span');
            s.className = cls;
            s.style.setProperty('--i', i++);
            s.textContent = part;
            frag.append(s);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.getAttribute('aria-hidden') !== 'true') walk(child);
      });
    };
    walk(el);
    el.classList.add('is-split');
  }
  $$('[data-split]').forEach(el => splitWords(el, 'sw'));
  const manifesto = $('[data-manifesto]');
  let manWords = [];
  if (manifesto) { splitWords(manifesto, 'w'); manWords = $$('.w', manifesto); }

  /* ---------- Reveal ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.rv, [data-split], .tile').forEach(el => io.observe(el));
  } else {
    $$('.rv, [data-split], .tile').forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Cabeçalho e menu ---------- */
  const header = $('#site-header');
  const toggle = $('#menu-toggle');
  const menu = $('#mobile-menu');
  let menuOpen = false;
  if (menu) menu.inert = true;
  function setMenu(open) {
    menuOpen = open;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    root.classList.toggle('menu-open', open);
    document.body.classList.toggle('no-scroll', open);
    if (open) header.classList.remove('is-hidden');
  }
  toggle?.addEventListener('click', () => setMenu(!menuOpen));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  header?.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  const navLinks = $$('.hdr__nav a');
  const navTargets = navLinks.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);

  /* ---------- Visor de foco nos botões (cursor do sistema continua normal) ---------- */
  const cursor = $('#cursor');
  if (finePointer && !reduced && cursor) {
    const LOCKABLE = 'a, button, .chip, [data-lock]';
    const box = { cx: 0, cy: 0, w: 0, h: 0 };
    let lockEl = null, raf = 0;
    const paint = () => {
      cursor.style.transform = `translate3d(${box.cx - box.w / 2}px, ${box.cy - box.h / 2}px, 0)`;
      cursor.style.width = box.w + 'px';
      cursor.style.height = box.h + 'px';
    };
    const loop = () => {
      raf = 0;
      if (!lockEl || !lockEl.isConnected) return;
      const r = lockEl.getBoundingClientRect();
      const pad = 7;
      const tw = r.width + pad * 2, th = r.height + pad * 2;
      box.cx = lerp(box.cx, r.left + r.width / 2, 0.3);
      box.cy = lerp(box.cy, r.top + r.height / 2, 0.3);
      box.w = lerp(box.w, tw, 0.22);
      box.h = lerp(box.h, th, 0.22);
      paint();
      raf = requestAnimationFrame(loop);
    };
    document.addEventListener('pointerover', e => {
      if (e.pointerType !== 'mouse') return;
      const el = e.target instanceof Element ? e.target.closest(LOCKABLE) : null;
      if (!el || el === lockEl || el.getBoundingClientRect().width > 480) return;
      const r = el.getBoundingClientRect();
      if (!lockEl) {
        // Entra maior e "fecha" no botão, como um foco travando.
        box.cx = r.left + r.width / 2; box.cy = r.top + r.height / 2;
        box.w = r.width * 1.35 + 30; box.h = r.height * 1.35 + 30;
        paint();
      }
      lockEl = el;
      cursor.classList.add('is-on', 'is-locked');
      if (!raf) raf = requestAnimationFrame(loop);
    });
    document.addEventListener('pointerout', e => {
      if (!lockEl || e.pointerType !== 'mouse') return;
      const to = e.relatedTarget instanceof Element ? e.relatedTarget.closest(LOCKABLE) : null;
      if (to === lockEl) return;
      lockEl = null;
      cursor.classList.remove('is-on', 'is-locked');
    });
    window.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    window.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  }

  /* ---------- Botões magnéticos e brilho ---------- */
  if (finePointer && !reduced) {
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.32}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }
  $$('.btn--primary').forEach(el => el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--bx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--by', (e.clientY - r.top) + 'px');
  }));
  $$('[data-spot]').forEach(el => el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* ---------- Campo de foco do hero (canvas) ---------- */
  const hero = $('#hero');
  const canvas = $('#focus-field');
  const hud = $('#hud-coords');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let pts = [], W = 0, H = 0, raf = 0, heroVisible = true;
    const fp = { x: 0, y: 0, tx: 0, ty: 0, active: false };
    const build = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = W < 640 ? 24 : 30;
      pts = [];
      const ox = (W % gap) / 2, oy = (H % gap) / 2;
      for (let y = oy; y <= H; y += gap) for (let x = ox; x <= W; x += gap) pts.push(x, y);
      if (!fp.active) { fp.x = fp.tx = W * 0.66; fp.y = fp.ty = H * 0.42; }
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const R = W < 640 ? 150 : 240, R2 = R * R, cx = fp.x, cy = fp.y;
      // linhas de mira
      ctx.strokeStyle = 'rgba(139, 61, 255, 0.13)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
      ctx.fillStyle = 'rgba(201, 184, 255, 0.13)';
      ctx.beginPath();
      const near = [];
      for (let i = 0; i < pts.length; i += 2) {
        const x = pts[i], y = pts[i + 1], dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy;
        if (d2 < R2) near.push(x, y, dx, dy, d2);
        else ctx.rect(x - 0.75, y - 0.75, 1.5, 1.5);
      }
      ctx.fill();
      for (let j = 0; j < near.length; j += 5) {
        const d = Math.sqrt(near[j + 4]) || 1;
        const t = 1 - d / R;
        const e = t * t * (3 - 2 * t);
        const px = near[j] + (near[j + 2] / d) * e * 16;
        const py = near[j + 1] + (near[j + 3] / d) * e * 16;
        ctx.fillStyle = `hsla(${266 - e * 12}, 100%, ${72 + e * 18}%, ${0.16 + e * 0.84})`;
        ctx.beginPath(); ctx.arc(px, py, 0.8 + e * 2.4, 0, Math.PI * 2); ctx.fill();
      }
      // visor desenhado enquanto o foco se move sozinho
      if (!fp.active) {
        const s = 22, c = 8;
        ctx.strokeStyle = 'rgba(201, 184, 255, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
          const x = cx + sx * s, y = cy + sy * s;
          ctx.moveTo(x, y - sy * c); ctx.lineTo(x, y); ctx.lineTo(x - sx * c, y);
        });
        ctx.stroke();
      }
    };
    const frame = t => {
      if (!fp.active) {
        fp.tx = W * (0.58 + 0.24 * Math.sin(t * 0.00032));
        fp.ty = H * (0.42 + 0.16 * Math.sin(t * 0.00047 + 1.3));
      }
      fp.x = lerp(fp.x, fp.tx, 0.08);
      fp.y = lerp(fp.y, fp.ty, 0.08);
      draw();
      if (hud) hud.textContent = 'X ' + String(Math.round(fp.x)).padStart(4, '0') + ' · Y ' + String(Math.round(fp.y)).padStart(4, '0');
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && heroVisible && !document.hidden && !reduced) raf = requestAnimationFrame(frame); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    build();
    if (reduced) draw(); else start();
    hero.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = canvas.getBoundingClientRect();
      fp.active = true; fp.tx = e.clientX - r.left; fp.ty = e.clientY - r.top;
    });
    hero.addEventListener('pointerleave', () => { fp.active = false; });
    new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; heroVisible ? start() : stop(); }).observe(hero);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    window.addEventListener('resize', () => { build(); if (reduced) draw(); });
  }

  /* ---------- Comparador ---------- */
  const cmp = $('#compare');
  if (cmp) {
    const range = $('.cmp__range', cmp);
    let dragging = false, touched = false;
    const set = v => { v = clamp(v, 0, 100); cmp.style.setProperty('--pos', v + '%'); range.value = Math.round(v); };
    const fromEvent = e => { const r = cmp.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); };
    cmp.addEventListener('pointerdown', e => {
      dragging = true; touched = true; cmp.classList.add('is-dragging');
      cmp.setPointerCapture?.(e.pointerId);
      if (e.pointerType !== 'touch') fromEvent(e);
    });
    cmp.addEventListener('pointermove', e => { if (dragging) fromEvent(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => cmp.addEventListener(ev, () => { dragging = false; cmp.classList.remove('is-dragging'); }));
    range.addEventListener('input', () => { touched = true; set(+range.value); });
    if (!reduced && 'IntersectionObserver' in window) {
      const hint = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return;
        hint.disconnect();
        const keys = [[0, 50], [900, 24], [1900, 76], [2800, 50]];
        const t0 = performance.now() + 500;
        const step = now => {
          if (touched) return;
          const t = now - t0;
          if (t < 0) { requestAnimationFrame(step); return; }
          let k = 0;
          while (k < keys.length - 2 && t > keys[k + 1][0]) k++;
          const [ta, va] = keys[k], [tb, vb] = keys[k + 1];
          const p = clamp((t - ta) / (tb - ta));
          const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          set(lerp(va, vb, e));
          if (t < keys[keys.length - 1][0]) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }, { threshold: 0.55 });
      hint.observe(cmp);
    }
  }

  /* ---------- Demos dos serviços ---------- */
  function whenVisible(el, onIn, onOut) {
    if (!el || !('IntersectionObserver' in window)) { onIn?.(); return; }
    new IntersectionObserver(([en]) => (en.isIntersecting ? onIn() : onOut?.()), { threshold: 0.3 }).observe(el);
  }
  const brand = $('[data-brand-cycle]');
  if (brand) {
    const themes = [
      { bg: '#F7EEDF', fg: '#0D2B3A', ac: '#FF7A3D', font: "'Space Grotesk', sans-serif", style: 'normal', name: 'Arena de beach tennis', mood: 'Ensolarada', sw: ['#F7EEDF', '#0D2B3A', '#0B8A8F', '#FF7A3D'] },
      { bg: '#2A1F17', fg: '#F5F0E8', ac: '#C48D57', font: "'Cormorant Garamond', serif", style: 'normal', name: 'Marcenaria', mood: 'Artesanal', sw: ['#F5F0E8', '#C48D57', '#6E7A57', '#2A1F17'] },
      { bg: '#F6F1E7', fg: '#2F3B2F', ac: '#6F8F72', font: "'Cormorant Garamond', serif", style: 'normal', name: 'Clínica de estética', mood: 'Acolhedora', sw: ['#FBF8F1', '#EDE3D1', '#93A88F', '#C9A55B'] },
      { bg: '#0A0A0B', fg: '#FAFAFA', ac: '#FF2E3D', font: "'Space Grotesk', sans-serif", style: 'italic', name: 'Academia', mood: 'Energia', sw: ['#0A0A0B', '#FF2E3D', '#FAFAFA', '#2A2A2E'] }
    ];
    const name = $('.db__name', brand), mood = $('.db__mood', brand), sws = $$('.db__sw i', brand);
    let bi = 0, timer = 0;
    const apply = th => {
      brand.style.setProperty('--db-bg', th.bg); brand.style.setProperty('--db-fg', th.fg);
      brand.style.setProperty('--db-ac', th.ac); brand.style.setProperty('--db-font', th.font);
      brand.style.setProperty('--db-style', th.style);
      name.textContent = th.name; mood.textContent = th.mood;
      sws.forEach((s, i) => { s.style.background = th.sw[i]; });
    };
    const tick = () => { bi = (bi + 1) % themes.length; apply(themes[bi]); };
    apply(themes[0]);
    if (!reduced) whenVisible(brand, () => { if (!timer) timer = setInterval(tick, 2400); }, () => { clearInterval(timer); timer = 0; });
  }

  const copy = $('[data-copy]');
  if (copy && !reduced) {
    const before = $('[data-copy-before]', copy), after = $('[data-copy-after]', copy);
    const pairs = [
      ['Bem-vindo ao nosso site', 'Aula experimental de beach tennis, com raquete emprestada.'],
      ['Somos uma empresa de qualidade', 'Cozinha planejada sob medida, do projeto à montagem.'],
      ['Clique aqui', 'Pedir orçamento pelo WhatsApp']
    ];
    let pi = 0, running = false, token = 0;
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const run = async my => {
      while (running && my === token) {
        const [b, a] = pairs[pi];
        before.textContent = b; after.textContent = '';
        await wait(700);
        for (let i = 1; i <= a.length && running && my === token; i++) { after.textContent = a.slice(0, i); await wait(34 + Math.random() * 40); }
        await wait(2400);
        pi = (pi + 1) % pairs.length;
      }
    };
    whenVisible(copy, () => { if (!running) { running = true; run(++token); } }, () => { running = false; });
  }

  /* ---------- Portfólio: rolagem horizontal fixada ---------- */
  const works = $('#portfolio');
  const track = $('#works-track');
  const sticky = $('#works-sticky');
  const worksBar = $('#works-bar');
  const pinMQ = window.matchMedia('(min-width: 1024px) and (min-height: 620px)');
  let pinOn = false, maxX = 0;
  function measureWorks() {
    if (!works) return;
    const want = pinMQ.matches && !reduced;
    works.classList.toggle('is-pinned', want);
    pinOn = want;
    if (!want) { works.style.height = ''; track.style.transform = ''; return; }
    maxX = Math.max(0, track.scrollWidth - vw);
    works.style.height = (maxX + vh) + 'px';
  }
  function updateWorks() {
    if (!pinOn) return;
    const r = works.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1, works.offsetHeight - vh));
    track.style.transform = `translate3d(${-p * maxX}px, 0, 0)`;
    if (worksBar) worksBar.style.transform = `scaleX(${p})`;
  }
  // Ao navegar por teclado, leva a rolagem até o painel focado.
  track?.addEventListener('focusin', e => {
    if (!pinOn) return;
    sticky.scrollLeft = 0;
    const panel = e.target.closest('.proj, .works__intro, .works__outro');
    if (!panel) return;
    const x = clamp(panel.offsetLeft - (vw - panel.offsetWidth) / 2, 0, maxX);
    const top = works.offsetTop + (maxX ? (x / maxX) * (works.offsetHeight - vh) : 0);
    window.scrollTo({ top, behavior: 'auto' });
  });

  /* ---------- Processo ---------- */
  const stepsEl = $('#steps');
  const steps = $$('.step');
  const stepsFill = $('#steps-fill');
  const stepNum = $('#step-num');
  function updateProcess() {
    if (!stepsEl) return;
    const r = stepsEl.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) return;
    const p = clamp((vh * 0.6 - r.top) / r.height);
    stepsFill.style.transform = `scaleY(${p})`;
    let active = 0;
    steps.forEach((s, i) => { if (s.getBoundingClientRect().top < vh * 0.6) active = i; });
    steps.forEach((s, i) => { s.classList.toggle('is-active', i === active); s.classList.toggle('is-past', i < active); });
    if (stepNum) stepNum.textContent = String(active + 1).padStart(2, '0');
  }

  /* ---------- Manifesto ---------- */
  let manLit = -1;
  function updateManifesto() {
    if (!manifesto || reduced) return;
    const r = manifesto.getBoundingClientRect();
    if (r.bottom < -100 || r.top > vh + 100) return;
    const p = clamp((vh * 0.85 - r.top) / (vh * 0.4 + r.height));
    const n = Math.round(p * manWords.length);
    if (n !== manLit) { manWords.forEach((w, i) => w.classList.toggle('on', i < n)); manLit = n; }
  }

  /* ---------- Ticker com inclinação pela velocidade ---------- */
  const ticker = $('#ticker');
  let skew = 0, skewRaf = 0;
  function kickTicker(dy) {
    if (!ticker || reduced) return;
    skew = clamp(skew + dy * -0.04, -7, 7);
    if (!skewRaf) skewRaf = requestAnimationFrame(decay);
  }
  function decay() {
    skew *= 0.9;
    ticker.style.transform = `skewX(${skew.toFixed(2)}deg)`;
    if (Math.abs(skew) > 0.02) skewRaf = requestAnimationFrame(decay);
    else { ticker.style.transform = ''; skewRaf = 0; }
  }

  /* ---------- Dock mobile ---------- */
  const dock = $('#dock');
  const contact = $('#contato');
  const footer = $('#footer');
  let contactVisible = false;
  if (contact && 'IntersectionObserver' in window) {
    const dio = new IntersectionObserver(es => { es.forEach(en => { en.target.dataset.vis = en.isIntersecting ? '1' : ''; }); contactVisible = contact.dataset.vis === '1' || footer.dataset.vis === '1'; onScroll(); }, { threshold: 0.05 });
    dio.observe(contact); dio.observe(footer);
  }

  /* ---------- Loop de rolagem ---------- */
  const progress = $('#scroll-progress');
  let lastY = window.scrollY, ticking = false;
  function onScroll() {
    const y = window.scrollY;
    const dy = y - lastY;
    header.classList.toggle('is-scrolled', y > 20);
    if (!menuOpen && !header.contains(document.activeElement)) {
      if (dy > 4 && y > 500) header.classList.add('is-hidden');
      else if (dy < -4 || y < 500) header.classList.remove('is-hidden');
    }
    const max = document.documentElement.scrollHeight - vh;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (dock) dock.classList.toggle('is-visible', y > vh * 0.8 && !contactVisible && !menuOpen);
    let current = null;
    navTargets.forEach((t, i) => { if (t.getBoundingClientRect().top < vh * 0.4) current = i; });
    navLinks.forEach((a, i) => a.classList.toggle('is-active', i === current));
    kickTicker(dy);
    updateManifesto();
    updateWorks();
    updateProcess();
    lastY = y;
  }
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; onScroll(); });
  }, { passive: true });
  window.addEventListener('resize', () => {
    vw = window.innerWidth; vh = window.innerHeight;
    if (vw >= 1024 && menuOpen) setMenu(false);
    measureWorks(); onScroll();
  });
  measureWorks();
  onScroll();
  document.fonts?.ready.then(() => { measureWorks(); onScroll(); });
  window.addEventListener('load', () => { measureWorks(); onScroll(); });

  /* ---------- Rodapé: marca iluminada pelo cursor ---------- */
  const mark = $('#footer-mark');
  if (mark && finePointer) {
    footer.addEventListener('pointermove', e => {
      const r = mark.getBoundingClientRect();
      mark.style.setProperty('--fx', ((e.clientX - r.left) / r.width) * 100 + '%');
      mark.style.setProperty('--fy', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  }

  /* ---------- Modais do portfólio ---------- */
  let activeModal = null;
  let previousFocus = null;
  function closeModal() {
    if (!activeModal) return;
    activeModal.classList.remove('is-open');
    activeModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    activeModal = null;
    previousFocus?.focus({ preventScroll: true });
  }
  function openModal(id, opener) {
    const next = document.getElementById('project-' + id);
    if (!next) return;
    if (menuOpen) setMenu(false);
    closeModal();
    previousFocus = opener;
    activeModal = next;
    next.classList.add('is-open');
    next.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    $('.modal__close', next)?.focus({ preventScroll: true });
  }
  $$('[data-project]').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.project, btn)));
  $$('[data-open-project]').forEach(media => media.addEventListener('click', () => {
    const id = media.dataset.openProject;
    openModal(id, $(`[data-project="${id}"]`));
  }));
  $$('.modal').forEach(modal => {
    $('.modal__close', modal)?.addEventListener('click', closeModal);
    $$('[data-close-modal]', modal).forEach(a => a.addEventListener('click', closeModal));
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); if (menuOpen) { setMenu(false); toggle.focus(); } }
    if (e.key === 'Tab' && activeModal) {
      const nodes = $$('button:not([disabled]), a[href], input, select, textarea', activeModal).filter(el => el.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- FAQ ---------- */
  const faqTriggers = $$('.faq__trigger');
  faqTriggers.forEach(btn => btn.addEventListener('click', () => {
    const nowOpen = btn.getAttribute('aria-expanded') !== 'true';
    faqTriggers.forEach(other => {
      other.setAttribute('aria-expanded', 'false');
      other.closest('.faq__item')?.classList.remove('is-open');
    });
    btn.setAttribute('aria-expanded', String(nowOpen));
    btn.closest('.faq__item')?.classList.toggle('is-open', nowOpen);
  }));

  /* ---------- Contatos configurados ---------- */
  const emailLink = $('#contact-email-link');
  if (emailLink && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT_EMAIL)) emailLink.href = 'mailto:' + CONTACT_EMAIL;
  const activeBusiness = /^\d{12,13}$/.test(WHATSAPP_BUSINESS);
  const submitLabel = $('#contact-submit-label');
  const disclosure = $('#form-disclosure');
  const waLink = $('#whatsapp-link');
  if (!activeBusiness) {
    if (submitLabel) submitLabel.textContent = 'Copiar meu briefing';
    if (disclosure) disclosure.textContent = 'O canal de atendimento está sendo preparado. Por enquanto, o formulário apenas copia o briefing: nenhuma solicitação é enviada à ClickFocus.';
    if (waLink) waLink.hidden = true;
  } else if (waLink) {
    waLink.href = 'https://wa.me/' + WHATSAPP_BUSINESS + '?text=' + encodeURIComponent('Olá! Encontrei a ClickFocus pelo site e gostaria de solicitar um orçamento.');
  }

  /* ---------- Formulário + prévia ao vivo ---------- */
  const form = $('#contact-form');
  const feedback = $('#contact-feedback');
  const preview = $('#brief-preview');
  const previewTime = $('#brief-time');
  function buildBriefing(data, placeholder) {
    const v = (k, fb) => String(data.get(k) || '').trim() || fb;
    return [
      'Olá, ClickFocus! Gostaria de solicitar um orçamento de landing page.',
      'Nome: ' + v('name', placeholder ? '—' : ''),
      'E-mail: ' + v('email', placeholder ? '—' : ''),
      'WhatsApp: ' + v('phone', 'Não informado'),
      'Projeto: ' + v('projectType', ''),
      'Sobre: ' + v('message', placeholder ? '—' : '')
    ].join('\n');
  }
  function updatePreview() {
    if (!form || !preview) return;
    preview.textContent = buildBriefing(new FormData(form), true);
    if (previewTime) {
      const d = new Date();
      previewTime.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    }
  }
  form?.addEventListener('input', updatePreview);
  form?.addEventListener('change', updatePreview);
  updatePreview();

  function notify(message, type) {
    feedback.textContent = message;
    feedback.className = 'form__feedback is-visible form__feedback--' + type;
  }
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      notify('Confira os campos obrigatórios antes de continuar.', 'err');
      return;
    }
    const briefing = buildBriefing(new FormData(form), false);
    if (activeBusiness) {
      window.open('https://wa.me/' + WHATSAPP_BUSINESS + '?text=' + encodeURIComponent(briefing), '_blank', 'noopener,noreferrer');
      notify('O WhatsApp foi solicitado em uma nova aba. Se seu navegador bloquear a abertura, permita o pop-up e tente novamente. Revise e envie a mensagem no aplicativo.', 'ok');
      return;
    }
    let copied = false;
    try { await navigator.clipboard.writeText(briefing); copied = true; } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = briefing; document.body.append(ta); ta.select();
      copied = document.execCommand('copy'); ta.remove();
    }
    if (copied) notify('Seu texto foi copiado, mas ainda não há um canal de atendimento ativo. Nada foi enviado para a ClickFocus. Guarde o briefing para enviar quando o WhatsApp estiver disponível.', 'ok');
    else notify('O contato ainda não está disponível e não foi possível copiar o texto automaticamente. Seus dados não foram enviados.', 'err');
  });
})();
