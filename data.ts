
import { PetSpecies, Task, Reward, FoodItem } from './types';

export const FRAMES: Record<string, string> = {
  'default': 'border-blue-200',
  'gold': 'border-yellow-400 ring-4 ring-yellow-200',
  'fire': 'border-red-500 ring-4 ring-orange-300',
  'leaf': 'border-green-500 ring-4 ring-green-200',
  'rainbow': 'border-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px]',
  'neon': 'border-cyan-400 ring-4 ring-cyan-200 shadow-[0_0_10px_#22d3ee]',
  'galaxy': 'border-indigo-600 ring-4 ring-purple-400 bg-slate-900',
  'ocean': 'border-blue-600 ring-4 ring-blue-300 bg-blue-50',
};

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Đánh răng buổi sáng', points: 10, icon: '🪥', status: 'todo', isDaily: true },
  { id: 't2', title: 'Gấp chăn màn', points: 20, icon: '🛏️', status: 'todo', isDaily: true },
  { id: 't3', title: 'Học bài 30 phút', points: 50, icon: '📚', status: 'todo', isDaily: true },
];

export const INITIAL_REWARDS: Reward[] = [
  { id: 'box1', title: 'Hộp Quà Bí Ẩn', cost: 50, image: '🎁', type: 'mystery_box' },
  { id: 'r1', title: 'Xem TV 30 phút', cost: 100, image: '📺', type: 'activity' },
  { id: 'r2', title: 'Một que kem', cost: 150, image: '🍦', type: 'toy' },
  // Đồ nội thất
  { id: 'dec1', title: 'Thảm Cỏ Xanh', cost: 80, image: '🌱', type: 'decor' },
  { id: 'dec2', title: 'Giường Êm Ái', cost: 200, image: '🛌', type: 'decor' },
  { id: 'dec3', title: 'Cửa Sổ Nắng', cost: 150, image: '🪟', type: 'decor' },
  { id: 'dec4', title: 'Đèn Ngôi Sao', cost: 120, image: '⭐', type: 'decor' },
  { id: 'dec5', title: 'Chậu Cây Xinh', cost: 60, image: '🪴', type: 'decor' },
  // Làm đẹp
  { id: 'gold', title: 'Khung Vàng', cost: 500, image: '👑', type: 'frame' },
  { id: 'av1', title: 'Avatar Rồng', cost: 300, image: '🐲', type: 'avatar' },
];

export const INITIAL_PET_SPECIES: Record<string, PetSpecies> = {
  dragon: {
    id: 'dragon',
    name: 'Rồng Lửa',
    stages: [
      { minLevel: 1, image: '🥚', name: 'Trứng', dialogue: ['...', 'Lắc lắc...'] },
      { minLevel: 5, image: '🦖', name: 'Rồng Con', dialogue: ['Gào!', 'Đói quá!'] },
      { minLevel: 15, image: '🐲', name: 'Rồng Chiến', dialogue: ['Ta là Rồng!'] },
    ]
  }
};

export const FOOD_ITEMS: FoodItem[] = [
  { id: 'f1', name: 'Táo Đỏ', cost: 20, xp: 10, hungerDetails: 20, icon: '🍎' },
  { id: 'f2', name: 'Đùi Gà', cost: 50, xp: 30, hungerDetails: 50, icon: '🍗' },
];

export const COMMON_ICONS = ['🧹', '🛏️', '🦷', '📚', '🧸', '🚿'];
export const COMMON_REWARD_ICONS = ['📺', '🍦', '🎮', '📱', '⚽'];
export const AI_SUGGESTIONS = [{ title: "Vẽ tranh tặng mẹ", points: 40, icon: "🎨" }];
