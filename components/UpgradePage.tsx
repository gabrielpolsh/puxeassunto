import React, { useState, useEffect } from 'react';
import { Check, ArrowLeft, Sparkles, MessageCircleHeart, CheckCircle2, Zap, Shield, Clock, Heart, Star, Users, TrendingUp, Lock } from 'lucide-react';
import { metaService } from '../services/metaService';

interface UpgradePageProps {
    onBack: () => void;
    user: any;
}

export const UpgradePage: React.FC<UpgradePageProps> = ({ onBack, user }) => {
    // Urgency countdown
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });

    useEffect(() => {
        // Track AddToCart - Usuario entrou na pagina de upgrade (interesse alto)
        metaService.trackEvent({
            eventName: 'AddToCart',
            contentName: 'Plano PRO Ilimitado',
            value: 15.00,
            currency: 'BRL',
            contentType: 'product'
        });
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                seconds--;
                if (seconds < 0) { seconds = 59; minutes--; }
                if (minutes < 0) { minutes = 59; hours--; }
                if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-rose-500/30 relative overflow-x-hidden">
            {/* Background Effects - Red Theme */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-red-900/20 to-transparent pointer-events-none z-0" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="fixed top-1/4 right-[-10%] w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

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
                    
                    {/* Users Online Badge */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-green-400 font-medium">23 pessoas online agora</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full">
                            <Users size={14} className="text-red-400" />
                            <span className="text-xs text-red-400 font-bold">12 vagas restantes</span>
                        </div>
                    </div>
                </header>

                {/* Urgency Banner */}
                <div className="bg-gradient-to-r from-red-600/20 to-rose-600/20 border border-red-500/30 rounded-2xl p-4 mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <Clock size={18} className="text-red-400" />
                        <span className="text-sm text-gray-300">Oferta expira em:</span>
                        <div className="flex items-center gap-2">
                            <span className="bg-red-600 px-2 py-1 rounded font-mono font-bold text-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
                            <span className="text-red-400">:</span>
                            <span className="bg-red-600 px-2 py-1 rounded font-mono font-bold text-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
                            <span className="text-red-400">:</span>
                            <span className="bg-red-600 px-2 py-1 rounded font-mono font-bold text-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>

                {/* Hero Copy */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-6 animate-fade-in">
                        <Zap size={12} className="text-red-400 fill-red-400" />
                        <span className="text-xs font-bold text-red-300 uppercase tracking-wider">50% OFF - Só Hoje</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                        Não deixe a conversa <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">
                            morrer no "oi tudo bem"
                        </span>
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Com o <span className="text-rose-400 font-semibold">PRO</span> você tem respostas ilimitadas, tons exclusivos e 
                        <span className="text-white font-semibold"> nunca mais perde uma conversa</span>.
                    </p>
                </div>

                {/* Pricing Cards Container */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start mb-16">

                    {/* Free Plan */}
                    <div className="order-2 md:order-1 bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col hover:bg-white/[0.04] transition-all duration-300 md:mt-8 opacity-75">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-400 mb-2">Plano Grátis</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-gray-400">R$ 0</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Limitado. Para quem só quer testar.</p>
                        </div>

                        <ul className="space-y-3 mb-6 flex-1">
                            <li className="flex items-start gap-3 text-gray-500">
                                <Check size={16} className="text-gray-700 mt-0.5 shrink-0" />
                                <span className="text-xs">Apenas 5 análises por dia</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-500">
                                <Check size={16} className="text-gray-700 mt-0.5 shrink-0" />
                                <span className="text-xs">Respostas básicas</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-500">
                                <Lock size={16} className="text-gray-700 mt-0.5 shrink-0" />
                                <span className="text-xs line-through">Tons exclusivos bloqueados</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-500">
                                <Lock size={16} className="text-gray-700 mt-0.5 shrink-0" />
                                <span className="text-xs line-through">Sem histórico</span>
                            </li>
                        </ul>

                        <button
                            onClick={onBack}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-500 font-bold rounded-xl transition-all text-xs"
                        >
                            Continuar Limitado
                        </button>
                    </div>

                    {/* PRO Plan - Highlighted */}
                    <div className="order-1 md:order-2 relative bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-2 border-red-500/50 rounded-3xl p-8 flex flex-col shadow-2xl shadow-red-900/30 transform md:-translate-y-4 z-10 overflow-hidden group">
                        {/* Gradient Glow */}
                        <div className="absolute -top-[100px] -right-[100px] w-[200px] h-[200px] bg-red-600/30 blur-[80px] group-hover:bg-red-600/40 transition-all"></div>
                        
                        {/* Best Value Badge */}
                        <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-rose-600 px-6 py-1.5 rounded-b-xl">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Mais Popular</span>
                        </div>

                        <div className="mb-4 relative mt-4">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent shrink-0">
                                    PRO ILIMITADO
                                </h3>
                            </div>
                            
                            <div className="flex flex-col mb-2">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-lg text-gray-500 line-through">R$ 29,90</span>
                                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded">-50%</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-6xl font-extrabold text-white tracking-tighter drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                                        R$ 15
                                    </span>
                                    <span className="text-xl font-bold text-red-400">,00</span>
                                </div>
                                <span className="text-sm text-gray-500 mt-1">por mês • cancele quando quiser</span>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1 relative">
                            <li className="flex items-start gap-3 text-gray-200">
                                <div className="p-0.5 bg-red-500/20 rounded-full">
                                    <Check size={16} className="text-red-400" />
                                </div>
                                <span className="text-sm"><span className="text-white font-semibold">Análises ILIMITADAS</span> - sem restrições</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-200">
                                <div className="p-0.5 bg-red-500/20 rounded-full">
                                    <Check size={16} className="text-red-400" />
                                </div>
                                <span className="text-sm"><span className="text-white font-semibold">Cantadas ILIMITADAS</span> - seja criativo</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-200">
                                <div className="p-0.5 bg-red-500/20 rounded-full">
                                    <Check size={16} className="text-red-400" />
                                </div>
                                <span className="text-sm"><span className="text-white font-semibold">Tons Exclusivos</span> - Sedutor, Ousado, Misterioso...</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-200">
                                <div className="p-0.5 bg-red-500/20 rounded-full">
                                    <Check size={16} className="text-red-400" />
                                </div>
                                <span className="text-sm"><span className="text-white font-semibold">IA mais inteligente</span> - respostas melhores</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-200">
                                <div className="p-0.5 bg-red-500/20 rounded-full">
                                    <Check size={16} className="text-red-400" />
                                </div>
                                <span className="text-sm"><span className="text-white font-semibold">Histórico completo</span> - reveja conversas</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-200">
                                <div className="p-0.5 bg-red-500/20 rounded-full">
                                    <Check size={16} className="text-red-400" />
                                </div>
                                <span className="text-sm"><span className="text-white font-semibold">Suporte VIP</span> - resposta em até 24h</span>
                            </li>
                        </ul>

                        <button
                            onClick={handleUpgrade}
                            className="relative w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/50 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-lg"
                        >
                            <Zap size={20} className="fill-white/30" />
                            Quero Ser PRO Agora
                        </button>
                        
                        <div className="flex items-center justify-center gap-4 mt-4">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Shield size={12} className="text-green-500" />
                                <span>Compra segura</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <CheckCircle2 size={12} className="text-green-500" />
                                <span>Acesso imediato</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Guarantee Section */}
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
                        <Shield size={32} className="text-green-500 mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-white mb-2">Garantia de 7 Dias</h3>
                        <p className="text-sm text-gray-400">
                            Se você não ficar satisfeito por qualquer motivo, devolvemos 100% do seu dinheiro. 
                            Sem perguntas, sem burocracia.
                        </p>
                    </div>
                </div>

                {/* Testimonial */}
                <div className="max-w-2xl mx-auto mb-16">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                            ))}
                        </div>
                        <p className="text-gray-300 italic mb-4">
                            "Cara, eu era péssimo de conversa. Depois que assinei o PRO, consegui 3 dates em uma semana. 
                            O investimento se paga em um café que você toma com o match."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                                L
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Lucas M.</p>
                                <p className="text-gray-500 text-xs">Usuário PRO há 2 meses</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-2xl mx-auto mb-16">
                    <h3 className="text-xl font-bold text-white mb-8 text-center">Perguntas Frequentes</h3>
                    <div className="grid gap-4">
                        <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-red-500/20 transition-colors">
                            <h4 className="font-bold text-gray-200 mb-2 text-sm">O pagamento é seguro?</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">Sim! Usamos a Kirvano, plataforma 100% segura. Aceitamos Pix (liberação imediata) e cartão de crédito.</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-red-500/20 transition-colors">
                            <h4 className="font-bold text-gray-200 mb-2 text-sm">Posso cancelar quando quiser?</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">Sim! Sem fidelidade. Cancele a qualquer momento pelo seu painel ou fale com nosso suporte.</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-red-500/20 transition-colors">
                            <h4 className="font-bold text-gray-200 mb-2 text-sm">E se eu não gostar?</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">Você tem 7 dias de garantia. Se não ficar satisfeito, devolvo seu dinheiro sem perguntas.</p>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="max-w-md mx-auto text-center mb-12">
                    <button
                        onClick={handleUpgrade}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/50 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-lg mb-4"
                    >
                        <Heart size={20} className="fill-white/30" />
                        Desbloquear PRO por R$ 15,00
                    </button>
                    <p className="text-xs text-red-500 font-bold mb-4 animate-pulse">
                        ⚠️ Restam apenas 12 vagas com 50% de desconto
                    </p>
                    <p className="text-xs text-gray-600">
                        Junte-se a 2.847+ pessoas que nunca mais ficaram no vácuo
                    </p>
                </div>

                {/* Footer */}
                <div className="text-center border-t border-white/5 pt-8">
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
