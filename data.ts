
import { PetSpecies, Task, Reward, FoodItem, Badge } from './types';

export const FRAMES: Record<string, string> = {
  'default': 'border-blue-200',
  'gold': 'border-yellow-400 ring-4 ring-yellow-200',
  'fire': 'border-red-500 ring-4 ring-orange-300',
  'leaf': 'border-green-500 ring-4 ring-green-200',
  'rainbow': 'border-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px]',
  'neon': 'border-cyan-400 ring-4 ring-cyan-200 shadow-[0_0_10px_#22d3ee]',
  'galaxy': 'border-indigo-600 ring-4 ring-purple-400 bg-slate-900',
  'ocean': 'border-blue-600 ring-4 ring-blue-300 bg-blue-50',
  'love': 'border-pink-500 ring-4 ring-pink-200',
  'dark': 'border-slate-800 ring-4 ring-slate-500 bg-slate-200',
  'candy': 'border-pink-400 ring-4 ring-yellow-300 border-dashed',
  'nature': 'border-emerald-600 ring-4 ring-emerald-200 border-double',
  'royal': 'border-purple-700 ring-4 ring-yellow-500',
  'ice': 'border-sky-300 ring-4 ring-white bg-sky-50',
  'robot': 'border-slate-400 ring-4 ring-slate-200 border-dotted',
};

export const COMMON_ICONS = [
  '🧹', '🛏️', '🦷', '📚', '🧸', '🚿', '🍽️', '✏️', '🎹', '⚽',
  '🐕', '🗑️', '👕', '👟', '🎒', '💊', '🥛', '🍎', '🎨', '🚲', '⏰', '🏆', '🥇', '🎖️'
];

export const COMMON_REWARD_ICONS = [
  '📺', '🍦', '🎮', '📱', '⚽', '🛹', '🍿', '🥤', '🎟️', '🏖️',
  '🧩', '🎨', '🍟', '🍕', '🍩', '🍬', '🍫', '💤', '🎢', '🏟️'
];

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Đánh răng buổi sáng', points: 10, icon: '🪥', status: 'todo', isDaily: true, streak: 0, totalCompletions: 0, totalSkips: 0 },
  { id: 't2', title: 'Gấp chăn màn', points: 20, icon: '🛏️', status: 'todo', isDaily: true, streak: 0, totalCompletions: 0, totalSkips: 0 },
  { id: 't3', title: 'Học bài 30 phút', points: 50, icon: '📚', status: 'todo', isDaily: true, streak: 0, totalCompletions: 0, totalSkips: 0 },
  { id: 't4', title: 'Tự giác đi ngủ đúng giờ', points: 30, icon: '💤', status: 'todo', isDaily: true, streak: 0, totalCompletions: 0, totalSkips: 0 },
];

export const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: 'Dũng Sĩ Diệt Sâu Răng', icon: '🦷', targetTaskId: 't1', requiredCompletions: 7, revocationThreshold: 3 },
  { id: 'b2', name: 'Phù Thủy Gọn Gàng', icon: '🛌', targetTaskId: 't2', requiredCompletions: 5, revocationThreshold: 2 },
  { id: 'b3', name: 'Mọt Sách Thông Thái', icon: '📚', targetTaskId: 't3', requiredCompletions: 10, revocationThreshold: 3 },
  { id: 'b4', name: 'Thần Đồng Đúng Giờ', icon: '⏰', targetTaskId: 't4', requiredCompletions: 7, revocationThreshold: 2 },
];

export const INITIAL_REWARDS: Reward[] = [
  { id: 'r1', title: 'Xem TV 30 phút', cost: 100, image: '📺', type: 'activity' },
  { id: 'r2', title: 'Một que kem mát lạnh', cost: 150, image: '🍦', type: 'toy' },
  { id: 'av1', title: 'Avatar: Rồng Lửa', cost: 300, image: '🐲', type: 'avatar' },
  { id: 'av2', title: 'Avatar: Công Chúa', cost: 300, image: '👸', type: 'avatar' },
  { id: 'av3', title: 'Avatar: Phi Hành Gia', cost: 400, image: '👨‍🚀', type: 'avatar' },
  { id: 'av4', title: 'Avatar: Gấu Trúc', cost: 250, image: '🐼', type: 'avatar' },
  { id: 'av5', title: 'Avatar: Robot', cost: 450, image: '🤖', type: 'avatar' },
  { id: 'gold', title: 'Khung: Vàng Ròng', cost: 500, image: '👑', type: 'frame' },
  { id: 'rainbow', title: 'Khung: Cầu Vồng', cost: 600, image: '🌈', type: 'frame' },
  { id: 'neon', title: 'Khung: Neon', cost: 400, image: '💡', type: 'frame' },
  { id: 'galaxy', title: 'Khung: Vũ Trụ', cost: 450, image: '🪐', type: 'frame' },
  { id: 'ocean', title: 'Khung: Đại Dương', cost: 350, image: '🌊', type: 'frame' },
  { id: 'love', title: 'Khung: Trái Tim', cost: 300, image: '💖', type: 'frame' },
  { id: 'dark', title: 'Khung: Bóng Đêm', cost: 400, image: '🦇', type: 'frame' },
  { id: 'candy', title: 'Khung: Kẹo Ngọt', cost: 250, image: '🍬', type: 'frame' },
  { id: 'nature', title: 'Khung: Thiên Nhiên', cost: 300, image: '🌿', type: 'frame' },
  { id: 'royal', title: 'Khung: Hoàng Gia', cost: 800, image: '🏰', type: 'frame' },
  { id: 'ice', title: 'Khung: Băng Giá', cost: 350, image: '❄️', type: 'frame' },
  { id: 'robot', title: 'Khung: Robot', cost: 400, image: '🤖', type: 'frame' },
];

export const INITIAL_PET_SPECIES: Record<string, PetSpecies> = {
  dragon: {
    id: 'dragon',
    name: 'Rồng Lửa',
    cost: 0,
    stages: [
      { minLevel: 1, image: '🥚', name: 'Trứng Bí Ẩn', dialogue: ['...', 'Lắc lắc...', 'Zzz...'] },
      { minLevel: 5, image: 'Rex', name: 'Khủng Long Con', dialogue: ['Gào!', 'Đói quá!', 'Chơi với em đi!'] },
      { minLevel: 15, image: '🐲', name: 'Rồng Chiến', dialogue: ['Ta là Rồng!', 'Bay lên nào!', 'Phùuuu lửa!'] },
      { minLevel: 30, image: '🔥', name: 'Rồng Thần', dialogue: ['Sức mạnh tối thượng!', 'Bất khả chiến bại!'] }
    ]
  },
  unicorn: {
    id: 'unicorn',
    name: 'Kỳ Lân',
    cost: 500,
    stages: [
      { minLevel: 1, image: '🥚', name: 'Trứng Bí Ẩn', dialogue: ['Lấp lánh...', 'Ấm áp quá...'] },
      { minLevel: 5, image: '🦄', name: 'Ngựa Pony', dialogue: ['Hí hí!', 'Kẹo ngọt đâu?', 'Yêu bé lắm!'] },
      { minLevel: 15, image: '🌈', name: 'Kỳ Lân Bay', dialogue: ['Cầu vồng rực rỡ!', 'Phép thuật!'] },
      { minLevel: 30, image: '✨', name: 'Thần Mã', dialogue: ['Ánh sáng vĩnh cửu!', 'Bảo vệ giấc mơ!'] }
    ]
  },
  cat: {
    id: 'cat',
    name: 'Mèo Thần Tài',
    cost: 200,
    stages: [
      { minLevel: 1, image: '📦', name: 'Hộp Bí Ẩn', dialogue: ['Meow...', 'Ai đó?'] },
      { minLevel: 5, image: '🐱', name: 'Mèo Con', dialogue: ['Meow meow!', 'Cá đâu?', 'Gãi bụng tớ đi!'] },
      { minLevel: 15, image: '😼', name: 'Mèo Siêu Nhân', dialogue: ['Ta sẽ bắt chuột!', 'Nhanh như chớp!'] },
      { minLevel: 30, image: '🦁', name: 'Sư Tử Nhí', dialogue: ['Gooooaooo!', 'Dũng cảm lên!'] }
    ]
  }
};

export const FOOD_ITEMS: FoodItem[] = [
  { id: 'f1', name: 'Táo Đỏ', cost: 20, xp: 10, hungerDetails: 20, icon: '🍎' },
  { id: 'f2', name: 'Đùi Gà', cost: 50, xp: 30, hungerDetails: 50, icon: '🍗' },
  { id: 'f3', name: 'Bánh Kem', cost: 100, xp: 70, hungerDetails: 80, icon: '🎂' },
  { id: 'f4', name: 'Tiệc Lớn', cost: 200, xp: 150, hungerDetails: 100, icon: '🍱' },
];

export const AI_SUGGESTIONS = [
  { title: "Vẽ một bức tranh tặng mẹ", points: 40, icon: "🎨" },
  { title: "Đọc 5 trang sách truyện", points: 30, icon: "📖" },
  { title: "Tưới cây ngoài ban công", points: 15, icon: "🪴" },
  { title: "Kể một câu chuyện vui", points: 20, icon: "🎤" },
  { title: "Sắp xếp lại tủ đồ chơi", points: 50, icon: "🧸" },
];
