import { useState, useEffect } from 'react';
import { Phone, Menu, X, ArrowUpRight } from 'lucide-react';
import { scrollToSection, scrollToTop } from '../lib/scroll';
import { useMagnetic } from '../hooks/use-magnetic';
import Logo from '../components/Logo';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Areas', href: '#areas' },
  { label: 'Process', href: '#how-it-works' },
  { label: 'Reviews', href: '#pricing' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const ctaRef = useMagnetic<HTMLButtonElement>(0.5);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setIsMobileOpen(false);
    scrollToSection(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? 'py-2.5 bg-navy-900/85 backdrop-blur-xl border-b border-white/10'
            : 'py-4 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="w-full max-w-[1320px] mx-auto px-5 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <button onClick={scrollToTop} className="shrink-0 cursor-pointer flex items-center group" aria-label="Pabi Removals — home">
            <Logo className="h-11 md:h-[52px] w-auto transition-transform duration-500 group-hover:scale-[1.03]" />
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-9">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="link-underline text-white/75 hover:text-white text-[0.82rem] font-medium tracking-wide uppercase transition-colors duration-300"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href="tel:07442805856"
              className="flex items-center gap-2 text-white/75 hover:text-white text-[0.82rem] font-medium transition-colors duration-300"
            >
              <Phone size={14} />
              07442 805856
            </a>
            <button
              ref={ctaRef}
              onClick={() => handleLinkClick('#hero')}
              className="group inline-flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-[0.82rem] pl-5 pr-4 py-2.5 rounded-full shadow-gold transition-colors duration-300"
            >
              Get a Quote
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Right Side */}
          <div className="flex lg:hidden items-center gap-1">
            <a href="tel:07442805856" className="text-white/80 hover:text-white transition-colors p-2.5" aria-label="Call 07442 805856">
              <Phone size={20} />
            </a>
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-white p-2.5" aria-label="Toggle menu">
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[99] bg-navy-900 transition-all duration-500 lg:hidden ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col justify-center h-full px-8 gap-1">
          {navLinks.map((link, i) => (
            <button
              key={link.href}
              onClick={() => handleLinkClick(link.href)}
              className="text-left text-white font-display text-4xl font-medium py-2 border-b border-white/10 transition-all duration-500"
              style={{
                transitionDelay: isMobileOpen ? `${i * 70 + 100}ms` : '0ms',
                opacity: isMobileOpen ? 1 : 0,
                transform: isMobileOpen ? 'translateY(0)' : 'translateY(24px)',
              }}
            >
              <span className="text-gold-500 text-sm font-sans align-top mr-3">0{i + 1}</span>
              {link.label}
            </button>
          ))}
          <a
            href="tel:07442805856"
            className="flex items-center gap-2 text-white/70 text-lg mt-8 transition-all duration-500"
            style={{ transitionDelay: isMobileOpen ? '420ms' : '0ms', opacity: isMobileOpen ? 1 : 0 }}
          >
            <Phone size={20} /> 07442 805856
          </a>
          <button
            onClick={() => handleLinkClick('#hero')}
            className="bg-gold-500 text-navy-900 font-semibold px-8 py-4 rounded-full shadow-gold mt-5 self-start transition-all duration-500"
            style={{ transitionDelay: isMobileOpen ? '480ms' : '0ms', opacity: isMobileOpen ? 1 : 0 }}
          >
            Get a Free Quote
          </button>
        </div>
      </div>
    </>
  );
}
