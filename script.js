/* ============================================================
   PORTFOLIO SCRIPT
   Organized into named functions, each with one job. They're
   all called once from init() at the bottom of this file, after
   the page has loaded. If one function throws an error, the
   try/catch in init() stops it from breaking the others.
   ============================================================ */

/**
 * initializeNavigation()
 * Handles the sticky nav: opening/closing the mobile menu, and
 * closing it automatically after a link is tapped so the user
 * doesn't have to close it manually before reading the section
 * they jumped to.
 */
function initializeNavigation() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  function openMenu() {
    menu.hidden = false;
    // Reading offsetHeight forces the browser to apply the
    // [hidden] removal before we add "is-open", so the CSS
    // grid-template-rows transition actually animates instead
    // of jumping straight to open.
    void menu.offsetHeight;
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    // Wait for the collapse transition to finish before setting
    // [hidden] again, otherwise it disappears instantly.
    window.setTimeout(() => {
      if (!menu.classList.contains('is-open')) {
        menu.hidden = true;
      }
    }, 520);
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close after selecting a section (required by spec) - works
  // for both mouse clicks and keyboard Enter/Space activation.
  menu.querySelectorAll('.mobile-menu-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape for keyboard users, and return focus to the
  // toggle button so focus doesn't get lost in a hidden panel.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
}

/**
 * initializeActiveSectionTracking()
 * Highlights the current section's link in the nav as the user
 * scrolls, using the same IntersectionObserver approach as the
 * scroll-reveal animations (efficient - no scroll event listeners
 * running on every pixel of scroll).
 */
function initializeActiveSectionTracking() {
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const linkFor = (id) =>
    document.querySelector(`.nav-link[data-section="${id}"]`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('is-active'));
          const active = linkFor(entry.target.id);
          if (active) active.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * initializeScrollAnimations()
 * Finds every element with class="reveal" and watches for it to
 * enter the viewport. When it does, adds "is-visible", which
 * triggers the CSS transition defined in style.css (section 16).
 * Each element is only animated once, then unobserved.
 */
function initializeScrollAnimations() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  // If the browser doesn't support IntersectionObserver (very
  // old browsers), just show everything immediately rather than
  // leaving content invisible.
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/**
 * initialize3DModel(viewerId, loadingId, fallbackId)
 * Wires up ONE model-viewer instance (the hero has one, the 3D
 * World section has another - this function is called once per
 * viewer). It listens for three possible outcomes:
 *   - 'load'  -> model loaded successfully, hide the spinner
 *   - 'error' -> model.glb is missing or broken, show fallback
 *   - neither happens in time -> a timeout also shows fallback,
 *     so the site never gets stuck on "Loading..." forever
 * This is the function that implements the 3D fallback + loading
 * system described in the prompt (parts 12 and 13).
 */
function initialize3DModel(viewerId, loadingId, fallbackId) {
  const viewer = document.getElementById(viewerId);
  const loading = document.getElementById(loadingId);
  const fallback = document.getElementById(fallbackId);
  if (!viewer || !loading || !fallback) return;

  let settled = false;

  function showLoaded() {
    if (settled) return;
    settled = true;
    loading.hidden = true;
    fallback.hidden = true;
  }

  function showFallback(message) {
    if (settled) return;
    settled = true;
    loading.hidden = true;
    fallback.hidden = false;
    handleModelError(viewerId, message);
  }

  viewer.addEventListener('load', showLoaded);
  viewer.addEventListener('error', () => {
    showFallback('model-viewer fired an error event (file missing or invalid)');
  });

  // Safety net: if <model-viewer> itself failed to load as a
  // custom element (e.g. the script tag was blocked), or the
  // network hangs, don't leave the spinner running forever.
  window.setTimeout(() => {
    if (!settled) {
      showFallback('timed out waiting for the 3D model to load');
    }
  }, 9000);
}

/**
 * handleModelError(viewerId, reason)
 * Central place where a 3D load failure is logged. Kept separate
 * from initialize3DModel so it's easy to find and extend later -
 * for example, if you ever want to send this to analytics.
 */
function handleModelError(viewerId, reason) {
  console.warn(`[3D] "${viewerId}" fell back to placeholder: ${reason}`);
}

/**
 * initializeReducedMotionForModels()
 * If the visitor's OS is set to reduce motion, turn off the
 * avatar's auto-rotate spin. camera-controls (drag to look
 * around) stays on, since that's a direct, user-initiated action
 * rather than an ambient animation.
 */
function initializeReducedMotionForModels() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) return;

  document.querySelectorAll('model-viewer').forEach((viewer) => {
    viewer.removeAttribute('auto-rotate');
  });
}

/**
 * initializePauseOffscreen3D()
 * Performance optimization (spec part 16): pauses each
 * model-viewer's auto-rotate when its section scrolls off
 * screen, and resumes it when it scrolls back into view. Full
 * unloading isn't necessary here - model-viewer already reduces
 * its own rendering when off-screen - but stopping the rotation
 * attribute avoids wasted animation frames while the user is
 * reading a different section.
 */
function initializePauseOffscreen3D() {
  const stages = document.querySelectorAll('.avatar-stage, .world3d-stage');
  if (!stages.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const viewer = entry.target.querySelector('model-viewer');
        if (!viewer) return;
        const hasAutoRotateSupport = viewer.hasAttribute('auto-rotate') ||
          viewer.dataset.autoRotate === 'true';

        if (entry.isIntersecting) {
          if (viewer.dataset.autoRotate !== 'false') {
            viewer.setAttribute('auto-rotate', '');
          }
        } else {
          // Remember that auto-rotate should come back later,
          // then remove it while off-screen.
          if (viewer.hasAttribute('auto-rotate')) {
            viewer.dataset.autoRotate = 'true';
          }
          viewer.removeAttribute('auto-rotate');
        }
      });
    },
    { threshold: 0.1 }
  );

  stages.forEach((stage) => observer.observe(stage));
}

/**
 * initializeInteractions()
 * Small independent interaction fixes that don't belong to a
 * bigger system above.
 */
function initializeInteractions() {
  // The contact page's optional GitHub/LinkedIn placeholders
  // point to "#" until real URLs are added. Clicking one
  // shouldn't jump the page or feel broken - this lets the user
  // know why nothing happened instead of silently failing.
  document.querySelectorAll('[data-placeholder="true"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      console.info('This is a placeholder link - add a real URL in index.html.');
    });
  });
}

/**
 * init()
 * Runs every function above once the DOM is ready. Each call is
 * wrapped so that if one feature throws an error, the rest of
 * the page still works - this matches the "error handling" and
 * "no fake functionality breaks the whole site" requirements in
 * the spec.
 */
function init() {
  const steps = [
    initializeNavigation,
    initializeActiveSectionTracking,
    initializeScrollAnimations,
    initializeReducedMotionForModels,
    initializePauseOffscreen3D,
    initializeInteractions,
  ];

  steps.forEach((step) => {
    try {
      step();
    } catch (err) {
      console.error(`[init] ${step.name} failed:`, err);
    }
  });

  // The two model-viewer instances are wired up individually
  // since each needs its own loading/fallback elements.
  try {
    initialize3DModel('hero-model-viewer', 'hero-avatar-loading', 'hero-avatar-fallback');
    initialize3DModel('world-model-viewer', 'world-avatar-loading', 'world-avatar-fallback');
  } catch (err) {
    console.error('[init] initialize3DModel failed:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
