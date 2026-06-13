import { useEffect, useRef } from 'react';
import { Clock, ShieldCheck, Wallet, Truck } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap';

const values = [
  { icon: Clock, title: 'Ready on short notice', description: 'Last-minute availability across every London borough. Flexible crews mobilise fast — even same day.' },
  { icon: ShieldCheck, title: 'Insured, door to door', description: 'Goods in Transit and Public Liability cover as standard. Complete peace of mind from packing to placement.' },
  { icon: Wallet, title: 'Honest, fixed pricing', description: 'The clock starts when we arrive. No hidden fuel, VAT surprises, or creeping hourly charges.' },
  { icon: Truck, title: 'Properly equipped', description: 'Every van carries blankets, trolleys, strapping and GPS tracking. The right kit for a careful move.' },
];

export default function ValuePropositions() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set('.vp-reveal', { opacity: 1, y: 0 });
        return;
      }
      gsap.from('.vp-head > *', {
        opacity: 0, y: 28, duration: 0.9, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.utils.toArray<HTMLElement>('.vp-row').forEach((row) => {
        gsap.from(row, {
          opacity: 0, y: 40, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: row, start: 'top 86%' },
        });
        const line = row.querySelector('.vp-line');
        if (line) {
          gsap.from(line, {
            scaleX: 0, transformOrigin: 'left', duration: 1.1, ease: 'expo.out',
            scrollTrigger: { trigger: row, start: 'top 86%' },
          });
        }
      });
      ScrollTrigger.refresh();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-cream-50 py-24 md:py-36">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Sticky editorial heading */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28 vp-head">
            <div className="eyebrow text-gold-600 mb-5">
              <span className="h-px w-8 bg-gold-600" />
              Why Pabi
            </div>
            <h2 className="font-display font-semibold text-navy-900 leading-[1.0] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)' }}>
              The difference is in the detail.
            </h2>
            <p className="text-charcoal-500 text-base md:text-lg leading-relaxed mt-6 max-w-[42ch]">
              Moving is stressful enough. We've spent fifteen years removing every
              avoidable worry — so the day itself feels calm, considered, and quietly impressive.
            </p>
          </div>
        </div>

        {/* Advantage rows */}
        <div className="lg:col-span-7">
          {values.map((item, i) => (
            <div key={item.title} className="vp-row vp-reveal py-9 first:pt-0">
              <div className="vp-line h-px w-full bg-navy-900/12 mb-9 first:hidden" />
              <div className="flex items-start gap-6 md:gap-8">
                <span className="font-display text-gold-500 leading-none shrink-0 tnum"
                      style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                  0{i + 1}
                </span>
                <div className="pt-1">
                  <div className="flex items-center gap-3 mb-2.5">
                    <item.icon size={22} className="text-navy-900" strokeWidth={1.6} />
                    <h3 className="font-display text-navy-900 text-2xl md:text-[1.7rem] font-medium">{item.title}</h3>
                  </div>
                  <p className="text-charcoal-500 text-base leading-relaxed max-w-[52ch]">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
