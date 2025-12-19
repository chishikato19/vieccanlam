
export type RewardType = 'toy' | 'activity' | 'avatar' | 'frame' | 'decor' | 'mystery_box';

export interface Task {
  id: string;
  title: string;
  points: number;
  icon: string;
  status: 'todo' | 'pending' | 'done';
  isDaily: boolean;
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
  activeDecors: string[]; // Danh sách ID các đồ nội thất đang đặt trong phòng
  pets: PetState[];
  activePetId: string;
  pin: string;
  isTestingMode?: boolean;
  googleScriptUrl?: string;
}
