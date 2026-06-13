import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap';

const steps = [
  { number: '01', title: 'Quick request', description: "Tell us what you're moving, from where to where. Our 60-second form is all it takes to start." },
  { number: '02', title: 'Fixed written quote', description: 'A transparent, competitive price breakdown — no hidden fees, no surprises on the day.' },
  { number: '03', title: 'Secure your slot', description: "Lock in a time that suits you. We're available seven days a week, including evenings." },
  { number: '04', title: 'The smooth move', description: 'Our punctual, uniformed crew handles everything — and we even help you unpack.' },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hiw-head > *', {
        opacity: 0, y: 28, duration: 0.9, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      });

      if (prefersReducedMotion()) {
        gsap.set('.hiw-step', { opacity: 1, y: 0 });
        gsap.set('.hiw-progress', { scaleX: 1 });
        return;
      }

      const mm = gsap.matchMedia();

      // Desktop: pin + scrub the timeline.
      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top 18%',
            end: '+=1600',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
        tl.to('.hiw-progress', { scaleX: 1, ease: 'none', duration: steps.length });
        gsap.utils.toArray<HTMLElement>('.hiw-step').forEach((step, i) => {
          tl.fromTo(step, { opacity: 0.25, y: 24 }, { opacity: 1, y: 0, ease: 'expo.out', duration: 0.8 }, i);
          tl.fromTo(step.querySelector('.hiw-dot'), { scale: 0.5, backgroundColor: '#0A1628' }, { scale: 1, backgroundColor: '#C8963E', duration: 0.5 }, i);
        });
      });

      // Mobile/tablet: simple staggered reveal.
      mm.add('(max-width: 1023px)', () => {
        gsap.from('.hiw-step', {
          opacity: 0, y: 32, duration: 0.8, ease: 'expo.out', stagger: 0.15,
          scrollTrigger: { trigger: trackRef.current, start: 'top 82%' },
        });
        gsap.from('.hiw-progress', {
          scaleY: 0, transformOrigin: 'top', ease: 'none',
          scrollTrigger: { trigger: trackRef.current, start: 'top 80%', end: 'bottom 70%', scrub: 1 },
        });
      });

      ScrollTrigger.refresh();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-cream-50 py-24 md:py-36">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="hiw-head max-w-[60ch] mb-14 md:mb-24">
          <div className="eyebrow text-gold-600 mb-5">
            <span className="h-px w-8 bg-gold-600" />
            How it works
          </div>
          <h2 className="font-display font-semibold text-navy-900 leading-[1.0] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}>
            Four steps. Zero stress.
          </h2>
        </div>

        <div ref={pinRef}>
          {/* Desktop horizontal track */}
          <div ref={trackRef} className="relative">
            {/* Progress rail */}
            <div className="hidden lg:block absolute top-[14px] left-0 right-0 h-px bg-navy-900/12" />
            <div className="hiw-progress hidden lg:block absolute top-[14px] left-0 right-0 h-[2px] bg-gold-500 origin-left scale-x-0" />
            {/* Mobile vertical rail */}
            <div className="lg:hidden absolute top-2 bottom-2 left-[6px] w-px bg-navy-900/12" />
            <div className="hiw-progress lg:hidden absolute top-2 bottom-2 left-[6px] w-[2px] bg-gold-500 origin-top scale-y-0" />

            <div className="grid lg:grid-cols-4 gap-y-10 lg:gap-x-10">
              {steps.map((step) => (
                <div key={step.number} className="hiw-step relative pl-8 lg:pl-0">
                  <div className="hiw-dot absolute left-0 top-1.5 lg:top-[7px] lg:left-0 w-3.5 h-3.5 rounded-full bg-navy-900" />
                  <div className="lg:pt-10">
                    <span className="font-display text-navy-900/25 text-5xl lg:text-6xl font-medium tnum">{step.number}</span>
                    <h3 className="font-display text-navy-900 text-2xl font-medium mt-3 mb-2">{step.title}</h3>
                    <p className="text-charcoal-500 text-base leading-relaxed max-w-[34ch]">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
