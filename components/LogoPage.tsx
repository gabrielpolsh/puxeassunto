import React from 'react';
import { MessageCircleHeart } from 'lucide-react';

export const LogoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      
      <div className="relative z-10 flex flex-col items-center gap-12 transform scale-150">
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute -inset-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-30 blur-2xl animate-pulse"></div>
          
          {/* Icon Container */}
          <div className="relative w-48 h-48 bg-gradient-to-br from-purple-600 to-pink-500 rounded-[3rem] flex items-center justify-center shadow-2xl shadow-purple-900/40 border border-white/20">
            <MessageCircleHeart className="w-24 h-24 text-white fill-white/20" strokeWidth={2} />
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-8xl font-bold text-white tracking-tight mb-2">
            Puxe<span className="font-light text-purple-200">Assunto</span>
          </h1>
          <p className="text-xl text-purple-400/80 font-medium tracking-widest uppercase">
            Inteligência Artificial
          </p>
        </div>
      </div>
    </div>
  );
};
