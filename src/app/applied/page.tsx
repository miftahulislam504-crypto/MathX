'use client'
import Link from 'next/link'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { Building2, LineChart, Bot, Laptop, Dna, Globe, FlaskConical, Sigma, BarChart3, Lightbulb, type LucideIcon } from 'lucide-react'

const AREAS = [
  {
    icon: Building2, title: { en: 'Engineering Mathematics', bn: 'প্রকৌশল গণিত' },
    color: 'border-violet-500/20 bg-violet-500/5',
    tag: 'text-violet-400',
    items: [
      { name:{ en:'Structural Analysis', bn:'কাঠামোগত বিশ্লেষণ' }, math:{ en:'Stiffness matrices, eigenvalue problems, differential equations', bn:'স্টিফনেস ম্যাট্রিক্স, আইগেনভ্যালু সমস্যা, ডিফারেনশিয়াল সমীকরণ' } },
      { name:{ en:'Signal Processing', bn:'সিগন্যাল প্রসেসিং' },   math:{ en:'Fourier transforms, convolution, Laplace transforms', bn:'ফুরিয়ার রূপান্তর, কনভোলিউশন, ল্যাপ্লাস রূপান্তর' } },
      { name:{ en:'Control Systems', bn:'নিয়ন্ত্রণ ব্যবস্থা' },     math:{ en:'Transfer functions, Bode plots, stability analysis', bn:'ট্রান্সফার ফাংশন, বোড প্লট, স্থিতিশীলতা বিশ্লেষণ' } },
      { name:{ en:'Fluid Dynamics', bn:'তরল গতিবিদ্যা' },      math:{ en:'Navier-Stokes equations, partial differential equations', bn:'নেভিয়ার-স্টোকস সমীকরণ, আংশিক ডিফারেনশিয়াল সমীকরণ' } },
    ],
    example: {
      title: { en: 'Bridge Cable Tension', bn: 'সেতুর কেবল টান' },
      problem: { en: 'A suspension bridge cable hangs in a parabolic shape y = x²/2000. Find the arc length from x = -100 to 100.', bn: 'একটি ঝুলন্ত সেতুর কেবল y = x²/২০০০ প্যারাবোলিক আকারে ঝুলছে। x = -১০০ থেকে ১০০ পর্যন্ত আর্ক দৈর্ঘ্য বের করুন।' },
      solution: { en: 'Arc length = ∫√(1 + (dy/dx)²) dx. Here dy/dx = x/1000. L = ∫₋₁₀₀¹⁰⁰ √(1 + x²/10⁶) dx ≈ 200.003 m', bn: 'আর্ক দৈর্ঘ্য = ∫√(1 + (dy/dx)²) dx। এখানে dy/dx = x/১০০০। L = ∫₋₁₀₀¹⁰⁰ √(1 + x²/10⁶) dx ≈ ২০০.০০৩ মিটার' },
      insight: { en: 'Only 3mm longer than the horizontal span — cables are remarkably efficient!', bn: 'অনুভূমিক স্প্যান থেকে মাত্র ৩মিমি বেশি লম্বা — কেবল অত্যন্ত দক্ষ!' }
    }
  },
  {
    icon: LineChart, title: { en: 'Financial Mathematics', bn: 'আর্থিক গণিত' },
    color: 'border-cyan-500/20 bg-cyan-500/5',
    tag: 'text-cyan-400',
    items: [
      { name:{ en:'Compound Interest', bn:'চক্রবৃদ্ধি সুদ' },   math:{ en:'A = P(1 + r/n)^(nt), continuous: A = Pe^(rt)', bn:'A = P(1 + r/n)^(nt), অবিচ্ছিন্ন: A = Pe^(rt)' } },
      { name:{ en:'Option Pricing', bn:'অপশন প্রাইসিং' },      math:{ en:'Black-Scholes PDE: ∂V/∂t + ½σ²S²∂²V/∂S² + rS∂V/∂S − rV = 0', bn:'ব্ল্যাক-শোলস PDE: ∂V/∂t + ½σ²S²∂²V/∂S² + rS∂V/∂S − rV = 0' } },
      { name:{ en:'Portfolio Theory', bn:'পোর্টফোলিও তত্ত্ব' },    math:{ en:'Markowitz optimization, efficient frontier, CAPM', bn:'মার্কোভিৎস অপ্টিমাইজেশন, এফিশিয়েন্ট ফ্রন্টিয়ার, CAPM' } },
      { name:{ en:'Risk Analysis', bn:'ঝুঁকি বিশ্লেষণ' },       math:{ en:'Value at Risk (VaR), Monte Carlo simulation, normal distribution', bn:'ভ্যালু অ্যাট রিস্ক (VaR), মন্টে কার্লো সিমুলেশন, স্বাভাবিক বণ্টন' } },
    ],
    example: {
      title: { en: 'Rule of 72', bn: '৭২-এর নিয়ম' },
      problem: { en: 'How long to double money at 6% annual interest?', bn: '৬% বার্ষিক সুদে টাকা দ্বিগুণ হতে কত সময় লাগবে?' },
      solution: { en: 'Exact: n = ln(2)/ln(1.06) ≈ 11.89 years. Rule of 72: 72/6 = 12 years.', bn: 'সঠিক: n = ln(2)/ln(1.06) ≈ ১১.৮৯ বছর। ৭২-এর নিয়ম: ৭২/৬ = ১২ বছর।' },
      insight: { en: 'The Rule of 72 works because ln(2) ≈ 0.693 ≈ 0.72/1.04 for typical interest rates.', bn: '৭২-এর নিয়ম কাজ করে কারণ ln(2) ≈ ০.৬৯৩ ≈ ০.৭২/১.০৪ সাধারণ সুদের হারের জন্য।' }
    }
  },
  {
    icon: Bot, title: { en: 'AI & Machine Learning Mathematics', bn: 'এআই ও মেশিন লার্নিং গণিত' },
    color: 'border-amber-500/20 bg-amber-500/5',
    tag: 'text-amber-400',
    items: [
      { name:{ en:'Gradient Descent', bn:'গ্রেডিয়েন্ট ডিসেন্ট' },    math:{ en:'θ ← θ − α∇J(θ). Minimizing loss via calculus.', bn:'θ ← θ − α∇J(θ)। ক্যালকুলাসের মাধ্যমে ক্ষতি কমানো।' } },
      { name:{ en:'Neural Networks', bn:'নিউরাল নেটওয়ার্ক' },     math:{ en:'Matrix multiplications, activation functions, backpropagation chain rule', bn:'ম্যাট্রিক্স গুণন, অ্যাক্টিভেশন ফাংশন, ব্যাকপ্রোপাগেশন চেইন নিয়ম' } },
      { name:{ en:'Principal Component Analysis', bn:'প্রিন্সিপাল কম্পোনেন্ট অ্যানালাইসিস' }, math:{ en:'Eigendecomposition of covariance matrix, variance maximization', bn:'কোভ্যারিয়েন্স ম্যাট্রিক্সের আইগেনডিকম্পোজিশন, ভ্যারিয়েন্স সর্বাধিকীকরণ' } },
      { name:{ en:'Bayesian Inference', bn:'বেইজিয়ান অনুমান' },  math:{ en:'P(H|D) = P(D|H)P(H)/P(D) — updating beliefs with data', bn:'P(H|D) = P(D|H)P(H)/P(D) — ডেটা দিয়ে বিশ্বাস আপডেট করা' } },
    ],
    example: {
      title: { en: 'Gradient Descent Step', bn: 'গ্রেডিয়েন্ট ডিসেন্ট ধাপ' },
      problem: { en: 'Minimize f(x) = x² − 4x + 5 using gradient descent with α = 0.3, starting at x = 0.', bn: 'গ্রেডিয়েন্ট ডিসেন্ট ব্যবহার করে f(x) = x² − 4x + 5 সর্বনিম্ন করুন, α = ০.৩, x = ০ থেকে শুরু করে।' },
      solution: { en: "f'(x) = 2x − 4. Step 1: x₁ = 0 − 0.3(−4) = 1.2. Step 2: x₂ = 1.2 − 0.3(−1.6) = 1.68. Converges to x=2 (minimum).", bn: "f'(x) = 2x − 4। ধাপ ১: x₁ = 0 − 0.3(−4) = 1.2। ধাপ ২: x₂ = 1.2 − 0.3(−1.6) = 1.68। x=2-এ অভিসৃত হয় (সর্বনিম্ন)।" },
      insight: { en: 'Learning rate α must be chosen carefully — too large oscillates, too small is slow.', bn: 'লার্নিং রেট α সাবধানে নির্বাচন করতে হবে — খুব বড় হলে দোলন হয়, খুব ছোট হলে ধীর হয়।' }
    }
  },
  {
    icon: Laptop, title: { en: 'Computer Science Mathematics', bn: 'কম্পিউটার বিজ্ঞান গণিত' },
    color: 'border-emerald-500/20 bg-emerald-500/5',
    tag: 'text-emerald-400',
    items: [
      { name:{ en:'Algorithm Complexity', bn:'অ্যালগরিদম জটিলতা' }, math:{ en:'Big-O notation, recurrence relations, Master Theorem', bn:'বিগ-O নোটেশন, রিকারেন্স রিলেশন, মাস্টার উপপাদ্য' } },
      { name:{ en:'Cryptography', bn:'ক্রিপ্টোগ্রাফি' },        math:{ en:"Modular arithmetic, RSA: c = m^e (mod n), Fermat's little theorem", bn:'মডুলার পাটিগণিত, RSA: c = m^e (mod n), ফার্মার ছোট উপপাদ্য' } },
      { name:{ en:'Graph Algorithms', bn:'গ্রাফ অ্যালগরিদম' },    math:{ en:'Dijkstra (greedy), Floyd-Warshall (dynamic programming)', bn:'ডাইকস্ট্রা (গ্রিডি), ফ্লয়েড-ওয়ারশাল (ডায়নামিক প্রোগ্রামিং)' } },
      { name:{ en:'Information Theory', bn:'তথ্য তত্ত্ব' },     math:{ en:'Shannon entropy: H = −Σ p(x) log₂ p(x), compression bounds', bn:'শ্যানন এনট্রপি: H = −Σ p(x) log₂ p(x), সংকোচন সীমা' } },
    ],
    example: {
      title: { en: 'RSA in One Step', bn: 'এক ধাপে RSA' },
      problem: { en: 'Encrypt m=7 with public key (e=3, n=33). Decrypt with d=7.', bn: 'পাবলিক কী (e=৩, n=৩৩) দিয়ে m=৭ এনক্রিপ্ট করুন। d=৭ দিয়ে ডিক্রিপ্ট করুন।' },
      solution: { en: 'Encrypt: c = 7³ mod 33 = 343 mod 33 = 13. Decrypt: m = 13⁷ mod 33 = 7.', bn: 'এনক্রিপ্ট: c = 7³ mod 33 = 343 mod 33 = 13। ডিক্রিপ্ট: m = 13⁷ mod 33 = 7।' },
      insight: { en: 'RSA security relies on the hardness of factoring large n = p×q. No efficient algorithm is known.', bn: 'RSA নিরাপত্তা নির্ভর করে বড় n = p×q উৎপাদকে বিশ্লেষণের কঠিনতার উপর। কোনো দক্ষ অ্যালগরিদম জানা নেই।' }
    }
  },
  {
    icon: Dna, title: { en: 'Mathematics in Medicine & Biology', bn: 'চিকিৎসা ও জীববিজ্ঞানে গণিত' },
    color: 'border-rose-500/20 bg-rose-500/5',
    tag: 'text-rose-400',
    items: [
      { name:{ en:'Epidemiology (SIR)', bn:'মহামারীবিদ্যা (SIR)' },   math:{ en:'dS/dt=−βSI, dI/dt=βSI−γI, dR/dt=γI. Basic reproduction R₀=β/γ', bn:'dS/dt=−βSI, dI/dt=βSI−γI, dR/dt=γI। মৌলিক প্রজনন R₀=β/γ' } },
      { name:{ en:'Medical Imaging', bn:'মেডিকেল ইমেজিং' },     math:{ en:'Fourier transforms in MRI, Radon transform in CT scans', bn:'MRI-তে ফুরিয়ার রূপান্তর, CT স্ক্যানে র‍্যাডন রূপান্তর' } },
      { name:{ en:'Population Genetics', bn:'জনসংখ্যা জিনতত্ত্ব' }, math:{ en:'Hardy-Weinberg: p²+2pq+q²=1. Gene frequency equilibrium.', bn:'হার্ডি-ওয়েইনবার্গ: p²+2pq+q²=1। জিন ফ্রিকোয়েন্সি ভারসাম্য।' } },
      { name:{ en:'Drug Pharmacokinetics', bn:'ওষুধ ফার্মাকোকাইনেটিক্স' },math:{ en:'C(t) = C₀e^(−kt). Half-life: t₁/₂ = ln2/k', bn:'C(t) = C₀e^(−kt)। অর্ধজীবন: t₁/₂ = ln2/k' } },
    ],
    example: {
      title: { en: 'COVID-19 R₀', bn: 'কোভিড-১৯ R₀' },
      problem: { en: 'If each infected person infects 2.5 others (R₀=2.5), what % must be immune to stop spread?', bn: 'যদি প্রতিটি সংক্রমিত ব্যক্তি ২.৫ জনকে সংক্রমিত করে (R₀=২.৫), তাহলে বিস্তার বন্ধ করতে কত % প্রতিরোধী হতে হবে?' },
      solution: { en: 'Herd immunity threshold = 1 − 1/R₀ = 1 − 1/2.5 = 60%. At least 60% immune stops exponential spread.', bn: 'হার্ড ইমিউনিটি সীমা = 1 − 1/R₀ = 1 − 1/2.5 = ৬০%। কমপক্ষে ৬০% প্রতিরোধী হলে দ্রুতগতির বিস্তার বন্ধ হয়।' },
      insight: { en: 'R₀ > 1 → epidemic grows. R₀ < 1 → dies out. Vaccination shifts effective R₀ below 1.', bn: 'R₀ > 1 → মহামারী বাড়ে। R₀ < 1 → শেষ হয়ে যায়। টিকা কার্যকর R₀-কে ১-এর নিচে নামিয়ে আনে।' }
    }
  },
  {
    icon: Globe, title: { en: 'Mathematics in Nature', bn: 'প্রকৃতিতে গণিত' },
    color: 'border-sky-500/20 bg-sky-500/5',
    tag: 'text-sky-400',
    items: [
      { name:{ en:'Fibonacci & Golden Ratio', bn:'ফিবোনাচ্চি ও সোনালী অনুপাত' }, math:{ en:'φ = (1+√5)/2 ≈ 1.618. Limit of Fₙ₊₁/Fₙ. Appears in spirals.', bn:'φ = (1+√5)/2 ≈ ১.৬১৮। Fₙ₊₁/Fₙ-এর সীমা। সর্পিলে দেখা যায়।' } },
      { name:{ en:'Fractals in Nature', bn:'প্রকৃতিতে ফ্র্যাক্টাল' },       math:{ en:'Self-similarity, fractal dimension d = log(N)/log(s)', bn:'স্ব-সাদৃশ্য, ফ্র্যাক্টাল মাত্রা d = log(N)/log(s)' } },
      { name:{ en:'Symmetry Groups', bn:'প্রতিসাম্য গ্রুপ' },          math:{ en:'Wallpaper groups (17 types), crystal structures, molecular symmetry', bn:'ওয়ালপেপার গ্রুপ (১৭ ধরন), স্ফটিক গঠন, আণবিক প্রতিসাম্য' } },
      { name:{ en:'Optimal Packing', bn:'সর্বোত্তম প্যাকিং' },          math:{ en:'Honeycomb conjecture (Hales 1999): hexagons minimize perimeter', bn:'হানিকম্ব অনুকল্প (হেলস ১৯৯৯): ষড়ভুজ পরিসীমা সর্বনিম্ন করে' } },
    ],
    example: {
      title: { en: 'Sunflower Spirals', bn: 'সূর্যমুখী সর্পিল' },
      problem: { en: 'A sunflower has 34 spirals clockwise and 55 counterclockwise. Why?', bn: 'একটি সূর্যমুখীতে ৩৪টি সর্পিল ঘড়ির কাঁটার দিকে এবং ৫৫টি বিপরীত দিকে আছে। কেন?' },
      solution: { en: '34 and 55 are consecutive Fibonacci numbers. The golden angle (137.5° = 360°/φ²) between seeds creates this pattern.', bn: '৩৪ এবং ৫৫ পরপর ফিবোনাচ্চি সংখ্যা। বীজের মধ্যে সোনালী কোণ (১৩৭.৫° = ৩৬০°/φ²) এই প্যাটার্ন তৈরি করে।' },
      insight: { en: 'Fibonacci numbers minimize seed crowding — evolution discovered the golden ratio.', bn: 'ফিবোনাচ্চি সংখ্যা বীজের ভিড় কমায় — বিবর্তন সোনালী অনুপাত আবিষ্কার করেছে।' }
    }
  },
]

export default function AppliedPage() {
  const { tt } = useLanguage()

  const RELATED_TOOLS: { icon: LucideIcon; label: string; href: string; desc: string }[] = [
    { icon:FlaskConical, label:tt(t.lab.title),        href:'/lab',        desc:tt(t.applied.mathLabDesc) },
    { icon:Sigma,  label:tt(t.visualizer.title), href:'/visualize',  desc:tt(t.applied.visualizerDesc) },
    { icon:BarChart3, label:tt(t.statistics.title), href:'/statistics', desc:tt(t.applied.statisticsDesc) },
  ]

  return (
    <>

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="mb-10">
            <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.applied.tag)}</p>
            <h1 className="text-4xl font-bold text-white mb-3">{tt(t.applied.title)}</h1>
            <p className="text-white/40">
              {tt(t.applied.subtitle)}
            </p>
          </div>

          <div className="space-y-8">
            {AREAS.map((area, ai) => (
              <div key={ai} className={`rounded-2xl border ${area.color} overflow-hidden`}>
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <area.icon className="w-7 h-7" />
                    <h2 className={`text-xl font-bold ${area.tag}`}>{tt(area.title)}</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {area.items.map((item, ii) => (
                      <div key={ii} className="rounded-xl border border-white/6 bg-black/20 p-3">
                        <p className="text-sm font-semibold text-white/80 mb-1">{tt(item.name)}</p>
                        <p className="text-xs text-white/35 font-mono leading-relaxed">{tt(item.math)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Worked Example */}
                <div className="p-6">
                  <p className={`text-xs uppercase tracking-wider font-mono mb-3 ${area.tag} opacity-60`}>
                    {tt(t.applied.workedExample)}
                  </p>
                  <h3 className="text-sm font-bold text-white/80 mb-2">{tt(area.example.title)}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-white/30 uppercase mb-1">{tt(t.applied.problem)}</p>
                      <p className="text-sm text-white/60 leading-relaxed">{tt(area.example.problem)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase mb-1">{tt(t.applied.solution)}</p>
                      <p className="text-sm text-white/60 font-mono leading-relaxed">{tt(area.example.solution)}</p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg border border-white/8 bg-white/[0.02] px-4 py-2.5">
                    <p className="text-xs text-white/35 italic flex items-start gap-1.5"><Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {tt(area.example.insight)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Links to related tools */}
          <div className="mt-12 rounded-2xl border border-white/5 bg-white/[0.01] p-8">
            <h2 className="text-lg font-bold text-white mb-4">{tt(t.applied.exploreTools)}</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {RELATED_TOOLS.map(l => (
                <Link key={l.href} href={l.href}
                  className="rounded-xl border border-white/8 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04] p-4 transition-all group">
                  <l.icon className="w-6 h-6 mb-2" />
                  <p className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">{l.label}</p>
                  <p className="text-xs text-white/30 mt-1">{l.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

    </>
  )
}
