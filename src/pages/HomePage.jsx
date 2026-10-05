import PageWrapper from '../components/layout/PageWrapper';
import HeroSection from '../components/home/HeroSection';
import TrustMarquee from '../components/home/TrustMarquee';
import HowItWorks from '../components/home/HowItWorks';
import FeaturesBento from '../components/home/FeaturesBento';
import LiveDemoPreview from '../components/home/LiveDemoPreview';
import StatsStrip from '../components/home/StatsStrip';
import WhoItsFor from '../components/home/WhoItsFor';
import FinalCta from '../components/home/FinalCta';

export default function HomePage() {
  return (
    <PageWrapper>
      <HeroSection />
      <TrustMarquee />
      <HowItWorks />
      <FeaturesBento />
      <LiveDemoPreview />
      <StatsStrip />
      <WhoItsFor />
      <FinalCta />
    </PageWrapper>
  );
}

