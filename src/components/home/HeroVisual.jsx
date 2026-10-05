import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { CheckCircle, AlertTriangle, AlertCircle, ChevronRight, Shield, Cpu } from 'lucide-react';

/* ─── inline counter ─── */
function CountUp({ to, duration = 1300 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / duration, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to, duration]);
  return <>{n}</>;
}

/* ─── tiny spinner ─── */
function Spinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
      className="w-3.5 h-3.5 rounded-full border-2"
      style={{ borderColor: '#E07B00', borderTopColor: 'transparent' }}
    />
  );
}

/* ─── data ─── */
const FINDINGS = [
  { label: 'Claims',     result: '2 issues',  ok: false },
  { label: 'Visuals',    result: 'Clear',     ok: true  },
  { label: 'Disclosure', result: '1 issue',   ok: false },
  { label: 'Category',   result: 'Compliant', ok: true  },
];

const ISSUES = [
  { type: 'violation', title: 'Unsupported Health Claim', detail: 'Not backed by evidence' },
  { type: 'violation', title: 'Missing Disclosure',        detail: 'Claim not found' },
  { type: 'pass',      title: 'Compliant Visuals',         detail: 'OK' },
];

const SCORE = 72;

/*
  Animation timeline:
  0s    — scan line sweeps, badge "Scanning…"
  1.6s  — flag1: "100% Natural"   → red "Unsupported"
  2.4s  — flag2: "7 days!"        → amber "Needs proof"
  3.2s  — findings: spinners "Checking…"
  3.7-4.9s — resolve one-by-one
  5.4s  — score bar fills, badge "Analysis Complete ✓"
  5.9s  — issue cards slide in
  loop 13s
*/
export default function HeroVisual() {
  const reduced = useReducedMotion();
  const [phase,      setPhase]      = useState(0);
  const [flag1,      setFlag1]      = useState(false);
  const [flag2,      setFlag2]      = useState(false);
  const [resolved,   setResolved]   = useState(0);
  const [showScore,  setShowScore]  = useState(false);
  const [showIssues, setShowIssues] = useState(false);
  const [imgErr,     setImgErr]     = useState(false);

  useEffect(() => {
    if (reduced) {
      setPhase(3); setFlag1(true); setFlag2(true);
      setResolved(4); setShowScore(true); setShowIssues(true);
      return;
    }
    const run = () => {
      setPhase(0); setFlag1(false); setFlag2(false);
      setResolved(0); setShowScore(false); setShowIssues(false);
      const t = [
        setTimeout(() => { setPhase(1); setFlag1(true); }, 1600),
        setTimeout(() => setFlag2(true),                   2400),
        setTimeout(() => setPhase(2),                      3200),
        setTimeout(() => setResolved(1),                   3700),
        setTimeout(() => setResolved(2),                   4100),
        setTimeout(() => setResolved(3),                   4500),
        setTimeout(() => setResolved(4),                   4900),
        setTimeout(() => { setPhase(3); setShowScore(true); }, 5400),
        setTimeout(() => setShowIssues(true),              5900),
      ];
      return t;
    };
    let t = run();
    const loop = setInterval(() => { t.forEach(clearTimeout); t = run(); }, 13000);
    return () => { t.forEach(clearTimeout); clearInterval(loop); };
  }, [reduced]);

  const isDone = phase === 3;
  const badgeLabel =
    phase === 0 ? 'AI Scan in Progress…'
    : phase === 1 ? 'Detecting Claims…'
    : phase === 2 ? 'Checking Rules…'
    : 'Analysis Complete ✓';

  /* India-theme card style */
  const card = {
    background: '#FFFFFF',
    border: '1px solid rgba(0,0,0,0.09)',
    borderRadius: 16,
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
  };

  /* Orange-accented card (left border) */
  const cardAccent = {
    ...card,
    borderLeft: '3px solid #E07B00',
    borderRadius: 12,
  };

  return (
    <div className="relative max-w-[560px] w-full select-none mt-4">
      <motion.div
        animate={!reduced ? { y: [0, -5, 0] } : {}}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative rounded-3xl border-[2px] border-[#1B2B5E] bg-white p-5 overflow-hidden"
             style={{ boxShadow: '8px 8px 0 #1B2B5E' }}>
          
          {/* Subtle grid background inside the box */}
          <div className="absolute inset-0 bg-grid-india opacity-40 pointer-events-none" />

          {/* Top header row */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: isDone ? 'rgba(19,136,8,0.1)' : 'rgba(224,123,0,0.10)',
                border: `1px solid ${isDone ? 'rgba(19,136,8,0.3)' : 'rgba(224,123,0,0.35)'}`,
              }}
            >
              <motion.div
                animate={!reduced && !isDone ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Cpu className="w-3.5 h-3.5" style={{ color: isDone ? '#138808' : '#E07B00' }} />
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={phase}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-[10px] font-bold tracking-widest uppercase"
                  style={{ color: isDone ? '#138808' : '#E07B00' }}
                >
                  {badgeLabel}
                </motion.span>
              </AnimatePresence>
              {!isDone && !reduced && (
                <motion.span
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-saffron"
                />
              )}
            </motion.div>
            
            <span className="text-[11px] font-bold text-[#1B2B5E]/60 uppercase tracking-wide">
              Sample report
            </span>
          </div>

          {/* Two-column */}
          <div className="relative z-10 flex gap-3">

          {/* ═══ LEFT ═══ */}
          <div className="flex flex-col gap-2">

            {/* Ad card - Full Image version */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              style={{ width: 262, height: 160, ...card, overflow: 'hidden', position: 'relative', padding: 0 }}
            >
              {/* The full ad image */}
              <img
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"
                alt="Ad creative"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* A subtle gradient overlay so white text pops if we had any, but we just use it for the ad vibe */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-transparent pointer-events-none" />

              {/* Scan line */}
              {phase === 0 && !reduced && (
                <>
                  <motion.div
                    className="absolute inset-x-0 z-20 h-0.5 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg,transparent,#E07B00,transparent)',
                      boxShadow: '0 0 10px 2px rgba(224,123,0,0.8)',
                    }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}
                    animate={{
                      background: [
                        'linear-gradient(180deg,rgba(224,123,0,0.15) 0%,transparent 40%)',
                        'linear-gradient(180deg,transparent 60%,rgba(224,123,0,0.15) 100%)',
                        'linear-gradient(180deg,rgba(224,123,0,0.15) 0%,transparent 40%)',
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </>
              )}

              {/* Ad copy overlaid directly on the image to act as the 'creative' */}
              <div className="absolute inset-0 p-3 flex flex-col items-start z-10 w-full h-full">
                 <h3 className="text-[14px] font-black text-indigo-950 leading-none mb-5 pointer-events-none" style={{ textShadow: '0 2px 10px rgba(255,255,255,0.8)' }}>
                   GlowNaturals Cream
                 </h3>

                 {/* Claim 1: 100% Organic */}
                 <div className="mb-6 relative inline-block pointer-events-none">
                    <AnimatePresence>
                      {flag1 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 2 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-30"
                        >
                          <span style={{
                            position: 'absolute', top: -16, left: -2,
                            fontSize: 7.5, fontWeight: 800, whiteSpace: 'nowrap',
                            background: '#D4380D', color: 'white',
                            padding: '2px 7px', borderRadius: 20,
                            boxShadow: '0 4px 12px rgba(212,56,13,0.4)',
                          }}>
                            Unsupported
                          </span>
                          <div style={{
                            position: 'absolute', top: -3, left: -3, right: -3, bottom: -3,
                            border: '1.5px dashed rgba(212,56,13,0.9)',
                            background: 'rgba(212,56,13,0.15)',
                            borderRadius: 6
                          }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <p className="text-[10px] font-extrabold text-indigo-900 bg-white/70 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm relative z-20">
                      100% Organic Ingredients
                    </p>
                 </div>

                 {/* Claim 2: 7 days */}
                 <div className="relative inline-block pointer-events-none">
                    <AnimatePresence>
                      {flag2 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 2 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-30"
                        >
                          <span style={{
                            position: 'absolute', top: -16, left: -2,
                            fontSize: 7.5, fontWeight: 800, whiteSpace: 'nowrap',
                            background: '#D46B08', color: 'white',
                            padding: '2px 7px', borderRadius: 20,
                            boxShadow: '0 4px 12px rgba(212,107,8,0.4)',
                          }}>
                            Needs proof
                          </span>
                          <div style={{
                            position: 'absolute', top: -3, left: -3, right: -3, bottom: -3,
                            border: '1.5px dashed rgba(212,107,8,0.9)',
                            background: 'rgba(212,107,8,0.15)',
                            borderRadius: 6
                          }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <p className="text-[9px] font-extrabold text-indigo-900 bg-white/70 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm relative z-20">
                      Visibly fairer skin in 7 days!
                    </p>
                 </div>

                 {/* Decorative Shop Now Button - pushed to bottom via mt-auto */}
                 <div className="mt-auto inline-flex px-3 py-1 bg-[#E07B00] rounded-full shadow-lg z-20">
                    <span className="text-[8px] font-bold text-white uppercase tracking-wider">Shop Now →</span>
                 </div>
              </div>
              
              {/* Decorative badge */}
              <div className="absolute top-2 right-2 w-9 h-9 rounded-full border-[1.5px] border-white bg-[#138808] flex items-center justify-center shadow-lg transform rotate-12 z-10">
                 <span className="text-[5px] font-black text-white text-center leading-tight">100%<br/>NATURAL</span>
              </div>
            </motion.div>

            {/* Issue cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 262 }}>
              {ISSUES.map((issue, i) => (
                <motion.div
                  key={issue.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={showIssues ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                  transition={{ duration: 0.35, delay: i * 0.1 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 12px',
                    ...cardAccent,
                    borderLeftColor: issue.type === 'violation' ? '#DC2626' : '#138808',
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: issue.type === 'violation' ? '#FEE2E2' : '#D1FAE5',
                  }}>
                    {issue.type === 'violation'
                      ? <AlertTriangle style={{ width: 10, height: 10, color: '#DC2626' }} />
                      : <CheckCircle   style={{ width: 10, height: 10, color: '#138808' }} />}
                  </div>
                  <span style={{
                    flex: 1, fontSize: 10, fontWeight: 700, overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    color: issue.type === 'violation' ? '#DC2626' : '#138808',
                  }}>
                    {issue.title}
                  </span>
                  <span style={{ fontSize: 9, color: '#9CA3AF', flexShrink: 0 }}>
                    {issue.type === 'pass' ? '✓ OK' : issue.detail}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ═══ RIGHT ═══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0, width: 178 }}>

            {/* Findings */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              style={{ padding: '14px', ...card }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'rgba(224,123,0,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Shield style={{ width: 14, height: 14, color: '#E07B00' }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#1B2B5E' }}>AI Analysis</div>
                  <div style={{ fontSize: 9, color: '#9CA3AF', lineHeight: 1.4 }}>
                    Detecting claims,<br />visuals &amp; disclosures…
                  </div>
                </div>
              </div>

              {/* Findings rows */}
              {FINDINGS.map((item, i) => {
                const done     = resolved > i;
                const checking = phase >= 2 && !done;
                return (
                  <div key={item.label}
                       style={{
                         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                         padding: '6px 0',
                         borderBottom: i < FINDINGS.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                       }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: '#1B2B5E' }}>{item.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <AnimatePresence mode="wait">
                        {checking ? (
                          <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <Spinner />
                          </motion.div>
                        ) : done ? (
                          <motion.span
                            key="res"
                            initial={{ opacity: 0, x: 6 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                              fontSize: 9, fontWeight: 800,
                              color: item.ok ? '#138808' : '#DC2626',
                            }}
                          >
                            {item.result}
                          </motion.span>
                        ) : (
                          <span key="dash" style={{ fontSize: 9, color: '#D1D5DB' }}>—</span>
                        )}
                      </AnimatePresence>
                      {done && <ChevronRight style={{ width: 10, height: 10, color: '#D1D5DB' }} />}
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Compliance Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={showScore ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
              style={{ padding: '14px', ...card }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, color: '#1B2B5E', marginBottom: 10 }}>
                Compliance score
              </div>

              {/* Score display */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 10 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: '#1B2B5E', lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {showScore ? <CountUp to={SCORE} /> : 0}
                </span>
                <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>/ 100</span>
              </div>

              {/* Horizontal progress bar */}
              <div style={{ height: 7, borderRadius: 99, background: 'rgba(0,0,0,0.07)', marginBottom: 8, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={showScore ? { width: `${SCORE}%` } : { width: '0%' }}
                  transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
                  style={{
                    height: '100%',
                    borderRadius: 99,
                    background: 'linear-gradient(90deg, #138808, #22c55e)',
                    boxShadow: '0 0 8px rgba(19,136,8,0.4)',
                  }}
                />
              </div>

              <AnimatePresence>
                {showScore && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ fontSize: 9, color: '#138808', fontWeight: 600, lineHeight: 1.4 }}
                  >
                    Low risk. Fix the flagged items.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
        </div>{/* End box wrapper */}
      </motion.div>
    </div>
  );
}
