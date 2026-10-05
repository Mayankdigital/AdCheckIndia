import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function Reveal({ children, delay = 0, duration = 0.5, direction = 'up', className = '' }) {
  const prefersReducedMotion = useReducedMotion();

  const getInitialY = () => {
    if (direction === 'up') return 20;
    if (direction === 'down') return -20;
    return 0;
  };

  const getInitialX = () => {
    if (direction === 'left') return 20;
    if (direction === 'right') return -20;
    return 0;
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: getInitialY(), x: getInitialX() }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
