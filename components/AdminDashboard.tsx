
import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, LayoutDashboard, Ban, CheckCircle, Search, 
  Trash2, DollarSign, TrendingUp, Gift as GiftIcon, 
  AlertTriangle, XCircle, Plus, Store, Upload, Image, Save, X, PlayCircle, Loader2
} from 'lucide-react';
import { MOCK_ALL_USERS, MOCK_ROOMS, MOCK_STORE_ITEMS, GIFTS as DEFAULT_GIFTS } from '../constants';
import { User, RoomData, Gift, UserStatus, GiftTier, StoreItem, StoreCategory } from '../types';
import { Button } from './Button';
import { addCoinsDB } from '../services/userService'; 
import { addGiftToDB, deleteGiftFromDB, subscribeToGifts } from '../services/giftService';
import { uploadFile } from '../services/storageService';

type AdminTab = 'DASHBOARD' | 'USERS' | 'ROOMS' | 'GIFTS' | 'STORE';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  
  // --- Local State for Management ---
  const [users, setUsers] = useState<User[]>(MOCK_ALL_USERS);
  const [rooms, setRooms] = useState<RoomData[]>(MOCK_ROOMS);
  const [gifts, setGifts] = useState<Gift[]>([]); // Dynamic from DB
  const [storeItems, setStoreItems] = useState<StoreItem[]>(MOCK_STORE_ITEMS);

  // --- Forms State ---
  const [isAddingGift, setIsAddingGift] = useState(false);
  const [isAddingStoreItem, setIsAddingStoreItem] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // New Gift Inputs
  const [newGiftName, setNewGiftName] = useState('');
  const [newGiftPrice, setNewGiftPrice] = useState(10);
  const [newGiftIcon, setNewGiftIcon] = useState(''); // Stores URL
  const [newGiftTier, setNewGiftTier] = useState<GiftTier>(GiftTier.BASIC);

  // New Store Item Inputs
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<StoreCategory>(StoreCategory.FRAME);
  const [newItemPrice, setNewItemPrice] = useState(500);
  const [newItemIcon, setNewItemIcon] = useState('');
  const [newItemDuration, setNewItemDuration] = useState(30);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Initialize Real-time Data ---
  useEffect(() => {
    const unsubscribe = subscribeToGifts((fetchedGifts) => {
        if (fetchedGifts.length === 0) {
            setGifts(DEFAULT_GIFTS); // Fallback for viewing
        } else {
            setGifts(fetchedGifts);
        }
    });
    return () => unsubscribe();
  }, []);

  // --- Helpers ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setFunction: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (Optional check before upload, e.g., 50MB limit)
    if (file.size > 50 * 1024 * 1024) {
        alert("File size too large. Max 50MB.");
        return;
    }

    // 1. Immediate Preview
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            setFunction(reader.result);
        }
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
        // Upload to Firebase Storage
        const url = await uploadFile(file, 'assets');
        setFunction(url);
    } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to upload file. Please try again.");
    } finally {
        setIsUploading(false);
    }
  };

  const isVideo = (url: string) => {
      if (!url) return false;
      const lower = url.toLowerCase();
      // Checks for standard extensions or Firebase storage token params
      return lower.includes('.mp4') || lower.includes('.webm') || lower.startsWith('data:video');
  };

  const renderMediaPreview = (url: string, className: string = "w-full h-full object-cover") => {
      if (!url) return null;
      if (isVideo(url)) {
          return (
              <video src={url} className={className} autoPlay loop muted playsInline />
          );
      }
      if (url.startsWith('http') || url.startsWith('data:image')) {
          return <img src={url} className={className} />;
      }
      return <span className="text-4xl">{url}</span>; // Emoji fallback
  };

  // --- Actions ---

  // 1. Users Actions
  const toggleBanUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === UserStatus.BANNED ? UserStatus.ACTIVE : UserStatus.BANNED } 
        : u
    ));
  };

  const manualAddCoins = (userId: string) => {
    const amountStr = prompt("Enter amount of coins to send to user:", "1000");
    if (amountStr) {
        const amount = parseInt(amountStr);
        if (!isNaN(amount)) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, walletBalance: (u.walletBalance || 0) + amount } : u));
            addCoinsDB(userId, amount);
            alert(`Sent ${amount} coins to user successfully.`);
        }
    }
  };

  // 2. Room Actions
  const closeRoom = (roomId: string) => {
    if (confirm('Are you sure you want to forcibly close this room?')) {
      setRooms(prev => prev.filter(r => r.id !== roomId));
    }
  };

  // 3. Gift Actions
  const handleAddGift = async () => {
    if (!newGiftName || !newGiftIcon) return alert("Name and File are required");
    
    setIsSubmitting(true);
    try {
        const newGift: Gift = {
            id: `gift-${Date.now()}`,
            name: newGiftName,
            price: Number(newGiftPrice),
            icon: newGiftIcon, 
            tier: newGiftTier
        };

        await addGiftToDB(newGift);
        setIsAddingGift(false);
        setNewGiftName('');
        setNewGiftPrice(10);
        setNewGiftIcon('');
    } catch (error) {
        console.error("Error adding gift:", error);
        alert("Failed to add gift");
    } finally {
        setIsSubmitting(false);
    }
  };

  const deleteGift = async (giftId: string) => {
    if (confirm('Delete this gift item globally?')) {
      try {
          await deleteGiftFromDB(giftId);
      } catch (error) {
          console.error("Error deleting gift:", error);
          alert("Could not delete gift. Ensure it exists in DB.");
      }
    }
  };

  // 4. Store Actions
  const handleAddStoreItem = () => {
     if (!newItemName || !newItemIcon) return alert("Name and File are required");

     const newItem: StoreItem = {
         id: `item-${Date.now()}`,
         name: newItemName,
         category: newItemCategory,
         price: Number(newItemPrice),
         icon: newItemIcon,
         durationDays: Number(newItemDuration),
         previewColor: newItemCategory === StoreCategory.FRAME ? '#gold' : undefined 
     };

     setStoreItems([...storeItems, newItem]);
     setIsAddingStoreItem(false);
     setNewItemName('');
     setNewItemIcon('');
  };

  const deleteStoreItem = (itemId: string) => {
      if(confirm('Remove this item from store?')) {
          setStoreItems(prev => prev.filter(i => i.id !== itemId));
      }
  };


  // --- Renderers ---

  const renderSidebar = () => (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-2 h-full overflow-y-auto">
      <div className="text-xl font-bold text-white mb-6 px-2 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold">A</div>
        لوحة الإدارة
      </div>
      
      {[
          { id: 'DASHBOARD', icon: LayoutDashboard, label: 'لوحة المعلومات' },
          { id: 'USERS', icon: Users, label: 'الحسابات' },
          { id: 'ROOMS', icon: LayoutDashboard, label: 'الغرف النشطة' },
          { id: 'GIFTS', icon: GiftIcon, label: 'هدايا الغرف' },
          { id: 'STORE', icon: Store, label: 'إدارة المتجر' },
      ].map((item) => (
        <button 
            key={item.id}
            onClick={() => setActiveTab(item.id as AdminTab)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === item.id ? 'bg-neon-purple text-white shadow-lg shadow-purple-900/20' : 'text-slate-400 hover:bg-slate-800'}`}
        >
            <item.icon size={20} /> {item.label}
        </button>
      ))}
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-bold text-white">نظرة عامة</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
             <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">إجمالي الإيرادات (اليوم)</p>
              <h3 className="text-3xl font-bold text-white mt-2">$12,450</h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg text-green-500">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
            <TrendingUp size={16} /> +15% مقارنة بالأمس
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4 animate-in fade-in">
        <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
         <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-900/50">
                    <tr className="text-slate-400 text-sm">
                        <th className="p-4">المستخدم</th>
                        <th className="p-4">الرصيد</th>
                        <th className="p-4 text-right">إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="border-b border-slate-700/50">
                            <td className="p-4 flex items-center gap-3">
                                <img src={user.avatar} className="w-8 h-8 rounded-full" />
                                <span>{user.name}</span>
                            </td>
                            <td className="p-4 text-green-400">{user.walletBalance} 💰</td>
                            <td className="p-4 text-right">
                                <Button size="sm" onClick={() => manualAddCoins(user.id)} variant="ghost"><DollarSign size={14}/></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
    </div>
  );

  const renderRooms = () => (
    <div className="space-y-4 animate-in fade-in">
        <h2 className="text-2xl font-bold">إدارة الغرف</h2>
        {rooms.map(room => (
             <div key={room.id} className="bg-slate-800 p-4 rounded-xl flex justify-between">
                 <span>{room.title}</span>
                 <Button size="sm" variant="danger" onClick={() => closeRoom(room.id)}>Close</Button>
             </div>
        ))}
    </div>
  );

  const renderGifts = () => (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">هدايا الصندوق (MP4/WebP)</h2>
        <Button variant="neon" size="sm" onClick={() => setIsAddingGift(true)}><Plus size={16} /> إضافة هدية جديدة</Button>
      </div>
      
      {/* ADD GIFT FORM */}
      {isAddingGift && (
          <div className="bg-slate-800 border border-slate-600 p-4 rounded-xl mb-4 animate-in slide-in-from-top-2">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-white">بيانات الهدية الجديدة</h3>
                  <button onClick={() => setIsAddingGift(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                      <label className="text-xs text-slate-400 block mb-1">اسم الهدية</label>
                      <input className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" value={newGiftName} onChange={e => setNewGiftName(e.target.value)} placeholder="مثال: سيارة سباق" />
                  </div>
                  <div>
                      <label className="text-xs text-slate-400 block mb-1">السعر (كوينز)</label>
                      <input className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" type="number" value={newGiftPrice} onChange={e => setNewGiftPrice(parseInt(e.target.value))} />
                  </div>
                  <div>
                      <label className="text-xs text-slate-400 block mb-1">مستوى التأثير</label>
                      <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" value={newGiftTier} onChange={e => setNewGiftTier(e.target.value as GiftTier)}>
                          <option value={GiftTier.BASIC}>Basic (Small)</option>
                          <option value={GiftTier.EPIC}>Epic (Medium)</option>
                          <option value={GiftTier.LEGENDARY}>Legendary (Full Screen)</option>
                      </select>
                  </div>
                  <div>
                      <label className="text-xs text-slate-400 block mb-1">الملف (WebP أو MP4)</label>
                      <div className="flex gap-2">
                        <input 
                            type="file" 
                            accept="image/*,video/mp4,video/webm,image/webp" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={(e) => handleFileUpload(e, setNewGiftIcon)} 
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()} 
                            disabled={isUploading}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded p-2 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                        >
                            {isUploading ? <Loader2 className="animate-spin" size={14}/> : <Upload size={14} />} 
                            {isUploading ? 'جاري الرفع...' : 'رفع ملف'}
                        </button>
                        {newGiftIcon && (
                            <div className="w-10 h-10 bg-black rounded overflow-hidden">
                                {renderMediaPreview(newGiftIcon)}
                            </div>
                        )}
                      </div>
                  </div>
              </div>
              <div className="flex justify-end">
                  <Button variant="neon" size="sm" onClick={handleAddGift} isLoading={isSubmitting || isUploading} disabled={isUploading}><Save size={16} /> حفظ الهدية</Button>
              </div>
          </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {gifts.map(gift => (
          <div key={gift.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center relative group hover:border-neon-purple transition-all">
            <button 
                onClick={() => deleteGift(gift.id)}
                className="absolute top-2 right-2 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-1 z-10"
            >
                <Trash2 size={14} />
            </button>
            <div className="w-16 h-16 flex items-center justify-center mb-2 bg-slate-900 rounded-lg overflow-hidden border border-slate-600">
                {renderMediaPreview(gift.icon)}
            </div>
            <div className="font-bold text-white text-center truncate w-full">{gift.name}</div>
            <div className="text-xs text-yellow-400 font-mono mb-2 font-bold">{gift.price} 💎</div>
            <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${
                gift.tier === GiftTier.LEGENDARY ? 'border-purple-500 text-purple-400 bg-purple-500/10' : 
                gift.tier === GiftTier.EPIC ? 'border-pink-500 text-pink-400 bg-pink-500/10' : 'border-slate-500 text-slate-400'
            }`}>
                {gift.tier}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStore = () => (
    <div className="space-y-4 animate-in fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">إدارة المتجر (إطارات MP4/WebP)</h2>
            <Button variant="neon" size="sm" onClick={() => setIsAddingStoreItem(true)}><Plus size={16} /> إضافة منتج</Button>
        </div>

        {/* ADD STORE ITEM FORM */}
        {isAddingStoreItem && (
             <div className="bg-slate-800 border border-slate-600 p-4 rounded-xl mb-4 animate-in slide-in-from-top-2">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-white">بيانات المنتج الجديد</h3>
                    <button onClick={() => setIsAddingStoreItem(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                {/* ... Inputs for name, price etc ... */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">اسم المنتج</label>
                        <input className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" value={newItemName} onChange={e => setNewItemName(e.target.value)} />
                    </div>
                    <div>
                         <label className="text-xs text-slate-400 block mb-1">القسم</label>
                         <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" value={newItemCategory} onChange={e => setNewItemCategory(e.target.value as StoreCategory)}>
                            <option value={StoreCategory.FRAME}>إطارات (Frames)</option>
                            <option value={StoreCategory.ENTRY}>دخلات (Entry)</option>
                            <option value={StoreCategory.AUDIO}>صوتيات (Audio)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">السعر</label>
                        <input className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" type="number" value={newItemPrice} onChange={e => setNewItemPrice(parseInt(e.target.value))} />
                    </div>
                     <div>
                        <label className="text-xs text-slate-400 block mb-1">المدة (أيام)</label>
                        <input className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" type="number" value={newItemDuration} onChange={e => setNewItemDuration(parseInt(e.target.value))} />
                    </div>
                    <div className="col-span-2">
                        <label className="text-xs text-slate-400 block mb-1">معاينة (يدعم MP4/WebP)</label>
                        <div className="flex gap-2">
                             <input type="file" accept="image/*,video/mp4,video/webm,image/webp" className="hidden" id="storeUpload" onChange={(e) => handleFileUpload(e, setNewItemIcon)} />
                             <label htmlFor="storeUpload" className="cursor-pointer bg-slate-700 px-4 py-2 rounded text-sm text-white flex items-center gap-2 hover:bg-slate-600">
                                 {isUploading ? <Loader2 className="animate-spin" size={14}/> : <Upload size={14} />} 
                                 {isUploading ? 'جاري الرفع...' : 'اختر ملف'}
                             </label>
                             {newItemIcon && (
                                <div className="w-10 h-10 bg-black rounded overflow-hidden">
                                     {renderMediaPreview(newItemIcon)}
                                </div>
                             )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button variant="neon" size="sm" onClick={handleAddStoreItem} disabled={isUploading}><Save size={16} /> نشر</Button>
                </div>
             </div>
        )}

        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-900/50">
                    <tr className="text-slate-400 text-sm">
                        <th className="p-4">المنتج</th>
                        <th className="p-4">القسم</th>
                        <th className="p-4">السعر</th>
                        <th className="p-4 text-right">إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {storeItems.map(item => (
                        <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                            <td className="p-4 flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden border border-slate-600">
                                    {renderMediaPreview(item.icon)}
                                </div>
                                <span className="font-medium text-white">{item.name}</span>
                            </td>
                            <td className="p-4">
                                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">{item.category}</span>
                            </td>
                            <td className="p-4 font-mono text-yellow-400">{item.price}</td>
                            <td className="p-4 text-right">
                                <button onClick={() => deleteStoreItem(item.id)} className="text-slate-500 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans" dir="rtl">
      {renderSidebar()}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'DASHBOARD' && renderDashboard()}
        {activeTab === 'USERS' && renderUsers()}
        {activeTab === 'ROOMS' && renderRooms()}
        {activeTab === 'GIFTS' && renderGifts()}
        {activeTab === 'STORE' && renderStore()}
      </div>
    </div>
  );
};
