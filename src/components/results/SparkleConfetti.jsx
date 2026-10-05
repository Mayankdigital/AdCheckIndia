import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function SparkleConfetti({ trigger }) {
  const canvasRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!trigger || prefersReducedMotion) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200, // start below screen
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 5 - 3,
        size: Math.random() * 4 + 2,
        color: ['#22c55e', '#4ade80', '#16a34a', '#facc15', '#fff'][Math.floor(Math.random() * 5)],
        opacity: 1,
        life: Math.random() * 100 + 50
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let allDead = true;
      
      particles.forEach(p => {
        if (p.opacity > 0) {
          allDead = false;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05; // gravity
          p.life--;
          
          if (p.life < 0) {
            p.opacity = Math.max(0, p.opacity - 0.02);
          }
          
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          
          // Draw sparkle star
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.PI / 4);
          ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
          ctx.restore();
        }
      });
      
      if (!allDead) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [trigger, prefersReducedMotion]);

  if (!trigger || prefersReducedMotion) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[100]" 
    />
  );
}
