import React from 'react';
import { Check, ArrowLeft, Sparkles, MessageCircleHeart, CheckCircle2 } from 'lucide-react';
import { metaService } from '../services/metaService';

interface UpgradePageProps {
    onBack: () => void;
    user: any;
}

export const UpgradePage: React.FC<UpgradePageProps> = ({ onBack, user }) => {

    const handleUpgrade = () => {
        // Track InitiateCheckout
        metaService.trackEvent({
            eventName: 'InitiateCheckout',
            contentName: 'Plano PRO Ilimitado',
            value: 15.00,
            currency: 'BRL',
            contentType: 'product'
        });
        
        // Kirvano Checkout Link
        const checkoutUrl = 'https://pay.kirvano.com/1b352195-0b65-4afa-9a3e-bd58515446e9';
        
        window.open(checkoutUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 relative overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none z-0" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="fixed top-1/4 right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 md:py-8">
                {/* Header */}
                <header className="flex items-center justify-between mb-8 md:mb-12">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group px-4 py-2 rounded-full hover:bg-white/5"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Voltar</span>
                    </button>
                </header>

                {/* Hero Copy */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 animate-fade-in">
                        <CheckCircle2 size={12} className="text-green-500" />
                        <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Oferta Limitada</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                        Não deixe a conversa <br className="hidden md:block" />
                        <span className="text-purple-400">
                            morrer no "oi tudo bem"
                        </span>
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Desbloqueie o poder total do Puxe Assunto para criar respostas irresistíveis, ter assuntos infinitos e conquistar quem você quiser.
                    </p>
                </div>

                {/* Pricing Cards Container */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start mb-20">

                    {/* Free Plan */}
                    <div className="order-2 md:order-1 bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col hover:bg-white/[0.04] transition-all duration-300 md:mt-8">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-300 mb-2">Iniciante</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-white">R$ 0</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Para quem está só olhando.</p>
                        </div>

                        <ul className="space-y-3 mb-6 flex-1">
                            <li className="flex items-start gap-3 text-gray-400">
                                <Check size={16} className="text-gray-600 mt-0.5 shrink-0" />
                                <span className="text-xs">5 análises por dia</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400">
                                <Check size={16} className="text-gray-600 mt-0.5 shrink-0" />
                                <span className="text-xs">Respostas padrão</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400">
                                <Check size={16} className="text-gray-600 mt-0.5 shrink-0" />
                                <span className="text-xs">Acesso básico ao app</span>
                            </li>
                        </ul>

                        <button
                            onClick={onBack}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl transition-all text-xs"
                        >
                            Continuar Grátis
                        </button>
                    </div>

                    {/* PRO Plan */}
                    <div className="order-1 md:order-2 relative bg-[#0f0f0f] border border-purple-500/30 rounded-3xl p-8 flex flex-col shadow-2xl shadow-purple-900/20 transform md:-translate-y-4 z-10 overflow-hidden group">
                        {/* Gradient Glow */}
                        <div className="absolute -top-[100px] -right-[100px] w-[200px] h-[200px] bg-purple-600/20 blur-[80px] group-hover:bg-purple-600/30 transition-all"></div>

                        <div className="mb-2 relative">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent shrink-0">
                                    PRO ILIMITADO
                                </h3>
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase tracking-wider shadow-lg animate-pulse shrink-0">
                                    OFERTA RELÂMPAGO
                                </span>
                            </div>
                            <div className="flex flex-col mb-2">
                                <span className="text-sm text-gray-500 line-through mb-1">De R$ 29,90 por</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-extrabold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                        R$ 15
                                    </span>
                                    <span className="text-xl font-bold text-purple-400">,00</span>
                                </div>
                            </div>

                            <p className="text-sm text-green-400 font-bold flex items-center gap-1 mb-4">
                                <Sparkles size={14} />
                                Apenas R$ 15,00!
                            </p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1 relative">
                            <li className="flex items-start gap-3 text-gray-200">
                                <Check size={20} className="text-purple-400 mt-0.5 shrink-0" />
                                <span className="text-sm">Análises e respostas ilimitadas</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-200">
                                <Check size={20} className="text-purple-400 mt-0.5 shrink-0" />
                                <span className="text-sm">Cantadas ilimitadas</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-200">
                                <Check size={20} className="text-purple-400 mt-0.5 shrink-0" />
                                <span className="text-sm">Puxe Assunto mais inteligente e criativo</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-200">
                                <Check size={20} className="text-purple-400 mt-0.5 shrink-0" />
                                <span className="text-sm">Histórico completo de conversas</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-200">
                                <Check size={20} className="text-purple-400 mt-0.5 shrink-0" />
                                <span className="text-sm">Suporte prioritário exclusivo</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-200">
                                <Check size={20} className="text-purple-400 mt-0.5 shrink-0" />
                                <span className="text-sm">Acesso antecipado a novas funções</span>
                            </li>
                        </ul>

                        <button
                            onClick={handleUpgrade}
                            className="relative w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/40 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group-hover:shadow-purple-500/25"
                        >
                            <MessageCircleHeart size={20} className="fill-white/20" />
                            Quero Ser PRO Agora
                        </button>
                        
                        <p className="mt-4 text-center text-xs text-gray-500">
                            Compra segura • Cancelamento fácil
                        </p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-white mb-8 text-center">Perguntas Frequentes</h3>
                    <div className="grid gap-4">
                        <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="font-bold text-gray-200 mb-2 text-sm">Como funciona o pagamento?</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">O pagamento é processado de forma segura. Aceitamos Pix e Cartão de Crédito. A liberação do acesso é imediata após a confirmação.</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="font-bold text-gray-200 mb-2 text-sm">Posso cancelar quando quiser?</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">Sim! Sem letras miúdas. Você pode cancelar a renovação automática a qualquer momento através do seu painel ou suporte.</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-20 text-center border-t border-white/5 pt-8">
                    <p className="text-gray-600 text-sm">
                        © 2025 PuxeAssunto. Todos os direitos reservados.
                    </p>
                </div>

            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
