import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function ParticleCanvas({ intensity = 1 }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (intensity === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let animationFrameId;
    let isVisible = true;

    const numParticles = window.innerWidth < 768 ? 25 : 60;
    
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < numParticles * intensity; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5 + 0.5,
          color: Math.random() > 0.5 ? '#8b5cf6' : '#06b6d4'
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      initParticles();
    };

    const draw = () => {
      if (!isVisible) return;
      
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const particleOpacity = theme === 'dark' ? 0.4 : 0.2;
      const lineOpacity = theme === 'dark' ? 0.15 : 0.05;

      particles.forEach((p, i) => {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > rect.width) p.vx *= -1;
          if (p.y < 0 || p.y > rect.height) p.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = particleOpacity;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = lineOpacity * (1 - dist / 100);
            ctx.stroke();
          }
        }
      });
      ctx.globalAlpha = 1;

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !prefersReducedMotion) draw();
    });
    observer.observe(canvas);
    
    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible && !prefersReducedMotion) draw();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [theme, intensity, prefersReducedMotion]);

  if (intensity === 0) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0" 
    />
  );
}
