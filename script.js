/* SAS — Student Academic Support | script.js */
(() => {
  'use strict';

  /* 1. SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector('nav')?.offsetHeight ?? 60;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* 2. STICKY NAV SHRINK */
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.style.height = '50px';
        nav.style.boxShadow = '0 1px 0 var(--ash)';
      } else {
        nav.style.height = '60px';
        nav.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  /* 3. ACTIVE NAV LINK TRACKING */
  const sections = document.querySelectorAll('section[id], div[id], .calendar-section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => {
          const active = a.getAttribute('href') === `#${e.target.id}`;
          a.style.color = active ? 'var(--ink)' : '';
          a.style.fontWeight = active ? '600' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => sectionObserver.observe(s));

  /* 4. SCROLL-TRIGGERED FADE IN */
  const fadeTargets = '.step-card, .offer-card, .why-card, .stat-card, .about-text, .section-title, .section-label, .join-text, .join-action, .session-row, .cal-month';
  const fadeEls = document.querySelectorAll(fadeTargets);
  fadeEls.forEach((el, i) => {
    el.classList.add('sas-fade');
    el.style.transitionDelay = `${(i % 4) * 0.07}s`;
  });
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('sas-visible');
        fadeObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => fadeObserver.observe(el));

  /* 5. ANIMATED STAT COUNTERS */
  const animateCount = (el, from, to, suffix, duration = 900) => {
    const start = performance.now();
    const update = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(from + (to - from) * eased);
      el.innerHTML = `${val}<em>${suffix}</em>`;
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const raw = el.textContent.trim();
      if (raw.startsWith('100')) animateCount(el, 0, 100, '%');
      else if (raw.startsWith('0')) animateCount(el, 10, 0, '×');
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-card .num').forEach(el => {
    if (!el.textContent.includes('∞')) statObserver.observe(el);
  });

  /* 6. JOIN — LINK INPUT COPY BUTTON */
  const linkInput = document.querySelector('.link-input');
  const linkArea = document.querySelector('.link-area');
  if (linkInput && linkArea) {
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy link';
    copyBtn.style.cssText = `display:none;background:var(--orange);color:#fcfbf8;border:none;border-radius:24px;padding:9px 20px;font-size:13px;font-family:inherit;font-weight:500;cursor:pointer;letter-spacing:-0.01em;transition:opacity 0.2s;`;
    copyBtn.addEventListener('mouseenter', () => copyBtn.style.opacity = '0.85');
    copyBtn.addEventListener('mouseleave', () => copyBtn.style.opacity = '1');
    copyBtn.addEventListener('click', () => {
      const val = linkInput.value.trim();
      if (!val) return;
      navigator.clipboard.writeText(val).then(() => {
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => (copyBtn.textContent = 'Copy link'), 2000);
      }).catch(() => linkInput.select());
    });
    linkArea.appendChild(copyBtn);
    const showHide = () => { copyBtn.style.display = linkInput.value.trim() ? 'block' : 'none'; };
    linkInput.addEventListener('focus', showHide);
    linkInput.addEventListener('input', showHide);
    linkInput.addEventListener('blur', () => setTimeout(() => { copyBtn.style.display = 'none'; }, 200));
  }

})();
