import Link from 'next/link'

const FOOTER_LINKS = {
  Learn: [
    { href:'/learn',             label:'All Topics' },
    { href:'/learn/calculus',    label:'Calculus' },
    { href:'/learn/algebra',     label:'Algebra' },
    { href:'/learn/geometry',    label:'Geometry' },
    { href:'/foundation',        label:'Foundation' },
  ],
  Explore: [
    { href:'/visualize',         label:'Visualizer' },
    { href:'/lab',               label:'Math Lab' },
    { href:'/statistics',        label:'Statistics' },
    { href:'/applied',           label:'Applied Math' },
    { href:'/map',               label:'Knowledge Map' },
  ],
  Reference: [
    { href:'/encyclopedia',      label:'Encyclopedia' },
    { href:'/formulas',          label:'Formula Library' },
    { href:'/research',          label:'Research Center' },
    { href:'/foundation/history',label:'Math History' },
    { href:'/foundation/mathematicians', label:'Mathematicians' },
  ],
  Practice: [
    { href:'/practice',          label:'Practice Center' },
    { href:'/problems',          label:'Problem Hub' },
    { href:'/games',             label:'Math Games' },
    { href:'/ai-tutor',          label:'AI Tutor' },
    { href:'/dashboard',         label:'Dashboard' },
    { href:'/community',        label:'Community' },
  ],
}

export function Footer() {
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
              Learn. Explore.<br />Experience Mathematics.
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
            © {new Date().getFullYear()} MathX. Built for learners, by learners.
          </p>
          <div className="flex gap-4 text-xs text-white/20">
            <span className="font-mono">27 pages</span>
            <span>·</span>
            <span className="font-mono">∑ · ∫ · ∂ · ∞ · π · √</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
