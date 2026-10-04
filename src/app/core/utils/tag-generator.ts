// Seeded random number generator
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const TAGS = [
  'nature',
  'city',
  'architecture',
  'travel',
  'food',
  'abstract',
  'portrait',
  'minimal',
  'night',
  'sunset',
  'ocean',
  'forest',
  'mountain',
  'street',
  'vintage',
  'macro',
  'interior',
  'sky',
  'flowers',
  'texture',
];

/** same id always gets the same distinct tags. */
export function generateTags(id: number, count = 3): string[] {
  const rand = mulberry32(Math.imul(id, 2654435761));
  const pool = [...TAGS];
  const tags: string[] = [];
  for (let i = 0; i < count; i++) {
    tags.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
  }
  return tags;
}
