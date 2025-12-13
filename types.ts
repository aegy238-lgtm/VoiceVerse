
export enum UserRole {
  HOST = 'HOST',
  SPEAKER = 'SPEAKER',
  AUDIENCE = 'AUDIENCE'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED'
}

export enum GiftTier {
  BASIC = 'BASIC',   // No animation, just chat log
  EPIC = 'EPIC',     // Small animation
  LEGENDARY = 'LEGENDARY' // Full screen takeover
}

export enum StoreCategory {
  FRAME = 'FRAME',
  ENTRY = 'ENTRY',
  AUDIO = 'AUDIO'
}

export interface StoreItem {
  id: string;
  name: string;
  category: StoreCategory;
  price: number;
  icon: string; // Image URL or Emoji
  previewColor?: string; // For frames
  description?: string;
  durationDays?: number; // Subscription duration
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  level: number;
  isMuted: boolean;
  status?: UserStatus;
  joinDate?: string;
  totalSpent?: number;
  walletBalance?: number;
  // New fields for Profile UI
  countryCode?: string; // e.g., 'EG' for Egypt
  friendsCount?: number;
  fansCount?: number; // المعجبين
  followingCount?: number; // متابعة
  isVip?: boolean;
}

export interface Gift {
  id: string;
  name: string;
  price: number;
  icon: string;
  tier: GiftTier;
  animationUrl?: string; 
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  isSystem?: boolean;
  isGift?: boolean;
  giftData?: {
    giftName: string;
    amount: number;
  };
  timestamp: number;
}

export interface RoomData {
  id: string;
  title: string;
  topic: string;
  host: User;
  speakers: User[];
  audienceCount: number;
  tags: string[];
  isActive?: boolean;
  createdAt?: number;
  backgroundImage?: string; // New field for UI
}
