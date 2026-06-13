import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { scrollToSection } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 15, suffix: '+', label: 'Years Experience' },
  { value: 2500, suffix: '+', label: 'Moves Completed' },
  { value: 32, suffix: '', label: 'London Boroughs Covered' },
  { value: 100, suffix: '%', label: 'Compliance Rate' },
];

function AnimatedCounter({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const countRef = useRef({ val: 0 });

  useEffect(() => {
    if (!inView) return;
    gsap.to(countRef.current, {
      val: target,
      duration: 1.5,
      ease: 'expo.out',
      onUpdate: () => setCount(Math.round(countRef.current.val)),
    });
  }, [inView, target]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function LondonAdvantage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.la-overline', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
      });
      gsap.fromTo('.la-heading', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }, delay: 0.1,
      });
      gsap.fromTo('.la-desc', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }, delay: 0.2,
      });
      gsap.fromTo('.la-stat', { opacity: 0, y: 25 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: {
          trigger: '.la-stats-grid',
          start: 'top 85%',
          onEnter: () => setInView(true),
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="areas" ref={sectionRef} className="relative bg-navy-900 py-16 md:py-24 lg:py-28 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{ backgroundImage: 'url(/images/london-skyline.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16">
          {/* Text block */}
          <div className="lg:w-1/2">
            <p className="la-overline opacity-0 text-gold-500 text-xs font-medium uppercase tracking-[0.08em] mb-3">
              THE LONDON ADVANTAGE
            </p>
            <h2 className="la-heading opacity-0 text-white font-bold tracking-[-0.02em] text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem] mb-4 md:mb-6" style={{ lineHeight: 1.05 }}>
              London Is Our Home
            </h2>
            <p className="la-desc opacity-0 text-white/80 text-sm md:text-base lg:text-lg leading-relaxed mb-5 md:mb-6">
              Navigating London can be complex. Our experienced drivers are fully compliant and highly skilled with London's complex layouts, ULEZ compliance, Congestion Charge zones, parking suspensions, and tight mews access. We know every borough, every shortcut, every regulation &mdash; so you don't have to worry.
            </p>
            <button
              onClick={() => scrollToSection('#hero')}
              className="la-desc opacity-0 inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 font-medium text-sm group transition-colors"
            >
              Get a Free Quote
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats grid */}
          <div className="la-stats-grid lg:w-1/2 grid grid-cols-2 gap-4 md:gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="la-stat opacity-0 border-t-2 border-gold-500 pt-4 md:pt-5">
                <div className="text-gold-500 font-bold tracking-[-0.03em] text-2xl sm:text-3xl md:text-4xl mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} inView={inView} />
                </div>
                <p className="text-white/80 text-xs md:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
