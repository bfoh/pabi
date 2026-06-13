import { Phone, Mail, Clock, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { scrollToSection, scrollToTop } from '../lib/scroll';

const serviceLinks = [
  { label: 'House Removals', href: '#services' },
  { label: 'Man & Van', href: '#services' },
  { label: 'Office Removals', href: '#services' },
  { label: 'Packing & Assembly', href: '#services' },
  { label: 'Storage Solutions', href: '#services' },
];

const companyLinks = [
  { label: 'About Us', href: '#areas' },
  { label: 'Our Team', href: '#services' },
  { label: 'Coverage Areas', href: '#areas' },
  { label: 'Blog', action: 'top' as const },
  { label: 'Contact', href: '#hero' },
];

const socialLinks = [
  { icon: Facebook, label: 'Facebook', url: 'https://facebook.com' },
  { icon: Instagram, label: 'Instagram', url: 'https://instagram.com' },
  { icon: Twitter, label: 'Twitter', url: 'https://twitter.com' },
];

export default function Footer() {
  const handleCompanyClick = (link: (typeof companyLinks)[number]) => {
    if (link.action === 'top') scrollToTop();
    else if (link.href) scrollToSection(link.href);
  };

  return (
    <footer className="bg-navy-900 pt-12 md:pt-16 lg:pt-20 pb-8 border-t border-white/15">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 mb-10 md:mb-12">
          {/* Col 1: Logo + tagline + social */}
          <div>
            <button onClick={scrollToTop} className="inline-block mb-3 md:mb-4 cursor-pointer">
              <img src="/images/logo.png" alt="Pabi Removals Ltd" className="h-12 md:h-14 w-auto brightness-0 invert" />
            </button>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Premium removals across all 32 London boroughs. Fully insured, transparently priced, stress-free.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 active:bg-white/30 transition-all"
                >
                  <social.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 md:mb-4">Services</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/60 hover:text-gold-500 text-sm transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 md:mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleCompanyClick(link)}
                    className="text-white/60 hover:text-gold-500 text-sm transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 md:mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-white/60 text-sm">
                <MapPin size={15} className="shrink-0 mt-0.5" />
                <span>353 Hertford Road<br />N9 7BN</span>
              </li>
              <li>
                <a href="tel:07442805856" className="flex items-center gap-2.5 text-white/60 hover:text-white text-sm transition-colors">
                  <Phone size={15} className="shrink-0" />
                  07442 805856
                </a>
              </li>
              <li>
                <a href="mailto:ernestisaiahacheampong@gmail.com" className="flex items-center gap-2.5 text-white/60 hover:text-white text-sm transition-colors break-all">
                  <Mail size={15} className="shrink-0" />
                  ernestisaiahacheampong@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-white/60 text-sm">
                <Clock size={15} className="shrink-0 mt-0.5" />
                <div>
                  <p>Mon&ndash;Sat: 7am&ndash;8pm</p>
                  <p>Sun: 8am&ndash;6pm</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 md:gap-8 py-5 md:py-6 border-t border-white/15 mb-5 md:mb-6">
          <span className="text-white/40 text-[10px] md:text-xs font-medium tracking-wide">CHECKATRADE</span>
          <span className="text-white/40 text-[10px] md:text-xs font-medium tracking-wide">BAR</span>
          <span className="text-white/40 text-[10px] md:text-xs font-medium tracking-wide">TRUSTPILOT</span>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-white/15">
          <p className="text-white/40 text-xs">&copy; 2025 Pabi Removals Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={scrollToTop} className="text-white/40 hover:text-white/60 text-xs transition-colors cursor-pointer">Privacy Policy</button>
            <button onClick={scrollToTop} className="text-white/40 hover:text-white/60 text-xs transition-colors cursor-pointer">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
