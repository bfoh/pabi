import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Star } from 'lucide-react';
import { gsap, SplitText, prefersReducedMotion } from '../lib/gsap';
import { scrollToSection } from '../lib/scroll';
import { useMagnetic } from '../hooks/use-magnetic';

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const calcRef = useRef<HTMLDivElement>(null);
  const [calcStep, setCalcStep] = useState(0);
  const [moveType, setMoveType] = useState('');
  const [fromPostcode, setFromPostcode] = useState('');
  const [toPostcode, setToPostcode] = useState('');
  const [showToast, setShowToast] = useState(false);
  const ctaRef = useMagnetic<HTMLButtonElement>(0.45);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.play().catch(() => {});

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set('.hero-anim', { opacity: 1, y: 0 });
        return;
      }

      const split = new SplitText('.hero-title', { type: 'lines,words', linesClass: 'overflow-hidden pb-[0.1em]' });
      const tl = gsap.timeline({ delay: 0.25 });
      tl.from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.6, ease: 'expo.out' })
        .from(split.words, { yPercent: 118, duration: 1.05, ease: 'expo.out', stagger: 0.06 }, '-=0.2')
        .from('.hero-sub', { opacity: 0, y: 18, duration: 0.7, ease: 'expo.out' }, '-=0.6')
        .from('.hero-cta', { opacity: 0, y: 16, duration: 0.6, ease: 'expo.out' }, '-=0.45')
        .from('.hero-trust', { opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.35')
        .from(calcRef.current, { opacity: 0, y: 30, duration: 0.9, ease: 'expo.out' }, '-=0.9')
        .from('.hero-cue', { opacity: 0, duration: 0.6 }, '-=0.2');
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleNextStep = () => {
    if (calcStep < 2) setCalcStep(calcStep + 1);
    else { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }
  };
  const handlePrevStep = () => { if (calcStep > 0) setCalcStep(calcStep - 1); };

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-[100dvh] bg-navy-900 overflow-hidden">
      {/* Cinematic video, parallaxed by ScrollSmoother */}
      <div className="absolute inset-0" data-speed="auto">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover scale-105"
          src="/videos/hero-video.mp4"
          autoPlay muted loop playsInline preload="auto"
          poster="/images/service-house-removals-hero.jpg"
        />
      </div>
      {/* Colour grade + readability scrims */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/55 to-navy-900/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/85 via-navy-900/25 to-transparent" />
      <div className="absolute inset-0 mix-blend-soft-light bg-gold-500/10" />

      <div className="relative z-10 min-h-[100dvh] max-w-[1320px] mx-auto px-5 md:px-8 flex flex-col justify-end pb-14 md:pb-20 pt-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-end">
          {/* Headline block */}
          <div className="lg:col-span-7">
            <div className="hero-eyebrow eyebrow text-gold-500 mb-5">
              <span className="h-px w-8 bg-gold-500" />
              Premium London Removals
            </div>
            <h1 className="hero-title font-display font-semibold text-white leading-[0.95] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(2.6rem, 7vw, 6rem)' }}>
              Moving London<br />forward, with care.
            </h1>
            <p className="hero-sub hero-anim max-w-[44ch] text-white/75 text-base md:text-lg leading-relaxed mt-7">
              Fully insured home and office relocations across all 32 boroughs.
              Fixed, transparent pricing — and a team that treats your things like their own.
            </p>
            <div className="hero-cta hero-anim flex flex-wrap items-center gap-3.5 mt-9">
              <button
                ref={ctaRef}
                onClick={() => scrollToSection('#pricing')}
                className="group inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-sm pl-7 pr-5 py-4 rounded-full shadow-gold transition-colors duration-300"
              >
                Get your free quote
                <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <a href="tel:07442805856" className="inline-flex items-center gap-2 text-white font-medium text-sm px-6 py-4 rounded-full border border-white/25 hover:bg-white/10 transition-colors duration-300">
                Call 07442 805856
              </a>
            </div>
            <div className="hero-trust hero-anim flex items-center gap-2.5 mt-8 text-white/65 text-sm">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={15} className="text-gold-500 fill-gold-500" />)}
              </div>
              <span className="tnum">4.9/5 · 250+ verified reviews</span>
            </div>
          </div>

          {/* Quote calculator — glass, refined */}
          <div className="lg:col-span-5 lg:pl-6">
            <div ref={calcRef} className="w-full max-w-[420px] ml-auto">
              <div className="bg-white/[0.07] backdrop-blur-2xl border border-white/15 rounded-[1.4rem] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between mb-5">
                  <span className="eyebrow text-white/50">Instant estimate</span>
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === calcStep ? 'w-6 bg-gold-500' : 'w-2 bg-white/20'}`} />
                    ))}
                  </div>
                </div>

                {calcStep === 0 && (
                  <div>
                    <label className="block text-white/85 font-display text-xl mb-4">What are you moving?</label>
                    <div className="space-y-2">
                      {['House', 'Office', 'Man & Van'].map((opt) => (
                        <button key={opt} onClick={() => setMoveType(opt)}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 active:scale-[0.99] ${moveType === opt ? 'border-gold-500 bg-gold-500/10 text-white' : 'border-white/12 bg-white/5 text-white/80 hover:bg-white/10'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                    <button onClick={handleNextStep} disabled={!moveType}
                      className="w-full mt-5 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-navy-900 font-semibold py-3.5 rounded-full shadow-gold text-sm transition-all">
                      Continue
                    </button>
                  </div>
                )}

                {calcStep === 1 && (
                  <div>
                    <label className="block text-white/85 font-display text-xl mb-4">Where to, where from?</label>
                    <div className="space-y-3">
                      <div>
                        <span className="text-white/55 text-xs mb-1.5 block uppercase tracking-wider">Moving from</span>
                        <input type="text" placeholder="e.g. SW1A 1AA" value={fromPostcode} onChange={(e) => setFromPostcode(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/12 text-white placeholder-white/30 focus:border-gold-500 focus:outline-none text-sm" />
                      </div>
                      <div>
                        <span className="text-white/55 text-xs mb-1.5 block uppercase tracking-wider">Moving to</span>
                        <input type="text" placeholder="e.g. E1 6AN" value={toPostcode} onChange={(e) => setToPostcode(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/12 text-white placeholder-white/30 focus:border-gold-500 focus:outline-none text-sm" />
                      </div>
                    </div>
                    <div className="flex gap-2.5 mt-5">
                      <button onClick={handlePrevStep} className="flex-1 py-3.5 rounded-full border border-white/20 text-white/80 text-sm hover:bg-white/5 transition-all flex items-center justify-center gap-1.5"><ArrowLeft size={14} />Back</button>
                      <button onClick={handleNextStep} disabled={!fromPostcode || !toPostcode} className="flex-1 bg-gold-500 disabled:opacity-40 text-navy-900 font-semibold py-3.5 rounded-full text-sm transition-all">Continue</button>
                    </div>
                  </div>
                )}

                {calcStep === 2 && (
                  <div className="text-center py-1">
                    <div className="w-14 h-14 bg-gold-500/15 border border-gold-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-white font-display text-xl">You're all set.</h3>
                    <p className="text-white/60 text-sm mt-1.5">{moveType} move · {fromPostcode} → {toPostcode}</p>
                    <div className="flex gap-2.5 mt-5">
                      <button onClick={handlePrevStep} className="flex-1 py-3.5 rounded-full border border-white/20 text-white/80 text-sm hover:bg-white/5">Back</button>
                      <button onClick={handleNextStep} className="flex-1 bg-gold-500 text-navy-900 font-semibold py-3.5 rounded-full text-sm">Get my quote</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="hero-cue hidden md:flex items-center gap-3 mt-12 text-white/45">
          <span className="text-[0.7rem] uppercase tracking-[0.2em]">Scroll to explore</span>
          <span className="relative h-9 w-px bg-white/20 overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-3 bg-gold-500 animate-[scrollcue_1.8s_ease-in-out_infinite]" />
          </span>
        </div>
      </div>

      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[120] bg-white text-navy-900 px-5 py-3 rounded-xl shadow-xl border border-gold-500/20 text-sm">
          <p className="font-medium">Coming soon online! Call <a href="tel:07442805856" className="text-gold-600 underline">07442 805856</a></p>
        </div>
      )}

      <style>{`@keyframes scrollcue{0%{transform:translateY(-12px)}50%{transform:translateY(24px)}100%{transform:translateY(-12px)}}`}</style>
    </section>
  );
}
