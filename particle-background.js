(() => {
  'use strict';

  const canvas = document.querySelector('[data-particle-background]');
  if (!canvas || typeof window === 'undefined') return;

  const context = canvas.getContext('2d', { alpha: false });
  if (!context) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const mobile = window.matchMedia('(max-width: 700px)');

  const number = (name, fallback, min, max) => {
    const value = Number(canvas.dataset[name]);
    return Math.min(max, Math.max(min, Number.isFinite(value) ? value : fallback));
  };

  const config = {
    backgroundColor: canvas.dataset.background || '#060B14',
    particleColor: canvas.dataset.particle || '#287BFF',
    count: number('count', 62, 8, 180),
    mobileCount: number('mobileCount', 34, 6, 100),
    size: number('size', 3, 0.5, 10),
    speed: number('speed', 0.24, 0.01, 1.5),
    interactionRadius: number('radius', 138, 20, 360),
    reactionStrength: number('strength', 16, 0, 80),
    fps: number('fps', 30, 15, 60),
  };

  const particles = [];
  const pointer = { x: -9999, y: -9999, active: false };
  const size = { width: 1, height: 1, dpr: 1 };
  let frame = 0;
  let running = false;
  let lastFrame = 0;
  let framesDrawn = 0;

  const hexToRgb = (value) => {
    const match = String(value).trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i);
    if (!match) return { r: 22, g: 139, b: 255 };
    let hex = match[1];
    if (hex.length === 3) hex = hex.split('').map((char) => char + char).join('');
    const parsed = Number.parseInt(hex, 16);
    return { r: (parsed >> 16) & 255, g: (parsed >> 8) & 255, b: parsed & 255 };
  };

  const particleRgb = hexToRgb(config.particleColor);
  const rgba = (alpha) => `rgba(${particleRgb.r},${particleRgb.g},${particleRgb.b},${alpha})`;

  const targetCount = () => Math.round(mobile.matches ? config.mobileCount : config.count);

  const createParticle = () => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = config.speed * (0.55 + Math.random() * 0.75);
    return {
      x: Math.random() * size.width,
      y: Math.random() * size.height,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      baseVx: Math.cos(angle) * velocity,
      baseVy: Math.sin(angle) * velocity,
      alpha: 0.2 + Math.random() * 0.38,
      scale: 0.72 + Math.random() * 0.72,
    };
  };

  const seed = () => {
    const count = targetCount();
    particles.length = 0;
    for (let index = 0; index < count; index += 1) particles.push(createParticle());
  };

  const resize = () => {
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    const cap = mobile.matches ? 1.15 : 1.5;
    const dpr = Math.min(cap, Math.max(1, window.devicePixelRatio || 1));
    size.width = width;
    size.height = height;
    size.dpr = dpr;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
    draw(0);
  };

  const drawAmbient = (time) => {
    context.fillStyle = config.backgroundColor;
    context.fillRect(0, 0, size.width, size.height);

    const reduced = prefersReducedMotion.matches;
    const phase = reduced ? 0 : time * 0.00008;
    const radius = Math.max(size.width, size.height);
    const firstX = size.width * (0.18 + Math.sin(phase) * 0.015);
    const firstY = size.height * (0.72 + Math.cos(phase * 0.8) * 0.018);
    const first = context.createRadialGradient(firstX, firstY, 0, firstX, firstY, radius * 0.9);
    first.addColorStop(0, rgba(0.085));
    first.addColorStop(0.5, rgba(0.028));
    first.addColorStop(1, rgba(0));
    context.fillStyle = first;
    context.fillRect(0, 0, size.width, size.height);

    const secondX = size.width * (0.82 + Math.cos(phase * 0.75 + 1.2) * 0.012);
    const secondY = size.height * 0.58;
    const second = context.createRadialGradient(secondX, secondY, 0, secondX, secondY, radius * 0.72);
    second.addColorStop(0, rgba(0.052));
    second.addColorStop(0.65, rgba(0.014));
    second.addColorStop(1, rgba(0));
    context.fillStyle = second;
    context.fillRect(0, 0, size.width, size.height);
  };

  const drawParticle = (particle, glow) => {
    const radius = Math.max(0.55, config.size * 0.22 * particle.scale);
    context.shadowColor = glow ? config.particleColor : 'transparent';
    context.shadowBlur = glow ? Math.max(3, config.size * 2.2) : 0;
    context.fillStyle = glow ? rgba(particle.alpha * 0.6) : `rgba(225,240,255,${particle.alpha * 0.82})`;
    context.beginPath();
    context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
    context.fill();
  };

  const draw = (time) => {
    drawAmbient(time);
    for (const particle of particles) drawParticle(particle, true);
    context.shadowColor = 'transparent';
    context.shadowBlur = 0;
    for (const particle of particles) drawParticle(particle, false);
    context.shadowColor = 'transparent';
    context.shadowBlur = 0;
    framesDrawn += 1;
  };

  const update = () => {
    const radiusSquared = config.interactionRadius * config.interactionRadius;
    for (const particle of particles) {
      if (pointer.active) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared > 0.01 && distanceSquared < radiusSquared) {
          const distance = Math.sqrt(distanceSquared);
          const force = (1 - distance / config.interactionRadius) * config.reactionStrength * 0.0018;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
      }

      particle.vx += (particle.baseVx - particle.vx) * 0.018;
      particle.vy += (particle.baseVy - particle.vy) * 0.018;
      particle.vx *= 0.995;
      particle.vy *= 0.995;
      particle.x += particle.vx;
      particle.y += particle.vy;

      const margin = config.size * 2;
      if (particle.x < -margin) particle.x = size.width + margin;
      if (particle.x > size.width + margin) particle.x = -margin;
      if (particle.y < -margin) particle.y = size.height + margin;
      if (particle.y > size.height + margin) particle.y = -margin;
    }
  };

  const tick = (time) => {
    if (!running) return;
    frame = window.requestAnimationFrame(tick);
    const interval = 1000 / config.fps;
    if (time - lastFrame < interval) return;
    lastFrame = time - ((time - lastFrame) % interval);
    update();
    draw(time);
  };

  const stop = () => {
    running = false;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  };

  const start = () => {
    stop();
    if (document.hidden || prefersReducedMotion.matches) {
      draw(0);
      return;
    }
    running = true;
    lastFrame = 0;
    frame = window.requestAnimationFrame(tick);
  };

  const onPointerMove = (event) => {
    if (!finePointer.matches || prefersReducedMotion.matches) return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  };

  const onPointerLeave = () => { pointer.active = false; };
  const onVisibility = () => document.hidden ? stop() : start();
  const onMotionChange = () => { pointer.active = false; start(); };
  const onMobileChange = () => resize();

  const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  if (resizeObserver) resizeObserver.observe(document.documentElement);
  else window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('blur', onPointerLeave);
  document.addEventListener('mouseleave', onPointerLeave);
  document.addEventListener('visibilitychange', onVisibility);
  prefersReducedMotion.addEventListener('change', onMotionChange);
  mobile.addEventListener('change', onMobileChange);

  resize();
  start();

  window.__bdixParticleBackground = {
    get running() { return running; },
    get frames() { return framesDrawn; },
    get count() { return particles.length; },
    get dpr() { return size.dpr; },
    config,
    redraw: () => draw(performance.now()),
    destroy: () => {
      stop();
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', onPointerLeave);
      document.removeEventListener('mouseleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      prefersReducedMotion.removeEventListener('change', onMotionChange);
      mobile.removeEventListener('change', onMobileChange);
    },
  };
})();
