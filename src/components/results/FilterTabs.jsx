import { motion } from 'framer-motion';

export default function FilterTabs({ activeTab, onTabChange, summary }) {
  const tabs = [
    { id: 'all', label: 'All Issues', count: summary.violations + summary.risky + summary.passed },
    { id: 'violation', label: 'Violations', count: summary.violations, color: 'text-red-400' },
    { id: 'risky', label: 'Risky', count: summary.risky, color: 'text-amber-400' },
    { id: 'passed', label: 'Passed', count: summary.passed, color: 'text-green-400' }
  ];

  return (
    <div className="flex overflow-x-auto no-scrollbar border-b border-[var(--color-border)] mb-8">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <div className="flex items-center gap-2">
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs bg-[var(--color-glass-bg)] ${tab.color || ''}`}>
                {tab.count}
              </span>
            </div>
            {isActive && (
              <motion.div
                layoutId="filter-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
