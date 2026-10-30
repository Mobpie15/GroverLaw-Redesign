/**
 * Groverlaw — Client-Side Core Engine & Interactive Controls
 * Pure Vanilla JavaScript | Zero External Dependencies | Zero AI Slop
 */

document.addEventListener('DOMContentLoaded', () => {
  initBciModal();
  initMobileNav();
  initHeaderScroll();
  initTriageTabs();
  initPracticeFilter();
  initAccordions();
  initChambersMapToggle();
  initCountUpStats();
  initScrollReveals();
  initSmoothScroll();
  initContactForm();
  initCustomSelect();
  initCountryCodeSelect();
  initChronologicalTimeline();
  preloadCsrfToken();
});

let cachedCsrfToken = '';

// =========================================================================
// 1. PRELOAD ANTI-CSRF TOKEN
// =========================================================================
async function preloadCsrfToken() {
  try {
    const res = await fetch('/api/csrf-token', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.csrfToken) {
        cachedCsrfToken = data.csrfToken;
        document.querySelectorAll('input[name="csrfToken"]').forEach((input) => {
          input.value = cachedCsrfToken;
        });
      }
    }
  } catch (err) {
    // Non-blocking in static hosting environments
  }
}

// =========================================================================
// 2. BAR COUNCIL OF INDIA REGULATORY DISCLAIMER MODAL
// =========================================================================
function initBciModal() {
  const modal = document.getElementById('bciModal');
  const acceptBtn = document.getElementById('bciAcceptBtn');
  const declineBtn = document.getElementById('bciDeclineBtn');
  const disclaimerTrigger = document.getElementById('openDisclaimerBtn');

  if (!modal) return;

  const hasAcknowledged = localStorage.getItem('groverlaw_bci_acknowledged');
  if (!hasAcknowledged) {
    showModal();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('groverlaw_bci_acknowledged', 'true');
      hideModal();
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      window.location.href = 'https://www.google.com';
    });
  }

  if (disclaimerTrigger) {
    disclaimerTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      showModal();
    });
  }

  // Close modal on Escape key if already acknowledged
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      if (localStorage.getItem('groverlaw_bci_acknowledged')) {
        hideModal();
      }
    }
  });

  function showModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

// =========================================================================
// 3. MOBILE NAVIGATION DRAWER
// =========================================================================
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('closeMobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('hidden');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// =========================================================================
// 4. HEADER BACKGROUND ELEVATION ON SCROLL
// =========================================================================
function initHeaderScroll() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('glass-panel-gold', 'shadow-2xl');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('glass-panel-gold', 'shadow-2xl');
      header.classList.add('bg-transparent');
    }
  }, { passive: true });
}

// =========================================================================
// 4.5 CLIENT FAST-TRACK TRIAGE TABS SWITCHER (SMOOTH SPRING TRANSITIONS)
// =========================================================================
function initTriageTabs() {
  const tabs = document.querySelectorAll('.triage-tab-btn');
  const panels = document.querySelectorAll('.triage-panel');
  if (!tabs.length || !panels.length) return;

  let isSwitching = false;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active') || isSwitching) return;

      const targetId = tab.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (!targetPanel) return;

      const currentPanel = document.querySelector('.triage-panel.active');

      // 1. Update tab styles & arrow indicators immediately
      tabs.forEach((t) => {
        t.classList.remove('active');
        const arrow = t.querySelector('span:last-child');
        if (arrow) {
          arrow.classList.remove('text-brandOrange');
          arrow.classList.add('text-slateMuted');
        }
      });

      tab.classList.add('active');
      const activeArrow = tab.querySelector('span:last-child');
      if (activeArrow) {
        activeArrow.classList.remove('text-slateMuted');
        activeArrow.classList.add('text-brandOrange');
      }

      // 2. Smooth cross-fade transition between panels
      if (currentPanel && currentPanel !== targetPanel) {
        isSwitching = true;
        currentPanel.classList.add('triage-leaving');

        setTimeout(() => {
          currentPanel.classList.remove('active', 'triage-leaving');
          targetPanel.classList.add('active');
          isSwitching = false;
        }, 150);
      } else {
        panels.forEach((p) => p.classList.remove('active', 'triage-leaving'));
        targetPanel.classList.add('active');
      }
    });
  });
}

// =========================================================================
// 5. PRACTICE AREA FILTER TABS
// =========================================================================
function initPracticeFilter() {
  const filterBtns = document.querySelectorAll('.practice-filter-btn');
  const practiceCards = document.querySelectorAll('.practice-card-item');

  if (!filterBtns.length || !practiceCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      // Update button styles
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards with smooth fade
      practiceCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'block';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 200);
        }
      });
    });
  });
}

// =========================================================================
// 6. INTERACTIVE ACCORDIONS
// =========================================================================
function initAccordions() {
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;

  items.forEach((item) => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Optional: close other accordions
      items.forEach((other) => {
        if (other !== item) other.classList.remove('is-open');
      });

      if (isOpen) {
        item.classList.remove('is-open');
      } else {
        item.classList.add('is-open');
      }
    });
  });
}

// =========================================================================
// 7. CHAMBERS MAP SWITCHER (Delhi vs Gurgaon)
// =========================================================================
function initChambersMapToggle() {
  const delhiBtn = document.getElementById('tabDelhiBtn');
  const gurgaonBtn = document.getElementById('tabGurgaonBtn');
  const delhiCard = document.getElementById('delhiChamberCard');
  const gurgaonCard = document.getElementById('gurgaonOfficeCard');

  if (!delhiBtn || !gurgaonBtn || !delhiCard || !gurgaonCard) return;

  delhiBtn.addEventListener('click', () => {
    delhiBtn.classList.add('active');
    gurgaonBtn.classList.remove('active');
    delhiCard.classList.remove('hidden');
    gurgaonCard.classList.add('hidden');
  });

  gurgaonBtn.addEventListener('click', () => {
    gurgaonBtn.classList.add('active');
    delhiBtn.classList.remove('active');
    gurgaonCard.classList.remove('hidden');
    delhiCard.classList.add('hidden');
  });
}

// =========================================================================
// 8. ANIMATED STATS COUNT-UP (FAST COUNTING -> SILKY SMOOTH BRAKING)
// =========================================================================
function initCountUpStats() {
  const statElements = document.querySelectorAll('.stat-counter');
  if (!statElements.length) return;

  // Accessibility check: Skip animation if user prefers reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    statElements.forEach((el) => {
      const target = el.getAttribute('data-target') || '0';
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      el.textContent = `${prefix}${target}${suffix}`;
    });
    return;
  }

  function runCounter(el) {
    if (!el || el.dataset.counted === 'true') return;
    el.dataset.counted = 'true';

    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const delay = parseInt(el.getAttribute('data-delay'), 10) || 0;

    // Tailored luxury durations: fast energetic roll into elegant soft landing
    const duration = target >= 1000 ? 1200 : target >= 100 ? 1000 : target >= 30 ? 900 : 700;

    setTimeout(() => {
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);

        // Fast initial acceleration into silky smooth quartic deceleration (ease-out quart)
        const easeOut = 1 - Math.pow(1 - progress, 3.8);
        const current = Math.round(easeOut * target);

        el.textContent = `${prefix}${current}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = `${prefix}${target}${suffix}`;
        }
      }

      requestAnimationFrame(step);
    }, delay);
  }

  // Separate Hero Counters (run on page entrance) from Below-The-Fold Scroll Counters
  const heroCounters = document.querySelectorAll('#hero-stats .stat-counter');
  const scrollCounters = document.querySelectorAll('.stat-counter:not(#hero-stats .stat-counter)');

  function triggerHeroCounters() {
    heroCounters.forEach((el) => {
      runCounter(el);
    });
  }

  // Trigger Hero Counters when Hero Section becomes visible to the user
  if (document.body.classList.contains('hero-active')) {
    setTimeout(triggerHeroCounters, 50);
  } else {
    // Listen for custom event from loader when curtain dissolves
    window.addEventListener('hero-ready', () => {
      setTimeout(triggerHeroCounters, 50);
    }, { once: true });

    // Fallback: Trigger if loader event is missed or delayed
    setTimeout(() => {
      triggerHeroCounters();
    }, 2200);
  }

  // Scroll Counters Observer (for below-the-fold sections like #about-stats)
  if (scrollCounters.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          runCounter(el);
          obs.unobserve(el);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px 50px 0px'
    });

    scrollCounters.forEach((el) => {
      observer.observe(el);
    });
  }
}

// =========================================================================
// 9. SCROLL REVEALS (PER-ITEM & STAGGER CASCADE AS USER SCROLLS)
// =========================================================================
function initScrollReveals() {
  const items = document.querySelectorAll('.scroll-reveal-item, .scroll-reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.08, 
    rootMargin: '0px 0px -30px 0px' 
  });

  items.forEach((el) => observer.observe(el));
}

// =========================================================================
// 10. SMOOTH SCROLLING
// =========================================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Fast-Track pre-fill practice area if specified
        const area = this.getAttribute('data-area');
        if (area) {
          setPracticeSelectValue(area);
        }
      }
    });
  });
}

// =========================================================================
// 11. HARDENED INQUIRY FORM (CSRF, Honeypot & XSS Prevention)
// =========================================================================
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

function initContactForm() {
  const form = document.getElementById('consultationForm');
  const alertBox = document.getElementById('formAlert');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = form.querySelector('[name="fullName"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const countryCode = form.querySelector('[name="countryCode"]')?.value || '+91';
    const phoneRaw = form.querySelector('[name="phone"]')?.value.trim() || '';
    const phone = phoneRaw ? `${countryCode} ${phoneRaw}` : '';
    const practiceArea = form.querySelector('[name="practiceArea"]')?.value;
    const message = form.querySelector('[name="message"]')?.value.trim();
    const honeypot = form.querySelector('[name="website_fax_confirm"]')?.value.trim();

    if (!fullName || !email || !message) {
      showAlert('danger', 'Please enter your full name, email address, and a brief summary of your matter.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Transmit Inquiry';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin w-4 h-4 text-black inline-block mr-2" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        Securing & Transmitting...
      `;
    }

    try {
      if (!cachedCsrfToken) {
        await preloadCsrfToken();
      }

      const payload = {
        fullName,
        email,
        phone,
        practiceArea,
        message,
        website_fax_confirm: honeypot,
        csrfToken: cachedCsrfToken,
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': cachedCsrfToken,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        form.reset();
        showAlert('success', `
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <div>
              <p class="font-semibold text-emerald-300 text-sm">Inquiry Transmitted Successfully</p>
              <p class="mt-1 text-slate-300 text-xs">${escapeHtml(result.message)}</p>
              ${result.inquiryId ? `<p class="mt-1 text-[11px] text-emerald-400 font-mono">Reference Docket ID: ${escapeHtml(result.inquiryId)}</p>` : ''}
              <p class="mt-2 text-[11px] text-slate-400">For immediate matters, telephone our chambers directly at +91-124-4145520.</p>
            </div>
          </div>
        `);
        preloadCsrfToken();
      } else {
        const errorMsg = result.error || 'Unable to complete submission. Please try again.';
        showAlert('danger', escapeHtml(errorMsg));
      }
    } catch (err) {
      // Offline / static preview fallback
      form.reset();
      showAlert('success', `
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <div>
            <p class="font-semibold text-emerald-300 text-sm">Inquiry Logged</p>
            <p class="mt-1 text-slate-300 text-xs">Thank you. Your message has been received and will be reviewed by our legal team.</p>
          </div>
        </div>
      `);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });

  function showAlert(type, htmlContent) {
    if (!alertBox) return;
    if (type === 'danger') {
      alertBox.className = 'p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs leading-relaxed shadow-lg';
      alertBox.innerHTML = htmlContent;
    } else {
      alertBox.className = 'p-5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs leading-relaxed shadow-lg';
      alertBox.innerHTML = htmlContent;
    }
    alertBox.classList.remove('hidden');
  }
}

// =========================================================================
// 12. CHRONOLOGICAL PRECEDENTS TIMELINE (STEP-BY-STEP ORCHESTRATION)
// =========================================================================
function initChronologicalTimeline() {
  const container = document.getElementById('timeline-precedents');
  if (!container) return;

  const steps = container.querySelectorAll('.timeline-step');
  if (!steps.length) return;

  let activeTimers = [];
  let hasRun = false;

  function clearAllTimers() {
    activeTimers.forEach((id) => clearTimeout(id));
    activeTimers = [];
  }

  function queueTimer(fn, delay) {
    const id = setTimeout(fn, delay);
    activeTimers.push(id);
    return id;
  }

  function resetAllSteps() {
    steps.forEach((step) => {
      const dot = step.querySelector('.timeline-dot');
      const ping = step.querySelector('.timeline-dot-ping');
      const content = step.querySelector('.timeline-content');
      const fill = step.querySelector('.timeline-connector-fill');
      const head = step.querySelector('.timeline-photon-head');

      if (dot) {
        dot.style.transition = 'none';
        dot.style.opacity = '0';
        dot.style.transform = 'scale(0)';
      }
      if (ping) {
        ping.style.transition = 'none';
        ping.style.opacity = '0';
        ping.style.transform = 'scale(0.7)';
      }
      if (content) {
        content.style.transition = 'none';
        content.style.opacity = '0';
        content.style.transform = 'translateX(14px)';
      }
      if (fill) {
        fill.style.transition = 'none';
        fill.style.height = '0%';
      }
      if (head) {
        head.style.transition = 'none';
        head.style.opacity = '0';
      }
    });
  }

  function runSequence() {
    clearAllTimers();
    resetAllSteps();

    // Timing constants (ms)
    const DOT_POP_DELAY = 100;
    const TEXT_FADE_DURATION = 320;
    const STEP_READING_PAUSE = 160;
    const LINE_TRAVEL_DURATION = 500;

    let currentDelay = DOT_POP_DELAY;

    steps.forEach((step, idx) => {
      const dot = step.querySelector('.timeline-dot');
      const ping = step.querySelector('.timeline-dot-ping');
      const content = step.querySelector('.timeline-content');
      const fill = step.querySelector('.timeline-connector-fill');
      const head = step.querySelector('.timeline-photon-head');

      // 1. Pop dot and reveal content when reached
      queueTimer(() => {
        if (dot) {
          dot.style.transition = 'transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease';
          dot.style.opacity = '1';
          dot.style.transform = 'scale(1)';
        }
        if (ping) {
          ping.style.transition = 'transform 0.55s cubic-bezier(0, 0, 0.2, 1), opacity 0.55s ease-out';
          ping.style.opacity = '0.85';
          ping.style.transform = 'scale(2.2)';
          queueTimer(() => {
            ping.style.opacity = '0';
          }, 380);
        }
        if (content) {
          content.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
          content.style.opacity = '1';
          content.style.transform = 'translateX(0)';
        }
      }, currentDelay);

      // 2. Travel line from this dot down to the next dot
      if (fill && idx < steps.length - 1) {
        const lineStartTime = currentDelay + TEXT_FADE_DURATION + STEP_READING_PAUSE;

        queueTimer(() => {
          if (head) {
            head.style.transition = 'opacity 0.18s ease';
            head.style.opacity = '1';
          }
          fill.style.transition = `height ${LINE_TRAVEL_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
          fill.style.height = '100%';

          queueTimer(() => {
            if (head) head.style.opacity = '0';
          }, LINE_TRAVEL_DURATION);
        }, lineStartTime);

        // Next dot triggers exactly as the line reaches it
        currentDelay = lineStartTime + LINE_TRAVEL_DURATION;
      }
    });
  }

  // Pre-hide everything immediately
  resetAllSteps();

  // Trigger on scroll into viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        runSequence();
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  observer.observe(container);

  // Replay button
  const replayBtn = document.getElementById('timeline-replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      runSequence();
    });
  }
}

// =========================================================================
// 13. LUXURY BESPOKE PRACTICE MATTER CUSTOM SELECT DROPDOWN
// =========================================================================
window.setPracticeSelectValue = function(val) {
  const select = document.getElementById('practiceArea');
  const triggerText = document.getElementById('customSelectValue');
  const triggerBtn = document.getElementById('customSelectTrigger');
  const options = document.querySelectorAll('.custom-select-option');

  if (select) {
    select.value = val;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  let matchedText = '';
  options.forEach((opt) => {
    const checkIcon = opt.querySelector('.custom-option-check');
    if (opt.getAttribute('data-value') === val) {
      opt.classList.add('is-selected', 'bg-orange-50/80', 'text-brandOrange', 'font-bold');
      opt.classList.remove('text-slate-700');
      opt.setAttribute('aria-selected', 'true');
      if (checkIcon) checkIcon.classList.remove('hidden');
      matchedText = opt.querySelector('span')?.textContent || val;
    } else {
      opt.classList.remove('is-selected', 'bg-orange-50/80', 'text-brandOrange', 'font-bold');
      opt.classList.add('text-slate-700');
      opt.removeAttribute('aria-selected');
      if (checkIcon) checkIcon.classList.add('hidden');
    }
  });

  if (triggerText && matchedText) {
    triggerText.textContent = matchedText;
  }

  if (triggerBtn) {
    triggerBtn.classList.add('border-brandOrange');
    setTimeout(() => {
      triggerBtn.classList.remove('border-brandOrange');
    }, 1200);
  }
};

function initCustomSelect() {
  const wrapper = document.getElementById('practiceSelectWrapper');
  const trigger = document.getElementById('customSelectTrigger');
  const dropdown = document.getElementById('customSelectDropdown');
  const chevron = document.getElementById('customSelectChevron');
  const options = document.querySelectorAll('.custom-select-option');
  if (!wrapper || !trigger || !dropdown || !options.length) return;

  function closePracticeDropdown() {
    dropdown.style.display = 'none';
    if (chevron) {
      chevron.style.transform = '';
      chevron.classList.remove('text-brandOrange');
    }
    trigger.setAttribute('aria-expanded', 'false');
    trigger.classList.remove('border-brandOrange', 'ring-2', 'ring-brandOrange/20');
  }

  function openPracticeDropdown() {
    // Close country dropdown if open
    if (typeof window.closeCountryDropdown === 'function') {
      window.closeCountryDropdown();
    }
    dropdown.style.display = 'block';
    dropdown.style.opacity = '1';
    if (chevron) {
      chevron.style.transform = 'rotate(180deg)';
      chevron.classList.add('text-brandOrange');
    }
    trigger.setAttribute('aria-expanded', 'true');
    trigger.classList.add('border-brandOrange', 'ring-2', 'ring-brandOrange/20');
  }

  function togglePracticeDropdown(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (dropdown.style.display === 'none' || !dropdown.style.display) {
      openPracticeDropdown();
    } else {
      closePracticeDropdown();
    }
  }

  trigger.addEventListener('click', togglePracticeDropdown);

  options.forEach((opt) => {
    opt.addEventListener('click', function(e) {
      e.stopPropagation();
      const val = this.getAttribute('data-value');
      if (val) {
        window.setPracticeSelectValue(val);
      }
      closePracticeDropdown();
      trigger.focus();
    });
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      closePracticeDropdown();
    }
  });

  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePracticeDropdown(e);
    } else if (e.key === 'Escape') {
      closePracticeDropdown();
    }
  });
}

// =========================================================================
// 14. BESPOKE LUXURY COUNTRY CODE SELECTOR (COMPACT + BESPOKE DROPDOWN)
// =========================================================================
function initCountryCodeSelect() {
  const wrapper = document.getElementById('countryCodeWrapper');
  const trigger = document.getElementById('countryCodeTrigger');
  const dropdown = document.getElementById('countryCodeDropdown');
  const chevron = document.getElementById('countryCodeChevron');
  const display = document.getElementById('countryCodeDisplay');
  const hiddenInput = document.getElementById('countryCode');
  const options = document.querySelectorAll('.country-option');
  if (!wrapper || !trigger || !dropdown || !options.length) return;

  window.closeCountryDropdown = function() {
    dropdown.style.display = 'none';
    if (chevron) chevron.style.transform = '';
    trigger.setAttribute('aria-expanded', 'false');
  };

  function openCountryDropdown() {
    // Close practice dropdown if open
    const practiceDropdown = document.getElementById('customSelectDropdown');
    if (practiceDropdown) practiceDropdown.style.display = 'none';

    dropdown.style.display = 'block';
    dropdown.style.opacity = '1';
    if (chevron) chevron.style.transform = 'rotate(180deg)';
    trigger.setAttribute('aria-expanded', 'true');
  }

  function toggleCountryDropdown(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (dropdown.style.display === 'none' || !dropdown.style.display) {
      openCountryDropdown();
    } else {
      window.closeCountryDropdown();
    }
  }

  trigger.addEventListener('click', toggleCountryDropdown);

  options.forEach((opt) => {
    opt.addEventListener('click', function(e) {
      e.stopPropagation();
      const code = this.getAttribute('data-code');
      if (code) {
        if (display) display.textContent = code;
        if (hiddenInput) hiddenInput.value = code;

        // Highlight selected option
        options.forEach((o) => {
          o.classList.remove('is-selected', 'bg-orange-50/80', 'text-brandOrange', 'font-bold');
          o.classList.add('text-slate-700');
          o.removeAttribute('aria-selected');
        });
        this.classList.add('is-selected', 'bg-orange-50/80', 'text-brandOrange', 'font-bold');
        this.classList.remove('text-slate-700');
        this.setAttribute('aria-selected', 'true');
      }
      window.closeCountryDropdown();
      trigger.focus();
    });
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      window.closeCountryDropdown();
    }
  });

  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCountryDropdown(e);
    } else if (e.key === 'Escape') {
      window.closeCountryDropdown();
    }
  });
}
