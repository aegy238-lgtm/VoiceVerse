import { db } from "../firebaseConfig";
import { 
  collection, addDoc, doc, updateDoc, 
  onSnapshot, query, orderBy, limit, 
  arrayUnion, arrayRemove, increment, getDoc 
} from "firebase/firestore";
import { RoomData, ChatMessage, User, UserRole } from "../types";

// --- Rooms ---

export const createRoomDB = async (host: User, title: string, topic: string) => {
  const roomData: Partial<RoomData> = {
    title,
    topic,
    host: { ...host, role: UserRole.HOST, isMuted: false },
    speakers: [], // Explicitly empty
    audienceCount: 1,
    tags: ['General', 'Voice'],
    isActive: true,
    createdAt: Date.now()
  };
  
  const docRef = await addDoc(collection(db, "rooms"), roomData);
  return { id: docRef.id, ...roomData };
};

export const subscribeToRooms = (callback: (rooms: RoomData[]) => void) => {
  const q = query(collection(db, "rooms"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RoomData));
    callback(rooms);
  });
};

export const joinRoomDB = async (roomId: string) => {
  const roomRef = doc(db, "rooms", roomId);
  await updateDoc(roomRef, {
    audienceCount: increment(1)
  });
};

export const leaveRoomDB = async (roomId: string) => {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      audienceCount: increment(-1)
    });
};

// --- Seats / Mic ---

export const takeSeatDB = async (roomId: string, user: User) => {
  const roomRef = doc(db, "rooms", roomId);
  const roomSnap = await getDoc(roomRef);
  if(!roomSnap.exists()) return;

  const data = roomSnap.data();
  const currentSpeakers = data.speakers || [];
  
  // Check if already a speaker to prevent duplicates
  if (currentSpeakers.some((s: User) => s.id === user.id)) {
     // Already on mic, do nothing or handle move logic in future
     return;
  }
  
  // Check if host
  if (data.host.id === user.id) {
     return; // Host is always on specific seat
  }

  if (currentSpeakers.length >= 8) {
      throw new Error("Stage is full");
  }

  // Add user to speakers array
  const speakerUser = { ...user, role: UserRole.SPEAKER, isMuted: true };
  
  // We use arrayUnion, but since user object might differ slightly (like wallet balance changes), 
  // it's safer to read-modify-write for speakers list to ensure clean state
  const newSpeakers = [...currentSpeakers, speakerUser];
  
  await updateDoc(roomRef, {
    speakers: newSpeakers
  });
};

export const leaveSeatDB = async (roomId: string, user: User) => {
  const roomRef = doc(db, "rooms", roomId);
  
  const roomSnap = await getDoc(roomRef);
  if (roomSnap.exists()) {
      const speakers = roomSnap.data().speakers as User[];
      const updatedSpeakers = speakers.filter(s => s.id !== user.id);
      await updateDoc(roomRef, { speakers: updatedSpeakers });
  }
};

export const toggleMuteDB = async (roomId: string, userId: string, isMuted: boolean) => {
    const roomRef = doc(db, "rooms", roomId);
    const roomSnap = await getDoc(roomRef);
    if (roomSnap.exists()) {
        const data = roomSnap.data();
        
        // Check if host
        if (data.host.id === userId) {
            await updateDoc(roomRef, { "host.isMuted": isMuted });
            return;
        }

        // Check speakers
        const speakers = data.speakers as User[];
        const updatedSpeakers = speakers.map(s => s.id === userId ? { ...s, isMuted } : s);
        await updateDoc(roomRef, { speakers: updatedSpeakers });
    }
};

// --- Chat ---

export const sendMessageDB = async (roomId: string, message: Partial<ChatMessage>) => {
  const messagesRef = collection(db, "rooms", roomId, "messages");
  await addDoc(messagesRef, {
    ...message,
    timestamp: Date.now()
  });
};

export const subscribeToMessages = (roomId: string, callback: (msgs: ChatMessage[]) => void) => {
  const messagesRef = collection(db, "rooms", roomId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"), limit(100));
  
  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
    callback(msgs);
  });
};