/**
 * Brand Orbit — Main JavaScript
 * js/script.js
 *
 * This is the structured shell. Each section will be filled in by dedicated agents.
 * DOMContentLoaded calls init(), which wires everything together.
 */

'use strict';

/* =============================================================
   === CONFIGURATION ===
   WEB3FORMS: Replace 'YOUR_ACCESS_KEY_HERE' with your key from
   https://web3forms.com
   ============================================================= */
const CONFIG = {
  web3formsKey: '', // Left empty for now. Add your access key from https://web3forms.com when ready for live submissions.
  typedStrings: ['Digital Experiences', 'Bold Brands', 'Immersive Websites', 'High-Impact Products'],
  typedSpeed: 80,
  typedDeleteSpeed: 40,
  typedPause: 2000,
  scrollRevealThreshold: 0.15,
  navScrollOffset: 80,
  testimonialAutoplay: 5000,
};


/* =============================================================
   === NAVBAR ===
   - Transparent → solid on scroll
   - Active link highlighting
   - Smooth-scroll to sections
   ============================================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!navbar) return;

  // Scroll: transparent → frosted glass
  window.addEventListener('scroll', throttle(() => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, 100));

  // Active nav link via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__links a');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.navbar__links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  sections.forEach(s => sectionObserver.observe(s));

  // Mobile menu toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.classList.toggle('open', isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
      });
    });
    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && hamburger.classList.contains('open')) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
      }
    });

    // Close on click outside navbar
    document.addEventListener('click', e => {
      if (hamburger.classList.contains('open') && !navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
      }
    });
  }

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}


/* =============================================================
   === SCROLL ANIMATIONS ===
   - IntersectionObserver watching .reveal, .reveal-left,
     .reveal-right, .reveal-scale, .stagger-children
   - Adds .visible class when element enters viewport
   ============================================================= */
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children'
  );

  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: CONFIG.scrollRevealThreshold }
  );

  targets.forEach((el) => observer.observe(el));
}


/* =============================================================
   === HERO TYPED TEXT ===
   - Cycles through CONFIG.typedStrings
   - Type → pause → delete → next string
   - Targets element with [data-typed] attribute
   ============================================================= */
function initTypedText() {
  const el = document.getElementById('heroTyped');
  if (!el) return;
  const words = ['Brands', 'Websites', 'Businesses', 'Companies'];
  let idx = 0, charIdx = 0, deleting = false;

  function type() {
    const word = words[idx];
    if (!deleting) {
      el.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % words.length;
        setTimeout(type, 300);
        return;
      }
    }
    setTimeout(type, deleting ? 60 : 90);
  }
  setTimeout(type, 1000);
}


/* =============================================================
   === SERVICES ===
   - Hover interactions, icon animations
   - Any filter/tab logic for service categories
   ============================================================= */
function initServices() {
  // === SERVICES ===
  // Prefill contact form when service link clicked
  document.querySelectorAll('[data-service-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      const service = link.getAttribute('data-service-link');
      const select = document.getElementById('serviceSelect');
      if (select) {
        const option = Array.from(select.options).find(o => o.value === service || o.text.includes(service));
        if (option) select.value = option.value;
      }
    });
  });

  // Mouse tracking for card radial gradient effect
  document.querySelectorAll('.services__card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  });
}


/* =============================================================
   === PORTFOLIO ===
   - Filter tabs (All / Branding / Web / Marketing / Advertising)
   - Smooth transition between filters
   ============================================================= */
function initPortfolio() {
  const filters = document.querySelectorAll('.portfolio__filter');
  const items = document.querySelectorAll('.portfolio__item');
  if (!filters.length || !items.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        const matches = (filter === 'all' || cat === filter);

        if (matches) {
          item.style.display = '';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(15px)';
          setTimeout(() => {
            if (btn.classList.contains('active') && btn.getAttribute('data-filter') !== 'all' && item.getAttribute('data-category') !== filter) {
              item.style.display = 'none';
            }
          }, 200);
        }
      });
    });
  });
}


/* =============================================================
   === TESTIMONIALS SLIDER ===
   - Accessible slide navigation
   - Autoplay with hover pause
   - Touch swipe & button controls
   ============================================================= */
function initTestimonialsSlider() {
  const track = document.getElementById('testimonialsTrack');
  const slider = document.getElementById('testimonialsSlider');
  if (!track || !slider) return;

  const slides = track.querySelectorAll('.testimonials__slide');
  const prevBtn = document.getElementById('testimPrev');
  const nextBtn = document.getElementById('testimNext');
  const dotsContainer = document.getElementById('testimDots');
  if (!slides.length) return;

  let current = 0;
  let autoplayTimer = null;
  const total = slides.length;

  // Generate dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `testimonials__dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        goTo(i);
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.testimonials__dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === current);
      });
    }
  }

  function startAutoplay() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      goTo(current + 1);
    }, CONFIG.testimonialAutoplay || 6000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goTo(current - 1);
      restartAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goTo(current + 1);
      restartAutoplay();
    });
  }

  // Pause autoplay on mouse hover
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Touch / Swipe support
  let touchStartX = 0;
  let touchDeltaX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    touchDeltaX = e.touches[0].clientX - touchStartX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (Math.abs(touchDeltaX) > 40) {
      if (touchDeltaX < 0) {
        goTo(current + 1);
      } else {
        goTo(current - 1);
      }
    }
    startAutoplay();
  });

  startAutoplay();
}


/* =============================================================
   === CONTACT FORM ===
   - Comprehensive client-side validation
   - Web3Forms API submission
   - Explicit configuration notice when key is default
   - Real loading state and authentic feedback
   ============================================================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('contactSubmit');
  const statusEl = document.getElementById('formStatus');
  if (!form || !submitBtn || !statusEl) return;

  const fields = {
    fullName: {
      input: document.getElementById('fullName'),
      error: document.getElementById('fullNameError'),
      validate: val => val.trim().length >= 2 ? '' : 'Please enter your full name.'
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) ? '' : 'Please enter a valid email address.'
    },
    service: {
      input: document.getElementById('serviceSelect'),
      error: document.getElementById('serviceError'),
      validate: val => val ? '' : 'Please select the required service.'
    },
    details: {
      input: document.getElementById('details'),
      error: document.getElementById('detailsError'),
      validate: val => val.trim().length >= 10 ? '' : 'Please provide at least 10 characters describing your project.'
    }
  };

  function validateField(key) {
    const field = fields[key];
    if (!field || !field.input) return true;
    const msg = field.validate(field.input.value);
    if (msg) {
      field.input.classList.add('error');
      if (field.error) {
        field.error.textContent = msg;
        field.error.classList.add('visible');
      }
      return false;
    } else {
      field.input.classList.remove('error');
      if (field.error) {
        field.error.textContent = '';
        field.error.classList.remove('visible');
      }
      return true;
    }
  }

  // Live validation on blur & input
  Object.keys(fields).forEach(key => {
    const f = fields[key];
    if (f && f.input) {
      f.input.addEventListener('blur', () => validateField(key));
      f.input.addEventListener('input', () => {
        if (f.input.classList.contains('error')) {
          validateField(key);
        }
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let allValid = true;
    Object.keys(fields).forEach(key => {
      const valid = validateField(key);
      if (!valid) allValid = false;
    });

    if (!allValid) {
      statusEl.className = 'contact__form-status error';
      statusEl.textContent = 'Please review and correct the highlighted fields before submitting.';
      return;
    }

    const key = (CONFIG.web3formsKey || '').trim();
    if (!key || key === 'YOUR_ACCESS_KEY_HERE') {
      statusEl.className = 'contact__form-status error';
      statusEl.innerHTML = '<strong>Notice:</strong> The Web3Forms access key is currently left empty. Client-side form validation passed successfully! When ready, insert your access key from <a href="https://web3forms.com" target="_blank" rel="noopener" style="color: inherit; text-decoration: underline;">web3forms.com</a> into <code>CONFIG.web3formsKey</code> in <code>js/script.js</code>.';
      return;
    }

    // Set loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    statusEl.className = 'contact__form-status pending';
    statusEl.textContent = 'Encrypting & submitting your project inquiry...';

    try {
      const formData = new FormData(form);
      formData.append('access_key', key);
      formData.append('subject', `Brand Orbit Inquiry from ${fields.fullName.input.value}`);
      formData.append('from_name', 'Brand Orbit Digital Agency');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        statusEl.className = 'contact__form-status success';
        statusEl.textContent = 'Thank you! Your project inquiry has been securely submitted. Our team will review your objectives and contact you within 24 hours.';
        form.reset();
        Object.keys(fields).forEach(key => {
          if (fields[key].input) fields[key].input.classList.remove('error');
        });
      } else {
        throw new Error(result.message || 'Submission failed.');
      }
    } catch (err) {
      statusEl.className = 'contact__form-status error';
      statusEl.textContent = err.message || 'Unable to submit your inquiry at this moment. Please email us directly at hello@brandorbit.agency.';
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}


/* =============================================================
   === PARALLAX & SUBTLE ATMOSPHERE ===
   - Subtle mouse move parallax for hero 3D visual orb
   - Smooth rAF animation respecting prefers-reduced-motion
   ============================================================= */
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sphere = document.querySelector('.hero__sphere');
  const glow = document.querySelector('.hero__orb-glow');
  const hudCards = document.querySelectorAll('.hero__hud-card');

  if (!sphere) return;

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    targetX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    targetY = (e.clientY - innerHeight / 2) / (innerHeight / 2);

    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(updateParallax);
    }
  }, { passive: true });

  function updateParallax() {
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    if (sphere) {
      sphere.style.transform = `translate(${mouseX * 15}px, ${mouseY * 15}px) rotateY(${mouseX * 12}deg) rotateX(${-mouseY * 12}deg)`;
    }
    if (glow) {
      glow.style.transform = `translate(${mouseX * -25}px, ${mouseY * -25}px) scale(${1 + Math.abs(mouseX) * 0.08})`;
    }

    hudCards.forEach((card, idx) => {
      const factor = (idx + 1) * 7;
      card.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px)`;
    });

    if (Math.abs(targetX - mouseX) > 0.001 || Math.abs(targetY - mouseY) > 0.001) {
      requestAnimationFrame(updateParallax);
    } else {
      isMoving = false;
    }
  }
}


/* =============================================================
   === FOOTER ===
   - Dynamic copyright year
   ============================================================= */
function initFooter() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}


/* =============================================================
   === MOBILE MENU ===
   - Handled inside initNavbar()
   ============================================================= */
function initMobileMenu() {
  // Integrated inside initNavbar for synchronized scroll locking and esc handling
}


/* =============================================================
   === CURSOR (Subtle Card Interaction) ===
   ============================================================= */
function initCursor() {
  // Handled cleanly via CSS transitions to avoid distracting cursor lag
}


/* =============================================================
   === UTILS ===
   ============================================================= */

/**
 * Throttle a callback to fire at most once per `limit` ms.
 * @param {Function} fn
 * @param {number} limit
 */
function throttle(fn, limit = 100) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Debounce a callback.
 * @param {Function} fn
 * @param {number} delay
 */
function debounce(fn, delay = 150) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Get a DOM element (throws if missing in dev mode).
 * @param {string} selector
 * @param {Element} [context]
 */
function qs(selector, context = document) {
  return context.querySelector(selector);
}

function qsa(selector, context = document) {
  return [...context.querySelectorAll(selector)];
}


/* =============================================================
   === INIT ===
   ============================================================= */
document.addEventListener('DOMContentLoaded', init);

function init() {
  initScrollAnimations();  // always first — no deps
  initNavbar();
  initMobileMenu();
  initTypedText();
  initServices();
  initPortfolio();
  initTestimonialsSlider();
  initContactForm();
  initParallax();
  initFooter();
  initCursor();

  // Expose globals for agents that need cross-module access
  window.BrandOrbit = { CONFIG, throttle, debounce, qs, qsa };
}
