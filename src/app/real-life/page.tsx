'use client'
import { lazy, Suspense } from 'react'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { ChefHat, ShoppingCart, Gamepad2, Plane, Lightbulb, Calculator } from 'lucide-react'

const EverydayMoneyCalculator = lazy(() =>
  import('@/components/real-life/EverydayMoneyCalculator').then((m) => ({ default: m.EverydayMoneyCalculator })))

const AREAS = [
  {
    icon: ChefHat, title: { en: 'Cooking & Recipes', bn: 'রান্না ও রেসিপি' },
    color: 'border-amber-500/20 bg-amber-500/5',
    tag: 'text-amber-400',
    items: [
      { name: { en: 'Scaling a Recipe', bn: 'রেসিপি স্কেল করা' }, math: { en: 'Ratios: new amount = old amount × (new servings / old servings)', bn: 'অনুপাত: নতুন পরিমাণ = পুরনো পরিমাণ × (নতুন সার্ভিং / পুরনো সার্ভিং)' } },
      { name: { en: 'Unit Conversion', bn: 'একক রূপান্তর' }, math: { en: '1 cup = 236.6 ml, 1 tbsp = 3 tsp — dimensional analysis in every kitchen', bn: '১ কাপ = ২৩৬.৬ মিলি, ১ টেবিল চামচ = ৩ চা চামচ — প্রতিটি রান্নাঘরে dimensional analysis' } },
      { name: { en: 'Baking Ratios', bn: 'বেকিং অনুপাত' }, math: { en: "Baker's percentage: every ingredient as % of flour weight", bn: 'বেকারের শতাংশ: প্রতিটি উপাদান ময়দার ওজনের % হিসেবে' } },
      { name: { en: 'Temperature Conversion', bn: 'তাপমাত্রা রূপান্তর' }, math: { en: '°F = °C × 9/5 + 32 — a linear function you use every time you bake', bn: '°F = °C × ৯/৫ + ৩২ — বেক করার প্রতিবার ব্যবহৃত একটি রৈখিক ফাংশন' } },
    ],
    example: {
      title: { en: 'Doubling a Recipe', bn: 'রেসিপি দ্বিগুণ করা' },
      problem: { en: 'A cake recipe serving 6 needs ¾ cup sugar. How much sugar for 10 people?', bn: '৬ জনের কেক রেসিপিতে ¾ কাপ চিনি লাগে। ১০ জনের জন্য কত চিনি লাগবে?' },
      solution: { en: 'New amount = ¾ × (10/6) = ¾ × 1.667 = 1.25 cups', bn: 'নতুন পরিমাণ = ¾ × (১০/৬) = ¾ × ১.৬৬৭ = ১.২৫ কাপ' },
      insight: { en: 'This is the same scaling logic used in engineering blueprints and chemistry — proportional reasoning shows up everywhere.', bn: 'এটি ইঞ্জিনিয়ারিং ব্লুপ্রিন্ট এবং রসায়নে ব্যবহৃত একই স্কেলিং যুক্তি — আনুপাতিক যুক্তি সর্বত্র দেখা যায়।' }
    }
  },
  {
    icon: ShoppingCart, title: { en: 'Smart Shopping & Money', bn: 'স্মার্ট কেনাকাটা ও অর্থ' },
    color: 'border-emerald-500/20 bg-emerald-500/5',
    tag: 'text-emerald-400',
    items: [
      { name: { en: 'Successive Discounts', bn: 'ধারাবাহিক ছাড়' }, math: { en: 'Two discounts multiply, not add: 20% + 10% off ≠ 30% off, it\u2019s 28%', bn: 'দুটো ছাড় গুণ হয়, যোগ না: ২০% + ১০% ছাড় ≠ ৩০% ছাড়, এটি ২৮%' } },
      { name: { en: 'Unit Price', bn: 'একক মূল্য' }, math: { en: 'price ÷ quantity — the only fair way to compare different pack sizes', bn: 'মূল্য ÷ পরিমাণ — বিভিন্ন প্যাক সাইজ তুলনা করার একমাত্র সঠিক উপায়' } },
      { name: { en: 'Loan EMI', bn: 'ঋণ EMI' }, math: { en: 'EMI = Pr(1+r)ⁿ / ((1+r)ⁿ−1) — the formula behind every installment plan', bn: 'EMI = Pr(1+r)ⁿ / ((1+r)ⁿ−1) — প্রতিটি কিস্তি পরিকল্পনার পেছনের সূত্র' } },
      { name: { en: 'Sales Tax & Tips', bn: 'বিক্রয় কর ও টিপ' }, math: { en: 'Percentage of a percentage — compounding small charges on a bill', bn: 'শতাংশের শতাংশ — বিলের ছোট চার্জ যোগ হওয়া' } },
    ],
    example: {
      title: { en: 'The Discount Stacking Trap', bn: 'ছাড় স্তুপীকরণ ফাঁদ' },
      problem: { en: 'A store advertises "20% off, plus an extra 10% off at checkout." What\u2019s the real discount on a 1000 item?', bn: 'একটি দোকান "২০% ছাড়, চেকআউটে অতিরিক্ত ১০% ছাড়" বিজ্ঞাপন দেয়। ১০০০ টাকার জিনিসে আসল ছাড় কত?' },
      solution: { en: '1000 × 0.8 × 0.9 = 720. Final price is 720, an effective discount of 28% — not 30%.', bn: '১০০০ × ০.৮ × ০.৯ = ৭২০। চূড়ান্ত মূল্য ৭২০, কার্যকর ছাড় ২৮% — ৩০% না।' },
      insight: { en: 'Retailers advertise stacked percentages because "30% off" sounds better than the true 28% — always compute, don\u2019t just add.', bn: 'বিক্রেতারা স্তুপীকৃত শতাংশ বিজ্ঞাপন দেয় কারণ "৩০% ছাড়" আসল ২৮%-এর চেয়ে ভালো শোনায় — সবসময় হিসাব করুন, শুধু যোগ করবেন না।' }
    }
  },
  {
    icon: Gamepad2, title: { en: 'Sports & Games', bn: 'খেলাধুলা ও গেমস' },
    color: 'border-violet-500/20 bg-violet-500/5',
    tag: 'text-violet-400',
    items: [
      { name: { en: 'Batting / Shooting Average', bn: 'ব্যাটিং / শুটিং গড়' }, math: { en: 'A simple ratio — successes ÷ attempts — that ranks every athlete', bn: 'একটি সরল অনুপাত — সাফল্য ÷ প্রচেষ্টা — যা প্রতিটি খেলোয়াড়কে র‍্যাঙ্ক করে' } },
      { name: { en: 'Betting Odds', bn: 'বাজি অডস' }, math: { en: 'Odds of 3:1 mean P(win) = 1/(3+1) = 25% — converting odds to probability', bn: '৩:১ অডস মানে P(জয়) = ১/(৩+১) = ২৫% — অডসকে সম্ভাবনায় রূপান্তর' } },
      { name: { en: 'Elo Rating', bn: 'এলো রেটিং' }, math: { en: 'Expected score = 1/(1+10^((Rb−Ra)/400)) — the math behind chess and esports rankings', bn: 'প্রত্যাশিত স্কোর = 1/(1+10^((Rb−Ra)/400)) — দাবা ও esports র‍্যাংকিং এর পেছনের গণিত' } },
      { name: { en: 'Tournament Brackets', bn: 'টুর্নামেন্ট ব্র্যাকেট' }, math: { en: 'log₂(n) rounds needed for n players in a single-elimination bracket', bn: 'একক-বিদায় ব্র্যাকেটে n খেলোয়াড়ের জন্য log₂(n) রাউন্ড প্রয়োজন' } },
    ],
    example: {
      title: { en: 'Reading Betting Odds', bn: 'বাজি অডস পড়া' },
      problem: { en: 'A bookmaker offers 4:1 odds against a team winning. What win probability does that imply?', bn: 'একটি বুকমেকার একটি দলের জয়ের বিপক্ষে ৪:১ অডস দেয়। এটি কী জয়ের সম্ভাবনা বোঝায়?' },
      solution: { en: 'P(win) = 1/(4+1) = 1/5 = 20%. The bookmaker believes there\u2019s roughly a 20% chance of winning.', bn: 'P(জয়) = ১/(৪+১) = ১/৫ = ২০%। বুকমেকার বিশ্বাস করে জয়ের সম্ভাবনা প্রায় ২০%।' },
      insight: { en: 'Odds and probability are two languages for the same idea — sports betting is really just applied probability theory.', bn: 'অডস এবং সম্ভাবনা একই ধারণার দুটি ভাষা — স্পোর্টস বেটিং আসলে ফলিত সম্ভাবনা তত্ত্ব।' }
    }
  },
  {
    icon: Plane, title: { en: 'Travel & Navigation', bn: 'ভ্রমণ ও ন্যাভিগেশন' },
    color: 'border-sky-500/20 bg-sky-500/5',
    tag: 'text-sky-400',
    items: [
      { name: { en: 'Speed, Distance, Time', bn: 'গতি, দূরত্ব, সময়' }, math: { en: 'speed = distance / time — rearranged for any road trip estimate', bn: 'গতি = দূরত্ব / সময় — যেকোনো রোড ট্রিপ আনুমানিকের জন্য পুনর্বিন্যস্ত' } },
      { name: { en: 'Fuel Efficiency', bn: 'জ্বালানি দক্ষতা' }, math: { en: 'cost per km = fuel price ÷ mileage — the real number behind "cheap to run"', bn: 'প্রতি কিমি খরচ = জ্বালানির মূল্য ÷ মাইলেজ — "চালাতে সস্তা"-র পেছনের আসল সংখ্যা' } },
      { name: { en: 'GPS Triangulation', bn: 'GPS ত্রিভুজায়ন' }, math: { en: 'Trilateration: intersecting distance spheres from ≥4 satellites pinpoints location', bn: 'ত্রিভুজায়ন: ≥৪ স্যাটেলাইট থেকে দূরত্ব গোলকের ছেদ অবস্থান নির্ণয় করে' } },
      { name: { en: 'Great-Circle Distance', bn: 'বৃহৎ-বৃত্ত দূরত্ব' }, math: { en: 'Spherical trigonometry finds the shortest flight path over a curved Earth', bn: 'গোলীয় ত্রিকোণমিতি বাঁকা পৃথিবীর উপর দিয়ে সংক্ষিপ্ততম ফ্লাইট পথ খুঁজে পায়' } },
    ],
    example: {
      title: { en: 'Will You Make It on Time?', bn: 'সময়মতো পৌঁছাবেন কি?' },
      problem: { en: 'Your destination is 260 km away and you must arrive in 3.5 hours. What average speed is required?', bn: 'আপনার গন্তব্য ২৬০ কিমি দূরে এবং আপনাকে ৩.৫ ঘণ্টায় পৌঁছাতে হবে। কত গড় গতি প্রয়োজন?' },
      solution: { en: 'speed = 260 / 3.5 ≈ 74.3 km/h — a realistic highway speed, so the trip is feasible.', bn: 'গতি = ২৬০ / ৩.৫ ≈ ৭৪.৩ কিমি/ঘণ্টা — একটি বাস্তবসম্মত হাইওয়ে গতি, তাই ভ্রমণ সম্ভব।' },
      insight: { en: 'This same rearranged formula — d = st — plans everything from bus schedules to spacecraft trajectories.', bn: 'একই পুনর্বিন্যস্ত সূত্র — d = st — বাস সময়সূচি থেকে মহাকাশযানের গতিপথ পর্যন্ত সবকিছু পরিকল্পনা করে।' }
    }
  },
]

export default function RealLifePage() {
  const { tt } = useLanguage()

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-amber-400 text-sm font-mono mb-2">{tt(t.realLife.tag)}</p>
          <h1 className="text-4xl font-bold text-white mb-3">{tt(t.realLife.title)}</h1>
          <p className="text-white/40">{tt(t.realLife.subtitle)}</p>
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

        {/* Interactive tool */}
        <div className="mt-8 rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <Calculator className="w-7 h-7 text-white/70" />
            <div>
              <h2 className="text-lg font-bold text-white">{tt(t.realLife.calculatorTitle)}</h2>
              <p className="text-xs text-white/40 mt-0.5">{tt(t.realLife.calculatorSubtitle)}</p>
            </div>
          </div>
          <div className="p-6">
            <Suspense fallback={<div className="text-center text-white/30 text-sm py-10 font-mono">{tt(t.common.loading)}</div>}>
              <EverydayMoneyCalculator />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}
