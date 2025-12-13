
import React from 'react';
import { RoomData } from '../types';
import { Users, Mic, Lock } from 'lucide-react';

interface RoomCardProps {
  room: RoomData;
  onClick: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onClick }) => {
  // Safe flag mapping
  const countryCode = room.host.countryCode?.toLowerCase() || 'eg';

  return (
    <div 
        onClick={onClick}
        className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer group shadow-lg border border-white/5"
    >
        {/* Background Image */}
        <img 
            src={room.backgroundImage || 'https://via.placeholder.com/300'} 
            alt={room.title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90"></div>

        {/* Top Left: Tags/Lock */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
             {room.tags.slice(0, 1).map((tag, i) => (
                 <span key={i} className="bg-black/40 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md border border-white/10 font-bold">
                    {tag}
                 </span>
             ))}
             {/* Fake Lock if ID ends in 5 just for UI demo */}
             {room.id.endsWith('5') && (
                 <div className="bg-yellow-500/80 p-1 rounded-md text-black">
                     <Lock size={10} />
                 </div>
             )}
        </div>

        {/* Top Right: Flag */}
        <div className="absolute top-2 right-2">
            <img 
                src={`https://flagcdn.com/w40/${countryCode}.png`} 
                alt="Country"
                className="w-5 h-3.5 rounded-[2px] shadow-sm"
            />
        </div>

        {/* Center Content (Host Avatar & Visualizer) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
            {/* Not typically shown in center in this specific design, but good for "Live" feel */}
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1">
            
            {/* Title */}
            <h3 className="text-white font-bold text-sm line-clamp-1 drop-shadow-md text-right" dir="rtl">
                {room.title}
            </h3>

            {/* Host Info Row */}
            <div className="flex items-center justify-between mt-1">
                
                {/* Visualizer & Listeners (Left) */}
                <div className="flex items-center gap-1.5 text-neon-cyan bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                    <div className="flex gap-0.5 items-end h-3">
                        <div className="w-0.5 bg-neon-cyan h-2 animate-pulse"></div>
                        <div className="w-0.5 bg-neon-cyan h-3 animate-pulse" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-0.5 bg-neon-cyan h-1.5 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-[10px] font-bold text-white">{room.audienceCount}</span>
                </div>

                {/* Host Name & Avatar (Right) */}
                <div className="flex items-center gap-1.5 bg-black/30 pr-1 pl-2 py-0.5 rounded-full border border-white/10">
                    <span className="text-[10px] text-white/90 truncate max-w-[60px] font-medium">
                        {room.host.name.split(' ')[0]}
                    </span>
                    <div className="w-6 h-6 rounded-full p-[1px] bg-gradient-to-tr from-yellow-400 to-yellow-600">
                        <img src={room.host.avatar} className="w-full h-full rounded-full object-cover" />
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};
