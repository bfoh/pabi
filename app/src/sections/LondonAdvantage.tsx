import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap';
import { scrollToSection } from '../lib/scroll';

const stats = [
  { value: 15, suffix: '+', label: 'Years moving Londoners' },
  { value: 2500, suffix: '+', label: 'Moves completed' },
  { value: 32, suffix: '', label: 'Boroughs covered' },
  { value: 100, suffix: '%', label: 'Compliance rate' },
];

function Counter({ target, suffix, run }: { target: number; suffix: string; run: boolean }) {
  const [count, setCount] = useState(0);
  const obj = useRef({ v: 0 });
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) { setCount(target); return; }
    const tween = gsap.to(obj.current, {
      v: target, duration: 1.8, ease: 'expo.out',
      onUpdate: () => setCount(Math.round(obj.current.v)),
    });
    return () => { tween.kill(); };
  }, [run, target]);
  return <span className="tnum">{count.toLocaleString()}{suffix}</span>;
}

export default function LondonAdvantage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set('.la-reveal', { opacity: 1, y: 0 });
        setRun(true);
        return;
      }
      gsap.from('.la-head > *', {
        opacity: 0, y: 28, duration: 0.9, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.from('.la-stat', {
        opacity: 0, y: 36, duration: 0.9, ease: 'expo.out', stagger: 0.1,
        scrollTrigger: { trigger: '.la-grid', start: 'top 82%', onEnter: () => setRun(true) },
      });
      ScrollTrigger.refresh();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="areas" ref={sectionRef} className="relative bg-navy-800 py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.12]" data-speed="0.85"
           style={{ backgroundImage: 'url(/images/london-skyline.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/40 via-transparent to-navy-900/60" />

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <div className="lg:col-span-6 la-head">
            <div className="eyebrow text-gold-500 mb-5">
              <span className="h-px w-8 bg-gold-500" />
              The London advantage
            </div>
            <h2 className="font-display font-semibold text-white leading-[1.0] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}>
              This city is our home turf.
            </h2>
            <p className="text-white/75 text-base md:text-lg leading-relaxed mt-6 max-w-[48ch]">
              ULEZ, the Congestion Charge, parking suspensions, tight mews access — our drivers
              know every borough, shortcut and regulation. So the logistics never become your problem.
            </p>
            <button onClick={() => scrollToSection('#hero')} className="link-underline inline-flex items-center gap-2 text-gold-500 font-medium text-sm mt-8">
              Get a free quote <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="lg:col-span-6 la-grid grid grid-cols-2 gap-x-10 gap-y-12">
            {stats.map((s) => (
              <div key={s.label} className="la-stat la-reveal">
                <div className="font-display text-gold-500 font-medium leading-none tracking-[-0.02em]"
                     style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>
                  <Counter target={s.value} suffix={s.suffix} run={run} />
                </div>
                <div className="hairline bg-white mt-4 mb-3" />
                <p className="text-white/70 text-sm md:text-base">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
