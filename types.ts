
export type RewardType = 'toy' | 'activity' | 'avatar' | 'frame';

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
  name: string; // Tên loài (chỉ phụ huynh thấy)
  stages: PetStage[];
  isCustom?: boolean;
  cost?: number; // Giá tiền để mua loài này
}

export interface PetState {
  id: string; // ID riêng của từng con thú cưng
  speciesId: string;
  name?: string; // Tên riêng do bé đặt (optional)
  level: number;
  xp: number;
  maxXp: number;
  mood: number;
  hunger: number; // 0-100: 0 là đói lả, 100 là no căng
}

export interface FoodItem {
  id: string;
  name: string;
  cost: number;
  xp: number;
  hungerDetails: number; // Độ no cộng thêm
  icon: string;
}

export interface UserData {
  name: string;
  balance: number;
  activeAvatar: string;
  activeFrame: string;
  inventory: string[];
  pets: PetState[]; // Thay đổi từ pet đơn sang mảng pets
  activePetId: string; // ID của thú cưng đang chọn
  pin: string; // Mật khẩu phụ huynh
  isTestingMode?: boolean; // Chế độ kiểm thử (hiện nút hack)
  googleScriptUrl?: string; // URL của Google Apps Script
}
