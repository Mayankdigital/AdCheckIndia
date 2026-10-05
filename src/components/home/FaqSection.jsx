import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import Reveal from '../motion/Reveal';

const FAQS = [
  { q: "What is AdCheck India?", a: "AdCheck India is an AI-powered tool that analyzes advertisements (video, image, and text) against the Advertising Standards Council of India (ASCI) guidelines to identify potential compliance risks before you publish." },
  { q: "Is this legal advice?", a: "No. AdCheck India is a risk-screening tool designed to catch obvious violations and educate marketers. It does not constitute formal legal advice or official ASCI clearance. Always consult with your legal team for final approval." },
  { q: "What types of ads can I check?", a: "You can upload video files (MP4, MOV, WebM up to 100MB), image files (JPG, PNG, WebP up to 10MB), and text captions. The tool supports multiple categories including Health, Finance, Food, and more." },
  { q: "How long does analysis take?", a: "Most analyses complete in under 60 seconds. Longer videos may take slightly more time as our AI processes visual frames, transcribes audio, and cross-references multiple rule sets." },
  { q: "Are my files stored permanently?", a: "No. Files are processed in memory and are not stored permanently on our servers. Your check history is saved locally in your browser so only you can access past reports." },
  { q: "Which regulations do you check against?", a: "We primarily focus on ASCI guidelines, including sector-specific rules (like Health & Beauty), Influencer Disclosure Guidelines, and general principles regarding misleading claims and honest representations." }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">Frequently Asked Questions</h2>
      </Reveal>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="glass rounded-xl overflow-hidden border border-white/5 transition-colors hover:border-violet-500/30">
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span className="font-medium text-lg">{faq.q}</span>
                {openIndex === i ? <Minus className="w-5 h-5 text-violet-400" /> : <Plus className="w-5 h-5 text-gray-400" />}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-4 text-[var(--color-text-muted)] border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
