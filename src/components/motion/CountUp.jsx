import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function CountUp({ end, duration = 2000, prefix = '', suffix = '', label = '' }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRun) {
        setHasRun(true);
        let startTime = null;
        const animate = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const progress = Math.min((currentTime - startTime) / duration, 1);
          
          // ease out expo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          
          setCount(Math.floor(easeProgress * end));
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      }
    });

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, prefersReducedMotion, hasRun]);

  return (
    <div className="flex flex-col items-center" ref={countRef}>
      <div className="text-4xl md:text-5xl font-display font-bold text-[var(--color-text)]">
        {prefix}{count}{suffix}
      </div>
      {label && <div className="text-sm md:text-base text-[var(--color-text-muted)] mt-1">{label}</div>}
    </div>
  );
}
