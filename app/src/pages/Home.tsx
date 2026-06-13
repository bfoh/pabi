import Navigation from '../sections/Navigation';
import Hero from '../sections/Hero';
import ProofStrip from '../sections/ProofStrip';
import ValuePropositions from '../sections/ValuePropositions';
import Services from '../sections/Services';
import LondonAdvantage from '../sections/LondonAdvantage';
import HowItWorks from '../sections/HowItWorks';
import TrustBanner from '../sections/TrustBanner';
import Footer from '../sections/Footer';
import { useSmoothScroll } from '../hooks/use-smooth-scroll';

export default function Home() {
  useSmoothScroll();

  return (
    <>
      {/* Nav lives outside the smoothed content so it stays truly fixed */}
      <Navigation />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero />
            <ProofStrip />
            <ValuePropositions />
            <Services />
            <LondonAdvantage />
            <HowItWorks />
            <TrustBanner />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
