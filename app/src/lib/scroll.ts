import { ScrollSmoother } from './gsap';

/**
 * Smooth scroll to a section by selector.
 * Uses ScrollSmoother when active, falls back to native scrollIntoView.
 */
export function scrollToSection(selector: string) {
  const smoother = ScrollSmoother.get();
  const el = document.querySelector(selector);
  if (!el) return false;
  if (smoother) {
    smoother.scrollTo(el, true, 'top 72px');
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
  return true;
}

/** Scroll to top of the page. */
export function scrollToTop() {
  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(0, true);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
