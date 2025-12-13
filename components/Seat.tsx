import React from 'react';
import { Mic, MicOff, Crown, Plus, LogOut, ArrowUp } from 'lucide-react';
import { User } from '../types';

interface SeatProps {
  user?: User;
  isHost?: boolean;
  isMe?: boolean;
  seatIndex: number;
  onClick?: () => void;
  isLocked?: boolean;
}

export const Seat: React.FC<SeatProps> = ({ user, isHost, isMe, seatIndex, onClick, isLocked }) => {
  // Random "talking" simulation only if not me (real time audio would handle 'me')
  const isTalking = user && !user.isMuted && !isMe && Math.random() > 0.5;

  // --- EMPTY SEAT STATE ---
  if (!user) {
    return (
      <div 
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-1 cursor-pointer group active:scale-95 transition-transform"
      >
        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/10 group-hover:border-neon-cyan/50 transition-all shadow-inner overflow-hidden">
          {isLocked ? (
             <div className="text-white/20"><MicOff size={18} /></div>
          ) : (
             <>
                <div className="text-white/30 group-hover:opacity-0 transition-opacity">
                   <span className="font-bold text-lg">{seatIndex}</span>
                </div>
                
                {/* Hover Effect: Show Up Arrow */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <ArrowUp size={20} className="text-neon-cyan animate-bounce" />
                </div>
             </>
          )}
        </div>
        
        {/* Explicit Button for "Go Up" */}
        <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full group-hover:bg-neon-cyan group-hover:border-neon-cyan transition-colors">
            <span className="text-[10px] font-bold text-slate-300 group-hover:text-black block leading-none">صعود</span>
        </div>
      </div>
    );
  }

  // --- OCCUPIED SEAT STATE ---
  return (
    <div className="flex flex-col items-center justify-center gap-1 cursor-pointer relative group z-10" onClick={onClick}>
      
      {/* Avatar Container */}
      <div className="relative w-14 h-14 md:w-16 md:h-16">
        
        {/* Leave Overlay (Only if isMe) - Explicit "Down" button */}
        {isMe && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] border-2 border-red-500/50">
                <div className="flex flex-col items-center">
                    <LogOut size={16} className="text-red-400 mb-0.5" />
                </div>
            </div>
        )}

        {/* Talking Animation Rings */}
        {isTalking && (
          <>
            <div className="absolute inset-0 rounded-[24px] border-2 border-neon-cyan animate-ping opacity-75"></div>
            <div className="absolute -inset-1 rounded-[28px] border border-neon-cyan/50 animate-pulse"></div>
          </>
        )}

        {/* Host Crown */}
        {isHost && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-20 animate-bounce">
            <Crown size={20} fill="currentColor" />
          </div>
        )}

        {/* Main Avatar Image */}
        <div className={`w-full h-full rounded-[24px] p-[2px] overflow-hidden bg-gradient-to-b ${isHost ? 'from-yellow-400 to-yellow-600' : 'from-slate-400 to-slate-600'} shadow-lg`}>
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-full h-full rounded-[22px] object-cover bg-slate-800"
          />
        </div>

        {/* Mute/Talking Status Badge (Bottom Right) */}
        <div className="absolute -bottom-1 -right-1 z-20">
           {user.isMuted ? (
             <div className="bg-slate-900/90 rounded-full p-1 border border-red-500/50">
               <MicOff size={10} className="text-red-500" />
             </div>
           ) : (
             <div className="bg-neon-cyan/90 rounded-full p-1 border border-white/20 shadow-[0_0_10px_#06b6d4]">
               <Mic size={10} className="text-black" />
             </div>
           )}
        </div>
      </div>
      
      {/* Name / Action Pill */}
      {isMe ? (
          <div className="mt-1 px-3 py-0.5 bg-red-500/10 border border-red-500/50 rounded-full group-hover:bg-red-500 group-hover:text-white transition-colors">
            <p className="text-[10px] font-bold text-red-400 group-hover:text-white leading-none">نزول</p>
          </div>
      ) : (
          <div className="mt-1 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-full border border-white/5 max-w-[80px]">
            <p className="text-[10px] md:text-xs font-medium truncate text-center text-white">
               {user.name}
            </p>
          </div>
      )}
    </div>
  );
};