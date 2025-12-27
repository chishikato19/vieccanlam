
export type RewardType = 'toy' | 'activity' | 'avatar' | 'frame';

export interface Task {
  id: string;
  title: string;
  points: number;
  icon: string;
  status: 'todo' | 'pending' | 'done';
  isDaily: boolean;
  // Thống kê cho bé
  streak: number; 
  totalCompletions: number;
  totalSkips: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  targetTaskId: string; // Danh hiệu gắn với nhiệm vụ nào
  requiredCompletions: number; // Đạt được sau N lần làm
  revocationThreshold: number; // Bị tước sau N lần không làm
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  image: string;
  type: RewardType;
}

export interface PetStage {
  minLevel: number;
  image: string;
  name: string;
  dialogue: string[];
}

export interface PetSpecies {
  id: string;
  name: string;
  stages: PetStage[];
  isCustom?: boolean;
  cost?: number;
}

export interface PetState {
  id: string;
  speciesId: string;
  name?: string;
  level: number;
  xp: number;
  maxXp: number;
  mood: number;
  hunger: number;
}

export interface FoodItem {
  id: string;
  name: string;
  cost: number;
  xp: number;
  hungerDetails: number;
  icon: string;
}

export interface UserData {
  name: string;
  balance: number;
  activeAvatar: string;
  activeFrame: string;
  inventory: string[];
  pets: PetState[];
  activePetId: string;
  pin: string;
  isTestingMode?: boolean;
  googleScriptUrl?: string;
  badges: string[]; // Danh sách ID danh hiệu bé đang sở hữu
  badgeHistory: Record<string, { completions: number, skips: number }>; // Theo dõi tiến trình riêng cho danh hiệu
}
