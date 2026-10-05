import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export default function RiskBadge({ level = 'medium', className = '' }) {
  const configs = {
    low: { icon: CheckCircle, color: 'text-risk-low', bg: 'bg-risk-low/10', border: 'border-risk-low/20', shadow: 'shadow-glow-green', label: 'Low Risk' },
    medium: { icon: AlertCircle, color: 'text-risk-medium', bg: 'bg-risk-medium/10', border: 'border-risk-medium/20', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]', label: 'Medium Risk' },
    high: { icon: AlertTriangle, color: 'text-risk-high', bg: 'bg-risk-high/10', border: 'border-risk-high/20', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]', label: 'High Risk' }
  };

  const config = configs[level] || configs.medium;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.bg} ${config.border} ${config.color} ${config.shadow} ${className}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
}
