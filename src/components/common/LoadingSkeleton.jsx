export default function LoadingSkeleton({ width = '100%', height = '20px', rounded = 'rounded-md', className = '' }) {
  return (
    <div 
      className={`animate-pulse bg-[var(--color-border)] ${rounded} ${className}`}
      style={{ width, height }}
    />
  );
}
