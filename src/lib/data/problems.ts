export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'OLYMPIAD'
export type ProblemCategory = 'algebra' | 'geometry' | 'calculus' | 'number-theory' | 'combinatorics' | 'probability'

export interface Problem {
  id: string
  title: string
  statement: string
  hint: string
  solution: string
  difficulty: Difficulty
  category: ProblemCategory
  source?: string
  tags: string[]
}

export const PROBLEMS: Problem[] = [
  // ── ALGEBRA ──
  { id:'a-01', title:'Sum of squares', statement:'Find all integers n such that n² + (n+1)² = m² for some integer m.', hint:'Expand and look for Pythagorean triple patterns.', solution:'This gives 2n²+2n+1=m². The only solution is n=0 (0²+1²=1²) and by Pell equation analysis, infinitely many solutions exist. The smallest non-trivial: n=3 (9+16=25).', difficulty:'INTERMEDIATE', category:'algebra', source:'Classic', tags:['squares','integers','Diophantine'] },
  { id:'a-02', title:'Quadratic roots sum', statement:'If α and β are roots of x²−5x+6=0, find α³+β³.', hint:'Use Vieta\'s: α+β=5, αβ=6. Use the identity a³+b³=(a+b)³−3ab(a+b).', solution:'α+β=5, αβ=6. α³+β³=(α+β)³−3αβ(α+β)=125−3(6)(5)=125−90=35.', difficulty:'BEGINNER', category:'algebra', source:'School', tags:['vieta','quadratic','roots'] },
  { id:'a-03', title:'AM-GM inequality', statement:'Prove that for positive reals a, b: (a+b)/2 ≥ √(ab). When does equality hold?', hint:'Consider (√a−√b)² ≥ 0 and expand.', solution:'(√a−√b)²≥0 → a−2√(ab)+b≥0 → a+b≥2√(ab) → (a+b)/2≥√(ab). Equality holds iff √a=√b, i.e. a=b.', difficulty:'INTERMEDIATE', category:'algebra', source:'Classic', tags:['AM-GM','inequality','proof'] },
  { id:'a-04', title:'Polynomial identity', statement:'Factor completely: x⁴+4y⁴.', hint:'Sophie Germain identity: a⁴+4b⁴=(a²+2b²+2ab)(a²+2b²−2ab).', solution:'x⁴+4y⁴=(x²+2y²)²−(2xy)²=(x²+2y²+2xy)(x²+2y²−2xy). This is Sophie Germain\'s identity.', difficulty:'INTERMEDIATE', category:'algebra', source:'Competition', tags:['factoring','Sophie Germain','polynomial'] },
  { id:'a-05', title:'Functional equation', statement:'Find all functions f:ℝ→ℝ satisfying f(x+y)=f(x)+f(y) for all x,y∈ℝ.', hint:'This is Cauchy\'s functional equation. Start with f(0), then f(n), then f(q).', solution:'Setting x=y=0: f(0)=0. By induction f(n)=nf(1) for all integers. For rationals f(p/q)=p/q·f(1). Assuming continuity, f(x)=cx where c=f(1). Discontinuous solutions also exist (via Axiom of Choice).', difficulty:'ADVANCED', category:'algebra', source:'Analysis', tags:['Cauchy','functional equation','linear'] },

  // ── GEOMETRY ──
  { id:'g-01', title:'Median length formula', statement:'In triangle ABC with sides a, b, c, find the length of median from A to midpoint of BC.', hint:'Use the formula derived from Apollonius\'s theorem.', solution:'By Apollonius: m_a² = (2b²+2c²−a²)/4. So m_a = ½√(2b²+2c²−a²).', difficulty:'INTERMEDIATE', category:'geometry', source:'Classic', tags:['triangle','median','Apollonius'] },
  { id:'g-02', title:'Circle inscribed in triangle', statement:'A triangle has sides 13, 14, 15. Find the radius of the inscribed circle.', hint:'Use r = Area/s where s is the semi-perimeter.', solution:'s=(13+14+15)/2=21. Area=√(21×8×7×6)=√7056=84 (Heron). r=Area/s=84/21=4.', difficulty:'BEGINNER', category:'geometry', source:'Classic', tags:['incircle','Heron','area'] },
  { id:'g-03', title:'Angle bisector', statement:'Prove that the angle bisector from A in triangle ABC divides BC in the ratio AB:AC.', hint:'Use areas: the bisector divides the triangle into two triangles sharing the same height from A.', solution:'Let D be on BC where AD bisects angle A. Area(ABD)/Area(ACD)=BD/DC (same height from A). Also Area(ABD)/Area(ACD)=½·AB·AD·sin(A/2)/½·AC·AD·sin(A/2)=AB/AC. Therefore BD/DC=AB/AC.', difficulty:'INTERMEDIATE', category:'geometry', source:'Classic', tags:['angle bisector','triangle','ratio'] },
  { id:'g-04', title:'Ptolemy\'s theorem', statement:'A cyclic quadrilateral ABCD has AB=3, BC=5, CD=3, DA=5. Find AC if BD=7.', hint:'Ptolemy: AC·BD=AB·CD+BC·DA.', solution:'AC·BD=AB·CD+BC·DA. AC·7=3·3+5·5=9+25=34. AC=34/7≈4.857.', difficulty:'INTERMEDIATE', category:'geometry', source:'Competition', tags:['Ptolemy','cyclic','quadrilateral'] },

  // ── CALCULUS ──
  { id:'c-01', title:'Derivative from first principles', statement:'Using the limit definition, find the derivative of f(x)=x³.', hint:"f'(x) = lim_{h→0} [f(x+h)-f(x)]/h. Expand (x+h)³.", solution:"f'(x)=lim_{h→0}[(x+h)³−x³]/h=lim[(3x²h+3xh²+h³)/h]=lim[3x²+3xh+h²]=3x².", difficulty:'BEGINNER', category:'calculus', source:'School', tags:['derivative','first principles','limit'] },
  { id:'c-02', title:'Integration by parts', statement:'Evaluate ∫x·eˣ dx.', hint:'Let u=x, dv=eˣdx. Apply ∫u·dv = uv − ∫v·du.', solution:'u=x, dv=eˣdx → du=dx, v=eˣ. ∫x·eˣdx = x·eˣ−∫eˣdx = xeˣ−eˣ+C = eˣ(x−1)+C.', difficulty:'BEGINNER', category:'calculus', source:'School', tags:['integration','by parts','exponential'] },
  { id:'c-03', title:'Improper integral convergence', statement:'Determine whether ∫₁^∞ (1/xᵖ) dx converges, and find its value when it does.', hint:'Compare to the p-series. Integrate and take the limit.', solution:'∫₁^∞ x^(−p)dx = [x^(1−p)/(1−p)]₁^∞ for p≠1. Converges iff 1−p<0, i.e. p>1. Value: 0−1/(1−p)=1/(p−1). For p=1: ∫1/x dx=ln x → ∞ (diverges).', difficulty:'INTERMEDIATE', category:'calculus', source:'Analysis', tags:['improper integral','convergence','p-series'] },
  { id:'c-04', title:'Taylor series', statement:"Find the first four non-zero terms of the Taylor series for f(x)=sin(x) about x=0.", hint:"Compute f(0), f'(0), f''(0), f'''(0)...", solution:"sin(x)=x−x³/3!+x⁵/5!−x⁷/7!+... = Σ(−1)ⁿx^(2n+1)/(2n+1)! The first four terms: x−x³/6+x⁵/120−x⁷/5040.", difficulty:'INTERMEDIATE', category:'calculus', source:'Classic', tags:['Taylor','Maclaurin','series','sin'] },

  // ── NUMBER THEORY ──
  { id:'n-01', title:'Divisibility by 9', statement:'Prove that a positive integer is divisible by 9 if and only if the sum of its digits is divisible by 9.', hint:'Write n = a₀+10a₁+100a₂+... and note that 10≡1 (mod 9).', solution:'Since 10≡1 (mod 9), we have 10ᵏ≡1 (mod 9) for all k≥0. Thus n=Σaₖ·10ᵏ≡Σaₖ (mod 9). So 9|n iff 9|(sum of digits).', difficulty:'BEGINNER', category:'number-theory', source:'Classic', tags:['divisibility','modular arithmetic','digits'] },
  { id:'n-02', title:"Fermat's Little Theorem", statement:'Find the remainder when 7^100 is divided by 13.', hint:"Fermat: a^(p−1)≡1(mod p) for prime p and gcd(a,p)=1.", solution:'By Fermat: 7^12≡1(mod 13). 100=8×12+4. So 7^100=(7^12)^8·7^4≡1^8·7^4=2401≡2401 mod 13. 2401=184×13+9. Answer: 9.', difficulty:'INTERMEDIATE', category:'number-theory', source:'Competition', tags:['Fermat','modular arithmetic','remainder'] },
  { id:'n-03', title:'Infinite primes', statement:"Prove that there are infinitely many prime numbers (Euclid's proof).", hint:'Assume finitely many primes p₁,...,pₙ and consider N=p₁·p₂·...·pₙ+1.', solution:'Suppose primes are finite: p₁,...,pₙ. Let N=p₁p₂...pₙ+1. N>1 has a prime factor p. But p≠pᵢ for any i (since N≡1 mod pᵢ). Contradiction. So infinitely many primes exist.', difficulty:'INTERMEDIATE', category:'number-theory', source:'Euclid', tags:['primes','infinity','Euclid','proof'] },

  // ── COMBINATORICS ──
  { id:'co-01', title:'Handshake problem', statement:'In a party of n people, if every person shakes hands with every other person exactly once, how many handshakes occur?', hint:'Each pair of people shakes hands exactly once.', solution:'Choose 2 people from n: C(n,2)=n(n−1)/2. For example with 10 people: 45 handshakes.', difficulty:'BEGINNER', category:'combinatorics', source:'Classic', tags:['combinations','counting','C(n,2)'] },
  { id:'co-02', title:'Pigeonhole principle', statement:'Show that in any group of 13 people, at least two share a birth month.', hint:'There are 12 months and 13 people. Apply pigeonhole.', solution:'By the Pigeonhole Principle: 13 people across 12 months → at least ⌈13/12⌉=2 people share a month. (More generally: n+1 items in n categories → some category has ≥2 items.)', difficulty:'BEGINNER', category:'combinatorics', source:'Classic', tags:['pigeonhole','counting','months'] },
  { id:'co-03', title:'Catalan numbers', statement:"How many ways can a convex polygon with n+2 sides be triangulated?", hint:'This is the n-th Catalan number: Cₙ=C(2n,n)/(n+1).', solution:'The triangulation count is the n-th Catalan number: Cₙ=C(2n,n)/(n+1). For hexagon (n=4): C₄=14 triangulations.', difficulty:'ADVANCED', category:'combinatorics', source:'Competition', tags:['Catalan','polygon','triangulation'] },

  // ── PROBABILITY ──
  { id:'p-01', title:'Conditional probability', statement:'A bag has 3 red and 2 blue balls. Two are drawn without replacement. Given the first is red, find P(second is red).', hint:'After drawing 1 red, what remains?', solution:'After 1 red drawn: 2 red, 2 blue remain (4 total). P(2nd red|1st red)=2/4=1/2.', difficulty:'BEGINNER', category:'probability', source:'School', tags:['conditional','sampling','balls'] },
  { id:'p-02', title:'Expected value', statement:'Roll a fair die. You win $n if you roll n. What is the expected value?', hint:'E[X]=Σ x·P(X=x)', solution:'E[X]=1·(1/6)+2·(1/6)+3·(1/6)+4·(1/6)+5·(1/6)+6·(1/6)=(1+2+3+4+5+6)/6=21/6=$3.50', difficulty:'BEGINNER', category:'probability', source:'Classic', tags:['expected value','dice','uniform'] },
  { id:'p-03', title:"Bayes' theorem application", statement:'A disease affects 1% of the population. A test is 95% accurate. Given a positive test, find the probability of having the disease.', hint:"P(Disease|+)=P(+|Disease)·P(Disease)/P(+). Compute P(+)=P(+|D)P(D)+P(+|D')P(D').", solution:"P(D)=0.01, P(+|D)=0.95, P(+|D')=0.05. P(+)=0.95×0.01+0.05×0.99=0.0095+0.0495=0.059. P(D|+)=0.0095/0.059≈16.1%. Surprising? Base rate matters!", difficulty:'INTERMEDIATE', category:'probability', source:'Medical statistics', tags:["Bayes","conditional","false positive"] },
]

export function getProblemsByDifficulty(d: Difficulty) {
  return PROBLEMS.filter(p => p.difficulty === d)
}

export function getProblemsByCategory(c: ProblemCategory) {
  return PROBLEMS.filter(p => p.category === c)
}

export function searchProblems(q: string) {
  const ql = q.toLowerCase()
  return PROBLEMS.filter(p =>
    p.title.toLowerCase().includes(ql) ||
    p.statement.toLowerCase().includes(ql) ||
    p.tags.some(t => t.toLowerCase().includes(ql))
  )
}
