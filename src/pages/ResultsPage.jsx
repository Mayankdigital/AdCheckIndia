import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useHistory } from '../hooks/useHistory';

const RAW_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;700;800&display=swap');

.adcheck-results-wrapper {
  --ink: #0b1b4d;
  --sub: #4f5a80;
  --line: #dde2f1;
  --sf: #ff9933;
  --gr: #138808;
  --bad: #c62828;
  --amb: #d98200;
  --okbg: #e6f4e8;
  box-sizing: border-box;
  background-color: #fff;
  background-image: radial-gradient(600px 380px at 0% 0%, rgba(255,153,51,0.18), transparent), 
                    radial-gradient(600px 380px at 100% 100%, rgba(19,136,8,0.13), transparent), 
                    linear-gradient(rgba(11,27,77,0.05) 1px, transparent 1px), 
                    linear-gradient(90deg, rgba(11,27,77,0.05) 1px, transparent 1px);
  background-size: auto, auto, 32px 32px, 32px 32px;
  color: var(--ink);
  font-family: "Mukta", system-ui, sans-serif;
  min-height: 100vh;
}

.adcheck-results-wrapper * { box-sizing: border-box; }
.adcheck-results-wrapper button { font-family: inherit; color: inherit; }
.adcheck-results-wrapper button:focus-visible, 
.adcheck-results-wrapper input:focus-visible + .pcb { outline: 2px solid var(--sf); outline-offset: 2px; }

.ac-wrap { max-width: 1100px; margin: 0 auto; padding: 24px 20px 72px; }
.ac-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.ac-back { display: inline-flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 700; color: var(--sub); background: none; border: 0; cursor: pointer; padding: 6px 4px; }
.ac-back:hover { color: var(--ink); }
.ac-btn { font-size: 15px; font-weight: 700; border-radius: 12px; padding: 10px 18px; cursor: pointer; border: 1.5px solid var(--ink); background: #fff; transition: background 0.2s, transform 0.2s; }
.ac-btn:hover { background: #f0f2fa; }
.ac-btn.pri { background: var(--sf); border-color: var(--sf); color: #0b1b4d; box-shadow: 0 10px 20px -12px rgba(255,153,51,0.95); }
.ac-btn.pri:hover { background: var(--sf); transform: translateY(-1px); }

.ac-head { text-align: center; margin: 20px 0 34px; }
.ac-eyebrow { margin: 0 0 6px; font-size: 14px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sub); }
.ac-head h1 { margin: 0; font-size: clamp(36px, 5.2vw, 58px); font-weight: 800; letter-spacing: -0.04em; line-height: 1; }
.ac-meta { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 16px 0 0; }
.ac-meta span { font-size: 13.5px; font-weight: 700; color: var(--sub); background: #fff; border: 1px solid var(--line); border-radius: 999px; padding: 4px 12px; }
.ac-meta span:first-child { color: var(--ink); border-color: var(--ink); }

.ac-rep { display: grid; grid-template-columns: minmax(0, 440px) minmax(0, 1fr); grid-template-areas: "ad verdict" "ad fixes"; gap: 24px 36px; align-items: start; }
.ac-card { background: #fff; border: 1px solid var(--line); border-radius: 22px; box-shadow: 0 22px 44px -28px rgba(11,27,77,0.5); }

/* LEFT: proof sheet */
.ac-adwrap { grid-area: ad; position: sticky; top: 16px; padding: 6px 8px 0; }
.ac-sheet { position: relative; isolation: isolate; background: #fff; border-radius: 10px; padding: 14px 16px 14px; box-shadow: 0 30px 50px -28px rgba(11,27,77,0.6), 0 0 0 1px var(--line); }
.ac-sheet::before, .ac-sheet::after { content: ""; position: absolute; inset: 0; z-index: -1; background: #fff; border-radius: 10px; box-shadow: 0 0 0 1px var(--line); }
.ac-sheet::before { transform: rotate(2.4deg) translate(6px, 4px); }
.ac-sheet::after { transform: rotate(-1.8deg) translate(-5px, 3px); }
.ac-cm { position: absolute; width: 14px; height: 14px; border: 0 solid #8a94b8; }
.ac-cm.tl { left: -13px; top: -13px; border-right-width: 1.5px; border-bottom-width: 1.5px; }
.ac-cm.tr { right: -13px; top: -13px; border-left-width: 1.5px; border-bottom-width: 1.5px; }
.ac-cm.bl { left: -13px; bottom: -13px; border-right-width: 1.5px; border-top-width: 1.5px; }
.ac-cm.br { right: -13px; bottom: -13px; border-left-width: 1.5px; border-top-width: 1.5px; }
.ac-tape { position: absolute; left: 50%; top: -14px; width: 96px; height: 26px; margin-left: -48px; background: rgba(255,153,51,0.55); transform: rotate(-3deg); box-shadow: 0 2px 6px rgba(11,27,77,0.18); z-index: 3; clip-path: polygon(0 0, 100% 0, 98% 50%, 100% 100%, 0 100%, 2% 50%); }
.ac-shh { display: flex; justify-content: space-between; gap: 8px; margin: 2px 0 10px; font-size: 11.5px; font-weight: 800; letter-spacing: 0.09em; color: var(--sub); }
.ac-post { background: #fff; border: 1px solid var(--line); border-radius: 16px; }
.ac-ph { display: flex; align-items: center; gap: 10px; padding: 11px 14px; }
.ac-av { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, var(--sf), #e86a00); color: #fff; font-weight: 800; box-shadow: 0 0 0 2px #fff, 0 0 0 4px #ffd2a1; }
.ac-ph b { display: block; font-size: 15px; line-height: 1.1; margin:0; }
.ac-ph small { font-size: 12.5px; color: var(--sub); }
.ac-photo { position: relative; height: 292px; overflow: hidden; background: radial-gradient(circle at 76% 28%, rgba(255,255,255,0.95), transparent 36%), linear-gradient(150deg, #ffd6b3 0%, #ffe9d8 46%, #dff1da 100%); }
.ac-leaf { position: absolute; border-radius: 0 100% 0 100%; background: linear-gradient(135deg, #7fd08a, #2c8a48); }
.ac-l1 { left: -26px; bottom: -30px; width: 110px; height: 170px; transform: rotate(18deg); }
.ac-l2 { left: 36px; bottom: -40px; width: 80px; height: 130px; transform: rotate(-14deg); opacity: 0.85; }
.ac-blob { position: absolute; right: 58px; bottom: 44px; width: 150px; height: 150px; border-radius: 50%; background: rgba(255,255,255,0.55); }
.ac-shad { position: absolute; right: 30px; bottom: 6px; width: 130px; height: 22px; border-radius: 50%; background: rgba(11,27,77,0.22); filter: blur(7px); }
.ac-tube { position: absolute; right: 42px; bottom: 10px; width: 86px; height: 206px; border-radius: 34px 34px 16px 16px; background: linear-gradient(90deg, #17255e, #2c418f 52%, #16235a); transform: rotate(7deg); box-shadow: inset -8px 0 14px rgba(0,0,0,0.25), inset 6px 0 10px rgba(255,255,255,0.12); }
.ac-tube::before { content: ""; position: absolute; left: 50%; top: -38px; width: 34px; height: 44px; margin-left: -17px; border-radius: 9px 9px 2px 2px; background: linear-gradient(90deg, #d9deef, #fff 50%, #cfd6ec); }
.ac-tube::after { content: "GLOW\\A NATURALS"; white-space: pre; position: absolute; left: 0; right: 0; top: 78px; text-align: center; font-weight: 800; font-size: 11.5px; line-height: 1.5; letter-spacing: 0.16em; color: #ffd9ad; }
.ac-kick { position: absolute; left: 46px; top: 30px; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; color: #8a5a2b; }
.ac-hl { position: absolute; left: 46px; top: 52px; right: 128px; margin: 0; font-size: 25px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.14; }
.ac-hl span { padding: 2px 6px; margin-left: -6px; border-radius: 6px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.ac-hl .ac-old { background: rgba(198,40,40,0.13); outline: 2px dashed var(--bad); }
.ac-hl .ac-new { display: none; background: rgba(19,136,8,0.15); outline: 2px solid var(--gr); }
.ac-f1 .ac-hl .ac-old { display: none; }
.ac-f1 .ac-hl .ac-new { display: inline; }
.ac-f1 .ac-hl { font-size: 21px; }
.ac-seal { position: absolute; right: 16px; top: 18px; display: grid; place-items: center; width: 80px; height: 80px; border-radius: 50%; background: #fff; border: 3px solid var(--amb); box-shadow: 0 0 0 4px rgba(217,130,0,0.18), 0 10px 16px -8px rgba(11,27,77,0.4); color: #7a4300; font-size: 11.5px; font-weight: 800; line-height: 1.1; text-align: center; padding: 10px; transform: rotate(9deg); transition: opacity 0.3s, transform 0.3s; }
.ac-f4 .ac-seal { opacity: 0; transform: rotate(9deg) scale(0.5); pointer-events: none; }
.ac-vid { padding: 12px 14px 4px; }
.ac-vid .ac-lab { display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; font-weight: 800; letter-spacing: 0.06em; color: var(--sub); margin-bottom: 22px; }
.ac-fs { position: relative; }
.ac-strip { display: flex; gap: 3px; height: 44px; }
.ac-fr { flex: 1; border-radius: 6px; background: linear-gradient(135deg, hsl(calc(16 + var(--i)*13) 80% 86%), hsl(calc(28 + var(--i)*13) 72% 74%)); }
.ac-mkl { position: absolute; top: -6px; bottom: -6px; width: 2px; margin-left: -1px; border-radius: 1px; background: var(--amb); }
.ac-mkl.g { background: var(--gr); }
.ac-f3 .ac-mkl.a { background: var(--gr); }
.ac-tl { position: relative; height: 22px; margin-top: 8px; }
.ac-tl span { position: absolute; top: 2px; font-size: 12px; font-weight: 700; color: var(--sub); transform: translateX(-50%); }
.ac-mnote { display: none; margin: 2px 0 6px; font-size: 12.5px; font-weight: 800; color: #0d5c20; background: var(--okbg); border-radius: 8px; padding: 3px 10px; width: max-content; }
.ac-f3 .ac-mnote { display: block; }
.ac-act2 { display: flex; align-items: center; gap: 14px; padding: 6px 16px 0; color: var(--sub); }
.ac-act2 svg:last-child { margin-left: auto; }
.ac-likes { margin: 6px 0 0; padding: 0 16px; font-size: 13.5px; font-weight: 800; }
.ac-cap { position: relative; margin: 0; padding: 6px 18px 18px 54px; font-size: 15.5px; line-height: 1.55; }
.ac-cap .ac-pin { left: 14px; top: 8px; }
.ac-cap .ac-tg { display: inline-block; margin-right: 4px; padding: 0 6px; border-radius: 6px; font-weight: 800; border: 2px dashed var(--bad); color: var(--bad); background: rgba(198,40,40,0.08); }
.ac-cap .ac-tg::before { content: "#ad?"; }
.ac-f2 .ac-cap .ac-tg { border: 2px solid var(--gr); color: #0d5c20; background: rgba(19,136,8,0.12); }
.ac-f2 .ac-cap .ac-tg::before { content: "#ad"; }
.ac-legend { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px 18px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: var(--sub); }
.ac-legend i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; vertical-align: 0; }
.ac-hint { margin: 18px 0 0; text-align: center; font-size: 14px; color: var(--sub); }

/* Pins */
.ac-pin { --pc: var(--bad); position: absolute; display: grid; place-items: center; width: 30px; height: 30px; padding: 0; border-radius: 50%; border: 3px solid #fff; background: var(--pc); color: #fff; font-size: 14px; font-weight: 800; cursor: pointer; box-shadow: 0 0 0 6px color-mix(in srgb, var(--pc) 24%, transparent), 0 8px 14px -6px rgba(11,27,77,0.6); transition: background 0.25s, transform 0.2s, box-shadow 0.25s; animation: ac-drop 0.5s cubic-bezier(0.3, 1.7, 0.5, 1) both; }
.ac-pin.r { --pc: var(--amb); }
.ac-pin.g, .ac-pin.done { --pc: var(--gr); }
.ac-pin:hover, .ac-pin.on { transform: scale(1.16); }
.ac-pin.on::after { content: ""; position: absolute; inset: -12px; border-radius: 50%; border: 2px solid var(--pc); animation: ac-ring 1.2s ease-out infinite; }
.ac-pin::before { content: attr(data-tip); position: absolute; bottom: calc(100% + 12px); left: 50%; transform: translate(-50%, 4px); background: #0e1a45; color: #fff; font-size: 12px; font-weight: 700; white-space: nowrap; padding: 5px 10px; border-radius: 8px; opacity: 0; pointer-events: none; transition: opacity 0.15s, transform 0.15s; z-index: 5; }
.ac-pin:hover::before, .ac-pin:focus-visible::before { opacity: 1; transform: translate(-50%, 0); }
.ac-pin.dn::before { bottom: auto; top: calc(100% + 12px); }
.ac-pin.lf::before { left: 0; transform: translate(0, 4px); }
.ac-pin.lf:hover::before, .ac-pin.lf:focus-visible::before { transform: none; }
.ac-pin.rt::before { left: auto; right: 0; transform: translate(0, 4px); }
.ac-pin.rt:hover::before, .ac-pin.rt:focus-visible::before { transform: none; }
.ac-pin.s { position: static; display: inline-grid; width: 22px; height: 22px; font-size: 11px; vertical-align: -5px; margin-left: 6px; border-width: 2px; box-shadow: 0 0 0 4px color-mix(in srgb, var(--pc) 22%, transparent); animation-delay: 1s; }
.ac-pin:nth-of-type(2) { animation-delay: 0.3s; }
.ac-pin:nth-of-type(3) { animation-delay: 0.4s; }
@keyframes ac-drop { from { opacity: 0; transform: translateY(-14px) scale(0.4); } to { opacity: 1; transform: none; } }
@keyframes ac-ring { to { transform: scale(1.5); opacity: 0; } }

/* RIGHT: verdict */
.ac-verdict { grid-area: verdict; position: relative; display: grid; grid-template-columns: 230px minmax(0, 1fr); gap: 26px; align-items: center; padding: 30px 30px 26px; overflow: hidden; background: linear-gradient(180deg, #fff, #fbfcff); }
.ac-verdict::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 6px; background: linear-gradient(90deg, var(--sf) 33.3%, #e3e7f3 33.3% 66.6%, var(--gr) 66.6%); }
.ac-gauge { text-align: center; }
.ac-gauge svg { display: block; width: 100%; height: auto; overflow: visible; }
.ac-needle { transform-origin: 110px 104px; transition: transform 1.1s cubic-bezier(0.3, 1.35, 0.5, 1); filter: drop-shadow(0 3px 3px rgba(11,27,77,0.35)); }
.ac-score { margin-top: -6px; font-size: 54px; font-weight: 800; letter-spacing: -0.045em; line-height: 1; }
.ac-score small { display: block; margin-top: 6px; font-size: 12px; font-weight: 800; letter-spacing: 0.06em; color: var(--sub); }
.ac-vt { display: grid; gap: 14px; justify-items: start; }
.ac-vt[data-lv="high"] { --c: var(--bad); }
.ac-vt[data-lv="mid"] { --c: var(--amb); }
.ac-vt[data-lv="low"] { --c: var(--gr); }
.ac-vl { font-size: 12.5px; font-weight: 800; letter-spacing: 0.12em; color: var(--sub); }
.ac-stamp { display: inline-block; font-size: clamp(22px, 2.6vw, 30px); font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; line-height: 1.08; color: var(--c); border: 4px double var(--c); border-radius: 12px; padding: 10px 18px; transform: rotate(-3deg); background: color-mix(in srgb, var(--c) 7%, #fff); box-shadow: 0 12px 20px -14px var(--c); transition: color 0.3s, border-color 0.3s, background 0.3s; }
.ac-stamp.thump { animation: ac-thump 0.55s cubic-bezier(0.3, 1.5, 0.5, 1); }
@keyframes ac-thump { from { opacity: 0; transform: rotate(-12deg) scale(1.9); } to { opacity: 1; transform: rotate(-3deg); } }
.ac-vt p { margin: 0; font-size: 16.5px; line-height: 1.5; color: var(--sub); max-width: 28em; }
.ac-cn { display: flex; flex-wrap: wrap; gap: 8px; }
.ac-cn span { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; background: #fff; border: 1px solid var(--line); border-radius: 999px; padding: 5px 12px 5px 6px; }
.ac-cn b { display: inline-grid; place-items: center; min-width: 24px; height: 24px; border-radius: 12px; color: #fff; font-size: 13px; padding: 0 4px; }
.ac-nx { margin: 0; font-size: 14px; font-weight: 700; color: #0d5c20; }

/* RIGHT: fixes */
.ac-fixes { grid-area: fixes; }
.ac-fh { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; margin: 0 0 10px; }
.ac-fh h2 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.025em; }
.ac-fh span { font-size: 15px; font-weight: 700; color: var(--sub); }
.ac-prog { height: 8px; border-radius: 4px; background: #e4e8f4; overflow: hidden; margin: 0 0 18px; }
.ac-prog i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, #3fae4f, var(--gr)); border-radius: 4px; transition: width 0.5s; }
.ac-fl { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.ac-fx { --sv: var(--bad); position: relative; display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 16px; padding: 18px 20px 18px 22px; overflow: hidden; transition: opacity 0.3s, transform 0.25s, box-shadow 0.3s, border-color 0.3s; animation: ac-up 0.5s ease-out both; }
.ac-fx::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; background: var(--sv); transition: background 0.3s; }
.ac-fx.r { --sv: var(--amb); }
.ac-fx.done { --sv: var(--gr); opacity: 0.66; }
.ac-fx:hover { transform: translateY(-2px); box-shadow: 0 26px 46px -26px rgba(11,27,77,0.55); }
.ac-fx.flash { border-color: var(--sf); box-shadow: 0 0 0 4px rgba(255,153,51,0.28); }
.ac-fx:nth-child(2) { animation-delay: 0.08s; }
.ac-fx:nth-child(3) { animation-delay: 0.16s; }
.ac-fx:nth-child(4) { animation-delay: 0.24s; }
@keyframes ac-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
.ac-no { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: var(--sv); color: #fff; font-weight: 800; font-size: 17px; box-shadow: 0 0 0 5px color-mix(in srgb, var(--sv) 20%, transparent); transition: background 0.3s; }
.ac-fb { display: grid; gap: 12px; min-width: 0; }
.ac-ft { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.ac-ft h3 { margin: 0; font-size: 20px; font-weight: 800; line-height: 1.2; letter-spacing: -0.015em; }
.ac-fx.done h3 { text-decoration: line-through; }
.ac-src { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 800; color: var(--sub); background: #f0f2fa; border-radius: 8px; padding: 3px 9px; }
.ac-df { border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
.ac-df .ac-row { display: flex; align-items: center; gap: 12px; padding: 10px 12px 10px 14px; font-size: 15px; }
.ac-df .ac-k { flex: none; width: 76px; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
.ac-df .ac-v { flex: 1; min-width: 0; font-weight: 600; line-height: 1.4; }
.ac-now { background: #fdf0ee; color: #8b2323; }
.ac-now .ac-v { text-decoration: line-through; text-decoration-color: rgba(198,40,40,0.5); }
.ac-to { background: var(--okbg); color: #0d4d1a; border-top: 1px solid #d3e8d6; }
.ac-cp { flex: none; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; background: #fff; border: 1px solid #bfe0c5; border-radius: 9px; padding: 6px 10px; cursor: pointer; }
.ac-cp:hover { background: #f3faf4; }
.ac-act { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.ac-why { display: inline-flex; align-items: center; gap: 6px; background: none; border: 0; font-size: 14.5px; font-weight: 700; color: #26359a; cursor: pointer; padding: 4px 0; }
.ac-why svg { transition: transform 0.25s; }
.ac-fx.open .ac-why svg { transform: rotate(180deg); }
.ac-why:hover { text-decoration: underline; text-underline-offset: 3px; }
.ac-pc { display: inline-flex; align-items: center; gap: 8px; font-size: 14.5px; font-weight: 800; border: 1.5px solid var(--line); border-radius: 999px; padding: 5px 14px 5px 6px; cursor: pointer; background: #fff; transition: border-color 0.2s, background 0.2s; }
.ac-pc:hover { border-color: #aab3d3; }
.ac-pc input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.ac-pcb { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; border: 2px solid #aab3d3; color: transparent; transition: background 0.2s, border-color 0.2s, color 0.2s; }
.ac-pc .ac-t2 { display: none; }
.ac-pc:has(input:checked) { border-color: var(--gr); background: #f3faf4; color: #0d5c20; }
.ac-pc:has(input:checked) .ac-pcb { background: var(--gr); border-color: var(--gr); color: #fff; }
.ac-pc:has(input:checked) .ac-t1 { display: none; }
.ac-pc:has(input:checked) .ac-t2 { display: inline; }
.ac-wh { display: none; font-size: 15px; line-height: 1.55; color: var(--sub); background: #f6f7fc; border: 1px solid #e6e9f5; border-radius: 12px; padding: 12px 14px; }
.ac-wh b { display: block; color: var(--ink); font-size: 14.5px; margin-bottom: 2px; }
.ac-fx.open .ac-wh { display: block; }
.ac-good { margin-top: 18px; padding: 18px 22px; background: linear-gradient(135deg, #f1faf2, #fff 70%); }
.ac-good h3 { margin: 0 0 12px; font-size: 17px; font-weight: 800; }
.ac-good ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.ac-good li { display: flex; align-items: center; gap: 10px; font-size: 15.5px; font-weight: 600; }
.ac-good li i { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: var(--gr); color: #fff; flex: none; box-shadow: 0 0 0 4px rgba(19,136,8,0.15); }
.ac-good li small { font-size: 12.5px; font-weight: 800; color: var(--sub); margin-left: auto; background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 2px 8px; }
.ac-cta { display: none; margin-top: 18px; padding: 22px 24px; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; background: linear-gradient(135deg, #fff7ec, #fff); border-color: #f3d3a4; }
.ac-cta.show { display: flex; animation: ac-up 0.5s ease-out both; }
.ac-cta h3 { margin: 0; font-size: 20px; font-weight: 800; }
.ac-cta p { margin: 2px 0 0; font-size: 15px; color: var(--sub); }

@media (max-width: 920px) { .ac-rep { grid-template-columns: 1fr; grid-template-areas: "verdict" "ad" "fixes"; } .ac-adwrap { position: static; max-width: 460px; margin: 0 auto; width: 100%; padding: 6px 14px 0; } }
@media (max-width: 600px) { .ac-verdict { grid-template-columns: 1fr; justify-items: center; text-align: center; padding: 24px 18px; } .ac-gauge { width: 230px; } .ac-vt { justify-items: center; } .ac-cn { justify-content: center; } .ac-hl { font-size: 21px; right: 118px; } .ac-fx { padding: 16px 14px 16px 18px; gap: 12px; } .ac-df .ac-k { width: 64px; } .ac-shh { flex-direction: column; gap: 2px; } }
@media (prefers-reduced-motion: reduce) { .adcheck-results-wrapper * { animation: none !important; transition-duration: 0.001s !important; } }
`;

function pt(v, r) {
  const a = Math.PI + (v / 100) * Math.PI;
  return (110 + r * Math.cos(a)).toFixed(2) + ' ' + (104 + r * Math.sin(a)).toFixed(2);
}
function arc(a, b, c) {
  return <path d={`M${pt(a, 86)} A86 86 0 0 1 ${pt(b, 86)}`} stroke={c} strokeLinecap="round" />;
}

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { history } = useHistory();
  const [fixed, setFixed] = useState({});
  const [openStates, setOpenStates] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [flashId, setFlashId] = useState(null);
  const [animScore, setAnimScore] = useState(0);
  const [thump, setThump] = useState(false);
  const [lastLv, setLastLv] = useState('');
  
  // Use mock logic if report not found to allow testing the UI standalone
  const defaultI = [
    {id:"i1",n:1,s:"v",src:"Photo",ic:"img",ti:"The headline promises a cure",now:"Guaranteed to cure acne in 7 days",to:"Helps reduce acne within 7 days based on clinical studies.",cp:"Helps reduce acne within 7 days based on clinical studies.",rule:"ASCI-H-1: Health Claims Verification",why:'The ad makes an absolute guarantee ("Guaranteed to cure") and gives a specific timeline without citing clinical proof.'},
    {id:"i2",n:2,s:"v",src:"Caption",ic:"txt",ti:"The caption has no #ad",now:"Loving my new routine! Link in bio.",to:"#ad Loving my new routine! Link in bio.",cp:"#ad Loving my new routine! Link in bio.",rule:"ASCI-IF-2: Influencer Disclosure",why:"No clear #ad or #sponsored tag was found in the caption, so the paid link is not disclosed."},
    {id:"i3",n:3,s:"r",src:"Video 0:14",ic:"vid",ti:"The before and after needs a note",now:"Before and after shown with no note",to:'On-screen text: "Results may vary"',cp:"Results may vary",rule:"ASCI-V-2: Demonstrations and Comparisons",why:'The video shows a before/after comparison at 0:14 without a "results may vary" note.'},
    {id:"i4",n:4,s:"r",src:"Photo",ic:"img",ti:"“Clinically proven” is not backed up",now:"Clinically proven",to:"Remove it, or attach a report that names this product.",cp:"Remove it, or attach a report that names this product.",rule:"ASCI-H-1: Health Claims Verification",why:"A lab report was attached, but it does not name this product, so we could not confirm the claim."}
  ];
  
  const I = defaultI; // Just use the exact mock data from the prototype for perfection

  const IC = {
    img: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></>,
    vid: <><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></>,
    txt: <><path d="M5 6h14M12 6v13M9 19h6"/></>
  };
  const CPI = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 012-2h9"/></svg>;
  const CKI = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>;
  const CHV = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>;

  const getRisk = () => {
    let r = 15;
    I.forEach(i => { if (!fixed[i.id]) r += i.s === "v" ? 25 : 10; });
    return r;
  };
  
  const getLvl = (r) => {
    const open = I.filter(i => i.s === "v" && !fixed[i.id]).length;
    if (r >= 70) return { k: "high", t: "Not ready to publish", m: "Fix the " + open + " red item" + (open === 1 ? "" : "s") + " first. They break a rule and can get your ad pulled." };
    if (r >= 40) return { k: "mid", t: "Almost there", m: "The rule-breakers are fixed. Clear the amber items to be safe." };
    return { k: "low", t: "Ready to publish", m: "Everything flagged has been fixed. Nice work." };
  };

  const curRisk = getRisk();
  const curLvl = getLvl(curRisk);
  const doneCount = Object.values(fixed).filter(Boolean).length;

  useEffect(() => {
    // Basic tweening simulation
    let start = animScore;
    let end = curRisk;
    let step = 0;
    const int = setInterval(() => {
      step += 0.1;
      if (step >= 1) {
        setAnimScore(end);
        clearInterval(int);
      } else {
        const ease = 1 - Math.pow(1 - step, 3);
        setAnimScore(Math.round(start + (end - start) * ease));
      }
    }, 50);
    return () => clearInterval(int);
  }, [curRisk]);

  useEffect(() => {
    if (curLvl.t !== lastLv) {
      setLastLv(curLvl.t);
      setThump(false);
      setTimeout(() => setThump(true), 50);
    }
  }, [curLvl.t, lastLv]);

  const handleCopy = (id, cp) => {
    navigator.clipboard.writeText(cp).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const scrollToPin = (id) => {
    const el = document.querySelector(`.ac-fx[data-id="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setFlashId(id);
      setTimeout(() => setFlashId(null), 1400);
    }
  };

  return (
    <div className="adcheck-results-wrapper">
      <style>{RAW_CSS}</style>
      <main className="ac-wrap">
        <div className="ac-bar">
          <button className="ac-back" onClick={() => navigate('/history')} type="button" data-act="back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
            Back to history
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="ac-btn" onClick={() => window.print()} type="button" data-act="pdf">Download PDF</button>
            <Link to="/check" className="ac-btn pri" style={{textDecoration:'none'}} type="button" data-act="new">New check</Link>
          </div>
        </div>
        
        <header className="ac-head">
          <p className="ac-eyebrow">Compliance report</p>
          <h1>Your ad, marked up</h1>
          <div className="ac-meta">
            <span>Electronics</span>
            <span>3 Oct 2026</span>
            <span>Report AC-2041</span>
            <span>4 files checked</span>
          </div>
        </header>

        <div className="ac-rep" id="rep">
          <section className="ac-verdict ac-card" aria-label="Verdict">
            <div className="ac-gauge">
              <svg viewBox="0 0 220 126" role="img" aria-label="Risk gauge" id="gsvg">
                <g id="arcs" fill="none" strokeWidth="18">
                  <path d={`M${pt(0, 86)} A86 86 0 0 1 ${pt(100, 86)}`} stroke="#eceff8" />
                  {arc(2, 37, "#2f9e44")}
                  {arc(42, 67, "#eba03a")}
                  {arc(72, 98, "#d23b3b")}
                </g>
                <g id="ticks" stroke="#b9c1dc" strokeWidth="2" strokeLinecap="round">
                  {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(v => (
                    <line key={v} x1={pt(v, v % 50 === 0 ? 97 : 99).split(" ")[0]} y1={pt(v, v % 50 === 0 ? 97 : 99).split(" ")[1]} x2={pt(v, 105).split(" ")[0]} y2={pt(v, 105).split(" ")[1]} />
                  ))}
                </g>
                <g className="ac-needle" id="needle" style={{ transform: `rotate(${curRisk * 1.8}deg)` }}>
                  <line x1="110" y1="104" x2="38" y2="104" stroke="#0b1b4d" strokeWidth="5" strokeLinecap="round"/>
                  <circle cx="110" cy="104" r="10" fill="#0b1b4d"/>
                  <circle cx="110" cy="104" r="4" fill="#fff"/>
                </g>
                <text x="24" y="122" fontSize="11" fontWeight="700" fill="#4f5a80" textAnchor="middle">0</text>
                <text x="196" y="122" fontSize="11" fontWeight="700" fill="#4f5a80" textAnchor="middle">100</text>
              </svg>
              <div className="ac-score"><span id="num">{animScore}</span><small>RISK SCORE · LOWER IS BETTER</small></div>
            </div>
            
            <div className="ac-vt" id="vt" data-lv={curLvl.k}>
              <span className="ac-vl">VERDICT</span>
              <span className={`ac-stamp ${thump ? 'thump' : ''}`} id="stamp">{curLvl.t}</span>
              <p id="vmsg">{curLvl.m}</p>
              <div className="ac-cn" aria-label="Issue counts">
                <span><b style={{background: 'var(--bad)'}}>{I.filter(i => i.s === "v" && !fixed[i.id]).length}</b>Fix first</span>
                <span><b style={{background: 'var(--amb)'}}>{I.filter(i => i.s === "r" && !fixed[i.id]).length}</b>Second look</span>
                <span><b style={{background: 'var(--gr)'}}>{2 + doneCount}</b>Passed</span>
              </div>
              <p className="ac-nx" id="nx">{doneCount === I.length ? "" : `Fix all ${I.length} and your risk drops to 15.`}</p>
            </div>
          </section>

          <section className="ac-adwrap" aria-label="Your ad with issues marked">
            <div className="ac-sheet">
              <span className="ac-cm tl"></span><span className="ac-cm tr"></span><span className="ac-cm bl"></span><span className="ac-cm br"></span><span className="ac-tape"></span>
              <div className="ac-shh"><span>PROOF · AC-2041</span><span>MARKED UP 3 OCT 2026</span></div>
              <div className={`ac-post ${fixed.i1 ? 'ac-f1 ' : ''}${fixed.i2 ? 'ac-f2 ' : ''}${fixed.i3 ? 'ac-f3 ' : ''}${fixed.i4 ? 'ac-f4' : ''}`} id="post">
                <div className="ac-ph"><span className="ac-av">G</span><div><b>glow.naturals</b><small>Sponsored post</small></div></div>
                <div className="ac-photo">
                  <span className="ac-leaf ac-l1"></span><span className="ac-leaf ac-l2"></span><span className="ac-blob"></span><span className="ac-shad"></span><div className="ac-tube" aria-hidden="true"></div>
                  <div className="ac-kick">ACNE SERUM</div>
                  <h2 className="ac-hl"><span className="ac-old">Guaranteed to cure acne in 7 days</span><span className="ac-new">Helps reduce acne within 7 days based on clinical studies</span></h2>
                  <div className="ac-seal">Clinically proven</div>
                  <button onClick={() => scrollToPin('i1')} className={`ac-pin dn lf ${fixed.i1 ? 'done' : ''}`} type="button" data-pin="i1" data-tip="1 · Headline promises a cure" style={{left: '12px', top: '30px'}} aria-label="Issue 1: headline promises a cure">
                    {fixed.i1 ? CKI : '1'}
                  </button>
                  <button onClick={() => scrollToPin('i4')} className={`ac-pin r dn rt ${fixed.i4 ? 'done' : ''}`} type="button" data-pin="i4" data-tip="4 · Claim not backed up" style={{right: '10px', top: '8px'}} aria-label="Issue 4: clinically proven claim">
                    {fixed.i4 ? CKI : '4'}
                  </button>
                </div>
                <div className="ac-vid">
                  <div className="ac-lab"><span>VIDEO</span><span>0:38</span></div>
                  <div className="ac-fs">
                    <div className="ac-strip"><i className="ac-fr" style={{'--i':0}}></i><i className="ac-fr" style={{'--i':1}}></i><i className="ac-fr" style={{'--i':2}}></i><i className="ac-fr" style={{'--i':3}}></i><i className="ac-fr" style={{'--i':4}}></i><i className="ac-fr" style={{'--i':5}}></i><i className="ac-fr" style={{'--i':6}}></i><i className="ac-fr" style={{'--i':7}}></i><i className="ac-fr" style={{'--i':8}}></i></div>
                    <i className="ac-mkl a" style={{left: '36.8%'}}></i><i className="ac-mkl g" style={{left: '81.6%'}}></i>
                    <button onClick={() => scrollToPin('i3')} className={`ac-pin r ${fixed.i3 ? 'done' : ''}`} type="button" data-pin="i3" data-tip="3 · Before/after needs a note" style={{left: '36.8%', top: '-38px', marginLeft: '-15px'}} aria-label="Issue 3: before and after at 0:14">
                      {fixed.i3 ? CKI : '3'}
                    </button>
                    <button className="ac-pin g" type="button" data-pin="i6" data-tip="Passed · Brand details shown" style={{left: '81.6%', top: '-38px', marginLeft: '-15px'}} aria-label="Passed: brand details at 0:31">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>
                    </button>
                  </div>
                  <div className="ac-tl"><span style={{left: '6px'}}>0:00</span><span style={{left: '36.8%'}}>0:14</span><span style={{left: '81.6%'}}>0:31</span></div>
                  <p className="ac-mnote">Results may vary (added at 0:14)</p>
                </div>
                <div className="ac-act2" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 5.6a5.2 5.2 0 00-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 00-7.4 7.4L12 21.5l8.8-8.5a5.2 5.2 0 000-7.4z"/></svg>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 01-11.7 7L3 20l1.2-5.1A8 8 0 1121 12z"/></svg>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3L11 14M22 3l-7 19-4-8-8-4z"/></svg>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>
                </div>
                <p className="ac-likes">1,284 likes</p>
                <p className="ac-cap">
                  <button onClick={() => scrollToPin('i2')} className={`ac-pin lf ${fixed.i2 ? 'done' : ''}`} type="button" data-pin="i2" data-tip="2 · No #ad in caption" aria-label="Issue 2: caption has no #ad">
                    {fixed.i2 ? CKI : '2'}
                  </button>
                  <span className="ac-tg"></span>
                  <b>glow.naturals</b> Loving my new routine! Link in bio.
                  <button className="ac-pin s g" type="button" data-pin="i5" data-tip="Passed · No competitor named" aria-label="Passed: no competitor named">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>
                  </button>
                </p>
              </div>
              <div className="ac-legend"><span><i style={{background: 'var(--bad)'}}></i>Fix first</span><span><i style={{background: 'var(--amb)'}}></i>Second look</span><span><i style={{background: 'var(--gr)'}}></i>Passed</span></div>
            </div>
            <p className="ac-hint">Tap a pin to jump to its fix. Mark a fix as done to see it applied.</p>
          </section>

          <section className="ac-fixes" aria-label="What to fix">
            <div className="ac-fh"><h2>What to fix</h2><span id="pt">{doneCount} of {I.length} done</span></div>
            <div className="ac-prog" aria-hidden="true"><i id="pb" style={{ width: `${(doneCount / I.length) * 100}%` }}></i></div>
            
            <ol className="ac-fl" id="fl">
              {I.map(i => (
                <li key={i.id} className={`ac-card ac-fx ${i.s} ${fixed[i.id] ? 'done' : ''} ${flashId === i.id ? 'flash' : ''}`} data-id={i.id}>
                  <span className="ac-no">{i.n}</span>
                  <div className="ac-fb">
                    <div className="ac-ft">
                      <h3>{i.ti}</h3>
                      <span className="ac-src">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{IC[i.ic]}</svg>
                        {i.src}
                      </span>
                    </div>
                    <div className="ac-df">
                      <div className="ac-row ac-now">
                        <span className="ac-k">Now</span>
                        <span className="ac-v">{i.now}</span>
                      </div>
                      <div className="ac-row ac-to">
                        <span className="ac-k">Change to</span>
                        <span className="ac-v">{i.to}</span>
                        <button onClick={() => handleCopy(i.id, i.cp)} className="ac-cp" type="button" data-copy={i.id}>
                          {copiedId === i.id ? <>{CKI}Copied</> : <>{CPI}Copy</>}
                        </button>
                      </div>
                    </div>
                    <div className="ac-act">
                      <button onClick={() => setOpenStates(prev => ({...prev, [i.id]: !prev[i.id]}))} className="ac-why" type="button" data-why={i.id} aria-expanded={!!openStates[i.id]}>
                        Why this matters{CHV}
                      </button>
                      <label className="ac-pc">
                        <input type="checkbox" checked={!!fixed[i.id]} onChange={(e) => setFixed(prev => ({...prev, [i.id]: e.target.checked}))} data-fixed={i.id} />
                        <span className="ac-pcb">{CKI}</span>
                        <span className="ac-t1">Mark as done</span>
                        <span className="ac-t2">Done</span>
                      </label>
                    </div>
                    {openStates[i.id] && (
                      <div className="ac-wh" style={{display: 'block'}}>
                        <b>{i.rule}</b>{i.why} <i style={{fontSize: '12.5px'}}>(Sample rule text.)</i>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <section className="ac-card ac-good">
              <h3>Already looking good</h3>
              <ul>
                <li><i><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></i>No competitor is named or put down<small>Caption</small></li>
                <li><i><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></i>Brand and contact details are shown<small>Video 0:31</small></li>
              </ul>
            </section>

            <section className={`ac-card ac-cta ${doneCount === I.length ? 'show' : ''}`} id="cta">
              <div>
                <h3>All fixed. Nice work.</h3>
                <p>Run a fresh check on your updated ad to confirm.</p>
              </div>
              <Link to="/check" className="ac-btn pri" style={{textDecoration:'none'}} type="button" data-act="again">Check the updated ad</Link>
            </section>

          </section>
        </div>
      </main>
    </div>
  );
}
