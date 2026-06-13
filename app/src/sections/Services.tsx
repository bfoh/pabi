import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap';
import { Home, Truck, Building2, Package, Check, ArrowUpRight, ChevronDown } from 'lucide-react';
import { scrollToSection } from '../lib/scroll';

const services = [
  {
    id: 'house', icon: Home, title: 'House Removals', shortDesc: 'Full-scale residential relocation',
    image: '/images/service-house-removals.jpg',
    description: 'A dedicated, highly trained crew handles your entire home — specialised cushioning for fragile valuables, careful loading, and secure transit from door to door.',
    features: ['Dedicated moving team', 'Fragile item protection', 'Furniture disassembly & reassembly', 'Full insurance coverage'],
  },
  {
    id: 'man-van', icon: Truck, title: 'Man & Van', shortDesc: 'Cost-effective small moves',
    image: '/images/service-man-van.jpg',
    description: 'The agile, cost-effective option for small flats, student moves, furniture collections or single-item deliveries. Quick to book, careful as ever.',
    features: ['Same-day availability', 'Pay-by-the-hour pricing', 'Ideal for 1–2 bed moves', 'Student discounts'],
  },
  {
    id: 'office', icon: Building2, title: 'Office Removals', shortDesc: 'Minimise business downtime',
    image: '/images/service-office-removals.jpg',
    description: 'Commercial relocation engineered around your downtime — safe packing of IT and electronics, disassembly and reassembly, plus eco-friendly clearance.',
    features: ['Weekend & evening moves', 'IT equipment handling', 'Minimal disruption', 'Eco-friendly disposal'],
  },
  {
    id: 'packing', icon: Package, title: 'Packing & Assembly', shortDesc: 'Stress-free, end to end',
    image: '/images/service-packing.jpg',
    description: 'Professional packing and unpacking with premium materials, alongside furniture disassembly and reinstallation — wrapped, labelled, and set up at the other end.',
    features: ['Premium materials', 'Full or partial packing', 'Furniture assembly', 'Unpacking & setup'],
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set('.svc-head > *', { opacity: 1, y: 0 });
        return;
      }
      gsap.from('.svc-head > *', {
        opacity: 0, y: 28, duration: 0.9, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      });
      ScrollTrigger.refresh();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    if (!prefersReducedMotion()) {
      if (imageRef.current) gsap.fromTo(imageRef.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.out' });
      if (contentRef.current) gsap.fromTo(contentRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    }
  };

  const active = services[activeTab];

  return (
    <section id="services" ref={sectionRef} className="bg-navy-900 py-16 md:py-36 overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="svc-head max-w-[60ch] mb-10 md:mb-20">
          <div className="eyebrow text-gold-500 mb-5">
            <span className="h-px w-8 bg-gold-500" />
            What we do
          </div>
          <h2 className="font-display font-semibold text-white leading-[1.0] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}>
            Four ways to move,<br />one standard of care.
          </h2>
        </div>

        {/* Desktop: editorial split */}
        <div className="hidden lg:grid grid-cols-12 gap-14 items-start">
          {/* List */}
          <div className="col-span-5">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => handleTabChange(index)}
                className="group w-full text-left py-6 border-t border-white/10 last:border-b transition-colors"
              >
                <div className="flex items-center gap-5">
                  <span className={`font-display text-2xl tnum transition-colors ${index === activeTab ? 'text-gold-500' : 'text-white/25'}`}>0{index + 1}</span>
                  <div className="flex-1">
                    <h3 className={`font-display text-2xl font-medium transition-colors ${index === activeTab ? 'text-white' : 'text-white/45 group-hover:text-white/70'}`}>
                      {service.title}
                    </h3>
                    <p className={`text-sm mt-0.5 transition-colors ${index === activeTab ? 'text-white/55' : 'text-white/25'}`}>{service.shortDesc}</p>
                  </div>
                  <ArrowUpRight size={20} className={`transition-all duration-300 ${index === activeTab ? 'text-gold-500 opacity-100' : 'text-white/30 opacity-0 group-hover:opacity-100'}`} />
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="col-span-7">
            <div className="relative rounded-[1.4rem] overflow-hidden">
              <div ref={imageRef}>
                <img src={active.image} alt={active.title} className="w-full aspect-[16/11] object-cover" data-speed="0.92" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/55 to-transparent pointer-events-none" />
              <span className="absolute top-5 left-5 eyebrow text-white/80 bg-navy-900/40 backdrop-blur px-3 py-1.5 rounded-full">Pabi · {active.title}</span>
            </div>
            <div ref={contentRef} className="mt-7">
              <p className="text-white/80 text-lg leading-relaxed max-w-[58ch]">{active.description}</p>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-3 mt-7">
                {active.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-white/70 text-sm">
                    <Check size={16} className="text-gold-500 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => scrollToSection('#hero')} className="link-underline inline-flex items-center gap-2 text-gold-500 font-medium text-sm mt-8">
                Get a quote for {active.title.toLowerCase()} <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile: accordion */}
        <div className="lg:hidden divide-y divide-white/10 border-y border-white/10">
          {services.map((service, index) => (
            <div key={service.id}>
              <button onClick={() => setOpenAccordion(openAccordion === index ? null : index)} className="w-full flex items-center gap-4 py-5 text-left">
                <span className={`font-display text-xl tnum ${openAccordion === index ? 'text-gold-500' : 'text-white/30'}`}>0{index + 1}</span>
                <span className={`font-display text-xl font-medium flex-1 ${openAccordion === index ? 'text-white' : 'text-white/60'}`}>{service.title}</span>
                <ChevronDown size={20} className={`text-white/40 transition-transform duration-300 ${openAccordion === index ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-500 ${openAccordion === index ? 'max-h-[640px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pb-6">
                  <img src={service.image} alt={service.title} className="w-full aspect-[16/10] object-cover rounded-xl mb-4" loading="lazy" />
                  <p className="text-white/80 text-sm leading-relaxed mb-4">{service.description}</p>
                  <ul className="space-y-2.5 mb-5">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-white/70 text-sm"><Check size={15} className="text-gold-500 shrink-0" />{f}</li>
                    ))}
                  </ul>
                  <button onClick={() => scrollToSection('#hero')} className="link-underline inline-flex items-center gap-2 text-gold-500 font-medium text-sm">
                    Get a quote <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
