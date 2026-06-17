/**
 * Scroll Animation Utility
 * 
 * Automatically animates elements with [data-scroll-animate] attribute
 * when they enter the viewport. Respects prefers-reduced-motion.
 * 
 * Usage: Add data-scroll-animate to any element that should fade in on scroll.
 * Optional attributes:
 *   - data-scroll-delay="200" - Delay animation by 200ms
 *   - data-scroll-direction="left|right|up|scale" - Animation direction
 * 
 * @module utils/scroll-animation
 */

(function () {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Skip animations if user prefers reduced motion
    return;
  }

  // Animation state tracking
  const observedElements = new WeakSet();

  /**
   * Get animation class based on direction
   * @param {string} direction - Animation direction
   * @returns {string} CSS transform class
   */
  function getDirectionClass(direction) {
    const directions = {
      left: '-translate-x-8',
      right: 'translate-x-8',
      up: 'translate-y-8',
      scale: 'scale-95',
      default: 'translate-y-8'
    };
    return directions[direction] || directions.default;
  }

  /**
   * Initialize scroll animation for an element
   * @param {Element} element - Element to animate
   */
  function initScrollAnimation(element) {
    if (observedElements.has(element)) {
      return;
    }

    const delay = element.getAttribute('data-scroll-delay') || '0';
    const direction = element.getAttribute('data-scroll-direction') || 'up';
    
    // Apply initial state
    element.style.opacity = '0';
    element.style.transition = `opacity 0.7s ease-out, transform 0.7s ease-out`;
    element.style.transitionDelay = `${delay}ms`;
    element.classList.add(getDirectionClass(direction));

    observedElements.add(element);
  }

  /**
   * Show element (trigger animation)
   * @param {Element} element - Element to show
   */
  function showElement(element) {
    element.style.opacity = '1';
    element.classList.remove(
      'translate-y-8',
      '-translate-x-8',
      'translate-x-8',
      'scale-95'
    );
  }

  /**
   * Create IntersectionObserver for scroll animations
   * @returns {IntersectionObserver} Observer instance
   */
  function createObserver() {
    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showElement(entry.target);
          // Stop observing once animated
          entry.target.removeAttribute('data-scroll-animate');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
  }

  /**
   * Initialize all scroll-animate elements
   */
  function init() {
    if (prefersReducedMotion) {
      return;
    }

    const observer = createObserver();
    
    // Observe existing elements
    document.querySelectorAll('[data-scroll-animate]').forEach((element) => {
      initScrollAnimation(element);
      observer.observe(element);
    });

    // Observe dynamically added elements via MutationObserver
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            if (element.hasAttribute('data-scroll-animate')) {
              initScrollAnimation(element);
              observer.observe(element);
            }
            // Check children too
            element.querySelectorAll('[data-scroll-animate]').forEach((child) => {
              initScrollAnimation(child);
              observer.observe(child);
            });
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for programmatic use
  window.SimplyEnakScrollAnimations = {
    init,
    observe: (element) => {
      if (!prefersReducedMotion && element) {
        const observer = createObserver();
        initScrollAnimation(element);
        observer.observe(element);
      }
    }
  };
})();
