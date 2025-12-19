import React, { useState, useEffect } from 'react';
import { X, Gift, Clock, Zap, Shield } from 'lucide-react';
import { metaService } from '../services/metaService';

interface ExitIntentPopupProps {
    onClose: () => void;
    onAccept: () => void;
}

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClose, onAccept }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animação de entrada
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleAccept = () => {
        metaService.trackEvent({
            eventName: 'ExitIntentAccepted',
            contentName: 'Desconto Exit Intent',
            customData: { action: 'accepted_discount' }
        });
        onAccept();
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
            />
            
            {/* Modal */}
            <div className={`relative bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-red-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-red-900/30 transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1"
                >
                    <X size={20} />
                </button>

                {/* Gift Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/50 animate-bounce">
                        <Gift size={32} className="text-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                        Ei, espera! 🎁
                    </h2>
                    <p className="text-gray-400 text-sm mb-4">
                        Antes de ir, tenho uma oferta especial <span className="text-red-400 font-semibold">só pra você</span>
                    </p>
                    
                    {/* Discount Badge */}
                    <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-4">
                        <span className="text-red-400 font-bold text-lg">50% OFF</span>
                        <span className="text-gray-400 text-sm">no PRO Ilimitado</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-gray-500 line-through text-xl">R$ 29,90</span>
                        <span className="text-4xl font-extrabold text-white">R$ 15</span>
                        <span className="text-red-400 font-bold">/mês</span>
                    </div>

                    {/* Urgency */}
                    <div className="flex items-center justify-center gap-2 text-yellow-400 text-sm mb-4">
                        <Clock size={14} />
                        <span>Oferta válida apenas agora!</span>
                    </div>
                </div>

                {/* Benefits Mini */}
                <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
                    <div className="flex items-center gap-2 text-gray-300">
                        <Zap size={12} className="text-red-400" />
                        <span>Análises ilimitadas</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                        <Zap size={12} className="text-red-400" />
                        <span>Tons exclusivos</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                        <Zap size={12} className="text-red-400" />
                        <span>IA mais inteligente</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                        <Shield size={12} className="text-green-400" />
                        <span>7 dias de garantia</span>
                    </div>
                </div>

                {/* CTA Buttons */}
                <button
                    onClick={handleAccept}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/50 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mb-3"
                >
                    <Gift size={18} />
                    Quero Meu Desconto!
                </button>
                
                <button
                    onClick={handleClose}
                    className="w-full py-3 text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                    Não, prefiro continuar limitado
                </button>
            </div>
        </div>
    );
};
