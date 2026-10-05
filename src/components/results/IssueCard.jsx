import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Copy, Check, Info, Film, Image as ImageIcon, Type } from 'lucide-react';
import { VERDICT_LABELS } from '../../lib/constants';

export default function IssueCard({ issue, onTimestampClick }) {
  const [expanded, setExpanded] = useState(issue.severity === 'high');
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(issue.suggestedRewrite);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVerdictStyles = (verdict) => {
    switch(verdict) {
      case 'violation': return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'risky': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'needs_review': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'pass': return 'bg-green-500/10 border-green-500/30 text-green-400';
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const SourceIcon = issue.source === 'video' ? Film : issue.source === 'photo' ? ImageIcon : Type;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl overflow-hidden border border-[var(--color-border)] mb-4"
    >
      <button 
        className="w-full text-left p-4 md:p-5 flex items-start gap-4 hover:bg-[var(--color-glass-bg)]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${getVerdictStyles(issue.verdict)}`}>
              {VERDICT_LABELS[issue.verdict]}
            </span>
            <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] bg-[var(--color-glass-bg)] px-2 py-0.5 rounded">
              <SourceIcon className="w-3 h-3" />
              <span className="capitalize">{issue.source}</span>
              {issue.timestampSeconds !== undefined && (
                <span 
                  className="ml-1 text-violet-400 hover:text-violet-300 underline cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTimestampClick?.(issue.timestampSeconds);
                  }}
                >
                  @ {Math.floor(issue.timestampSeconds / 60)}:{(issue.timestampSeconds % 60).toString().padStart(2, '0')}
                </span>
              )}
            </div>
          </div>
          <h3 className="font-medium text-lg leading-snug">{issue.claimText}</h3>
        </div>
        <div className="flex-shrink-0 mt-1">
          {expanded ? <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" /> : <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-5 pt-0 border-t border-[var(--color-border)] space-y-4">
              
              <div className="bg-[var(--color-glass-bg)] rounded-lg p-4 mt-4">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">{issue.ruleId}: {issue.ruleName}</h4>
                    <p className="text-sm text-[var(--color-text-muted)] italic">{issue.ruleText}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1 text-[var(--color-text-muted)] uppercase tracking-wider">Explanation</h4>
                <p className="text-[var(--color-text)] text-sm">{issue.explanation}</p>
              </div>

              {issue.suggestedRewrite && (
                <div>
                  <h4 className="text-sm font-semibold mb-1 text-[var(--color-text-muted)] uppercase tracking-wider">Suggested Fix</h4>
                  <div className="relative group">
                    <div className="bg-green-500/10 border border-green-500/20 text-green-300 rounded-lg p-3 text-sm pr-12">
                      {issue.suggestedRewrite}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-md bg-[var(--color-base)] border border-[var(--color-border)] hover:bg-[var(--color-glass-bg)] transition-colors"
                      title="Copy suggestion"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-[var(--color-text-muted)]" />}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
