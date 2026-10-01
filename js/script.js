(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ── Enable reveal animations only when JS is confirmed running ── */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    root.classList.add('js-reveal-ready');
  }

  /* ── Scroll progress bar ── */
  (function () {
    var bar = document.getElementById('progressBar');
    if (!bar) return;
    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ── Mobile nav toggle ── */
  (function () {
    var burger = document.getElementById('navBurger');
    var menu = document.getElementById('mobileNav');
    if (!burger || !menu) return;
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  })();

  /* ── Sticky mini-CTA ── */
  (function () {
    var mini = document.getElementById('miniCta');
    var hero = document.querySelector('.hero');
    if (!mini || !hero) return;
    if (!('IntersectionObserver' in window)) {
      mini.classList.add('visible');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) {
          mini.classList.add('visible');
          mini.setAttribute('aria-hidden', 'false');
        } else {
          mini.classList.remove('visible');
          mini.setAttribute('aria-hidden', 'true');
        }
      });
    }, { threshold: 0.15 });
    io.observe(hero);
  })();

  /* ── Dark mode — DEFAULT ON, with toggle ── */
  (function () {
    var toggle = document.getElementById('themeToggle');
    var icon = document.getElementById('themeIcon');
    var body = document.body;
    if (!toggle || !icon) return;

    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    if (saved === 'light') {
      body.classList.remove('dark-mode');
      icon.classList.remove('bx-sun');
      icon.classList.add('bx-moon');
    } else {
      body.classList.add('dark-mode');
      icon.classList.remove('bx-moon');
      icon.classList.add('bx-sun');
    }

    toggle.addEventListener('click', function () {
      var isDark = body.classList.toggle('dark-mode');
      if (isDark) {
        icon.classList.remove('bx-moon');
        icon.classList.add('bx-sun');
      } else {
        icon.classList.remove('bx-sun');
        icon.classList.add('bx-moon');
      }
      try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
    });
  })();

  /* ── Active nav link on scroll ── */
  (function () {
    var sections = document.querySelectorAll('section[id], header[id]');
    var navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
    if (!sections.length || !navLinks.length) return;

    function updateActive() {
      var top = window.scrollY + 120;
      var current = '';
      sections.forEach(function (sec) {
        if (top >= sec.offsetTop) current = sec.getAttribute('id');
      });
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }
    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  })();

  /* ── Skill bars ── */
  (function () {
    var bars = document.querySelectorAll('.skill-bar-mini span, .skill-bar');
    if (!bars.length) return;

    function fill(bar) {
      var w = bar.getAttribute('data-width') || '0';
      bar.style.width = w + '%';
    }

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      bars.forEach(fill);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          fill(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    bars.forEach(function (b) { io.observe(b); });

    /* Fallback: if still not filled after 2s, fill all */
    setTimeout(function () {
      bars.forEach(function (b) {
        if (!b.style.width || b.style.width === '0%') fill(b);
      });
    }, 2000);
  })();

  /* ── Scroll reveal + stagger (robust) ── */
  (function () {
    var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
    var staggerEls = document.querySelectorAll('.stagger');

    function showAll() {
      revealEls.forEach(function (el) { el.classList.add('in'); });
      staggerEls.forEach(function (el) { el.classList.add('in'); });
    }

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }

    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          revealIO.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealIO.observe(el); });

    var staggerIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          staggerIO.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

    staggerEls.forEach(function (el) { staggerIO.observe(el); });

    /* Safety net: reveal everything that's still hidden after 2.5s */
    setTimeout(function () {
      revealEls.forEach(function (el) {
        if (!el.classList.contains('in')) el.classList.add('in');
      });
      staggerEls.forEach(function (el) {
        if (!el.classList.contains('in')) el.classList.add('in');
      });
    }, 2500);
  })();

})();
