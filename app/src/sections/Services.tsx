import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home, Truck, Building2, Package, Check, ArrowRight, ChevronDown } from 'lucide-react';
import { scrollToSection } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 'house',
    icon: Home,
    title: 'House Removals',
    shortDesc: 'Full-scale residential relocation',
    image: '/images/service-house-removals.jpg',
    description: 'Full-scale residential relocation handled by a dedicated, highly trained moving team. Includes specialized cushioning for fragile valuables, professional loading, and secure transit.',
    features: ['Dedicated moving team', 'Fragile item protection', 'Furniture disassembly/reassembly', 'Full insurance coverage'],
  },
  {
    id: 'man-van',
    icon: Truck,
    title: 'Man & Van Service',
    shortDesc: 'Cost-effective small moves',
    image: '/images/service-man-van.jpg',
    description: 'The perfect, cost-effective solution for small apartment moves, student relocations, furniture collections, or single-item deliveries. Agile and highly efficient.',
    features: ['Same-day availability', 'Pay-by-the-hour pricing', 'Ideal for 1-2 bedroom moves', 'Student discounts available'],
  },
  {
    id: 'office',
    icon: Building2,
    title: 'Office Removals & Clearance',
    shortDesc: 'Minimize business downtime',
    image: '/images/service-office-removals.jpg',
    description: 'Commercial relocation engineered to minimize business downtime. Safe packing of office electronics, disassembly/reassembly of furniture, and eco-friendly waste clearance.',
    features: ['Weekend & evening moves', 'IT equipment handling', 'Minimal business disruption', 'Eco-friendly disposal'],
  },
  {
    id: 'packing',
    icon: Package,
    title: 'Complete Packing & Assembly',
    shortDesc: 'Stress-free packing service',
    image: '/images/service-packing.jpg',
    description: 'Stress-free packing and unpacking services using premium materials, alongside professional furniture disassembly and reinstallation at your destination.',
    features: ['Premium packing materials', 'Full or partial packing options', 'Furniture assembly service', 'Unpacking & setup'],
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.svc-overline', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
      });
      gsap.fromTo('.svc-heading', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }, delay: 0.1,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    }
  };

  const activeService = services[activeTab];

  return (
    <section id="services" ref={sectionRef} className="relative py-16 md:py-24 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 rounded-3xl bg-navy-900/70 backdrop-blur-md border border-white/10 p-6 sm:p-8 md:p-10">
        <p className="svc-overline opacity-0 text-gold-500 text-xs font-medium uppercase tracking-[0.08em] mb-3">
          OUR SERVICES
        </p>
        <h2 className="svc-heading opacity-0 text-white font-bold tracking-[-0.02em] text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem] mb-8 md:mb-12" style={{ lineHeight: 1.05 }}>
          Premium Moving Services
        </h2>

        {/* Desktop: Tab Navigation + Content Side by Side */}
        <div className="hidden lg:flex gap-10 xl:gap-16">
          {/* Tab Navigation */}
          <div className="w-[38%] flex flex-col gap-1">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => handleTabChange(index)}
                className={`flex items-start gap-4 text-left p-4 xl:p-5 rounded-xl transition-all duration-300 ${
                  index === activeTab
                    ? 'border-l-[3px] border-gold-500 bg-gold-500/[0.08]'
                    : 'border-l-[3px] border-transparent hover:bg-white/[0.04]'
                }`}
              >
                <service.icon size={22} className={`shrink-0 mt-0.5 ${index === activeTab ? 'text-gold-500' : 'text-white/40'}`} strokeWidth={1.5} />
                <div>
                  <h3 className={`font-semibold text-base transition-colors ${index === activeTab ? 'text-white' : 'text-white/50'}`}>
                    {service.title}
                  </h3>
                  <p className={`text-sm mt-0.5 transition-colors ${index === activeTab ? 'text-white/60' : 'text-white/30'}`}>
                    {service.shortDesc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div ref={contentRef} className="flex-1 min-w-0">
            <div className="relative overflow-hidden rounded-xl md:rounded-2xl mb-5">
              <img src={activeService.image} alt={activeService.title} className="w-full aspect-[16/10] object-cover" loading="lazy" />
            </div>
            <h3 className="text-white font-semibold text-lg md:text-xl mb-2">{activeService.title}</h3>
            <p className="text-white/80 text-sm md:text-base leading-relaxed mb-4">{activeService.description}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              {activeService.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-white/70 text-sm">
                  <Check size={15} className="text-gold-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => scrollToSection('#hero')}
              className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 font-medium text-sm group transition-colors"
            >
              Get a Quote
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Mobile & Tablet: Accordion */}
        <div className="lg:hidden space-y-3">
          {services.map((service, index) => (
            <div key={service.id} className="border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                className="w-full flex items-center gap-3 p-4 text-left transition-colors"
              >
                <service.icon size={20} className={`shrink-0 ${openAccordion === index ? 'text-gold-500' : 'text-white/40'}`} strokeWidth={1.5} />
                <span className={`font-semibold text-sm flex-1 ${openAccordion === index ? 'text-white' : 'text-white/70'}`}>
                  {service.title}
                </span>
                <ChevronDown size={18} className={`text-white/40 transition-transform duration-300 shrink-0 ${openAccordion === index ? 'rotate-180' : ''}`} />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  openAccordion === index ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 pb-4">
                  <img src={service.image} alt={service.title} className="w-full aspect-[16/10] object-cover rounded-lg mb-3" loading="lazy" />
                  <p className="text-white/80 text-sm leading-relaxed mb-3">{service.description}</p>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-white/70 text-sm">
                        <Check size={14} className="text-gold-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => scrollToSection('#hero')}
                    className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 font-medium text-sm group"
                  >
                    Get a Quote
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
