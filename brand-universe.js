(() => {
  'use strict';

  const root = document.querySelector('[data-brand-universe]');
  if (!root) return;

  const tablist = document.getElementById('bu-topic-tabs');
  const tabs = [...document.querySelectorAll('[role="tab"][data-bu-topic]')];
  const panels = new Map(
    [...root.querySelectorAll('[role="tabpanel"][data-bu-panel]')].map((panel) => [
      panel.dataset.buPanel,
      panel,
    ]),
  );
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sharedVisual = document.querySelector('.hb-visual');
  const topicLinks = [...document.querySelectorAll('[data-bu-select]')];

  if (!tablist || tabs.length !== 5 || panels.size !== tabs.length || topicLinks.length !== tabs.length) return;

  const keepMobilePanelVisible = (panel) => {
    if (window.innerWidth > 850) return;
    const dock = document.querySelector('.mobile-app-dock');
    if (!dock) return;

    const panelBottom = panel.getBoundingClientRect().bottom;
    const visibleBottom = dock.getBoundingClientRect().top - 16;
    if (panelBottom > visibleBottom) {
      window.scrollBy({
        top: panelBottom - visibleBottom,
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
      });
    }
  };

  const activate = (tab, { focus = false, animate = false } = {}) => {
    const topic = tab.dataset.buTopic;
    const panel = panels.get(topic);
    if (!panel) return;

    const changed = root.dataset.activeTopic !== topic;
    root.dataset.activeTopic = topic;
    if (sharedVisual) sharedVisual.dataset.buTopic = topic;

    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    topicLinks.forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.buSelect === topic)));

    panels.forEach((item, key) => {
      item.hidden = key !== topic;
    });

    if (focus) tab.focus({ preventScroll: true });
    if (animate && changed && !reducedMotion.matches && typeof panel.animate === 'function') {
      panel.animate(
        [
          { opacity: 0, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 280, easing: 'cubic-bezier(.2,.72,.2,1)' },
      );
    }
    if (animate) keepMobilePanelVisible(panel);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab, { animate: true }));
  });
  topicLinks.forEach((button) => {
    button.addEventListener('click', () => {
      const tab = tabs.find((item) => item.dataset.buTopic === button.dataset.buSelect);
      if (tab) activate(tab, { animate: true });
    });
  });

  tablist.addEventListener('keydown', (event) => {
    const current = tabs.indexOf(event.target.closest('[role="tab"]'));
    if (current < 0) return;

    let next = current;
    const rtl = document.documentElement.dir === 'rtl';
    const forwardKey = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backwardKey = rtl ? 'ArrowRight' : 'ArrowLeft';

    if (event.key === forwardKey) next = (current + 1) % tabs.length;
    else if (event.key === backwardKey) next = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;

    event.preventDefault();
    activate(tabs[next], { focus: true, animate: true });
  });

  const initialTab = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
  activate(initialTab);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      ([entry]) => root.classList.toggle('is-in-view', entry.isIntersecting),
      { threshold: 0.12 },
    );
    observer.observe(root);
  } else {
    root.classList.add('is-in-view');
  }
})();