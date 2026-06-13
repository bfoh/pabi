import { useEffect, useRef, useState } from 'react';
import { Star, ArrowUpRight } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap';
import { scrollToSection } from '../lib/scroll';
import { useMagnetic } from '../hooks/use-magnetic';

const trustStats = [
  { value: 4.9, decimals: true, suffix: '', label: 'Average rating', star: true },
  { value: 250, decimals: false, suffix: '+', label: '5-star reviews' },
  { value: 100, decimals: false, suffix: '%', label: 'Would recommend' },
];

function Counter({ target, decimals, suffix, run }: { target: number; decimals: boolean; suffix: string; run: boolean }) {
  const [count, setCount] = useState(0);
  const obj = useRef({ v: 0 });
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) { setCount(target); return; }
    const t = gsap.to(obj.current, {
      v: target, duration: 1.8, ease: 'expo.out',
      onUpdate: () => setCount(decimals ? Number(obj.current.v.toFixed(1)) : Math.round(obj.current.v)),
    });
    return () => { t.kill(); };
  }, [run, target]);
  return <span className="tnum">{count}{suffix}</span>;
}

export default function TrustBanner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  const ctaRef = useMagnetic<HTMLButtonElement>(0.5);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set('.tb-reveal', { opacity: 1, y: 0 });
        setRun(true);
        return;
      }
      gsap.from('.tb-reveal', {
        opacity: 0, y: 32, duration: 0.9, ease: 'expo.out', stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%', onEnter: () => setRun(true) },
      });
      ScrollTrigger.refresh();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className="relative bg-navy-900 py-24 md:py-36 overflow-hidden">
      {/* Subtle radial warmth */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 w-[80vw] h-[80vw] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(200,150,62,0.14) 0%, rgba(200,150,62,0) 60%)' }} />

      <div className="relative z-10 max-w-[1100px] mx-auto px-5 md:px-8 text-center">
        <div className="tb-reveal eyebrow text-gold-500 justify-center mb-7">
          <span className="h-px w-8 bg-gold-500" /> Ready when you are
        </div>
        <h2 className="tb-reveal font-display font-semibold text-white leading-[0.98] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(2.4rem, 6.5vw, 5.5rem)' }}>
          Let's make your next<br />move the easy one.
        </h2>
        <p className="tb-reveal text-white/70 text-lg md:text-xl leading-relaxed max-w-[58ch] mx-auto mt-7">
          From studio flats to family homes, thousands of Londoners have trusted Pabi.
          Get a fixed quote today — it only takes a minute.
        </p>

        <div className="tb-reveal flex flex-wrap items-center justify-center gap-4 mt-10">
          <button
            ref={ctaRef}
            onClick={() => scrollToSection('#hero')}
            className="group inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-base pl-8 pr-6 py-4.5 rounded-full shadow-gold transition-colors duration-300"
            style={{ paddingTop: '1.1rem', paddingBottom: '1.1rem' }}
          >
            Get your free quote
            <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <a href="tel:07442805856" className="inline-flex items-center gap-2 text-white font-medium text-base px-7 py-4 rounded-full border border-white/25 hover:bg-white/10 transition-colors duration-300">
            Or call 07442 805856
          </a>
        </div>

        <div className="tb-reveal flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0 mt-16">
          {trustStats.map((s, i) => (
            <div key={s.label} className={`flex flex-col items-center ${i < trustStats.length - 1 ? 'sm:border-r sm:border-white/15 sm:pr-12 sm:mr-12' : ''}`}>
              <div className="flex items-center gap-1.5 font-display text-gold-500 font-medium leading-none" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                {s.star && <Star size={26} className="fill-gold-500 text-gold-500" />}
                <Counter target={s.value} decimals={s.decimals} suffix={s.suffix} run={run} />
              </div>
              <p className="text-white/65 text-sm mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
