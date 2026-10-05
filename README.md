# AdCheck India — Frontend

A premium, AI-powered ad compliance frontend for Indian advertisers. Built with React 18, Vite, Tailwind CSS, and Framer Motion.

---

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+ and npm

### Install & Run

```bash
# 1. Clone / open the project directory
cd AdCheckIndia

# 2. Copy env file
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

The app will be running at **http://localhost:5173**

---

## 📦 Build for Production

```bash
npm run build
npm run preview   # preview production build locally
```

---

## 🔌 Switching from Mock API to Real API

The mock API is enabled by default (`VITE_USE_MOCK=true`).

**To switch to your real backend:**

1. Edit `.env`:
```env
VITE_USE_MOCK=false
VITE_API_URL=https://your-api-domain.com
```

2. Your backend must expose a `POST /analyze` endpoint that accepts `multipart/form-data` with the following fields:
   - `video` — (File, optional) video file
   - `photo` — (File, optional) image file
   - `category` — (string, required) e.g. `health`, `finance`, `beauty`, etc.
   - `isInfluencer` — (string `"true"` or `"false"`)
   - `caption` — (string, optional)

3. The endpoint must respond with JSON matching the `AnalysisReport` shape (see below).

---

## 📐 Expected API Response Shape

```json
{
  "id": "uuid-string",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "category": "health",
  "overallRisk": "high",
  "score": 85,
  "isInfluencer": true,
  "summary": {
    "violations": 2,
    "risky": 1,
    "passed": 2
  },
  "issues": [
    {
      "id": "uuid-string",
      "claimText": "Guaranteed to cure acne in 7 days",
      "source": "photo",
      "timestampSeconds": null,
      "verdict": "violation",
      "severity": "high",
      "ruleId": "ASCI-H-1",
      "ruleName": "Health Claims Verification",
      "ruleText": "All health claims must be backed by clinical evidence.",
      "explanation": "The ad makes an absolute guarantee without clinical proof.",
      "suggestedRewrite": "Helps reduce acne within 7 days based on clinical studies."
    }
  ]
}
```

**`verdict` values:** `"violation"` | `"risky"` | `"needs_review"` | `"pass"`  
**`severity` values:** `"low"` | `"medium"` | `"high"`  
**`source` values:** `"video"` | `"photo"` | `"caption"`  
**`overallRisk` values:** `"low"` | `"medium"` | `"high"`

---

## 🎨 Customization Guide

### Colors & Brand

All colors are defined as Tailwind tokens in [`tailwind.config.js`](./tailwind.config.js) and as CSS variables in [`src/index.css`](./src/index.css).

**To change the primary accent (violet → your brand color):**
```js
// tailwind.config.js
colors: {
  primary: {
    500: '#your-color',
    600: '#your-darker-color',
    // ...
  }
}
```

**To change the dark mode base color:**
```css
/* src/index.css */
:root {
  --color-base: #07070d;  /* ← change this */
}
```

### Typography
Fonts are loaded via Google Fonts in [`index.html`](./index.html). Change `Space Grotesk` to any other Google Font for the display font.

```js
// tailwind.config.js
fontFamily: {
  display: ['Your Font', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
}
```

### Animation Intensity
Each page uses `<AnimatedBackground intensity="..." />`. Values:
- `"full"` — all effects (Home hero)
- `"calm"` — toned down (Check, History)
- `"minimal"` — very subtle (Results, 404)

---

## 📋 What to Customize for Production

| Item | Location | Notes |
|------|----------|-------|
| Logo / brand icon | `Navbar.jsx`, `Footer.jsx` | Replace `<Shield>` with your SVG logo |
| Brand colors | `tailwind.config.js`, `index.css` | See above |
| Hero copy | `HeroSection.jsx` | Change headline & subtitle |
| Stat numbers | `StatsStrip.jsx` | Marked with `// PLACEHOLDER` comments |
| FAQ answers | `FaqSection.jsx` | Update with your actual policies |
| "Who it's for" tabs | `WhoItsFor.jsx` | Update for your target segments |
| Category list | `src/lib/constants.js` | Add/remove ad categories |
| Rule text | Mock data only — real rules come from backend | |
| Social links | `Footer.jsx` | Add real URLs |
| Page title/meta | `index.html` | Add full OG meta tags |
| Favicon | `index.html` + `/public/` | Replace `vite.svg` |

---

## 📂 Project Structure

```
src/
  components/
    layout/         # Navbar, Footer, PageWrapper
    background/     # AnimatedBackground, aurora blobs, particles, grid, cursor
    motion/         # Reveal, Stagger, GlowCard, GradientText, Magnetic, CountUp
    common/         # RiskBadge, CategoryChip, ScrollProgressBar, ThemeToggle
    home/           # All Home page sections
    upload/         # Dropzones, CategorySelector, ProcessingScreen
    results/        # SummaryCard, IssueCard, ScoreGauge, FilterTabs, etc.
  pages/            # Route page components (lazy-loaded)
  context/          # ThemeContext, FileStoreContext
  hooks/            # useHistory, useLocalStorage, useMousePosition, useReducedMotion
  lib/              # api.js, mockData.js, types.js, constants.js, utils.js
```

---

## ⚠️ Legal Disclaimer

This tool is a **risk-screening aid** and does **not** constitute legal advice or official ASCI approval. Always consult a qualified legal professional before publishing advertisements.

---

## 🛠 Tech Stack

- **React 18** + Vite
- **Tailwind CSS** with custom design tokens
- **Framer Motion** for animations
- **React Router v6** for routing
- **react-hook-form** + **zod** for validation
- **react-hot-toast** for notifications
- **lucide-react** for icons
