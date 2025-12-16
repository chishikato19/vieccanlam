
import { PetSpecies, Task, Reward, FoodItem } from './types';

export const FRAMES: Record<string, string> = {
  'default': 'border-blue-200',
  'gold': 'border-yellow-400 ring-4 ring-yellow-200',
  'fire': 'border-red-500 ring-4 ring-orange-300',
  'leaf': 'border-green-500 ring-4 ring-green-200',
  'rainbow': 'border-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px]'
};

export const COMMON_ICONS = [
  '🧹', '🛏️', '🦷', '📚', '🧸', '🚿', '🍽️', '✏️', '🎹', '⚽',
  '🐕', '🗑️', '👕', '👟', '🎒', '💊', '🥛', '🍎', '🎨', '🚲'
];

export const COMMON_REWARD_ICONS = [
  '📺', '🍦', '🎮', '📱', '⚽', '🛹', '🍿', '🥤', '🎟️', '🏖️',
  '🧩', '🎨', '🍟', '🍕', '🍩', '🍬', '🍫', '💤', '🎢', '🏟️'
];

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Đánh răng buổi sáng', points: 10, icon: '🪥', status: 'todo', isDaily: true },
  { id: 't2', title: 'Gấp chăn màn', points: 20, icon: '🛏️', status: 'todo', isDaily: true },
  { id: 't3', title: 'Học bài 30 phút', points: 50, icon: '📚', status: 'todo', isDaily: true },
];

export const INITIAL_REWARDS: Reward[] = [
  { id: 'r1', title: 'Xem TV 30 phút', cost: 100, image: '📺', type: 'activity' },
  { id: 'r2', title: 'Một que kem', cost: 150, image: '🍦', type: 'toy' },
  { id: 'av1', title: 'Avatar: Rồng Lửa', cost: 300, image: '🐲', type: 'avatar' },
  { id: 'av2', title: 'Avatar: Công Chúa', cost: 300, image: '👸', type: 'avatar' },
  { id: 'fr1', title: 'Khung: Vàng Ròng', cost: 500, image: '👑', type: 'frame' },
  { id: 'fr2', title: 'Khung: Cầu Vồng', cost: 600, image: '🌈', type: 'frame' },
];

export const INITIAL_PET_SPECIES: Record<string, PetSpecies> = {
  dragon: {
    id: 'dragon',
    name: 'Rồng Lửa',
    cost: 0,
    stages: [
      { minLevel: 1, image: '🥚', name: 'Trứng Bí Ẩn', dialogue: ['...', 'Lắc lắc...', 'Zzz...', 'Sắp nở rồi...'] },
      { minLevel: 5, image: '🦖', name: 'Khủng Long Con', dialogue: ['Gào!', 'Đói quá!', 'Chơi với em đi!', 'Mẹ ơi!'] },
      { minLevel: 15, image: '🐲', name: 'Rồng Chiến', dialogue: ['Ta là Rồng!', 'Bay lên nào!', 'Phùuuu lửa!', 'Bảo vệ chủ nhân!'] },
      { minLevel: 30, image: '🔥', name: 'Rồng Thần', dialogue: ['Sức mạnh tối thượng!', 'Cảm ơn chủ nhân!', 'Bất khả chiến bại!'] }
    ]
  },
  unicorn: {
    id: 'unicorn',
    name: 'Kỳ Lân',
    cost: 500,
    stages: [
      { minLevel: 1, image: '🥚', name: 'Trứng Bí Ẩn', dialogue: ['Lấp lánh...', 'Ấm áp quá...', 'Zzz...', 'Nhiều màu sắc...'] },
      { minLevel: 5, image: '🦄', name: 'Ngựa Pony', dialogue: ['Hí hí!', 'Kẹo ngọt đâu?', 'Chạy thi không?', 'Yêu bé lắm!'] },
      { minLevel: 15, image: '🌈', name: 'Kỳ Lân Bay', dialogue: ['Cầu vồng rực rỡ!', 'Bay lên trời cao!', 'Phép thuật!', 'Lung linh quá!'] },
      { minLevel: 30, image: '✨', name: 'Thần Mã', dialogue: ['Ánh sáng vĩnh cửu!', 'Bảo vệ giấc mơ!', 'Tình bạn diệu kỳ!'] }
    ]
  },
  cat: {
    id: 'cat',
    name: 'Mèo Thần Tài',
    cost: 200,
    stages: [
      { minLevel: 1, image: '📦', name: 'Trứng Bí Ẩn', dialogue: ['Meow...', 'Ai đó?', 'Tối quá...'] },
      { minLevel: 5, image: '🐱', name: 'Mèo Con', dialogue: ['Meow meow!', 'Cá đâu?', 'Gãi bụng tớ đi!'] },
      { minLevel: 15, image: '😼', name: 'Mèo Siêu Nhân', dialogue: ['Ta sẽ bắt chuột!', 'Nhanh như chớp!', 'Leo cây thôi!'] },
      { minLevel: 30, image: '🦁', name: 'Sư Tử Nhí', dialogue: ['Ta là chúa sơn lâm!', 'Gooooaooo!', 'Dũng cảm lên!'] }
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
