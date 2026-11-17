(() => {
  'use strict';

  const header = document.querySelector('header');
  const mainMenu = document.querySelector('#nav');
  const assessmentTrigger = document.querySelector('[data-open]');
  if (!header || !assessmentTrigger) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopNavigation = window.matchMedia('(min-width: 851px)');
  const root = document.createElement('nav');
  root.className = 'adaptive-radial-nav';
  root.setAttribute('aria-hidden', 'true');

  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5m-5 5 5-5 5 5"/></svg>',
    services: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="5" height="5"/><rect x="14" y="5" width="5" height="5"/><rect x="5" y="14" width="5" height="5"/><rect x="14" y="14" width="5" height="5"/></svg>',
    work: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 7 8-7 8-7-8 7-8Z"/></svg>',
    process: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="17" r="2"/><circle cx="18" cy="7" r="2"/><path d="M8 17c6 0 4-10 8-10"/></svg>',
    about: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M5 20c0-3 3.1-5 7-5s7 2 7 5"/></svg>',
    contact: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14v10H5z"/><path d="m5 8 7 5 7-5"/></svg>',
  };

  const translations = {
    ar: { nav: 'تنقل سريع', open: 'فتح التنقل السريع', close: 'إغلاق التنقل السريع', home: 'الرئيسية', services: 'الخدمات', work: 'الأعمال', process: 'المنهج', about: 'من نحن', contact: 'طلب تقييم' },
    fa: { nav: 'ناوبری سریع', open: 'بازکردن ناوبری سریع', close: 'بستن ناوبری سریع', home: 'صفحه اصلی', services: 'خدمات', work: 'نمونه‌ها', process: 'فرایند', about: 'درباره ما', contact: 'درخواست ارزیابی' },
    en: { nav: 'Quick navigation', open: 'Open quick navigation', close: 'Close quick navigation', home: 'Home', services: 'Services', work: 'Selected work', process: 'Process', about: 'About us', contact: 'Request assessment' },
  };

  const items = [
    { key: 'home', href: '#page-top', icon: icons.home },
    { key: 'services', href: '#services', icon: icons.services },
    { key: 'work', href: '#work', icon: icons.work },
    { key: 'process', href: '#process', icon: icons.process },
    { key: 'about', href: '#about', icon: icons.about },
    { key: 'contact', action: 'assessment', icon: icons.contact },
  ];

  root.innerHTML = `
    <div class="arm-shell">
      <div class="arm-items" id="adaptive-radial-items" role="list"></div>
      <button class="arm-trigger" type="button" aria-controls="adaptive-radial-items" aria-expanded="false">
        <span class="arm-orb" aria-hidden="true"><span></span><span></span><span></span></span>
      </button>
    </div>`;

  const shell = root.querySelector('.arm-shell');
  const list = root.querySelector('.arm-items');
  const trigger = root.querySelector('.arm-trigger');

  for (const item of items) {
    const wrapper = document.createElement('span');
    wrapper.className = 'arm-item-wrap';
    wrapper.setAttribute('role', 'listitem');
    const control = document.createElement(item.href ? 'a' : 'button');
    control.className = 'arm-item';
    control.dataset.key = item.key;
    control.innerHTML = item.icon;
    control.tabIndex = -1;
    if (item.href) control.href = item.href;
    else control.type = 'button';
    if (item.action) control.dataset.action = item.action;
    wrapper.append(control);
    list.append(wrapper);
  }

  document.body.append(root);

  let isOpen = false;
  let isVisible = false;
  let lastY = window.scrollY || 0;
  let scrollFrame = 0;
  const dialog = document.querySelector('dialog');

  const setHeaderHidden = (hidden) => {
    const next = Boolean(hidden);
    header.classList.toggle('nav-hidden', next);
    header.inert = next;
    if (next) header.setAttribute('aria-hidden', 'true');
    else header.removeAttribute('aria-hidden');
  };

  const language = () => {
    const lang = (document.documentElement.lang || 'ar').toLowerCase();
    return translations[lang] ? lang : 'en';
  };

  const isRTL = () => document.documentElement.dir === 'rtl' || /^(ar|fa|he|ur|ps|ku|yi)\b/.test(language());

  const updateLanguage = () => {
    const copy = translations[language()];
    root.setAttribute('aria-label', copy.nav);
    trigger.setAttribute('aria-label', isOpen ? copy.close : copy.open);
    root.querySelectorAll('.arm-item').forEach((control) => {
      const label = copy[control.dataset.key];
      control.setAttribute('aria-label', label);
      control.dataset.label = label;
      control.title = label;
    });
    root.classList.toggle('is-rtl', isRTL());
    root.classList.toggle('is-ltr', !isRTL());
    positionItems();
  };

  const positionItems = () => {
    const compact = window.innerWidth < 680;
    const orbit = compact ? 88 : 112;
    const base = isRTL() ? 0 : 180;
    const span = compact ? 128 : 144;
    // Keep semantic top-to-bottom order identical in RTL and LTR.
    const start = isRTL() ? base - span / 2 : base + span / 2;
    const controls = [...root.querySelectorAll('.arm-item-wrap')];
    const direction = isRTL() ? 1 : -1;
    const step = controls.length > 1 ? direction * span / (controls.length - 1) : 0;
    controls.forEach((wrapper, index) => {
      const angle = (start + step * index) * Math.PI / 180;
      wrapper.style.setProperty('--arm-x', `${Math.cos(angle) * orbit}px`);
      wrapper.style.setProperty('--arm-y', `${Math.sin(angle) * orbit}px`);
      wrapper.style.setProperty('--arm-delay', `${index * 24}ms`);
    });
  };

  const setOpen = (next, focusTarget = false) => {
    if (!isVisible && next) return;
    isOpen = Boolean(next);
    root.classList.toggle('is-open', isOpen);
    trigger.setAttribute('aria-expanded', String(isOpen));
    const copy = translations[language()];
    trigger.setAttribute('aria-label', isOpen ? copy.close : copy.open);
    const controls = [...root.querySelectorAll('.arm-item')];
    controls.forEach((control) => { control.tabIndex = isOpen ? 0 : -1; });
    if (isOpen) setHeaderHidden(false);
    if (focusTarget && controls.length) requestAnimationFrame(() => controls[focusTarget === 'last' ? controls.length - 1 : 0].focus());
  };

  const setVisible = (next) => {
    isVisible = Boolean(next);
    root.classList.toggle('is-visible', isVisible);
    root.setAttribute('aria-hidden', String(!isVisible));
    trigger.tabIndex = isVisible ? 0 : -1;
    if (!isVisible) setOpen(false);
  };

  const shouldKeepHeader = () => {
    const dialogOpen = Boolean(document.querySelector('dialog[open]'));
    const menuOpen = mainMenu && mainMenu.dataset.menu === 'true';
    return dialogOpen || menuOpen || isOpen || window.scrollY <= 96;
  };

  const scrollToPageTop = () => {
    setOpen(false);
    setVisible(false);
    setHeaderHidden(false);
    history.replaceState(null, '', `${location.pathname}${location.search}#page-top`);
    const rootStyle = document.documentElement.style;
    const previousScrollBehavior = rootStyle.scrollBehavior;
    rootStyle.scrollBehavior = 'auto';
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    requestAnimationFrame(() => { rootStyle.scrollBehavior = previousScrollBehavior; });
  };

  const processScroll = () => {
    scrollFrame = 0;
    const y = Math.max(0, window.scrollY || 0);
    if (!desktopNavigation.matches) {
      setVisible(false);
      setHeaderHidden(false);
      lastY = y;
      return;
    }
    const delta = y - lastY;
    setVisible(y > 150);
    if (shouldKeepHeader() || delta < -3) setHeaderHidden(false);
    else if (y > 120 && delta > 3) setHeaderHidden(true);
    if (Math.abs(delta) > 24 && isOpen) setOpen(false);
    lastY = y;
  };

  const onScroll = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(processScroll);
  };

  const focusSibling = (direction) => {
    const controls = [...root.querySelectorAll('.arm-item')];
    const index = controls.indexOf(document.activeElement);
    if (index < 0) return;
    controls[(index + direction + controls.length) % controls.length].focus();
  };

  trigger.addEventListener('click', () => setOpen(!isOpen));
  trigger.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowLeft'].includes(event.key)) { event.preventDefault(); setOpen(true, 'last'); }
    if (['ArrowDown', 'ArrowRight'].includes(event.key)) { event.preventDefault(); setOpen(true, 'first'); }
  });

  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); trigger.focus(); }
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') { event.preventDefault(); focusSibling(1); }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') { event.preventDefault(); focusSibling(-1); }
  });

  root.addEventListener('click', (event) => {
    const control = event.target.closest('.arm-item');
    if (!control) return;
    if (control.dataset.key === 'home') {
      event.preventDefault();
      scrollToPageTop();
      return;
    }
    if (control.dataset.action === 'assessment') {
      event.preventDefault();
      setOpen(false);
      setVisible(false);
      setHeaderHidden(false);
      assessmentTrigger.click();
    } else setOpen(false);
  });

  document.querySelectorAll('[data-back-to-top]').forEach((control) => {
    control.addEventListener('click', (event) => {
      event.preventDefault();
      scrollToPageTop();
    });
  });

  document.addEventListener('pointerdown', (event) => { if (isOpen && !root.contains(event.target)) setOpen(false); });
  document.addEventListener('click', (event) => {
    if (event.target.closest?.('[data-open]') && !root.contains(event.target)) {
      setOpen(false);
      setVisible(false);
      setHeaderHidden(false);
    }
  }, true);
  if (dialog) dialog.addEventListener('close', processScroll);
  const onDesktopNavigationChange = () => {
    setOpen(false);
    positionItems();
    processScroll();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', positionItems, { passive: true });
  desktopNavigation.addEventListener('change', onDesktopNavigationChange);
  reducedMotion.addEventListener('change', () => root.classList.toggle('reduce-motion', reducedMotion.matches));

  const directionObserver = new MutationObserver(updateLanguage);
  directionObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });

  root.classList.toggle('reduce-motion', reducedMotion.matches);
  updateLanguage();
  positionItems();
  processScroll();

  window.__bdixAdaptiveNavigation = {
    get open() { return isOpen; },
    get visible() { return isVisible; },
    openMenu: () => setOpen(true),
    closeMenu: () => setOpen(false),
    destroy: () => {
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      directionObserver.disconnect();
      setHeaderHidden(false);
      if (dialog) dialog.removeEventListener('close', processScroll);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', positionItems);
      desktopNavigation.removeEventListener('change', onDesktopNavigationChange);
      root.remove();
    },
  };
})();
