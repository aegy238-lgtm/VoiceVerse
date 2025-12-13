
import { Gift, GiftTier, RoomData, StoreCategory, StoreItem, User, UserRole, UserStatus } from "./types";

export const MOCK_USER: User = {
  id: '25809161',
  name: 'Ahmad123 Ahmed',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80',
  role: UserRole.AUDIENCE,
  level: 99,
  isMuted: true,
  status: UserStatus.ACTIVE,
  totalSpent: 5000,
  countryCode: 'EG',
  friendsCount: 15,
  fansCount: 120,
  followingCount: 45,
  isVip: true
};

export const MOCK_ALL_USERS: User[] = [
  { id: 'u1', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80', role: UserRole.HOST, level: 45, isMuted: false, status: UserStatus.ACTIVE, joinDate: '2023-01-15', totalSpent: 1200, countryCode: 'SA' },
  { id: 'u2', name: 'Mike', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80', role: UserRole.SPEAKER, level: 20, isMuted: false, status: UserStatus.ACTIVE, joinDate: '2023-02-20', totalSpent: 50, countryCode: 'US' },
  { id: 'u3', name: 'Layla', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80', role: UserRole.SPEAKER, level: 33, isMuted: true, status: UserStatus.ACTIVE, joinDate: '2023-03-10', totalSpent: 3000, countryCode: 'AE' },
  { id: 'u4', name: 'DevDave', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80', role: UserRole.HOST, level: 99, isMuted: false, status: UserStatus.ACTIVE, joinDate: '2022-11-05', totalSpent: 15000, countryCode: 'CA' },
  { id: 'u5', name: 'PoetX', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80', role: UserRole.HOST, level: 50, isMuted: false, status: UserStatus.BANNED, joinDate: '2023-05-01', totalSpent: 0, countryCode: 'KW' },
  { id: 'u6', name: 'Omar', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80', role: UserRole.SPEAKER, level: 15, isMuted: false, status: UserStatus.ACTIVE, joinDate: '2023-06-12', totalSpent: 100, countryCode: 'EG' },
];

export const GIFTS: Gift[] = [
  { id: 'rose', name: 'Rose', price: 1, icon: '🌹', tier: GiftTier.BASIC },
  { id: 'heart', name: 'Heart', price: 10, icon: '💖', tier: GiftTier.EPIC },
  { id: 'car', name: 'Sports Car', price: 500, icon: '🏎️', tier: GiftTier.LEGENDARY },
  { id: 'rocket', name: 'Rocket', price: 1000, icon: '🚀', tier: GiftTier.LEGENDARY },
  { id: 'dragon', name: 'Dragon', price: 5000, icon: '🐉', tier: GiftTier.LEGENDARY },
];

export const MOCK_STORE_ITEMS: StoreItem[] = [
  // Frames
  { id: 'f1', name: 'Golden Glow', category: StoreCategory.FRAME, price: 500, icon: 'https://cdn-icons-png.flaticon.com/512/12308/12308333.png', previewColor: '#fbbf24', durationDays: 30 },
  { id: 'f2', name: 'Neon Cyber', category: StoreCategory.FRAME, price: 1200, icon: 'https://cdn-icons-png.flaticon.com/512/10709/10709827.png', previewColor: '#06b6d4', durationDays: 30 },
  { id: 'f3', name: 'Royal Rose', category: StoreCategory.FRAME, price: 800, icon: 'https://cdn-icons-png.flaticon.com/512/9721/9721058.png', previewColor: '#ec4899', durationDays: 7 },
  
  // Entry Effects
  { id: 'e1', name: 'Ferrari Drift', category: StoreCategory.ENTRY, price: 5000, icon: '🏎️', description: 'Sports car drifts across screen', durationDays: 30 },
  { id: 'e2', name: 'Phoenix Rise', category: StoreCategory.ENTRY, price: 8000, icon: '🦅', description: 'Fire bird animation on entry', durationDays: 30 },
  { id: 'e3', name: 'Red Carpet', category: StoreCategory.ENTRY, price: 2000, icon: '🎬', description: 'Classy spotlight entrance', durationDays: 30 },

  // Audio Effects
  { id: 'a1', name: 'Deep Voice', category: StoreCategory.AUDIO, price: 300, icon: '🎤', description: 'Make your voice sound deeper', durationDays: 1 },
  { id: 'a2', name: 'Chipmunk', category: StoreCategory.AUDIO, price: 300, icon: '🐿️', description: 'High pitched funny voice', durationDays: 1 },
  { id: 'a3', name: 'Studio Echo', category: StoreCategory.AUDIO, price: 1500, icon: '🎧', description: 'Professional reverb effect', durationDays: 30 },
];

export const MOCK_ROOMS: RoomData[] = [
  {
    id: 'room-1',
    title: 'وكالة شحن معتمدة ID 6666555',
    topic: 'شحن فوري وعروض خاصة',
    host: MOCK_ALL_USERS[0],
    speakers: [], 
    audienceCount: 26,
    tags: ['Love', 'Friends'],
    isActive: true,
    backgroundImage: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80'
  },
  {
    id: 'room-2',
    title: '👑 حفلة الملك والملكة 👑',
    topic: 'مسابقات وجوائز قيمة',
    host: MOCK_ALL_USERS[3],
    speakers: [], 
    audienceCount: 158,
    tags: ['Sing', 'Contest'],
    isActive: true,
    backgroundImage: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&q=80'
  },
  {
    id: 'room-3',
    title: 'ليالي الطرب الأصيل 🎵',
    topic: 'غناء وعزف مباشر',
    host: MOCK_ALL_USERS[4],
    speakers: [], 
    audienceCount: 42,
    tags: ['Music', 'Art'],
    isActive: true,
    backgroundImage: 'https://images.unsplash.com/photo-1514525253440-b393452e233e?auto=format&fit=crop&q=80'
  },
   {
    id: 'room-4',
    title: 'سوريا الحبيبة ❤️',
    topic: 'تجمع العائلة والأصدقاء',
    host: MOCK_ALL_USERS[2],
    speakers: [], 
    audienceCount: 89,
    tags: ['Family', 'Syria'],
    isActive: true,
    backgroundImage: 'https://images.unsplash.com/photo-1565552631558-751225026217?auto=format&fit=crop&q=80'
  },
  {
    id: 'room-5',
    title: 'وكالة نفرتيتي 🦅',
    topic: 'أقوى الداعمين',
    host: MOCK_ALL_USERS[5],
    speakers: [], 
    audienceCount: 16,
    tags: ['Egypt', 'Power'],
    isActive: true,
    backgroundImage: 'https://images.unsplash.com/photo-1539656827761-359489b52b4d?auto=format&fit=crop&q=80'
  }
];
