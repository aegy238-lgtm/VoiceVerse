
import { Gift } from "../types";
import { GIFTS } from "../constants";

// --- Mock Gift Service (No Server) ---

// In-memory storage for added gifts during session
let localGifts: Gift[] = [...GIFTS];

export const subscribeToGifts = (callback: (gifts: Gift[]) => void) => {
  callback(localGifts);
  return () => {};
};

export const addGiftToDB = async (gift: Gift) => {
  localGifts.push(gift);
};

export const deleteGiftFromDB = async (giftId: string) => {
  localGifts = localGifts.filter(g => g.id !== giftId);
};

export const seedDefaultGifts = async () => {
  // No-op in mock mode
};
