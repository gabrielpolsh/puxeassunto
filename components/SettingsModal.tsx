import React from 'react';
import { X, User, Mail, CreditCard, Calendar, Shield, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    isPro: boolean;
    nextPayment: string | null;
    isLoadingProfile?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user, isPro, nextPayment, isLoadingProfile = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-[#111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">

                {/* Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#161616]">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <User size={18} className="text-purple-400" />
                        Minha Conta
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Profile Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Email cadastrado</p>
                                <p className="text-white font-medium truncate max-w-[200px]">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Plan Details */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Detalhes do Plano</h4>
                        <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">

                            {/* Status Row */}
                            <div className="p-4 flex items-center justify-between border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <Shield size={18} className={isPro ? "text-green-400" : "text-gray-400"} />
                                    <div>
                                        <p className="text-sm font-medium text-white">Status da Assinatura</p>
                                        <p className="text-xs text-gray-400">{isPro ? 'Ativa' : 'Inativa'}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${isPro ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                    {isPro ? 'PRO' : 'FREE'}
                                </span>
                            </div>

                            {/* Renewal Row (Only if PRO) */}
                            {isPro && (
                                <div className="p-4 flex items-center justify-between border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={18} className="text-purple-400" />
                                        <div>
                                            <p className="text-sm font-medium text-white">Próxima Renovação</p>
                                            <p className="text-xs text-gray-400">
                                                {isLoadingProfile ? 'Calculando...' : (nextPayment || 'Indisponível')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Payment Method (Static for now) */}
                            {isPro && (
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CreditCard size={18} className="text-pink-400" />
                                        <div>
                                            <p className="text-sm font-medium text-white">Gerenciar Assinatura</p>
                                            <p className="text-xs text-gray-400">Via Cakto</p>
                                        </div>
                                    </div>
                                    <a
                                        href="https://cakto.com.br"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                    >
                                        Acessar <ExternalLink size={10} />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-[#161616] border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-600">
                        ID do Usuário: {user.id}
                    </p>
                </div>

            </div>
        </div>
    );
};
