const items = [
  'Fully Insured',
  'Goods in Transit Cover',
  'All 32 London Boroughs',
  'Checkatrade Verified',
  'BAR Standards',
  '2,500+ Moves Completed',
  'Same-Day Availability',
  'Fixed Transparent Pricing',
];

export default function ProofStrip() {
  const row = [...items, ...items];
  return (
    <section aria-label="Trust signals" className="bg-navy-900 border-y border-white/10 py-5 overflow-hidden">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {row.map((item, i) => (
          <div key={i} className="flex items-center gap-5 px-6 shrink-0">
            <span className="font-display text-lg md:text-xl text-white/85 whitespace-nowrap">{item}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
          </div>
        ))}
      </div>
    </section>
  );
}
