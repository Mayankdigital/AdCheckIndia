import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '../motion/Reveal';

export default function FinalCta() {
  return (
    <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <Reveal>
        <div className="relative rounded-3xl overflow-hidden border border-violet-500/20 p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-900/40 to-[var(--color-base)] z-0" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-violet-500/30 filter blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">Ready to check your ad?</h2>
            <p className="text-xl text-[var(--color-text-muted)] mb-10 max-w-2xl mx-auto">
              Join thousands of marketers ensuring their campaigns are compliant before they spend a single rupee on media.
            </p>
            <Link to="/check" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:from-violet-500 hover:to-indigo-500 transition-all shadow-glow-violet text-lg group">
              Start your free check
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
