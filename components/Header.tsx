import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircleHeart, LogIn, User } from 'lucide-react';

interface HeaderProps {
  onAction: () => void;
  user: any;
}

export const Header: React.FC<HeaderProps> = ({ onAction, user }) => {
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  // Optimized scroll handler using requestAnimationFrame to prevent forced reflows
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#050505]/90 backdrop-blur-xl py-4 border-b border-white/5' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 md:px-8 max-w-7xl flex items-center justify-between">
        
        {/* Modern Logo Composition */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative">
            {/* Glow Effect behind icon */}
            <div className="absolute -inset-2 bg-gradient-to-r from-red-600 to-rose-600 rounded-full opacity-0 group-hover:opacity-25 blur-lg transition-opacity duration-500"></div>
            
            {/* App Icon Container */}
            <div className="relative w-10 h-10 bg-gradient-to-br from-red-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20 border border-white/10 group-hover:scale-105 transition-transform duration-300">
              <MessageCircleHeart className="w-5 h-5 text-white fill-white/20" strokeWidth={2.5} />
            </div>
          </div>
          
          <span className="text-xl font-bold text-white tracking-tight group-hover:opacity-90 transition-opacity">
            Puxe<span className="font-light text-rose-200">Assunto</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#como-funciona" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Como Funciona</a>
          <a href="#depoimentos" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Depoimentos</a>
          <a href="#faq" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Dúvidas Frequentes</a>
        </nav>

        <button 
          onClick={onAction}
          className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          {user ? (
            <>
              <User size={16} />
              Minha Conta
            </>
          ) : (
            <>
              <LogIn size={16} />
              Entrar
            </>
          )}
        </button>
      </div>
    </header>
  );
};