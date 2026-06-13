// app/src/sections/SceneBackdrop.tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/use-reduced-motion';

gsap.registerPlugin(ScrollTrigger);

export default function SceneBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // Crossfade the sky gradient from night -> dawn -> dusk over the page.
      gsap.to(skyRef.current, {
        backgroundPositionY: '100%',
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true },
      });
      gsap.to(skylineRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true },
      });
      gsap.to(cloudsRef.current, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true },
      });
      // Gentle continuous cloud drift.
      gsap.to('.scene-cloud', {
        x: '+=40',
        duration: 14,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 3,
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={rootRef} className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Sky: tall gradient, scrolled via background-position */}
      <div
        ref={skyRef}
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(180deg, #0A1628 0%, #14213B 28%, #3A3358 48%, #C8963E 62%, #6E5A52 78%, #0F1D32 100%)',
          backgroundSize: '100% 260%',
          backgroundPositionY: '0%',
        }}
      />
      {/* Soft sun glow in the dawn band */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(212,168,77,0.28) 0%, rgba(212,168,77,0) 70%)' }}
      />

      {/* Clouds */}
      <div ref={cloudsRef} className="absolute inset-0">
        {[
          { top: '12%', left: '8%', w: 180, o: 0.10 },
          { top: '22%', left: '62%', w: 240, o: 0.08 },
          { top: '40%', left: '30%', w: 200, o: 0.07 },
        ].map((c, i) => (
          <div
            key={i}
            className="scene-cloud absolute rounded-full bg-white blur-2xl"
            style={{ top: c.top, left: c.left, width: c.w, height: c.w * 0.4, opacity: c.o }}
          />
        ))}
      </div>

      {/* Far skyline silhouette pinned to the bottom of the viewport */}
      <div ref={skylineRef} className="absolute bottom-0 left-0 right-0 h-[34vh]">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full" fill="#0A1628" opacity="0.55">
          <path d="M0 320 L0 200 L60 200 L60 150 L110 150 L110 200 L170 200 L170 120 L210 120 L210 80 L230 80 L230 120 L270 120 L270 200 L340 200 L340 160 L400 160 L400 110 L430 110 L430 160 L500 160 L500 210 L560 210 L560 140 L600 140 L600 90 L620 90 L620 140 L690 140 L690 200 L760 200 L760 150 L820 150 L820 200 L900 200 L900 120 L940 120 L940 70 L960 70 L960 120 L1020 120 L1020 200 L1100 200 L1100 160 L1160 160 L1160 110 L1190 110 L1190 160 L1260 160 L1260 200 L1340 200 L1340 150 L1400 150 L1400 200 L1440 200 L1440 320 Z" />
        </svg>
      </div>
    </div>
  );
}
