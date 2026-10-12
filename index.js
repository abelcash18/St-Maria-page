/* ==========================================================================
   ST MARIA GORETTI GIRLS' GRAMMAR SCHOOL — INTERACTIVE LOGIC (index.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initActiveNav();
  initScrollReveal();
  initCounters();
  initWelcomeModal();
  initGalleryFilters();
  initBackToTop();
});

// 1. Header scroll tracking
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// 2. Active nav link highlighting based on current pathname
function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-links .nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Normalize href check
    const targetFile = href.split('#')[0];
    if (targetFile === currentPath || (currentPath === '' && targetFile === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// 3. Mobile Navigation Drawer
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;

  const isOpen = menu.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

// Close mobile drawer when clicking overlay outside drawer
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu');
  if (menu && menu.classList.contains('open') && e.target === menu) {
    toggleMenu();
  }
});

// 4. Welcome Announcement Modal (polite, session-aware)
function initWelcomeModal() {
  const modal = document.getElementById('welcomeModal');
  if (!modal) return;

  // Only show on home page if not previously dismissed in this session
  const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
  const hasSeen = sessionStorage.getItem('smg_welcome_modal_dismissed');

  if (isHome && !hasSeen) {
    setTimeout(() => {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }, 1200);
  }
}

function closeWelcome(redirectUrl) {
  const modal = document.getElementById('welcomeModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
  sessionStorage.setItem('smg_welcome_modal_dismissed', 'true');

  if (redirectUrl) {
    window.location.href = redirectUrl;
  }
}

// 5. Number Counter Animation
function initCounters() {
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(counter => observer.observe(counter));
}

function animateValue(el) {
  const target = parseFloat(el.dataset.target || 0);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1600;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * ease);
    
    el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}

// 6. Scroll Reveal Animation
function initScrollReveal() {
  document.body.classList.add('js-loaded');
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px 200px 0px', threshold: 0.01 });

  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 250) {
      el.classList.add('reveal-in');
    } else {
      observer.observe(el);
    }
  });
}

// 7. Lightbox for Galleries
function openLightbox(imageSrc, captionText) {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');

  if (!lb || !lbImg) return;

  lbImg.src = imageSrc;
  if (lbCaption) lbCaption.textContent = captionText || 'St Maria Goretti Girls\' Grammar School';
  
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// 8. Gallery Category Filters
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      galleryItems.forEach(item => {
        const itemCategory = item.dataset.category;
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

// 9. Contact / Admission Form Submission Handler
function handleFormSubmit(event, formType = 'General Inquiry') {
  event.preventDefault();
  const form = event.target;
  const statusEl = form.querySelector('.form-status') || document.getElementById('formStatus');
  const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-primary');

  const formData = new FormData(form);
  const name = formData.get('name') || '';
  const email = formData.get('email') || '';

  if (!name.toString().trim() || !email.toString().includes('@')) {
    if (statusEl) {
      statusEl.className = 'form-status error';
      statusEl.style.display = 'block';
      statusEl.textContent = '⚠️ Please provide a valid full name and email address.';
    }
    return false;
  }

  // Visual loading feedback
  const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Processing...</span>';
  }

  setTimeout(() => {
    if (statusEl) {
      statusEl.className = 'form-status success';
      statusEl.style.display = 'block';
      statusEl.innerHTML = `<strong>✓ Thank you, ${name}!</strong> Your ${formType.toLowerCase()} has been registered. Our Admissions Registry will contact you via ${email} within 24 hours.`;
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }

    form.reset();
  }, 800);

  return false;
}

// 10. Newsletter Form
function handleNewsletter(event) {
  event.preventDefault();
  const form = event.target;
  const emailInput = form.querySelector('input[type="email"]');
  if (!emailInput || !emailInput.value.includes('@')) {
    alert('Please enter a valid email address.');
    return false;
  }

  alert(`Thank you for subscribing! You will receive our monthly Goretti Gazette at ${emailInput.value}.`);
  form.reset();
  return false;
}

// 11. Back To Top Button
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.style.opacity = '1';
      btn.style.visibility = 'visible';
    } else {
      btn.style.opacity = '0';
      btn.style.visibility = 'hidden';
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 12. Keyboard Accessibility (Escape to close modals)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeWelcome();
    const menu = document.getElementById('mobileMenu');
    if (menu && menu.classList.contains('open')) {
      toggleMenu();
    }
  }
});
