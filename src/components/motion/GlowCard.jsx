import { useRef, useState, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function GlowCard({ children, className = '', ...props }) {
  const cardRef = useRef(null);
  const [hasHover, setHasHover] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setHasHover(!window.matchMedia('(hover: none)').matches);
  }, []);

  const handleMouseMove = (e) => {
    if (!hasHover || prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`glass relative overflow-hidden rounded-2xl group transition-transform duration-300 ${!prefersReducedMotion && hasHover ? 'hover:-translate-y-1 hover:scale-[1.02]' : ''} ${className}`}
      {...props}
    >
      {hasHover && !prefersReducedMotion && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(139,92,246,0.15), transparent 80%)'
          }}
        />
      )}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}
