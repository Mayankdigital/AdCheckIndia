import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import AnimatedBackground from '../components/background/AnimatedBackground';
import GradientText from '../components/motion/GradientText';

export default function NotFoundPage() {
  return (
    <PageWrapper>
      <AnimatedBackground intensity="minimal" />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
        <h1 className="text-8xl md:text-9xl font-bold font-display mb-4">
          <GradientText>404</GradientText>
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Page not found</h2>
        <p className="text-[var(--color-text-muted)] mb-8 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="px-8 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white transition-colors font-medium">
          Back to Home
        </Link>
      </div>
    </PageWrapper>
  );
}
