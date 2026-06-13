// app/src/components/VanJourney.tsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VanSvg from './VanSvg';
import { getRoadPath, sampleRoad } from '../lib/journeyPath';
import { useReducedMotion } from '../hooks/use-reduced-motion';

gsap.registerPlugin(ScrollTrigger);

export default function VanJourney() {
  const layerRef = useRef<HTMLDivElement>(null);
  const vanRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0, vh: 0 });
  const reduced = useReducedMotion();

  // Van starts ~half a viewport down (visible in the hero) and ends a little
  // above the very bottom so it arrives in the footer/trust zone.
  const padTop = dims.vh * 0.5;
  const padBottom = dims.vh * 0.45;

  // Measure viewport width + full document height.
  useLayoutEffect(() => {
    const measure = () => {
      const width = window.innerWidth;
      const vh = window.innerHeight;
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      setDims({ width, height, vh });
    };
    measure();
    window.addEventListener('resize', measure);
    // Re-measure after fonts/images settle.
    const t = window.setTimeout(measure, 600);
    return () => {
      window.removeEventListener('resize', measure);
      window.clearTimeout(t);
    };
  }, []);

  // Drive the van.
  useEffect(() => {
    const van = vanRef.current;
    if (!van || dims.width === 0 || dims.height === 0) return;

    const place = (t: number) => {
      const s = sampleRoad(t, dims.width, dims.height, padTop, padBottom);
      gsap.set(van, {
        x: s.x,
        y: s.y,
        rotation: s.angle,
        scale: s.scale,
        xPercent: -50,
        yPercent: -50,
      });
    };

    if (reduced) {
      place(0.06); // parked near the top (hero)
      return;
    }

    const ctx = gsap.context(() => {
      const proxy = { t: 0 };
      gsap.to(proxy, {
        t: 1,
        ease: 'none',
        onUpdate: () => place(proxy.t),
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });
      // Continuous wheel spin.
      gsap.to('.van-wheel', {
        rotation: 360,
        transformOrigin: 'center',
        repeat: -1,
        ease: 'none',
        duration: 1.4,
      });
      ScrollTrigger.refresh();
      place(0);
    }, layerRef);

    return () => ctx.revert();
  }, [dims, reduced]);

  return (
    <div
      ref={layerRef}
      className="absolute top-0 left-0 w-full z-10 pointer-events-none"
      style={{ height: dims.height || '100%' }}
    >
      {/* Road */}
      {dims.width > 0 && (
        <svg
          className="absolute top-0 left-0"
          width={dims.width}
          height={dims.height}
          viewBox={`0 0 ${dims.width} ${dims.height}`}
          fill="none"
        >
          <path d={getRoadPath(dims.width, dims.height, padTop, padBottom)} stroke="#0A1628" strokeOpacity="0.55" strokeWidth="74" strokeLinecap="round" />
          <path d={getRoadPath(dims.width, dims.height, padTop, padBottom)} stroke="#1A2B47" strokeOpacity="0.6" strokeWidth="64" strokeLinecap="round" />
          <path d={getRoadPath(dims.width, dims.height, padTop, padBottom)} stroke="#C8963E" strokeOpacity="0.7" strokeWidth="3" strokeDasharray="22 26" strokeLinecap="round" />
        </svg>
      )}

      {/* Van */}
      <div ref={vanRef} className="absolute top-0 left-0 w-[200px] sm:w-[260px] md:w-[320px]" style={{ willChange: 'transform' }}>
        <VanSvg className="w-full h-auto drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]" />
      </div>
    </div>
  );
}
