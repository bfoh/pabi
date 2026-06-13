// app/src/pages/Home.tsx
import Navigation from '../sections/Navigation';
import SceneBackdrop from '../sections/SceneBackdrop';
import VanJourney from '../components/VanJourney';
import Hero from '../sections/Hero';
import ValuePropositions from '../sections/ValuePropositions';
import Services from '../sections/Services';
import LondonAdvantage from '../sections/LondonAdvantage';
import HowItWorks from '../sections/HowItWorks';
import TrustBanner from '../sections/TrustBanner';
import Footer from '../sections/Footer';

export default function Home() {
  return (
    <div className="relative">
      <SceneBackdrop />
      <Navigation />
      {/* Journey layer + content share this relative, full-height wrapper */}
      <div className="relative">
        <VanJourney />
        <main className="relative z-20">
          <Hero />
          <ValuePropositions />
          <Services />
          <LondonAdvantage />
          <HowItWorks />
          <TrustBanner />
        </main>
      </div>
      <Footer />
    </div>
  );
}
