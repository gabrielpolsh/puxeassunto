import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Heart, MessageCircleHeart, Lock, Star } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  isPro: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, isPro }) => {
  const [tipIndex, setTipIndex] = useState(0);
  
  const tips = [
    { 
      icon: Zap, 
      title: "OFERTA RELÂMPAGO",
      text: "Seja PRO por apenas R$ 10,00 hoje!",
      color: "text-yellow-400"
    },
    { 
      icon: Lock, 
      title: "DESBLOQUEIE TUDO",
      text: "Tenha acesso a respostas ilimitadas.",
      color: "text-purple-400"
    },
    { 
      icon: Star, 
      title: "SEJA IRRESISTÍVEL",
      text: "As melhores cantadas estão no PRO.",
      color: "text-pink-400"
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md animate-fade-in" />

      {/* Main Card */}
      <div className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-purple-900/20 to-transparent blur-xl" />
        
        <div className="relative flex flex-col items-center text-center z-10">
          
          {/* Loading Animation */}
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-purple-500 border-r-pink-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <MessageCircleHeart className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            Analisando...
          </h3>
          <p className="text-gray-400 text-sm mb-8">
            O Puxe Assunto está criando a resposta perfeita.
          </p>

          {/* Upsell Section for Non-PRO */}
          {!isPro && (
            <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
              {/* Progress Bar for Tip */}
              <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-[3000ms] ease-linear w-full opacity-50" key={tipIndex} />
              
              <div className="flex items-center gap-4 text-left">
                <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 ${currentTip.color}`}>
                  <CurrentIcon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${currentTip.color}`}>
                    {currentTip.title}
                  </p>
                  <p className="text-sm text-white font-medium leading-tight">
                    {currentTip.text}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
