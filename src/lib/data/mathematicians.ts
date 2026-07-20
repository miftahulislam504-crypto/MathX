export interface Publication {
  title: string
  year: string
}

export interface Mathematician {
  id: string
  name: string
  born: string
  died?: string
  nationality: string
  era: string
  portrait: string          // initials placeholder
  fields: string[]
  contributions: string[]
  famousFor: string
  quote?: string
  wikiSlug: string
  publications: Publication[]
}

export const MATHEMATICIANS: Mathematician[] = [
  {
    id: 'euclid',
    name: 'Euclid of Alexandria',
    born: '~300 BCE', died: '~270 BCE',
    nationality: 'Greek (Alexandria)',
    era: 'Ancient', portrait: 'EA',
    fields: ['Geometry', 'Number Theory'],
    contributions: [
      'Wrote Elements — the most influential mathematics textbook in history',
      'Proved infinitely many primes exist',
      'Developed axiomatic geometry from 5 postulates',
      'Euclidean algorithm for GCD',
    ],
    famousFor: 'Elements — 13 books defining geometry for 2000 years',
    quote: '"The laws of nature are but the mathematical thoughts of God."',
    wikiSlug: 'Euclid',
    publications: [
      { title: 'Elements (13 books)', year: '~300 BCE' },
      { title: 'Data', year: '~300 BCE' },
      { title: 'Optics', year: '~300 BCE' },
      { title: 'Phaenomena', year: '~300 BCE' },
      { title: 'On Divisions of Figures', year: '~300 BCE' },
    ],
  },
  {
    id: 'archimedes',
    name: 'Archimedes of Syracuse',
    born: '~287 BCE', died: '~212 BCE',
    nationality: 'Greek (Sicily)',
    era: 'Ancient', portrait: 'AS',
    fields: ['Calculus (precursor)', 'Geometry', 'Physics'],
    contributions: [
      'Approximated π as 3.14... using inscribed/circumscribed polygons',
      'Method of exhaustion — precursor to integral calculus',
      'Proved area of circle = πr²',
      'Surface and volume of sphere formulas',
      'Law of the lever and buoyancy',
    ],
    famousFor: 'Approximating π and inventing mechanical devices',
    quote: '"Give me a lever long enough and a fulcrum on which to place it, and I shall move the world."',
    wikiSlug: 'Archimedes',
    publications: [
      { title: 'On the Sphere and Cylinder', year: '~225 BCE' },
      { title: 'Measurement of a Circle', year: '~250 BCE' },
      { title: 'On Spirals', year: '~225 BCE' },
      { title: 'The Method of Mechanical Theorems', year: '~250 BCE' },
      { title: 'The Sand Reckoner', year: '~216 BCE' },
      { title: 'On Floating Bodies', year: '~250 BCE' },
    ],
  },
  {
    id: 'al-khwarizmi',
    name: 'Muhammad ibn Musa al-Khwarizmi',
    born: '~780 CE', died: '~850 CE',
    nationality: 'Persian (Baghdad)',
    era: 'Islamic Golden Age', portrait: 'AK',
    fields: ['Algebra', 'Arithmetic', 'Astronomy'],
    contributions: [
      'Wrote al-Kitāb al-mukhtaṣar fī ḥisāb al-jabr — founding algebra',
      'Introduced systematic solution of linear and quadratic equations',
      'Introduced Hindu-Arabic numerals to the Islamic world',
      '"Algorithm" derives from his name, "Algebra" from his book',
    ],
    famousFor: 'Father of Algebra — al-jabr gave us "algebra"',
    wikiSlug: 'Muhammad_ibn_Musa_al-Khwarizmi',
    publications: [
      { title: 'Al-Kitāb al-mukhtaṣar fī ḥisāb al-jabr wa-l-muqābala', year: '~820 CE' },
      { title: "Kitāb al-Jam'a wal-Tafriq bi'l-Hisab al-Hindi (On Hindu Arithmetic)", year: '~825 CE' },
      { title: 'Zīj al-Sindhind (astronomical tables)', year: '~820 CE' },
      { title: 'Kitāb Ṣūrat al-Arḍ (Geography)', year: '833 CE' },
    ],
  },
  {
    id: 'fibonacci',
    name: 'Leonardo Fibonacci',
    born: '~1170', died: '~1250',
    nationality: 'Italian',
    era: 'Medieval', portrait: 'LF',
    fields: ['Number Theory', 'Arithmetic'],
    contributions: [
      'Introduced Hindu-Arabic numeral system to Europe via Liber Abaci',
      'Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13... (though known earlier in India)',
      'Advanced European mathematics by centuries',
      'Solved problems involving commerce, weights, and measurements',
    ],
    famousFor: 'Fibonacci sequence and introducing Arabic numerals to Europe',
    wikiSlug: 'Fibonacci',
    publications: [
      { title: 'Liber Abaci (Book of Calculation)', year: '1202 (rev. 1228)' },
      { title: 'Practica Geometriae', year: '1220' },
      { title: 'Liber Quadratorum (Book of Squares)', year: '1225' },
      { title: 'Flos', year: '1225' },
    ],
  },
  {
    id: 'newton',
    name: 'Isaac Newton',
    born: '1643', died: '1727',
    nationality: 'English',
    era: 'Scientific Revolution', portrait: 'IN',
    fields: ['Calculus', 'Physics', 'Optics', 'Series'],
    contributions: [
      'Co-invented calculus independently of Leibniz',
      'Generalized binomial theorem',
      'Laws of motion and universal gravitation',
      'Method of fluxions (derivatives)',
      'Power series expansions',
    ],
    famousFor: 'Co-inventor of calculus and laws of gravity',
    quote: '"If I have seen further, it is by standing on the shoulders of giants."',
    wikiSlug: 'Isaac_Newton',
    publications: [
      { title: 'Philosophiæ Naturalis Principia Mathematica', year: '1687' },
      { title: 'Opticks', year: '1704' },
      { title: 'Arithmetica Universalis', year: '1707' },
      { title: 'Method of Fluxions (written earlier, published posthumously)', year: '1736' },
    ],
  },
  {
    id: 'leibniz',
    name: 'Gottfried Wilhelm Leibniz',
    born: '1646', died: '1716',
    nationality: 'German',
    era: 'Scientific Revolution', portrait: 'GL',
    fields: ['Calculus', 'Logic', 'Philosophy'],
    contributions: [
      'Co-invented calculus — his notation (dx, ∫) is what we use today',
      'Developed binary number system (foundation of computing)',
      'Founded formal logic',
      'Product rule: d(uv) = u·dv + v·du',
    ],
    famousFor: 'Calculus notation (∫, d/dx) still used today',
    quote: '"Music is the hidden arithmetic exercise of the soul."',
    wikiSlug: 'Gottfried_Wilhelm_Leibniz',
    publications: [
      { title: 'Nova Methodus pro Maximis et Minimis (first published calculus paper)', year: '1684' },
      { title: 'De Geometria Recondita', year: '1686' },
      { title: 'Supplementum Geometriae Dimensoriae', year: '1693' },
    ],
  },
  {
    id: 'euler',
    name: 'Leonhard Euler',
    born: '1707', died: '1783',
    nationality: 'Swiss',
    era: 'Age of Enlightenment', portrait: 'LE',
    fields: ['Analysis', 'Graph Theory', 'Number Theory', 'Topology'],
    contributions: [
      "Euler's identity: e^(iπ) + 1 = 0",
      'Introduced notation: f(x), π, e, i, Σ',
      'Solved Königsberg bridge problem — founded graph theory',
      "Basel problem: Σ(1/n²) = π²/6",
      'Introduced concept of function',
      'Euler characteristic V - E + F = 2',
    ],
    famousFor: 'Most prolific mathematician in history — 886 publications',
    quote: '"Mathematics is the gate and key to all sciences."',
    wikiSlug: 'Leonhard_Euler',
    publications: [
      { title: 'Introductio in Analysin Infinitorum', year: '1748' },
      { title: 'Institutiones Calculi Differentialis', year: '1755' },
      { title: 'Institutionum Calculi Integralis (3 volumes)', year: '1768–70' },
      { title: 'Methodus Inveniendi Lineas Curvas', year: '1744' },
    ],
  },
  {
    id: 'gauss',
    name: 'Carl Friedrich Gauss',
    born: '1777', died: '1855',
    nationality: 'German',
    era: 'Modern', portrait: 'CG',
    fields: ['Number Theory', 'Statistics', 'Geometry', 'Algebra'],
    contributions: [
      'Proved Fundamental Theorem of Algebra (age 21)',
      'Gaussian/Normal distribution',
      'Modular arithmetic and quadratic reciprocity',
      'Sum of 1 to 100 at age 9 — n(n+1)/2',
      'Least squares method',
      'Differential geometry of curved surfaces',
    ],
    famousFor: 'Prince of Mathematics — contributions span nearly all fields',
    quote: '"Mathematics is the queen of the sciences."',
    wikiSlug: 'Carl_Friedrich_Gauss',
    publications: [
      { title: 'Disquisitiones Arithmeticae', year: '1801' },
      { title: 'Theoria Motus Corporum Coelestium', year: '1809' },
      { title: 'Disquisitiones Generales circa Superficies Curvas', year: '1827' },
    ],
  },
  {
    id: 'ramanujan',
    name: 'Srinivasa Ramanujan',
    born: '1887', died: '1920',
    nationality: 'Indian',
    era: 'Modern', portrait: 'SR',
    fields: ['Number Theory', 'Infinite Series', 'Analysis'],
    contributions: [
      'Ramanujan conjecture (proved 1974)',
      'Taxicab numbers: 1729 = 12³+1³ = 10³+9³',
      '1/π formula converging rapidly',
      'Mock theta functions',
      'Over 3900 results in notebooks, mostly self-discovered',
    ],
    famousFor: 'Self-taught genius who discovered theorems no one had proven before',
    quote: '"An equation for me has no meaning unless it expresses a thought of God."',
    wikiSlug: 'Srinivasa_Ramanujan',
    publications: [
      { title: "Some Properties of Bernoulli's Numbers (first paper)", year: '1911' },
      { title: 'Highly Composite Numbers (his longest, most famous paper)', year: '1915' },
      { title: '37 papers total, plus 3 notebooks of ~3900 unpublished results', year: '1911–1920' },
    ],
  },
  {
    id: 'noether',
    name: 'Emmy Noether',
    born: '1882', died: '1935',
    nationality: 'German',
    era: 'Modern', portrait: 'EN',
    fields: ['Abstract Algebra', 'Theoretical Physics'],
    contributions: [
      "Noether's theorem: every symmetry has a conservation law",
      'Revolutionized abstract algebra with ring and ideal theory',
      'Invariant theory',
      'Ascending chain condition for modules',
    ],
    famousFor: "Noether's theorem — cornerstone of modern physics",
    quote: '"My methods are working methods."',
    wikiSlug: 'Emmy_Noether',
    publications: [
      { title: 'Invariante Variationsprobleme (Noether\u2019s theorem)', year: '1918' },
      { title: 'Idealtheorie in Ringbereichen (Theory of Ideals in Ring Domains)', year: '1921' },
      { title: 'Abstrakter Aufbau der Idealtheorie', year: '1927' },
    ],
  },
  {
    id: 'turing',
    name: 'Alan Turing',
    born: '1912', died: '1954',
    nationality: 'British',
    era: 'Contemporary', portrait: 'AT',
    fields: ['Computer Science', 'Logic', 'Cryptography', 'AI'],
    contributions: [
      'Turing machine — mathematical model of computation',
      'Decidability and the halting problem',
      'Broke Enigma cipher in WWII',
      'Turing test for artificial intelligence',
      'Morphogenesis in biology',
    ],
    famousFor: 'Father of computer science and artificial intelligence',
    quote: '"We can only see a short distance ahead, but we can see plenty there that needs to be done."',
    wikiSlug: 'Alan_Turing',
    publications: [
      { title: 'On Computable Numbers, with an Application to the Entscheidungsproblem', year: '1936' },
      { title: 'Computing Machinery and Intelligence (introduces the Turing Test)', year: '1950' },
      { title: 'The Chemical Basis of Morphogenesis', year: '1952' },
    ],
  },
  {
    id: 'riemann',
    name: 'Bernhard Riemann',
    born: '1826', died: '1866',
    nationality: 'German',
    era: 'Modern', portrait: 'BR',
    fields: ['Analysis', 'Geometry', 'Number Theory'],
    contributions: [
      'Riemann integral — foundation of integration',
      'Riemann hypothesis — greatest unsolved problem',
      'Riemannian geometry — basis of General Relativity',
      'Riemann zeta function',
      'Cauchy-Riemann equations in complex analysis',
    ],
    famousFor: 'Riemann hypothesis and non-Euclidean geometry used in Einstein\'s relativity',
    wikiSlug: 'Bernhard_Riemann',
    publications: [
      { title: 'Grundlagen für eine allgemeine Theorie der Funktionen (doctoral thesis)', year: '1851' },
      { title: 'Über die Hypothesen, welche der Geometrie zu Grunde liegen', year: '1854 (pub. 1867)' },
      { title: 'Über die Anzahl der Primzahlen unter einer gegebenen Grösse (Riemann Hypothesis)', year: '1859' },
      { title: 'Theorie der Abel\u2019schen Functionen', year: '1857' },
    ],
  },
]

export const ERAS = ['Ancient', 'Islamic Golden Age', 'Medieval', 'Scientific Revolution', 'Age of Enlightenment', 'Modern', 'Contemporary']
