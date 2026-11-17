(() => {
  'use strict';

  const canvas = document.querySelector('[data-contact-background]');
  if (!canvas || typeof window === 'undefined') return;
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const mobile = window.matchMedia('(max-width: 820px)');
  const size = { width: 1, height: 1, dpr: 1 };
  const pointer = { x: 0, y: 0, active: false };
  const nodes = [];
  let frame = 0;
  let running = false;
  let lastFrame = 0;
  let framesDrawn = 0;

  const seed = () => {
    const count = mobile.matches ? 18 : 30;
    nodes.length = 0;
    for (let index = 0; index < count; index += 1) {
      nodes.push({
        x: Math.random(),
        y: Math.random(),
        depth: 0.45 + Math.random() * 0.75,
        alpha: 0.13 + Math.random() * 0.32,
        phase: Math.random() * Math.PI * 2,
      });
    }
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

  const drawBackground = (time) => {
    context.fillStyle = '#060B14';
    context.fillRect(0, 0, size.width, size.height);

    const phase = reducedMotion.matches ? 0 : time * 0.00009;
    const shiftX = pointer.active ? (pointer.x / size.width - 0.5) * 24 : Math.sin(phase) * 8;
    const shiftY = pointer.active ? (pointer.y / size.height - 0.5) * 18 : Math.cos(phase * 0.8) * 7;
    const cx = size.width * 0.5 + shiftX;
    const cy = size.height * 0.58 + shiftY;
    const radius = Math.max(size.width, size.height);

    const blue = context.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.72);
    blue.addColorStop(0, 'rgba(22,139,255,.13)');
    blue.addColorStop(0.34, 'rgba(0,79,202,.065)');
    blue.addColorStop(0.72, 'rgba(7,28,61,.025)');
    blue.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = blue;
    context.fillRect(0, 0, size.width, size.height);

    const aura = context.createRadialGradient(size.width * 0.18, size.height * 0.12, 0, size.width * 0.18, size.height * 0.12, radius * 0.55);
    aura.addColorStop(0, 'rgba(85,226,212,.065)');
    aura.addColorStop(0.45, 'rgba(40,123,255,.018)');
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = aura;
    context.fillRect(0, 0, size.width, size.height);
  };

  const drawRings = (time) => {
    const phase = reducedMotion.matches ? 0 : time * 0.00016;
    const cx = size.width * (mobile.matches ? 0.5 : 0.64);
    const cy = size.height * 0.62;
    const base = Math.min(size.width, size.height) * (mobile.matches ? 0.34 : 0.27);
    context.save();
    context.translate(cx, cy);
    context.rotate(-0.16);
    for (let index = 0; index < 4; index += 1) {
      const pulse = 1 + Math.sin(phase + index * 1.4) * 0.015;
      const radius = base * (0.64 + index * 0.31) * pulse;
      context.beginPath();
      context.ellipse(0, 0, radius * 1.55, radius * 0.58, 0, 0, Math.PI * 2);
      context.strokeStyle = index === 0 ? 'rgba(91,188,255,.16)' : `rgba(22,139,255,${0.11 - index * 0.018})`;
      context.lineWidth = index === 0 ? 1.1 : 0.75;
      context.stroke();
    }
    context.restore();
  };

  const drawNodes = (time) => {
    const phase = reducedMotion.matches ? 0 : time * 0.00028;
    for (const node of nodes) {
      const x = node.x * size.width + Math.sin(phase * node.depth + node.phase) * 4;
      const y = node.y * size.height + Math.cos(phase * 0.8 * node.depth + node.phase) * 3;
      const alpha = node.alpha * (0.78 + Math.sin(phase + node.phase) * 0.22);
      context.shadowColor = '#287BFF';
      context.shadowBlur = 7;
      context.fillStyle = `rgba(91,188,255,${alpha})`;
      context.beginPath();
      context.arc(x, y, 0.7 + node.depth * 0.55, 0, Math.PI * 2);
      context.fill();
    }
    context.shadowColor = 'transparent';
    context.shadowBlur = 0;
  };

  const draw = (time) => {
    drawBackground(time);
    drawRings(time);
    drawNodes(time);
    framesDrawn += 1;
  };

  const tick = (time) => {
    if (!running) return;
    frame = window.requestAnimationFrame(tick);
    const interval = 1000 / 30;
    if (time - lastFrame < interval) return;
    lastFrame = time - ((time - lastFrame) % interval);
    draw(time);
  };

  const stop = () => {
    running = false;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  };

  const start = () => {
    stop();
    if (document.hidden || reducedMotion.matches) {
      draw(0);
      return;
    }
    running = true;
    lastFrame = 0;
    frame = window.requestAnimationFrame(tick);
  };

  const onPointerMove = (event) => {
    if (!finePointer.matches || reducedMotion.matches) return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  };
  const onPointerLeave = () => { pointer.active = false; };
  const onVisibility = () => document.hidden ? stop() : start();
  const onMotionChange = () => { pointer.active = false; start(); };

  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  if (observer) observer.observe(document.documentElement);
  else window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('blur', onPointerLeave);
  document.addEventListener('mouseleave', onPointerLeave);
  document.addEventListener('visibilitychange', onVisibility);
  reducedMotion.addEventListener('change', onMotionChange);
  mobile.addEventListener('change', resize);

  resize();
  start();

  window.__bdixContactBackground = {
    get running() { return running; },
    get frames() { return framesDrawn; },
    get count() { return nodes.length; },
    get dpr() { return size.dpr; },
    redraw: () => draw(performance.now()),
    destroy: () => {
      stop();
      if (observer) observer.disconnect();
      else window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', onPointerLeave);
      document.removeEventListener('mouseleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      reducedMotion.removeEventListener('change', onMotionChange);
      mobile.removeEventListener('change', resize);
    },
  };
})();
