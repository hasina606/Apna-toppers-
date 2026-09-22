import { StudentClass, Difficulty, Question, MathTopic, LevelConfig, SubjectId } from '../types';
import { GAME_LEVELS } from './levels';
import { CLASS_6_SOCIAL_SCIENCE_CHAPTERS } from '../data/class6SocialScienceData';

export { GAME_LEVELS };

// Helper to get random integer between min and max inclusive
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to shuffle an array
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Pick random element
export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Greatest common divisor
export function gcd(a: number, b: number): number {
  return b ? gcd(b, Math.abs(a % b)) : Math.abs(a);
}

// Simplify fraction
export function simplifyFraction(n: number, d: number): [number, number] {
  const g = gcd(n, d) || 1;
  return [n / g, d / g];
}

export function formatFraction(n: number, d: number): string {
  const [a, b] = simplifyFraction(n, d);
  return b === 1 ? String(a) : `${a}/${b}`;
}

// Generate realistic distractors for numeric answers
export function generateNumericDistractors(correct: number, count = 3): number[] {
  const distractors = new Set<number>();
  const deltas = [-1, 1, -2, 2, -10, 10, -5, 5, -3, 3, -11, 11, -20, 20];
  const shuffledDeltas = shuffle(deltas);

  for (const delta of shuffledDeltas) {
    const candidate = correct + delta;
    if (candidate !== correct && (correct >= 0 ? candidate >= 0 : true)) {
      distractors.add(candidate);
      if (distractors.size >= count) break;
    }
  }

  let offset = 1;
  while (distractors.size < count) {
    const alt1 = correct + offset * 2;
    const alt2 = correct - offset * 2;
    if (alt1 !== correct) distractors.add(alt1);
    if (distractors.size < count && alt2 !== correct && (correct >= 0 ? alt2 >= 0 : true)) {
      distractors.add(alt2);
    }
    offset++;
  }

  return Array.from(distractors).slice(0, count);
}

// Generate fraction distractors
export function generateFractionDistractors(n: number, d: number): string[] {
  const correct = formatFraction(n, d);
  const set = new Set<string>([correct]);
  const alts = [
    formatFraction(n + 1, d),
    formatFraction(Math.max(1, n - 1), d),
    formatFraction(n, d + 1),
    formatFraction(n + 2, d),
    formatFraction(n, Math.max(2, d - 1)),
    formatFraction(n + 1, d + 1),
  ];
  for (const a of shuffle(alts)) {
    if (a !== correct) set.add(a);
    if (set.size >= 4) break;
  }
  let k = 1;
  while (set.size < 4) {
    set.add(formatFraction(n + k * 2, d + 1));
    k++;
  }
  return shuffle(Array.from(set));
}

// Subject topics mapping
export const SUBJECT_TOPICS: Record<SubjectId, { id: string; label: string; icon: string }[]> = {
  maths: [
    { id: 'addition', label: 'Addition', icon: '➕' },
    { id: 'subtraction', label: 'Subtraction', icon: '➖' },
    { id: 'multiplication', label: 'Multiplication', icon: '✖️' },
    { id: 'division', label: 'Division', icon: '➗' },
    { id: 'tables', label: 'Times Tables', icon: '🔢' },
    { id: 'fractions', label: 'Fractions', icon: '🍕' },
    { id: 'decimals', label: 'Decimals', icon: '🔢' },
    { id: 'integers', label: 'Integers', icon: '🌡️' },
    { id: 'percentage', label: 'Percentages', icon: '％' },
    { id: 'algebra', label: 'Algebra', icon: '🧮' },
    { id: 'geometry', label: 'Geometry', icon: '📐' },
    { id: 'word_problems', label: 'Word Problems', icon: '📖' },
  ],
  english_grammar: [
    { id: 'articles', label: 'Articles (a, an, the)', icon: '📝' },
    { id: 'nouns', label: 'Nouns & Plurals', icon: '🏷️' },
    { id: 'pronouns', label: 'Pronouns', icon: '👤' },
    { id: 'verbs', label: 'Verbs & Action Words', icon: '🏃' },
    { id: 'tenses', label: 'Tenses', icon: '⏳' },
    { id: 'adjectives', label: 'Adjectives', icon: '🎨' },
    { id: 'prepositions', label: 'Prepositions', icon: '📍' },
    { id: 'conjunctions', label: 'Conjunctions', icon: '🔗' },
    { id: 'sentence_types', label: 'Sentence Types', icon: '💬' },
    { id: 'punctuation', label: 'Punctuation', icon: '❕' },
  ],
  english_speaking: [
    { id: 'greetings', label: 'Greetings & Goodbyes', icon: '👋' },
    { id: 'polite_words', label: 'Polite Words & Manners', icon: '🙏' },
    { id: 'introductions', label: 'Introducing Yourself', icon: '🤝' },
    { id: 'daily_talk', label: 'Daily Conversation', icon: '💬' },
    { id: 'asking_questions', label: 'Asking Questions', icon: '❓' },
    { id: 'common_phrases', label: 'Common Phrases', icon: '💡' },
    { id: 'opposites', label: 'Opposites & Vocab', icon: '↔️' },
    { id: 'verb_forms', label: 'Spoken Verb Forms', icon: '📖' },
  ],
  science: [
    { id: 'living_things', label: 'Living & Non-living', icon: '🌱' },
    { id: 'plants', label: 'Plants & Photosynthesis', icon: '🌿' },
    { id: 'animals', label: 'Animals & Habitats', icon: '🐾' },
    { id: 'human_body', label: 'Human Body & Organs', icon: '🫀' },
    { id: 'food_nutrition', label: 'Food & Nutrition', icon: '🍎' },
    { id: 'solar_system', label: 'Solar System & Planets', icon: '🪐' },
    { id: 'matter', label: 'Matter & States', icon: '🧊' },
    { id: 'water_air', label: 'Water & Air', icon: '💧' },
    { id: 'energy', label: 'Energy & Electricity', icon: '⚡' },
  ],
  social_science: [
    { id: 'ch1', label: 'সৌৰজগতত আমাৰ পৃথিৱী', icon: '🪐' },
    { id: 'ch2', label: 'পৃথিৱীৰ আকাৰ আৰু আকৃতি', icon: '🌍' },
    { id: 'ch3', label: 'পৃথিৱীৰ গতি', icon: '🔄' },
    { id: 'ch4', label: 'অক্ষৰেখা আৰু দ্ৰাঘিমাৰেখা', icon: '🌐' },
    { id: 'ch5', label: 'পৃথিৱীৰ প্ৰধান মণ্ডলসমূহ', icon: '🏔️' },
    { id: 'ch6', label: 'প্ৰধান ভূ-ৰূপসমূহ', icon: '🗺️' },
    { id: 'ch7', label: 'আমাৰ দেশ ভাৰতবৰ্ষ', icon: '🇮🇳' },
    { id: 'ch8', label: 'ভাৰতৰ জলবায়ু আৰু প্ৰাকৃতিক উদ্ভিদ', icon: '🌴' },
  ],
  hindi: [{ id: 'varnamala', label: 'Varnamala', icon: '🕉️' }],
  assamese: [{ id: 'bornomala', label: 'Bornomala', icon: '🪷' }],
  social: [{ id: 'maps_history', label: 'Maps & Heritage', icon: '🌍' }],
};

// -------------------------------------------------------------
// QUESTION GENERATION ENGINE (NURSERY TO CLASS 10)
// -------------------------------------------------------------

export function generateQuestionForStudent(
  studentClass: StudentClass,
  difficulty: Difficulty,
  preferredTopic?: MathTopic
): Question {
  return generateQuestionForSubjectAndStudent('maths', studentClass, difficulty, preferredTopic);
}

export function generateQuestionForSubjectAndStudent(
  subject: SubjectId,
  studentClass: StudentClass,
  difficulty: Difficulty,
  preferredTopic?: string | number
): Question {
  const id = `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Handle Non-Maths Subjects first
  if (subject === 'social_science' || subject === 'social') {
    return generateSocialScienceQuestion(id, studentClass, difficulty, preferredTopic);
  }
  const topicStr = preferredTopic !== undefined ? String(preferredTopic) : undefined;
  if (subject === 'english_grammar') {
    return generateGrammarQuestion(id, studentClass, difficulty, topicStr);
  }
  if (subject === 'english_speaking') {
    return generateSpeakingQuestion(id, studentClass, difficulty, topicStr);
  }
  if (subject === 'science') {
    return generateScienceQuestion(id, studentClass, difficulty, topicStr);
  }

  // Handle Early Childhood / Primary Math: Nursery, LKG, UKG
  if (studentClass === 'Nursery') {
    return generateNurseryQuestion(id, difficulty);
  }
  if (studentClass === 'LKG') {
    return generateLKGQuestion(id, difficulty);
  }
  if (studentClass === 'UKG') {
    return generateUKGQuestion(id, difficulty);
  }

  // Class 1 & 2
  if (studentClass === 1) {
    return generateClass1Question(id, difficulty, preferredTopic as MathTopic);
  }
  if (studentClass === 2) {
    return generateClass2Question(id, difficulty, preferredTopic as MathTopic);
  }

  // Class 8, 9, 10
  if (studentClass === 8) {
    return generateClass8Question(id, difficulty, preferredTopic as MathTopic);
  }
  if (studentClass === 9) {
    return generateClass9Question(id, difficulty, preferredTopic as MathTopic);
  }
  if (studentClass === 10) {
    return generateClass10Question(id, difficulty, preferredTopic as MathTopic);
  }

  // Class 3 to 7 standard engine
  return generateStandardClassQuestion(id, studentClass as number, difficulty, preferredTopic as MathTopic);
}

// -------------------------------------------------------------
// NURSERY QUESTIONS
// -------------------------------------------------------------
function generateNurseryQuestion(id: string, diff: Difficulty): Question {
  const types = ['count', 'shapes', 'size', 'color'];
  const type = pick(types);

  if (type === 'count') {
    const emojis = ['🍎', '⭐', '🎈', '🐱', '🚗', '🍭', '🐶', '⚽'];
    const em = pick(emojis);
    const count = diff === 'easy' ? randInt(1, 3) : randInt(2, 5);
    const display = Array(count).fill(em).join(' ');
    const distractors = generateNumericDistractors(count, 3).filter((d) => d > 0 && d <= 8);
    while (distractors.length < 3) distractors.push(distractors.length + 1);

    return {
      id,
      class: 'Nursery',
      topic: 'addition',
      topicTitle: 'Counting Objects',
      difficulty: diff,
      question: `How many ${em} can you count?\n\n${display}`,
      correctAnswer: count,
      options: shuffle([count, ...distractors.slice(0, 3)]),
      hint: `Point your finger at each ${em} and count 1, 2, 3...`,
      explanation: `There are exactly ${count} ${em} in the picture!`,
    };
  }

  if (type === 'shapes') {
    const shapes = [
      { name: 'Circle', emoji: '🔴', desc: 'round like a ball with no corners' },
      { name: 'Square', emoji: '🟦', desc: 'four equal sides' },
      { name: 'Triangle', emoji: '🔺', desc: 'three sharp corners' },
      { name: 'Star', emoji: '⭐', desc: 'five shining points' },
    ];
    const target = pick(shapes);
    const options = shuffle(shapes.map((s) => s.name));

    return {
      id,
      class: 'Nursery',
      topic: 'geometry',
      topicTitle: 'Fun Shapes',
      difficulty: diff,
      question: `Which shape is this?\n\n${target.emoji}`,
      correctAnswer: target.name,
      options,
      hint: `Look at its edges: it is ${target.desc}!`,
      explanation: `This shape is a ${target.name} (${target.emoji})!`,
    };
  }

  if (type === 'size') {
    const pairs = [
      { big: 'Elephant 🐘', small: 'Ant 🐜' },
      { big: 'Bus 🚌', small: 'Bicycle 🚲' },
      { big: 'Tree 🌳', small: 'Flower 🌸' },
      { big: 'Sun ☀️', small: 'Star ⭐' },
    ];
    const p = pick(pairs);
    const askBig = Math.random() > 0.5;

    return {
      id,
      class: 'Nursery',
      topic: 'addition',
      topicTitle: 'Big and Small',
      difficulty: diff,
      question: askBig ? `Which one is BIGGER?` : `Which one is SMALLER?`,
      correctAnswer: askBig ? p.big : p.small,
      options: shuffle([p.big, p.small, 'Both same', 'None']),
      hint: askBig ? 'Think about which one is huge!' : 'Think about which one is tiny!',
      explanation: `${askBig ? p.big : p.small} is ${askBig ? 'bigger' : 'smaller'}!`,
    };
  }

  // Next number / Color
  const n = randInt(1, 4);
  return {
    id,
    class: 'Nursery',
    topic: 'addition',
    topicTitle: 'Numbers 1 to 5',
    difficulty: diff,
    question: `What number comes after ${n}?\n\n1, 2, 3, 4, 5`,
    correctAnswer: n + 1,
    options: shuffle([n + 1, Math.max(1, n - 1), n + 2, n + 3]),
    hint: `Count out loud: ..., ${n}, ...`,
    explanation: `After ${n} comes ${n + 1}!`,
  };
}

// -------------------------------------------------------------
// LKG QUESTIONS
// -------------------------------------------------------------
function generateLKGQuestion(id: string, diff: Difficulty): Question {
  const type = pick(['add_picture', 'after_before', 'more_less', 'count_10']);

  if (type === 'add_picture') {
    const a = randInt(1, 3);
    const b = randInt(1, 3);
    const em = pick(['⭐', '🍎', '🎈', '🐱']);
    const lineA = Array(a).fill(em).join(' ');
    const lineB = Array(b).fill(em).join(' ');
    const correct = a + b;
    const distractors = generateNumericDistractors(correct, 3).filter((d) => d > 0);

    return {
      id,
      class: 'LKG',
      topic: 'addition',
      topicTitle: 'Picture Addition',
      difficulty: diff,
      question: `How many in total?\n\n${lineA}  +  ${lineB}`,
      correctAnswer: correct,
      options: shuffle([correct, ...distractors.slice(0, 3)]),
      hint: `Count all the ${em} together!`,
      explanation: `${a} + ${b} = ${correct} ${em} in total.`,
    };
  }

  if (type === 'after_before') {
    const n = randInt(2, 9);
    const isAfter = Math.random() > 0.5;
    const ans = isAfter ? n + 1 : n - 1;

    return {
      id,
      class: 'LKG',
      topic: 'addition',
      topicTitle: 'Number Sequences',
      difficulty: diff,
      question: isAfter ? `What number comes directly AFTER ${n}?` : `What number comes directly BEFORE ${n}?`,
      correctAnswer: ans,
      options: shuffle([ans, ans + 2, Math.max(1, ans - 2), n + 3]),
      hint: `Count: ${n - 1}, ${n}, ${n + 1}...`,
      explanation: `${ans} comes ${isAfter ? 'after' : 'before'} ${n}!`,
    };
  }

  // Count to 10
  const target = randInt(5, 10);
  const em = pick(['🟡', '🟢', '🔵', '🍬']);
  const display = Array(target).fill(em).join(' ');
  return {
    id,
    class: 'LKG',
    topic: 'addition',
    topicTitle: 'Count up to 10',
    difficulty: diff,
    question: `Count the ${em}:\n\n${display}`,
    correctAnswer: target,
    options: shuffle([target, target - 1, target + 1, target + 2]),
    hint: `Count them one by one carefully!`,
    explanation: `There are ${target} ${em}!`,
  };
}

// -------------------------------------------------------------
// UKG QUESTIONS
// -------------------------------------------------------------
function generateUKGQuestion(id: string, diff: Difficulty): Question {
  const mode = pick(['single_add', 'single_sub', 'skip_2', 'shapes_corners']);

  if (mode === 'single_add') {
    const a = randInt(2, 9);
    const b = randInt(1, 8);
    const ans = a + b;
    return {
      id,
      class: 'UKG',
      topic: 'addition',
      topicTitle: 'Addition within 20',
      difficulty: diff,
      question: `${a} + ${b} = ?`,
      correctAnswer: ans,
      options: shuffle([ans, ...generateNumericDistractors(ans, 3)]),
      hint: `Keep ${a} in your mind and count forward ${b} steps!`,
      explanation: `${a} + ${b} = ${ans}`,
    };
  }

  if (mode === 'single_sub') {
    const a = randInt(5, 12);
    const b = randInt(1, a - 1);
    const ans = a - b;
    return {
      id,
      class: 'UKG',
      topic: 'subtraction',
      topicTitle: 'Simple Subtraction',
      difficulty: diff,
      question: `${a} − ${b} = ?`,
      correctAnswer: ans,
      options: shuffle([ans, ...generateNumericDistractors(ans, 3)]),
      hint: `Count backward ${b} steps from ${a}!`,
      explanation: `${a} − ${b} = ${ans}`,
    };
  }

  if (mode === 'skip_2') {
    const start = pick([2, 4, 6, 8, 10]);
    const next = start + 2;
    return {
      id,
      class: 'UKG',
      topic: 'tables',
      topicTitle: 'Skip Counting by 2s',
      difficulty: diff,
      question: `Skip count by 2s:\n${start - 2 > 0 ? start - 2 + ', ' : ''}${start}, ?`,
      correctAnswer: next,
      options: shuffle([next, next + 1, next - 1, next + 3]),
      hint: `Add 2 to ${start}!`,
      explanation: `${start} + 2 = ${next}`,
    };
  }

  // Shapes & corners
  const shapeInfo = [
    { name: 'Triangle', corners: 3 },
    { name: 'Square', corners: 4 },
    { name: 'Rectangle', corners: 4 },
    { name: 'Pentagon', corners: 5 },
  ];
  const s = pick(shapeInfo);
  return {
    id,
    class: 'UKG',
    topic: 'geometry',
    topicTitle: 'Shape Corners',
    difficulty: diff,
    question: `How many corners does a ${s.name} have?`,
    correctAnswer: s.corners,
    options: shuffle([s.corners, s.corners + 1, Math.max(1, s.corners - 1), s.corners + 2]),
    hint: `Count each sharp point of a ${s.name}!`,
    explanation: `A ${s.name} has ${s.corners} corners!`,
  };
}

// -------------------------------------------------------------
// CLASS 1 QUESTIONS
// -------------------------------------------------------------
function generateClass1Question(id: string, diff: Difficulty, preferredTopic?: MathTopic): Question {
  const isSub = Math.random() > 0.5;
  if (isSub) {
    const a = randInt(10, 20);
    const b = randInt(2, a - 2);
    const ans = a - b;
    return {
      id,
      class: 1,
      topic: 'subtraction',
      topicTitle: 'Subtraction up to 20',
      difficulty: diff,
      question: `${a} − ${b} = ?`,
      correctAnswer: ans,
      options: shuffle([ans, ...generateNumericDistractors(ans, 3)]),
      hint: `Count backwards from ${a} by ${b}.`,
      explanation: `${a} − ${b} = ${ans}`,
    };
  }
  const a = randInt(6, 15);
  const b = randInt(4, 12);
  const ans = a + b;
  return {
    id,
    class: 1,
    topic: 'addition',
    topicTitle: 'Addition up to 30',
    difficulty: diff,
    question: `${a} + ${b} = ?`,
    correctAnswer: ans,
    options: shuffle([ans, ...generateNumericDistractors(ans, 3)]),
    hint: `Break ${b} into smaller numbers or use a number line.`,
    explanation: `${a} + ${b} = ${ans}`,
  };
}

// -------------------------------------------------------------
// CLASS 2 QUESTIONS
// -------------------------------------------------------------
function generateClass2Question(id: string, diff: Difficulty, preferredTopic?: MathTopic): Question {
  const topic = preferredTopic || pick(['addition', 'subtraction', 'multiplication', 'tables'] as MathTopic[]);

  if (topic === 'multiplication' || topic === 'tables') {
    const t = pick([2, 3, 4, 5, 10]);
    const m = randInt(2, 9);
    const ans = t * m;
    return {
      id,
      class: 2,
      topic: 'tables',
      topicTitle: `Table of ${t}`,
      difficulty: diff,
      question: `${t} × ${m} = ?`,
      correctAnswer: ans,
      options: shuffle([ans, ...generateNumericDistractors(ans, 3)]),
      hint: `${t} added ${m} times!`,
      explanation: `${t} × ${m} = ${ans}`,
    };
  }

  // 2-digit addition
  const a = randInt(15, 60);
  const b = randInt(12, 35);
  const ans = a + b;
  return {
    id,
    class: 2,
    topic: 'addition',
    topicTitle: '2-Digit Addition',
    difficulty: diff,
    question: `${a} + ${b} = ?`,
    correctAnswer: ans,
    options: shuffle([ans, ...generateNumericDistractors(ans, 3)]),
    hint: `Add ones place first, then tens place!`,
    explanation: `${a} + ${b} = ${ans}`,
  };
}

// -------------------------------------------------------------
// CLASS 8 QUESTIONS
// -------------------------------------------------------------
function generateClass8Question(id: string, diff: Difficulty, topic?: MathTopic): Question {
  const chosen = topic || pick(['algebra', 'geometry', 'percentage', 'integers'] as MathTopic[]);

  if (chosen === 'algebra') {
    // Exponents or linear equation with variables on both sides
    const a = randInt(2, 5);
    const exp = randInt(2, 4);
    const ans = Math.pow(a, exp);
    return {
      id,
      class: 8,
      topic: 'algebra',
      topicTitle: 'Powers and Exponents',
      difficulty: diff,
      question: `Find the value of ${a}^${exp}:`,
      correctAnswer: ans,
      options: shuffle([ans, ...generateNumericDistractors(ans, 3)]),
      hint: `Multiply ${a} by itself ${exp} times.`,
      explanation: `${a}^${exp} = ${Array(exp).fill(a).join(' × ')} = ${ans}`,
    };
  }

  if (chosen === 'geometry') {
    // Surface area of cube: 6s^2
    const side = randInt(3, 8);
    const ans = 6 * side * side;
    return {
      id,
      class: 8,
      topic: 'geometry',
      topicTitle: 'Surface Area of Cube',
      difficulty: diff,
      question: `Total surface area of a cube with side ${side} cm:`,
      correctAnswer: `${ans} cm²`,
      options: shuffle([`${ans} cm²`, ...generateNumericDistractors(ans, 3).map((d) => `${d} cm²`)]),
      hint: `A cube has 6 square faces. Formula = 6 × side².`,
      explanation: `Total Surface Area = 6 × (${side})² = 6 × ${side * side} = ${ans} cm².`,
    };
  }

  // Linear equation 3x - 5 = 16
  const x = randInt(3, 9);
  const m = randInt(2, 5);
  const c = randInt(3, 15);
  const rhs = m * x - c;
  return {
    id,
    class: 8,
    topic: 'algebra',
    topicTitle: 'Linear Equations in One Variable',
    difficulty: diff,
    question: `Solve for x:\n${m}x − ${c} = ${rhs}`,
    correctAnswer: x,
    options: shuffle([x, ...generateNumericDistractors(x, 3)]),
    hint: `First add ${c} to ${rhs}, then divide by ${m}.`,
    explanation: `${m}x = ${rhs} + ${c} = ${rhs + c} ➔ x = ${rhs + c} ÷ ${m} = ${x}`,
  };
}

// -------------------------------------------------------------
// CLASS 9 QUESTIONS
// -------------------------------------------------------------
function generateClass9Question(id: string, diff: Difficulty, topic?: MathTopic): Question {
  const chosen = topic || pick(['algebra', 'geometry', 'word_problems'] as MathTopic[]);

  if (chosen === 'geometry') {
    // Heron's Formula or Right Triangle Hypotenuse
    const a = 3 * randInt(1, 3);
    const b = 4 * randInt(1, 3);
    const c = Math.sqrt(a * a + b * b);
    return {
      id,
      class: 9,
      topic: 'geometry',
      topicTitle: 'Pythagorean Theorem',
      difficulty: diff,
      question: `In a right triangle with perpendicular sides ${a} cm and ${b} cm, find hypotenuse:`,
      correctAnswer: `${c} cm`,
      options: shuffle([`${c} cm`, `${c + 1} cm`, `${c - 1} cm`, `${c + 2} cm`]),
      hint: `Hypotenuse² = a² + b² = ${a * a} + ${b * b}.`,
      explanation: `c² = ${a}² + ${b}² = ${a * a + b * b} ➔ c = √${a * a + b * b} = ${c} cm.`,
    };
  }

  // Coordinate geometry midpoint
  const x1 = randInt(2, 6) * 2;
  const x2 = randInt(4, 10) * 2;
  const mid = (x1 + x2) / 2;
  return {
    id,
    class: 9,
    topic: 'geometry',
    topicTitle: 'Coordinate Geometry Midpoint',
    difficulty: diff,
    question: `Find the x-coordinate of the midpoint between (${x1}, 0) and (${x2}, 0):`,
    correctAnswer: mid,
    options: shuffle([mid, mid + 1, mid - 1, mid + 2]),
    hint: `Midpoint = (x1 + x2) / 2.`,
    explanation: `(${x1} + ${x2}) / 2 = ${x1 + x2} / 2 = ${mid}.`,
  };
}

// -------------------------------------------------------------
// CLASS 10 QUESTIONS
// -------------------------------------------------------------
function generateClass10Question(id: string, diff: Difficulty, topic?: MathTopic): Question {
  const types = ['trig', 'ap', 'quadratic', 'probability'];
  const t = pick(types);

  if (t === 'trig') {
    const trigTable = [
      { q: 'What is the exact value of sin(30°)?', a: '1/2', opts: ['1/2', '√3/2', '1/√2', '1'] },
      { q: 'What is the exact value of cos(60°)?', a: '1/2', opts: ['1/2', '√3/2', '0', '1'] },
      { q: 'What is the exact value of tan(45°)?', a: '1', opts: ['1', '√3', '1/√3', '0'] },
      { q: 'What is the value of sin²(θ) + cos²(θ)?', a: '1', opts: ['1', '0', '2', 'tan(θ)'] },
    ];
    const item = pick(trigTable);
    return {
      id,
      class: 10,
      topic: 'geometry',
      topicTitle: 'Trigonometry Ratios',
      difficulty: diff,
      question: item.q,
      correctAnswer: item.a,
      options: shuffle(item.opts),
      hint: `Recall the standard trigonometric values at 0°, 30°, 45°, 60°, 90°.`,
      explanation: `By standard trigonometric ratios, the exact answer is ${item.a}.`,
    };
  }

  if (t === 'ap') {
    const a = randInt(2, 6);
    const d = randInt(2, 5);
    const n = randInt(5, 10);
    const ans = a + (n - 1) * d;
    return {
      id,
      class: 10,
      topic: 'algebra',
      topicTitle: 'Arithmetic Progression (AP)',
      difficulty: diff,
      question: `Find the ${n}th term of an AP where first term a = ${a} and common difference d = ${d}:`,
      correctAnswer: ans,
      options: shuffle([ans, ...generateNumericDistractors(ans, 3)]),
      hint: `Formula: a_n = a + (n - 1) × d.`,
      explanation: `a_${n} = ${a} + (${n} - 1) × ${d} = ${a} + ${n - 1} × ${d} = ${ans}.`,
    };
  }

  // Probability
  return {
    id,
    class: 10,
    topic: 'word_problems',
    topicTitle: 'Probability',
    difficulty: diff,
    question: `A fair 6-sided die is rolled. What is the probability of rolling an even number?`,
    correctAnswer: '1/2',
    options: shuffle(['1/2', '1/3', '1/6', '2/3']),
    hint: `Even numbers on a die are 2, 4, 6 (3 out of 6 outcomes).`,
    explanation: `Favorable outcomes = 3 (2, 4, 6). Total outcomes = 6. Probability = 3/6 = 1/2.`,
  };
}

// -------------------------------------------------------------
// STANDARD CLASS 3-7 MATH GENERATOR
// -------------------------------------------------------------
function generateStandardClassQuestion(
  id: string,
  cls: number,
  difficulty: Difficulty,
  preferredTopic?: MathTopic
): Question {
  const topics: MathTopic[] = [
    'addition',
    'subtraction',
    'multiplication',
    'division',
    'tables',
    'fractions',
    'decimals',
    'integers',
    'percentage',
    'algebra',
    'geometry',
    'word_problems',
  ];
  const topic = preferredTopic || pick(topics);

  switch (topic) {
    case 'addition': {
      const max = difficulty === 'easy' ? 99 : difficulty === 'medium' ? 899 : 8999;
      const a = randInt(15, max);
      const b = randInt(10, max);
      const correct = a + b;
      return {
        id,
        class: cls as StudentClass,
        topic: 'addition',
        topicTitle: 'Addition',
        difficulty,
        question: `${a} + ${b} = ?`,
        correctAnswer: correct,
        options: shuffle([correct, ...generateNumericDistractors(correct)]),
        hint: `Line up the digits by place value.`,
        explanation: `${a} + ${b} = ${correct}.`,
      };
    }

    case 'subtraction': {
      const max = difficulty === 'easy' ? 99 : difficulty === 'medium' ? 899 : 8999;
      const a = randInt(40, max);
      const b = randInt(10, a - 5);
      const correct = a - b;
      return {
        id,
        class: cls as StudentClass,
        topic: 'subtraction',
        topicTitle: 'Subtraction',
        difficulty,
        question: `${a} − ${b} = ?`,
        correctAnswer: correct,
        options: shuffle([correct, ...generateNumericDistractors(correct)]),
        hint: `Subtract carefully column by column.`,
        explanation: `${a} − ${b} = ${correct}.`,
      };
    }

    case 'multiplication':
    case 'tables': {
      const a = difficulty === 'easy' ? randInt(2, 10) : randInt(11, 25);
      const b = randInt(2, 12);
      const correct = a * b;
      return {
        id,
        class: cls as StudentClass,
        topic: 'multiplication',
        topicTitle: 'Multiplication',
        difficulty,
        question: `${a} × ${b} = ?`,
        correctAnswer: correct,
        options: shuffle([correct, ...generateNumericDistractors(correct)]),
        hint: `Think of ${a} added ${b} times.`,
        explanation: `${a} × ${b} = ${correct}.`,
      };
    }

    case 'division': {
      const divisor = randInt(2, 12);
      const quotient = difficulty === 'easy' ? randInt(2, 10) : randInt(11, 40);
      const dividend = divisor * quotient;
      return {
        id,
        class: cls as StudentClass,
        topic: 'division',
        topicTitle: 'Division',
        difficulty,
        question: `${dividend} ÷ ${divisor} = ?`,
        correctAnswer: quotient,
        options: shuffle([quotient, ...generateNumericDistractors(quotient)]),
        hint: `How many times does ${divisor} fit into ${dividend}?`,
        explanation: `${divisor} × ${quotient} = ${dividend}, so ${dividend} ÷ ${divisor} = ${quotient}.`,
      };
    }

    case 'fractions': {
      const den = pick([4, 5, 6, 8, 10]);
      const n1 = randInt(1, den - 2);
      const n2 = randInt(1, den - n1);
      const sum = n1 + n2;
      const correct = formatFraction(sum, den);
      return {
        id,
        class: cls as StudentClass,
        topic: 'fractions',
        topicTitle: 'Fractions',
        difficulty,
        question: `${n1}/${den} + ${n2}/${den} = ?`,
        correctAnswer: correct,
        options: generateFractionDistractors(sum, den),
        hint: `Since denominators are equal, add numerators: ${n1} + ${n2}.`,
        explanation: `${n1}/${den} + ${n2}/${den} = ${sum}/${den} = ${correct}.`,
      };
    }

    case 'decimals': {
      const a = +(randInt(10, 80) / 10).toFixed(1);
      const b = +(randInt(10, 80) / 10).toFixed(1);
      const correct = +(a + b).toFixed(1);
      const dists = [+(correct + 0.1).toFixed(1), +(correct - 0.1).toFixed(1), +(correct + 1.0).toFixed(1)];
      return {
        id,
        class: cls as StudentClass,
        topic: 'decimals',
        topicTitle: 'Decimals',
        difficulty,
        question: `${a} + ${b} = ?`,
        correctAnswer: correct,
        options: shuffle([correct, ...dists]),
        hint: `Align decimal points before adding.`,
        explanation: `${a} + ${b} = ${correct}.`,
      };
    }

    case 'percentage': {
      const p = pick([10, 20, 25, 50]);
      const base = pick([40, 60, 80, 100, 200, 400]);
      const correct = (p * base) / 100;
      return {
        id,
        class: cls as StudentClass,
        topic: 'percentage',
        topicTitle: 'Percentage',
        difficulty,
        question: `What is ${p}% of ${base}?`,
        correctAnswer: correct,
        options: shuffle([correct, ...generateNumericDistractors(correct)]),
        hint: `${p}% means ${p} out of 100.`,
        explanation: `(${p}/100) × ${base} = ${correct}.`,
      };
    }

    case 'algebra': {
      const x = randInt(3, 12);
      const a = randInt(2, 5);
      const b = randInt(2, 9);
      const rhs = a * x + b;
      return {
        id,
        class: cls as StudentClass,
        topic: 'algebra',
        topicTitle: 'Basic Algebra',
        difficulty,
        question: `Solve for x:\n${a}x + ${b} = ${rhs}`,
        correctAnswer: x,
        options: shuffle([x, ...generateNumericDistractors(x)]),
        hint: `Subtract ${b} from both sides, then divide by ${a}.`,
        explanation: `${a}x = ${rhs} − ${b} = ${rhs - b} ➔ x = ${x}.`,
      };
    }

    case 'geometry': {
      const l = randInt(4, 15);
      const w = randInt(3, 10);
      const per = 2 * (l + w);
      return {
        id,
        class: cls as StudentClass,
        topic: 'geometry',
        topicTitle: 'Geometry Perimeter',
        difficulty,
        question: `Perimeter of a rectangle with length ${l} cm and width ${w} cm:`,
        correctAnswer: `${per} cm`,
        options: shuffle([`${per} cm`, `${per + 2} cm`, `${per - 2} cm`, `${per + 4} cm`]),
        hint: `Perimeter = 2 × (Length + Width).`,
        explanation: `2 × (${l} + ${w}) = ${per} cm.`,
      };
    }

    case 'word_problems':
    default: {
      const a = randInt(25, 60);
      const b = randInt(10, a - 5);
      const ans = a - b;
      return {
        id,
        class: cls as StudentClass,
        topic: 'word_problems',
        topicTitle: 'Word Problems',
        difficulty,
        question: `Riya had ${a} marbles. She gave ${b} to Kabir. How many does she have left?`,
        correctAnswer: ans,
        options: shuffle([ans, ...generateNumericDistractors(ans)]),
        hint: `Take away ${b} from ${a}.`,
        explanation: `${a} − ${b} = ${ans} marbles left.`,
      };
    }
  }
}

// -------------------------------------------------------------
// ENGLISH GRAMMAR GENERATOR
// -------------------------------------------------------------
function generateGrammarQuestion(
  id: string,
  cls: StudentClass,
  diff: Difficulty,
  topic?: string
): Question {
  const bank = [
    {
      q: 'Choose the correct article:\nShe saw ___ elephant at the zoo.',
      ans: 'an',
      opts: ['a', 'an', 'the', 'no article'],
      topic: 'articles',
      title: 'Articles',
      exp: 'We use "an" before vowel sounds (e.g. elephant).',
    },
    {
      q: 'What is the plural of "child"?',
      ans: 'children',
      opts: ['children', 'childs', 'childes', 'childrens'],
      topic: 'nouns',
      title: 'Nouns & Plurals',
      exp: '"Child" has an irregular plural form: "children".',
    },
    {
      q: 'Replace the underlined word:\n"Rahul is reading. Rahul loves books."',
      ans: 'He',
      opts: ['He', 'She', 'It', 'They'],
      topic: 'pronouns',
      title: 'Pronouns',
      exp: 'Rahul is masculine singular, so we use the pronoun "He".',
    },
    {
      q: 'Choose the correct verb form:\nThe birds ___ high in the sky.',
      ans: 'fly',
      opts: ['fly', 'flies', 'flying', 'flew'],
      topic: 'verbs',
      title: 'Verbs',
      exp: 'Plural subject "birds" takes the base form "fly".',
    },
    {
      q: 'Identify the tense:\n"They went to the museum yesterday."',
      ans: 'Past Tense',
      opts: ['Past Tense', 'Present Tense', 'Future Tense', 'Continuous'],
      topic: 'tenses',
      title: 'Tenses',
      exp: '"Went" is the past form of "go", and "yesterday" indicates past time.',
    },
    {
      q: 'Choose the adjective in this sentence:\n"The little puppy slept on the soft mat."',
      ans: 'little',
      opts: ['little', 'puppy', 'slept', 'mat'],
      topic: 'adjectives',
      title: 'Adjectives',
      exp: '"Little" describes the noun puppy, making it an adjective.',
    },
    {
      q: 'Fill in the blank:\nThe book is ___ the table.',
      ans: 'on',
      opts: ['on', 'in', 'at', 'into'],
      topic: 'prepositions',
      title: 'Prepositions',
      exp: 'We use "on" when an object rests on a surface.',
    },
    {
      q: 'Join with conjunction:\nI wanted to play outside, ___ it started raining.',
      ans: 'but',
      opts: ['but', 'and', 'so', 'or'],
      topic: 'conjunctions',
      title: 'Conjunctions',
      exp: '"But" connects two contrasting thoughts.',
    },
  ];

  const item = pick(bank);
  return {
    id,
    class: cls,
    topic: 'word_problems',
    topicTitle: item.title,
    difficulty: diff,
    question: item.q,
    correctAnswer: item.ans,
    options: shuffle(item.opts),
    hint: 'Think carefully about English grammar rules!',
    explanation: item.exp,
  };
}

// -------------------------------------------------------------
// SPOKEN ENGLISH GENERATOR
// -------------------------------------------------------------
function generateSpeakingQuestion(
  id: string,
  cls: StudentClass,
  diff: Difficulty,
  topic?: string
): Question {
  const bank = [
    {
      q: 'What do you say when someone gives you a gift?',
      ans: 'Thank you!',
      opts: ['Thank you!', 'Sorry!', 'Please!', 'Excuse me!'],
      title: 'Polite Words',
      exp: '"Thank you" expresses appreciation and good manners.',
    },
    {
      q: 'How do you greet your teacher in the morning?',
      ans: 'Good morning!',
      opts: ['Good morning!', 'Good night!', 'Goodbye!', 'See you!'],
      title: 'Greetings',
      exp: '"Good morning" is the polite morning greeting.',
    },
    {
      q: 'Someone asks: "How are you?"\nBest polite answer:',
      ans: 'I am fine, thank you!',
      opts: ['I am fine, thank you!', 'Yes, please!', 'Never mind.', 'What do you want?'],
      title: 'Daily Conversation',
      exp: 'Politely acknowledge the question and thank them for asking.',
    },
    {
      q: 'What is the opposite of "brave"?',
      ans: 'Cowardly',
      opts: ['Cowardly', 'Strong', 'Happy', 'Fast'],
      title: 'Opposites & Vocab',
      exp: 'The opposite of brave is cowardly or fearful.',
    },
    {
      q: 'When you accidentally bump into someone, you should say:',
      ans: 'I am sorry!',
      opts: ['I am sorry!', 'You are welcome!', 'Hello!', 'Please!'],
      title: 'Polite Words',
      exp: '"I am sorry" is the polite apology for accidental bumping.',
    },
  ];

  const item = pick(bank);
  return {
    id,
    class: cls,
    topic: 'word_problems',
    topicTitle: item.title,
    difficulty: diff,
    question: item.q,
    correctAnswer: item.ans,
    options: shuffle(item.opts),
    hint: 'Think about polite, daily conversational manners.',
    explanation: item.exp,
  };
}

// -------------------------------------------------------------
// SCIENCE GENERATOR
// -------------------------------------------------------------
function generateScienceQuestion(
  id: string,
  cls: StudentClass,
  diff: Difficulty,
  topic?: string
): Question {
  const bank = [
    {
      q: 'Which part of a plant makes food through photosynthesis?',
      ans: 'Leaf',
      opts: ['Leaf', 'Root', 'Stem', 'Flower'],
      title: 'Plants',
      exp: 'Leaves contain chlorophyll and use sunlight to make food.',
    },
    {
      q: 'Which organ in the human body pumps blood?',
      ans: 'Heart',
      opts: ['Heart', 'Lungs', 'Brain', 'Stomach'],
      title: 'Human Body',
      exp: 'The heart is a muscular organ that pumps blood throughout the body.',
    },
    {
      q: 'Which is the closest star to planet Earth?',
      ans: 'Sun',
      opts: ['Sun', 'Moon', 'Mars', 'Proxima Centauri'],
      title: 'Solar System',
      exp: 'The Sun is the star at the center of our solar system.',
    },
    {
      q: 'Water changes from liquid to solid ice at:',
      ans: '0°C',
      opts: ['0°C', '100°C', '50°C', '-50°C'],
      title: 'Matter & States',
      exp: '0°C (32°F) is the freezing point of pure water.',
    },
    {
      q: 'Which gas do humans inhale for respiration?',
      ans: 'Oxygen',
      opts: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Helium'],
      title: 'Water & Air',
      exp: 'Our lungs absorb Oxygen (O2) from the air to supply cells.',
    },
    {
      q: 'Animals that eat only plants are called:',
      ans: 'Herbivores',
      opts: ['Herbivores', 'Carnivores', 'Omnivores', 'Decomposers'],
      title: 'Animals',
      exp: 'Herbivores (like cows, deer, rabbits) eat only plant matter.',
    },
  ];

  const item = pick(bank);
  return {
    id,
    class: cls,
    topic: 'word_problems',
    topicTitle: item.title,
    difficulty: diff,
    question: item.q,
    correctAnswer: item.ans,
    options: shuffle(item.opts),
    hint: 'Recall basic science and natural facts.',
    explanation: item.exp,
  };
}

// -------------------------------------------------------------
// CLASS 6 SOCIAL SCIENCE (ASSAMESE) QUESTION GENERATOR
// -------------------------------------------------------------
function generateSocialScienceQuestion(
  id: string,
  cls: StudentClass,
  diff: Difficulty,
  preferredTopic?: string | number
): Question {
  const chapters = CLASS_6_SOCIAL_SCIENCE_CHAPTERS;
  let targetChapter = chapters[randInt(0, chapters.length - 1)];

  if (typeof preferredTopic === 'number') {
    const matched = chapters.find((c) => c.chapterNumber === preferredTopic);
    if (matched) targetChapter = matched;
  } else if (typeof preferredTopic === 'string' && preferredTopic) {
    const matched = chapters.find(
      (c) =>
        preferredTopic.toLowerCase().includes(`chapter_${c.chapterNumber}`) ||
        preferredTopic.toLowerCase().includes(`c${c.chapterNumber}`) ||
        preferredTopic.includes(c.title)
    );
    if (matched) {
      targetChapter = matched;
    }
  }

  const qItem = pick(targetChapter.questions);
  let options: (string | number)[] = [];
  let correctAnswer: string | number = qItem.answer;

  if (qItem.options && qItem.options.length > 0 && qItem.correctOptionIndex !== undefined) {
    correctAnswer = qItem.options[qItem.correctOptionIndex];
    options = shuffle([...qItem.options]);
  } else {
    // For short answers, build smart multiple-choice options
    const cleanAnswer = qItem.answer.length > 45 ? qItem.answer.substring(0, 45) + '...' : qItem.answer;
    correctAnswer = cleanAnswer;

    // Distractors from other questions
    const otherAnswers = targetChapter.questions
      .filter((q) => q.id !== qItem.id)
      .map((q) => (q.answer.length > 45 ? q.answer.substring(0, 45) + '...' : q.answer));

    const distinct = Array.from(new Set(otherAnswers));
    const distractors = shuffle(distinct).slice(0, 3);
    options = shuffle([cleanAnswer, ...distractors]);

    const fallbackDistractors = [
      'উক্ত আটাইকেইটা',
      'কোনো এটাও নহয়',
      'পূব দিশৰপৰা',
      'প্ৰাকৃতিক নিয়মত',
    ];
    while (options.length < 4) {
      const fb = fallbackDistractors[options.length % fallbackDistractors.length];
      if (!options.includes(fb)) options.push(fb);
      else options.push(`বিকল্প ${options.length + 1}`);
    }
  }

  return {
    id,
    class: 6,
    topic: 'word_problems',
    topicTitle: targetChapter.title,
    difficulty: diff,
    question: qItem.question,
    correctAnswer,
    options,
    hint: `এই প্ৰশ্নটি '${targetChapter.title}' পাঠৰ অন্তৰ্গত।`,
    explanation: qItem.answer,
  };
}

// Generate set of questions for level
export function generateQuestionsForLevel(
  levelConfig: LevelConfig,
  studentClass: StudentClass,
  subject: SubjectId = 'maths'
): Question[] {
  const questions: Question[] = [];
  const topics = levelConfig.topics;

  for (let i = 0; i < 10; i++) {
    const chosenTopic = topics[i % topics.length];
    questions.push(
      generateQuestionForSubjectAndStudent(subject, studentClass, levelConfig.difficulty, chosenTopic)
    );
  }

  return questions;
}
