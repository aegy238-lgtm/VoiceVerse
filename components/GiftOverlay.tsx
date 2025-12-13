import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Gift, GiftTier } from '../types';

interface GiftOverlayProps {
  activeGift: { gift: Gift, senderName: string } | null;
  onAnimationComplete: () => void;
}

export const GiftOverlay: React.FC<GiftOverlayProps> = ({ activeGift, onAnimationComplete }) => {
  if (!activeGift) return null;

  const { gift, senderName } = activeGift;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
        
        {/* Text Announcement */}
        <motion.div
           initial={{ opacity: 0, y: -50 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0 }}
           className="absolute top-20 left-0 right-0 text-center z-50"
        >
          <div className="inline-block px-6 py-2 bg-black/60 backdrop-blur-md rounded-full border border-neon-purple/50">
             <span className="text-neon-cyan font-bold">{senderName}</span> sent a <span className="text-neon-pink font-bold">{gift.name}</span>!
          </div>
        </motion.div>

        {/* Tier Specific Animations */}
        
        {/* LEGENDARY: Slide Across */}
        {gift.tier === GiftTier.LEGENDARY && (
          <motion.div
            initial={{ x: '100vw', opacity: 0, scale: 0.5 }}
            animate={{ x: '-100vw', opacity: 1, scale: 1.5 }}
            transition={{ duration: 4, ease: "linear" }}
            onAnimationComplete={onAnimationComplete}
            className="text-[150px] md:text-[300px] drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            {gift.icon}
          </motion.div>
        )}

        {/* EPIC: Pop in Center */}
        {gift.tier === GiftTier.EPIC && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: [1, 1.2, 1], rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1.5 }}
            onAnimationComplete={onAnimationComplete}
            className="text-[100px] md:text-[200px] drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]"
          >
            {gift.icon}
          </motion.div>
        )}

        {/* BASIC: Just float up small */}
        {gift.tier === GiftTier.BASIC && (
          <motion.div
             initial={{ y: 200, opacity: 0 }}
             animate={{ y: -200, opacity: [0, 1, 0] }}
             transition={{ duration: 2 }}
             onAnimationComplete={onAnimationComplete}
             className="text-6xl"
          >
            {gift.icon}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};