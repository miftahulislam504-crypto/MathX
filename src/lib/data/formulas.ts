export interface FormulaEntry {
  id: string
  title: string
  latex: string
  description: string
  topicSlug: string
  branchId: string
  tags: string[]
}

export const FORMULAS: FormulaEntry[] = [
  // ── ALGEBRA ─────────────────────────────────────────────────────
  { id: 'f-al-01', title: 'Quadratic Formula',         latex: 'x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',                          description: 'Roots of ax² + bx + c = 0',                  topicSlug: 'quadratic-equations',    branchId: '2', tags: ['quadratic', 'roots', 'algebra'] },
  { id: 'f-al-02', title: 'Binomial Theorem',          latex: '(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k',               description: 'Expansion of (a+b)^n',                       topicSlug: 'binomial-theorem',        branchId: '2', tags: ['binomial', 'expansion'] },
  { id: 'f-al-03', title: 'Sum of AP',                 latex: 'S_n = \\dfrac{n}{2}(2a + (n-1)d)',                                   description: 'Sum of n terms of arithmetic progression',    topicSlug: 'sequences-series',        branchId: '2', tags: ['AP', 'series', 'arithmetic'] },
  { id: 'f-al-04', title: 'Sum of GP',                 latex: 'S_n = a\\cdot\\dfrac{r^n - 1}{r - 1}, \\quad r \\neq 1',            description: 'Sum of n terms of geometric progression',     topicSlug: 'sequences-series',        branchId: '2', tags: ['GP', 'series', 'geometric'] },
  { id: 'f-al-05', title: 'Difference of Squares',     latex: 'a^2 - b^2 = (a+b)(a-b)',                                             description: 'Factorization identity',                     topicSlug: 'algebraic-expressions',   branchId: '2', tags: ['factorization', 'identity'] },
  { id: 'f-al-06', title: 'Perfect Square',            latex: '(a \\pm b)^2 = a^2 \\pm 2ab + b^2',                                 description: 'Perfect square expansion',                    topicSlug: 'algebraic-expressions',   branchId: '2', tags: ['identity', 'expansion'] },
  { id: 'f-al-07', title: 'Sum of Cubes',              latex: 'a^3 + b^3 = (a+b)(a^2 - ab + b^2)',                                  description: 'Sum of cubes factorization',                 topicSlug: 'algebraic-expressions',   branchId: '2', tags: ['factorization', 'cubes'] },
  { id: 'f-al-08', title: "Vieta's Formulas",         latex: 'x_1 + x_2 = -\\tfrac{b}{a}, \\quad x_1 x_2 = \\tfrac{c}{a}',       description: 'Root relationships for quadratic ax²+bx+c=0', topicSlug: 'quadratic-equations',   branchId: '2', tags: ['roots', 'vieta', 'quadratic'] },
  { id: 'f-al-09', title: 'Discriminant',              latex: '\\Delta = b^2 - 4ac',                                                description: 'Nature of roots: Δ>0 real, Δ=0 equal, Δ<0 complex', topicSlug: 'quadratic-equations', branchId: '2', tags: ['discriminant', 'quadratic'] },
  { id: 'f-al-10', title: 'Infinite GP Sum',           latex: 'S_\\infty = \\dfrac{a}{1-r}, \\quad |r| < 1',                       description: 'Sum of infinite geometric series',            topicSlug: 'sequences-series',        branchId: '2', tags: ['infinite', 'GP', 'convergence'] },

  // ── TRIGONOMETRY ────────────────────────────────────────────────
  { id: 'f-tr-01', title: 'Pythagorean Identity',      latex: '\\sin^2\\theta + \\cos^2\\theta = 1',                                description: 'Fundamental trig identity',                   topicSlug: 'trig-identities',         branchId: '4', tags: ['identity', 'pythagorean'] },
  { id: 'f-tr-02', title: 'Tan Identity',              latex: '1 + \\tan^2\\theta = \\sec^2\\theta',                               description: 'Derived from Pythagorean identity',           topicSlug: 'trig-identities',         branchId: '4', tags: ['identity', 'tan', 'sec'] },
  { id: 'f-tr-03', title: 'Sine Rule',                 latex: '\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C}',   description: 'Ratio of side to opposite angle sine',        topicSlug: 'trig-ratios',             branchId: '4', tags: ['sine rule', 'triangle'] },
  { id: 'f-tr-04', title: 'Cosine Rule',               latex: 'c^2 = a^2 + b^2 - 2ab\\cos C',                                      description: 'Generalization of Pythagorean theorem',       topicSlug: 'trig-ratios',             branchId: '4', tags: ['cosine rule', 'triangle'] },
  { id: 'f-tr-05', title: 'Sin Addition Formula',      latex: '\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B',             description: 'Sine of sum or difference',                   topicSlug: 'trig-identities',         branchId: '4', tags: ['addition', 'compound'] },
  { id: 'f-tr-06', title: 'Cos Addition Formula',      latex: '\\cos(A \\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B',             description: 'Cosine of sum or difference',                 topicSlug: 'trig-identities',         branchId: '4', tags: ['addition', 'compound'] },
  { id: 'f-tr-07', title: 'Double Angle — Sin',        latex: '\\sin 2\\theta = 2\\sin\\theta\\cos\\theta',                         description: 'Sine double angle formula',                   topicSlug: 'trig-identities',         branchId: '4', tags: ['double angle'] },
  { id: 'f-tr-08', title: 'Double Angle — Cos',        latex: '\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta',                  description: 'Cosine double angle formula',                 topicSlug: 'trig-identities',         branchId: '4', tags: ['double angle'] },

  // ── CALCULUS ────────────────────────────────────────────────────
  { id: 'f-ca-01', title: 'Limit Definition of Derivative', latex: "f^{\\prime}(x) = \\lim_{h \\to 0} \\dfrac{f(x+h) - f(x)}{h}",          description: 'First principles definition',                 topicSlug: 'differentiation',         branchId: '5', tags: ['derivative', 'limit', 'first principles'] },
  { id: 'f-ca-02', title: 'Power Rule',                latex: '\\dfrac{d}{dx}(x^n) = nx^{n-1}',                                    description: 'Derivative of x^n',                          topicSlug: 'differentiation',         branchId: '5', tags: ['derivative', 'power rule'] },
  { id: 'f-ca-03', title: 'Product Rule',              latex: "(uv)' = u'v + uv'",                                            description: 'Derivative of product of two functions',      topicSlug: 'differentiation',         branchId: '5', tags: ['derivative', 'product rule'] },
  { id: 'f-ca-04', title: 'Quotient Rule',             latex: "\\left(\\dfrac{u}{v}\\right)^{\\prime} = \\dfrac{u^{\\prime}v - uv^{\\prime}}{v^2}",           description: 'Derivative of quotient',                     topicSlug: 'differentiation',         branchId: '5', tags: ['derivative', 'quotient rule'] },
  { id: 'f-ca-05', title: 'Chain Rule',                latex: '\\dfrac{dy}{dx} = \\dfrac{dy}{du} \\cdot \\dfrac{du}{dx}',          description: 'Derivative of composite function',            topicSlug: 'differentiation',         branchId: '5', tags: ['derivative', 'chain rule', 'composite'] },
  { id: 'f-ca-06', title: 'Fundamental Theorem of Calculus', latex: '\\int_a^b f(x)\\,dx = F(b) - F(a)',                           description: 'Connects differentiation and integration',    topicSlug: 'definite-integration',    branchId: '5', tags: ['FTC', 'integral', 'antiderivative'] },
  { id: 'f-ca-07', title: 'Integration by Parts',      latex: "\\int u\\,dv = uv - \\int v\\,du",                                  description: 'Integration technique for products',          topicSlug: 'indefinite-integration',  branchId: '5', tags: ['integration', 'by parts'] },
  { id: 'f-ca-08', title: 'Power Rule (Integration)',  latex: '\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1} + C, \\quad n \\neq -1',   description: 'Antiderivative of x^n',                      topicSlug: 'indefinite-integration',  branchId: '5', tags: ['integration', 'power rule'] },
  { id: 'f-ca-09', title: "L'Hôpital's Rule",       latex: '\\lim_{x\\to a}\\dfrac{f(x)}{g(x)} = \\lim_{x\\to a}\\dfrac{f\'(x)}{g\'(x)}', description: 'For 0/0 or ∞/∞ indeterminate forms', topicSlug: 'limits', branchId: '5', tags: ['limit', 'LHopital'] },
  { id: 'f-ca-10', title: 'Taylor Series',             latex: 'f(x) = \\sum_{n=0}^{\\infty} \\dfrac{f^{(n)}(a)}{n!}(x-a)^n',     description: 'Infinite series expansion around point a',    topicSlug: 'indefinite-integration',  branchId: '5', tags: ['series', 'Taylor', 'expansion'] },

  // ── GEOMETRY ────────────────────────────────────────────────────
  { id: 'f-ge-01', title: 'Pythagorean Theorem',       latex: 'a^2 + b^2 = c^2',                                                   description: 'Right triangle side relationship',            topicSlug: 'triangles',               branchId: '3', tags: ['triangle', 'Pythagoras'] },
  { id: 'f-ge-02', title: 'Area of Triangle',          latex: 'A = \\dfrac{1}{2}bh = \\dfrac{1}{2}ab\\sin C',                     description: 'Area using base-height or two sides',         topicSlug: 'triangles',               branchId: '3', tags: ['area', 'triangle'] },
  { id: 'f-ge-03', title: "Heron's Formula",          latex: 'A = \\sqrt{s(s-a)(s-b)(s-c)}, \\quad s=\\dfrac{a+b+c}{2}',        description: 'Triangle area from three sides',              topicSlug: 'triangles',               branchId: '3', tags: ['area', 'triangle', 'Heron'] },
  { id: 'f-ge-04', title: 'Circle Area',               latex: 'A = \\pi r^2',                                                      description: 'Area of a circle',                           topicSlug: 'circles',                 branchId: '3', tags: ['circle', 'area'] },
  { id: 'f-ge-05', title: 'Circle Circumference',      latex: 'C = 2\\pi r',                                                       description: 'Perimeter of a circle',                      topicSlug: 'circles',                 branchId: '3', tags: ['circle', 'circumference'] },
  { id: 'f-ge-06', title: 'Distance Formula',          latex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}',                           description: 'Distance between two points',                topicSlug: 'coordinate-geometry',     branchId: '3', tags: ['distance', 'coordinate'] },
  { id: 'f-ge-07', title: 'Midpoint Formula',          latex: 'M = \\left(\\dfrac{x_1+x_2}{2},\\, \\dfrac{y_1+y_2}{2}\\right)', description: 'Midpoint of a line segment',                 topicSlug: 'coordinate-geometry',     branchId: '3', tags: ['midpoint', 'coordinate'] },
  { id: 'f-ge-08', title: 'Slope of a Line',           latex: 'm = \\dfrac{y_2 - y_1}{x_2 - x_1}',                               description: 'Gradient of a straight line',                topicSlug: 'coordinate-geometry',     branchId: '3', tags: ['slope', 'gradient', 'line'] },

  // ── LINEAR ALGEBRA ───────────────────────────────────────────────
  { id: 'f-la-01', title: 'Dot Product',               latex: '\\mathbf{a} \\cdot \\mathbf{b} = |\\mathbf{a}||\\mathbf{b}|\\cos\\theta', description: 'Scalar product of two vectors',        topicSlug: 'vectors',                 branchId: '6', tags: ['dot product', 'vectors'] },
  { id: 'f-la-02', title: 'Cross Product Magnitude',   latex: '|\\mathbf{a} \\times \\mathbf{b}| = |\\mathbf{a}||\\mathbf{b}|\\sin\\theta', description: 'Magnitude of cross product',       topicSlug: 'vectors',                 branchId: '6', tags: ['cross product', 'vectors'] },
  { id: 'f-la-03', title: 'Determinant (2×2)',         latex: '\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix} = ad - bc',           description: '2×2 matrix determinant',                     topicSlug: 'matrix-operations',       branchId: '6', tags: ['determinant', 'matrix'] },
  { id: 'f-la-04', title: 'Eigenvalue Equation',       latex: 'A\\mathbf{v} = \\lambda\\mathbf{v}',                               description: 'Eigenvalue λ and eigenvector v of matrix A',  topicSlug: 'eigenvalues',             branchId: '6', tags: ['eigenvalue', 'eigenvector'] },

  // ── STATISTICS ───────────────────────────────────────────────────
  { id: 'f-st-01', title: 'Mean',                      latex: '\\bar{x} = \\dfrac{1}{n}\\sum_{i=1}^{n} x_i',                      description: 'Arithmetic mean of a dataset',               topicSlug: 'descriptive-stats',       branchId: '7', tags: ['mean', 'average'] },
  { id: 'f-st-02', title: 'Variance',                  latex: '\\sigma^2 = \\dfrac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2',      description: 'Measure of spread',                          topicSlug: 'descriptive-stats',       branchId: '7', tags: ['variance', 'spread'] },
  { id: 'f-st-03', title: 'Standard Deviation',        latex: '\\sigma = \\sqrt{\\dfrac{1}{n}\\sum_{i=1}^{n}(x_i-\\bar{x})^2}',  description: 'Square root of variance',                    topicSlug: 'descriptive-stats',       branchId: '7', tags: ['std dev', 'spread'] },
  { id: 'f-st-04', title: "Bayes' Theorem",           latex: 'P(A|B) = \\dfrac{P(B|A)\\,P(A)}{P(B)}',                           description: 'Conditional probability update',             topicSlug: 'probability-basics',      branchId: '7', tags: ['Bayes', 'conditional', 'probability'] },
  { id: 'f-st-05', title: 'Normal Distribution PDF',   latex: 'f(x) = \\dfrac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}', description: 'Bell curve probability density', topicSlug: 'distributions', branchId: '7', tags: ['normal', 'Gaussian', 'PDF'] },
  { id: 'f-st-06', title: 'Binomial Probability',      latex: 'P(X=k) = \\binom{n}{k}p^k(1-p)^{n-k}',                            description: 'Probability of k successes in n trials',     topicSlug: 'distributions',           branchId: '7', tags: ['binomial', 'probability'] },
]

export function getFormulasByBranch(branchId: string): FormulaEntry[] {
  return FORMULAS.filter((f) => f.branchId === branchId)
}

export function getFormulasByTopic(topicSlug: string): FormulaEntry[] {
  return FORMULAS.filter((f) => f.topicSlug === topicSlug)
}

export function searchFormulas(query: string): FormulaEntry[] {
  const q = query.toLowerCase()
  return FORMULAS.filter(
    (f) =>
      f.title.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.tags.some((t) => t.toLowerCase().includes(q))
  )
}
