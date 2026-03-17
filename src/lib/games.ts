import { MiniGame } from '@/types/game';

export const MINI_GAMES: MiniGame[] = [
  {
    id: 'reaction-time',
    name: 'Réflexes ⚡',
    description: 'L\'écran change de couleur, tape le plus vite possible!',
    icon: '⚡',
    component: 'ReactionTime',
    maxDuration: 30
  },
  {
    id: 'food-memory',
    name: 'Memory Food 🍕',
    description: 'Trouve les paires d\'emojis food le plus vite possible!',
    icon: '🍕',
    component: 'FoodMemory',
    maxDuration: 45
  },
  {
    id: 'speed-type',
    name: 'Speed Food 📝',
    description: 'Tape la phrase culinaire le plus vite possible!',
    icon: '📝',
    component: 'SpeedType',
    maxDuration: 30
  }
];

export const FOOD_EMOJIS = [
  '🍕', '🍔', '🍣', '🌮', '🍜', '🍝', '🥗', '🍤',
  '🥐', '🧀', '🥓', '🍳', '🥞', '🧇', '🥯', '🍞',
  '🌭', '🍖', '🍗', '🥩', '🍛', '🍱', '🍙', '🍘',
  '🍚', '🥟', '🦪', '🍦', '🧁', '🍰', '🎂', '🍮'
];

export const SPEED_TYPE_SENTENCES = [
  "J'adore manger des tacos épicés avec mes amis le vendredi soir!",
  "Les croissants tout chauds du matin sont un vrai plaisir parisien.",
  "Pizza aux quatre fromages ou burger veggie? Difficile de choisir!",
  "Le ramen fumant réchauffe le cœur pendant les soirées d'hiver.",
  "Sushi, maki, sashimi: la cuisine japonaise est un art culinaire!",
  "Un bon couscous en famille, c'est le bonheur du dimanche midi.",
  "Les pâtes carbonara maison, rien ne vaut la tradition italienne!",
  "Crêpes sucrées ou salées? Pourquoi choisir quand on peut avoir les deux!"
];

export const PLAYER_COLORS = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink  
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#3B82F6', // Blue
  '#10B981', // Green
  '#EF4444', // Red
  '#8B5A2B'  // Brown
];

export const PLAYER_EMOJIS = [
  '🔥', '⭐', '🎯', '🚀', '💎', '🎪', '🎨', '🎭',
  '🦄', '🐱', '🐸', '🦊', '🐨', '🐼', '🦁', '🐻',
  '👑', '🎮', '🎲', '🎪', '🎭', '🎨', '🎯', '⚡'
];

export function getRandomGame(): MiniGame {
  return MINI_GAMES[Math.floor(Math.random() * MINI_GAMES.length)];
}

export function getRandomPlayerColor(): string {
  return PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
}

export function getRandomPlayerEmoji(): string {
  return PLAYER_EMOJIS[Math.floor(Math.random() * PLAYER_EMOJIS.length)];
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateGamePairs(emojis: string[], pairCount: number = 8): string[] {
  const selectedEmojis = shuffleArray(emojis).slice(0, pairCount);
  const pairs = [...selectedEmojis, ...selectedEmojis];
  return shuffleArray(pairs);
}

export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Only letters, no confusing ones
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}