// app/src/lib/gsap.ts
// Central GSAP setup: register plugins once, expose helpers + custom eases.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// Signature editorial easing — slow, expensive settle.
export const EASE = 'expo.out';
export const EASE_INOUT = 'power3.inOut';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger, ScrollSmoother, SplitText };
