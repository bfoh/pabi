import { Phone, Mail, Clock, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { scrollToSection, scrollToTop } from '../lib/scroll';

const serviceLinks = [
  { label: 'House Removals', href: '#services' },
  { label: 'Man & Van', href: '#services' },
  { label: 'Office Removals', href: '#services' },
  { label: 'Packing & Assembly', href: '#services' },
];

const companyLinks = [
  { label: 'The Pabi Advantage', href: '#areas' },
  { label: 'Our Process', href: '#how-it-works' },
  { label: 'Coverage Areas', href: '#areas' },
  { label: 'Reviews', href: '#pricing' },
];

const socialLinks = [
  { icon: Facebook, label: 'Facebook', url: 'https://facebook.com' },
  { icon: Instagram, label: 'Instagram', url: 'https://instagram.com' },
  { icon: Twitter, label: 'Twitter', url: 'https://twitter.com' },
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-white/10 pt-20 md:pt-28 pb-9">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        {/* Top: brand statement */}
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5">
            <button onClick={scrollToTop} className="inline-block mb-6 cursor-pointer">
              <img src="/images/logo.png" alt="Pabi Removals Ltd" className="h-14 w-auto brightness-0 invert" />
            </button>
            <p className="font-display text-white text-2xl md:text-3xl leading-snug max-w-[20ch]">
              Premium removals across all 32 London boroughs.
            </p>
            <div className="flex items-center gap-3 mt-7">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                   className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-navy-900 hover:bg-gold-500 hover:border-gold-500 transition-all duration-300">
                  <s.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="eyebrow text-white/40 mb-5">Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((l) => (
                <li key={l.label}><button onClick={() => scrollToSection(l.href)} className="link-underline text-white/70 hover:text-white text-sm transition-colors">{l.label}</button></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="eyebrow text-white/40 mb-5">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((l) => (
                <li key={l.label}><button onClick={() => scrollToSection(l.href)} className="link-underline text-white/70 hover:text-white text-sm transition-colors">{l.label}</button></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="eyebrow text-white/40 mb-5">Get in touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/70 text-sm"><MapPin size={16} className="shrink-0 mt-0.5 text-gold-500" /><span>353 Hertford Road<br />London N9 7BN</span></li>
              <li><a href="tel:07442805856" className="flex items-center gap-3 text-white/70 hover:text-white text-sm transition-colors"><Phone size={16} className="shrink-0 text-gold-500" />07442 805856</a></li>
              <li><a href="mailto:ernestisaiahacheampong@gmail.com" className="flex items-start gap-3 text-white/70 hover:text-white text-sm transition-colors break-all"><Mail size={16} className="shrink-0 mt-0.5 text-gold-500" />ernestisaiahacheampong@gmail.com</a></li>
              <li className="flex items-start gap-3 text-white/70 text-sm"><Clock size={16} className="shrink-0 mt-0.5 text-gold-500" /><div><p>Mon–Sat: 7am–8pm</p><p>Sun: 8am–6pm</p></div></li>
            </ul>
          </div>
        </div>

        {/* Accreditations */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-8 border-b border-white/10">
          {['CHECKATRADE', 'BAR', 'TRUSTPILOT', 'GOODS IN TRANSIT INSURED'].map((b) => (
            <span key={b} className="eyebrow text-white/35">{b}</span>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-7">
          <p className="text-white/40 text-xs">© 2025 Pabi Removals Ltd. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <button onClick={scrollToTop} className="text-white/40 hover:text-white/70 text-xs transition-colors">Privacy Policy</button>
            <button onClick={scrollToTop} className="text-white/40 hover:text-white/70 text-xs transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
