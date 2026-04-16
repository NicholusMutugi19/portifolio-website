/**
 * Utility Functions for Portfolio
 * =====================================================
 */

/**
 * Debounce function for resize/scroll events
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Format date
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Truncate text to specified length
 */
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Get scroll progress (0-1)
 */
function getScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  return docHeight > 0 ? scrollTop / docHeight : 0;
}

/**
 * Check if element is in viewport
 */
function isInViewport(element, offset = 0) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
    rect.bottom >= 0
  );
}

/**
 * Add active class to navigation based on scroll position
 */
function updateActiveNav(sections, navLinks) {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Animate counter from 0 to target
 */
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (target - start) * easeOutQuart);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Lazy load images
 */
function initLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

/**
 * Add reading progress bar
 */
function initReadingProgress() {
  const progressBar = document.getElementById('readingProgress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });
}

/**
 * Filter projects by category
 */
function filterProjects(category) {
  const projects = document.querySelectorAll('.proj-card');
  projects.forEach(project => {
    const type = project.getAttribute('data-category');
    if (category === 'all' || type === category) {
      project.style.display = 'flex';
      setTimeout(() => {
        project.style.opacity = '1';
        project.style.transform = 'translateY(0)';
      }, 50);
    } else {
      project.style.opacity = '0';
      project.style.transform = 'translateY(20px)';
      setTimeout(() => {
        project.style.display = 'none';
      }, 300);
    }
  });
}

/**
 * Search projects
 */
function searchProjects(query) {
  const projects = document.querySelectorAll('.proj-card');
  const searchTerm = query.toLowerCase().trim();

  projects.forEach(project => {
    const title = project.querySelector('h3')?.textContent.toLowerCase() || '';
    const desc = project.querySelector('p')?.textContent.toLowerCase() || '';
    const tags = project.querySelector('.proj-stack')?.textContent.toLowerCase() || '';

    const match = title.includes(searchTerm) || desc.includes(searchTerm) || tags.includes(searchTerm);
    project.style.display = match ? 'flex' : 'none';
  });
}

/**
 * Initialize tooltips
 */
function initTooltips() {
  const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
  tooltipTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', (e) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = trigger.dataset.tooltip;
      tooltip.style.cssText = `
        position: absolute;
        background: var(--card);
        border: 1px solid var(--border);
        padding: 0.5rem 0.75rem;
        font-size: 0.7rem;
        color: var(--text);
        border-radius: 4px;
        z-index: 1000;
        pointer-events: none;
      `;
      document.body.appendChild(tooltip);

      const rect = trigger.getBoundingClientRect();
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
      tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;

      trigger._tooltip = tooltip;
    });

    trigger.addEventListener('mouseleave', () => {
      if (trigger._tooltip) {
        trigger._tooltip.remove();
        trigger._tooltip = null;
      }
    });
  });
}

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    formatDate,
    truncateText,
    getScrollProgress,
    isInViewport,
    copyToClipboard,
    animateCounter,
    initLazyLoad,
    initReadingProgress,
    filterProjects,
    searchProjects,
    initTooltips
  };
}
