import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, ShieldCheck, Wallet, Truck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: Clock,
    title: 'On Short Notice',
    description: 'Last-minute booking availability across all London boroughs. Our flexible team is ready to help, even with minimal notice.',
  },
  {
    icon: ShieldCheck,
    title: '100% Insurance',
    description: 'Complete peace of mind with Goods in Transit & Public Liability protection. Fully covered from door to door.',
  },
  {
    icon: Wallet,
    title: 'Honest Pricing',
    description: 'Charges start when the van arrives at your address. No hidden petrol, VAT, or surprise fees.',
  },
  {
    icon: Truck,
    title: 'Fully Equipped',
    description: 'Every vehicle has protective blankets, heavy-duty trolleys, strapping systems, and GPS tracking.',
  },
];

export default function ValuePropositions() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.vp-overline', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
      });
      gsap.fromTo('.vp-heading', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }, delay: 0.12,
      });
      gsap.fromTo('.vp-card', { opacity: 0, y: 30, scale: 0.97 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'expo.out',
        scrollTrigger: { trigger: '.vp-grid', start: 'top 85%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-cream-50 py-16 md:py-24 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-14">
          <p className="vp-overline opacity-0 text-gold-500 text-xs font-medium uppercase tracking-[0.08em] mb-3">
            WHY CHOOSE PABI REMOVALS
          </p>
          <h2 className="vp-heading opacity-0 text-charcoal-900 font-bold tracking-[-0.02em] text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem]" style={{ lineHeight: 1.05 }}>
            The Pabi Advantage
          </h2>
        </div>

        <div className="vp-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {values.map((item) => (
            <div
              key={item.title}
              className="vp-card opacity-0 bg-white border border-[#0A1628]/[0.06] rounded-xl p-5 md:p-6 lg:p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-gold-500/20 transition-all duration-300 group"
            >
              <div className="mb-4 transition-transform duration-300 group-hover:scale-105">
                <item.icon size={36} className="text-gold-500 md:w-10 md:h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-charcoal-900 font-semibold text-base md:text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-charcoal-500 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
