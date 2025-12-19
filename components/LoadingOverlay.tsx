import React from 'react';
import { MessageCircleHeart } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  isPro: boolean;
  type?: 'mobile' | 'desktop';
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, isPro, type = 'desktop' }) => {
  if (!isVisible) return null;

  // --- MOBILE OVERLAY (Image Context) ---
  if (type === 'mobile') {
    return (
      <div className="absolute inset-0 z-50 overflow-hidden rounded-lg will-change-transform">
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70 animate-fade-in" style={{ WebkitBackfaceVisibility: 'hidden' }} />
        
        {/* Scanning Effect - Otimizado */}
        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-scan-fast z-10" style={{ willChange: 'transform' }} />
        
        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-20">
          
          {/* Status Pill */}
          <div className="flex items-center gap-2 px-4 py-2 bg-black/80 border border-white/10 rounded-full shadow-lg animate-pulse-gentle whitespace-nowrap" style={{ WebkitBackfaceVisibility: 'hidden' }}>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold text-white tracking-wide">ANALISANDO CONVERSA...</span>
          </div>

        </div>
      </div>
    );
  }

  // --- DESKTOP SIDEBAR (Panel Context) ---
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 animate-fade-in">
      
      {/* Modern Spinner */}
      <div className="relative w-24 h-24 mb-8">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-white/5"></div>
        <div className="absolute inset-0 rounded-full border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        
        {/* Inner Ring */}
        <div className="absolute inset-4 rounded-full border-2 border-white/5"></div>
        <div className="absolute inset-4 rounded-full border-2 border-b-pink-500 border-t-transparent border-r-transparent border-l-transparent animate-spin-reverse"></div>
        
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 animate-pulse">
            <MessageCircleHeart className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
        Criando Resposta...
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-[200px]">
        A inteligência artificial está analisando o contexto e o tom da conversa.
      </p>
    </div>
  );
};
