import HeroSection from '@/components/landing/HeroSection';
import FeatureCards from '@/components/landing/FeatureCards';
import HowItWorks from '@/components/landing/HowItWorks';
import PricingSection from '@/components/landing/PricingSection';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <HowItWorks />
      <PricingSection />
      <FAQ />
      <Footer />
    </>
  );
}
