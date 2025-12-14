
import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, Copy, Settings, Crown, 
  ShoppingBag, Store, Wallet, Shield, 
  Users, Building2, Award, Globe, Flag, 
  Camera, FileText, X, CheckCircle, Zap,
  Music, Image as ImageIcon, MoveRight, Upload,
  LayoutDashboard, Loader2
} from 'lucide-react';
import { StoreCategory, StoreItem, User } from '../types';
import { MOCK_STORE_ITEMS } from '../constants';
import { Button } from './Button';
import { uploadFile } from '../services/storageService';

interface UserProfileProps {
  user: User;
  coins: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (name: string, avatar: string) => void;
  onOpenShop?: () => void;
  onAddCoins: (amount: number) => void;
  onPurchaseItem: (item: StoreItem) => void;
  onOpenAdmin?: () => void; 
}

type ProfileView = 'MAIN' | 'EDIT' | 'WALLET' | 'LEVEL' | 'STORE';

export const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  coins,
  isOpen, 
  onClose, 
  onUpdate,
  onOpenShop,
  onAddCoins,
  onPurchaseItem,
  onOpenAdmin
}) => {
  const [currentView, setCurrentView] = useState<ProfileView>('MAIN');
  const [storeTab, setStoreTab] = useState<StoreCategory>(StoreCategory.FRAME);
  const [editName, setEditName] = useState(user.name);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Show immediate local preview (No waiting)
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            setEditAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);

      // 2. Upload in background silently
      setIsUploading(true);
      try {
        const url = await uploadFile(file, 'avatars');
        setEditAvatar(url); // Replace local preview with remote URL when done
      } catch (error) {
        console.error("Avatar upload failed:", error);
        alert("فشل رفع الصورة. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const isVideo = (url: string) => url && (url.startsWith('data:video') || url.includes('.mp4') || url.includes('.webm'));

  // --- 1. EDIT VIEW ---
  if (currentView === 'EDIT') {
    return (
      <div className="fixed inset-0 z-[60] bg-slate-900 flex items-center justify-center p-4 text-white font-sans" dir="rtl">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl p-6 space-y-6 border border-slate-700 shadow-2xl animate-in zoom-in-95">
           <div className="flex justify-between items-center">
             <h3 className="text-xl font-bold">تعديل الملف الشخصي</h3>
             <button onClick={() => setCurrentView('MAIN')} className="p-2 hover:bg-slate-700 rounded-full"><ChevronLeft /></button>
           </div>
           
           <div className="space-y-6 flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 rounded-full border-4 border-slate-600 overflow-hidden bg-slate-900 shadow-lg relative">
                    <img src={editAvatar} alt="Avatar Preview" className="w-full h-full object-cover transition-opacity duration-300" />
                    {/* Removed Spinner Overlay - Image is always visible now */}
                </div>
                
                <div className="absolute bottom-0 right-0 bg-neon-cyan p-2 rounded-full text-black shadow-lg border-2 border-slate-800">
                    <Camera size={18} />
                </div>

                <input 
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                />
              </div>

              <div className="w-full space-y-4">
                <div>
                    <label className="block text-sm text-slate-400 mb-2 font-bold">الاسم</label>
                    <input 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 focus:border-neon-cyan outline-none transition-colors font-medium text-lg"
                    maxLength={20}
                    />
                </div>

                <div className="pt-2">
                    <button 
                        disabled={isUploading}
                        onClick={() => {
                        onUpdate(editName, editAvatar);
                        setCurrentView('MAIN');
                        }}
                        className="w-full bg-gradient-to-r from-neon-cyan to-blue-500 py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isUploading ? (
                             <>
                               <Loader2 className="animate-spin" size={20}/>
                               <span>جاري المعالجة...</span>
                             </>
                        ) : (
                             "حفظ التغييرات"
                        )}
                    </button>
                </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- 2. WALLET VIEW ---
  if (currentView === 'WALLET') {
    return (
      <div className="fixed inset-0 z-[60] bg-gray-50 flex flex-col font-sans" dir="rtl">
        <div className="bg-white p-4 pt-6 shadow-sm flex items-center gap-4 sticky top-0 z-10">
            <button onClick={() => setCurrentView('MAIN')} className="p-2 hover:bg-gray-100 rounded-full text-slate-700"><ChevronLeft size={28} /></button>
            <h3 className="font-bold text-xl text-slate-800">محفظتي</h3>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-10 -translate-y-10"></div>
                <div className="relative z-10">
                    <p className="text-white/90 font-medium mb-1">الرصيد الحالي</p>
                    <div className="text-5xl font-bold flex items-center gap-3 tracking-tight">
                        <Wallet size={40} fill="white" className="text-white/20" /> 
                        {coins.toLocaleString()}
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2">
                    <Zap size={20} className="text-yellow-500" fill="currentColor" /> شحن الرصيد
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { amount: 100, price: '$0.99', bonus: '' },
                        { amount: 550, price: '$4.99', bonus: '+50 مجاناً' },
                        { amount: 1200, price: '$9.99', bonus: '+200 مجاناً' },
                        { amount: 2500, price: '$19.99', bonus: 'الأكثر طلباً 🔥' },
                        { amount: 6500, price: '$49.99', bonus: '+1500 مجاناً' },
                        { amount: 14000, price: '$99.99', bonus: 'VIP 👑' },
                    ].map((pack, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => onAddCoins(pack.amount)}
                            className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-orange-400 hover:shadow-lg transition-all relative overflow-hidden group"
                        >
                            {pack.bonus && <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-bl-lg font-bold">{pack.bonus}</div>}
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-1 group-hover:scale-110 transition-transform">
                                <Wallet size={20} />
                            </div>
                            <span className="font-bold text-slate-800 text-lg">{pack.amount}</span>
                            <span className="text-xs text-slate-500 font-medium">{pack.price}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- 3. LEVEL VIEW ---
  if (currentView === 'LEVEL') {
      const currentLevel = user.level;
      const totalSpent = user.totalSpent || 5000;
      const nextLevelThreshold = (currentLevel + 1) * 1000;
      const currentLevelThreshold = currentLevel * 1000;
      const progress = ((totalSpent - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100;
      const remaining = nextLevelThreshold - totalSpent;

      return (
        <div className="fixed inset-0 z-[60] bg-gray-50 flex flex-col font-sans" dir="rtl">
            <div className="bg-white p-4 pt-6 shadow-sm flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => setCurrentView('MAIN')} className="p-2 hover:bg-gray-100 rounded-full text-slate-700"><ChevronLeft size={28} /></button>
                <h3 className="font-bold text-xl text-slate-800">مستوى الثروة</h3>
            </div>
            {/* Level Content ... */}
             <div className="p-6 space-y-8 overflow-y-auto">
                <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="absolute inset-0 bg-pink-500/20 rounded-full animate-pulse"></div>
                        <div className="w-28 h-28 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative z-10">
                            <Shield size={50} className="text-white" fill="currentColor" />
                            <div className="absolute -bottom-2 bg-white text-pink-600 font-black px-4 py-1 rounded-full border border-pink-100 shadow-sm text-lg">
                                Lv.{currentLevel}
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
      );
  }

  // --- 4. STORE VIEW ---
  if (currentView === 'STORE') {
      const items = MOCK_STORE_ITEMS.filter(i => i.category === storeTab);

      return (
        <div className="fixed inset-0 z-[60] bg-gray-50 flex flex-col font-sans" dir="rtl">
            {/* Store Header */}
            <div className="bg-white p-4 pt-6 shadow-sm flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <button onClick={() => setCurrentView('MAIN')} className="p-2 hover:bg-gray-100 rounded-full text-slate-700"><ChevronLeft size={28} /></button>
                  <h3 className="font-bold text-xl text-slate-800">المتجر</h3>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-gray-200">
                    <Wallet size={16} className="text-yellow-500" />
                    <span className="font-bold text-slate-700">{coins}</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center p-2 bg-white border-b border-gray-100 sticky top-[72px] z-10 overflow-x-auto">
                <button 
                  onClick={() => setStoreTab(StoreCategory.FRAME)}
                  className={`flex-1 min-w-[100px] py-3 text-sm font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${storeTab === StoreCategory.FRAME ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}
                >
                    <ImageIcon size={20} /> الإطارات
                </button>
                <button 
                  onClick={() => setStoreTab(StoreCategory.ENTRY)}
                  className={`flex-1 min-w-[100px] py-3 text-sm font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${storeTab === StoreCategory.ENTRY ? 'bg-purple-50 text-purple-600' : 'text-slate-400'}`}
                >
                    <MoveRight size={20} /> الدخليات
                </button>
                <button 
                  onClick={() => setStoreTab(StoreCategory.AUDIO)}
                  className={`flex-1 min-w-[100px] py-3 text-sm font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${storeTab === StoreCategory.AUDIO ? 'bg-red-50 text-red-600' : 'text-slate-400'}`}
                >
                    <Music size={20} /> الصوتيات
                </button>
            </div>

            {/* Content */}
            <div className="p-4 grid grid-cols-2 gap-4 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center relative group">
                      {/* Preview Box */}
                      <div className="w-full h-32 bg-gray-50 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                          {storeTab === StoreCategory.FRAME && (
                              <div className="relative w-20 h-20 rounded-full border-2 overflow-hidden flex items-center justify-center bg-gray-200">
                                  {/* Avatar */}
                                  <img src={user.avatar} className="w-full h-full object-cover" />
                                  
                                  {/* Frame Overlay (Video or Image) */}
                                  <div className="absolute -inset-1 z-10 pointer-events-none">
                                      {isVideo(item.icon) ? (
                                          <video src={item.icon} autoPlay loop muted playsInline className="w-full h-full object-contain scale-110" />
                                      ) : (
                                          item.icon.startsWith('http') || item.icon.startsWith('data:') ? (
                                              <img src={item.icon} className="w-full h-full object-contain scale-125" />
                                          ) : null
                                      )}
                                  </div>
                              </div>
                          )}
                          {storeTab === StoreCategory.ENTRY && (
                               isVideo(item.icon) ? (
                                   <video src={item.icon} autoPlay loop muted playsInline className="w-full h-full object-contain" />
                               ) : (
                                   <div className="text-6xl animate-pulse">{item.icon}</div>
                               )
                          )}
                          {storeTab === StoreCategory.AUDIO && (
                              <div className="flex gap-1 items-end h-10">
                                  <div className="w-1.5 h-4 bg-red-400 rounded-full animate-bounce"></div>
                                  <div className="w-1.5 h-8 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                  <div className="w-1.5 h-6 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                  <div className="w-1.5 h-10 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                              </div>
                          )}
                      </div>

                      <h4 className="font-bold text-slate-800 text-center mb-1">{item.name}</h4>
                      {item.description && <p className="text-[10px] text-slate-400 text-center mb-2 line-clamp-1">{item.description}</p>}
                      <div className="text-xs font-medium text-slate-500 bg-gray-100 px-2 py-0.5 rounded mb-3">{item.durationDays} يوم</div>

                      <button 
                        onClick={() => onPurchaseItem(item)}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-transform flex items-center justify-center gap-1"
                      >
                         <Wallet size={14} /> {item.price}
                      </button>
                  </div>
                ))}
            </div>
        </div>
      );
  }

  // --- 5. MAIN PROFILE VIEW ---
  return (
    <div className="fixed inset-0 z-[50] bg-gray-50 flex flex-col font-sans overflow-y-auto" dir="rtl">
      
      {/* 1. Header & Top Info Section (Teal Gradient) */}
      <div className="relative bg-gradient-to-b from-[#4fd1c5] to-[#81e6d9] pb-8 rounded-b-[40px] shadow-lg">
         
         {/* Navigation Bar */}
         <div className="flex justify-between items-center p-4 text-white pt-8">
            <button onClick={() => setCurrentView('EDIT')} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <Settings size={24} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <ChevronLeft size={28} />
            </button>
         </div>

         {/* Profile Info */}
         <div className="flex flex-col items-center mt-2 px-4">
            <div className="relative">
               {/* Avatar Frame */}
               <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-200">
                 <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
               </div>
               {user.countryCode === 'EG' && (
                 <img 
                    src="https://flagcdn.com/w40/eg.png" 
                    alt="Egypt" 
                    className="absolute bottom-0 right-0 w-6 h-4 border border-white shadow-sm"
                 />
               )}
            </div>
            
            <div className="flex items-center gap-2 mt-3 text-white">
               <img src="https://flagcdn.com/w40/eg.png" className="w-5 h-3 shadow-sm rounded-[2px]" alt="Flag"/>
               <h2 className="text-xl font-bold drop-shadow-md">{user.name}</h2>
            </div>
            {/* Stats... */}
            <div className="flex justify-between w-full max-w-xs mt-6 text-white text-center">
               <div className="flex flex-col">
                  <span className="font-bold text-lg">{user.friendsCount || 0}</span>
                  <span className="text-xs text-white/80">الاصدقاء</span>
               </div>
               <div className="flex flex-col">
                  <span className="font-bold text-lg">{user.fansCount || 0}</span>
                  <span className="text-xs text-white/80">المعجبين</span>
               </div>
               <div className="flex flex-col">
                  <span className="font-bold text-lg">{user.followingCount || 0}</span>
                  <span className="text-xs text-white/80">متابعة</span>
               </div>
            </div>
         </div>
      </div>

      {/* Grid Menu... */}
       <div className="px-4 mt-4">
         <div className="bg-white rounded-2xl shadow-sm p-4 grid grid-cols-4 gap-4 text-center">
            
            <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => alert('الحقيبة فارغة حالياً')}>
               <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-500">
                  <ShoppingBag size={24} fill="currentColor" className="opacity-80"/>
               </div>
               <span className="text-gray-700 text-xs font-bold">حقيبتي</span>
            </div>

            <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => setCurrentView('STORE')}>
               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                  <Store size={24} fill="currentColor" className="opacity-80"/>
               </div>
               <span className="text-gray-700 text-xs font-bold">المتجر</span>
            </div>

            <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => setCurrentView('LEVEL')}>
               <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
                  <Shield size={24} fill="currentColor" className="opacity-80"/>
                  <span className="absolute text-[10px] font-bold text-white mt-1">Lv</span>
               </div>
               <span className="text-gray-700 text-xs font-bold">المستوى</span>
            </div>

            <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => setCurrentView('WALLET')}>
               <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                  <Wallet size={24} fill="currentColor" className="opacity-80"/>
               </div>
               <span className="text-gray-700 text-xs font-bold">المحفظة</span>
            </div>

         </div>
      </div>

      <div className="px-4 mt-4 mb-8">
         <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
               <div className="flex items-center gap-3">
                  <div className="text-gray-600"><Users size={20} /></div>
                  <span className="text-gray-700 font-medium">العائلة</span>
               </div>
               <ChevronLeft size={16} className="text-gray-400" />
            </div>
            {/* ... Other menu items ... */}
         </div>

          {onOpenAdmin && (
             <div onClick={onOpenAdmin} className="flex items-center justify-center p-4 mt-4 mb-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl cursor-pointer border border-slate-700 shadow-lg group hover:border-red-500/50 transition-all">
                <div className="flex items-center gap-3 text-red-400 group-hover:text-red-300">
                   <LayoutDashboard size={20} />
                   <span className="font-bold">لوحة تحكم الإدارة</span>
                </div>
             </div>
          )}

      </div>

    </div>
  );
};
