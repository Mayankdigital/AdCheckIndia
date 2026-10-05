import AuroraBlobs from './AuroraBlobs';
import AnimatedGrid from './AnimatedGrid';
import ParticleCanvas from './ParticleCanvas';
import CursorSpotlight from './CursorSpotlight';
import NoiseOverlay from './NoiseOverlay';

export default function AnimatedBackground({ intensity = 'full' }) {
  const configs = {
    full: { aurora: 1, grid: 1, particles: 1, spotlight: true },
    calm: { aurora: 0.6, grid: 0.5, particles: 0.5, spotlight: true },
    minimal: { aurora: 0.3, grid: 0.3, particles: 0, spotlight: false }
  };
  
  const config = configs[intensity] || configs.full;

  return (
    <>
      <div className="fixed inset-0 z-[-1] bg-[var(--color-base)] overflow-hidden">
        <AuroraBlobs intensity={config.aurora} />
        <AnimatedGrid intensity={config.grid} />
        <ParticleCanvas intensity={config.particles} />
      </div>
      {config.spotlight && <CursorSpotlight />}
      <NoiseOverlay />
    </>
  );
}
