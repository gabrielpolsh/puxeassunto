import React from 'react';
import { Check, Zap, Star, Shield, ArrowLeft } from 'lucide-react';

interface UpgradePageProps {
    onBack: () => void;
}

export const UpgradePage: React.FC<UpgradePageProps> = ({ onBack }) => {
    const handleUpgrade = () => {
        window.open('https://pay.cakto.com.br/6e82enr', '_blank');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Voltar
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                            <Zap size={16} className="text-white fill-white" />
                        </div>
                        <span className="font-bold text-lg">Puxe<span className="text-purple-400 font-light">Assunto</span> PRO</span>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Desbloqueie todo o seu <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-gradient-x">
                            Potencial de Conquista
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                        Chega de limites. Tenha acesso ilimitado à IA que vai transformar suas conversas e garantir que você nunca mais fique no vácuo.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">

                    {/* Free Plan */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative hover:bg-white/[0.07] transition-all duration-300">
                        <h3 className="text-xl font-bold text-gray-300 mb-2">Plano Gratuito</h3>
                        <div className="text-4xl font-bold text-white mb-6">R$ 0 <span className="text-sm font-normal text-gray-500">/mês</span></div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-gray-400">
                                <Check size={18} className="text-gray-500" />
                                <span>2 análises por dia</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Check size={18} className="text-gray-500" />
                                <span>Respostas básicas</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Check size={18} className="text-gray-500" />
                                <span>Acesso ao app</span>
                            </li>
                        </ul>

                        <button
                            onClick={onBack}
                            className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                        >
                            Continuar Grátis
                        </button>
                    </div>

                    {/* PRO Plan */}
                    <div className="bg-[#1a1a1a] border border-purple-500/30 rounded-3xl p-8 relative shadow-2xl shadow-purple-900/20 transform md:scale-105 z-10">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                            Mais Popular
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <Star size={20} className="text-yellow-400 fill-yellow-400" />
                            Plano PRO
                        </h3>
                        <div className="text-5xl font-bold text-white mb-2">R$ 29,90 <span className="text-sm font-normal text-gray-500">/mês</span></div>
                        <p className="text-sm text-purple-300 mb-6">Cancele quando quiser.</p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-white">
                                <div className="p-1 bg-green-500/20 rounded-full"><Check size={14} className="text-green-400" /></div>
                                <span className="font-medium">Análises Ilimitadas</span>
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <div className="p-1 bg-green-500/20 rounded-full"><Check size={14} className="text-green-400" /></div>
                                <span>Respostas mais criativas e personalizadas</span>
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <div className="p-1 bg-green-500/20 rounded-full"><Check size={14} className="text-green-400" /></div>
                                <span>Análise de perfil (Em breve)</span>
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <div className="p-1 bg-green-500/20 rounded-full"><Check size={14} className="text-green-400" /></div>
                                <span>Suporte prioritário</span>
                            </li>
                        </ul>

                        <button
                            onClick={handleUpgrade}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/40 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Zap size={20} className="fill-white" />
                            Quero Ser PRO Agora
                        </button>

                        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-500">
                            <Shield size={12} />
                            Pagamento seguro via Cakto
                        </div>
                    </div>

                </div>

                {/* FAQ Preview */}
                <div className="mt-24 max-w-2xl mx-auto text-center">
                    <h3 className="text-xl font-bold text-white mb-8">Dúvidas Frequentes</h3>
                    <div className="space-y-6 text-left">
                        <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                            <h4 className="font-bold text-gray-200 mb-2">Posso cancelar quando quiser?</h4>
                            <p className="text-sm text-gray-400">Sim! Não há fidelidade. Você pode cancelar a renovação automática a qualquer momento direto pelo painel ou entrando em contato.</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                            <h4 className="font-bold text-gray-200 mb-2">O acesso é liberado na hora?</h4>
                            <p className="text-sm text-gray-400">Sim! Assim que o pagamento for confirmado (Pix é instantâneo), seu acesso PRO é liberado automaticamente.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
