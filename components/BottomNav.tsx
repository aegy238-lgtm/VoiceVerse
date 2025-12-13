
import React from 'react';
import { Home, Compass, MessageCircle, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCreateRoom: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onCreateRoom }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'الرئيسية' },
    { id: 'discover', icon: Compass, label: 'استكشف' },
    { id: 'create', icon: null, label: '' }, // Placeholder for center button
    { id: 'messages', icon: MessageCircle, label: 'الرسائل' },
    { id: 'profile', icon: User, label: 'أنا' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1508] border-t border-[#3a2e15] h-16 px-4 z-40 flex justify-between items-center text-xs pb-1 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
       {/* Background Decoration */}
       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

       {navItems.map((item) => {
         if (item.id === 'create') {
            return (
                <div key={item.id} className="relative -top-5">
                    <button 
                        onClick={onCreateRoom}
                        className="w-14 h-14 rounded-full bg-gradient-to-b from-[#fcd34d] to-[#b45309] border-4 border-[#1a1508] flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.4)] hover:scale-105 transition-transform"
                    >
                        <div className="text-white font-bold text-2xl drop-shadow-md">+</div>
                    </button>
                </div>
            );
         }

         const isActive = activeTab === item.id;
         const Icon = item.icon!;

         return (
            <button 
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-1 w-16 relative z-10 transition-colors ${isActive ? 'text-[#fcd34d]' : 'text-slate-500'}`}
            >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                {isActive && (
                    <div className="absolute -bottom-2 w-1 h-1 bg-[#fcd34d] rounded-full shadow-[0_0_5px_#fcd34d]"></div>
                )}
            </button>
         );
       })}
    </div>
  );
};
