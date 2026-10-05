import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-base)] pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-violet-500" />
              <span className="text-lg font-bold font-display">AdCheck India</span>
            </Link>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              AI-powered ad compliance screening designed for the Indian market.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-[var(--color-text)]">Product</h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <li><Link to="/check" className="hover:text-violet-400">Check Ad</Link></li>
              <li><a href="/#features" className="hover:text-violet-400">Features</a></li>
              <li><Link to="/history" className="hover:text-violet-400">History</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-[var(--color-text)]">Company</h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <li><a href="#" className="hover:text-violet-400">About Us</a></li>
              <li><a href="#" className="hover:text-violet-400">Contact</a></li>
              <li><a href="#" className="hover:text-violet-400">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-[var(--color-text)]">Legal</h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <li><a href="#" className="hover:text-violet-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-violet-400">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
          <p>© {new Date().getFullYear()} AdCheck India. All rights reserved.</p>
          <p className="max-w-2xl text-center md:text-right">
            Disclaimer: AdCheck India is a risk-screening tool and does not constitute legal advice or official ASCI approval. Always consult a legal professional for final clearance.
          </p>
        </div>
      </div>
    </footer>
  );
}
