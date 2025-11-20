import React, { useEffect, useState } from 'react';
import { CheckCircle, Zap, ArrowRight, Mail, Clock, Headphones } from 'lucide-react';

interface ThankYouPageProps {
    onGoToDashboard: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ onGoToDashboard }) => {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Animate content entrance
        setTimeout(() => setShowContent(true), 100);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
            <div className="fixed top-[30%] left-[50%] w-[40%] h-[40%] bg-green-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20">
                {/* Success Icon */}
                <div className={`text-center mb-8 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                    <div className="inline-flex items-center justify-center w-24 h-24 mb-6 relative">
                        {/* Animated rings */}
                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                        <div className="absolute inset-0 bg-green-500/30 rounded-full animate-pulse" />
                        {/* Icon */}
                        <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-5 shadow-2xl shadow-green-900/50">
                            <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                        Pagamento Confirmado! 🎉
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Bem-vindo ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-bold">PuxeAssunto PRO</span>
                    </p>
                </div>

                {/* Main Content Card */}
                <div className={`bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-8 backdrop-blur-sm transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="space-y-8">
                        {/* Status Message */}
                        <div className="text-center">
                            <div className="inline-flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-full px-6 py-3 mb-6">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-green-400 font-medium">Processando seu acesso PRO</span>
                            </div>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                Seu pagamento foi aprovado com sucesso! Estamos ativando seu acesso PRO agora mesmo.
                            </p>
                        </div>

                        {/* Info Cards */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:bg-white/[0.07] transition-all">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Clock size={24} className="text-purple-400" />
                                </div>
                                <h3 className="font-bold text-white mb-2">Liberação Rápida</h3>
                                <p className="text-sm text-gray-400">Seu acesso será liberado em até 2 minutos</p>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:bg-white/[0.07] transition-all">
                                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Mail size={24} className="text-pink-400" />
                                </div>
                                <h3 className="font-bold text-white mb-2">Confirmação por Email</h3>
                                <p className="text-sm text-gray-400">Enviamos os detalhes para seu email</p>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:bg-white/[0.07] transition-all">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Headphones size={24} className="text-blue-400" />
                                </div>
                                <h3 className="font-bold text-white mb-2">Suporte Disponível</h3>
                                <p className="text-sm text-gray-400">Estamos aqui para ajudar você</p>
                            </div>
                        </div>

                        {/* What's Next */}
                        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Zap size={20} className="text-yellow-400 fill-yellow-400" />
                                O que você ganha agora:
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-gray-300">
                                    <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-white">Análises Ilimitadas</strong> - Sem limites diários, use quantas vezes quiser</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-300">
                                    <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-white">Respostas Premium</strong> - IA mais criativa e personalizada</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-300">
                                    <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-white">Suporte Prioritário</strong> - Atendimento VIP quando precisar</span>
                                </li>
                            </ul>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={onGoToDashboard}
                            className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/40 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-lg"
                        >
                            Ir para o Dashboard
                            <ArrowRight size={24} />
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Problemas? Entre em contato: <a href="mailto:suporte@puxeassunto.com" className="text-purple-400 hover:text-purple-300 underline">suporte@puxeassunto.com</a>
                        </p>
                    </div>
                </div>

                {/* Footer Note */}
                <div className={`text-center text-sm text-gray-500 transition-all duration-700 delay-400 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                    <p>Obrigado por escolher o PuxeAssunto PRO! 💜</p>
                </div>
            </div>
        </div>
    );
};
