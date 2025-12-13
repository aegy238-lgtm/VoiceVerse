import React, { useState } from 'react';
import { 
  Users, LayoutDashboard, Ban, CheckCircle, Search, 
  Trash2, DollarSign, TrendingUp, Gift as GiftIcon, 
  AlertTriangle, XCircle, Plus 
} from 'lucide-react';
import { MOCK_ALL_USERS, MOCK_ROOMS, GIFTS } from '../constants';
import { User, RoomData, Gift, UserStatus, GiftTier } from '../types';
import { Button } from './Button';

type AdminTab = 'DASHBOARD' | 'USERS' | 'ROOMS' | 'GIFTS';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  
  // Local state for management (simulating backend)
  const [users, setUsers] = useState<User[]>(MOCK_ALL_USERS);
  const [rooms, setRooms] = useState<RoomData[]>(MOCK_ROOMS);
  const [gifts, setGifts] = useState<Gift[]>(GIFTS);

  // Actions
  const toggleBanUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === UserStatus.BANNED ? UserStatus.ACTIVE : UserStatus.BANNED } 
        : u
    ));
  };

  const closeRoom = (roomId: string) => {
    if (confirm('Are you sure you want to forcibly close this room?')) {
      setRooms(prev => prev.filter(r => r.id !== roomId));
    }
  };

  const deleteGift = (giftId: string) => {
    if (confirm('Delete this gift item?')) {
      setGifts(prev => prev.filter(g => g.id !== giftId));
    }
  };

  // Renderers
  const renderSidebar = () => (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-2">
      <div className="text-xl font-bold text-white mb-6 px-2 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">A</div>
        Admin Panel
      </div>
      
      <button 
        onClick={() => setActiveTab('DASHBOARD')}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'DASHBOARD' ? 'bg-neon-purple text-white' : 'text-slate-400 hover:bg-slate-800'}`}
      >
        <LayoutDashboard size={20} /> Dashboard
      </button>
      <button 
        onClick={() => setActiveTab('USERS')}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'USERS' ? 'bg-neon-purple text-white' : 'text-slate-400 hover:bg-slate-800'}`}
      >
        <Users size={20} /> Users
      </button>
      <button 
        onClick={() => setActiveTab('ROOMS')}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'ROOMS' ? 'bg-neon-purple text-white' : 'text-slate-400 hover:bg-slate-800'}`}
      >
        <LayoutDashboard size={20} /> Rooms
      </button>
      <button 
        onClick={() => setActiveTab('GIFTS')}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'GIFTS' ? 'bg-neon-purple text-white' : 'text-slate-400 hover:bg-slate-800'}`}
      >
        <GiftIcon size={20} /> Gifts
      </button>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Financial Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm">Total Revenue (Today)</p>
              <h3 className="text-3xl font-bold text-white mt-2">$12,450</h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg text-green-500">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
            <TrendingUp size={16} /> +15% from yesterday
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm">Net Profit (Est.)</p>
              <h3 className="text-3xl font-bold text-white mt-2">$4,980</h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-500">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Based on 40% platform fee
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm">Active Rooms</p>
              <h3 className="text-3xl font-bold text-white mt-2">{rooms.length}</h3>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-500">
              <LayoutDashboard size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Total Audience: {rooms.reduce((acc, r) => acc + r.audienceCount, 0)}
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-sm border-b border-slate-700">
              <th className="pb-3">User</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Time</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-slate-700/50">
              <td className="py-3">Sarah</td>
              <td className="py-3 text-green-400">Recharge</td>
              <td className="py-3">$99.99</td>
              <td className="py-3 text-slate-400">2 mins ago</td>
            </tr>
            <tr className="border-b border-slate-700/50">
              <td className="py-3">Mike</td>
              <td className="py-3 text-neon-pink">Gift Sent</td>
              <td className="py-3">500 Coins</td>
              <td className="py-3 text-slate-400">5 mins ago</td>
            </tr>
             <tr className="border-b border-slate-700/50">
              <td className="py-3">DevDave</td>
              <td className="py-3 text-green-400">Recharge</td>
              <td className="py-3">$19.99</td>
              <td className="py-3 text-slate-400">12 mins ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search users..." 
            className="bg-slate-800 border border-slate-700 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:border-neon-purple"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-slate-500" />
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50">
            <tr className="text-slate-400 text-sm">
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Level</th>
              <th className="p-4">Total Spent</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                <td className="p-4 flex items-center gap-3">
                  <img src={user.avatar} className="w-8 h-8 rounded-full" />
                  <span className="font-medium">{user.name}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'HOST' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-300'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-yellow-500 font-bold">{user.level}</td>
                <td className="p-4">${user.totalSpent}</td>
                <td className="p-4">
                  <span className={`flex items-center gap-1 text-xs font-bold ${user.status === UserStatus.BANNED ? 'text-red-500' : 'text-green-500'}`}>
                    {user.status === UserStatus.BANNED ? <Ban size={12}/> : <CheckCircle size={12}/>}
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button 
                    variant={user.status === UserStatus.BANNED ? 'primary' : 'danger'} 
                    size="sm"
                    onClick={() => toggleBanUser(user.id)}
                  >
                    {user.status === UserStatus.BANNED ? 'Unban' : 'Ban'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Room Management</h2>
      <div className="grid grid-cols-1 gap-4">
        {rooms.length === 0 ? (
            <div className="text-center p-10 text-slate-500">No active rooms found.</div>
        ) : rooms.map(room => (
          <div key={room.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-2xl border border-slate-600">
                🎧
              </div>
              <div>
                <h3 className="font-bold text-lg">{room.title}</h3>
                <p className="text-slate-400 text-sm">Host: <span className="text-white">{room.host.name}</span> • Audience: {room.audienceCount}</p>
                <div className="flex gap-2 mt-2">
                  {room.tags.map(t => <span key={t} className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">{t}</span>)}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
               <Button variant="secondary" size="sm">Monitor Audio</Button>
               <Button variant="danger" size="sm" onClick={() => closeRoom(room.id)}>Close Room</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGifts = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gift Management</h2>
        <Button variant="neon" size="sm"><Plus size={16} /> Add New Gift</Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gifts.map(gift => (
          <div key={gift.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center relative group">
            <button 
                onClick={() => deleteGift(gift.id)}
                className="absolute top-2 right-2 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 size={16} />
            </button>
            <div className="text-4xl mb-2">{gift.icon}</div>
            <div className="font-bold">{gift.name}</div>
            <div className="text-xs text-yellow-400 font-mono mb-2">{gift.price} Coins</div>
            <span className={`text-[10px] px-2 py-0.5 rounded border ${
                gift.tier === GiftTier.LEGENDARY ? 'border-purple-500 text-purple-400' : 
                gift.tier === GiftTier.EPIC ? 'border-pink-500 text-pink-400' : 'border-slate-500 text-slate-400'
            }`}>
                {gift.tier}
            </span>
          </div>
        ))}
        
        <button className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 p-4 text-slate-500 hover:text-white hover:border-slate-500 transition-colors h-full min-h-[140px]">
            <Plus size={24} />
            <span className="text-sm font-medium">Add Gift</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans">
      {renderSidebar()}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'DASHBOARD' && renderDashboard()}
        {activeTab === 'USERS' && renderUsers()}
        {activeTab === 'ROOMS' && renderRooms()}
        {activeTab === 'GIFTS' && renderGifts()}
      </div>
    </div>
  );
};