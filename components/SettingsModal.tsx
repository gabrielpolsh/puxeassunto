import React from 'react';
import { X, User, Mail, CreditCard, Calendar, Shield, ExternalLink, Zap, LogOut, CheckCircle2 } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    isPro: boolean;
    nextPayment: string | null;
    isLoadingProfile?: boolean;
    dailyCount: number;
    onUpgradeClick: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, 
    onClose, 
    user, 
    isPro, 
    nextPayment, 
    isLoadingProfile = false,
    dailyCount,
    onUpgradeClick
}) => {
    if (!isOpen) return null;

    const usagePercentage = Math.min((dailyCount / 5) * 100, 100);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />

            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in ring-1 ring-white/5">
                
                {/* Header */}
                <div className="relative px-6 pt-6 pb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Minha Conta
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="relative px-6 pb-8 space-y-6">

                    {/* User Profile Card */}
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-14 h-14 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-xl font-bold text-white">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-400 mb-0.5">Logado como</p>
                            <p className="text-white font-medium truncate text-sm" title={user.email}>{user.email}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                                {isPro ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-300 uppercase tracking-wide">
                                        <Zap size={10} className="fill-purple-300" /> PRO
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                        Gratuito
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Usage Stats (Only for Free users or to show activity) */}
                    {!isPro && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400 font-medium">Uso Diário Gratuito</span>
                                <span className="text-white font-bold">{dailyCount} / 5</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${usagePercentage >= 100 ? 'bg-red-500' : 'bg-white/20'}`}
                                    style={{ width: `${usagePercentage}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 text-right">
                                {dailyCount >= 5 ? 'Limite atingido. Renova amanhã.' : 'Renova diariamente.'}
                            </p>
                        </div>
                    )}

                    {/* Subscription Details */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Assinatura</h4>
                        
                        <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
                            {isPro ? (
                                <>
                                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-500/10 rounded-lg">
                                                <CheckCircle2 size={18} className="text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Plano PRO Ativo</p>
                                                <p className="text-xs text-gray-400">Acesso ilimitado liberado</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 flex items-center justify-between bg-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                                <Calendar size={18} className="text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Próxima Renovação</p>
                                                <p className="text-xs text-gray-400">
                                                    {isLoadingProfile ? 'Carregando...' : (nextPayment || 'Gerenciado pela Cakto')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <a
                                        href="https://cakto.com.br"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full p-3 text-center text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-t border-white/5 flex items-center justify-center gap-2"
                                    >
                                        Gerenciar Assinatura <ExternalLink size={12} />
                                    </a>
                                </>
                            ) : (
                                <div className="p-5 text-center space-y-4">
                                    <div className="w-12 h-12 mx-auto bg-white/5 rounded-full flex items-center justify-center">
                                        <Shield size={24} className="text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Você está no plano Gratuito</p>
                                        <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">
                                            Faça o upgrade para ter acesso ilimitado e respostas mais inteligentes.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => { onClose(); onUpgradeClick(); }}
                                        className="w-full py-2.5 bg-white text-black hover:bg-gray-200 text-sm font-bold rounded-xl transition-all"
                                    >
                                        Seja PRO Agora
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="pt-2 flex items-center justify-between text-[10px] text-gray-600">
                        <span>ID: {user.id?.slice(0, 8)}...</span>
                        <span>v1.0.0</span>
                    </div>

                </div>
            </div>
        </div>
    );
};
