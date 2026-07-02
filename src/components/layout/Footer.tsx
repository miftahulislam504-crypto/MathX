'use client'
import Link from 'next/link'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'

export function Footer() {
  const { tt } = useLanguage()

  const FOOTER_LINKS = {
    [tt(t.footer.learnSection)]: [
      { href:'/learn',             label:tt(t.footer.allTopics) },
      { href:'/learn/calculus',    label:tt(t.footer.calculus) },
      { href:'/learn/algebra',     label:tt(t.footer.algebra) },
      { href:'/learn/geometry',    label:tt(t.footer.geometry) },
      { href:'/foundation',        label:tt(t.footer.foundation) },
    ],
    [tt(t.footer.exploreSection)]: [
      { href:'/visualizer',        label:tt(t.footer.visualizer) },
      { href:'/lab',               label:tt(t.footer.mathLab) },
      { href:'/statistics',        label:tt(t.footer.statistics) },
      { href:'/applied',           label:tt(t.footer.appliedMath) },
      { href:'/map',               label:tt(t.footer.knowledgeMap) },
    ],
    [tt(t.footer.referenceSection)]: [
      { href:'/encyclopedia',      label:tt(t.footer.encyclopedia) },
      { href:'/formulas',          label:tt(t.footer.formulaLibrary) },
      { href:'/research',          label:tt(t.footer.researchCenter) },
      { href:'/foundation/history',label:tt(t.footer.mathHistory) },
      { href:'/foundation/mathematicians', label:tt(t.footer.mathematicians) },
    ],
    [tt(t.footer.practiceSection)]: [
      { href:'/practice',          label:tt(t.footer.practiceCenter) },
      { href:'/problems',          label:tt(t.footer.problemHub) },
      { href:'/games',             label:tt(t.footer.mathGames) },
      { href:'/ai-tutor',          label:tt(t.footer.aiTutor) },
      { href:'/dashboard',         label:tt(t.nav.dashboard) },
      { href:'/community',         label:tt(t.footer.community) },
    ],
  }

  return (
    <footer className="border-t border-white/5 bg-black/40 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold">
              <span className="text-white">Math</span>
              <span className="text-violet-400">X</span>
            </Link>
            <p className="mt-2 text-xs text-white/30 leading-relaxed">
              {tt(t.footer.tagline)}
            </p>
            <p className="mt-3 text-[10px] text-white/15 font-mono">
              Wikipedia + Khan Academy<br />+ GeoGebra + Wolfram Alpha
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm text-white/40 hover:text-white/80 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} MathX. {tt(t.footer.builtFor)}
          </p>
          <div className="flex gap-4 text-xs text-white/20">
            <span className="font-mono">{tt(t.footer.pages)}</span>
            <span>·</span>
            <span className="font-mono">∑ · ∫ · ∂ · ∞ · π · √</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
