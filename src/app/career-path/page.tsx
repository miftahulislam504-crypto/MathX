'use client'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { Briefcase, GraduationCap, TrendingUp, Milestone } from 'lucide-react'

const CAREERS = [
  {
    name: { en: 'Data Scientist', bn: 'ডেটা সায়েন্টিস্ট' },
    needs: { en: 'Statistics, linear algebra, probability, programming (Python/R)', bn: 'পরিসংখ্যান, রৈখিক বীজগণিত, সম্ভাবনা, প্রোগ্রামিং (Python/R)' },
    desc: { en: 'Builds models that turn raw data into predictions and decisions — one of the fastest-growing math-adjacent fields.', bn: 'কাঁচা ডেটাকে পূর্বাভাস ও সিদ্ধান্তে রূপান্তরকারী মডেল তৈরি করে — সবচেয়ে দ্রুত বর্ধনশীল গণিত-সংশ্লিষ্ট ক্ষেত্রগুলোর একটি।' },
  },
  {
    name: { en: 'Actuary', bn: 'অ্যাকচুয়ারি' },
    needs: { en: 'Probability, statistics, financial mathematics, professional exams', bn: 'সম্ভাবনা, পরিসংখ্যান, আর্থিক গণিত, পেশাদার পরীক্ষা' },
    desc: { en: 'Assesses financial risk for insurance and pensions — consistently ranked among the highest-paid, lowest-stress careers.', bn: 'বীমা ও পেনশনের জন্য আর্থিক ঝুঁকি মূল্যায়ন করে — ধারাবাহিকভাবে সর্বোচ্চ বেতনের, সর্বনিম্ন চাপের পেশার মধ্যে স্থান পায়।' },
  },
  {
    name: { en: 'Quantitative Analyst', bn: 'কোয়ান্টিটেটিভ অ্যানালিস্ট' },
    needs: { en: 'Stochastic calculus, linear algebra, statistics, programming', bn: 'স্টোকাস্টিক ক্যালকুলাস, রৈখিক বীজগণিত, পরিসংখ্যান, প্রোগ্রামিং' },
    desc: { en: 'Builds mathematical models for pricing, trading, and risk in financial markets — highly technical and competitive.', bn: 'আর্থিক বাজারে মূল্য নির্ধারণ, লেনদেন এবং ঝুঁকির জন্য গাণিতিক মডেল তৈরি করে — অত্যন্ত প্রযুক্তিগত ও প্রতিযোগিতামূলক।' },
  },
  {
    name: { en: 'Statistician / Operations Research Analyst', bn: 'পরিসংখ্যানবিদ / অপারেশনস রিসার্চ অ্যানালিস্ট' },
    needs: { en: 'Statistics, optimization, probability, applied modeling', bn: 'পরিসংখ্যান, অপ্টিমাইজেশন, সম্ভাবনা, ফলিত মডেলিং' },
    desc: { en: 'Helps organizations make better decisions using data and optimization — one of the fastest-growing math occupations.', bn: 'ডেটা ও অপ্টিমাইজেশন ব্যবহার করে সংস্থাগুলোকে ভালো সিদ্ধান্ত নিতে সাহায্য করে — সবচেয়ে দ্রুত বর্ধনশীল গণিত পেশার একটি।' },
  },
  {
    name: { en: 'Cryptographer / Security Engineer', bn: 'ক্রিপ্টোগ্রাফার / সিকিউরিটি ইঞ্জিনিয়ার' },
    needs: { en: 'Number theory, abstract algebra, computational complexity', bn: 'সংখ্যাতত্ত্ব, বিমূর্ত বীজগণিত, গণনামূলক জটিলতা' },
    desc: { en: 'Designs and breaks secure systems using deep number theory — protects everything from banking to messaging apps.', bn: 'গভীর সংখ্যাতত্ত্ব ব্যবহার করে নিরাপদ সিস্টেম ডিজাইন ও ভাঙে — ব্যাংকিং থেকে মেসেজিং অ্যাপ পর্যন্ত সবকিছু রক্ষা করে।' },
  },
  {
    name: { en: 'Math Teacher / Professor', bn: 'গণিত শিক্ষক / অধ্যাপক' },
    needs: { en: 'Deep conceptual mastery, communication skills, a degree in education or mathematics', bn: 'গভীর ধারণাগত দক্ষতা, যোগাযোগ দক্ষতা, শিক্ষা বা গণিতে ডিগ্রি' },
    desc: { en: 'Shapes the next generation\u2019s relationship with mathematics — a stable, high-demand path at every education level.', bn: 'পরবর্তী প্রজন্মের গণিতের সাথে সম্পর্ক গড়ে তোলে — প্রতিটি শিক্ষা স্তরে একটি স্থিতিশীল, উচ্চ-চাহিদাসম্পন্ন পথ।' },
  },
]

const ROADMAP_STAGES = [
  {
    stage: { en: 'SSC (Secondary)', bn: 'SSC (মাধ্যমিক)' },
    focus: { en: 'Build unshakeable fundamentals — algebra, geometry, and arithmetic. Speed and accuracy matter as much as understanding.', bn: 'অটল মৌলিক বিষয় গড়ে তুলুন — বীজগণিত, জ্যামিতি এবং পাটিগণিত। গতি ও নির্ভুলতা বোঝার মতোই গুরুত্বপূর্ণ।' },
    tip: { en: 'Weak SSC fundamentals compound into HSC struggles — don\u2019t rush past topics you don\u2019t fully understand.', bn: 'দুর্বল SSC ভিত্তি HSC-তে সমস্যা বাড়িয়ে তোলে — যে বিষয় সম্পূর্ণ বোঝেননি তা তাড়াহুড়ো করে এড়িয়ে যাবেন না।' },
  },
  {
    stage: { en: 'HSC (Higher Secondary)', bn: 'HSC (উচ্চ মাধ্যমিক)' },
    focus: { en: 'Calculus, vectors, and coordinate geometry take center stage — this is also when university admission tests start shaping your study plan.', bn: 'ক্যালকুলাস, ভেক্টর এবং স্থানাঙ্ক জ্যামিতি কেন্দ্রে আসে — এই সময়েই বিশ্ববিদ্যালয় ভর্তি পরীক্ষা আপনার অধ্যয়ন পরিকল্পনা গঠন শুরু করে।' },
    tip: { en: 'Engineering-track admission tests (like BUET\u2019s) emphasize speed and problem-solving under time pressure — practice timed sets, not just untimed understanding.', bn: 'ইঞ্জিনিয়ারিং-ট্র্যাক ভর্তি পরীক্ষা (যেমন BUET) সময়ের চাপে গতি ও সমস্যা সমাধানের উপর জোর দেয় — শুধু বোঝা না, সময়বদ্ধ সেট অনুশীলন করুন।' },
  },
  {
    stage: { en: 'University Admission', bn: 'বিশ্ববিদ্যালয় ভর্তি' },
    focus: { en: 'Public universities (engineering, science, statistics, and actuarial-adjacent programs) typically require strong SSC and HSC results plus a competitive admission test.', bn: 'সরকারি বিশ্ববিদ্যালয় (ইঞ্জিনিয়ারিং, বিজ্ঞান, পরিসংখ্যান এবং actuarial-সংশ্লিষ্ট প্রোগ্রাম) সাধারণত শক্তিশালী SSC ও HSC ফলাফল এবং একটি প্রতিযোগিতামূলক ভর্তি পরীক্ষা প্রয়োজন।' },
    tip: { en: 'Admission requirements, GPA cutoffs, and test dates change every year — always confirm current details on the university\u2019s official admission portal, not general guides like this one.', bn: 'ভর্তির প্রয়োজনীয়তা, GPA কাটঅফ এবং পরীক্ষার তারিখ প্রতি বছর পরিবর্তিত হয় — সবসময় বিশ্ববিদ্যালয়ের সরকারি ভর্তি পোর্টালে বর্তমান বিবরণ নিশ্চিত করুন, এই ধরনের সাধারণ গাইডে না।' },
  },
  {
    stage: { en: 'Undergraduate & Beyond', bn: 'স্নাতক ও পরবর্তী' },
    focus: { en: 'Specialize — pure math, applied math, statistics, or a math-heavy engineering discipline. Internships and programming skills (Python/R) open doors early.', bn: 'বিশেষায়িত হন — বিশুদ্ধ গণিত, ফলিত গণিত, পরিসংখ্যান, বা গণিত-নির্ভর ইঞ্জিনিয়ারিং শাখা। ইন্টার্নশিপ এবং প্রোগ্রামিং দক্ষতা (Python/R) তাড়াতাড়ি দরজা খুলে দেয়।' },
    tip: { en: 'Graduate study (MS/PhD) matters most for research or academia — for industry roles like data science, a strong portfolio often matters more than the degree title.', bn: 'গবেষণা বা একাডেমিয়ার জন্য স্নাতকোত্তর অধ্যয়ন (MS/PhD) সবচেয়ে গুরুত্বপূর্ণ — ডেটা সায়েন্সের মতো শিল্প ভূমিকার জন্য, ডিগ্রির নামের চেয়ে একটি শক্তিশালী পোর্টফোলিও প্রায়ই বেশি গুরুত্বপূর্ণ।' },
  },
]

export default function CareerPathPage() {
  const { tt } = useLanguage()

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-cyan-400 text-sm font-mono mb-2">{tt(t.careerPath.tag)}</p>
          <h1 className="text-4xl font-bold text-white mb-3">{tt(t.careerPath.title)}</h1>
          <p className="text-white/40">{tt(t.careerPath.subtitle)}</p>
        </div>

        {/* Mathematics Careers */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">{tt(t.careerPath.careersTitle)}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {CAREERS.map((c, i) => (
              <div key={i} className="rounded-xl border border-cyan-500/15 bg-cyan-500/[0.03] p-5">
                <h3 className="text-sm font-bold text-cyan-300 mb-2">{tt(c.name)}</h3>
                <p className="text-xs text-white/50 leading-relaxed mb-3">{tt(c.desc)}</p>
                <div className="rounded-lg bg-black/20 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-white/25 mb-1">{tt(t.careerPath.mathYouNeed)}</p>
                  <p className="text-[11px] text-white/45 font-mono leading-relaxed">{tt(c.needs)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Academic Roadmap */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <GraduationCap className="w-6 h-6 text-violet-400" />
            <h2 className="text-xl font-bold text-white">{tt(t.careerPath.roadmapTitle)}</h2>
          </div>
          <div className="space-y-4">
            {ROADMAP_STAGES.map((s, i) => (
              <div key={i} className="rounded-xl border border-violet-500/15 bg-violet-500/[0.03] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Milestone className="w-4 h-4 text-violet-400 shrink-0" />
                  <h3 className="text-sm font-bold text-violet-300">{tt(s.stage)}</h3>
                </div>
                <p className="text-xs text-white/50 leading-relaxed mb-3">{tt(s.focus)}</p>
                <div className="rounded-lg border border-white/8 bg-black/20 px-3 py-2 flex items-start gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-white/25 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-white/35 leading-relaxed italic">{tt(s.tip)}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-white/20 text-center mt-6">{tt(t.careerPath.disclaimer)}</p>
        </section>
      </div>
    </main>
  )
}
