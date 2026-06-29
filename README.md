# MathX — Mathematics Ecosystem

> **Learn. Explore. Experience Mathematics.**
> Wikipedia + Khan Academy + GeoGebra + Desmos + Brilliant + Wolfram Alpha — unified.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in Firebase, PostgreSQL, OpenAI keys

# 3. Database setup (optional — app works without it)
npx prisma generate
npx prisma db push

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

---

## 📚 What's Inside (85 pages)

| Section | URL | Description |
|---|---|---|
| **Homepage** | `/` | Hero, all branches, 12 feature cards |
| **Learning Center** | `/learn` | 45 topics, School→Advanced |
| **Branch Pages** | `/learn/calculus` | Topics by level + formula sidebar |
| **Topic Pages** | `/learn/calculus/differentiation` | Content + formulas + prev/next |
| **Visualizer** | `/visualize` | 6 interactive D3 tools |
| **Math Lab** | `/lab` | 5 experiments (Monte Carlo, Fractals, Chaos…) |
| **Formula Library** | `/formulas` | 46 LaTeX formulas, searchable |
| **Encyclopedia** | `/encyclopedia` | Topics + Formulas + Branches |
| **Practice** | `/practice` | AI-generated problems |
| **Problem Hub** | `/problems` | 22 curated problems with solutions |
| **Tools** | `/tools` | Calculator, Equation Solver, Matrix Calc |
| **Games** | `/games` | Math Quiz, Nim, Number Guesser, Logic Puzzles |
| **AI Tutor** | `/ai-tutor` | Full chat UI with topic context |
| **Statistics** | `/statistics` | Distribution visualizer + Regression |
| **Applied Math** | `/applied` | Engineering, Finance, AI, Medicine… |
| **Research** | `/research` | Open problems, roadmaps, resources |
| **Foundation** | `/foundation` | About Math, History, Mathematicians |
| **Knowledge Map** | `/map` | Branches × Levels visual grid |
| **Community** | `/community` | Forum, Study Groups, Leaderboard |
| **Dashboard** | `/dashboard` | Progress, Achievements, Heatmap |
| **Sign In** | `/auth/login` | Firebase Auth |
| **Sign Up** | `/auth/signup` | Firebase Auth |

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, Framer Motion |
| Visualization | D3.js, Three.js, React Three Fiber |
| Math Engine | Math.js (evaluate, plot, derivative, integral) |
| Backend | Next.js API Routes |
| Database | PostgreSQL + Prisma ORM |
| Auth | Firebase Auth (Email + Google) |
| Storage | Firebase Storage |
| AI | OpenAI GPT-4o-mini |
| Deploy | Vercel |

---

## 🔑 Environment Variables

```env
# Required for AI features
OPENAI_API_KEY=

# Required for Auth
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Required for progress sync
DATABASE_URL=postgresql://...
```

> **Note:** The app works without these keys — Auth shows a notice, AI features show errors, and progress is saved locally.

---

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)              # login, signup
│   ├── learn/[slug]/[topic]# Dynamic topic pages
│   ├── visualize/          # 6 D3 visualizers
│   ├── lab/                # 5 math experiments
│   ├── statistics/         # Distributions + Regression
│   ├── applied/            # Real-world applications
│   ├── research/           # Open problems + roadmaps
│   ├── community/          # Forum + Study Groups
│   ├── dashboard/          # Progress + Achievements
│   └── api/                # tutor, problems, progress
├── components/
│   ├── visualizer/         # FunctionPlotter, DerivativeAnimator…
│   ├── lab/                # MonteCarlo, FractalGenerator…
│   ├── statistics/         # DistributionVisualizer, Regression
│   ├── dashboard/          # StatsRow, Heatmap, Charts
│   ├── community/          # PostCard, StudyGroupCard
│   ├── games/              # MathQuiz, LogicPuzzles, NumberGame
│   ├── math/               # LatexRenderer, FormulaCard, TopicCard
│   ├── auth/               # AuthForm, AuthGuard
│   └── layout/             # Navbar, Footer
├── lib/
│   ├── data/               # topics, formulas, problems, mathematicians…
│   ├── math/               # plotter.ts (mathjs engine)
│   ├── firebase/           # config, auth
│   ├── ai/                 # tutor.ts (OpenAI)
│   └── utils/              # cn, format, latex
├── hooks/                  # useAuth, useMath, useLocalProgress
└── types/                  # TypeScript interfaces
```

---

## 📊 Statistics

- **85** static pages generated
- **80** source files (TypeScript/TSX)
- **14** math branches
- **45** topics (School → Advanced)
- **46** LaTeX formulas
- **22** curated problems
- **25** achievements
- **12** interactive visualizers/experiments
- **8** community posts + 6 study groups

---

## 🚢 Deploy to Vercel

```bash
# One-click deploy
vercel --prod

# Or connect GitHub repo to Vercel dashboard
# Add environment variables in Vercel settings
```

> Set `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` in Vercel env if Prisma binary fails.
