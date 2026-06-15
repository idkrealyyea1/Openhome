'use strict';

// ─── FOOTER YEAR ────────────────────────────────────────────
document.getElementById('footerYear').textContent = new Date().getFullYear();

// ─── NAVBAR SCROLL EFFECT ───────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── HAMBURGER MENU ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ─── HERO PARALLAX ──────────────────────────────────────────
const heroBg = document.getElementById('heroBg');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight * 1.5) {
    heroBg.style.transform = `translateY(${y * 0.4}px)`;
  }
}, { passive: true });

// ─── HERO MOUSE GLOW ────────────────────────────────────────
const heroSection = document.querySelector('.hero');
const heroGlow    = document.getElementById('heroGlow');
heroSection.addEventListener('mousemove', (e) => {
  const rect = heroSection.getBoundingClientRect();
  const x = e.clientX - rect.left - 300;
  const y = e.clientY - rect.top  - 300;
  heroGlow.style.transform = `translate(${x}px, ${y}px)`;
});

// ─── FLOATING PARTICLES ─────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function createParticles() {
    particles = Array.from({ length: 50 }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.5 + 0.2,
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));
  }
  createParticles();

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const t = Date.now() * 0.001;

    particles.forEach(p => {
      p.y -= p.speed;
      p.pulse += 0.02;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }

      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${a})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── 3D CARD TILT ───────────────────────────────────────────
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale3d(1.02,1.02,1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    card.style.transition = 'transform .5s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

// ─── SCROLL REVEAL ──────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || '0', 10);
    setTimeout(() => el.classList.add('visible'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── ANIMATED COUNTERS ──────────────────────────────────────
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    statsObserver.unobserve(entry.target);

    entry.target.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1800;
      const step   = 16;
      const inc    = target / (dur / step);
      let cur = 0;
      const timer = setInterval(() => {
        cur += inc;
        if (cur >= target) {
          clearInterval(timer);
          cur = target;
        }
        el.textContent = Math.floor(cur).toLocaleString() + suffix;
      }, step);
    });
  });
}, { threshold: 0.4 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

// ─── INVESTMENT BAR CHART ────────────────────────────────────
const barsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    barsObserver.unobserve(entry.target);
    entry.target.querySelectorAll('.bar').forEach((bar, i) => {
      const pct = parseInt(bar.dataset.pct, 10);
      setTimeout(() => {
        bar.style.height = pct + '%';
      }, i * 100);
    });
  });
}, { threshold: 0.3 });

const barsContainer = document.getElementById('barsContainer');
if (barsContainer) barsObserver.observe(barsContainer);

// ─── TESTIMONIAL CAROUSEL ────────────────────────────────────
(function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots   = document.querySelectorAll('.dot');
  let current  = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startAuto() {
    timer = setInterval(next, 4500);
  }

  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  startAuto();
})();

// ─── GALLERY LIGHTBOX ────────────────────────────────────────
(function initLightbox() {
  const lightbox        = document.getElementById('lightbox');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn        = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img     = item.querySelector('img');
      const overlay = item.querySelector('.gallery-overlay span');
      lightboxImg.src      = img.src.replace('w=900', 'w=1800');
      lightboxImg.alt      = img.alt;
      lightboxCaption.textContent = overlay ? overlay.textContent : '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

// ─── CONTACT FORM ────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('formSuccess').classList.add('visible');
});
