import React from 'react';
import { X, User, Mail, CreditCard, Calendar, Shield, ExternalLink, Zap, LogOut, CheckCircle2, Crown, Clock, Sparkles } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    isPro: boolean;
    nextPayment: string | null;
    planType?: string | null;
    subscriptionEndDate?: string | null;
    isLoadingProfile?: boolean;
    dailyCount: number;
    onUpgradeClick: () => void;
    onLogout?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, 
    onClose, 
    user, 
    isPro, 
    nextPayment,
    planType,
    subscriptionEndDate,
    isLoadingProfile = false,
    dailyCount,
    onUpgradeClick,
    onLogout
}) => {
    if (!isOpen) return null;

    const usagePercentage = Math.min((dailyCount / 5) * 100, 100);
    
    // Formatar nome do plano
    const getPlanDisplayName = () => {
        switch (planType) {
            case 'yearly': return 'Anual';
            case 'quarterly': return 'Trimestral';
            case 'monthly': return 'Mensal';
            default: return 'PRO';
        }
    };

    // Calcular dias restantes
    const getDaysRemaining = () => {
        if (!subscriptionEndDate) return null;
        const end = new Date(subscriptionEndDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const daysRemaining = getDaysRemaining();

    const handleLogout = async () => {
        if (onLogout) {
            onLogout();
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={onClose} />

            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in ring-1 ring-white/5">
                
                {/* Header com gradiente */}
                <div className="relative px-6 pt-6 pb-4">
                    {isPro && (
                        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent pointer-events-none" />
                    )}
                    <div className="relative flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <User size={20} className="text-gray-400" />
                            Minha Conta
                        </h3>
                        <button 
                            onClick={onClose} 
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="relative px-6 pb-6 space-y-5">

                    {/* User Profile Card */}
                    <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${
                            isPro 
                                ? 'bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/20' 
                                : 'bg-[#1a1a1a] border border-white/10 text-white'
                        }`}>
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate text-sm" title={user.email}>{user.email}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                                {isPro ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-xs font-bold text-violet-300">
                                        <Crown size={12} className="text-violet-400" /> PRO {getPlanDisplayName()}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                        Plano Gratuito
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* PRO Status Card */}
                    {isPro && (
                        <div className="bg-gradient-to-br from-violet-950/40 to-purple-950/20 rounded-2xl border border-violet-500/20 overflow-hidden">
                            <div className="p-4 space-y-4">
                                {/* Status Ativo */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/15 rounded-xl">
                                            <CheckCircle2 size={18} className="text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Assinatura Ativa</p>
                                            <p className="text-xs text-gray-400">Acesso ilimitado</p>
                                        </div>
                                    </div>
                                    <Sparkles size={20} className="text-violet-400" />
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Plano */}
                                    <div className="bg-white/5 rounded-xl p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CreditCard size={14} className="text-violet-400" />
                                            <span className="text-[10px] text-gray-500 uppercase tracking-wide">Plano</span>
                                        </div>
                                        <p className="text-sm font-semibold text-white">{getPlanDisplayName()}</p>
                                    </div>

                                    {/* Dias Restantes ou Próxima Renovação */}
                                    <div className="bg-white/5 rounded-xl p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock size={14} className="text-violet-400" />
                                            <span className="text-[10px] text-gray-500 uppercase tracking-wide">
                                                {daysRemaining !== null ? 'Restam' : 'Renovação'}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-white">
                                            {isLoadingProfile ? '...' : (
                                                daysRemaining !== null 
                                                    ? `${daysRemaining} dias`
                                                    : (nextPayment || 'Em breve')
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Data de expiração */}
                                {subscriptionEndDate && (
                                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                                        <span className="text-gray-500">Válido até</span>
                                        <span className="text-gray-300 font-medium">
                                            {new Date(subscriptionEndDate).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Gerenciar Assinatura - Kirvano */}
                            <a
                                href="https://kirvano.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full p-3 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-t border-white/10"
                            >
                                <ExternalLink size={12} />
                                Gerenciar Assinatura na Kirvano
                            </a>
                        </div>
                    )}

                    {/* Usage Stats (Only for Free users) */}
                    {!isPro && (
                        <div className="space-y-4">
                            {/* Barra de uso */}
                            <div className="bg-white/[0.03] rounded-2xl border border-white/5 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-300">Uso Diário</span>
                                    <span className={`text-sm font-bold ${dailyCount >= 5 ? 'text-red-400' : 'text-white'}`}>
                                        {dailyCount} / 5
                                    </span>
                                </div>
                                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            usagePercentage >= 100 
                                                ? 'bg-gradient-to-r from-red-500 to-red-400' 
                                                : usagePercentage >= 60 
                                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-400'
                                                    : 'bg-gradient-to-r from-violet-500 to-purple-500'
                                        }`}
                                        style={{ width: `${usagePercentage}%` }}
                                    />
                                </div>
                                <p className="text-[11px] text-gray-500">
                                    {dailyCount >= 5 
                                        ? '⚠️ Limite atingido. Renova à meia-noite.' 
                                        : `${5 - dailyCount} análises restantes hoje`
                                    }
                                </p>
                            </div>

                            {/* CTA Upgrade */}
                            <div className="bg-gradient-to-br from-violet-950/30 to-purple-950/20 rounded-2xl border border-violet-500/20 p-5 text-center space-y-4">
                                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                                    <Zap size={24} className="text-violet-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white mb-1">Desbloqueie o PRO</p>
                                    <p className="text-xs text-gray-400 max-w-[220px] mx-auto">
                                        Análises ilimitadas, respostas mais inteligentes e todos os tons exclusivos.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => { onClose(); onUpgradeClick(); }}
                                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-violet-500/20"
                                >
                                    Seja PRO Agora
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Ações */}
                    <div className="pt-2 space-y-2">
                        {onLogout && (
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-colors"
                            >
                                <LogOut size={16} />
                                Sair da Conta
                            </button>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="pt-2 flex items-center justify-between text-[10px] text-gray-600 border-t border-white/5">
                        <span>ID: {user.id?.slice(0, 8)}...</span>
                        <span>Puxe Assunto v1.0</span>
                    </div>

                </div>
            </div>
        </div>
    );
};
