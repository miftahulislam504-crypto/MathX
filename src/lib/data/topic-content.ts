// Rich content for each topic — explanation, examples, key concepts
export interface TopicContent {
  slug: string
  overview: string
  keyPoints: string[]
  example?: { problem: string; solution: string }
  prerequisites?: string[]
  nextTopics?: string[]
}

export const TOPIC_CONTENT: Record<string, TopicContent> = {
  'limits': {
    slug: 'limits',
    overview: 'A limit describes the value a function approaches as the input approaches some value. Limits are the foundation of calculus — both derivatives and integrals are defined using limits.',
    keyPoints: [
      'The limit \\(\\lim_{x \\to a} f(x) = L\\) means f(x) gets arbitrarily close to L as x → a',
      'The limit may exist even if f(a) is undefined',
      'Left-hand limit and right-hand limit must both equal L for the limit to exist',
      'Limits at infinity describe end behavior of functions',
    ],
    example: {
      problem: 'Find \\(\\lim_{x \\to 2} (x^2 + 3x - 1)\\)',
      solution: 'Since this is a polynomial, substitute directly: \\((2)^2 + 3(2) - 1 = 4 + 6 - 1 = 9\\)',
    },
    prerequisites: ['algebraic-expressions', 'linear-equations'],
    nextTopics: ['continuity', 'differentiation'],
  },
  'differentiation': {
    slug: 'differentiation',
    overview: 'Differentiation is the process of finding the derivative of a function — the instantaneous rate of change. It measures how a function changes as its input changes.',
    keyPoints: [
      'The derivative \\(f\'(x)\\) gives the slope of the tangent to f at x',
      'Power Rule: \\(\\frac{d}{dx}x^n = nx^{n-1}\\)',
      'Chain Rule handles composite functions: \\(\\frac{d}{dx}f(g(x)) = f\'(g(x)) \\cdot g\'(x)\\)',
      'Product and Quotient Rules handle products/ratios of functions',
    ],
    example: {
      problem: 'Find the derivative of \\(f(x) = 3x^4 - 2x^2 + 5\\)',
      solution: 'Apply power rule term by term: \\(f\'(x) = 12x^3 - 4x + 0 = 12x^3 - 4x\\)',
    },
    prerequisites: ['limits', 'continuity'],
    nextTopics: ['applications-of-derivatives', 'indefinite-integration'],
  },
  'indefinite-integration': {
    slug: 'indefinite-integration',
    overview: 'Integration is the reverse of differentiation. An indefinite integral (antiderivative) of f(x) is a function F(x) such that F\'(x) = f(x). The constant C accounts for all possible antiderivatives.',
    keyPoints: [
      '\\(\\int f(x)\\,dx = F(x) + C\\) where \\(F\'(x) = f(x)\\)',
      'Power Rule: \\(\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C\\) for \\(n \\neq -1\\)',
      'Integration by parts: \\(\\int u\\,dv = uv - \\int v\\,du\\)',
      'Substitution: replace a complex expression with a single variable u',
    ],
    example: {
      problem: 'Find \\(\\int (4x^3 - 6x + 2)\\,dx\\)',
      solution: '\\(= x^4 - 3x^2 + 2x + C\\) (apply power rule to each term)',
    },
    prerequisites: ['differentiation'],
    nextTopics: ['definite-integration'],
  },
  'quadratic-equations': {
    slug: 'quadratic-equations',
    overview: 'A quadratic equation has the form ax² + bx + c = 0 where a ≠ 0. Quadratics appear everywhere — from projectile motion to optimization problems.',
    keyPoints: [
      'Standard form: \\(ax^2 + bx + c = 0\\)',
      'Quadratic formula: \\(x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\)',
      'Discriminant \\(\\Delta = b^2 - 4ac\\): if Δ > 0 two real roots, Δ = 0 one root, Δ < 0 complex roots',
      'Can also be solved by factoring or completing the square',
    ],
    example: {
      problem: 'Solve \\(x^2 - 5x + 6 = 0\\)',
      solution: 'Factor: \\((x-2)(x-3) = 0\\), so \\(x = 2\\) or \\(x = 3\\)',
    },
    prerequisites: ['linear-equations', 'algebraic-expressions'],
    nextTopics: ['polynomials', 'complex-numbers'],
  },
  'vectors': {
    slug: 'vectors',
    overview: 'Vectors are mathematical objects with both magnitude and direction. They are fundamental to physics, engineering, computer graphics, and machine learning.',
    keyPoints: [
      'A vector \\(\\mathbf{v} = (v_1, v_2, v_3)\\) in 3D space',
      'Magnitude: \\(|\\mathbf{v}| = \\sqrt{v_1^2 + v_2^2 + v_3^2}\\)',
      'Dot product: \\(\\mathbf{a} \\cdot \\mathbf{b} = a_1b_1 + a_2b_2 + a_3b_3\\)',
      'Cross product gives a vector perpendicular to both inputs',
    ],
    example: {
      problem: 'Find the dot product of \\(\\mathbf{a} = (2, 3)\\) and \\(\\mathbf{b} = (4, -1)\\)',
      solution: '\\(\\mathbf{a} \\cdot \\mathbf{b} = (2)(4) + (3)(-1) = 8 - 3 = 5\\)',
    },
    prerequisites: ['coordinate-geometry'],
    nextTopics: ['matrix-operations', 'vector-spaces'],
  },
}

export function getTopicContent(slug: string): TopicContent | null {
  return TOPIC_CONTENT[slug] ?? null
}
