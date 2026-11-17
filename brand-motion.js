(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const loader = document.querySelector('[data-site-loader]');
  const loaderVideo = loader?.querySelector('[data-loader-video]');
  const skip = loader?.querySelector('[data-loader-skip]');
  const status = loader?.querySelector('.site-loader-status');
  const heroVideo = document.querySelector('[data-hero-brand-video]');
  const locale = new URLSearchParams(location.search).get('lang') || localStorage.getItem('bdixai-locale') || root.lang || 'ar';
  const labels = {
    ar: { skip: 'تخطي المقدمة', loading: 'جارٍ تحميل هوية BDIX AI' },
    fa: { skip: 'رد شدن از مقدمه', loading: 'در حال بارگذاری هویت BDIX AI' },
    en: { skip: 'Skip intro', loading: 'Loading the BDIX AI identity' }
  };
  const text = labels[locale] || labels.en;
  if (skip) { skip.textContent = text.skip; skip.setAttribute('aria-label', text.skip); }
  if (status) status.textContent = text.loading;

  let introFinished = false;
  let heroComplete = false;
  let heroVisible = true;
  let pageVisible = !document.hidden;
  let loaderTimer = 0;
  const session = {
    get seen() { try { return sessionStorage.getItem('bdixai-intro-seen') === '1'; } catch (_) { return false; } },
    mark() { try { sessionStorage.setItem('bdixai-intro-seen', '1'); } catch (_) {} }
  };

  const shouldPlayHero = () => !reduced && !saveData && heroVisible && pageVisible && !heroComplete;
  const syncHero = () => {
    if (!heroVideo) return;
    if (shouldPlayHero() && introFinished) heroVideo.play().catch(() => {});
    else heroVideo.pause();
  };
  const completeIntro = (reason = 'complete') => {
    if (introFinished) return;
    introFinished = true;
    clearTimeout(loaderTimer);
    session.mark();
    root.classList.remove('brand-intro-pending');
    if (loader) {
      loader.classList.add('is-leaving');
      loader.setAttribute('aria-hidden', 'true');
      setTimeout(() => { loader.hidden = true; }, 380);
    }
    if (loaderVideo) loaderVideo.pause();
    document.dispatchEvent(new CustomEvent('bdixai:intro-complete', { detail: { reason } }));
    syncHero();
  };

  const pending = root.classList.contains('brand-intro-pending') && !session.seen && !reduced && !saveData;
  if (loader && pending) {
    loader.hidden = false;
    loader.setAttribute('aria-hidden', 'false');
    if (loaderVideo) {
      loaderVideo.playbackRate = 2;
      loaderVideo.addEventListener('ended', () => completeIntro('ended'), { once: true });
      loaderVideo.addEventListener('error', () => completeIntro('media-error'), { once: true });
      loaderVideo.play().catch(() => completeIntro('autoplay-blocked'));
    }
    skip?.addEventListener('click', () => completeIntro('skipped'), { once: true });
    loaderTimer = window.setTimeout(() => completeIntro('timeout'), 3400);
  } else {
    if (loader) loader.hidden = true;
    root.classList.remove('brand-intro-pending');
    introFinished = true;
  }

  if (heroVideo) {
    if (reduced || saveData) {
      heroVideo.preload = 'none';
      heroVideo.pause();
    } else {
      heroVideo.addEventListener('ended', () => { heroComplete = true; heroVideo.dataset.complete = 'true'; }, { once: true });
      const hero = heroVideo.closest('.hero');
      if (hero && 'IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
          heroVisible = entries[0]?.isIntersecting ?? true;
          syncHero();
        }, { rootMargin: '80px', threshold: 0.01 }).observe(hero);
      }
    }
  }
  document.addEventListener('visibilitychange', () => { pageVisible = !document.hidden; syncHero(); });
  syncHero();
  window.__bdixBrandMotion = {
    reduced, saveData, get loaderShown() { return pending; },
    get introFinished() { return introFinished; },
    get heroComplete() { return heroComplete; }
  };
})();
