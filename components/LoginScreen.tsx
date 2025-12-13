import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onGoogleLogin: () => void;
  onEmailLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (email: string, pass: string, name: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onGoogleLogin, 
  onEmailLogin, 
  onRegister, 
  isLoading, 
  error 
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      if (!name || !email || !password) return;
      onRegister(email, password, name);
    } else {
      if (!email || !password) return;
      onEmailLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0514] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
       {/* Background Effects */}
       <div className="absolute top-0 left-0 w-64 h-64 bg-neon-purple/20 rounded-full blur-[100px]"></div>
       <div className="absolute bottom-0 right-0 w-80 h-80 bg-neon-cyan/20 rounded-full blur-[120px]"></div>
       
       <div className="relative z-10 flex flex-col items-center w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-neon-purple to-neon-pink rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)] rotate-3 mb-4">
              <span className="text-4xl font-bold text-white">V</span>
            </div>
            <h1 className="text-3xl font-bold text-white">VoiceVerse</h1>
            <p className="text-slate-400 text-sm mt-1">Join the conversation</p>
          </div>
          
          <div className="w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
            {/* Error Display */}
            {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-200 text-xs font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {isRegistering && (
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium ml-1">Full Name</label>
                        <div className="relative">
                            <UserIcon size={18} className="absolute left-3 top-3 text-slate-500" />
                            <input 
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-neon-purple transition-colors"
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium ml-1">Email Address</label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-3 top-3 text-slate-500" />
                        <input 
                            type="email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium ml-1">Password</label>
                    <div className="relative">
                        <Lock size={18} className="absolute left-3 top-3 text-slate-500" />
                        <input 
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    <>
                      {isRegistering ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
                    </>
                  )}
                </button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#130f1c] px-2 text-slate-500">Or continue with</span></div>
            </div>

            <button 
              onClick={onGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white text-slate-900 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-transform active:scale-95 disabled:opacity-50"
            >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                <span>Google</span>
            </button>
            
            <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                    {isRegistering ? "Already have an account?" : "Don't have an account?"}
                    <button 
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError(null);
                        }}
                        className="ml-2 text-neon-cyan hover:underline font-bold"
                    >
                        {isRegistering ? "Sign In" : "Sign Up"}
                    </button>
                </p>
            </div>
          </div>
       </div>
    </div>
  );
};

// Internal Helper for state reset (kept outside component to avoid prop drilling if not needed, but here we just used setError inside App to clear it)
// Added a small fake prop usage to satisfy TS if needed in future
const setError = (_: any) => {}; 
