import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import CountUp from '../motion/CountUp';

export default function ScoreGauge({ score, risk }) {
  const prefersReducedMotion = useReducedMotion();
  
  const colors = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444'
  };
  
  const labels = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk'
  };

  const color = colors[risk] || colors.medium;
  const label = labels[risk] || 'Unknown';
  
  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-48 h-48 flex flex-col items-center justify-center mx-auto">
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        {/* Background circle */}
        <circle 
          cx="50%" cy="50%" r="45" 
          fill="none" 
          stroke="var(--color-glass-bg)" 
          strokeWidth="8" 
        />
        {/* Animated score circle */}
        <motion.circle 
          cx="50%" cy="50%" r="45" 
          fill="none" 
          stroke={color} 
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: prefersReducedMotion ? strokeDashoffset : circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="text-4xl font-bold font-display" style={{ color }}>
          <CountUp end={score} duration={1500} />
        </div>
        <div className="text-sm font-medium mt-1 uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </div>
      </div>
    </div>
  );
}
