import { Topic, Level } from '@/types'

export const TOPICS: Topic[] = [
  // ── ARITHMETIC (School) ─────────────────────────────────────────
  { id: 'ar-01', slug: 'natural-numbers',      title: 'Natural Numbers',      titleBn: 'স্বাভাবিক সংখ্যা',   branchId: '1', level: 'SCHOOL',     order: 1 },
  { id: 'ar-02', slug: 'integers',             title: 'Integers',             titleBn: 'পূর্ণসংখ্যা',        branchId: '1', level: 'SCHOOL',     order: 2 },
  { id: 'ar-03', slug: 'fractions',            title: 'Fractions',            titleBn: 'ভগ্নাংশ',            branchId: '1', level: 'SCHOOL',     order: 3 },
  { id: 'ar-04', slug: 'decimals',             title: 'Decimals',             titleBn: 'দশমিক',              branchId: '1', level: 'SCHOOL',     order: 4 },
  { id: 'ar-05', slug: 'percentages',          title: 'Percentages',          titleBn: 'শতকরা',              branchId: '1', level: 'SCHOOL',     order: 5 },
  { id: 'ar-06', slug: 'ratio-proportion',     title: 'Ratio & Proportion',   titleBn: 'অনুপাত ও সমানুপাত', branchId: '1', level: 'SCHOOL',     order: 6 },
  { id: 'ar-07', slug: 'hcf-lcm',             title: 'HCF & LCM',           titleBn: 'গ.সা.গু ও ল.সা.গু',  branchId: '1', level: 'SCHOOL',     order: 7 },
  { id: 'ar-08', slug: 'number-systems',       title: 'Number Systems',       titleBn: 'সংখ্যা পদ্ধতি',      branchId: '1', level: 'SCHOOL',     order: 8 },

  // ── ALGEBRA (School → University) ───────────────────────────────
  { id: 'al-01', slug: 'algebraic-expressions',title: 'Algebraic Expressions',titleBn: 'বীজগাণিতিক রাশি',   branchId: '2', level: 'SCHOOL',     order: 1 },
  { id: 'al-02', slug: 'linear-equations',     title: 'Linear Equations',     titleBn: 'রৈখিক সমীকরণ',      branchId: '2', level: 'SCHOOL',     order: 2 },
  { id: 'al-03', slug: 'quadratic-equations',  title: 'Quadratic Equations',  titleBn: 'দ্বিঘাত সমীকরণ',    branchId: '2', level: 'SCHOOL',     order: 3 },
  { id: 'al-04', slug: 'polynomials',          title: 'Polynomials',          titleBn: 'বহুপদী রাশি',        branchId: '2', level: 'COLLEGE',    order: 4 },
  { id: 'al-05', slug: 'sequences-series',     title: 'Sequences & Series',   titleBn: 'অনুক্রম ও ধারা',    branchId: '2', level: 'COLLEGE',    order: 5 },
  { id: 'al-06', slug: 'binomial-theorem',     title: 'Binomial Theorem',     titleBn: 'দ্বিপদী উপপাদ্য',   branchId: '2', level: 'COLLEGE',    order: 6 },
  { id: 'al-07', slug: 'matrices-determinants',title: 'Matrices & Determinants',titleBn:'ম্যাট্রিক্স ও নির্ণায়ক',branchId:'2',level:'COLLEGE', order: 7 },
  { id: 'al-08', slug: 'complex-numbers',      title: 'Complex Numbers',      titleBn: 'জটিল সংখ্যা',        branchId: '2', level: 'COLLEGE',    order: 8 },

  // ── GEOMETRY (School → University) ──────────────────────────────
  { id: 'ge-01', slug: 'basic-geometry',       title: 'Basic Geometry',       titleBn: 'মৌলিক জ্যামিতি',    branchId: '3', level: 'SCHOOL',     order: 1 },
  { id: 'ge-02', slug: 'triangles',            title: 'Triangles',            titleBn: 'ত্রিভুজ',            branchId: '3', level: 'SCHOOL',     order: 2 },
  { id: 'ge-03', slug: 'circles',              title: 'Circles',              titleBn: 'বৃত্ত',              branchId: '3', level: 'SCHOOL',     order: 3 },
  { id: 'ge-04', slug: 'coordinate-geometry',  title: 'Coordinate Geometry',  titleBn: 'স্থানাঙ্ক জ্যামিতি', branchId: '3', level: 'COLLEGE',    order: 4 },
  { id: 'ge-05', slug: 'conic-sections',       title: 'Conic Sections',       titleBn: 'কোণিক ছেদ',          branchId: '3', level: 'COLLEGE',    order: 5 },
  { id: 'ge-06', slug: '3d-geometry',          title: '3D Geometry',          titleBn: 'ত্রিমাত্রিক জ্যামিতি',branchId:'3', level: 'COLLEGE',    order: 6 },

  // ── TRIGONOMETRY ────────────────────────────────────────────────
  { id: 'tr-01', slug: 'trig-ratios',          title: 'Trigonometric Ratios', titleBn: 'ত্রিকোণমিতিক অনুপাত',branchId:'4', level: 'SCHOOL',     order: 1 },
  { id: 'tr-02', slug: 'trig-identities',      title: 'Trig Identities',      titleBn: 'ত্রিকোণমিতিক সমতা', branchId: '4', level: 'SCHOOL',     order: 2 },
  { id: 'tr-03', slug: 'trig-equations',       title: 'Trig Equations',       titleBn: 'ত্রিকোণমিতিক সমীকরণ',branchId:'4', level: 'COLLEGE',    order: 3 },
  { id: 'tr-04', slug: 'inverse-trig',         title: 'Inverse Trigonometry', titleBn: 'বিপরীত ত্রিকোণমিতি', branchId: '4', level: 'COLLEGE',    order: 4 },

  // ── CALCULUS ────────────────────────────────────────────────────
  { id: 'ca-01', slug: 'limits',               title: 'Limits',               titleBn: 'সীমা',               branchId: '5', level: 'COLLEGE',    order: 1 },
  { id: 'ca-02', slug: 'continuity',           title: 'Continuity',           titleBn: 'সাতত্য',             branchId: '5', level: 'COLLEGE',    order: 2 },
  { id: 'ca-03', slug: 'differentiation',      title: 'Differentiation',      titleBn: 'অবকলন',              branchId: '5', level: 'COLLEGE',    order: 3 },
  { id: 'ca-04', slug: 'applications-of-derivatives', title: 'Applications of Derivatives', titleBn: 'অবকলের প্রয়োগ', branchId: '5', level: 'COLLEGE', order: 4 },
  { id: 'ca-05', slug: 'indefinite-integration',title: 'Indefinite Integration',titleBn:'অনির্দিষ্ট যোগজীকরণ', branchId:'5', level: 'COLLEGE',   order: 5 },
  { id: 'ca-06', slug: 'definite-integration', title: 'Definite Integration', titleBn: 'নির্দিষ্ট যোগজীকরণ',  branchId: '5', level: 'COLLEGE',    order: 6 },
  { id: 'ca-07', slug: 'multivariable-calculus',title: 'Multivariable Calculus',titleBn:'বহুচলক ক্যালকুলাস',  branchId: '5', level: 'UNIVERSITY', order: 7 },
  { id: 'ca-08', slug: 'vector-calculus',      title: 'Vector Calculus',      titleBn: 'ভেক্টর ক্যালকুলাস',  branchId: '5', level: 'UNIVERSITY', order: 8 },

  // ── LINEAR ALGEBRA ───────────────────────────────────────────────
  { id: 'la-01', slug: 'vectors',              title: 'Vectors',              titleBn: 'ভেক্টর',             branchId: '6', level: 'COLLEGE',    order: 1 },
  { id: 'la-02', slug: 'matrix-operations',    title: 'Matrix Operations',    titleBn: 'ম্যাট্রিক্স ক্রিয়া', branchId: '6', level: 'COLLEGE',    order: 2 },
  { id: 'la-03', slug: 'systems-of-equations', title: 'Systems of Equations', titleBn: 'সমীকরণ তন্ত্র',      branchId: '6', level: 'COLLEGE',    order: 3 },
  { id: 'la-04', slug: 'vector-spaces',        title: 'Vector Spaces',        titleBn: 'ভেক্টর স্থান',        branchId: '6', level: 'UNIVERSITY', order: 4 },
  { id: 'la-05', slug: 'eigenvalues',          title: 'Eigenvalues & Eigenvectors', titleBn: 'স্বমান ও স্বভেক্টর', branchId: '6', level: 'UNIVERSITY', order: 5 },
  { id: 'la-06', slug: 'linear-transformations',title:'Linear Transformations',titleBn:'রৈখিক রূপান্তর',       branchId: '6', level: 'UNIVERSITY', order: 6 },

  // ── STATISTICS ───────────────────────────────────────────────────
  { id: 'st-01', slug: 'descriptive-stats',    title: 'Descriptive Statistics',titleBn: 'বর্ণনামূলক পরিসংখ্যান',branchId:'7', level: 'SCHOOL',    order: 1 },
  { id: 'st-02', slug: 'probability-basics',   title: 'Probability Basics',   titleBn: 'সম্ভাবনার মূল ধারণা', branchId: '7', level: 'SCHOOL',     order: 2 },
  { id: 'st-03', slug: 'distributions',        title: 'Probability Distributions', titleBn: 'সম্ভাবনা বন্টন', branchId: '7', level: 'COLLEGE',    order: 3 },
  { id: 'st-04', slug: 'hypothesis-testing',   title: 'Hypothesis Testing',   titleBn: 'অনুকল্প পরীক্ষণ',   branchId: '7', level: 'COLLEGE',    order: 4 },
  { id: 'st-05', slug: 'regression',           title: 'Regression Analysis',  titleBn: 'প্রত্যাবর্তন বিশ্লেষণ',branchId:'7', level: 'UNIVERSITY', order: 5 },

  // ── NUMBER THEORY ───────────────────────────────────────────────
  { id: 'nt-01', slug: 'divisibility',         title: 'Divisibility & Primes', titleBn: 'বিভাজ্যতা ও মৌলিক সংখ্যা', branchId: '9', level: 'SCHOOL', order: 1 },
  { id: 'nt-02', slug: 'modular-arithmetic',   title: 'Modular Arithmetic',   titleBn: 'মডুলার গাণিতিক',      branchId: '9', level: 'COLLEGE', order: 2 },
  { id: 'nt-03', slug: 'gcd-euclidean',        title: 'GCD & Euclidean Algorithm', titleBn: 'গ.সা.গু ও ইউক্লিডীয় অ্যালগরিদম', branchId: '9', level: 'COLLEGE', order: 3 },
  { id: 'nt-04', slug: 'diophantine-equations',title: 'Diophantine Equations', titleBn: 'ডায়োফ্যান্টাইন সমীকরণ', branchId: '9', level: 'COLLEGE', order: 4 },
  { id: 'nt-05', slug: 'congruences',          title: 'Congruences',          titleBn: 'সর্বসমতা',            branchId: '9', level: 'COLLEGE', order: 5 },
  { id: 'nt-06', slug: 'fermat-euler-theorems',title: "Fermat's & Euler's Theorems", titleBn: 'ফের্মা ও অয়লারের উপপাদ্য', branchId: '9', level: 'UNIVERSITY', order: 6 },
  { id: 'nt-07', slug: 'quadratic-residues',   title: 'Quadratic Residues',   titleBn: 'দ্বিঘাত অবশিষ্ট',      branchId: '9', level: 'UNIVERSITY', order: 7 },
  { id: 'nt-08', slug: 'prime-distribution',   title: 'Distribution of Primes', titleBn: 'মৌলিক সংখ্যার বিন্যাস', branchId: '9', level: 'UNIVERSITY', order: 8 },
  { id: 'nt-09', slug: 'continued-fractions',  title: 'Continued Fractions',  titleBn: 'ধারাবাহিক ভগ্নাংশ',     branchId: '9', level: 'ADVANCED', order: 9 },
  { id: 'nt-10', slug: 'cryptography-rsa',     title: 'Cryptography & RSA',   titleBn: 'ক্রিপ্টোগ্রাফি ও RSA', branchId: '9', level: 'ADVANCED', order: 10 },

  // ── DIFFERENTIAL EQUATIONS ──────────────────────────────────────
  { id: 'de-01', slug: 'first-order-odes',     title: 'First-Order ODEs',     titleBn: 'প্রথম ক্রমের অবকল সমীকরণ', branchId: '10', level: 'COLLEGE', order: 1 },
  { id: 'de-02', slug: 'separable-equations',  title: 'Separable Equations',  titleBn: 'বিচ্ছেদযোগ্য সমীকরণ',   branchId: '10', level: 'COLLEGE', order: 2 },
  { id: 'de-03', slug: 'linear-first-order',   title: 'Linear First-Order Equations', titleBn: 'রৈখিক প্রথম-ক্রম সমীকরণ', branchId: '10', level: 'COLLEGE', order: 3 },
  { id: 'de-04', slug: 'second-order-odes',    title: 'Second-Order Linear ODEs', titleBn: 'দ্বিতীয় ক্রমের রৈখিক সমীকরণ', branchId: '10', level: 'UNIVERSITY', order: 4 },
  { id: 'de-05', slug: 'homogeneous-equations',title: 'Homogeneous Equations', titleBn: 'সমঘাত সমীকরণ',         branchId: '10', level: 'UNIVERSITY', order: 5 },
  { id: 'de-06', slug: 'laplace-transforms',   title: 'Laplace Transforms',   titleBn: 'ল্যাপ্লাস রূপান্তর',     branchId: '10', level: 'UNIVERSITY', order: 6 },
  { id: 'de-07', slug: 'systems-of-odes',      title: 'Systems of ODEs',      titleBn: 'অবকল সমীকরণ তন্ত্র',    branchId: '10', level: 'UNIVERSITY', order: 7 },
  { id: 'de-08', slug: 'series-solutions',     title: 'Power Series Solutions', titleBn: 'ঘাত ধারা সমাধান',      branchId: '10', level: 'ADVANCED', order: 8 },
  { id: 'de-09', slug: 'pde-intro',            title: 'Introduction to PDEs', titleBn: 'আংশিক অবকল সমীকরণের ভূমিকা', branchId: '10', level: 'ADVANCED', order: 9 },
  { id: 'de-10', slug: 'boundary-value-problems', title: 'Boundary Value Problems', titleBn: 'সীমা মান সমস্যা',   branchId: '10', level: 'ADVANCED', order: 10 },

  // ── REAL ANALYSIS ────────────────────────────────────────────────
  { id: 'ra-01', slug: 'real-number-system',   title: 'The Real Number System', titleBn: 'বাস্তব সংখ্যা পদ্ধতি', branchId: '11', level: 'UNIVERSITY', order: 1 },
  { id: 'ra-02', slug: 'sequences-limits',     title: 'Sequences & Limits',   titleBn: 'অনুক্রম ও সীমা',        branchId: '11', level: 'UNIVERSITY', order: 2 },
  { id: 'ra-03', slug: 'epsilon-delta',        title: 'Epsilon-Delta Definitions', titleBn: 'এপসাইলন-ডেল্টা সংজ্ঞা', branchId: '11', level: 'UNIVERSITY', order: 3 },
  { id: 'ra-04', slug: 'continuity-analysis',  title: 'Continuity (Rigorous)', titleBn: 'সাতত্য (কঠোর সংজ্ঞা)',  branchId: '11', level: 'UNIVERSITY', order: 4 },
  { id: 'ra-05', slug: 'differentiability',    title: 'Differentiability',    titleBn: 'অবকলনযোগ্যতা',          branchId: '11', level: 'UNIVERSITY', order: 5 },
  { id: 'ra-06', slug: 'riemann-integration',  title: 'Riemann Integration',  titleBn: 'রিম্যান যোগজীকরণ',       branchId: '11', level: 'ADVANCED', order: 6 },
  { id: 'ra-07', slug: 'sequences-of-functions', title: 'Sequences of Functions', titleBn: 'ফাংশনের অনুক্রম',    branchId: '11', level: 'ADVANCED', order: 7 },
  { id: 'ra-08', slug: 'uniform-convergence',  title: 'Uniform Convergence',  titleBn: 'সুষম অভিসৃতি',           branchId: '11', level: 'ADVANCED', order: 8 },
  { id: 'ra-09', slug: 'metric-spaces',        title: 'Metric Spaces',        titleBn: 'মেট্রিক স্থান',          branchId: '11', level: 'ADVANCED', order: 9 },
  { id: 'ra-10', slug: 'compactness',          title: 'Compactness',          titleBn: 'সংকোচনতা',              branchId: '11', level: 'ADVANCED', order: 10 },

  // ── ABSTRACT ALGEBRA ─────────────────────────────────────────────
  { id: 'aa-01', slug: 'groups-intro',         title: 'Introduction to Groups', titleBn: 'গ্রুপের ভূমিকা',       branchId: '12', level: 'UNIVERSITY', order: 1 },
  { id: 'aa-02', slug: 'subgroups',            title: 'Subgroups',            titleBn: 'উপগ্রুপ',               branchId: '12', level: 'UNIVERSITY', order: 2 },
  { id: 'aa-03', slug: 'cyclic-groups',        title: 'Cyclic Groups',        titleBn: 'চক্রীয় গ্রুপ',          branchId: '12', level: 'UNIVERSITY', order: 3 },
  { id: 'aa-04', slug: 'permutation-groups',   title: 'Permutation Groups',   titleBn: 'পারমুটেশন গ্রুপ',        branchId: '12', level: 'UNIVERSITY', order: 4 },
  { id: 'aa-05', slug: 'homomorphisms',        title: 'Homomorphisms & Isomorphisms', titleBn: 'হোমোমরফিজম ও আইসোমরফিজম', branchId: '12', level: 'ADVANCED', order: 5 },
  { id: 'aa-06', slug: 'rings-intro',          title: 'Introduction to Rings', titleBn: 'রিং-এর ভূমিকা',         branchId: '12', level: 'ADVANCED', order: 6 },
  { id: 'aa-07', slug: 'fields-intro',         title: 'Introduction to Fields', titleBn: 'ফিল্ডের ভূমিকা',       branchId: '12', level: 'ADVANCED', order: 7 },
  { id: 'aa-08', slug: 'polynomial-rings',     title: 'Polynomial Rings',     titleBn: 'বহুপদী রিং',            branchId: '12', level: 'ADVANCED', order: 8 },
  { id: 'aa-09', slug: 'galois-theory-intro',  title: 'Introduction to Galois Theory', titleBn: 'গালোয়া তত্ত্বের ভূমিকা', branchId: '12', level: 'RESEARCH', order: 9 },
  { id: 'aa-10', slug: 'group-actions',        title: 'Group Actions',        titleBn: 'গ্রুপ ক্রিয়া',           branchId: '12', level: 'RESEARCH', order: 10 },

  // ── TOPOLOGY ──────────────────────────────────────────────────────
  { id: 'tp-01', slug: 'topological-spaces',   title: 'Topological Spaces',   titleBn: 'টপোলজিক্যাল স্থান',      branchId: '13', level: 'ADVANCED', order: 1 },
  { id: 'tp-02', slug: 'open-closed-sets',     title: 'Open & Closed Sets',   titleBn: 'উন্মুক্ত ও বদ্ধ সেট',    branchId: '13', level: 'ADVANCED', order: 2 },
  { id: 'tp-03', slug: 'continuity-topology',  title: 'Continuity in Topology', titleBn: 'টপোলজিতে সাতত্য',      branchId: '13', level: 'ADVANCED', order: 3 },
  { id: 'tp-04', slug: 'connectedness',        title: 'Connectedness',        titleBn: 'সংযুক্ততা',             branchId: '13', level: 'ADVANCED', order: 4 },
  { id: 'tp-05', slug: 'compactness-topology', title: 'Compactness in Topology', titleBn: 'টপোলজিতে সংকোচনতা',   branchId: '13', level: 'ADVANCED', order: 5 },
  { id: 'tp-06', slug: 'homeomorphisms',       title: 'Homeomorphisms',       titleBn: 'হোমিওমরফিজম',           branchId: '13', level: 'ADVANCED', order: 6 },
  { id: 'tp-07', slug: 'product-topology',     title: 'Product Topology',     titleBn: 'গুণজ টপোলজি',           branchId: '13', level: 'RESEARCH', order: 7 },
  { id: 'tp-08', slug: 'quotient-spaces',      title: 'Quotient Spaces',      titleBn: 'ভাগফল স্থান',           branchId: '13', level: 'RESEARCH', order: 8 },
  { id: 'tp-09', slug: 'manifolds-intro',      title: 'Introduction to Manifolds', titleBn: 'ম্যানিফোল্ডের ভূমিকা', branchId: '13', level: 'RESEARCH', order: 9 },
  { id: 'tp-10', slug: 'metrization',          title: 'Metrization Theorems', titleBn: 'মেট্রিকীকরণ উপপাদ্য',    branchId: '13', level: 'RESEARCH', order: 10 },

  // ── COMPLEX ANALYSIS ─────────────────────────────────────────────
  { id: 'cx-01', slug: 'complex-plane',        title: 'The Complex Plane',    titleBn: 'জটিল সমতল',             branchId: '14', level: 'UNIVERSITY', order: 1 },
  { id: 'cx-02', slug: 'analytic-functions',   title: 'Analytic Functions',   titleBn: 'বিশ্লেষণী ফাংশন',        branchId: '14', level: 'UNIVERSITY', order: 2 },
  { id: 'cx-03', slug: 'cauchy-riemann',       title: 'Cauchy-Riemann Equations', titleBn: 'কশি-রিম্যান সমীকরণ',  branchId: '14', level: 'UNIVERSITY', order: 3 },
  { id: 'cx-04', slug: 'complex-integration',  title: 'Complex Integration',  titleBn: 'জটিল যোগজীকরণ',          branchId: '14', level: 'ADVANCED', order: 4 },
  { id: 'cx-05', slug: 'cauchy-integral-theorem', title: "Cauchy's Integral Theorem", titleBn: 'কশির যোগজ উপপাদ্য', branchId: '14', level: 'ADVANCED', order: 5 },
  { id: 'cx-06', slug: 'power-series-complex', title: 'Power Series & Taylor Series', titleBn: 'ঘাত ধারা ও টেলর ধারা', branchId: '14', level: 'ADVANCED', order: 6 },
  { id: 'cx-07', slug: 'laurent-series',       title: 'Laurent Series',       titleBn: 'লরেন্ট ধারা',            branchId: '14', level: 'ADVANCED', order: 7 },
  { id: 'cx-08', slug: 'residues-poles',       title: 'Residues & Poles',     titleBn: 'অবশিষ্ট ও পোল',          branchId: '14', level: 'ADVANCED', order: 8 },
  { id: 'cx-09', slug: 'residue-theorem',      title: 'The Residue Theorem',  titleBn: 'অবশিষ্ট উপপাদ্য',        branchId: '14', level: 'RESEARCH', order: 9 },
  { id: 'cx-10', slug: 'conformal-mapping',    title: 'Conformal Mapping',    titleBn: 'কনফরমাল ম্যাপিং',        branchId: '14', level: 'RESEARCH', order: 10 },

  // ── NUMERICAL METHODS ────────────────────────────────────────────
  { id: 'nm-01', slug: 'error-analysis',       title: 'Error Analysis',       titleBn: 'ত্রুটি বিশ্লেষণ',        branchId: '15', level: 'UNIVERSITY', order: 1 },
  { id: 'nm-02', slug: 'root-finding',         title: 'Root-Finding Methods', titleBn: 'মূল নির্ণয় পদ্ধতি',      branchId: '15', level: 'UNIVERSITY', order: 2 },
  { id: 'nm-03', slug: 'newton-raphson',       title: 'Newton-Raphson Method', titleBn: 'নিউটন-রাফসন পদ্ধতি',     branchId: '15', level: 'UNIVERSITY', order: 3 },
  { id: 'nm-04', slug: 'interpolation',        title: 'Interpolation',        titleBn: 'ইন্টারপোলেশন',           branchId: '15', level: 'UNIVERSITY', order: 4 },
  { id: 'nm-05', slug: 'numerical-integration',title: 'Numerical Integration', titleBn: 'সাংখ্যিক যোগজীকরণ',      branchId: '15', level: 'UNIVERSITY', order: 5 },
  { id: 'nm-06', slug: 'numerical-differentiation', title: 'Numerical Differentiation', titleBn: 'সাংখ্যিক অবকলন', branchId: '15', level: 'ADVANCED', order: 6 },
  { id: 'nm-07', slug: 'euler-method',         title: "Euler's Method for ODEs", titleBn: 'অবকল সমীকরণে অয়লার পদ্ধতি', branchId: '15', level: 'ADVANCED', order: 7 },
  { id: 'nm-08', slug: 'runge-kutta',          title: 'Runge-Kutta Methods',  titleBn: 'রুঙ্গে-কুট্টা পদ্ধতি',    branchId: '15', level: 'ADVANCED', order: 8 },
  { id: 'nm-09', slug: 'linear-system-solving',title: 'Solving Linear Systems Numerically', titleBn: 'সাংখ্যিকভাবে রৈখিক তন্ত্র সমাধান', branchId: '15', level: 'ADVANCED', order: 9 },
  { id: 'nm-10', slug: 'matrix-decomposition', title: 'Matrix Decomposition Methods', titleBn: 'ম্যাট্রিক্স বিভাজন পদ্ধতি', branchId: '15', level: 'ADVANCED', order: 10 },

  // ── SET THEORY ────────────────────────────────────────────────────
  { id: 'se-01', slug: 'sets-basics',          title: 'Sets & Set Operations', titleBn: 'সেট ও সেট ক্রিয়া',       branchId: '16', level: 'SCHOOL', order: 1 },
  { id: 'se-02', slug: 'relations',            title: 'Relations',            titleBn: 'সম্পর্ক',               branchId: '16', level: 'COLLEGE', order: 2 },
  { id: 'se-03', slug: 'functions-set-theory', title: 'Functions (Set-Theoretic View)', titleBn: 'ফাংশন (সেট-তাত্ত্বিক দৃষ্টিভঙ্গি)', branchId: '16', level: 'COLLEGE', order: 3 },
  { id: 'se-04', slug: 'cardinality',          title: 'Cardinality',          titleBn: 'কার্ডিনালিটি',          branchId: '16', level: 'UNIVERSITY', order: 4 },
  { id: 'se-05', slug: 'countable-uncountable',title: 'Countable & Uncountable Sets', titleBn: 'গণনাযোগ্য ও অগণনাযোগ্য সেট', branchId: '16', level: 'UNIVERSITY', order: 5 },
  { id: 'se-06', slug: 'axioms-of-set-theory', title: 'Axioms of Set Theory (ZFC)', titleBn: 'সেট তত্ত্বের স্বতঃসিদ্ধ (ZFC)', branchId: '16', level: 'ADVANCED', order: 6 },
  { id: 'se-07', slug: 'axiom-of-choice',      title: 'Axiom of Choice',      titleBn: 'পছন্দের স্বতঃসিদ্ধ',      branchId: '16', level: 'ADVANCED', order: 7 },
  { id: 'se-08', slug: 'ordinal-numbers',      title: 'Ordinal Numbers',      titleBn: 'ক্রমসূচক সংখ্যা',         branchId: '16', level: 'ADVANCED', order: 8 },
  { id: 'se-09', slug: 'cardinal-arithmetic',  title: 'Cardinal Arithmetic',  titleBn: 'কার্ডিনাল গাণিতিক',       branchId: '16', level: 'RESEARCH', order: 9 },
  { id: 'se-10', slug: 'continuum-hypothesis', title: 'The Continuum Hypothesis', titleBn: 'কন্টিনিউয়াম হাইপোথিসিস', branchId: '16', level: 'RESEARCH', order: 10 },

  // ── FUNCTIONAL ANALYSIS ──────────────────────────────────────────
  { id: 'fa-01', slug: 'normed-vector-spaces', title: 'Normed Vector Spaces', titleBn: 'নর্মড ভেক্টর স্থান',      branchId: '17', level: 'ADVANCED', order: 1 },
  { id: 'fa-02', slug: 'banach-spaces',        title: 'Banach Spaces',        titleBn: 'বানাখ স্থান',            branchId: '17', level: 'ADVANCED', order: 2 },
  { id: 'fa-03', slug: 'hilbert-spaces',       title: 'Hilbert Spaces',       titleBn: 'হিলবার্ট স্থান',          branchId: '17', level: 'ADVANCED', order: 3 },
  { id: 'fa-04', slug: 'linear-operators',     title: 'Linear Operators',     titleBn: 'রৈখিক অপারেটর',          branchId: '17', level: 'ADVANCED', order: 4 },
  { id: 'fa-05', slug: 'bounded-operators',    title: 'Bounded Operators',    titleBn: 'সীমাবদ্ধ অপারেটর',        branchId: '17', level: 'RESEARCH', order: 5 },
  { id: 'fa-06', slug: 'dual-spaces',          title: 'Dual Spaces',          titleBn: 'দ্বৈত স্থান',            branchId: '17', level: 'RESEARCH', order: 6 },
  { id: 'fa-07', slug: 'hahn-banach',          title: 'Hahn-Banach Theorem',  titleBn: 'হান-বানাখ উপপাদ্য',       branchId: '17', level: 'RESEARCH', order: 7 },
  { id: 'fa-08', slug: 'spectral-theory',      title: 'Spectral Theory',      titleBn: 'স্পেক্ট্রাল তত্ত্ব',      branchId: '17', level: 'RESEARCH', order: 8 },

  // ── MEASURE THEORY ────────────────────────────────────────────────
  { id: 'mt-01', slug: 'sigma-algebras',       title: 'Sigma-Algebras',       titleBn: 'সিগমা-বীজগণিত',          branchId: '18', level: 'ADVANCED', order: 1 },
  { id: 'mt-02', slug: 'measures',             title: 'Measures',             titleBn: 'পরিমাপ',                branchId: '18', level: 'ADVANCED', order: 2 },
  { id: 'mt-03', slug: 'lebesgue-measure',     title: 'Lebesgue Measure',     titleBn: 'লেবেগ পরিমাপ',           branchId: '18', level: 'ADVANCED', order: 3 },
  { id: 'mt-04', slug: 'measurable-functions', title: 'Measurable Functions', titleBn: 'পরিমাপযোগ্য ফাংশন',       branchId: '18', level: 'RESEARCH', order: 4 },
  { id: 'mt-05', slug: 'lebesgue-integration', title: 'Lebesgue Integration', titleBn: 'লেবেগ যোগজীকরণ',          branchId: '18', level: 'RESEARCH', order: 5 },
  { id: 'mt-06', slug: 'convergence-theorems', title: 'Convergence Theorems', titleBn: 'অভিসৃতি উপপাদ্য',         branchId: '18', level: 'RESEARCH', order: 6 },
  { id: 'mt-07', slug: 'lp-spaces',            title: 'Lp Spaces',            titleBn: 'Lp স্থান',              branchId: '18', level: 'RESEARCH', order: 7 },
  { id: 'mt-08', slug: 'probability-measures', title: 'Probability as Measure', titleBn: 'পরিমাপ হিসেবে সম্ভাবনা', branchId: '18', level: 'RESEARCH', order: 8 },

  // ── CATEGORY THEORY ───────────────────────────────────────────────
  { id: 'ct-01', slug: 'categories-basics',    title: 'Categories, Objects & Morphisms', titleBn: 'ক্যাটাগরি, অবজেক্ট ও মরফিজম', branchId: '19', level: 'RESEARCH', order: 1 },
  { id: 'ct-02', slug: 'functors',             title: 'Functors',             titleBn: 'ফাংটর',                 branchId: '19', level: 'RESEARCH', order: 2 },
  { id: 'ct-03', slug: 'natural-transformations', title: 'Natural Transformations', titleBn: 'স্বাভাবিক রূপান্তর', branchId: '19', level: 'RESEARCH', order: 3 },
  { id: 'ct-04', slug: 'limits-colimits',      title: 'Limits & Colimits',    titleBn: 'সীমা ও কোলিমিট',         branchId: '19', level: 'RESEARCH', order: 4 },
  { id: 'ct-05', slug: 'universal-properties', title: 'Universal Properties', titleBn: 'সার্বজনীন বৈশিষ্ট্য',      branchId: '19', level: 'RESEARCH', order: 5 },
  { id: 'ct-06', slug: 'adjoint-functors',     title: 'Adjoint Functors',     titleBn: 'অ্যাডজয়েন্ট ফাংটর',       branchId: '19', level: 'RESEARCH', order: 6 },
  { id: 'ct-07', slug: 'monads',               title: 'Monads',               titleBn: 'মোনাড',                 branchId: '19', level: 'RESEARCH', order: 7 },

  // ── ALGEBRAIC TOPOLOGY ────────────────────────────────────────────
  { id: 'at-01', slug: 'homotopy',             title: 'Homotopy',             titleBn: 'হোমোটোপি',              branchId: '20', level: 'RESEARCH', order: 1 },
  { id: 'at-02', slug: 'fundamental-group',    title: 'The Fundamental Group', titleBn: 'মৌলিক গ্রুপ',           branchId: '20', level: 'RESEARCH', order: 2 },
  { id: 'at-03', slug: 'covering-spaces',      title: 'Covering Spaces',      titleBn: 'আচ্ছাদন স্থান',          branchId: '20', level: 'RESEARCH', order: 3 },
  { id: 'at-04', slug: 'simplicial-complexes', title: 'Simplicial Complexes', titleBn: 'সিমপ্লিসিয়াল কমপ্লেক্স', branchId: '20', level: 'RESEARCH', order: 4 },
  { id: 'at-05', slug: 'homology',             title: 'Homology Groups',      titleBn: 'হোমোলজি গ্রুপ',          branchId: '20', level: 'RESEARCH', order: 5 },
  { id: 'at-06', slug: 'cohomology',           title: 'Cohomology',           titleBn: 'কোহোমোলজি',             branchId: '20', level: 'RESEARCH', order: 6 },
  { id: 'at-07', slug: 'euler-characteristic', title: 'Euler Characteristic', titleBn: 'অয়লার বৈশিষ্ট্যাঙ্ক',     branchId: '20', level: 'RESEARCH', order: 7 },

  // ── DIFFERENTIAL GEOMETRY ─────────────────────────────────────────
  { id: 'dg-01', slug: 'curves-space',         title: 'Curves in Space',      titleBn: 'স্থানে বক্ররেখা',        branchId: '21', level: 'ADVANCED', order: 1 },
  { id: 'dg-02', slug: 'curvature-torsion',    title: 'Curvature & Torsion',  titleBn: 'বক্রতা ও ব্যত্যয়',        branchId: '21', level: 'ADVANCED', order: 2 },
  { id: 'dg-03', slug: 'surfaces',             title: 'Surfaces & Parametrization', titleBn: 'পৃষ্ঠতল ও প্যারামিটারকরণ', branchId: '21', level: 'ADVANCED', order: 3 },
  { id: 'dg-04', slug: 'first-fundamental-form', title: 'First Fundamental Form', titleBn: 'প্রথম মৌলিক রূপ',      branchId: '21', level: 'RESEARCH', order: 4 },
  { id: 'dg-05', slug: 'gaussian-curvature',   title: 'Gaussian Curvature',   titleBn: 'গাউসীয় বক্রতা',          branchId: '21', level: 'RESEARCH', order: 5 },
  { id: 'dg-06', slug: 'geodesics',            title: 'Geodesics',            titleBn: 'জিওডেসিক',              branchId: '21', level: 'RESEARCH', order: 6 },
  { id: 'dg-07', slug: 'riemannian-manifolds', title: 'Riemannian Manifolds', titleBn: 'রিম্যানিয়ান ম্যানিফোল্ড', branchId: '21', level: 'RESEARCH', order: 7 },
]

export function getTopicsByBranch(branchId: string): Topic[] {
  return TOPICS.filter((t) => t.branchId === branchId).sort((a, b) => a.order - b.order)
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug)
}

export function getTopicsByLevel(level: Level): Topic[] {
  return TOPICS.filter((t) => t.level === level)
}
