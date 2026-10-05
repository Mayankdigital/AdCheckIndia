import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Search, ArrowRight, ChevronDown } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useHistory } from '../hooks/useHistory';

const CATEGORY_IMAGES = {
  health: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
  food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
  finance: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=600&q=80',
  education: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
  realestate: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
  fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
  other: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
};

function MiniLineChart({ history }) {
  if (history.length < 2) {
    return <div className="text-sm text-gray-400 mt-4">Not enough data for chart.</div>;
  }
  
  // Show up to 6 most recent points, reversed so left is oldest, right is newest
  const points = history.slice(0, 6).reverse();
  const max = 100;
  
  return (
    <svg className="w-full h-16 mt-2 overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
      {points.map((p, i) => {
        if (i === 0) return null;
        const prev = points[i-1];
        const x1 = ((i-1) / (points.length - 1)) * 100;
        const y1 = 40 - (prev.score / max) * 40;
        const x2 = (i / (points.length - 1)) * 100;
        const y2 = 40 - (p.score / max) * 40;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1B2B5E" strokeWidth="2" />
        );
      })}
      {points.map((p, i) => {
        const x = (i / (points.length - 1)) * 100;
        const y = 40 - (p.score / max) * 40;
        const color = p.score >= 70 ? '#DC2626' : p.score >= 40 ? '#E07B00' : '#138808';
        return (
          <circle key={'c'+i} cx={x} cy={y} r="3" fill={color} stroke="#fff" strokeWidth="1.5" />
        );
      })}
    </svg>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, removeReport, clearHistory } = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all'); // all, high, medium, low

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire check history?")) {
      clearHistory();
    }
  };

  const stats = useMemo(() => {
    const high = history.filter(r => r.score >= 70).length;
    const med = history.filter(r => r.score >= 40 && r.score < 70).length;
    const low = history.filter(r => r.score < 40).length;
    const avg = history.length ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length) : 0;
    return { high, med, low, avg, total: history.length };
  }, [history]);

  const filteredHistory = useMemo(() => {
    return history.filter(r => {
      const matchSearch = r.category.toLowerCase().includes(searchTerm.toLowerCase());
      let matchRisk = true;
      if (filterRisk === 'high') matchRisk = r.score >= 70;
      if (filterRisk === 'medium') matchRisk = r.score >= 40 && r.score < 70;
      if (filterRisk === 'low') matchRisk = r.score < 40;
      return matchSearch && matchRisk;
    });
  }, [history, searchTerm, filterRisk]);

  return (
    <PageWrapper>
      <div className="absolute inset-0 bg-[#F8F9FB] -z-10 bg-grid-india" />
      
      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-black tracking-[0.15em] text-gray-500 uppercase mb-2">Your Reports</p>
            <h1 className="text-5xl font-black font-display text-[#1B2B5E] mb-4">Check history</h1>
            <div className="flex gap-1 mb-6">
              <div className="w-8 h-1.5 bg-[#E07B00] rounded-full" />
              <div className="w-8 h-1.5 bg-gray-200 rounded-full" />
              <div className="w-8 h-1.5 bg-[#138808] rounded-full" />
            </div>
            <p className="text-lg text-gray-600 font-medium">Your recent ad compliance reports.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              to="/check"
              className="px-6 py-2.5 rounded-xl bg-[#E07B00] hover:bg-[#c76d00] text-white font-bold text-sm shadow-[0_4px_12px_rgba(224,123,0,0.25)] transition-colors"
            >
              + New check
            </Link>
            {history.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="px-6 py-2.5 rounded-xl border border-red-200 text-red-600 bg-white hover:bg-red-50 font-bold text-sm flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear history
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        {history.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black tracking-widest text-[#1B2B5E] uppercase mb-1">Checks Run</p>
              <p className="text-4xl font-black text-[#1B2B5E] mb-1">{stats.total}</p>
              <p className="text-sm font-bold text-gray-500">saved in this browser</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black tracking-widest text-[#1B2B5E] uppercase mb-1">Need Attention</p>
              <p className="text-4xl font-black text-[#DC2626] mb-1">{stats.high}</p>
              <p className="text-sm font-bold text-gray-500">high risk reports</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black tracking-widest text-[#1B2B5E] uppercase mb-1">Average Risk</p>
              <p className="text-4xl font-black text-[#E07B00] mb-1">{stats.avg}</p>
              <p className="text-sm font-bold text-gray-500">lower is better</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <p className="text-[10px] font-black tracking-widest text-[#1B2B5E] uppercase">Risk Over Your Checks</p>
              <MiniLineChart history={history} />
            </div>
          </div>
        )}

        {/* Filters */}
        {history.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by category, e.g. Education" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:border-[#E07B00]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
              <button 
                onClick={() => setFilterRisk('all')}
                className={`shrink-0 px-4 py-1.5 rounded-full border text-sm font-bold transition-all ${
                  filterRisk === 'all' 
                  ? 'border-[#1B2B5E] text-[#1B2B5E] shadow-[3px_3px_0_#E07B00] bg-white' 
                  : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                All <span className="ml-1 px-1.5 py-0.5 rounded bg-gray-100 text-[10px]">{stats.total}</span>
              </button>
              <button 
                onClick={() => setFilterRisk('high')}
                className={`shrink-0 px-4 py-1.5 rounded-full border flex items-center gap-2 text-sm font-bold transition-all ${
                  filterRisk === 'high' 
                  ? 'border-[#1B2B5E] text-[#1B2B5E] shadow-[3px_3px_0_#E07B00] bg-white' 
                  : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-[#DC2626]" /> High <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px]">{stats.high}</span>
              </button>
              <button 
                onClick={() => setFilterRisk('medium')}
                className={`shrink-0 px-4 py-1.5 rounded-full border flex items-center gap-2 text-sm font-bold transition-all ${
                  filterRisk === 'medium' 
                  ? 'border-[#1B2B5E] text-[#1B2B5E] shadow-[3px_3px_0_#E07B00] bg-white' 
                  : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-[#E07B00]" /> Medium <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px]">{stats.med}</span>
              </button>
              <button 
                onClick={() => setFilterRisk('low')}
                className={`shrink-0 px-4 py-1.5 rounded-full border flex items-center gap-2 text-sm font-bold transition-all ${
                  filterRisk === 'low' 
                  ? 'border-[#1B2B5E] text-[#1B2B5E] shadow-[3px_3px_0_#E07B00] bg-white' 
                  : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-[#138808]" /> Low <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px]">{stats.low}</span>
              </button>
            </div>

            <button className="shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-[#1B2B5E] flex items-center gap-2">
              Newest first <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {history.length === 0 && (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center shadow-sm">
            <h2 className="text-2xl font-bold mb-3 text-[#1B2B5E]">No history yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't checked any ads yet. Start your first analysis to see it here.
            </p>
            <Link to="/check" className="px-8 py-3 rounded-xl bg-[#E07B00] hover:bg-[#c76d00] text-white font-bold transition-colors inline-block">
              Check an Ad
            </Link>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((report) => {
            const isHigh = report.score >= 70;
            const isMed = report.score >= 40 && report.score < 70;
            
            const badgeColor = isHigh ? '#DC2626' : isMed ? '#E07B00' : '#138808';
            const badgeText = isHigh ? 'HIGH RISK' : isMed ? 'MEDIUM RISK' : 'LOW RISK';
            
            // Image mapping
            const catLower = report.category.toLowerCase().replace(/[^a-z]/g, '');
            // Find a match or use 'other'
            const imgKey = Object.keys(CATEGORY_IMAGES).find(k => catLower.includes(k)) || 'other';
            const imageUrl = CATEGORY_IMAGES[imgKey];

            return (
              <div key={report.id} className="bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                
                {/* Image Section */}
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={report.category} 
                    className="w-full h-full object-cover"
                  />
                  {/* Stamp */}
                  <div className="absolute -bottom-3 right-3 rotate-[350deg] bg-white px-3 py-1 border-[3px] rounded-lg shadow-md"
                       style={{ borderColor: badgeColor, color: badgeColor }}>
                    <span className="text-[11px] font-black tracking-widest uppercase">{badgeText}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-[#1B2B5E] mb-1 capitalize">{report.category} Ad</h3>
                  <p className="text-sm text-gray-500 font-medium mb-6">
                    {new Date(report.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, {new Date(report.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()}
                  </p>
                  
                  {/* Risk Score Bar */}
                  <div className="mt-auto mb-5">
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Risk Score</span>
                      <span className="text-xl font-black" style={{ color: badgeColor }}>{report.score}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 relative">
                      <div className="absolute inset-0 rounded-full" 
                           style={{ background: 'linear-gradient(90deg, #138808, #E07B00, #DC2626)' }} />
                      <div className="absolute top-1/2 w-4 h-4 bg-white rounded-full border-[3px] border-[#1B2B5E] shadow-sm transform -translate-y-1/2 -translate-x-1/2"
                           style={{ left: `${Math.max(0, Math.min(100, report.score))}%` }} />
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                    <span className="font-bold text-sm" style={{ color: report.summary.violations > 0 ? '#DC2626' : '#138808' }}>
                      {report.summary.violations > 0 ? `${report.summary.violations} issue${report.summary.violations > 1 ? 's' : ''}` : 'All clear'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => removeReport(report.id)}
                        className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                        aria-label="Delete report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigate(`/results/${report.id}`)}
                        className="px-4 py-2 bg-[#1B2B5E] hover:bg-[#0e1a3d] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                      >
                        View <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </PageWrapper>
  );
}
