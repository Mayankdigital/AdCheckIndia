import { useTheme } from '../../context/ThemeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function AuroraBlobs({ intensity = 1 }) {
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  
  if (intensity === 0) return null;

  const baseOpacity = theme === 'dark' ? 0.15 : 0.08;
  const opacity = baseOpacity * intensity;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" style={{ opacity }}>
      <div 
        className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600 mix-blend-screen filter blur-[80px] ${!prefersReducedMotion ? 'animate-aurora-drift' : ''}`}
        style={{ animationDuration: '18s' }}
      />
      <div 
        className={`absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-indigo-600 mix-blend-screen filter blur-[80px] ${!prefersReducedMotion ? 'animate-aurora-drift' : ''}`}
        style={{ animationDuration: '22s', animationDelay: '2s' }}
      />
      <div 
        className={`absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] rounded-full bg-cyan-600 mix-blend-screen filter blur-[80px] ${!prefersReducedMotion ? 'animate-aurora-drift' : ''}`}
        style={{ animationDuration: '15s', animationDelay: '5s' }}
      />
      <div 
        className={`absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-pink-600 mix-blend-screen filter blur-[80px] ${!prefersReducedMotion ? 'animate-aurora-drift' : ''}`}
        style={{ animationDuration: '25s', animationDelay: '1s' }}
      />
    </div>
  );
}
