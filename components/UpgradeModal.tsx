import React from 'react';
import { X, Check, Zap } from 'lucide-react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleUpgrade = () => {
        // Redirect to Cakto Checkout
        window.open('https://pay.cakto.com.br/3f6ox25_658781', '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#111] border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                {/* Header Background */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-purple-900/50 to-pink-900/50 blur-xl pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="relative p-8 text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 mb-6 rotate-3">
                        <Zap size={32} className="text-white fill-white" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        Desbloqueie o <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">PuxeAssunto PRO</span>
                    </h2>
                    <p className="text-gray-400 text-sm mb-8">
                        Você atingiu o limite diário de 2 mensagens gratuitas. Evolua suas conversas agora mesmo.
                    </p>

                    <div className="space-y-4 mb-8 text-left bg-white/5 rounded-xl p-4 border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-green-500/20 rounded-full">
                                <Check size={12} className="text-green-400" />
                            </div>
                            <span className="text-sm text-gray-200">Mensagens Ilimitadas</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-green-500/20 rounded-full">
                                <Check size={12} className="text-green-400" />
                            </div>
                            <span className="text-sm text-gray-200">Análises mais detalhadas</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-green-500/20 rounded-full">
                                <Check size={12} className="text-green-400" />
                            </div>
                            <span className="text-sm text-gray-200">Acesso prioritário a novos recursos</span>
                        </div>
                    </div>

                    <button
                        onClick={handleUpgrade}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Zap size={18} className="fill-white" />
                        Quero Acesso Ilimitado
                    </button>

                    <p className="text-[10px] text-gray-500 mt-4">
                        Pagamento seguro via Cakto. Acesso liberado imediatamente após confirmação.
                    </p>
                </div>
            </div>
        </div>
    );
};
