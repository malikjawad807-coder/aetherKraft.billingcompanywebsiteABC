/**
 * AMERICAN BILLING COMPANY - INTERACTIVE ENGINE
 * High-performance vanilla JavaScript for seamless SPA behavior,
 * micro-interactions, responsive navigation, tab switching, and calculators.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScrollSpy();
  initMobileMenu();
  initSmoothScroll();
  initServicesTabs();
  initMetricsCounters();
  initRoiCalculator();
  initLeadCaptureForm();
  initFloatingAssistant();
  initScrollReveal();
  initBackToTop();
});

/* ============================================================
   01. NAVBAR SCROLL SPY & STICKY BEHAVIOR
   ============================================================ */
function initNavbarScrollSpy() {
  const header = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link:not(.dropdown-toggle)');
  const sections = document.querySelectorAll('section[id], footer[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header styling on scroll
    if (scrollPos > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy active link indicator
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });
}

/* ============================================================
   02. MOBILE DRAWER NAVIGATION
   ============================================================ */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      drawer.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // Close drawer on any link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   03. SMOOTH SCROLL WITH HEADER OFFSET
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.getElementById('navbar').offsetHeight || 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================================
   04. INTERACTIVE SERVICES TAB SHOWCASE
   ============================================================ */
function initServicesTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  function switchTab(targetId) {
    tabBtns.forEach(btn => {
      const isTarget = btn.getAttribute('data-tab-target') === targetId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.getAttribute('id') === targetId);
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab-target');
      switchTab(targetId);
    });
  });

  // Support jumping to specific tab from external cards or dropdown links
  document.querySelectorAll('[data-tab]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const tabName = trigger.getAttribute('data-tab');
      let targetId = 'tab-billing';
      if (tabName === 'billing') targetId = 'tab-billing';
      if (tabName === 'credentialing') targetId = 'tab-credentialing';
      if (tabName === 'ar-management' || tabName === 'ar') targetId = 'tab-ar';
      if (tabName === 'scrubbing' || tabName === 'coding') targetId = 'tab-scrubbing';
      if (tabName === 'technology' || tabName === 'pms') targetId = 'tab-pms';

      switchTab(targetId);
    });
  });
}

/* ============================================================
   05. KEY METRICS ANIMATED COUNTERS
   ============================================================ */
function initMetricsCounters() {
  const counters = document.querySelectorAll('.metric-counter');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const duration = 1800; // ms
          const stepTime = 20; // ms
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.getElementById('metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

/* ============================================================
   06. INTERACTIVE ROI & PRACTICE REVENUE CALCULATOR
   ============================================================ */
function initRoiCalculator() {
  const collectionsSlider = document.getElementById('monthlyCollections');
  const denialSlider = document.getElementById('denialRate');

  const collectionsValDisplay = document.getElementById('collectionsValDisplay');
  const denialValDisplay = document.getElementById('denialValDisplay');
  const annualRecoveredDisplay = document.getElementById('annualRecoveredDisplay');
  const monthlyLiftDisplay = document.getElementById('monthlyLiftDisplay');

  if (!collectionsSlider || !denialSlider) return;

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  function recalculate() {
    const monthlyVolume = parseFloat(collectionsSlider.value);
    const denialPct = parseFloat(denialSlider.value) / 100;

    // Display inputs
    collectionsValDisplay.textContent = currencyFormatter.format(monthlyVolume);
    denialValDisplay.textContent = `${(denialPct * 100).toFixed(1)}%`;

    // Algorithm:
    // Monthly Denied Dollars = monthlyVolume * denialPct
    // American Billing Co reduces denials by 98% and improves baseline collections by 12% to 23%
    const monthlyDenied = monthlyVolume * denialPct;
    const monthlyRecoveredFromDenials = monthlyDenied * 0.90; // 90% recovered
    const monthlyCleanFlowBoost = monthlyVolume * 0.045; // 4.5% boost from rapid turnaround & underpaid claim appeals
    const totalMonthlyLift = monthlyRecoveredFromDenials + monthlyCleanFlowBoost;
    const totalAnnualRecovered = totalMonthlyLift * 12;

    annualRecoveredDisplay.textContent = currencyFormatter.format(totalAnnualRecovered);
    monthlyLiftDisplay.textContent = `+${currencyFormatter.format(totalMonthlyLift)}`;
  }

  collectionsSlider.addEventListener('input', recalculate);
  denialSlider.addEventListener('input', recalculate);

  // Initial calculation run
  recalculate();
}

/* ============================================================
   07. LEAD CAPTURE FORM VALIDATION & CONFIRMATION
   ============================================================ */
function initLeadCaptureForm() {
  const form = document.getElementById('leadCaptureForm');
  const formSuccess = document.getElementById('formSuccess');
  const resetBtn = document.getElementById('resetFormBtn');

  if (!form || !formSuccess) return;

  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset errors
    nameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';

    // Validate Name
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your full name.';
      isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid practice email address.';
      isValid = false;
    }

    // Validate Phone
    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      phoneError.textContent = 'Please enter a valid 10-digit phone number.';
      isValid = false;
    }

    if (isValid) {
      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Processing...</span>';

      setTimeout(() => {
        form.style.display = 'none';
        formSuccess.classList.add('active');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>SUBMIT DEMO REQUEST</span>';
      }, 700);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'flex';
      formSuccess.classList.remove('active');
    });
  }
}

/* ============================================================
   08. FLOATING AI ASSISTANT WIDGET & INSTANT Q&A
   ============================================================ */
function initFloatingAssistant() {
  const openBtn = document.getElementById('openChatBtn');
  const closeBtn = document.getElementById('closeChatBtn');
  const chatPopup = document.getElementById('chatPopup');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendChatBtn');
  const promptChips = document.querySelectorAll('.prompt-chip');

  if (!openBtn || !chatPopup) return;

  function toggleChat() {
    const isActive = chatPopup.classList.contains('active');
    if (isActive) {
      chatPopup.classList.remove('active');
      chatPopup.setAttribute('aria-hidden', 'true');
    } else {
      chatPopup.classList.add('active');
      chatPopup.setAttribute('aria-hidden', 'false');
      if (chatInput) chatInput.focus();
    }
  }

  openBtn.addEventListener('click', toggleChat);
  if (closeBtn) closeBtn.addEventListener('click', toggleChat);

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Handle Quick FAQ Prompt Chips
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const userQuestion = chip.textContent.trim();
      const botAnswer = chip.getAttribute('data-answer');

      appendMessage('user', userQuestion);

      setTimeout(() => {
        appendMessage('bot', botAnswer);
      }, 350);
    });
  });

  // Handle User Input Text
  function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    chatInput.value = '';

    // Smart conversational response based on American Billing Company context
    setTimeout(() => {
      const query = text.toLowerCase();
      let response = "Thanks for asking! American Billing Company provides full-service medical billing, certified coding, credentialing, and aging AR management with zero upfront cost. Would you like to schedule a free practice audit or speak to our team at (800) 585-3908?";

      if (query.includes('cost') || query.includes('price') || query.includes('pricing') || query.includes('fee')) {
        response = "Our services have been made affordable to meet the requirements of clients at every scale. There are no upfront costs, no hidden software fees, and we offer a 1-month free trial!";
      } else if (query.includes('credential') || query.includes('enroll')) {
        response = "Yes, physician credentialing is our everyday job! We handle insurance enrollments, CAQH re-attestation, and double-check every document to eliminate delays caused by incomplete dossiers.";
      } else if (query.includes('ar') || query.includes('aging') || query.includes('collection') || query.includes('denial')) {
        response = "Our dedicated AR managers perform time-stamped follow-ups and daily aging logs to eliminate claims older than 90 and 120 days, boosting cash flow and reducing denials by 98%.";
      } else if (query.includes('hipaa') || query.includes('security') || query.includes('protect')) {
        response = "All our systems are 100% HIPAA compliant with 256-bit encryption protocols. This high-grade security is provided to all clients at no additional IT fee.";
      } else if (query.includes('phone') || query.includes('call') || query.includes('contact')) {
        response = "You can reach our specialists directly toll-free at (800) 585-3908, by fax at (208) 323-5078, or via email at info@americanbilling.co.";
      }

      appendMessage('bot', response);
    }, 450);
  }

  if (sendBtn) sendBtn.addEventListener('click', handleSendMessage);
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSendMessage();
    });
  }
}

/* ============================================================
   09. SCROLL REVEAL (Intersection Observer)
   ============================================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ============================================================
   10. BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
