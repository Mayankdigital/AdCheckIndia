import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function AnimatedGrid({ intensity = 1 }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (intensity === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let offset = 0;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gridSpacing = 40;
      const lineColor = theme === 'dark' ? `rgba(255, 255, 255, ${0.05 * intensity})` : `rgba(0, 0, 0, ${0.03 * intensity})`;
      
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      // Draw horizontal lines with perspective effect
      for (let y = canvas.height / 2; y < canvas.height; y += gridSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      for (let y = canvas.height / 2; y > 0; y -= gridSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      
      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSpacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      ctx.stroke();

      // Shimmer effect
      if (!prefersReducedMotion) {
        const shimmerGrad = ctx.createLinearGradient(
          (offset % (canvas.width * 2)) - canvas.width, 0,
          (offset % (canvas.width * 2)), 0
        );
        shimmerGrad.addColorStop(0, 'transparent');
        shimmerGrad.addColorStop(0.5, theme === 'dark' ? `rgba(139, 92, 246, ${0.1 * intensity})` : `rgba(139, 92, 246, ${0.05 * intensity})`);
        shimmerGrad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = shimmerGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        offset += 2;
      }
      
      // Radial mask
      const centerGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.5
      );
      centerGrad.addColorStop(0, 'transparent');
      centerGrad.addColorStop(1, theme === 'dark' ? '#12122a' : '#ffffff');
      
      ctx.fillStyle = centerGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [theme, intensity, prefersReducedMotion]);

  if (intensity === 0) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0" 
    />
  );
}
