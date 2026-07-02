'use client'
import Link from 'next/link'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { Trophy, Star } from 'lucide-react'

const OPEN_PROBLEMS = [
  {
    name: { en: 'Riemann Hypothesis', bn: 'রিম্যান অনুকল্প' },
    year: '1859',
    prize: '$1,000,000',
    field: { en: 'Number Theory / Analysis', bn: 'সংখ্যাতত্ত্ব / বিশ্লেষণ' },
    description: { en: 'All non-trivial zeros of the Riemann zeta function ζ(s) have real part exactly ½.', bn: 'রিম্যান জিটা ফাংশন ζ(s)-এর সমস্ত অতুচ্ছ শূন্যের বাস্তব অংশ ঠিক ½।' },
    whyItMatters: { en: 'Controls the distribution of prime numbers. Proof would unlock deep structure of primes and have implications for cryptography.', bn: 'মৌলিক সংখ্যার বণ্টন নিয়ন্ত্রণ করে। প্রমাণ মৌলিক সংখ্যার গভীর গঠন উন্মোচন করবে এবং ক্রিপ্টোগ্রাফিতে প্রভাব ফেলবে।' },
    difficulty: 5,
  },
  {
    name: { en: 'P vs NP', bn: 'P বনাম NP' },
    year: '1971',
    prize: '$1,000,000',
    field: { en: 'Computer Science / Logic', bn: 'কম্পিউটার বিজ্ঞান / যুক্তিবিদ্যা' },
    description: { en: 'Is every problem whose solution can be quickly verified also quickly solvable?', bn: 'যে সমস্যার সমাধান দ্রুত যাচাই করা যায়, সেটি কি দ্রুত সমাধানযোগ্যও?' },
    whyItMatters: { en: 'If P=NP, most encryption would break instantly. Most believe P≠NP but no proof exists.', bn: 'যদি P=NP হয়, বেশিরভাগ এনক্রিপশন তাৎক্ষণিকভাবে ভেঙে পড়বে। বেশিরভাগ বিশ্বাস করেন P≠NP কিন্তু কোনো প্রমাণ নেই।' },
    difficulty: 5,
  },
  {
    name: { en: "Goldbach's Conjecture", bn: 'গোল্ডবাখের অনুকল্প' },
    year: '1742',
    prize: { en: 'No prize (but famous)', bn: 'পুরস্কার নেই (তবে বিখ্যাত)' },
    field: { en: 'Number Theory', bn: 'সংখ্যাতত্ত্ব' },
    description: { en: 'Every even integer greater than 2 is the sum of two prime numbers. e.g. 28 = 5 + 23.', bn: '২-এর চেয়ে বড় প্রতিটি জোড় সংখ্যা দুটি মৌলিক সংখ্যার যোগফল। যেমন ২৮ = ৫ + ২৩।' },
    whyItMatters: { en: 'Verified for all even numbers up to 4×10¹⁸ but never proved for all cases.', bn: '৪×১০¹⁸ পর্যন্ত সব জোড় সংখ্যার জন্য যাচাই করা হয়েছে কিন্তু সব ক্ষেত্রে কখনো প্রমাণিত হয়নি।' },
    difficulty: 4,
  },
  {
    name: { en: 'Twin Prime Conjecture', bn: 'যমজ মৌলিক অনুকল্প' },
    year: '~300 BCE',
    prize: { en: 'No prize', bn: 'পুরস্কার নেই' },
    field: { en: 'Number Theory', bn: 'সংখ্যাতত্ত্ব' },
    description: { en: 'There are infinitely many pairs of primes that differ by 2 (e.g. 11,13 — 41,43 — 101,103).', bn: '২ পার্থক্যের অসীম সংখ্যক মৌলিক জোড়া আছে (যেমন ১১,১৩ — ৪১,৪৩ — ১০১,১০৩)।' },
    whyItMatters: { en: 'Zhang (2013) proved infinitely many prime pairs within 70 million — later reduced to 246. Still not 2.', bn: 'ঝাং (২০১৩) প্রমাণ করেছেন ৭ কোটির মধ্যে অসীম মৌলিক জোড়া আছে — পরে ২৪৬-এ নামিয়ে আনা হয়। তবু ২ নয়।' },
    difficulty: 4,
  },
  {
    name: { en: 'Collatz Conjecture', bn: 'কোলাৎজ অনুকল্প' },
    year: '1937',
    prize: { en: '$1,200 (Erdős)', bn: '$১,২০০ (এর্ডশ)' },
    field: { en: 'Number Theory', bn: 'সংখ্যাতত্ত্ব' },
    description: { en: 'Start with any positive integer. If even, divide by 2. If odd, multiply by 3 and add 1. Always reach 1.', bn: 'যেকোনো ধনাত্মক পূর্ণসংখ্যা দিয়ে শুরু করুন। জোড় হলে ২ দিয়ে ভাগ করুন। বিজোড় হলে ৩ দিয়ে গুণ করে ১ যোগ করুন। সবসময় ১-এ পৌঁছাবে।' },
    whyItMatters: { en: 'Verified for all n up to 2⁶⁸ but resists all proof attempts. Erdős: "Mathematics is not yet ready for such problems."', bn: '২⁶⁸ পর্যন্ত সব n-এর জন্য যাচাই করা হয়েছে কিন্তু সব প্রমাণের চেষ্টা প্রতিরোধ করে। এর্ডশ: "গণিত এখনও এ ধরনের সমস্যার জন্য প্রস্তুত নয়।"' },
    difficulty: 3,
  },
  {
    name: { en: 'Navier-Stokes Existence', bn: 'নেভিয়ার-স্টোকস অস্তিত্ব' },
    year: '1845',
    prize: '$1,000,000',
    field: { en: 'Analysis / Physics', bn: 'বিশ্লেষণ / পদার্থবিজ্ঞান' },
    description: { en: 'Do smooth solutions to the 3D Navier-Stokes equations (fluid dynamics) always exist?', bn: '৩D নেভিয়ার-স্টোকস সমীকরণের (তরল গতিবিদ্যা) মসৃণ সমাধান কি সবসময় থাকে?' },
    whyItMatters: { en: 'Fundamental equations of fluid flow — understanding turbulence, weather, aerodynamics.', bn: 'তরল প্রবাহের মৌলিক সমীকরণ — অশান্ত প্রবাহ, আবহাওয়া, বায়ুগতিবিদ্যা বোঝার জন্য গুরুত্বপূর্ণ।' },
    difficulty: 5,
  },
]

const RESEARCH_AREAS = [
  { name:{ en:'Number Theory', bn:'সংখ্যাতত্ত্ব' },        desc:{ en:'Prime distribution, L-functions, elliptic curves, modular forms', bn:'মৌলিক সংখ্যা বণ্টন, L-ফাংশন, ইলিপ্টিক কার্ভ, মডুলার ফর্ম' }, icon:'#' },
  { name:{ en:'Algebraic Geometry', bn:'বীজগাণিতিক জ্যামিতি' },  desc:{ en:'Schemes, varieties, sheaves — uniting algebra and geometry', bn:'স্কিম, ভ্যারাইটি, শিফ — বীজগণিত ও জ্যামিতির একত্রীকরণ' }, icon:'Γ' },
  { name:{ en:'Topology', bn:'টপোলজি' },            desc:{ en:'Manifolds, knot theory, homology, persistent homology in data', bn:'ম্যানিফোল্ড, নট থিওরি, হোমোলজি, ডেটায় পার্সিস্টেন্ট হোমোলজি' }, icon:'∞' },
  { name:{ en:'Analysis', bn:'বিশ্লেষণ' },            desc:{ en:'PDEs, harmonic analysis, functional analysis, spectral theory', bn:'আংশিক ডিফারেনশিয়াল সমীকরণ, হারমোনিক বিশ্লেষণ, ফাংশনাল বিশ্লেষণ, স্পেক্ট্রাল তত্ত্ব' }, icon:'∫' },
  { name:{ en:'Combinatorics', bn:'সংমিশ্রণবিদ্যা' },       desc:{ en:'Graph theory, extremal combinatorics, Ramsey theory', bn:'গ্রাফ থিওরি, এক্সট্রিমাল কম্বিনেটোরিক্স, র‍্যামসে থিওরি' }, icon:'⋅' },
  { name:{ en:'Mathematical Physics', bn:'গাণিতিক পদার্থবিজ্ঞান' },desc:{ en:'Quantum field theory, string theory, quantum gravity', bn:'কোয়ান্টাম ফিল্ড থিওরি, স্ট্রিং থিওরি, কোয়ান্টাম মাধ্যাকর্ষণ' }, icon:'ψ' },
  { name:{ en:'Probability Theory', bn:'সম্ভাবনা তত্ত্ব' },  desc:{ en:'Stochastic processes, random matrices, percolation', bn:'স্টোকাস্টিক প্রক্রিয়া, র‍্যান্ডম ম্যাট্রিক্স, পার্কোলেশন' }, icon:'◈' },
  { name:{ en:'Logic & Foundations', bn:'যুক্তিবিদ্যা ও ভিত্তি' }, desc:{ en:'Set theory, model theory, proof theory, type theory', bn:'সেট তত্ত্ব, মডেল তত্ত্ব, প্রুফ তত্ত্ব, টাইপ তত্ত্ব' }, icon:'⊢' },
]

const ROADMAPS = [
  {
    field: { en: 'Number Theory', bn: 'সংখ্যাতত্ত্ব' },
    path: [
      { en:'Modular arithmetic', bn:'মডুলার পাটিগণিত' },
      { en:'Ring theory', bn:'রিং তত্ত্ব' },
      { en:'Algebraic number fields', bn:'বীজগাণিতিক সংখ্যা ক্ষেত্র' },
      { en:'p-adic numbers', bn:'p-adic সংখ্যা' },
      { en:'L-functions', bn:'L-ফাংশন' },
      { en:'Research frontier', bn:'গবেষণা সীমান্ত' },
    ],
    color: 'border-violet-500/30 text-violet-400',
  },
  {
    field: { en: 'Topology', bn: 'টপোলজি' },
    path: [
      { en:'Point-set topology', bn:'পয়েন্ট-সেট টপোলজি' },
      { en:'Algebraic topology (π₁)', bn:'বীজগাণিতিক টপোলজি (π₁)' },
      { en:'Homology/cohomology', bn:'হোমোলজি/কোহোমোলজি' },
      { en:'Differential topology', bn:'ডিফারেনশিয়াল টপোলজি' },
      { en:'Manifolds', bn:'ম্যানিফোল্ড' },
      { en:'Research frontier', bn:'গবেষণা সীমান্ত' },
    ],
    color: 'border-cyan-500/30 text-cyan-400',
  },
  {
    field: { en: 'Analysis / PDEs', bn: 'বিশ্লেষণ / PDEs' },
    path: [
      { en:'Real analysis', bn:'বাস্তব বিশ্লেষণ' },
      { en:'Complex analysis', bn:'জটিল বিশ্লেষণ' },
      { en:'Functional analysis', bn:'ফাংশনাল বিশ্লেষণ' },
      { en:'Sobolev spaces', bn:'সোবোলেভ স্পেস' },
      { en:'Elliptic PDEs', bn:'ইলিপ্টিক PDEs' },
      { en:'Research frontier', bn:'গবেষণা সীমান্ত' },
    ],
    color: 'border-amber-500/30 text-amber-400',
  },
]

const RESOURCES = [
  { name:'arXiv.org',           type:{ en:'Preprint server', bn:'প্রিপ্রিন্ট সার্ভার' },      desc:{ en:'Free access to math research preprints', bn:'গণিত গবেষণা প্রিপ্রিন্টে বিনামূল্যে অ্যাক্সেস' }, url:'https://arxiv.org/archive/math' },
  { name:'MathSciNet',          type:{ en:'Review database', bn:'রিভিউ ডেটাবেস' },      desc:{ en:'Mathematical Reviews — comprehensive coverage', bn:'গাণিতিক পর্যালোচনা — বিস্তৃত কভারেজ' }, url:'https://mathscinet.ams.org' },
  { name:'Erdős Number Project',type:{ en:'Collaboration graph', bn:'সহযোগিতা গ্রাফ' }, desc:{ en:'Six degrees of mathematical collaboration', bn:'গাণিতিক সহযোগিতার ছয় ডিগ্রি' }, url:'https://oakland.edu/enp' },
  { name:'OEIS',                type:{ en:'Integer sequences', bn:'পূর্ণসংখ্যা ধারা' },    desc:{ en:'On-Line Encyclopedia of Integer Sequences', bn:'পূর্ণসংখ্যা ধারার অনলাইন বিশ্বকোষ' }, url:'https://oeis.org' },
  { name:'Wolfram MathWorld',   type:{ en:'Encyclopedia', bn:'বিশ্বকোষ' },         desc:{ en:'Comprehensive mathematics reference', bn:'বিস্তৃত গণিত রেফারেন্স' }, url:'https://mathworld.wolfram.com' },
  { name:'AMS Journals',        type:{ en:'Peer-reviewed', bn:'পিয়ার-রিভিউড' },       desc:{ en:'American Mathematical Society publications', bn:'আমেরিকান গাণিতিক সোসাইটির প্রকাশনা' }, url:'https://www.ams.org/publications' },
]

export default function ResearchPage() {
  const { tt } = useLanguage()

  return (
    <>

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="mb-10">
            <p className="text-violet-400 text-sm font-mono mb-2">{tt(t.research.tag)}</p>
            <h1 className="text-4xl font-bold text-white mb-3">{tt(t.research.pageTitle)}</h1>
            <p className="text-white/40">
              {tt(t.research.subtitle)}
            </p>
          </div>

          {/* Open Problems */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-white mb-6">
              {tt(t.problems.famousUnsolved)}
              <span className="ml-3 text-sm font-normal text-white/30">{OPEN_PROBLEMS.length} {tt(t.research.problemsCount)}</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {OPEN_PROBLEMS.map((p, i) => (
                <div key={i} className="rounded-xl border border-white/8 bg-white/[0.02] p-5 hover:border-white/15 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{tt(p.name)}</h3>
                      <p className="text-xs text-white/30 font-mono mt-0.5">{tt(p.field)} · {p.year}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {typeof p.prize === 'string' ? (
                        <span className="text-xs text-amber-400 border border-amber-500/30 bg-amber-500/8 rounded-full px-2 py-0.5 inline-flex items-center gap-1">
                          <Trophy className="w-3 h-3" /> {p.prize}
                        </span>
                      ) : (
                        <span className="text-[10px] text-white/20 border border-white/8 rounded-full px-2 py-0.5">{tt(p.prize)}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed mb-3">{tt(p.description)}</p>
                  <div className="rounded-lg bg-black/20 border border-white/5 px-4 py-2.5 mb-3">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{tt(t.research.whyItMatters)}</p>
                    <p className="text-xs text-white/50 leading-relaxed">{tt(p.whyItMatters)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/25">{tt(t.research.difficulty)}</span>
                    <span className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-3 h-3 ${i <= p.difficulty ? 'text-amber-400 fill-amber-400' : 'text-white/15'}`} />
                      ))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Research Areas */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-white mb-6">{tt(t.research.activeAreas)}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {RESEARCH_AREAS.map(a => (
                <div key={tt(a.name)} className="rounded-xl border border-white/8 bg-white/[0.02] p-4 hover:border-white/15 hover:bg-white/[0.04] transition-all">
                  <div className="text-2xl font-mono text-violet-400/50 mb-2">{a.icon}</div>
                  <h3 className="text-sm font-semibold text-white/80 mb-1">{tt(a.name)}</h3>
                  <p className="text-xs text-white/35 leading-relaxed">{tt(a.desc)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Research Roadmaps */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-white mb-6">
              {tt(t.research.roadmapsTitle)}
              <span className="ml-3 text-sm font-normal text-white/30">{tt(t.research.roadmapsSubtitle)}</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {ROADMAPS.map(r => (
                <div key={tt(r.field)} className={`rounded-xl border ${r.color} bg-white/[0.02] p-5`}>
                  <h3 className="text-sm font-bold mb-4" style={{ color: 'inherit' }}>{tt(r.field)}</h3>
                  <div className="space-y-2">
                    {r.path.map((step, si) => (
                      <div key={si} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 font-mono ${
                          si === r.path.length - 1 ? 'border-current bg-current/10 text-white' : 'border-white/15 text-white/25'
                        }`}>
                          {si === r.path.length - 1 ? <Star className="w-2.5 h-2.5 fill-current" /> : si + 1}
                        </div>
                        <p className={`text-xs ${si === r.path.length - 1 ? 'text-white/70 font-semibold' : 'text-white/40'}`}>
                          {tt(step)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Resources */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">{tt(t.research.academicResources)}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {RESOURCES.map(r => (
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="rounded-xl border border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] p-4 transition-all group block">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                      {r.name}
                    </h3>
                    <span className="text-[10px] text-white/25 shrink-0">↗</span>
                  </div>
                  <p className="text-[10px] text-violet-400/60 mb-1">{tt(r.type)}</p>
                  <p className="text-xs text-white/35">{tt(r.desc)}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>

    </>
  )
}
