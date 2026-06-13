import Navigation from '../sections/Navigation';
import Hero from '../sections/Hero';
import ValuePropositions from '../sections/ValuePropositions';
import Services from '../sections/Services';
import LondonAdvantage from '../sections/LondonAdvantage';
import HowItWorks from '../sections/HowItWorks';
import TrustBanner from '../sections/TrustBanner';
import Footer from '../sections/Footer';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ValuePropositions />
        <Services />
        <LondonAdvantage />
        <HowItWorks />
        <TrustBanner />
      </main>
      <Footer />
    </>
  );
}
