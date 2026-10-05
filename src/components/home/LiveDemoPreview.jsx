import { useState, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import Reveal from '../motion/Reveal';

export default function LiveDemoPreview() {
  const [step, setStep] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setStep(4);
      return;
    }
    
    const interval = setInterval(() => {
      setStep(s => (s + 1) % 5);
    }, 2500);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal>
        <div className="glass rounded-xl overflow-hidden border-[var(--color-border)] shadow-2xl relative">
          {/* Browser Header */}
          <div className="bg-[var(--color-base)]/80 border-b border-[var(--color-border)] p-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="mx-auto bg-[var(--color-glass-bg)] px-4 py-1 rounded-md text-xs text-[var(--color-text-muted)] font-mono">
              adcheckindia.com/results
            </div>
          </div>
          
          {/* Mock Content */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 bg-[var(--color-base)]">
            <div className="md:col-span-1 space-y-6">
              <div className="w-full aspect-square rounded-full border-8 border-[var(--color-glass-bg)] flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="50%" cy="50%" r="45%" fill="none" stroke={step > 0 ? '#f59e0b' : 'transparent'} strokeWidth="8" strokeDasharray="100 100" strokeDashoffset={step > 0 ? "35" : "100"} className="transition-all duration-1000" />
                </svg>
                <div className="text-4xl font-bold font-display">{step > 0 ? '65' : '--'}</div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-[var(--color-glass-bg)] rounded w-full" />
                <div className="h-4 bg-[var(--color-glass-bg)] rounded w-2/3" />
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <div className={`p-4 rounded-lg border transition-all duration-500 ${step > 1 ? 'border-amber-500/30 bg-amber-500/5 opacity-100 translate-y-0' : 'border-[var(--color-border)] opacity-0 translate-y-4'}`}>
                <div className="flex gap-2 items-center mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500">RISKY</span>
                  <div className="h-3 bg-[var(--color-glass-bg)] rounded w-1/3" />
                </div>
                <div className="h-2 bg-[var(--color-glass-bg)] rounded w-full mb-1" />
                <div className="h-2 bg-[var(--color-glass-bg)] rounded w-5/6" />
              </div>

              <div className={`p-4 rounded-lg border transition-all duration-500 delay-300 ${step > 2 ? 'border-red-500/30 bg-red-500/5 opacity-100 translate-y-0' : 'border-[var(--color-border)] opacity-0 translate-y-4'}`}>
                <div className="flex gap-2 items-center mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-500">VIOLATION</span>
                  <div className="h-3 bg-[var(--color-glass-bg)] rounded w-1/4" />
                </div>
                <div className="h-2 bg-[var(--color-glass-bg)] rounded w-full mb-1" />
                <div className="h-2 bg-[var(--color-glass-bg)] rounded w-3/4" />
              </div>

              <div className={`p-4 rounded-lg border transition-all duration-500 delay-500 ${step > 3 ? 'border-green-500/30 bg-green-500/5 opacity-100 translate-y-0' : 'border-[var(--color-border)] opacity-0 translate-y-4'}`}>
                <div className="flex gap-2 items-center mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-500">PASS</span>
                  <div className="h-3 bg-[var(--color-glass-bg)] rounded w-1/2" />
                </div>
                <div className="h-2 bg-[var(--color-glass-bg)] rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
