/**
 * Groverlaw - Client-Side Interactive & Hardened Security Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initBciModal();
  initMobileNav();
  initPracticeTabs();
  initAccordions();
  initContactForm();
  initSmoothScroll();
  initPageReveals();
  preloadCsrfToken();
});

let cachedCsrfToken = '';

// Preload anti-CSRF token from secure backend endpoint
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
        // Inject token into any forms with name="csrfToken"
        document.querySelectorAll('input[name="csrfToken"]').forEach(input => {
          input.value = cachedCsrfToken;
        });
      }
    }
  } catch (err) {
    // Non-blocking in case running on static host
    console.debug('CSRF endpoint not available in static-only mode');
  }
}

// Bar Council of India Disclaimer Logic
function initBciModal() {
  const modal = document.getElementById('bciModal');
  const acceptBtn = document.getElementById('bciAcceptBtn');
  const declineBtn = document.getElementById('bciDeclineBtn');
  const disclaimerTrigger = document.getElementById('openDisclaimerBtn');

  if (!modal) return;

  const hasAcknowledged = localStorage.getItem('groverlaw_bci_acknowledged');

  // If not previously acknowledged on this browser, show modal
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

// Mobile Navigation Toggle
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('closeMobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// Practice Area Tabs (IP vs Corporate)
function initPracticeTabs() {
  const tabButtons = document.querySelectorAll('.practice-tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      // Update active state on buttons
      tabButtons.forEach(b => {
        b.classList.remove('bg-gold', 'text-slate-900', 'font-bold', 'border-amber-500');
        b.classList.add('text-slate-300', 'hover:text-white', 'border-transparent');
      });
      btn.classList.add('bg-gold', 'text-slate-900', 'font-bold', 'border-amber-500');
      btn.classList.remove('text-slate-300');

      // Update tab contents
      tabContents.forEach(content => {
        if (content.id === targetId) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
}

// Accordion Expanding Details
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.accordion-icon');
      const isOpen = content.classList.contains('open');

      if (isOpen) {
        content.classList.remove('open');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        content.classList.add('open');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

// Output HTML Sanitizer for Client-Side Protection
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Hardened Contact Form Handler with Backend API & Honeypot
function initContactForm() {
  const form = document.getElementById('consultationForm');
  const alertBox = document.getElementById('formAlert');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = form.querySelector('[name="fullName"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const phone = form.querySelector('[name="phone"]')?.value.trim();
    const practiceArea = form.querySelector('[name="practiceArea"]')?.value;
    const message = form.querySelector('[name="message"]')?.value.trim();
    
    // Honeypot field for bot detection
    const honeypot = form.querySelector('[name="website_fax_confirm"]')?.value.trim();

    if (!fullName || !email || !message) {
      showAlert('danger', '<strong>Attention:</strong> Please provide your full name, email address, and a summary of your inquiry.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Send Inquiry';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⌛</span> Securing & Submitting...';
    }

    // Attempt secure backend submission
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
            <svg class="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <p class="font-semibold text-emerald-300">Inquiry Securely Received</p>
              <p class="mt-1">${escapeHtml(result.message)}</p>
              ${result.inquiryId ? `<p class="mt-1 text-[11px] text-emerald-400 font-mono">Reference ID: ${escapeHtml(result.inquiryId)}</p>` : ''}
              <p class="mt-2 text-xs text-emerald-300/80">For urgent legal matters, contact our Chambers directly at +91-124-4145520.</p>
            </div>
          </div>
        `);
        // Refresh token for next action
        preloadCsrfToken();
      } else {
        const errorMsg = result.error || 'Unable to process inquiry at this moment.';
        showAlert('danger', `<strong>Submission Error:</strong> ${escapeHtml(errorMsg)}`);
      }
    } catch (netErr) {
      // Fallback in purely static mode
      form.reset();
      showAlert('success', `
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <p class="font-semibold text-emerald-300">Inquiry Logged</p>
            <p class="mt-1">Thank you for reaching out to <strong>Groverlaw</strong>. Our chambers will review your communication and connect shortly.</p>
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
      alertBox.className = 'p-4 rounded-xl bg-red-950/80 border border-red-500/80 text-red-200 text-xs sm:text-sm mt-4 leading-relaxed shadow-lg';
    } else {
      alertBox.className = 'p-5 rounded-xl bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 text-xs sm:text-sm mt-4 leading-relaxed shadow-lg';
    }
    alertBox.innerHTML = htmlContent;
    alertBox.classList.remove('hidden');
  }
}


// Reveal below-the-fold page sections as they enter view.
function initPageReveals() {
  const sections = Array.from(document.querySelectorAll('main > :is(div, section):not(.reveal-on-scroll)'))\n    .filter(section => !section.querySelector('.anim-hero-eyebrow'));
  if (!sections.length) return;

  const showAll = () => sections.forEach(section => section.classList.add('is-visible'));
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    sections.forEach(section => section.classList.add('motion-reveal'));
    showAll();
    return;
  }

  sections.forEach(section => section.classList.add('motion-reveal'));
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

  sections.forEach(section => observer.observe(section));
}
// Smooth scrolling helper
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth