import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function CursorSpotlight() {
  const [hasHover, setHasHover] = useState(false);
  const spotlightRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setHasHover(!window.matchMedia('(hover: none)').matches);
  }, []);

  useEffect(() => {
    if (!hasHover || prefersReducedMotion) return;

    let rafId;
    const currentPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const updateMouse = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const render = () => {
      // Lerp
      currentPos.x += (pos.current.x - currentPos.x) * 0.15;
      currentPos.y += (pos.current.y - currentPos.y) * 0.15;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate(${currentPos.x - 200}px, ${currentPos.y - 200}px)`;
      }
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', updateMouse);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', updateMouse);
      cancelAnimationFrame(rafId);
    };
  }, [hasHover, prefersReducedMotion]);

  if (!hasHover || prefersReducedMotion) return null;

  return (
    <div
      ref={spotlightRef}
      className="fixed top-0 left-0 w-[400px] h-[400px] pointer-events-none z-[999] rounded-full mix-blend-screen"
      style={{
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        willChange: 'transform'
      }}
    />
  );
}
