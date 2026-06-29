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
