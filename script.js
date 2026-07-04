/* ==========================================================
   YEAR
   ========================================================== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ==========================================================
   REDUCED MOTION CHECK
   ========================================================== */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================
   AMBIENT CURSOR GLOW — soft and understated
   ========================================================== */
const glow = document.getElementById('glowCursor');
if (glow && !prefersReducedMotion) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.07;
    glowY += (mouseY - glowY) * 0.07;
    glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
} else if (glow) {
  glow.style.display = 'none';
}

/* ==========================================================
   HERO BACKGROUND — a loose scatter of warm little dots,
   not a rigid grid. Drifts gently, brightens near the cursor.
   ========================================================== */
(function initScatter() {
  const canvas = document.getElementById('grid');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, dots = [];
  const DOT_COUNT_PER_1000PX = 1.1; // density
  const RADIUS = 220;

  let pointer = { x: -9999, y: -9999 };

  function resize() {
    const hero = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = hero.width * window.devicePixelRatio;
    height = canvas.height = hero.height * window.devicePixelRatio;
    canvas.style.width = hero.width + 'px';
    canvas.style.height = hero.height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    buildDots(hero.width, hero.height);
  }

  function buildDots(w, h) {
    dots = [];
    const count = Math.round((w * h) / 1000 * DOT_COUNT_PER_1000PX / 10);
    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 1 + Math.random() * 1.6,
        drift: 4 + Math.random() * 8,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.5,
      });
    }
  }

  let t = 0;
  function draw() {
    t += 0.008;
    ctx.clearRect(0, 0, width, height);

    for (const dot of dots) {
      // gentle organic drift, like dust floating
      const dx = Math.sin(t * dot.speed + dot.phase) * dot.drift;
      const dy = Math.cos(t * dot.speed * 0.8 + dot.phase) * dot.drift * 0.6;
      const px = dot.x + dx;
      const py = dot.y + dy;

      const distX = px - pointer.x;
      const distY = py - pointer.y;
      const dist = Math.sqrt(distX * distX + distY * distY);
      const influence = Math.max(0, 1 - dist / RADIUS);

      const size = dot.size + influence * 1.6;
      const alpha = 0.14 + influence * 0.5;

      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 190, 140, ${alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  });
  canvas.parentElement.addEventListener('mouseleave', () => {
    pointer.x = -9999;
    pointer.y = -9999;
  });

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ==========================================================
   SCROLL REVEAL (IntersectionObserver)
   Covers both .reveal elements and the sticker project cards.
   ========================================================== */
(function initReveal() {
  const items = document.querySelectorAll('.reveal, .card');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach((el) => observer.observe(el));
})();