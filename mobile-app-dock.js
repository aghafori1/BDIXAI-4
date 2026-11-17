(() => {
  'use strict';

  const breakpoint = window.matchMedia('(max-width: 850px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const copy = {
    ar: { nav: 'التنقل الرئيسي', home: 'الرئيسية', services: 'الخدمات', work: 'الأعمال', process: 'المنهج', about: 'من نحن', contact: 'تواصل' },
    fa: { nav: 'ناوبری اصلی', home: 'خانه', services: 'خدمات', work: 'نمونه‌ها', process: 'فرایند', about: 'درباره', contact: 'تماس' },
    en: { nav: 'Primary navigation', home: 'Home', services: 'Services', work: 'Work', process: 'Process', about: 'About', contact: 'Contact' },
  };
  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 11 8-7 8 7v9H4z"/><path d="M9 20v-6h6v6"/></svg>',
    services: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.2"/><rect x="14" y="4" width="6" height="6" rx="1.2"/><rect x="4" y="14" width="6" height="6" rx="1.2"/><rect x="14" y="14" width="6" height="6" rx="1.2"/></svg>',
    work: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16v11H4z"/><path d="M9 8V6h6v2M4 12h16"/></svg>',
    process: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="17" r="2"/><circle cx="18" cy="7" r="2"/><path d="M8 17c6 0 4-10 8-10"/></svg>',
    about: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="8" r="1"/><path d="M12 11v6"/></svg>',
    contact: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M5 20c0-3 3.1-5 7-5s7 2 7 5"/></svg>',
  };
  const items = [
    { key: 'home', icon: icons.home, hash: 'page-top' },
    { key: 'services', icon: icons.services, hash: 'services' },
    { key: 'work', icon: icons.work, hash: 'work' },
    { key: 'process', icon: icons.process, hash: 'process' },
    { key: 'about', icon: icons.about, hash: 'about' },
    { key: 'contact', icon: icons.contact, contact: true },
  ];

  const style = document.createElement('style');
  style.textContent = `
    .mobile-app-dock{position:fixed!important;z-index:70!important;left:50%!important;right:auto!important;top:auto!important;bottom:max(8px,env(safe-area-inset-bottom))!important;display:none!important;width:min(calc(100% - 24px),430px)!important;height:70px!important;transform:translateX(-50%)!important;padding:5px 7px!important;border:1px solid rgba(91,188,255,.18)!important;border-radius:21px!important;background:rgba(6,11,19,.84)!important;box-shadow:0 16px 42px #000b,inset 0 1px 1px #ffffff12,0 0 1.6rem rgba(40,123,255,.1)!important;backdrop-filter:blur(16px) saturate(125%)!important;grid-template-columns:repeat(6,1fr)!important;align-items:center!important;pointer-events:auto!important}
    .mobile-app-dock a{position:relative!important;display:flex!important;min-width:0!important;min-height:58px!important;padding:5px 2px!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;border:0!important;border-radius:14px!important;color:rgba(212,224,242,.68)!important;background:transparent!important;text-decoration:none!important;line-height:1!important;transition:color 160ms ease,background-color 160ms ease}
    .mobile-app-dock a:before{content:"";position:absolute;top:2px;width:0;height:2px;border-radius:999px;background:var(--blue,#287BFF);box-shadow:0 0 10px rgba(40,123,255,.8);opacity:0;transition:width 180ms ease,opacity 180ms ease}
    .mobile-app-dock a[aria-current]{color:#eef7ff!important;background:linear-gradient(180deg,rgba(40,123,255,.12),transparent 72%)!important}
    .mobile-app-dock a[aria-current]:before{width:23px;opacity:1}
    .mobile-app-dock svg{width:20px!important;height:20px!important;max-width:none!important;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}
    .mobile-app-dock .mad-label{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--font-body,system-ui);font-size:9.5px;font-weight:600;line-height:12px}
    @media(max-width:850px){.mobile-app-dock{display:grid!important}.has-mobile-app-dock .site-footer{padding-bottom:calc(88px + env(safe-area-inset-bottom))}}
    @media(max-width:350px){.mobile-app-dock{height:66px!important}.mobile-app-dock a{min-height:54px!important}.mobile-app-dock .mad-label{font-size:8.5px}}
    @media(prefers-reduced-motion:reduce){.mobile-app-dock a,.mobile-app-dock a:before{transition:none}}
  `;
  document.head.append(style);

  const nav = document.createElement('nav');
  nav.className = 'mobile-app-dock';
  let observedKey = 'home';
  let frame = 0;

  const language = () => {
    const value = (document.documentElement.lang || 'ar').toLowerCase();
    return copy[value] ? value : 'en';
  };
  const isContact = () => /contact\.html$/.test(location.pathname);
  const urlFor = (item, lang) => item.contact
    ? `contact.html?lang=${encodeURIComponent(lang)}`
    : `index.html?lang=${encodeURIComponent(lang)}#${item.hash}`;
  const activeKey = () => isContact() ? 'contact' : observedKey;

  const updateCurrent = () => {
    const current = activeKey();
    nav.querySelectorAll('[data-dock-key]').forEach((link) => {
      const active = link.dataset.dockKey === current;
      if (active) link.setAttribute('aria-current', isContact() ? 'page' : 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const render = () => {
    const lang = language();
    const labels = copy[lang];
    nav.setAttribute('aria-label', labels.nav);
    nav.innerHTML = items.map((item) => `<a href="${urlFor(item, lang)}" data-dock-key="${item.key}" aria-label="${labels[item.key]}">${item.icon}<span class="mad-label">${labels[item.key]}</span></a>`).join('');
    updateCurrent();
  };

  const detectSection = () => {
    frame = 0;
    if (isContact() || !breakpoint.matches) {
      updateCurrent();
      return;
    }
    const probe = Math.min(window.innerHeight * 0.38, 330);
    let next = 'home';
    for (const item of items) {
      if (!item.hash) continue;
      const section = document.getElementById(item.hash);
      if (section && section.getBoundingClientRect().top <= probe) next = item.key;
    }
    if (next !== observedKey) {
      observedKey = next;
      updateCurrent();
    }
  };

  const scheduleDetection = () => {
    if (!frame) frame = requestAnimationFrame(detectSection);
  };

  const onDockClick = (event) => {
    const link = event.target.closest('[data-dock-key]');
    if (!link || isContact() || link.dataset.dockKey === 'contact') return;
    const item = items.find((entry) => entry.key === link.dataset.dockKey);
    const section = item && document.getElementById(item.hash);
    if (!section) return;
    event.preventDefault();
    observedKey = item.key;
    updateCurrent();
    history.replaceState(null, '', `#${item.hash}`);
    if (item.key === 'home') {
      const rootStyle = document.documentElement.style;
      const previousScrollBehavior = rootStyle.scrollBehavior;
      rootStyle.scrollBehavior = 'auto';
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      requestAnimationFrame(() => {
        rootStyle.scrollBehavior = previousScrollBehavior;
        scheduleDetection();
      });
      return;
    }
    section.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  };

  const sync = () => {
    document.body.classList.toggle('has-mobile-app-dock', breakpoint.matches);
    render();
    scheduleDetection();
  };
  const observer = new MutationObserver(() => {
    render();
    scheduleDetection();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
  nav.addEventListener('click', onDockClick);
  window.addEventListener('scroll', scheduleDetection, { passive: true });
  window.addEventListener('resize', scheduleDetection, { passive: true });
  window.addEventListener('hashchange', scheduleDetection);
  breakpoint.addEventListener('change', sync);
  document.body.append(nav);
  sync();

  window.__bdixMobileAppDock = {
    get visible() { return breakpoint.matches; },
    get active() { return activeKey(); },
    refresh: scheduleDetection,
    destroy: () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      nav.removeEventListener('click', onDockClick);
      window.removeEventListener('scroll', scheduleDetection);
      window.removeEventListener('resize', scheduleDetection);
      window.removeEventListener('hashchange', scheduleDetection);
      breakpoint.removeEventListener('change', sync);
      document.body.classList.remove('has-mobile-app-dock');
      nav.remove();
      style.remove();
    },
  };
})();
