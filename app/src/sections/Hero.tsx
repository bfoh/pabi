import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ChevronDown, Star, ArrowLeft } from 'lucide-react';
import { scrollToSection } from '../lib/scroll';

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const [calcStep, setCalcStep] = useState(0);
  const [moveType, setMoveType] = useState('');
  const [fromPostcode, setFromPostcode] = useState('');
  const [toPostcode, setToPostcode] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo('.hero-line-1', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' })
        .fromTo('.hero-line-2', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, '-=0.5')
        .fromTo('.hero-subtitle', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, '-=0.4')
        .fromTo('.hero-cta-row', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, '-=0.3')
        .fromTo(calcRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, '-=0.4')
        .fromTo('.hero-trust', { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')
        .fromTo(scrollHintRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.1');

      // Sticky video fade removed; the global SceneBackdrop/VanJourney handle the scene.
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleNextStep = () => {
    if (calcStep < 2) { setCalcStep(calcStep + 1); }
    else { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }
  };
  const handlePrevStep = () => { if (calcStep > 0) setCalcStep(calcStep - 1); };

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-[100dvh]">
      <div className="relative min-h-[100dvh] w-full overflow-hidden">
        {/* Left-side scrim for headline readability over the moving scene */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/75 via-[#0A1628]/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A1628]/80 to-transparent" />

        {/* Content */}
        <div className="relative z-10 min-h-[100dvh] flex flex-col justify-end pt-24">
          <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 pb-6 sm:pb-10 md:pb-14">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-8 lg:gap-12">

              {/* Text block */}
              <div className="md:w-[55%] lg:w-[52%]">
                <h1 className="text-white font-bold leading-[1.15] tracking-[-0.02em]" style={{ fontSize: 'clamp(1.5rem, 4vw, 3.2rem)', textWrap: 'balance' }}>
                  <span className="hero-line-1 block opacity-0 drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
                    Moving London Forward.
                  </span>
                  <span className="hero-line-2 block opacity-0 mt-0.5 md:mt-1 drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
                    Seamless, Stress&#8209;Free Removals.
                  </span>
                </h1>

                <p className="hero-subtitle opacity-0 text-white/80 text-sm sm:text-base leading-relaxed mt-3 md:mt-4 max-w-[460px] drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
                  Fully insured, highly rated home and office relocations across London. Fixed transparent pricing with zero hidden fees.
                </p>

                <div className="hero-cta-row opacity-0 flex flex-wrap items-center gap-3 mt-4 md:mt-5">
                  <button onClick={() => scrollToSection('#pricing')} className="bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-navy-900 font-semibold text-sm px-6 py-3 rounded-full shadow-gold active:scale-95 transition-all">
                    Get Free Quote
                  </button>
                  <a href="tel:07442805856" className="md:hidden flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-medium text-sm px-5 py-3 rounded-full border border-white/20 active:scale-95 transition-all">
                    Call Now
                  </a>
                </div>

                <div className="hero-trust opacity-0 flex items-center gap-1.5 mt-4 md:mt-5 text-white/60 text-xs">
                  <Star size={13} className="text-gold-500 fill-gold-500 shrink-0" />
                  <span>5-star Trustpilot reviews | 250+ Happy Moves</span>
                </div>
              </div>

              {/* Quote Calculator */}
              <div ref={calcRef} className="w-full md:w-[45%] lg:w-[42%] md:max-w-[400px]">
                <div className="bg-white/[0.08] backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === calcStep ? 'bg-gold-500' : 'bg-white/20'}`} />
                    ))}
                  </div>

                  {calcStep === 0 && (
                    <div>
                      <label className="block text-white/50 text-[10px] font-medium uppercase tracking-wider mb-3">What are you moving?</label>
                      <div className="space-y-2">
                        {['House', 'Office', 'Man & Van'].map((opt) => (
                          <button key={opt} onClick={() => setMoveType(opt)} className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all active:scale-[0.98] ${moveType === opt ? 'border-gold-500 bg-gold-500/10 text-white' : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10'}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                      <button onClick={handleNextStep} disabled={!moveType} className="w-full mt-4 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-navy-900 font-semibold py-2.5 rounded-full shadow-gold text-sm transition-all">
                        Continue
                      </button>
                    </div>
                  )}

                  {calcStep === 1 && (
                    <div>
                      <label className="block text-white/50 text-[10px] font-medium uppercase tracking-wider mb-3">Moving Details</label>
                      <div className="space-y-3">
                        <div>
                          <span className="text-white/60 text-xs mb-1 block">Moving from</span>
                          <input type="text" placeholder="e.g. SW1A 1AA" value={fromPostcode} onChange={(e) => setFromPostcode(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/30 focus:border-gold-500 focus:outline-none text-sm" />
                        </div>
                        <div>
                          <span className="text-white/60 text-xs mb-1 block">Moving to</span>
                          <input type="text" placeholder="e.g. E1 6AN" value={toPostcode} onChange={(e) => setToPostcode(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/30 focus:border-gold-500 focus:outline-none text-sm" />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={handlePrevStep} className="flex-1 py-2.5 rounded-full border border-white/20 text-white/80 text-sm hover:bg-white/5 transition-all flex items-center justify-center gap-1"><ArrowLeft size={14} />Back</button>
                        <button onClick={handleNextStep} disabled={!fromPostcode || !toPostcode} className="flex-1 bg-gold-500 disabled:opacity-40 text-navy-900 font-semibold py-2.5 rounded-full text-sm transition-all">Continue</button>
                      </div>
                    </div>
                  )}

                  {calcStep === 2 && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-5 h-5 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h3 className="text-white font-semibold text-base">Almost there!</h3>
                      <p className="text-white/60 text-xs mt-1">{moveType} move from {fromPostcode} to {toPostcode}</p>
                      <div className="flex gap-2 mt-4">
                        <button onClick={handlePrevStep} className="flex-1 py-2.5 rounded-full border border-white/20 text-white/80 text-sm hover:bg-white/5">Back</button>
                        <button onClick={handleNextStep} className="flex-1 bg-gold-500 text-navy-900 font-semibold py-2.5 rounded-full text-sm">Get Quote</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div ref={scrollHintRef} className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-0.5 opacity-0">
            <span className="text-[10px] hidden sm:inline">Scroll</span>
            <ChevronDown size={16} className="animate-bounce-slow" />
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white text-navy-900 px-5 py-3 rounded-xl shadow-xl border border-gold-500/20 text-sm animate-in fade-in slide-in-from-top-4">
          <p className="font-medium">Coming soon! Call <a href="tel:07442805856" className="text-gold-600 underline">07442 805856</a></p>
        </div>
      )}
    </section>
  );
}
