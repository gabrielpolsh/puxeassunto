import React, { useState, useEffect } from 'react';
import { Upload, ScanLine, MessageCircle, Check, ArrowUp, Image as ImageIcon, Heart, Wifi, BatteryFull, BadgeCheck } from 'lucide-react';

const SUGGESTIONS_DEMO = [
  { 
    tone: "Romântico", 
    text: "Adorei a sugestão! Vamos marcar algo para testar essa teoria pessoalmente? 😉", 
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20"
  },
  { 
    tone: "Engraçado", 
    text: "Se eu ganhasse um real cada vez que ouço isso, já estaria rico! 😂", 
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  { 
    tone: "Misterioso", 
    text: "Interessante... mas isso é segredo de estado. 🤫", 
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20"
  },
  { 
    tone: "Ousado", 
    text: "Você sempre tem respostas tão boas ou hoje é um dia especial?", 
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20"
  },
  { 
    tone: "Descontraído", 
    text: "Hahaha, justo! Mas agora fiquei curioso com o resto da história.", 
    color: "text-red-300",
    bg: "bg-red-500/10",
    border: "border-red-500/20"
  }
];

export const HowItWorks: React.FC = () => {
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);

    const interval = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 1) % SUGGESTIONS_DEMO.length);
    }, 3000);
    return () => {
        clearInterval(interval);
        clearInterval(timeInterval);
    };
  }, []);

  return (
    <section id="como-funciona" className="pb-32 relative scroll-mt-32">
      {/* Connecting Line Background */}
      <div className="absolute top-40 bottom-40 left-1/2 w-px bg-gradient-to-b from-transparent via-red-500/20 to-transparent -translate-x-1/2 hidden lg:block"></div>

      <div className="text-center mb-24 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
           <BadgeCheck size={14} className="text-green-400" />
           <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">Simples e Rápido</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          Do print à resposta <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">em segundos</span>
        </h2>
      </div>

      <div className="flex flex-col gap-32 lg:gap-40 relative z-10">
        
        {/* Step 01 */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 group">
          {/* Text */}
          <div className="flex-1 relative lg:text-right">
            <div className="absolute -top-16 -left-10 lg:left-auto lg:-right-10 text-9xl font-black text-white/5 select-none -z-10 transition-colors group-hover:text-white/[0.07]">01</div>
            <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">Mande o Print</h3>
            <p className="text-gray-400 leading-relaxed text-lg lg:pl-12">
              Tire um print daquela conversa onde você travou. Pode ser do WhatsApp, Tinder, Instagram ou qualquer outro app. Basta fazer o upload.
            </p>
          </div>

          {/* Visual */}
          <div className="flex-1 w-full flex justify-center lg:justify-start">
            <div className="relative w-full max-w-sm aspect-square lg:aspect-[4/3]">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-red-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Card */}
                <div className="w-full h-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-1 overflow-hidden relative shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] group-hover:border-red-500/30">
                    <div className="w-full h-full bg-[#111] rounded-[20px] border border-white/5 relative overflow-hidden">
                        
                        {/* iPhone Mockup - Positioned to be cut off */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-6 w-[260px] h-[500px] bg-black rounded-[45px] border-[6px] border-[#333] shadow-2xl transform rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500 box-border ring-1 ring-white/10 overflow-hidden">
                          
                          {/* Dynamic Island / Notch Area */}
                          <div className="absolute top-0 left-0 right-0 h-8 z-30 flex justify-center items-start pt-2">
                             <div className="w-24 h-7 bg-black rounded-full flex items-center justify-center gap-2 px-2 border border-[#222]">
                                {/* Removed dot */}
                             </div>
                          </div>

                          {/* Screen Content */}
                          <div className="w-full h-full bg-[#0f0f0f] relative flex flex-col">
                            
                            {/* Status Bar */}
                            <div className="h-10 w-full flex justify-between items-center px-6 pt-2 z-20">
                                <div className="text-[10px] text-white font-medium">{currentTime || '9:41'}</div>
                                <div className="flex gap-1.5 items-center">
                                    <Wifi size={15} className="text-white -translate-y-[1px]" />
                                    {/* Custom Battery Icon - Full Filled */}
                                    <div className="w-[16px] h-[11px] border-[1.5px] border-white/40 rounded-[3px] p-[1.5px] relative flex items-center">
                                        <div className="w-full h-full bg-white rounded-[1px]"></div>
                                        <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-[4px] bg-white/40 rounded-r-[1px]"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Header */}
                            <div className="h-12 border-b border-white/5 flex items-center px-4 gap-3 bg-[#1a1a1a]/50 backdrop-blur-md">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-500"></div>
                                <div className="flex flex-col">
                                    <div className="w-20 h-2 bg-white/20 rounded-full mb-1"></div>
                                    <div className="w-12 h-1.5 bg-white/10 rounded-full"></div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 p-4 space-y-4 overflow-hidden relative">
                                {/* Received */}
                                <div className="flex items-end gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-700 shrink-0"></div>
                                    <div className="bg-[#262626] rounded-2xl rounded-bl-none px-4 py-2.5 max-w-[85%]">
                                        <div className="h-2 w-32 bg-white/20 rounded-full mb-2"></div>
                                        <div className="h-2 w-24 bg-white/10 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Sent */}
                                <div className="flex items-end gap-2 flex-row-reverse">
                                    <div className="bg-red-600 rounded-2xl rounded-br-none px-4 py-2.5 max-w-[85%]">
                                        <div className="h-2 w-28 bg-white/50 rounded-full mb-2"></div>
                                        <div className="h-2 w-16 bg-white/30 rounded-full"></div>
                                    </div>
                                </div>

                                 {/* Received */}
                                <div className="flex items-end gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-700 shrink-0"></div>
                                    <div className="bg-[#262626] rounded-2xl rounded-bl-none px-4 py-2.5 max-w-[85%]">
                                        <div className="h-2 w-40 bg-white/20 rounded-full mb-2"></div>
                                        <div className="h-2 w-20 bg-white/10 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>

                        {/* Upload Icon - Floating in center */}
                        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-bounce-slow border-4 border-[#111]">
                                <Upload className="w-10 h-10 text-white" strokeWidth={2.5} />
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl animate-float" style={{ animationDelay: '1s' }}>
                           <ImageIcon className="text-red-400 w-6 h-6" />
                        </div>

                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Step 02 */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 group">
          {/* Visual - Left on Desktop */}
          <div className="flex-1 w-full flex justify-center lg:justify-end order-2 lg:order-1">
             <div className="relative w-full max-w-sm aspect-square lg:aspect-[4/3]">
                <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="w-full h-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-1 overflow-hidden relative shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] group-hover:border-blue-500/30">
                   <div className="w-full h-full bg-[#111] rounded-[20px] border border-white/5 flex flex-col relative overflow-hidden p-8">
                      
                      {/* Chat Mockup */}
                      <div className="space-y-4 opacity-50 blur-[1px] transition-all duration-500 group-hover:blur-0 group-hover:opacity-100">
                          <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                              <div className="bg-gray-800 rounded-2xl rounded-tl-none p-3 w-2/3 h-12"></div>
                          </div>
                          <div className="flex gap-3 flex-row-reverse">
                              <div className="bg-gray-800 rounded-2xl rounded-tr-none p-3 w-1/2 h-10"></div>
                          </div>
                          <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                              <div className="bg-gray-800 rounded-2xl rounded-tl-none p-3 w-3/4 h-16"></div>
                          </div>
                      </div>


                      {/* Scanning Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent h-1/3 w-full animate-scan pointer-events-none border-t border-b border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]"></div>

                      {/* Floating AI Badge */}
                      <div className="absolute bottom-6 right-6 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 backdrop-blur-md shadow-lg">
                          <ScanLine size={14} className="animate-spin-slow" />
                          Analisando Contexto
                      </div>

                   </div>
                </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 relative order-1 lg:order-2 text-left">
             <div className="absolute -top-16 -left-10 text-9xl font-black text-white/5 select-none -z-10 transition-colors group-hover:text-white/[0.07]">02</div>
             <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">IA Analisa</h3>
             <p className="text-gray-400 leading-relaxed text-lg lg:pr-12">
               Nossa inteligência artificial lê o contexto, entende a dinâmica da conversa, detecta sarcasmo, interesse e identifica as melhores oportunidades.
             </p>
          </div>
        </div>

        {/* Step 03 */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 group">
          {/* Text */}
          <div className="flex-1 relative lg:text-right">
            <div className="absolute -top-16 -left-10 lg:left-auto lg:-right-10 text-9xl font-black text-white/5 select-none -z-10 transition-colors group-hover:text-white/[0.07]">03</div>
            <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-rose-400 transition-colors">Receba a Resposta</h3>
            <p className="text-gray-400 leading-relaxed text-lg lg:pl-12">
              Receba 5 opções de resposta com tons diferentes (engraçado, direto, misterioso). Escolha a perfeita, copie e envie.
            </p>
          </div>

          {/* Visual */}
          <div className="flex-1 w-full flex justify-center lg:justify-start">
            <div className="relative w-full max-w-sm aspect-square">
                <div className="absolute inset-0 bg-rose-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="w-full h-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-1 overflow-hidden relative shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] group-hover:border-rose-500/30">
                     <div className="w-full h-full bg-[#111] rounded-[20px] flex flex-col items-center justify-center p-8 relative">
                        
                        {/* Message Bubble */}
                        <div key={suggestionIndex} className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 w-full relative animate-fade-in shadow-xl">
                            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${SUGGESTIONS_DEMO[suggestionIndex].color.replace('text-', 'bg-').replace('-400', '-500')}`}></span>
                                    <span className="text-xs font-semibold text-gray-300 uppercase">Sugestão do Puxe Assunto</span>
                                </div>
                                <Check size={14} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-white font-medium leading-relaxed min-h-[80px]">
                                "{SUGGESTIONS_DEMO[suggestionIndex].text}"
                            </p>
                            
                            {/* Copy Button Fake */}
                            <div className="mt-4 flex justify-end">
                                <div className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] text-gray-400 font-medium hover:bg-rose-600 hover:text-white transition-colors cursor-default">
                                    Copiar Resposta
                                </div>
                            </div>
                        </div>

                        {/* Tone Badges */}
                        <div className="flex justify-center mt-6">
                            <span 
                                className={`px-3 py-1 rounded-full text-xs transition-all duration-500 border ${SUGGESTIONS_DEMO[suggestionIndex].bg} ${SUGGESTIONS_DEMO[suggestionIndex].border} ${SUGGESTIONS_DEMO[suggestionIndex].color} font-bold shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                            >
                                {SUGGESTIONS_DEMO[suggestionIndex].tone}
                            </span>
                        </div>

                        {/* Floating Mini Heart Cards */}
                        <div className="absolute bottom-24 left-6 bg-[#1a1a1a] border border-red-500/30 p-2 rounded-lg shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
                            <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
                        </div>
                     </div>
                </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .stroke-dasharray-390 { stroke-dasharray: 390; }
        .stroke-dashoffset-100 { stroke-dashoffset: 100; }
        
        @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(400%); }
        }
        .animate-scan {
            animation: scan 3s linear infinite;
        }
        
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
};