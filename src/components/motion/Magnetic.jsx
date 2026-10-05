import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function Magnetic({ children }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasHover, setHasHover] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setHasHover(!window.matchMedia('(hover: none)').matches);
  }, []);

  const handleMouse = (e) => {
    if (!hasHover || prefersReducedMotion) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // cap the movement
    const moveX = Math.max(-8, Math.min(8, middleX * 0.1));
    const moveY = Math.max(-8, Math.min(8, middleY * 0.1));
    
    setPosition({ x: moveX, y: moveY });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  if (!hasHover || prefersReducedMotion) {
    return <div className="inline-block">{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
