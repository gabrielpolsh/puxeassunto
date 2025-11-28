import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Heart, MessageCircleHeart, Lock, Star, ScanLine } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  isPro: boolean;
  type?: 'mobile' | 'desktop';
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, isPro, type = 'desktop' }) => {
  const [tipIndex, setTipIndex] = useState(0);
  
  const tips = [
    { 
      icon: Zap, 
      title: "OFERTA RELÂMPAGO",
      text: "Seja PRO por apenas R$ 10,00 hoje!",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/20"
    },
    { 
      icon: Lock, 
      title: "DESBLOQUEIE TUDO",
      text: "Tenha acesso a respostas ilimitadas.",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    },
    { 
      icon: Star, 
      title: "SEJA IRRESISTÍVEL",
      text: "As melhores cantadas estão no PRO.",
      color: "text-pink-400",
      bg: "bg-pink-400/10",
      border: "border-pink-400/20"
    }
  ];

  useEffect(() => {
    if (isVisible && !isPro) {
      const interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % tips.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible, isPro]);

  if (!isVisible) return null;

  const currentTip = tips[tipIndex];
  const CurrentIcon = currentTip.icon;

  // --- MOBILE OVERLAY (Image Context) ---
  if (type === 'mobile') {
    return (
      <div className="absolute inset-0 z-50 overflow-hidden rounded-lg">
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-fade-in" />
        
        {/* Scanning Effect */}
        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-scan z-10" />
        
        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-20">
          
          {/* Status Pill */}
          <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full shadow-lg animate-bounce-slow whitespace-nowrap">
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
      <p className="text-sm text-gray-500 text-center max-w-[200px] mb-8">
        A inteligência artificial está analisando o contexto e o tom da conversa.
      </p>

      {/* Desktop Pro Tip */}
      {!isPro && (
        <div className="w-full max-w-xs bg-[#111] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 ${currentTip.color}`}>
                <CurrentIcon size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">{currentTip.title}</span>
              </div>
              <span className="text-[10px] text-gray-600 font-mono">0{tipIndex + 1}/03</span>
            </div>
            
            <p className="text-sm text-gray-300 font-medium leading-relaxed pl-1">
              "{currentTip.text}"
            </p>
            
            <div className="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-[3000ms] ease-linear" key={tipIndex} style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
