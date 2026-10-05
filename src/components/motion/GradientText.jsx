export default function GradientText({ 
  children, 
  from = 'from-violet-400', 
  via = 'via-purple-400', 
  to = 'to-indigo-400',
  className = '' 
}) {
  return (
    <span className={`bg-gradient-to-r ${from} ${via} ${to} bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}
