/**
 * Cognitio - Global Navigation Script
 * Course: Web Technologies (BS CS F24)
 */

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  highlightActiveLink();
  setupTabSwitcher();
});

/**
 * 1. Mobile Menu Toggle
 * Opens and closes the mobile navigation drawer when the hamburger is clicked.
 */
function setupMobileNav() {
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }
}

/**
 * 2. Active Link Highlighter
 * Finds the link matching current URL and adds the 'active' class.
 */
function highlightActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link, .mobile-nav-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * 3. Interactive Tab Switcher (Used on About Page)
 * Switches active panel when user clicks on tab buttons.
 */
function setupTabSwitcher() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabButtons.length === 0) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button active state
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panel active state
      tabPanels.forEach(panel => {
        if (panel.id === targetTab) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}
