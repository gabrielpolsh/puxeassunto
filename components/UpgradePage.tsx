import React, { useState, useEffect } from 'react';
import { 
    Check, ArrowLeft, Zap, Shield, Clock, Heart, Star, Users, Lock, 
    CheckCircle2, Crown, Sparkles, TrendingUp, MessageCircle, X,
    ChevronRight, Gift, Flame, BadgeCheck, Timer, CreditCard
} from 'lucide-react';
import { metaService } from '../services/metaService';
import { ExitIntentPopup } from './ExitIntentPopup';

interface UpgradePageProps {
    onBack: () => void;
    user: any;
}

type PlanType = 'monthly' | 'quarterly' | 'yearly';

interface Plan {
    id: PlanType;
    name: string;
    price: number;
    originalPrice: number;
    period: string;
    monthlyPrice: number;
    savings: string;
    savingsPercent: number;
    checkoutUrl: string;
    badge?: string;
    popular?: boolean;
    bestValue?: boolean;
}

const plans: Plan[] = [
    {
        id: 'monthly',
        name: 'Mensal',
        price: 15.90,
        originalPrice: 15.90,
        period: '/mês',
        monthlyPrice: 15.90,
        savings: '',
        savingsPercent: 0,
        checkoutUrl: 'https://pay.kirvano.com/1b352195-0b65-4afa-9a3e-bd58515446e9',
        badge: '✅ Acesso Completo'
    },
    {
        id: 'quarterly',
        name: 'Trimestral',
        price: 39.90,
        originalPrice: 47.70, // 3 x R$ 15,90 = R$ 47,70
        period: '/3 meses',
        monthlyPrice: 13.30,
        savings: '16% OFF',
        savingsPercent: 16,
        checkoutUrl: 'https://pay.kirvano.com/003f8e49-5c58-41f5-a122-8715abdf2c02',
        badge: '🔥 Mais Popular',
        popular: true
    },
    {
        id: 'yearly',
        name: 'Anual',
        price: 97.90,
        originalPrice: 190.80, // 12 x R$ 15,90 = R$ 190,80
        period: '/ano',
        monthlyPrice: 8.08,
        savings: '49% OFF',
        savingsPercent: 49,
        checkoutUrl: 'https://pay.kirvano.com/f4254764-ee73-4db6-80fe-4d0dc70233e2',
        badge: '💎 Melhor Economia',
        bestValue: true
    }
];

const testimonials = [
    {
        name: 'Lucas M.',
        avatar: 'L',
        text: 'Consegui 3 dates em uma semana. O investimento se paga em um café que você toma com o match.',
        rating: 5,
        time: 'Usuário PRO há 2 meses'
    },
    {
        name: 'Gabriel S.',
        avatar: 'G', 
        text: 'Antes eu travava nas conversas, agora as meninas que pedem meu número. Mudou minha vida!',
        rating: 5,
        time: 'Usuário PRO há 1 mês'
    },
    {
        name: 'Pedro H.',
        avatar: 'P',
        text: 'A IA entende exatamente o contexto da conversa. As respostas são muito naturais.',
        rating: 5,
        time: 'Usuário PRO há 3 meses'
    }
];

const stats = [
    { value: '2.847+', label: 'Usuários ativos' },
    { value: '50mil+', label: 'Conversas salvas' },
    { value: '4.9★', label: 'Avaliação média' },
];

export const UpgradePage: React.FC<UpgradePageProps> = ({ onBack, user }) => {
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });
    const [showExitPopup, setShowExitPopup] = useState(false);
    const [exitPopupShown, setExitPopupShown] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [showFloatingCTA, setShowFloatingCTA] = useState(false);

    useEffect(() => {
        metaService.trackEvent({
            eventName: 'AddToCart',
            contentName: 'Plano PRO Ilimitado',
            value: 15.00,
            currency: 'BRL',
            contentType: 'product'
        });
    }, []);

    // Floating CTA on scroll
    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingCTA(window.scrollY > 600);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Exit Intent Detection
    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !exitPopupShown) {
                setShowExitPopup(true);
                setExitPopupShown(true);
                metaService.trackEvent({
                    eventName: 'ExitIntentShown',
                    contentName: 'Upgrade Page',
                    customData: { action: 'exit_intent_triggered' }
                });
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Escape' || (e.altKey && e.key === 'F4')) && !exitPopupShown) {
                e.preventDefault();
                setShowExitPopup(true);
                setExitPopupShown(true);
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [exitPopupShown]);

    const handleBackClick = () => {
        if (!exitPopupShown) {
            setShowExitPopup(true);
            setExitPopupShown(true);
            metaService.trackEvent({
                eventName: 'ExitIntentShown',
                contentName: 'Upgrade Page',
                customData: { action: 'back_button_clicked' }
            });
        } else {
            onBack();
        }
    };

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

    const handleUpgrade = (plan: Plan) => {
        metaService.trackEvent({
            eventName: 'InitiateCheckout',
            contentName: `Plano PRO ${plan.name}`,
            value: plan.price,
            currency: 'BRL',
            contentType: 'product'
        });
        
        // Build checkout URL with pre-filled email
        let checkoutUrl = plan.checkoutUrl;
        if (user?.email) {
            const encodedEmail = encodeURIComponent(user.email);
            checkoutUrl += `?customer.email=${encodedEmail}`;
        }
        
        window.open(checkoutUrl, '_blank');
    };

    const proFeatures = [
        { icon: Zap, text: 'Análises ILIMITADAS', desc: 'Sem limite de uso' },
        { icon: Heart, text: 'Cantadas ILIMITADAS', desc: 'Seja criativo sempre' },
        { icon: Sparkles, text: 'Tons Exclusivos PRO', desc: 'Sedutor, Ousado, Misterioso...' },
        { icon: Crown, text: 'IA Premium', desc: 'Respostas 3x melhores' },
        { icon: MessageCircle, text: 'Histórico Completo', desc: 'Reveja suas conversas' },
        { icon: BadgeCheck, text: 'Suporte VIP', desc: 'Resposta em até 24h' },
    ];

    const freeVsPro = [
        { feature: 'Análises por dia', free: '5', pro: 'Ilimitado ∞' },
        { feature: 'Cantadas por dia', free: '3', pro: 'Ilimitado ∞' },
        { feature: 'Tons de resposta', free: '3 básicos', pro: '10+ exclusivos' },
        { feature: 'Qualidade da IA', free: 'Básica', pro: 'Premium' },
        { feature: 'Histórico', free: '❌', pro: '✅' },
        { feature: 'Suporte', free: 'Comunidade', pro: 'VIP 24h' },
    ];

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-rose-500/30 relative overflow-x-hidden">
            {/* Exit Intent Popup */}
            {showExitPopup && (
                <ExitIntentPopup 
                    onClose={() => setShowExitPopup(false)}
                    onAccept={() => {
                        setShowExitPopup(false);
                        handleUpgrade(plans[1]);
                    }}
                />
            )}
            
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-red-950/30 via-red-900/10 to-transparent" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[150px]" />
                <div className="absolute top-1/3 right-[-15%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-2/3 left-[-10%] w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-4 md:py-8">
                {/* Header */}
                <header className="flex items-center justify-between mb-6">
                    <button
                        onClick={handleBackClick}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group p-2 rounded-full hover:bg-white/5"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-green-400 font-medium hidden sm:inline">23 online</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full">
                            <Flame size={14} className="text-rose-400" />
                            <span className="text-xs text-rose-400 font-semibold">Últimas 12 vagas!</span>
                        </div>
                    </div>
                </header>

                {/* MEGA Urgency Banner */}
                <div className="relative bg-gradient-to-r from-rose-600/90 via-rose-500/90 to-rose-600/90 rounded-2xl p-4 mb-8 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-20"></div>
                    <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                        <div className="flex items-center gap-2">
                            <Timer size={20} className="text-white" />
                            <span className="text-white font-semibold">OFERTA TERMINA EM:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-black/30 backdrop-blur px-3 py-2 rounded-lg">
                                <span className="font-mono font-bold text-2xl text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                                <span className="text-xs text-white/60 block">horas</span>
                            </div>
                            <span className="text-white text-2xl font-bold">:</span>
                            <div className="bg-black/30 backdrop-blur px-3 py-2 rounded-lg">
                                <span className="font-mono font-bold text-2xl text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                <span className="text-xs text-white/60 block">min</span>
                            </div>
                            <span className="text-white text-2xl font-bold">:</span>
                            <div className="bg-black/30 backdrop-blur px-3 py-2 rounded-lg">
                                <span className="font-mono font-bold text-2xl text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                <span className="text-xs text-white/60 block">seg</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/15 to-rose-500/10 border border-rose-500/25 mb-6">
                        <Gift size={16} className="text-rose-400" />
                        <span className="text-sm font-semibold text-rose-300">ATÉ 73% OFF + BÔNUS EXCLUSIVO</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-[1.1]">
                        Pare de perder conversas<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-300 to-pink-300">
                            por respostas ruins
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-6">
                        Desbloqueie o <span className="text-white font-semibold">PRO</span> e tenha 
                        <span className="text-rose-400 font-semibold"> respostas ilimitadas</span> que fazem 
                        suas conversas <span className="text-white font-semibold">nunca mais travarem</span>
                    </p>

                    {/* Social Proof Stats */}
                    <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl md:text-3xl font-black text-white">{stat.value}</div>
                                <div className="text-xs text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 md:gap-6 mb-12 px-2 md:px-0">
                    {plans.map((plan, index) => (
                        <div 
                            key={plan.id}
                            className={`relative rounded-3xl p-6 flex flex-col transition-all duration-500 ${
                                plan.popular 
                                    ? 'bg-gradient-to-b from-rose-950/50 via-[#0a0a0a] to-[#050505] border border-rose-500/60 shadow-[0_0_40px_-15px_rgba(244,63,94,0.3)] md:scale-[1.03] z-20' 
                                    : plan.bestValue
                                    ? 'bg-gradient-to-b from-violet-950/30 to-[#0a0a0a] border border-violet-500/40 shadow-[0_0_30px_-15px_rgba(139,92,246,0.2)]'
                                    : 'bg-gradient-to-b from-emerald-950/30 to-[#0a0a0a] border border-emerald-500/40 hover:border-emerald-500/60 shadow-[0_0_30px_-15px_rgba(16,185,129,0.2)]'
                            }`}
                        >
                            {/* Ribbon/Badge */}
                            {plan.badge && (
                                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap shadow-md ${
                                    plan.popular 
                                        ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-rose-900/30' 
                                        : plan.bestValue
                                        ? 'bg-gradient-to-r from-violet-500 to-purple-400 text-white shadow-violet-900/20'
                                        : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-emerald-900/30'
                                }`}>
                                    {plan.badge}
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="mt-4 mb-6">
                                <h3 className={`text-2xl font-bold mb-2 ${
                                    plan.popular ? 'text-rose-400' : plan.bestValue ? 'text-violet-400' : 'text-emerald-400'
                                }`}>
                                    {plan.name}
                                </h3>
                                
                                {/* Savings Bar - apenas se houver desconto */}
                                {plan.savingsPercent > 0 && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${
                                                    plan.popular ? 'bg-gradient-to-r from-rose-500 to-rose-400' :
                                                    plan.bestValue ? 'bg-gradient-to-r from-violet-500 to-purple-400' :
                                                    'bg-emerald-500'
                                                }`}
                                                style={{ width: `${plan.savingsPercent}%` }}
                                            />
                                        </div>
                                        <span className={`text-xs font-semibold ${
                                            plan.popular ? 'text-rose-400' : plan.bestValue ? 'text-violet-400' : 'text-emerald-400'
                                        }`}>
                                            {plan.savings}
                                        </span>
                                    </div>
                                )}

                                {/* Price */}
                                {plan.originalPrice > plan.price && (
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-lg text-gray-500 line-through">R$ {plan.originalPrice.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                )}
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-sm text-gray-400">R$</span>
                                    <span className={`text-5xl md:text-6xl font-black tracking-tight ${
                                        plan.popular ? 'text-white drop-shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 
                                        plan.bestValue ? 'text-white drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]' :
                                        'text-gray-200'
                                    }`}>
                                        {Math.floor(plan.price)}
                                    </span>
                                    <span className={`text-xl font-bold ${plan.popular ? 'text-rose-400' : plan.bestValue ? 'text-violet-400' : 'text-emerald-400'}`}>
                                        ,{(plan.price % 1).toFixed(2).substring(2)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {plan.id === 'monthly' && 'acesso completo • cancele quando quiser'}
                                    {plan.id === 'quarterly' && <>3 meses de acesso • <span className="text-white font-medium">R$ {plan.monthlyPrice.toFixed(2).replace('.', ',')}</span>/mês</>}
                                    {plan.id === 'yearly' && <>apenas <span className="text-violet-400 font-medium">R$ {plan.monthlyPrice.toFixed(2).replace('.', ',')}</span>/mês</>}
                                </p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-6 flex-1">
                                {proFeatures.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className={`p-1 rounded-full ${
                                            plan.popular ? 'bg-rose-500/15' : plan.bestValue ? 'bg-violet-500/15' : 'bg-emerald-500/15'
                                        }`}>
                                            <Check size={14} className={
                                                plan.popular ? 'text-rose-400' : plan.bestValue ? 'text-violet-400' : 'text-emerald-500'
                                            } />
                                        </div>
                                        <span className="text-sm text-gray-300">{feature.text}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button
                                onClick={() => handleUpgrade(plan)}
                                className={`w-full py-4 font-bold rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-lg ${
                                    plan.popular 
                                        ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:via-rose-400 hover:to-rose-500 text-white shadow-md shadow-rose-900/30 animate-shimmer bg-[length:200%_100%]' 
                                        : plan.bestValue
                                        ? 'bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white shadow-md shadow-violet-900/20'
                                        : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-md shadow-emerald-900/30'
                                }`}
                            >
                                <Zap size={20} className="fill-current" />
                                {plan.popular ? 'QUERO ESTE!' : plan.bestValue ? 'MELHOR CUSTO' : 'COMEÇAR AGORA'}
                            </button>

                            {/* Trust badges for popular */}
                            {plan.popular && (
                                <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <Shield size={12} className="text-green-500" />
                                        <span>Seguro</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <CheckCircle2 size={12} className="text-green-500" />
                                        <span>Acesso imediato</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <CreditCard size={12} className="text-green-500" />
                                        <span>Pix ou Cartão</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Comparison Table */}
                <div className="max-w-3xl mx-auto mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                        Por que o <span className="text-rose-400">PRO</span> é melhor?
                    </h2>
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-3 bg-white/5 p-4">
                            <div className="text-sm text-gray-400 font-medium">Recurso</div>
                            <div className="text-center text-sm text-gray-400 font-medium">Grátis</div>
                            <div className="text-center text-sm text-rose-400 font-semibold">PRO</div>
                        </div>
                        {freeVsPro.map((row, i) => (
                            <div key={i} className={`grid grid-cols-3 p-4 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                                <div className="text-sm text-gray-300">{row.feature}</div>
                                <div className="text-center text-sm text-gray-500">{row.free}</div>
                                <div className="text-center text-sm text-emerald-400 font-medium">{row.pro}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Guarantee */}
                <div className="max-w-2xl mx-auto mb-16">
                    <div className="relative bg-gradient-to-r from-emerald-950/40 to-emerald-950/30 border border-emerald-500/25 rounded-3xl p-8 text-center overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px]"></div>
                        <Shield size={48} className="text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-3">Garantia Incondicional de 7 Dias</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Teste o PRO por 7 dias. Se não ficar <span className="text-white font-medium">100% satisfeito</span>, 
                            devolvo <span className="text-emerald-400 font-semibold">todo seu dinheiro</span>. Sem perguntas, sem burocracia.
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-400">
                            <CheckCircle2 size={16} />
                            <span>Reembolso em até 24h</span>
                        </div>
                    </div>
                </div>

                {/* Testimonials Carousel */}
                <div className="max-w-3xl mx-auto mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                        O que nossos usuários dizem
                    </h2>
                    <div className="relative">
                        <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                            <p className="text-lg md:text-xl text-gray-200 italic mb-6 leading-relaxed">
                                "{testimonials[activeTestimonial].text}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {testimonials[activeTestimonial].avatar}
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{testimonials[activeTestimonial].name}</p>
                                    <p className="text-gray-500 text-sm">{testimonials[activeTestimonial].time}</p>
                                </div>
                            </div>
                        </div>
                        {/* Dots */}
                        <div className="flex items-center justify-center gap-2 mt-4">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTestimonial(i)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        i === activeTestimonial ? 'bg-red-500 w-6' : 'bg-white/20 hover:bg-white/40'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-2xl mx-auto mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Perguntas Frequentes</h2>
                    <div className="space-y-3">
                        {[
                            { q: 'O pagamento é seguro?', a: 'Sim! Usamos a Kirvano, plataforma 100% segura. Aceitamos Pix (liberação imediata) e cartão.' },
                            { q: 'Posso cancelar quando quiser?', a: 'Sim! Sem fidelidade. Cancele a qualquer momento pelo seu painel ou fale com nosso suporte.' },
                            { q: 'O acesso é imediato?', a: 'Sim! Após a confirmação do pagamento, seu acesso PRO é liberado automaticamente em segundos.' },
                            { q: 'E se eu não gostar?', a: 'Você tem 7 dias de garantia incondicional. Devolvo 100% do seu dinheiro sem perguntas.' }
                        ].map((faq, i) => (
                            <details key={i} className="bg-white/[0.03] border border-white/10 rounded-xl group">
                                <summary className="p-4 cursor-pointer flex items-center justify-between font-semibold text-gray-200 hover:text-white">
                                    {faq.q}
                                    <ChevronRight size={18} className="text-gray-500 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="px-4 pb-4 text-sm text-gray-400">{faq.a}</div>
                            </details>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <div className="max-w-xl mx-auto text-center mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Ainda com dúvidas?
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Escolha o plano mais popular e teste por 7 dias. Se não gostar, devolvo seu dinheiro.
                    </p>
                    <button
                        onClick={() => handleUpgrade(plans[1])}
                        className="w-full py-5 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:via-rose-500 hover:to-red-500 text-white font-bold rounded-2xl shadow-2xl shadow-red-900/50 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-xl mb-4"
                    >
                        <Crown size={24} />
                        QUERO SER PRO AGORA
                        <ChevronRight size={24} />
                    </button>
                    <p className="text-xs text-gray-600">
                        🔒 Pagamento 100% seguro • Acesso imediato • Garantia de 7 dias
                    </p>
                </div>

                {/* Footer */}
                <div className="text-center border-t border-white/5 pt-8 pb-20 md:pb-8">
                    <p className="text-xs text-gray-600 mb-2">
                        Junte-se a 2.847+ pessoas que nunca mais ficaram no vácuo
                    </p>
                    <p className="text-gray-700 text-xs">
                        © 2025 PuxeAssunto. Todos os direitos reservados.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .animate-shimmer {
                    animation: shimmer 3s ease-in-out infinite;
                }
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </div>
    );
};
