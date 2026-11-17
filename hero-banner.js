(() => {
  'use strict';
  const root = document.querySelector('.hero-banner');
  if (!root) return;

  const slides = [...root.querySelectorAll('.hb-slide')];
  const dotsWrap = root.querySelector('.hb-dots');
  const storyVisual = document.querySelector('.hb-visual');
  const continuum = root.closest('.story-continuum');
  if (slides.length < 2 || !dotsWrap) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const ROTATE_MS = 6000;
  let index = 0, timer = 0, transitionTimer = 0, paused = false, visible = true, pageVisible = !document.hidden;

  const playCinematicTransition = () => {
    if (reduce.matches) return;
    clearTimeout(transitionTimer);
    root.classList.remove('is-transitioning');
    storyVisual?.classList.remove('is-transitioning');
    continuum?.classList.remove('is-transitioning');
    // Restart the short, synchronized light/scale sequence for each slide change.
    void root.offsetWidth;
    root.classList.add('is-transitioning');
    storyVisual?.classList.add('is-transitioning');
    continuum?.classList.add('is-transitioning');
    transitionTimer = window.setTimeout(() => {
      root.classList.remove('is-transitioning');
      storyVisual?.classList.remove('is-transitioning');
      continuum?.classList.remove('is-transitioning');
    }, 1250);
  };

  /* ---- word-by-word reveal ---------------------------------------------- */
  const splitWords = () => {
    slides.forEach((slide) => {
      const target = slide.querySelector('.hb-title');
      if (!target) return;
      // Use the current localized markup. The language switcher rewrites
      // [data-h] before the document's lang/dir mutation reaches this observer.
      const walk = (node) => {
        [...node.childNodes].forEach((child) => {
          if (child.nodeType === 3) {
            const parts = child.textContent.split(/(\s+)/);
            if (!parts.some((p) => p.trim())) return;
            const frag = document.createDocumentFragment();
            parts.forEach((p) => {
              if (!p.trim()) { frag.append(document.createTextNode(p)); return; }
              const s = document.createElement('span');
              s.className = 'hb-w';
              s.textContent = p;
              frag.append(s);
            });
            node.replaceChild(frag, child);
          } else if (child.nodeType === 1) walk(child);
        });
      };
      walk(target);
      [...target.querySelectorAll('.hb-w')].forEach((s, i) =>
        s.style.setProperty('--hb-d', `${120 + i * 70}ms`));
    });
  };

  /* ---- dots -------------------------------------------------------------- */
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'hb-dot';
    b.setAttribute('role', 'tab');
    b.tabIndex = -1;
    b.addEventListener('click', (e) => { e.stopPropagation(); go(i, true); });
    dotsWrap.append(b);
    return b;
  });

  const label = () => {
    const l = (document.documentElement.lang || 'ar').toLowerCase();
    return { ar: 'الرسالة', fa: 'پیام', en: 'Message' }[l] || 'Message';
  };

  const paint = () => {
    slides.forEach((s, i) => {
      s.toggleAttribute('data-hb-active', i === index);
      s.setAttribute('aria-hidden', String(i !== index));
    });
    dots.forEach((d, i) => {
      d.toggleAttribute('data-hb-active', i === index);
      d.setAttribute('aria-selected', String(i === index));
      d.setAttribute('aria-label', `${label()} ${i + 1}`);
      d.tabIndex = i === index ? 0 : -1;
    });
  };

  const go = (i, manual = false) => {
    const nextIndex = ((i % slides.length) + slides.length) % slides.length;
    if (nextIndex !== index) playCinematicTransition();
    index = nextIndex;
    paint();
    if (manual) restart();
  };

  const stop = () => { clearTimeout(timer); timer = 0; };
  const restart = () => {
    stop();
    if (reduce.matches || paused || !visible || !pageVisible) return;
    timer = setTimeout(() => { go(index + 1); restart(); }, ROTATE_MS);
  };

  /* ---- interaction ------------------------------------------------------- */
  root.addEventListener('pointerenter', () => { paused = true; stop(); });
  root.addEventListener('pointerleave', () => { paused = false; restart(); });
  root.addEventListener('focusin', () => { paused = true; stop(); });
  root.addEventListener('focusout', () => { paused = false; restart(); });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1, true); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1, true); }
  });
  document.addEventListener('visibilitychange', () => { pageVisible = !document.hidden; restart(); });

  let startX = null, startY = null;
  root.addEventListener('pointerdown', (e) => { startX = e.clientX; startY = e.clientY; });
  root.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    startX = startY = null;
    if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1), true);
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      restart();
    }, { threshold: 0.15 }).observe(root);
  }

  reduce.addEventListener?.('change', () => { restart(); });

  // the inline i18n engine rewrites [data-h] on language change — re-split after it
  new MutationObserver(() => { splitWords(); paint(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });

  splitWords();
  paint();
  restart();

  window.__bdixHeroBanner = {
    get index() { return index; },
    get count() { return slides.length; },
    get rotating() { return Boolean(timer); },
    get paused() { return paused; },
    next: () => go(index + 1, true),
    previous: () => go(index - 1, true),
    goTo: (i) => go(i, true),
    resplit: splitWords
  };
})();
