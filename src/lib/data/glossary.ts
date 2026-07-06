export interface GlossaryTerm {
  id: string
  term: string
  termBn?: string
  definition: string
  branchId?: string          // optional — some terms are cross-cutting (e.g. "function")
  relatedTerms?: string[]    // ids of related terms
}

export const GLOSSARY: GlossaryTerm[] = [
  { id: 'axiom', term: 'Axiom', termBn: 'স্বতঃসিদ্ধ', definition: 'A statement accepted as true without proof, used as a starting point for logical reasoning within a mathematical system.', relatedTerms: ['theorem', 'postulate'] },
  { id: 'theorem', term: 'Theorem', termBn: 'উপপাদ্য', definition: 'A statement that has been proven to be true using logical deduction from axioms and previously established theorems.', relatedTerms: ['axiom', 'proof', 'lemma'] },
  { id: 'lemma', term: 'Lemma', termBn: 'লেমা', definition: 'A minor theorem used as a stepping stone to prove a larger, more significant theorem.', relatedTerms: ['theorem', 'corollary'] },
  { id: 'corollary', term: 'Corollary', termBn: 'উপপ্রমেয়', definition: 'A statement that follows directly and immediately from a previously proven theorem, requiring little additional proof.', relatedTerms: ['theorem', 'lemma'] },
  { id: 'proof', term: 'Proof', termBn: 'প্রমাণ', definition: 'A logical argument that establishes the truth of a mathematical statement beyond any doubt, using accepted axioms and rules of inference.', relatedTerms: ['theorem', 'axiom'] },
  { id: 'conjecture', term: 'Conjecture', termBn: 'অনুমান', definition: 'A mathematical statement believed to be true based on preliminary evidence, but not yet proven.', relatedTerms: ['theorem', 'proof'] },
  { id: 'postulate', term: 'Postulate', termBn: 'স্বীকার্য', definition: 'A foundational assumption specific to a particular theory, similar to an axiom but typically tied to a specific subject like geometry.', branchId: '3', relatedTerms: ['axiom'] },
  { id: 'function', term: 'Function', termBn: 'ফাংশন', definition: 'A relation that assigns exactly one output value to each input value from a given set.', relatedTerms: ['domain', 'range', 'mapping'] },
  { id: 'domain', term: 'Domain', termBn: 'ডোমেইন', definition: 'The complete set of possible input values for which a function is defined.', relatedTerms: ['function', 'range'] },
  { id: 'range', term: 'Range', termBn: 'রেঞ্জ', definition: 'The complete set of all possible output values a function can produce.', relatedTerms: ['function', 'domain'] },
  { id: 'mapping', term: 'Mapping', termBn: 'ম্যাপিং', definition: 'A general term for a rule that associates elements of one set with elements of another, encompassing functions and relations.', relatedTerms: ['function'] },
  { id: 'derivative', term: 'Derivative', termBn: 'অবকল', definition: 'A measure of how a function changes as its input changes — the instantaneous rate of change, or slope of the tangent line at a point.', branchId: '5', relatedTerms: ['limit', 'differentiation'] },
  { id: 'integral', term: 'Integral', termBn: 'যোগজ', definition: 'A mathematical object representing accumulated area, quantity, or total change, computed as the limit of a sum.', branchId: '5', relatedTerms: ['derivative', 'antiderivative'] },
  { id: 'limit', term: 'Limit', termBn: 'সীমা', definition: 'The value a function or sequence approaches as its input or index approaches some target value.', branchId: '5', relatedTerms: ['derivative', 'continuity'] },
  { id: 'continuity', term: 'Continuity', termBn: 'সাতত্য', definition: 'A property of a function where small changes in input produce small changes in output, with no sudden jumps or breaks.', branchId: '5', relatedTerms: ['limit'] },
  { id: 'matrix', term: 'Matrix', termBn: 'ম্যাট্রিক্স', definition: 'A rectangular array of numbers arranged in rows and columns, used to represent linear transformations and systems of equations.', branchId: '6', relatedTerms: ['determinant', 'eigenvalue'] },
  { id: 'determinant', term: 'Determinant', termBn: 'নির্ণায়ক', definition: 'A scalar value computed from a square matrix that indicates whether the matrix is invertible and describes the scaling factor of the linear transformation it represents.', branchId: '6', relatedTerms: ['matrix'] },
  { id: 'eigenvalue', term: 'Eigenvalue', termBn: 'স্বমান', definition: 'A scalar λ such that a matrix A applied to a special vector v (the eigenvector) produces a scaled version of that same vector: Av = λv.', branchId: '6', relatedTerms: ['matrix', 'eigenvector'] },
  { id: 'eigenvector', term: 'Eigenvector', termBn: 'স্বভেক্টর', definition: 'A nonzero vector that only changes in scale (not direction) when a given linear transformation is applied to it.', branchId: '6', relatedTerms: ['eigenvalue', 'matrix'] },
  { id: 'vector-space', term: 'Vector Space', termBn: 'ভেক্টর স্থান', definition: 'A collection of objects (vectors) that can be added together and scaled by numbers, satisfying a specific set of algebraic rules.', branchId: '6', relatedTerms: ['matrix'] },
  { id: 'set', term: 'Set', termBn: 'সেট', definition: 'A well-defined collection of distinct objects, considered as an object in its own right.', branchId: '16', relatedTerms: ['subset', 'cardinality'] },
  { id: 'subset', term: 'Subset', termBn: 'উপসেট', definition: 'A set A is a subset of set B if every element of A is also an element of B.', branchId: '16', relatedTerms: ['set'] },
  { id: 'cardinality', term: 'Cardinality', termBn: 'কার্ডিনালিটি', definition: 'A measure of the "size" of a set — for finite sets, simply the number of elements; for infinite sets, a more general notion distinguishing different sizes of infinity.', branchId: '16', relatedTerms: ['set', 'countable'] },
  { id: 'countable', term: 'Countable Set', termBn: 'গণনাযোগ্য সেট', definition: 'A set whose elements can be put into a one-to-one correspondence with the natural numbers, meaning they can be listed in a sequence.', branchId: '16', relatedTerms: ['cardinality'] },
  { id: 'group', term: 'Group', termBn: 'গ্রুপ', definition: 'A set equipped with a single operation that combines any two elements to form a third, satisfying closure, associativity, identity, and invertibility.', branchId: '12', relatedTerms: ['ring', 'field'] },
  { id: 'ring', term: 'Ring', termBn: 'রিং', definition: 'An algebraic structure with two operations (typically addition and multiplication) satisfying specific compatibility rules, generalizing the arithmetic of integers.', branchId: '12', relatedTerms: ['group', 'field'] },
  { id: 'field', term: 'Field', termBn: 'ফিল্ড', definition: 'An algebraic structure where addition, subtraction, multiplication, and division (except by zero) are all well-defined and behave as expected, like the rational or real numbers.', branchId: '12', relatedTerms: ['ring', 'group'] },
  { id: 'prime', term: 'Prime Number', termBn: 'মৌলিক সংখ্যা', definition: 'A natural number greater than 1 that has no positive divisors other than 1 and itself.', branchId: '9', relatedTerms: ['divisibility'] },
  { id: 'divisibility', term: 'Divisibility', termBn: 'বিভাজ্যতা', definition: 'A relationship where one integer divides another exactly, leaving no remainder.', branchId: '9', relatedTerms: ['prime'] },
  { id: 'probability', term: 'Probability', termBn: 'সম্ভাবনা', definition: 'A numerical measure, between 0 and 1, of how likely an event is to occur.', branchId: '8', relatedTerms: ['random-variable', 'distribution'] },
  { id: 'random-variable', term: 'Random Variable', termBn: 'দৈব চলক', definition: 'A variable whose possible values are outcomes of a random phenomenon, assigning a number to each outcome of an experiment.', branchId: '8', relatedTerms: ['probability', 'distribution'] },
  { id: 'distribution', term: 'Probability Distribution', termBn: 'সম্ভাবনা বন্টন', definition: 'A function describing the likelihood of each possible outcome of a random variable.', branchId: '8', relatedTerms: ['random-variable', 'probability'] },
  { id: 'mean', term: 'Mean', termBn: 'গড়', definition: 'The average value of a dataset or random variable, computed by summing all values and dividing by the count.', branchId: '7', relatedTerms: ['variance', 'median'] },
  { id: 'variance', term: 'Variance', termBn: 'ভেদাঙ্ক', definition: 'A measure of how spread out a set of numbers is from their mean value.', branchId: '7', relatedTerms: ['mean', 'standard-deviation'] },
  { id: 'standard-deviation', term: 'Standard Deviation', termBn: 'আদর্শ বিচ্যুতি', definition: 'The square root of the variance, expressing spread in the same units as the original data.', branchId: '7', relatedTerms: ['variance'] },
  { id: 'topology', term: 'Topological Space', termBn: 'টপোলজিক্যাল স্থান', definition: 'A set equipped with a notion of "openness" that allows the study of continuity, convergence, and connectedness without reference to distance.', branchId: '13', relatedTerms: ['continuity'] },
  { id: 'compactness', term: 'Compactness', termBn: 'সংকোচনতা', definition: 'A topological property generalizing the idea of being "closed and bounded," guaranteeing that every open cover has a finite subcover.', branchId: '13', relatedTerms: ['topology'] },
  { id: 'manifold', term: 'Manifold', termBn: 'ম্যানিফোল্ড', definition: 'A space that locally resembles ordinary Euclidean space near each point, even if its global structure is more complex (like the surface of a sphere).', branchId: '21', relatedTerms: ['topology'] },
  { id: 'complex-number', term: 'Complex Number', termBn: 'জটিল সংখ্যা', definition: 'A number of the form a + bi, where a and b are real numbers and i is the imaginary unit satisfying i² = −1.', branchId: '14', relatedTerms: [] },
  { id: 'polynomial', term: 'Polynomial', termBn: 'বহুপদী', definition: 'An algebraic expression consisting of variables raised to non-negative integer powers, combined using addition, subtraction, and multiplication.', branchId: '2', relatedTerms: [] },
  { id: 'differential-equation', term: 'Differential Equation', termBn: 'অবকল সমীকরণ', definition: 'An equation that relates a function to its derivatives, describing how a quantity changes in relation to other variables.', branchId: '10', relatedTerms: ['derivative'] },
]

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find((g) => g.id === id)
}

export function searchGlossary(query: string): GlossaryTerm[] {
  const q = query.toLowerCase()
  return GLOSSARY.filter(
    (g) =>
      g.term.toLowerCase().includes(q) ||
      g.definition.toLowerCase().includes(q) ||
      (g.termBn ?? '').includes(query)
  )
}
