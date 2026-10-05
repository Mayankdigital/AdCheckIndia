import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InfluencerToggle({ isInfluencer, onToggle, caption, onCaptionChange }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 glass rounded-xl border border-[var(--color-border)] mb-4">
        <div>
          <h4 className="font-medium">Influencer Check</h4>
          <p className="text-sm text-[var(--color-text-muted)]">Enable specific guidelines for influencer posts</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isInfluencer}
          onClick={() => onToggle(!isInfluencer)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none ${
            isInfluencer ? 'bg-violet-500' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isInfluencer ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {isInfluencer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-2">
              <label htmlFor="caption" className="block text-sm font-medium">Post Caption (Optional)</label>
              <textarea
                id="caption"
                rows={4}
                placeholder="Paste the post caption or script here to check for disclosure tags..."
                value={caption}
                onChange={(e) => onCaptionChange(e.target.value)}
                className="w-full rounded-xl p-4 bg-[var(--color-glass-bg)] border border-[var(--color-border)] focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none resize-none transition-colors"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
