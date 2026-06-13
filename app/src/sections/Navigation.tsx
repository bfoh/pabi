import { useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';
import { scrollToSection, scrollToTop } from '../lib/scroll';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Areas', href: '#areas' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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
        className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-[72px] flex items-center border-b border-white/15 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A1628]/95 backdrop-blur-[20px] saturate-[180%]'
            : 'bg-[#0A1628]/85 backdrop-blur-[20px] saturate-[180%]'
        }`}
      >
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <button onClick={scrollToTop} className="shrink-0 cursor-pointer">
            <img
              src="/images/logo.png"
              alt="Pabi Removals Ltd"
              className="h-9 md:h-11 w-auto brightness-0 invert"
            />
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="text-white/80 hover:text-white text-sm xl:text-[0.9375rem] font-medium transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            <a
              href="tel:07442805856"
              className="flex items-center gap-2 text-white/80 hover:text-white text-sm xl:text-[0.9375rem] font-medium transition-colors duration-200"
            >
              <Phone size={15} />
              07442 805856
            </a>
            <button
              onClick={() => handleLinkClick('#hero')}
              className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-sm px-5 py-2.5 rounded-full shadow-gold hover:-translate-y-0.5 transition-all duration-250"
            >
              Get a Quote
            </button>
          </div>

          {/* Mobile Right Side: Phone + Hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <a
              href="tel:07442805856"
              className="text-white/80 hover:text-white transition-colors p-2"
              aria-label="Call 07442 805856"
            >
              <Phone size={20} />
            </a>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-navy-900/98 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6 pt-16">
          {navLinks.map((link, i) => (
            <button
              key={link.href}
              onClick={() => handleLinkClick(link.href)}
              className="text-white text-2xl font-semibold transition-all duration-300"
              style={{
                transitionDelay: isMobileOpen ? `${i * 60}ms` : '0ms',
                opacity: isMobileOpen ? 1 : 0,
                transform: isMobileOpen ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {link.label}
            </button>
          ))}
          <a
            href="tel:07442805856"
            className="flex items-center gap-2 text-white/80 text-lg mt-4 transition-all duration-300"
            style={{
              transitionDelay: isMobileOpen ? '240ms' : '0ms',
              opacity: isMobileOpen ? 1 : 0,
              transform: isMobileOpen ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            <Phone size={20} />
            07442 805856
          </a>
          <button
            onClick={() => handleLinkClick('#hero')}
            className="bg-gold-500 text-navy-900 font-semibold px-8 py-3.5 rounded-full shadow-gold mt-4 transition-all duration-300"
            style={{
              transitionDelay: isMobileOpen ? '300ms' : '0ms',
              opacity: isMobileOpen ? 1 : 0,
              transform: isMobileOpen ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            Get a Quote
          </button>
        </div>
      </div>
    </>
  );
}
