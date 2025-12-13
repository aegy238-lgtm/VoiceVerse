
import React, { useState, useEffect } from 'react';
import { Gift, Mic, MicOff, Search, Wallet, Bell, ChevronDown, X } from 'lucide-react';
import { GIFTS, MOCK_ALL_USERS } from './constants';
import { RoomData, ChatMessage, Gift as GiftType, GiftTier, User, StoreItem } from './types';
import { Seat } from './components/Seat';
import { LoginScreen } from './components/LoginScreen';
import { GiftOverlay } from './components/GiftOverlay';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfile } from './components/UserProfile';
import { CreateRoomModal } from './components/CreateRoomModal';
import { RoomCard } from './components/RoomCard';
import { BottomNav } from './components/BottomNav';
import { subscribeToUser, addCoinsDB, deductCoinsDB, updateUserProfileDB } from './services/userService';
import { signInWithGoogle, loginWithEmail, registerWithEmail } from './services/authService';
import { auth } from './firebaseConfig';
import { 
  createRoomDB, subscribeToRooms, joinRoomDB, leaveRoomDB, 
  takeSeatDB, leaveSeatDB, toggleMuteDB, 
  sendMessageDB, subscribeToMessages 
} from './services/roomService';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  // --- AUTH STATE ---
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // --- APP STATE ---
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [currentRoom, setCurrentRoom] = useState<RoomData | null>(null);
  
  // --- UI STATE ---
  const [activeGift, setActiveGift] = useState<{ gift: GiftType, senderName: string } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGiftShopOpen, setGiftShopOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // Bottom Nav
  const [activeFilter, setActiveFilter] = useState('ALL'); // Top Filter
  
  // Local User Coins (Synced)
  const [userCoins, setUserCoins] = useState(0);

  // 1. INITIALIZE AUTH & USER LISTENER
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        subscribeToUser(firebaseUser.uid, (userData) => {
           if (userData) {
             setUser({ ...userData, id: firebaseUser.uid });
             setUserCoins(userData.walletBalance || 0);
           }
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. INITIALIZE ROOMS LISTENER
  useEffect(() => {
    if (!user) return;
    const unsubscribeRooms = subscribeToRooms((fetchedRooms) => {
       setRooms(fetchedRooms);
       if (currentRoom) {
         const updatedCurrent = fetchedRooms.find(r => r.id === currentRoom.id);
         if (updatedCurrent) setCurrentRoom(updatedCurrent);
         else setCurrentRoom(null);
       }
    });
    return () => unsubscribeRooms();
  }, [user, currentRoom?.id]);

  // 3. LISTEN TO MESSAGES & GIFTS
  useEffect(() => {
    if (!currentRoom) return;
    const unsubscribeMsgs = subscribeToMessages(currentRoom.id, (msgs) => {
      setMessages(msgs);
      const lastMsg = msgs[msgs.length - 1];
      if (lastMsg && lastMsg.isGift && Date.now() - lastMsg.timestamp < 3000) {
         const giftObj = GIFTS.find(g => g.name === lastMsg.giftData?.giftName);
         if (giftObj && giftObj.tier !== GiftTier.BASIC) {
            setActiveGift({ gift: giftObj, senderName: lastMsg.userName });
         }
      }
    });
    return () => unsubscribeMsgs();
  }, [currentRoom?.id]);

  // --- HANDLERS (Same as before) ---
  const handleGoogleLogin = async () => { /* ... */ try { await signInWithGoogle(); } catch (e: any) { setLoginError(e.message); } };
  const handleEmailLogin = async (e: string, p: string) => { try { await loginWithEmail(e, p); } catch (err: any) { setLoginError(err.message); } };
  const handleRegister = async (e: string, p: string, n: string) => { try { await registerWithEmail(e, p, n); } catch (err: any) { setLoginError(err.message); } };

  const handleCreateRoom = () => { if (!user) return; setIsCreatingRoom(true); };
  const handleConfirmCreateRoom = async (title: string, topic: string) => {
    if (!user) return;
    try {
      const newRoom = await createRoomDB(user, title, topic);
      handleJoinRoom(newRoom as RoomData);
    } catch (e) { alert("Could not create room"); }
  };

  const handleJoinRoom = async (room: RoomData) => { if (!user) return; await joinRoomDB(room.id); setCurrentRoom(room); };
  const handleLeaveRoom = async () => {
    if (!user || !currentRoom) return;
    const isSpeaker = currentRoom.speakers.some(s => s.id === user.id);
    if (isSpeaker) await leaveSeatDB(currentRoom.id, user);
    await leaveRoomDB(currentRoom.id);
    setCurrentRoom(null);
    setMessages([]);
  };

  const handleTakeMic = async () => { if (!user || !currentRoom) return; try { await takeSeatDB(currentRoom.id, user); } catch (e: any) { alert(e.message); } };
  const handleLeaveMic = async () => { if (!user || !currentRoom) return; await leaveSeatDB(currentRoom.id, user); };
  const handleToggleMute = async () => {
     if (!user || !currentRoom) return;
     let isMuted = false;
     if (currentRoom.host.id === user.id) isMuted = currentRoom.host.isMuted;
     else { const s = currentRoom.speakers.find(s => s.id === user.id); if (s) isMuted = s.isMuted; }
     await toggleMuteDB(currentRoom.id, user.id, !isMuted);
  };
  const handleSendMessage = async (text: string) => { if (!user || !currentRoom) return; await sendMessageDB(currentRoom.id, { userId: user.id, userName: user.name, text }); };
  const handleSendGift = async (gift: GiftType) => {
    if (!user || !currentRoom) return;
    if (userCoins < gift.price) { alert("Not enough coins!"); return; }
    try {
        await deductCoinsDB(user.id, gift.price);
        setGiftShopOpen(false);
        await sendMessageDB(currentRoom.id, { userId: user.id, userName: user.name, text: '', isGift: true, giftData: { giftName: gift.name, amount: 1 } });
    } catch (e) { alert("Gift transaction failed"); }
  };
  const handleAddCoins = async (amount: number) => { if (!user) return; await addCoinsDB(user.id, amount); };
  const handleUpdateProfile = async (name: string, avatar: string) => { if (!user) return; await updateUserProfileDB(user.id, name, avatar); };
  const handlePurchaseItem = async (item: StoreItem) => { if (!user) return; if (userCoins >= item.price) { await deductCoinsDB(user.id, item.price); alert(`Bought ${item.name}!`); } else { alert("Not enough coins"); } };

  // New Tab Handler
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'profile') {
      setProfileOpen(true);
    }
  };

  // --- RENDERING ---

  if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-yellow-500 rounded-full border-t-transparent"></div></div>;

  if (!user) return <LoginScreen onGoogleLogin={handleGoogleLogin} onEmailLogin={handleEmailLogin} onRegister={handleRegister} isLoading={authLoading} error={loginError} />;

  if (isAdminView) return <div className="relative"><button onClick={() => setIsAdminView(false)} className="fixed bottom-4 right-4 z-50 bg-slate-800 p-3 rounded-full text-white"><X /></button><AdminDashboard /></div>;

  // LOBBY VIEW (UPDATED DESIGN)
  if (!currentRoom) {
      // Mock Data for UI
      const topUsers = MOCK_ALL_USERS.slice(0, 3);
      
      return (
        <div className="min-h-screen bg-[#0f0e0c] font-sans text-white pb-20 relative overflow-x-hidden" dir="rtl">
             {/* Background Pattern */}
             <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
             
             <UserProfile 
                user={user} 
                coins={userCoins} 
                isOpen={isProfileOpen} 
                onClose={() => { 
                    setProfileOpen(false); 
                    setActiveTab('home'); 
                }}
                onUpdate={handleUpdateProfile} 
                onOpenShop={() => { setProfileOpen(false); setGiftShopOpen(true); }}
                onAddCoins={handleAddCoins} 
                onPurchaseItem={handlePurchaseItem}
             />
             
             <CreateRoomModal isOpen={isCreatingRoom} onClose={() => setIsCreatingRoom(false)} onCreate={handleConfirmCreateRoom} />

             {/* Header */}
             <header className="sticky top-0 z-30 pt-4 pb-2 px-4 bg-gradient-to-b from-[#0f0e0c] via-[#0f0e0c]/90 to-transparent flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Search className="text-white/70" size={24} />
                    <div className="relative">
                        <Bell className="text-white/70" size={24} />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0f0e0c]"></span>
                    </div>
                </div>
                
                {/* Center Tabs */}
                <div className="flex gap-6 text-lg font-bold">
                    <span className="text-white/50 text-sm">المتابعة</span>
                    <span className="text-white text-xl relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-1 after:bg-[#fcd34d] after:rounded-full">توصية</span>
                    <span className="text-white/50 text-sm">أنا</span>
                </div>

                <div className="w-9 h-9 rounded-full border border-white/20 overflow-hidden" onClick={() => setProfileOpen(true)}>
                    <img src={user.avatar} className="w-full h-full object-cover" />
                </div>
             </header>

             <main className="space-y-6 relative z-10">
                 
                 {/* Top Ranking Widget (Podium) */}
                 <div className="px-4 mt-2">
                    <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-2xl p-4 border border-white/5 relative overflow-hidden">
                        {/* Background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full"></div>
                        
                        <div className="flex justify-around items-end h-28 relative z-10">
                            {/* 2nd Place */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="relative w-14 h-14 rounded-full border-2 border-slate-300 p-0.5">
                                    <img src={topUsers[1]?.avatar} className="w-full h-full rounded-full object-cover" />
                                    <div className="absolute -bottom-2 bg-slate-300 text-black text-[10px] font-bold px-1.5 rounded-full">2</div>
                                </div>
                                <span className="text-xs text-slate-300 truncate w-16 text-center">{topUsers[1]?.name}</span>
                            </div>

                            {/* 1st Place */}
                            <div className="flex flex-col items-center gap-1 -mb-2">
                                <div className="relative w-20 h-20">
                                    {/* Gold Frame Effect */}
                                    <div className="absolute -inset-2 bg-gradient-to-t from-yellow-500 to-transparent rounded-full opacity-50 animate-pulse"></div>
                                    <div className="w-full h-full rounded-full border-2 border-yellow-400 p-0.5 relative bg-black">
                                        <img src={topUsers[0]?.avatar} className="w-full h-full rounded-full object-cover" />
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl">👑</div>
                                    </div>
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-lg shadow-yellow-500/50">1</div>
                                </div>
                                <span className="text-sm font-bold text-yellow-400 truncate w-20 text-center">{topUsers[0]?.name}</span>
                            </div>

                            {/* 3rd Place */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="relative w-14 h-14 rounded-full border-2 border-amber-700 p-0.5">
                                    <img src={topUsers[2]?.avatar} className="w-full h-full rounded-full object-cover" />
                                    <div className="absolute -bottom-2 bg-amber-700 text-white text-[10px] font-bold px-1.5 rounded-full">3</div>
                                </div>
                                <span className="text-xs text-amber-600 truncate w-16 text-center">{topUsers[2]?.name}</span>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Banner Carousel */}
                 <div className="px-4 overflow-x-auto no-scrollbar flex gap-3 snap-x">
                     <div className="min-w-[90%] h-32 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-xl relative overflow-hidden flex items-center p-4 snap-center shadow-lg">
                        <div className="flex-1 z-10">
                             <h3 className="font-bold text-xl text-white drop-shadow-md font-serif">KING and QUEEN</h3>
                             <p className="text-xs text-yellow-100 bg-black/20 inline-block px-2 py-1 rounded mt-1">2025/12/10 - 2025/12/31</p>
                             <p className="text-sm font-bold mt-2 text-white">2025 HOOB Annual Celebration</p>
                        </div>
                        <img src="https://cdn-icons-png.flaticon.com/512/861/861512.png" className="w-24 h-24 drop-shadow-2xl opacity-90" />
                     </div>
                     <div className="min-w-[90%] h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl relative overflow-hidden flex items-center p-4 snap-center shadow-lg">
                        <div className="flex-1 z-10">
                             <h3 className="font-bold text-xl text-white drop-shadow-md">Voice Star</h3>
                             <p className="text-sm font-bold mt-2 text-white">Show your talent now!</p>
                        </div>
                     </div>
                 </div>

                 {/* Filters */}
                 <div className="sticky top-16 bg-[#0f0e0c] z-20 py-2">
                     <div className="flex items-center gap-4 px-4 overflow-x-auto no-scrollbar text-sm font-medium text-slate-400">
                         {['ALL', 'Love', 'Sing', 'Friends', 'Family'].map(filter => (
                             <button 
                                key={filter} 
                                onClick={() => setActiveFilter(filter)}
                                className={`whitespace-nowrap transition-colors ${activeFilter === filter ? 'text-[#fcd34d] font-bold text-base' : 'hover:text-white'}`}
                             >
                                 {filter}
                             </button>
                         ))}
                         <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
                         <button className="flex items-center gap-1 text-white whitespace-nowrap">
                             Egypt <img src="https://flagcdn.com/w20/eg.png" className="w-4 h-3" /> <ChevronDown size={12} />
                         </button>
                     </div>
                 </div>

                 {/* Rooms Grid */}
                 <div className="grid grid-cols-2 gap-3 px-3 pb-20">
                    {rooms.map(room => (
                        <RoomCard key={room.id} room={room} onClick={() => handleJoinRoom(room)} />
                    ))}
                    {rooms.length === 0 && <div className="col-span-2 py-10 text-center text-slate-500">No rooms active. Be the first!</div>}
                 </div>
             </main>

             <BottomNav activeTab={activeTab} onTabChange={handleTabChange} onCreateRoom={handleCreateRoom} />
        </div>
      );
  }

  // ROOM VIEW (Retaining functionality but checking alignment)
  const isHost = currentRoom.host.id === user.id;
  const isSpeaker = currentRoom.speakers.some(s => s.id === user.id);
  const myRoleUser = isHost ? currentRoom.host : currentRoom.speakers.find(s => s.id === user.id);
  const isMuted = myRoleUser ? myRoleUser.isMuted : true;

  return (
    <div className="fixed inset-0 bg-[#0a0514] flex flex-col items-center justify-center font-sans overflow-hidden">
        {/* BG - Using Room Image if available */}
        <div className="absolute inset-0 z-0">
             <img src={currentRoom.backgroundImage || "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80"} className="w-full h-full object-cover opacity-30 blur-xl" />
             <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <GiftOverlay activeGift={activeGift} onAnimationComplete={() => setActiveGift(null)} />
        
        {/* Header */}
        <header className="relative z-10 w-full max-w-lg p-4 flex justify-between items-center">
            <button onClick={handleLeaveRoom} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"><X size={20}/></button>
            <div className="text-center">
                <h2 className="text-white font-bold truncate max-w-[200px]">{currentRoom.title}</h2>
                <span className="text-xs text-slate-400">ID: {currentRoom.id.slice(0, 6)}...</span>
            </div>
            <div className="w-9"></div> {/* Spacer */}
        </header>

        {/* Stage */}
        <div className="relative z-10 w-full max-w-lg flex-1 overflow-y-auto pt-4 px-4 pb-32">
            <div className="flex justify-center mb-8">
                <Seat user={currentRoom.host} isHost isMe={currentRoom.host.id === user.id} seatIndex={0} onClick={() => currentRoom.host.id === user.id ? handleToggleMute() : null} />
            </div>
            <div className="grid grid-cols-4 gap-4 gap-y-8">
                {currentRoom.speakers.map((s, i) => (
                    <Seat key={s.id} user={s} isMe={s.id === user.id} seatIndex={i+1} onClick={() => s.id === user.id ? handleLeaveMic() : null} />
                ))}
                {[...Array(8 - currentRoom.speakers.length)].map((_, i) => (
                    <Seat key={`empty-${i}`} seatIndex={currentRoom.speakers.length + i + 1} onClick={handleTakeMic} />
                ))}
            </div>
        </div>

        {/* Chat & Controls */}
        <div className="absolute bottom-0 w-full max-w-lg z-20 flex flex-col">
            <div className="h-48 px-4 flex flex-col justify-end pb-2 pointer-events-none">
                <div className="pointer-events-auto space-y-2 overflow-y-auto max-h-full no-scrollbar mask-image-gradient">
                    {messages.map(msg => (
                        <div key={msg.id} className={`${msg.isGift ? 'bg-gradient-to-r from-yellow-900/40 to-transparent border-l-2 border-yellow-500' : 'bg-black/40'} backdrop-blur-md rounded-lg p-2 text-sm text-white w-fit max-w-[85%] animate-in slide-in-from-left-2`}>
                            <span className="font-bold text-xs text-neon-cyan block">{msg.userName}</span>
                            {msg.isGift ? <span className="text-yellow-400 font-bold">Sent {msg.giftData?.giftName} 🎁</span> : <span>{msg.text}</span>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#0f0718] border-t border-white/5 p-4 flex items-center gap-3">
                 <div className="flex-1 bg-white/5 rounded-full flex items-center px-4 py-2 border border-white/5 focus-within:border-white/20 transition-colors">
                    <input 
                        className="bg-transparent flex-1 text-white text-sm focus:outline-none" 
                        placeholder="Say something..."
                        onKeyDown={(e) => { if(e.key === 'Enter') { handleSendMessage(e.currentTarget.value); e.currentTarget.value = ''; } }}
                    />
                 </div>
                 {(isHost || isSpeaker) ? (
                    <button onClick={handleToggleMute} className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>{isMuted ? <MicOff size={20} /> : <Mic size={20} />}</button>
                 ) : (
                    <button onClick={handleTakeMic} className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex flex-col items-center justify-center gap-0.5"><div className="font-bold text-[10px]">Mic</div></button>
                 )}
                 <button onClick={() => setGiftShopOpen(true)} className="p-3 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-lg animate-pulse hover:scale-105 transition-transform"><Gift size={20} fill="currentColor" /></button>
            </div>
        </div>

        {isGiftShopOpen && (
            <div className="absolute inset-0 z-50 bg-black/80 flex items-end justify-center animate-in fade-in duration-200" onClick={() => setGiftShopOpen(false)}>
                <div className="bg-[#1a1025] w-full max-w-lg rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold">Send Gift</h3>
                        <div className="flex items-center gap-1 text-yellow-400 font-bold bg-white/5 px-3 py-1 rounded-full border border-white/5"><Wallet size={14} /> {userCoins}</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {GIFTS.map(g => (
                            <button key={g.id} onClick={() => handleSendGift(g)} className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                                <div className="text-4xl group-hover:scale-110 transition-transform">{g.icon}</div>
                                <span className="text-xs text-white">{g.name}</span>
                                <span className="text-[10px] text-yellow-400 font-mono">{g.price}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
