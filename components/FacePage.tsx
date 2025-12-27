import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, MessageCircle, Upload, Check, Copy, Zap, Loader2, X, Heart, MessageCircleHeart, Lock, CheckCircle2 } from 'lucide-react';
import { analyzeChatScreenshotFace, Suggestion } from '../services/geminiService';
import { Footer } from './Footer';
import { HowItWorks } from './HowItWorks';
import { Testimonials } from './Testimonials';
import { FAQ } from './FAQ';
import { metaService } from '../services/metaService';

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

// --- Components ---

const ChatAnimation: React.FC = () => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (step === 0) timeout = setTimeout(() => setStep(1), 2000);
    else if (step === 1) timeout = setTimeout(() => setStep(2), 1500);
    else if (step === 2) timeout = setTimeout(() => {
      setStep(0);
      setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [step, scenarioIndex]);

  const currentScenario = SCENARIOS[scenarioIndex];

  return (
    <div className="relative w-full max-w-[380px] lg:max-w-[420px] mx-auto lg:mx-0 origin-top">
      {/* Floating Container */}
      <div className="relative w-full animate-float">
        {/* Contact Badge */}
        <div className="absolute -top-10 left-0 right-0 flex justify-center z-20">
          <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 pl-2 pr-4 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
            <img src={currentScenario.avatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-black" />
            <span className="text-white font-bold text-xs">{currentScenario.name}</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex flex-col gap-2 mt-20 min-h-[180px] justify-center">
          {/* Context Messages */}
          <div className="flex flex-col gap-2">
            {currentScenario.messages.map((msg, idx) => (
              <div key={`${scenarioIndex}-${idx}`} className="self-start max-w-[85%] animate-message-in origin-left" style={{ animationDelay: `${idx * 200}ms` }}>
                <div className="bg-[#111] border border-white/10 text-gray-200 px-3 py-2 rounded-xl rounded-tl-none shadow-lg backdrop-blur-sm">
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Interaction Area */}
          <div className="h-16 relative mt-2">
            {step === 1 && (
              <div className="absolute right-0 top-0 self-end animate-fade-in">
                <div className="bg-white/5 border border-white/5 p-2 rounded-xl rounded-tr-none">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="absolute right-0 top-0 w-full flex flex-col items-end animate-slide-up">
                <div className="relative bg-[#0a0a0a] border border-white/10 text-white px-4 py-3 rounded-xl rounded-tr-none shadow-xl flex items-start gap-3">
                  <p className="text-xs leading-relaxed font-medium">{currentScenario.suggestion}</p>
                  <MessageCircle size={12} className="text-purple-400 shrink-0 mt-0.5" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const UploadWidget: React.FC<{ onUpload: () => void, isDragging: boolean }> = ({ onUpload, isDragging }) => (
  <div
    onClick={onUpload}
    className={`
      relative w-[85%] md:w-full max-w-[400px] aspect-[3/4] mx-auto
      flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group
    `}
  >
    {/* Main Card */}
    <div className={`
      relative bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 text-center shadow-2xl z-20
      w-full h-full flex flex-col items-center justify-center
      transform transition-all duration-300 group-hover:scale-[1.02] group-hover:border-purple-500/30 group-hover:shadow-purple-900/20
      ${isDragging ? 'border-purple-500 bg-purple-900/20 scale-105' : ''}
    `}>

      {/* Floating Badge */}
      <div className="absolute -top-4 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1.5 rounded-full shadow-lg shadow-purple-500/30">
        <span className="text-xs font-bold text-white uppercase tracking-wider">Teste Grátis</span>
      </div>

      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse"></div>
        <div className="relative w-full h-full bg-[#111] border border-white/10 rounded-full flex items-center justify-center shadow-xl group-hover:-translate-y-1 transition-transform duration-300">
          <Upload size={32} className="text-white group-hover:text-purple-200 transition-colors" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
        Analise sua conversa
      </h3>
      <p className="text-sm text-gray-400 max-w-[240px] mx-auto mb-8 leading-relaxed">
        Arraste o print ou clique para enviar. A IA vai criar a resposta perfeita.
      </p>

      <div className="flex flex-wrap justify-center gap-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
        <span className="bg-white/5 px-3 py-1 rounded-full border border-white/5">WhatsApp</span>
        <span className="bg-white/5 px-3 py-1 rounded-full border border-white/5">Tinder</span>
        <span className="bg-white/5 px-3 py-1 rounded-full border border-white/5">Insta</span>
      </div>
    </div>

    {/* Decorative Elements in front */}
    <div className="absolute -right-4 top-20 animate-float z-30" style={{ animationDelay: '1s' }}>
      <div className="bg-[#1a1a1a] border border-white/10 p-3 rounded-2xl shadow-xl rotate-12">
        <MessageCircle size={20} className="text-purple-400" />
      </div>
    </div>
    <div className="absolute -left-4 bottom-20 animate-float z-30" style={{ animationDelay: '2s' }}>
      <div className="bg-[#1a1a1a] border border-white/10 p-3 rounded-2xl shadow-xl -rotate-12">
        <Heart size={20} className="text-pink-400" />
      </div>
    </div>
  </div>
);

const FaceResultCard: React.FC<{ suggestion: Suggestion, index: number, isLocked?: boolean, onUnlock?: () => void }> = ({ suggestion, index, isLocked = false, onUnlock }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(suggestion.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic border color based on tone
  const getToneStyle = (tone: string) => {
    const t = tone.toLowerCase();
    if (t.includes('engraçado') || t.includes('divertido')) return 'border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.05)]';
    if (t.includes('romântico') || t.includes('sedutor') || t.includes('ousado')) return 'border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.05)]';
    if (t.includes('direto') || t.includes('sério')) return 'border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.05)]';
    return 'border-white/10';
  };

  return (
    <div
      className={`bg-[#111] border rounded-xl p-3 relative group transition-all duration-300 ${isLocked ? 'border-white/5' : `${getToneStyle(suggestion.tone)} hover:bg-[#161616]`}`}
    >
      {/* Tone Badge */}
      <div className={`absolute -top-2 left-3 px-2 py-0.5 bg-[#0a0a0a] border border-white/10 rounded-full text-[8px] font-bold text-gray-300 uppercase tracking-wider shadow-sm z-10 ${isLocked ? 'opacity-70' : ''}`}>
        {suggestion.tone}
      </div>

      {/* Lock Icon */}
      {isLocked && (
        <div className="absolute -top-2 right-3 px-2 py-0.5 bg-purple-600/20 border border-purple-500/30 rounded-full z-10">
          <Lock size={8} className="text-purple-400" />
        </div>
      )}

      {/* Content */}
      <div className="mt-2 mb-2 relative">
        {isLocked ? (
          <p className="text-xs md:text-sm text-white leading-relaxed font-medium">
            "{suggestion.message.split(' ').slice(0, 4).join(' ')} <span className="blur-sm select-none opacity-50">{suggestion.message.split(' ').slice(4).join(' ')}</span>
          </p>
        ) : (
          <p className="text-xs md:text-sm text-white leading-relaxed font-medium selection:bg-purple-500/40">
            "{suggestion.message}"
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
        <div className="flex items-start gap-1.5 flex-1 mr-2">
          <Zap size={10} className="text-purple-400 flex-shrink-0 mt-[2px]" />
          <span className="text-[9px] text-gray-500 leading-tight">{suggestion.explanation}</span>
        </div>

        {isLocked ? (
          <button
            onClick={onUnlock}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
          >
            <Lock size={10} />
            Desbloquear
          </button>
        ) : (
          <button
            onClick={copyToClipboard}
            className={`
              flex items-center gap-1 px-1.5 py-1 rounded-md text-[10px] font-medium transition-all
              ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400 active:bg-white/10 hover:bg-white/10 hover:text-white'}
            `}
          >
            {copied ? <Check size={10} /> : <Copy size={10} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        )}
      </div>
    </div>
  );
};

// Pricing Section Component
const PricingSection: React.FC<{ onCheckout: () => void }> = ({ onCheckout }) => (
  <div className="py-20 px-4" id="pricing">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-6 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-xs font-bold text-red-300 uppercase tracking-wider">🔥 Oferta por tempo limitado</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          Chega de levar <span className="text-purple-400">vácuo</span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          Enquanto você hesita, seu crush está respondendo outra pessoa. 
          <span className="text-white font-medium"> Não deixe isso acontecer.</span>
        </p>
      </div>

      {/* Single PRO Card */}
      <div className="max-w-md mx-auto">
        <div className="relative bg-[#0f0f0f] border border-purple-500/30 rounded-3xl p-8 flex flex-col shadow-2xl shadow-purple-900/20 overflow-hidden group">
          {/* Gradient Glow */}
          <div className="absolute -top-[100px] -right-[100px] w-[200px] h-[200px] bg-purple-600/20 blur-[80px] group-hover:bg-purple-600/30 transition-all"></div>

          <div className="mb-4 relative">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent shrink-0">
                PRO ILIMITADO
              </h3>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500 line-through mb-1">De R$ 29,90/mês</span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-extrabold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  R$ 15
                </span>
                <span className="text-xl font-bold text-purple-400">,00</span>
                <span className="text-sm text-gray-400">/mês</span>
              </div>
            </div>

            <p className="text-sm text-green-400 font-bold flex items-center gap-1 mb-2">
              <Sparkles size={14} />
              50% OFF - Economize R$ 14,90 todo mês!
            </p>
            <p className="text-xs text-gray-500">
              Menos de R$ 0,50 por dia para nunca mais ficar sem resposta
            </p>
          </div>

          <ul className="space-y-3 mb-8 flex-1 relative">
            <li className="flex items-start gap-3 text-gray-200">
              <Check size={20} className="text-purple-400 mt-0.5 shrink-0" />
              <span className="text-sm"><strong>Análises ILIMITADAS</strong> - use quantas vezes quiser</span>
            </li>
            <li className="flex items-start gap-3 text-gray-200">
              <Check size={20} className="text-purple-400 mt-0.5 shrink-0" />
              <span className="text-sm"><strong>11 respostas</strong> por análise (vs 1 do grátis)</span>
            </li>
            <li className="flex items-start gap-3 text-gray-200">
              <Check size={20} className="text-purple-400 mt-0.5 shrink-0" />
              <span className="text-sm"><strong>Premium</strong> - respostas mais criativas e certeiras</span>
            </li>
            <li className="flex items-start gap-3 text-gray-200">
              <Check size={20} className="text-purple-400 mt-0.5 shrink-0" />
              <span className="text-sm"><strong>Cantadas personalizadas</strong> ilimitadas</span>
            </li>
            <li className="flex items-start gap-3 text-gray-200">
              <Check size={20} className="text-purple-400 mt-0.5 shrink-0" />
              <span className="text-sm">Cancele quando quiser, sem burocracia</span>
            </li>
          </ul>

          <button
            onClick={onCheckout}
            className="relative w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/40 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group-hover:shadow-purple-500/25 text-lg"
          >
            <MessageCircleHeart size={20} className="fill-white/20" />
            Quero Ser PRO Agora
          </button>
          
          <p className="mt-4 text-center text-xs text-gray-500">
            🔒 Pagamento 100% seguro • Pix ou Cartão • Acesso imediato
          </p>

          {/* Urgency */}
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-yellow-400 font-medium">
              ⚡ 127 pessoas ativaram o PRO nas últimas 24h
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Simple Header without login
const SimpleHeader: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
    <div className="container mx-auto px-4 md:px-8 max-w-7xl">
      <div className="flex items-center justify-center h-16">
        <a href="/face" className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <MessageCircle size={16} className="text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
          </div>
          <span className="text-lg md:text-xl font-bold text-white tracking-tight">
            Puxe<span className="text-purple-400">Assunto</span>
          </span>
        </a>
      </div>
    </div>
  </header>
);

export const FacePage: React.FC = () => {
  const [guestImage, setGuestImage] = useState<string | null>(null);
  const [guestResults, setGuestResults] = useState<Suggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasUsedGuest, setHasUsedGuest] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showLimitReached, setShowLimitReached] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Track PageView
    metaService.trackEvent({ eventName: 'PageView' });
    metaService.trackEvent({
      eventName: 'ViewContent',
      contentName: 'Face Landing Page',
    });

    // Check if user already used their free analysis
    if (localStorage.getItem('puxe_assunto_face_used')) {
      setHasUsedGuest(true);
    }
  }, []);

  const handleCheckout = () => {
    metaService.trackEvent({
      eventName: 'InitiateCheckout',
      contentName: 'Plano PRO Ilimitado - Face',
      value: 15.90,
      currency: 'BRL',
      contentType: 'product'
    });
    
    // Kirvano Checkout Link
    const checkoutUrl = 'https://pay.kirvano.com/6ba6e6eb-5862-457f-8021-2c2e81ae75f6';
    window.open(checkoutUrl, '_blank');
  };

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const processFile = (file: File) => {
    // If they already used their free analysis
    if (hasUsedGuest) {
      setShowLimitReached(true);
      scrollToPricing();
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const img = ev.target?.result as string;
      setGuestImage(img);
      setIsAnalyzing(true);

      try {
        const { suggestions } = await analyzeChatScreenshotFace(img);
        setGuestResults(suggestions);
        localStorage.setItem('puxe_assunto_face_used', 'true');
        setHasUsedGuest(true);
      } catch (err) {
        console.error(err);
        alert("Erro ao analisar. Tente novamente.");
        setGuestImage(null);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGuestUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleCtaClick = () => {
    if (hasUsedGuest && guestResults.length === 0) {
      setShowLimitReached(true);
      scrollToPricing();
    } else {
      fileInputRef.current?.click();
    }
  };

  const resetGuest = () => {
    setGuestImage(null);
    setGuestResults([]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 selection:text-purple-200 font-sans overflow-x-hidden relative">
      {/* Global Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10">
        <SimpleHeader />

        <main className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Hero Section */}
          <section className="relative pt-24 pb-20 md:pt-48 md:pb-32">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleGuestUpload}
            />

            {/* Grid Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-y-0 lg:gap-x-20 items-center">

              {/* 1. Title Block (Badge + H1) */}
              <div className="lg:col-span-7 text-center lg:text-left z-10 lg:self-center">
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

                <p className="text-sm md:text-base text-gray-400 mt-0 mb-0 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Chega de vácuo. Envie o print da conversa e deixe nossa Inteligência analisar o contexto.
                </p>

                {/* Desktop: Chat Animation visible here */}
                <div className="hidden lg:block mt-12">
                  <ChatAnimation />
                </div>
              </div>

              {/* 2. Upload / Chat Visualization */}
              <div
                className="w-full mt-5 lg:col-span-5 flex justify-center relative lg:translate-x-0 lg:row-span-2 z-20"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >

                {/* State 1: Upload Widget + Text + Animation */}
                {!guestImage && !isAnalyzing && !showLimitReached && (
                  <div className="animate-fade-in w-full flex flex-col items-center">
                    <UploadWidget onUpload={handleCtaClick} isDragging={isDragging} />

                    <div className="lg:hidden w-full flex justify-center">
                      <ChatAnimation />
                    </div>
                  </div>
                )}

                {/* State 2: Results / Analysis (Phone UI) */}
                {(guestImage || isAnalyzing) && !showLimitReached && (
                  <div className="relative w-full max-w-[400px] aspect-[2/3] bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-fade-in">
                    <div className="absolute top-4 right-4 z-10">
                      <button onClick={resetGuest} className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors border border-white/10">
                        <X size={14} />
                      </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0a0a0a]">

                      {/* User Image Message */}
                      {guestImage && (
                        <div className="flex justify-end animate-fade-in">
                          <div className="max-w-[85%] bg-[#1a1a1a] border border-white/10 p-2 rounded-2xl rounded-tr-none">
                            <img src={guestImage} alt="Upload" className="rounded-xl w-full object-cover max-h-36" />
                          </div>
                        </div>
                      )}

                      {/* AI Analyzing */}
                      {isAnalyzing && (
                        <div className="flex justify-start animate-fade-in">
                          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                            <Loader2 className="animate-spin text-purple-400" size={18} />
                            <span className="text-xs text-purple-200 font-medium animate-pulse">Analisando conversa...</span>
                          </div>
                        </div>
                      )}

                      {/* Results - First one unlocked, rest locked */}
                      {!isAnalyzing && guestResults.map((res, idx) => (
                        <div key={idx} className="flex justify-start animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                          <div className="max-w-[95%]">
                            <FaceResultCard 
                              suggestion={res} 
                              index={idx} 
                              isLocked={idx > 0} // First one (idx 0) is unlocked
                              onUnlock={scrollToPricing}
                            />
                          </div>
                        </div>
                      ))}

                      {/* CTA after results */}
                      {!isAnalyzing && guestResults.length > 0 && (
                        <div className="flex justify-center pt-4 pb-2 animate-fade-in" style={{ animationDelay: '1200ms' }}>
                          <button
                            onClick={scrollToPricing}
                            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 group shadow-lg"
                          >
                            <Lock size={14} className="group-hover:scale-110 transition-transform" />
                            <span>Desbloquear Todas ({guestResults.length - 1} respostas)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* State 3: Limit Reached - Show Upsell */}
                {showLimitReached && (
                  <div className="relative w-full max-w-[400px] aspect-[3/4] mx-auto animate-slide-up">
                    <div className="relative bg-[#111] border border-white/10 p-8 rounded-[2.5rem] w-full h-full flex flex-col items-center justify-center text-center shadow-2xl">

                      {/* Close Button */}
                      <div className="absolute top-4 right-4 z-10">
                        <button onClick={() => setShowLimitReached(false)} className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors border border-white/10">
                          <X size={14} />
                        </button>
                      </div>

                      <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20 animate-pulse">
                        <MessageCircleHeart size={32} className="text-white" />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">Não deixe a conversa morrer! 😰</h3>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed max-w-[260px]">
                        Você já usou seu teste grátis. Desbloqueie agora e <span className="text-white font-medium">nunca mais fique sem resposta!</span>
                      </p>

                      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-2xl p-4 mb-4 w-full">
                        <div className="flex items-baseline justify-center gap-2 mb-1">
                          <span className="text-sm text-gray-500 line-through">R$ 29,90</span>
                          <span className="text-3xl font-extrabold text-white">R$ 15</span>
                          <span className="text-purple-400 font-bold">,00</span>
                          <span className="text-xs text-gray-400">/mês</span>
                        </div>
                        <p className="text-xs text-green-400 font-bold flex items-center justify-center gap-1">
                          <Sparkles size={12} />
                          50% OFF - Menos de R$ 0,50/dia
                        </p>
                      </div>

                      <ul className="text-left space-y-2 mb-4 w-full max-w-[260px]">
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                          <div className="p-1 bg-green-500/10 rounded-full"><Check size={12} className="text-green-400" /></div>
                          Análises <strong>ilimitadas</strong>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                          <div className="p-1 bg-green-500/10 rounded-full"><Check size={12} className="text-green-400" /></div>
                          11 respostas por análise
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                          <div className="p-1 bg-green-500/10 rounded-full"><Check size={12} className="text-green-400" /></div>
                          Cancele quando quiser
                        </li>
                      </ul>

                      <button
                        onClick={handleCheckout}
                        className="w-full max-w-[260px] py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg text-sm"
                      >
                        <MessageCircleHeart size={18} />
                        Quero Conquistar Mais
                      </button>
                      
                      <p className="mt-3 text-[10px] text-gray-500">
                        🔒 Pagamento seguro • Acesso imediato
                      </p>
                    </div>
                  </div>
                )}

                {/* Glow behind */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-purple-600/20 to-pink-600/20 rounded-full blur-[60px] -z-10"></div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <HowItWorks />

          {/* Testimonials Section */}
          <Testimonials />

          {/* Pricing Section - After testimonials */}
          <div ref={pricingRef}>
            <PricingSection onCheckout={handleCheckout} />
          </div>

          {/* FAQ Section */}
          <FAQ />
        </main>

        <Footer />
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
