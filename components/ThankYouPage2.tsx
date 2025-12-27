import React, { useEffect, useState } from 'react';
import { Check, ArrowRight, MessageCircleHeart, Sparkles, Zap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ThankYouPage2: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setMounted(true);
        
        // NOTE: Purchase event is sent by Kirvano webhook, not here
        // This prevents duplicate Purchase events
        console.log('[Meta] ThankYou page loaded (Purchase sent by Kirvano)');
    }, []);

    const handleGoToLogin = () => {
        navigate('/login');
    };

    const handleWhatsAppSupport = () => {
        window.open('https://wa.me/5561981620092?text=Olá! Acabei de fazer uma compra no Puxe Assunto e preciso de ajuda.', '_blank');
    };

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
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Parabéns! Você agora é um membro <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">PRO</span>. Aproveite todos os recursos sem limites.
                        </p>

                        {/* Important Notice */}
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5 mb-6 text-left">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-yellow-500/20 rounded-lg shrink-0 mt-0.5">
                                    <AlertCircle size={16} className="text-yellow-400" />
                                </div>
                                <div>
                                    <h3 className="text-yellow-300 font-bold text-sm mb-1">Importante!</h3>
                                    <p className="text-yellow-200/80 text-sm leading-relaxed">
                                        Para ativar seu acesso PRO, crie uma conta usando o <strong>mesmo e-mail</strong> que você usou na compra.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Features Recap */}
                        <div className="bg-white/5 rounded-2xl p-5 mb-6 text-left border border-white/5">
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
                            onClick={handleGoToLogin}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group/btn"
                        >
                            Criar Conta / Fazer Login
                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        
                        {/* Support Section */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <p className="text-gray-500 text-sm mb-3">
                                Caso tenha dúvidas, entre em contato com o suporte:
                            </p>
                            <button
                                onClick={handleWhatsAppSupport}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-xl text-green-400 text-sm font-medium transition-all"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                WhatsApp: (61) 98162-0092
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
