import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export const Chat: React.FC<ChatProps> = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm border-t md:border-t-0 md:border-l border-slate-800">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isGift ? 'items-center my-4' : 'items-start'}`}>
            
            {msg.isGift ? (
              <div className="bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border border-neon-purple/50 rounded-full px-4 py-1 text-xs text-neon-pink font-bold animate-pulse">
                🎁 {msg.userName} sent {msg.giftData?.giftName} x{msg.giftData?.amount}
              </div>
            ) : msg.isSystem ? (
               <div className="w-full text-center text-xs text-slate-500 my-2 italic">
                 {msg.text}
               </div>
            ) : (
              <div className="bg-slate-800/80 rounded-2xl rounded-tl-none px-3 py-2 max-w-[85%] text-sm">
                <span className="text-neon-cyan font-semibold text-xs block mb-0.5">{msg.userName}</span>
                <span className="text-slate-200">{msg.text}</span>
              </div>
            )}
            
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-neon-purple text-white placeholder-slate-500"
        />
        <button 
          type="submit"
          className="bg-slate-800 text-white p-2 rounded-full hover:bg-slate-700 transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};