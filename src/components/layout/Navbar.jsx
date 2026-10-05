import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Features',     href: '/#features'     },
  { label: 'Check',        href: '/check'          },
  { label: 'History',      href: '/history'        },
];

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const location  = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? 'bg-[#FFFBF5]/95 border-b border-[rgba(0,0,0,0.08)] shadow-sm backdrop-blur-md'
            : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <Shield className="w-6 h-6 text-saffron" />
              <span className="font-bold text-lg font-display text-[var(--color-text)]">
                AdCheck <span className="text-saffron">India</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-[var(--color-text-muted)]
                             hover:text-[var(--color-text)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/auth"
                className="px-4 py-1.5 rounded-lg border font-medium text-sm
                           border-[var(--color-border)] text-[var(--color-text)]
                           hover:border-saffron hover:text-saffron transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/check"
                className="px-5 py-1.5 rounded-lg bg-saffron text-white font-bold text-sm
                           hover:bg-saffron-600 transition-colors shadow-sm"
              >
                Check your ad
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-base)]"
            >
              <div className="px-4 py-4 space-y-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="block py-2 text-sm font-medium text-[var(--color-text-muted)]
                               hover:text-[var(--color-text)] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 flex flex-col gap-2 border-t border-[var(--color-border)]">
                  <Link 
                    to="/auth" 
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-2 rounded-lg border border-[var(--color-border)]
                                     text-[var(--color-text)] font-medium text-sm text-center hover:border-saffron
                                     hover:text-saffron transition-colors"
                  >
                    Log in
                  </Link>
                  <Link to="/check"
                    className="w-full py-2 rounded-lg bg-saffron text-white font-bold text-sm
                               text-center hover:bg-saffron-600 transition-colors">
                    Check your ad
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
