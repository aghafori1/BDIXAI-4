(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  const scene = document.querySelector('.hero-cinema');
  if (!hero || !scene) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = true;
  let documentVisible = !document.hidden;

  const sync = () => {
    scene.dataset.running = String(!reduced && visible && documentVisible);
  };

  const observer = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? true;
    sync();
  }, { rootMargin: '80px', threshold: 0.01 });

  observer.observe(hero);
  document.addEventListener('visibilitychange', () => {
    documentVisible = !document.hidden;
    sync();
  });

  sync();
  window.__bdixHeroCinema = {
    mode: 'css-generative',
    reduced,
    get running() { return scene.dataset.running === 'true'; },
  };
})();
