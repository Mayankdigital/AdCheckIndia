import { ShieldCheck } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const ITEMS = [
  "ASCI Guidelines", "Influencer Disclosure", "Health Claim Detection", 
  "Finance Ad Rules", "AI Content Labels", "CCPA Compliance", 
  "Misleading Claims", "Celebrity Endorsements"
];

export default function TrustMarquee() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <section id="trust" className="py-12 border-y border-[var(--color-border)] bg-[var(--color-base)]/50 relative overflow-hidden">
      {/* Left/Right Fade Masks */}
      <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-[var(--color-base)] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-[var(--color-base)] to-transparent z-10 pointer-events-none" />
      
      <div className="flex text-center mb-8 justify-center">
        <p className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Comprehensive checking across all major guidelines</p>
      </div>

      <div className={`flex w-[200%] gap-4 ${!prefersReducedMotion ? 'animate-marquee hover:[animation-play-state:paused]' : 'flex-wrap w-full justify-center'}`}>
        {[...ITEMS, ...(prefersReducedMotion ? [] : ITEMS)].map((item, i) => (
          <div key={i} className="glass px-6 py-3 rounded-full flex items-center gap-2 flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium whitespace-nowrap">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
