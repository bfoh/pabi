// app/src/hooks/use-smooth-scroll.ts
import { useLayoutEffect } from 'react';
import { gsap, ScrollSmoother, prefersReducedMotion } from '../lib/gsap';

/**
 * Initialises ScrollSmoother on the #smooth-wrapper/#smooth-content structure.
 * No-op (native scroll) when the user prefers reduced motion.
 */
export function useSmoothScroll() {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    document.documentElement.classList.add('has-smooth-scroll');
    const ctx = gsap.context(() => {
      ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.2,
        effects: true,
        normalizeScroll: true,
      });
    });

    return () => {
      ctx.revert();
      document.documentElement.classList.remove('has-smooth-scroll');
    };
  }, []);
}
