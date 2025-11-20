import React from 'react';
import { Check, Zap, Star, Shield, ArrowLeft, Crown, Infinity, Sparkles } from 'lucide-react';

interface UpgradePageProps {
    onBack: () => void;
}

export const UpgradePage: React.FC<UpgradePageProps> = ({ onBack }) => {
    const handleUpgrade = () => {
        window.open('https://pay.cakto.com.br/3f6ox25_658781', '_blank');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 relative overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none z-0" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="fixed top-1/4 right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 md:py-12">
                {/* Header */}
                <header className="flex items-center justify-between mb-12 md:mb-20">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group px-4 py-2 rounded-full hover:bg-white/5"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Voltar</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Crown size={16} className="text-white fill-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Premium</span>
                    </div>
                </header>

                {/* Hero Copy */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 animate-fade-in">
                        <Sparkles size={12} className="text-purple-400" />
                        <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Oferta Limitada</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                        Não deixe a conversa <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-gradient-x">
                            morrer no "oi tudo bem"
                        </span>
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Desbloqueie o poder total da IA para criar respostas irresistíveis, ter assuntos infinitos e conquistar quem você quiser.
                    </p>
                </div>

                {/* Pricing Cards Container */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch mb-20">

                    {/* Free Plan */}
                    <div className="order-2 md:order-1 bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col hover:bg-white/[0.04] transition-all duration-300">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-300 mb-2">Iniciante</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">R$ 0</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Para quem está só olhando.</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start gap-3 text-gray-400">
                                <Check size={18} className="text-gray-600 mt-0.5 shrink-0" />
                                <span className="text-sm">2 análises por dia</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400">
                                <Check size={18} className="text-gray-600 mt-0.5 shrink-0" />
                                <span className="text-sm">Respostas padrão</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400">
                                <Check size={18} className="text-gray-600 mt-0.5 shrink-0" />
                                <span className="text-sm">Acesso básico ao app</span>
                            </li>
                        </ul>

                        <button
                            onClick={onBack}
                            className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl transition-all text-sm"
                        >
                            Continuar Grátis
                        </button>
                    </div>

                    {/* PRO Plan */}
                    <div className="order-1 md:order-2 relative bg-[#0f0f0f] border border-purple-500/30 rounded-3xl p-8 flex flex-col shadow-2xl shadow-purple-900/20 transform md:-translate-y-4 z-10 overflow-hidden group">
                        {/* Gradient Glow */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                        <div className="absolute -top-[100px] -right-[100px] w-[200px] h-[200px] bg-purple-600/20 blur-[80px] group-hover:bg-purple-600/30 transition-all"></div>

                        <div className="absolute top-4 right-4">
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                Recomendado
                            </span>
                        </div>

                        <div className="mb-8 relative">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <Crown size={20} className="text-yellow-400 fill-yellow-400" />
                                PuxeAssunto PRO
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-white tracking-tight">R$ 29,90</span>
                                <span className="text-sm text-gray-500 font-medium">/mês</span>
                            </div>
                            <p className="text-sm text-purple-300 mt-2 font-medium">Menos de R$ 1,00 por dia.</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1 relative">
                            <li className="flex items-start gap-3 text-white">
                                <div className="p-1 bg-green-500/20 rounded-full shrink-0"><Infinity size={14} className="text-green-400" /></div>
                                <span className="text-sm font-medium">Análises e Respostas Ilimitadas</span>
                            </li>
                            <li className="flex items-start gap-3 text-white">
                                <div className="p-1 bg-purple-500/20 rounded-full shrink-0"><Zap size={14} className="text-purple-400" /></div>
                                <span className="text-sm">IA mais inteligente e criativa (Modelo Pro)</span>
                            </li>
                            <li className="flex items-start gap-3 text-white">
                                <div className="p-1 bg-pink-500/20 rounded-full shrink-0"><Star size={14} className="text-pink-400" /></div>
                                <span className="text-sm">Tons de resposta exclusivos (Sedutor, Engraçado)</span>
                            </li>
                            <li className="flex items-start gap-3 text-white">
                                <div className="p-1 bg-blue-500/20 rounded-full shrink-0"><Shield size={14} className="text-blue-400" /></div>
                                <span className="text-sm">Acesso antecipado a novas funções</span>
                            </li>
                        </ul>

                        <button
                            onClick={handleUpgrade}
                            className="relative w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/40 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group-hover:shadow-purple-500/25"
                        >
                            <Zap size={20} className="fill-white" />
                            Quero Ser PRO Agora
                        </button>
                        
                        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-500">
                            <Shield size={12} />
                            Compra segura • Cancelamento fácil
                        </div>
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
                        © 2024 PuxeAssunto. Todos os direitos reservados.
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
                @keyframes gradientX {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradientX 3s ease infinite;
                }
            `}</style>
        </div>
    );
};
