/**
 * Nicholus Mutugi Portfolio - Main JavaScript
 * =====================================================
 */

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Cursor.init();
  Navigation.init();
  ScrollReveal.init();
  PageTransitions.init();
  BackToTop.init();
  ThemeToggle.init();
});

/**
 * Custom Cursor Module
 */
const Cursor = {
  cursor: null,
  ring: null,
  mx: 0,
  my: 0,
  rx: 0,
  ry: 0,

  init() {
    this.cursor = document.getElementById('cursor');
    this.ring = document.getElementById('ring');
    if (!this.cursor || !this.ring) return;

    document.addEventListener('mousemove', (e) => {
      this.mx = e.clientX;
      this.my = e.clientY;
      this.cursor.style.transform = `translate(${this.mx - 5}px, ${this.my - 5}px)`;
    });

    this.animate();
  },

  animate() {
    this.rx += (this.mx - this.rx) * 0.1;
    this.ry += (this.my - this.ry) * 0.1;
    if (this.ring) {
      this.ring.style.transform = `translate(${this.rx - 17}px, ${this.ry - 17}px)`;
    }
    requestAnimationFrame(() => this.animate());
  }
};

/**
 * Navigation Module
 */
const Navigation = {
  navbar: null,
  burger: null,
  mobileNav: null,
  isOpen: false,

  init() {
    this.navbar = document.getElementById('navbar');
    this.burger = document.getElementById('burger');
    this.mobileNav = document.getElementById('mobileNav');

    if (!this.navbar || !this.burger || !this.mobileNav) return;

    // Scroll effect
    window.addEventListener('scroll', () => {
      this.navbar.classList.toggle('scrolled', window.scrollY > 40);
      if (typeof updateDots === 'function') updateDots();
    });

    // Hamburger menu
    this.burger.addEventListener('click', () => {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    });

    // Close on link click
    this.mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => this.close());
    });

    // Initial state
    this.mobileNav.style.display = 'none';
  },

  open() {
    this.isOpen = true;
    this.burger.classList.add('open');
    this.mobileNav.style.display = 'flex';
    requestAnimationFrame(() => this.mobileNav.classList.add('open'));
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.isOpen = false;
    this.burger.classList.remove('open');
    this.mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!this.isOpen) this.mobileNav.style.display = 'none';
    }, 310);
  }
};

/**
 * Scroll Reveal Module
 */
const ScrollReveal = {
  observer: null,

  init() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(el => this.observer.observe(el));
  }
};

/**
 * Page Transitions Module
 */
const PageTransitions = {
  init() {
    // Add fade-in class to body on page load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';

    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });

    // Intercept internal links for smooth transition
    document.querySelectorAll('a[href^="/"], a[href^="#"]').forEach(link => {
      const href = link.getAttribute('href');
      if (href !== '#' && !href.startsWith('#')) {
        link.addEventListener('click', (e) => {
          // Only for same-origin links
          if (link.origin === window.location.origin) {
            e.preventDefault();
            document.body.style.opacity = '0';
            setTimeout(() => {
              window.location.href = href;
            }, 300);
          }
        });
      }
    });
  }
};

/**
 * Back to Top Button Module
 */
const BackToTop = {
  button: null,

  init() {
    this.button = document.getElementById('backToTop');
    if (!this.button) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        this.button.classList.add('visible');
      } else {
        this.button.classList.remove('visible');
      }
    });

    this.button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

/**
 * Theme Toggle Module
 */
const ThemeToggle = {
  button: null,
  icon: null,

  init() {
    this.button = document.getElementById('themeToggle');
    this.icon = document.getElementById('themeIcon');
    if (!this.button) return;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.setTheme(savedTheme);

    this.button.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    });
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (this.icon) {
      this.icon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  }
};

/**
 * Utility: Update active navigation dots (for single-page sections)
 */
function updateDots() {
  const sections = ['hero', 'meet', 'skills-section', 'projects', 'contact'];
  const dots = document.querySelectorAll('.sd');
  if (!dots.length) return;

  let active = 0;
  sections.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < window.innerHeight * 0.55) {
      active = i;
    }
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('on', i === active);
  });
}

/**
 * Utility: Smooth scroll to section
 */
function goToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// Expose for global access
window.updateDots = updateDots;
window.go = goToSection;
