import React, { useState } from 'react';
import { X, Mic, Hash } from 'lucide-react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, topic: string) => Promise<void>;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsLoading(true);
    try {
        await onCreate(title, topic || 'General Chat');
        // Reset form
        setTitle('');
        setTopic('');
        onClose();
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1a1025] w-full max-w-md rounded-3xl border border-white/10 p-6 relative shadow-2xl shadow-purple-900/20 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
          <X size={20} />
        </button>
        
        <div className="text-center mb-8 mt-2">
            <h2 className="text-2xl font-bold text-white mb-1">Create Room</h2>
            <p className="text-slate-400 text-sm">Start a new conversation and invite friends</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider ml-1">Room Title</label>
            <div className="relative group">
              <Mic className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-neon-purple transition-colors" size={18} />
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Late Night Talks 🌙"
                className="w-full bg-black/20 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:border-neon-purple outline-none transition-all"
                required
                autoFocus
                maxLength={40}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider ml-1">Topic</label>
            <div className="relative group">
              <Hash className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-neon-cyan transition-colors" size={18} />
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Life, Tech, Music..."
                className="w-full bg-black/20 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:border-neon-cyan outline-none transition-all"
                maxLength={30}
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
                type="submit" 
                disabled={isLoading || !title.trim()}
                className="w-full bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-purple-500/40 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                {isLoading ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Go Live Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};