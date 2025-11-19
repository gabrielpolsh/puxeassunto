import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, Send, MessageCircle, Sparkles, X } from 'lucide-react';
import { analyzeChatScreenshot, Suggestion } from '../services/geminiService';

interface ChatDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatDemo: React.FC<ChatDemoProps> = ({ isOpen, onClose }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setSuggestions([]); // Reset suggestions on new image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const { suggestions } = await analyzeChatScreenshot(image);
      setSuggestions(suggestions);
    } catch (error) {
      console.error(error);
      alert("Erro ao analisar imagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Panel: Upload & Preview */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-[#0f0f0f] border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center items-center">
          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-64 md:h-96 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-pink/50 hover:bg-white/5 transition-all group"
            >
              <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-brand-pink" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Carregar Print</h3>
              <p className="text-brand-muted text-sm text-center max-w-xs">
                Clique para selecionar uma imagem da sua conversa.
              </p>
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 max-h-[60vh]">
                <img src={image} alt="Chat preview" className="max-w-full max-h-[50vh] object-contain" />
                <button 
                  onClick={() => { setImage(null); setSuggestions([]); }}
                  className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white hover:bg-red-500/80 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              {!loading && suggestions.length === 0 && (
                <button
                  onClick={handleAnalyze}
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-brand-pink rounded-full text-white font-semibold shadow-lg hover:shadow-brand-pink/25 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Sparkles size={18} />
                  Analisar Conversa
                </button>
              )}
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {/* Right Panel: Results */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-[#111] flex flex-col overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-1">Sugestões da IA</h2>
          <p className="text-brand-muted text-sm mb-6">Baseado na análise do contexto e tom da conversa.</p>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-brand-muted">
              <Loader2 className="w-10 h-10 animate-spin text-brand-pink mb-4" />
              <p className="animate-pulse">Lendo o print...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-5 bg-[#1a1a1a] border border-white/5 rounded-xl hover:border-brand-pink/30 transition-colors group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white group-hover:bg-brand-pink group-hover:text-white transition-colors">
                      {suggestion.tone}
                    </span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(suggestion.message)}
                      className="text-xs text-brand-muted hover:text-white transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                  <p className="text-lg text-white mb-3 font-medium leading-relaxed">"{suggestion.message}"</p>
                  <p className="text-xs text-brand-muted italic border-t border-white/5 pt-3">
                    💡 {suggestion.explanation}
                  </p>
                </div>
              ))}
              <button 
                onClick={() => { setImage(null); setSuggestions([]); }}
                className="w-full py-3 mt-4 border border-white/10 rounded-lg text-sm text-brand-muted hover:bg-white/5 transition-colors"
              >
                Analisar outro print
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-brand-muted opacity-40">
              <MessageCircle className="w-16 h-16 mb-4" />
              <p className="text-center max-w-xs">Carregue um print para ver a mágica acontecer.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};