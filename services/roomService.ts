
import { RoomData, ChatMessage, User, UserRole } from "../types";
import { MOCK_ROOMS } from "../constants";

// --- Mock Room Service (No Server) ---

// In-memory rooms for this session
let localRooms: RoomData[] = [...MOCK_ROOMS];
let roomMessages: Record<string, ChatMessage[]> = {};

export const createRoomDB = async (host: User, title: string, topic: string) => {
  const newRoom: RoomData = {
    id: `room-${Date.now()}`,
    title,
    topic,
    host: { ...host, role: UserRole.HOST, isMuted: false },
    speakers: [],
    audienceCount: 1,
    tags: ['New', 'Live'],
    isActive: true,
    createdAt: Date.now(),
    backgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80'
  };
  
  localRooms.unshift(newRoom);
  return newRoom;
};

export const subscribeToRooms = (callback: (rooms: RoomData[]) => void) => {
  // Return the local rooms immediately
  callback(localRooms);
  // Since we don't have real event listeners in pure JS without an event bus, 
  // this won't "update" automatically if another part of the code changes it 
  // unless we implement a custom observer. For a simple demo, this is static.
  return () => {};
};

export const joinRoomDB = async (roomId: string) => {
  const room = localRooms.find(r => r.id === roomId);
  if (room) {
    room.audienceCount++;
  }
};

export const leaveRoomDB = async (roomId: string) => {
  const room = localRooms.find(r => r.id === roomId);
  if (room) {
    room.audienceCount = Math.max(0, room.audienceCount - 1);
  }
};

// --- Seats / Mic ---

export const takeSeatDB = async (roomId: string, user: User) => {
  const room = localRooms.find(r => r.id === roomId);
  if (!room) return;

  // Mock logic
  if (room.host.id === user.id) return;
  if (room.speakers.some(s => s.id === user.id)) return;
  
  if (room.speakers.length >= 8) throw new Error("Stage full");

  room.speakers.push({ ...user, role: UserRole.SPEAKER, isMuted: true });
};

export const leaveSeatDB = async (roomId: string, user: User) => {
  const room = localRooms.find(r => r.id === roomId);
  if (room) {
    room.speakers = room.speakers.filter(s => s.id !== user.id);
  }
};

export const toggleMuteDB = async (roomId: string, userId: string, isMuted: boolean) => {
   const room = localRooms.find(r => r.id === roomId);
   if (!room) return;

   if (room.host.id === userId) {
       room.host.isMuted = isMuted;
   } else {
       const speaker = room.speakers.find(s => s.id === userId);
       if (speaker) speaker.isMuted = isMuted;
   }
};

export const updateUserInRoomDB = async (roomId: string, userId: string, name: string, avatar: string) => {
   const room = localRooms.find(r => r.id === roomId);
   if (!room) return;

   if (room.host.id === userId) {
       room.host.name = name;
       room.host.avatar = avatar;
   } else {
       const speaker = room.speakers.find(s => s.id === userId);
       if (speaker) {
           speaker.name = name;
           speaker.avatar = avatar;
       }
   }
};

// --- Chat ---

export const sendMessageDB = async (roomId: string, message: Partial<ChatMessage>) => {
   if (!roomMessages[roomId]) roomMessages[roomId] = [];
   
   roomMessages[roomId].push({
       id: `msg-${Date.now()}`,
       userId: message.userId!,
       userName: message.userName!,
       text: message.text || '',
       timestamp: Date.now(),
       isGift: message.isGift,
       giftData: message.giftData
   });
};

export const subscribeToMessages = (roomId: string, callback: (msgs: ChatMessage[]) => void) => {
    // Initial load
    callback(roomMessages[roomId] || []);
    
    // Simulate incoming messages or just return static
    const interval = setInterval(() => {
        // Poll for changes (Mocking real-time)
        if (roomMessages[roomId]) {
            callback([...roomMessages[roomId]]);
        }
    }, 1000);

    return () => clearInterval(interval);
};
