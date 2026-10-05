import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroVisual from './HeroVisual';
import Reveal from '../motion/Reveal';

export default function HeroSection() {
  const words = ['Check', 'your', 'ad', 'before', 'regulators', 'do.'];

  return (
    <section className="relative h-screen flex items-center overflow-hidden">

      {/* ── India flag-bands background ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Saffron diagonal band — top-left */}
        <div
          className="absolute"
          style={{
            top: '-10%', left: '-5%',
            width: '55%', height: '120%',
            background: 'linear-gradient(135deg, rgba(255,153,51,0.18) 0%, rgba(255,153,51,0.08) 60%, transparent 100%)',
            transform: 'skewX(-8deg)',
          }}
        />
        {/* Green diagonal band — bottom-right */}
        <div
          className="absolute"
          style={{
            bottom: '-10%', right: '-5%',
            width: '50%', height: '110%',
            background: 'linear-gradient(315deg, rgba(19,136,8,0.14) 0%, rgba(19,136,8,0.06) 60%, transparent 100%)',
            transform: 'skewX(-8deg)',
          }}
        />
        {/* Thin saffron top stripe */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-saffron via-saffron/60 to-transparent" />
        {/* Thin green bottom stripe */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-india-green via-india-green/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full
                      grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-10 items-center">

        {/* ── LEFT: copy ── */}
        <div className="text-left space-y-5">

          {/* Pill badge */}
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                            bg-saffron-50 border border-saffron-200 text-saffron-700">
              <span className="w-1.5 h-1.5 rounded-full bg-india-green animate-pulse" />
              <span className="text-sm font-medium">AI ad compliance for India</span>
            </div>
          </Reveal>

          {/* Headline — word by word */}
          <h1 className="text-5xl md:text-6xl font-black font-display leading-none text-india-navy tracking-tight">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.06 + 0.2 }}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Green underline accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
            className="origin-left h-1 rounded-full bg-india-green"
            style={{ width: 180 }}
          />

          {/* Subtitle */}
          <Reveal delay={0.7}>
            <p className="text-base md:text-lg text-[var(--color-text-muted)] max-w-lg leading-relaxed">
              Upload your ad, pick a category, and get a detailed compliance
              report in under 60 seconds. Stay ahead of ASCI guidelines.
            </p>
          </Reveal>

          {/* CTA buttons */}
          <Reveal delay={0.9}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/check"
                className="group flex items-center justify-center gap-2
                           px-7 py-3 rounded-lg bg-saffron text-white font-bold text-base
                           hover:bg-saffron-600 transition-colors shadow-glow-saffron"
              >
                Check your ad
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center justify-center gap-2
                           px-7 py-3 rounded-lg border-2 border-[var(--color-border)]
                           text-[var(--color-text)] font-semibold text-base
                           hover:border-saffron hover:text-saffron transition-colors"
              >
                <Play className="w-4 h-4" />
                See how it works
              </a>
            </div>
          </Reveal>

          {/* Trust strip */}
          <Reveal delay={1.1}>
            <div className="flex items-center gap-6 pt-1">
              {['Free first check', 'No signup needed', 'Report in 60 seconds'].map((t, i) => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-india-green" />
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ── RIGHT: visual ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="flex justify-center lg:justify-end overflow-visible"
        >
          <HeroVisual />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <a href="#trust" aria-label="Scroll down">
          <ArrowRight className="w-5 h-5 rotate-90 text-[var(--color-text-muted)] opacity-40 hover:opacity-80 transition-opacity" />
        </a>
      </motion.div>
    </section>
  );
}
