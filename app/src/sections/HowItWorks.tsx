import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { number: '01', title: 'Quick Request', description: "Fill out our 60-second online quote form. Tell us what you're moving, where from, and where to." },
  { number: '02', title: 'Fixed Written Quote', description: 'Receive a completely transparent, competitive price breakdown with no hidden fees or surprises.' },
  { number: '03', title: 'Secure Confirmation', description: "Lock in your preferred time slot. We're available 7 days a week, including evenings and weekends." },
  { number: '04', title: 'The Smooth Move', description: "Our punctual, uniformed team handles the rest while you sit back and relax. We will even help you unpack." },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hiw-overline', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
      });
      gsap.fromTo('.hiw-heading', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }, delay: 0.1,
      });
      if (lineRef.current) {
        gsap.fromTo(lineRef.current, { scaleX: 0 }, {
          scaleX: 1, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: '.hiw-steps', start: 'top 85%' },
        });
      }
      gsap.fromTo('.hiw-step', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '.hiw-steps', start: 'top 85%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-cream-50 py-16 md:py-24 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-16">
          <p className="hiw-overline opacity-0 text-gold-500 text-xs font-medium uppercase tracking-[0.08em] mb-3">
            HOW IT WORKS
          </p>
          <h2 className="hiw-heading opacity-0 text-charcoal-900 font-bold tracking-[-0.02em] text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem]" style={{ lineHeight: 1.05 }}>
            Your Move, Simplified
          </h2>
        </div>

        {/* Desktop: Horizontal with connecting line */}
        <div className="hiw-steps relative hidden md:block">
          <div ref={lineRef} className="absolute top-[22px] left-[12%] right-[12%] h-[2px] bg-gold-500/30 origin-left" />
          <div className="grid grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step) => (
              <div key={step.number} className="hiw-step opacity-0 text-center">
                <span className="inline-block text-gold-500 font-bold tracking-[-0.03em] text-2xl lg:text-3xl xl:text-4xl mb-3">
                  {step.number}
                </span>
                <h3 className="text-charcoal-900 font-semibold text-sm lg:text-base mb-2">{step.title}</h3>
                <p className="text-charcoal-500 text-xs lg:text-sm leading-relaxed max-w-[260px] mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="md:hidden relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-gold-500/30" />
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="hiw-step opacity-0 relative">
                {/* Dot */}
                <div className="absolute -left-8 top-1 w-2 h-2 rounded-full bg-gold-500" />
                <span className="text-gold-500 font-bold text-xl mb-1 block">{step.number}</span>
                <h3 className="text-charcoal-900 font-semibold text-base mb-1">{step.title}</h3>
                <p className="text-charcoal-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
