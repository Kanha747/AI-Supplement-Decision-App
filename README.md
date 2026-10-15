# Evidra — AI-Powered Evidence-Based Supplement Decision App

Evidra is an evidence-first web application designed to help consumers evaluate dietary supplements, verify product labels, screen for medical contraindications, and make informed choices grounded in clinical research rather than marketing hype.

---

## 🌟 Key Features

1. **Barcode & Label Scanner (`/scan`)**
   - Live camera barcode scanning using the browser `BarcodeDetector` API with `@zxing/browser` fallback.
   - Image upload support to extract barcodes from photos.
   - Dual-tier lookup: Curated local catalogue + live NIH DSLD (Dietary Supplement Label Database) & Open Food Facts integration.
   - Quick demo UPC codes provided for instant testing.

2. **Personalized Health-Goals Guide & Consultant (`/consultant`)**
   - Deterministic clinical decision tree evaluating user goals, diet, medications, age band, and health conditions.
   - Safety screenings: Enforces age minimums (<18 blocked from unmonitored self-supplementation), drug interaction checks (SSRIs, Warfarin, Levothyroxine, statins, sedatives, etc.), and pregnancy contraindications.
   - Suggests clinical blood tests (e.g. Ferritin, Vitamin D 25-OH, B12) before recommending high-dose supplementation.
   - Optional OpenAI polish for natural, clear, calm patient-facing consultation briefs.

3. **Curated Monograph Library (`/ingredients`)**
   - Scientific evidence grades (**A**, **B**, **C**, **D**, **Insufficient**).
   - Clinical trial citations, mechanism of action, typical studied dosages, upper intake limits, timing, and cautions.

4. **Product Analysis & Clarity Scoring (`/products/[slug]`)**
   - Objective label clarity score.
   - Flags proprietary blends, gummy formats (underdosed/sugar risk), and lack of 3rd-party testing.

5. **Supplement Shelf & Product Comparison (`/shelf`, `/compare`)**
   - Save items to a personalized supplement shelf.
   - Side-by-side comparison of up to 3 products or ingredients.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI & Styling**: React 19, Tailwind CSS 4
- **Database & ORM**: PostgreSQL, Drizzle ORM (with seamless zero-dependency in-memory catalog fallback)
- **Scanner**: `@zxing/browser` + Web `BarcodeDetector` API
- **AI Integration**: OpenAI GPT (`gpt-4o-mini` default) via standard fetch

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (tested on Node 22+)
- npm or pnpm

### Installation

```bash
# Clone or navigate to the directory
cd ai-supplement-decision-app

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Quality Verification

```bash
# TypeScript verification
npm run typecheck

# ESLint verification
npm run lint

# Production build
npm run build

# Start production server locally
npm start
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` or `.env.local` if you wish to configure optional integrations:

| Variable | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | **No** | PostgreSQL connection URI. If omitted, Evidra runs using its built-in in-memory catalog store. |
| `OPENAI_API_KEY` | **No** | OpenAI API key to polish consultation briefs. If omitted, structured briefs are generated deterministically. |
| `OPENAI_MODEL` | **No** | OpenAI model name (default: `gpt-4o-mini`). |
| `PORT` | **No** | Port to listen on in production (default: `3000`). |

---

## 🚢 Deployment Guide

### Option 1: Netlify

Netlify has native support for Next.js 16 App Router. A pre-configured [`netlify.toml`](./netlify.toml) is already included in the repository.

#### Via Netlify Web Dashboard (Recommended)
1. Push this repository to GitHub or GitLab.
2. Log in to [app.netlify.com](https://app.netlify.com).
3. Click **Add new site** > **Import an existing project** and select your GitHub repository.
4. Netlify will automatically detect:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. (Optional) In **Site configuration** > **Environment variables**, add `DATABASE_URL` and `OPENAI_API_KEY`.
6. Click **Deploy site**.

#### Via Netlify CLI
Run the following in your local terminal:
```bash
npx netlify deploy --build
```
For production release:
```bash
npx netlify deploy --prod --build
```

---

### Option 2: Vercel

Next.js is natively optimized for Vercel.

#### Via Vercel Web Dashboard (1-click from GitHub)
1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com/new), click **Add New Project** and select this repository.
3. (Optional) Under **Environment Variables**, add `DATABASE_URL` (e.g. Neon, Supabase) and `OPENAI_API_KEY`.
4. Click **Deploy**.

#### Via Vercel CLI
```bash
npx vercel
```
Follow the interactive CLI prompts to link and deploy to preview or production (`--prod`).

---

### Option 2: Railway or Render

1. Connect your GitHub repository to [Railway](https://railway.app) or [Render](https://render.com).
2. Configure the build settings:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
3. If provisioning a PostgreSQL database service, attach its `DATABASE_URL` as an environment variable.

---

### Option 3: Docker Self-Hosting

A multi-stage `Dockerfile` and `.dockerignore` are included in the repository.

```bash
# Build the Docker image
docker build -t evidra-app .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e OPENAI_API_KEY="sk-..." \
  evidra-app
```
Then visit `http://localhost:3000`.

---

## 🧪 Resolved Issues During Code Review

1. **Implicit Any Types in Dynamic Pages**: Fixed implicit parameter types in `src/app/consultant/page.tsx` and `src/lib/seed.ts` to strictly satisfy TypeScript build checks.
2. **ESLint Error Boundaries Violation**: Refactored `src/app/labels/[id]/page.tsx` where JSX elements were constructed within `try/catch` blocks, complying with React strict error boundary conventions.
3. **Scanner Cleanup Reference Warning**: Resolved stale `videoRef.current` closure in `src/components/scanner.tsx` `useEffect` cleanup.
4. **Dual-Mode Database Architecture**: Enabled the database layer to function both with real PostgreSQL instances via Drizzle ORM and as an in-memory catalog for standalone zero-configuration deployments.
