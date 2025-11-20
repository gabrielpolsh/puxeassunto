import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';

interface HeroProps {
  onAction: () => void;
  user: any;
}

// Scenarios for the dynamic chat animation
const SCENARIOS = [
  {
    name: "Crush ❤️",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
    messages: [
      { text: "Vi que você foi no show ontem...", isMe: false },
      { text: "Estava bom?", isMe: false }
    ],
    suggestion: "Nossa, nem me fale! A energia estava incrível. Você curte essa banda também?",
    color: "text-green-400"
  },
  {
    name: "Match Tinder 🔥",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
    messages: [
      { text: "Deu match! 😉", isMe: false },
      { text: "Adorei suas fotos!", isMe: false }
    ],
    suggestion: "Obrigado! 😉 O sorriso é de fábrica, mas o fotógrafo ajudou. E você, o que faz por aqui?",
    color: "text-pink-400"
  },
  {
    name: "Ex 😬",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces",
    messages: [
      { text: "Vi seu story...", isMe: false },
      { text: "E aí, sumido...", isMe: false }
    ],
    suggestion: "Oi! Tudo correndo bem por aqui. Espero que esteja tudo bem contigo também.",
    color: "text-blue-400"
  }
];

export const Hero: React.FC<HeroProps> = ({ onAction, user }) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [step, setStep] = useState(0); // 0: Context, 1: Typing, 2: Suggestion

  // Chat Scenario Loop
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (step === 0) {
      // Show context messages for 2s, then start typing
      timeout = setTimeout(() => setStep(1), 2000);
    } else if (step === 1) {
      // Typing animation for 1.5s, then show suggestion
      timeout = setTimeout(() => setStep(2), 1500);
    } else if (step === 2) {
      // Show suggestion for 5s, then next scenario
      timeout = setTimeout(() => {
        setStep(0);
        setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [step, scenarioIndex]);

  const currentScenario = SCENARIOS[scenarioIndex];

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-y-0 lg:gap-x-20 items-center">

        {/* 1. Title Block (Badge + H1) */}
        <div className="lg:col-span-7 text-center lg:text-left z-10 lg:self-end">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium text-gray-300">Nunca mais fique sem assunto</span>
          </div>

          <div className="min-h-[120px] md:min-h-[160px] lg:min-h-[180px] flex flex-col justify-center lg:block">
            <h1 className="text-[2.3rem] md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6">
              Não sabe o que
              <br />
              <span className="text-5xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-500">
                responder?
              </span>
            </h1>
          </div>
        </div>

        {/* 2. Chat Visualization */}
        <div className="w-full mt-5 lg:col-span-5 flex justify-center relative lg:translate-x-0 perspective-1000 lg:row-span-2 z-20">

          {/* Floating Container */}
          <div className="relative w-full max-w-[400px] animate-float">

            {/* Contact Badge - Floating above */}
            <div className="absolute -top-10 left-0 right-0 flex justify-center z-20 transition-all duration-500 transform">
              <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 pl-2 pr-5 py-2 rounded-full flex items-center gap-3 shadow-2xl shadow-purple-500/10">
                <div className="relative">
                  <img src={currentScenario.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-black" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1a1a1a] rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">{currentScenario.name}</span>
                  <span className={`text-[10px] font-medium uppercase tracking-wider ${currentScenario.color}`}>Online</span>
                </div>
              </div>
            </div>

            {/* Messages Area - Minimal & Glass */}
            <div className="flex flex-col gap-2 mt-2 perspective-1000 min-h-[320px] justify-center">

              {/* Context Messages */}
              <div className="flex flex-col gap-3 transition-all duration-500">
                {currentScenario.messages.map((msg, idx) => (
                  <div
                    key={`${scenarioIndex}-${idx}`}
                    className="self-start max-w-[85%] animate-message-in origin-left"
                    style={{ animationDelay: `${idx * 200}ms` }}
                  >
                    <div className="bg-[#111] border border-white/10 text-gray-200 px-5 py-3 rounded-2xl rounded-tl-none shadow-lg backdrop-blur-sm">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interaction Area */}
              <div className="h-24 relative">
                {/* Typing Indicator */}
                {step === 1 && (
                  <div className="absolute right-0 top-0 self-end animate-fade-in">
                    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-white/5 p-4 rounded-2xl rounded-tr-none backdrop-blur-md">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                    <div className="text-right mt-2">
                      <span className="text-xs text-purple-400/70 font-medium animate-pulse">IA pensando...</span>
                    </div>
                  </div>
                )}

                {/* AI Suggestion Bubble */}
                {step === 2 && (
                  <div className="absolute right-0 top-0 w-full flex flex-col items-end animate-slide-up">
                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-2 mr-1">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                        <Sparkles size={10} className="text-white" />
                      </div>
                      <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase tracking-widest">Sugestão Puxe Assunto</span>
                    </div>

                    {/* Bubble */}
                    <div className="relative group cursor-pointer transition-transform hover:scale-[1.02]">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl rounded-tr-none blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                      <div className="relative bg-[#0a0a0a] border border-white/10 text-white px-6 py-4 rounded-2xl rounded-tr-none shadow-2xl flex items-start gap-4">
                        <p className="text-sm md:text-base leading-relaxed font-medium">
                          {currentScenario.suggestion}
                        </p>
                        <div className="bg-white/10 p-1.5 rounded-full mt-0.5 hover:bg-white/20 transition-colors">
                          <MessageCircle size={14} className="text-purple-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Glow behind chat */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-purple-600/20 to-pink-600/20 rounded-full blur-[60px] -z-10"></div>
        </div>

        {/* 3. Content Block (Description, Buttons, Social Proof) */}
        <div className="lg:col-span-7 text-center lg:text-left z-10 lg:self-start">
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Chega de vácuo. Envie o print da conversa e deixe nossa Inteligência analisar o contexto para criar respostas irresistíveis em segundos. Acabe com o silêncio constrangedor.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button
              onClick={onAction}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {user ? "Abrir Puxe Assunto" : "Testar Agora"} <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border-2 border-black overflow-hidden">
                  <img src={`https://picsum.photos/seed/${i + 20}/100`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p>Mais de <span className="text-white font-semibold">10.000</span> conversas salvas.</p>
          </div>
        </div>

      </div>

      {/* CSS Animations */}
      <style>{`
        .perspective-1000 {
            perspective: 1000px;
        }
        @keyframes messageIn {
          from { opacity: 0; transform: translateX(-20px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .animate-message-in {
            animation: messageIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-up {
            animation: slideUpFade 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fadeIn 0.8s ease-in-out;
        }
      `}</style>
    </section>
  );
};