import React, { useEffect, useState, useRef } from 'react';
import { Check, ArrowRight, MessageCircleHeart, Sparkles, Zap } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { metaService } from '../services/metaService';

interface ThankYouPageProps {
    onGoToDashboard: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ onGoToDashboard }) => {
    const [mounted, setMounted] = useState(false);
    const location = useLocation();
    const hasTracked = useRef(false);

    useEffect(() => {
        setMounted(true);

        // Track purchase if coming from a successful payment flow
        if (location.state?.purchaseCompleted && !hasTracked.current) {
            hasTracked.current = true;
            
            console.log('[Meta] Tracking Purchase event...');
            
            // Track Purchase - Valor correto: R$ 15,90
            metaService.trackEvent({
                eventName: 'Purchase',
                value: 15.90,
                currency: 'BRL',
                contentName: 'Plano PRO Ilimitado',
                contentType: 'product'
            });
            
            // Track Subscribe - Assinatura ativada
            metaService.trackEvent({
                eventName: 'Subscribe',
                value: 15.90,
                currency: 'BRL',
                contentName: 'Plano PRO Ilimitado',
                contentType: 'subscription'
            });

            // Clear state to prevent re-tracking on reload
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 relative overflow-hidden flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed top-[-20%] left-[-20%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />

            <div className={`relative z-10 max-w-lg w-full transition-all duration-1000 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20 border border-white/10">
                            <MessageCircleHeart className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Puxe<span className="font-light text-purple-200">Assunto</span>
                        </span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    <div className="relative z-10 text-center">
                        {/* Success Animation */}
                        <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6 relative">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                                <Check size={24} className="text-white" strokeWidth={3} />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-3">
                            Pagamento Confirmado!
                        </h1>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Parabéns! Você agora é um membro <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">PRO</span>. Aproveite todos os recursos sem limites.
                        </p>

                        {/* Features Recap */}
                        <div className="bg-white/5 rounded-2xl p-5 mb-8 text-left border border-white/5">
                            <div className="flex items-center gap-3 mb-3 text-sm text-gray-300">
                                <div className="p-1.5 bg-purple-500/20 rounded-lg">
                                    <Zap size={14} className="text-purple-400" />
                                </div>
                                <span>Análises Ilimitadas liberadas</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="p-1.5 bg-pink-500/20 rounded-lg">
                                    <Sparkles size={14} className="text-pink-400" />
                                </div>
                                <span>Acesso ao modelo de IA avançado</span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={onGoToDashboard}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group/btn"
                        >
                            Acessar meu Dashboard
                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        
                        <p className="mt-6 text-xs text-gray-500">
                            Um email de confirmação foi enviado para você.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};