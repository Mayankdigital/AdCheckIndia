import ScoreGauge from './ScoreGauge';
import SparkleConfetti from './SparkleConfetti';
import RiskBadge from '../common/RiskBadge';
import { CATEGORIES } from '../../lib/constants';

export default function SummaryCard({ report }) {
  const { summary, overallRisk, score, category } = report;
  const categoryLabel = CATEGORIES.find(c => c.id === category)?.label || category;

  return (
    <div className="glass rounded-3xl p-6 md:p-10 relative overflow-hidden">
      <SparkleConfetti trigger={overallRisk === 'low'} />
      
      {/* Background glow based on risk */}
      <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full filter blur-[80px] opacity-20 pointer-events-none ${
        overallRisk === 'high' ? 'bg-red-500' : overallRisk === 'medium' ? 'bg-amber-500' : 'bg-green-500'
      }`} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left space-y-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-[var(--color-glass-bg)] border border-[var(--color-border)] text-sm font-medium">
              {categoryLabel}
            </span>
            {report.isInfluencer && (
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                Influencer
              </span>
            )}
          </div>
          
          <h2 className="text-3xl font-bold font-display">Compliance Report</h2>
          <div className="mt-4">
            <RiskBadge level={overallRisk} className="px-4 py-2 text-base" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--color-border)] mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{summary.violations}</div>
              <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mt-1">Violations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">{summary.risky}</div>
              <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mt-1">Risky</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{summary.passed}</div>
              <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mt-1">Passed</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <ScoreGauge score={score} risk={overallRisk} />
        </div>
      </div>
    </div>
  );
}
