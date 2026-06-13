/**
 * Smooth scroll to a section by selector.
 * Falls back to top of page if selector not found.
 */
export function scrollToSection(selector: string) {
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    return true;
  }
  return false;
}

/**
 * Scroll to top of the page.
 */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
