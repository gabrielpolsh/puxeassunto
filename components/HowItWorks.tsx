import React from 'react';
import { Upload, ScanLine, MessageCircle, Check, ArrowUp } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="como-funciona" className="pb-32 relative">
      {/* Connecting Line Background */}
      <div className="absolute top-40 bottom-40 left-1/2 w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent -translate-x-1/2 hidden lg:block"></div>

      <div className="text-center mb-24 relative z-10">
        <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
           <span className="text-sm font-medium text-purple-400">Simples e Rápido</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          Do print à resposta <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">em segundos</span>
        </h2>
      </div>

      <div className="flex flex-col gap-32 lg:gap-40 relative z-10">
        
        {/* Step 01 */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 group">
          {/* Text */}
          <div className="flex-1 relative lg:text-right">
            <div className="absolute -top-16 -left-10 lg:left-auto lg:-right-10 text-9xl font-black text-white/5 select-none -z-10 transition-colors group-hover:text-white/[0.07]">01</div>
            <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">Mande o Print</h3>
            <p className="text-gray-400 leading-relaxed text-lg lg:pl-12">
              Tire um print daquela conversa onde você travou. Pode ser do WhatsApp, Tinder, Instagram ou qualquer outro app. Basta fazer o upload.
            </p>
          </div>

          {/* Visual */}
          <div className="flex-1 w-full flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md aspect-square lg:aspect-[4/3]">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Card */}
                <div className="w-full h-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-1 overflow-hidden relative shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] group-hover:border-purple-500/30">
                    <div className="w-full h-full bg-[#111] rounded-[20px] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Grid Pattern */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        
                        {/* Floating Upload Icon */}
                        <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 animate-float relative z-10">
                            <Upload className="w-10 h-10 text-white" />
                            {/* Upload Progress Ring (Fake) */}
                            <svg className="absolute -inset-4 w-[128px] h-[128px] rotate-[-90deg]">
                                <circle cx="64" cy="64" r="62" stroke="currentColor" strokeWidth="2" fill="none" className="text-white/10" />
                                <circle cx="64" cy="64" r="62" stroke="currentColor" strokeWidth="2" fill="none" className="text-purple-500 stroke-dasharray-390 stroke-dashoffset-100 animate-pulse-slow" strokeLinecap="round" />
                            </svg>
                        </div>
                        
                        {/* Floating Elements */}
                        <div className="absolute top-10 left-10 w-12 h-16 bg-white/5 border border-white/10 rounded-lg animate-float" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute bottom-12 right-12 w-16 h-12 bg-white/5 border border-white/10 rounded-lg animate-float" style={{ animationDelay: '2s' }}></div>
                        
                        <div className="mt-12 text-sm font-medium text-gray-500 animate-pulse">Aguardando arquivo...</div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Step 02 */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 group">
          {/* Visual - Left on Desktop */}
          <div className="flex-1 w-full flex justify-center lg:justify-end order-2 lg:order-1">
             <div className="relative w-full max-w-md aspect-square lg:aspect-[4/3]">
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
            <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-pink-400 transition-colors">Receba a Resposta</h3>
            <p className="text-gray-400 leading-relaxed text-lg lg:pl-12">
              Receba 3 opções de resposta com tons diferentes (engraçado, direto, misterioso). Escolha a perfeita, copie e envie.
            </p>
          </div>

          {/* Visual */}
          <div className="flex-1 w-full flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md aspect-square lg:aspect-[4/3]">
                <div className="absolute inset-0 bg-pink-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="w-full h-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-1 overflow-hidden relative shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] group-hover:border-pink-500/30">
                     <div className="w-full h-full bg-[#111] rounded-[20px] border border-white/5 flex flex-col items-center justify-center p-6 relative">
                        
                        {/* Message Bubble */}
                        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-xs relative group-hover:-translate-y-2 transition-transform duration-500">
                            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                                    <span className="text-xs font-semibold text-gray-300 uppercase">Sugestão IA</span>
                                </div>
                                <Check size={14} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-white font-medium leading-relaxed">
                                "Adorei a sugestão! Vamos marcar algo para testar essa teoria pessoalmente? 😉"
                            </p>
                            
                            {/* Copy Button Fake */}
                            <div className="mt-4 flex justify-end">
                                <div className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] text-gray-400 font-medium hover:bg-pink-600 hover:text-white transition-colors cursor-default">
                                    Copiar Resposta
                                </div>
                            </div>
                        </div>

                        {/* Tone Badges */}
                        <div className="flex gap-2 mt-6">
                            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs opacity-50 scale-90">Romântico</span>
                            <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-400 text-xs font-bold shadow-[0_0_10px_rgba(236,72,153,0.3)] scale-110">Ousado</span>
                            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs opacity-50 scale-90">Engraçado</span>
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