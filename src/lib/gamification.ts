export const LEVEL_REQUIREMENTS = [
  0,       // Level 1
  100,     // Level 2
  250,     // Level 3
  500,     // Level 4
  1000,    // Level 5
  2000,    // Level 6
  4000,    // Level 7
  7500,    // Level 8
  12000,   // Level 9
  20000,   // Level 10
];

export const PICO_STAGES = [
  { maxLevel: 3, name: "🐣 Curious Egg", description: "Just starting to understand the digital world." },
  { maxLevel: 6, name: "🌱 Sprout Pico", description: "Learning fast and asking great questions!" },
  { maxLevel: 9, name: "🧠 Smart Pico", description: "Building real things and understanding concepts." },
  { maxLevel: 99, name: "🚀 Builder Pico", description: "A true creator in the tech ecosystem." }
];

export function calculateLevel(xp: number): { level: number; nextLevelXp: number; progress: number } {
  let level = 1;
  let nextLevelXp = LEVEL_REQUIREMENTS[1];

  for (let i = 0; i < LEVEL_REQUIREMENTS.length; i++) {
    if (xp >= LEVEL_REQUIREMENTS[i]) {
      level = i + 1;
      nextLevelXp = LEVEL_REQUIREMENTS[i + 1] || LEVEL_REQUIREMENTS[i] + 10000;
    } else {
      break;
    }
  }

  const currentLevelBaseXp = LEVEL_REQUIREMENTS[level - 1];
  const progress = ((xp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100;

  return { level, nextLevelXp, progress: Math.min(Math.max(progress, 0), 100) };
}

export function getPicoStage(level: number) {
  return PICO_STAGES.find(stage => level <= stage.maxLevel) || PICO_STAGES[PICO_STAGES.length - 1];
}

export const ACHIEVEMENTS = [
  { id: "first_question", title: "Inquisitive", description: "Asked Pico your first question.", icon: "🙋" },
  { id: "streak_3", title: "On Fire", description: "Maintained a 3-day learning streak.", icon: "🔥" },
  { id: "first_project", title: "Hello World", description: "Completed your first hands-on challenge.", icon: "🛠️" },
  { id: "api_master", title: "API Explorer", description: "Successfully made an API request.", icon: "🌐" }
];
