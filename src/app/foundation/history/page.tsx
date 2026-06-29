import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const TIMELINE = [
  {
    era: 'Ancient Babylon & Egypt',
    period: '~3000–500 BCE',
    color: 'border-amber-500/40 bg-amber-500/8',
    dot: 'bg-amber-500',
    label: 'text-amber-400',
    events: [
      { year:'~3000 BCE', event:'Babylonians develop positional number system (base 60). Still used for time and angles today.' },
      { year:'~2700 BCE', event:'Egyptians use fractions and geometry for land surveying along the Nile.' },
      { year:'~1800 BCE', event:'Babylonians solve quadratic equations and know the Pythagorean relationship 1000 years before Pythagoras.' },
      { year:'~1650 BCE', event:'Rhind Mathematical Papyrus — Egyptian problems in arithmetic and geometry.' },
    ],
  },
  {
    era: 'Ancient Greece',
    period: '~600–300 BCE',
    color: 'border-cyan-500/40 bg-cyan-500/8',
    dot: 'bg-cyan-500',
    label: 'text-cyan-400',
    events: [
      { year:'~580 BCE', event:'Thales introduces deductive reasoning in geometry — proof becomes mathematics.' },
      { year:'~570 BCE', event:"Pythagoras and his school prove a² + b² = c² and discover irrational numbers." },
      { year:'~440 BCE', event:'Zeno of Elea creates paradoxes about infinity, motion, and the continuum.' },
      { year:'~360 BCE', event:'Eudoxus develops method of exhaustion — precursor to calculus.' },
      { year:'~300 BCE', event:"Euclid writes Elements — 13 volumes of axiomatic geometry that define mathematics for 2000 years." },
      { year:'~250 BCE', event:'Archimedes approximates π and develops early integral calculus to find areas and volumes.' },
    ],
  },
  {
    era: 'Islamic Golden Age',
    period: '~800–1200 CE',
    color: 'border-emerald-500/40 bg-emerald-500/8',
    dot: 'bg-emerald-500',
    label: 'text-emerald-400',
    events: [
      { year:'~820 CE', event:'Al-Khwarizmi writes al-Kitāb al-mukhtaṣar fī ḥisāb al-jabr — founding algebra. "Algorithm" named after him.' },
      { year:'~850 CE', event:'Al-Kindi advances cryptography and introduces frequency analysis.' },
      { year:'~965 CE', event:'Ibn al-Haytham (Alhazen) develops optics and the scientific method.' },
      { year:'~1100 CE', event:'Omar Khayyam solves cubic equations geometrically and advances algebra.' },
    ],
  },
  {
    era: 'Indian Mathematics',
    period: '~500–1200 CE',
    color: 'border-rose-500/40 bg-rose-500/8',
    dot: 'bg-rose-500',
    label: 'text-rose-400',
    events: [
      { year:'~499 CE', event:'Aryabhata computes π ≈ 3.1416, introduces place-value system and trigonometry.' },
      { year:'~628 CE', event:"Brahmagupta defines zero as a number and establishes rules for arithmetic with zero." },
      { year:'~800 CE', event:'Mahavira advances combinatorics, algebra, and the study of zero.' },
      { year:'~1350 CE', event:'Kerala school discovers infinite series for π and trigonometric functions — 200 years before Europe.' },
    ],
  },
  {
    era: 'Renaissance & Scientific Revolution',
    period: '~1400–1700 CE',
    color: 'border-violet-500/40 bg-violet-500/8',
    dot: 'bg-violet-500',
    label: 'text-violet-400',
    events: [
      { year:'~1545', event:'Cardano publishes Ars Magna — solution to cubic and quartic equations. Complex numbers emerge.' },
      { year:'~1614', event:"Napier invents logarithms, transforming multiplication into addition." },
      { year:'~1637', event:"Descartes introduces coordinate geometry — uniting algebra and geometry." },
      { year:'~1665', event:"Newton and Leibniz independently invent calculus. Newton's fluxions vs Leibniz's notation (we use Leibniz today)." },
      { year:'~1687', event:'Newton publishes Principia — calculus applied to explain planetary motion.' },
    ],
  },
  {
    era: 'Age of Enlightenment',
    period: '1700–1800',
    color: 'border-sky-500/40 bg-sky-500/8',
    dot: 'bg-sky-500',
    label: 'text-sky-400',
    events: [
      { year:'1736', event:"Euler solves the Königsberg bridge problem — founding graph theory and topology." },
      { year:'1742', event:"Goldbach conjectures every even number > 2 is the sum of two primes. Still unproven." },
      { year:'1748', event:"Euler's Introductio in Analysin Infinitorum — modern analysis begins. Introduces e^(iπ)+1=0." },
      { year:'1796', event:"Gauss proves Fundamental Theorem of Algebra and discovers modular arithmetic." },
    ],
  },
  {
    era: 'Modern Mathematics',
    period: '1800–1930',
    color: 'border-fuchsia-500/40 bg-fuchsia-500/8',
    dot: 'bg-fuchsia-500',
    label: 'text-fuchsia-400',
    events: [
      { year:'1830s', event:"Galois founds group theory at age 20 — dies in duel at 21. Abstract algebra born." },
      { year:'1854', event:"Boole publishes Laws of Thought — mathematical logic and Boolean algebra." },
      { year:'1854', event:"Riemann introduces non-Euclidean geometry — used later in General Relativity." },
      { year:'1874', event:"Cantor creates set theory and proves different sizes of infinity." },
      { year:'1900', event:"Hilbert presents 23 unsolved problems — setting the agenda for 20th-century mathematics." },
      { year:'1910', event:"Russell & Whitehead write Principia Mathematica — attempt to found all math on logic." },
      { year:'1931', event:"Gödel's Incompleteness Theorems: any consistent system has true unprovable statements." },
    ],
  },
  {
    era: 'Contemporary',
    period: '1940–Present',
    color: 'border-white/20 bg-white/5',
    dot: 'bg-white/50',
    label: 'text-white/60',
    events: [
      { year:'1945', event:"Turing formalizes computation — the mathematical foundations of computer science." },
      { year:'1976', event:"Four Color Theorem proved — first major theorem verified by computer." },
      { year:'1994', event:"Andrew Wiles proves Fermat's Last Theorem after 358 years." },
      { year:'2003', event:"Perelman proves Poincaré Conjecture (Millennium Prize Problem) — declines the $1M prize." },
      { year:'Today', event:"AI-assisted theorem proving, quantum computation, and p vs NP remain active frontiers." },
    ],
  },
]

export default function HistoryPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">

          <div className="mb-10">
            <p className="text-violet-400 text-sm font-mono mb-2">// Foundation → History</p>
            <h1 className="text-4xl font-bold text-white mb-3">History of Mathematics</h1>
            <p className="text-white/40">
              4000 years of human mathematical discovery — from clay tablets to AI theorem provers.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative space-y-0">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/40 via-violet-500/30 to-white/10" />

            {TIMELINE.map((era, ei) => (
              <div key={ei} className="relative pl-16 pb-10">
                {/* Era dot */}
                <div className={`absolute left-4 top-4 w-4 h-4 rounded-full ${era.dot} ring-4 ring-black`} />

                {/* Era header */}
                <div className={`rounded-xl border ${era.color} px-5 py-3 mb-4 inline-flex flex-col sm:flex-row sm:items-center gap-2`}>
                  <h2 className={`text-sm font-bold ${era.label}`}>{era.era}</h2>
                  <span className="text-xs text-white/30 font-mono">{era.period}</span>
                </div>

                {/* Events */}
                <div className="space-y-3">
                  {era.events.map((ev, evi) => (
                    <div key={evi} className="flex gap-4">
                      <span className={`text-xs font-mono shrink-0 w-20 text-right pt-0.5 ${era.label} opacity-70`}>
                        {ev.year}
                      </span>
                      <div className="flex-1 text-sm text-white/55 leading-relaxed border-l border-white/5 pl-4">
                        {ev.event}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Interesting facts footer */}
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { n:'4000+', label:'Years of recorded mathematics', icon:'📜' },
              { n:'~1M',   label:'Mathematical theorems proven so far', icon:'✓' },
              { n:'7',     label:'Millennium Prize Problems ($1M each)', icon:'🏆' },
            ].map(f => (
              <div key={f.label} className="rounded-xl border border-white/6 bg-white/[0.02] p-4 text-center">
                <p className="text-2xl mb-1">{f.icon}</p>
                <p className="text-2xl font-bold font-mono text-white/80">{f.n}</p>
                <p className="text-xs text-white/30 mt-1">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
