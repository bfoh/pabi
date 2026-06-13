import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';
import { scrollToSection } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

const trustStats = [
  { icon: Star, value: 4.9, suffix: '', label: 'Average Rating', isStar: true },
  { value: 250, suffix: '+', label: '5-Star Reviews' },
  { value: 100, suffix: '%', label: 'Would Recommend' },
];

function AnimatedNumber({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const countRef = useRef({ val: 0 });

  useEffect(() => {
    if (!inView) return;
    gsap.to(countRef.current, {
      val: target,
      duration: 1.5,
      ease: 'expo.out',
      onUpdate: () => setCount(Number(countRef.current.val.toFixed(1))),
    });
  }, [inView, target]);

  return <span>{count}{suffix}</span>;
}

export default function TrustBanner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.tb-heading', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'expo.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          onEnter: () => setInView(true),
        },
      });
      gsap.fromTo('.tb-subheading', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }, delay: 0.15,
      });
      gsap.fromTo('.tb-stat', { opacity: 0, y: 25 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: '.tb-stats', start: 'top 90%' },
      });
      gsap.fromTo('.tb-cta', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: '.tb-cta', start: 'top 95%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className="relative py-14 md:py-20 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center rounded-3xl bg-navy-800/75 backdrop-blur-md border border-white/10 p-6 sm:p-8 md:p-12">
        <h2 className="tb-heading opacity-0 text-white font-bold tracking-[-0.02em] text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem] mb-4 md:mb-5" style={{ lineHeight: 1.05 }}>
          Join 2,500+ Happy Londoners
        </h2>
        <p className="tb-subheading opacity-0 text-white/80 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-[640px] mx-auto mb-8 md:mb-10">
          From studio flats to large family homes, we've helped thousands of Londoners move with confidence. Experience the Pabi difference.
        </p>

        <div className="tb-stats flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0 mb-8 md:mb-10">
          {trustStats.map((stat, index) => (
            <div
              key={stat.label}
              className={`tb-stat opacity-0 flex flex-col items-center ${
                index < trustStats.length - 1 ? 'sm:border-r sm:border-white/15 sm:pr-10 sm:mr-10 md:pr-12 md:mr-12' : ''
              }`}
            >
              <div className="text-gold-500 font-bold tracking-[-0.03em] text-2xl sm:text-3xl md:text-4xl mb-1 flex items-center gap-1">
                {stat.isStar && <Star size={24} className="fill-gold-500 text-gold-500" />}
                <AnimatedNumber target={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <p className="text-white/80 text-xs md:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollToSection('#hero')}
          className="tb-cta opacity-0 bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-navy-900 font-semibold text-sm md:text-base px-7 md:px-9 py-3 md:py-3.5 rounded-full shadow-gold active:scale-95 transition-all duration-200"
        >
          Get Your Free Quote Today
        </button>
      </div>
    </section>
  );
}
