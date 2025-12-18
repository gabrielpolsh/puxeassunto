import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, MessageCircle, Upload, Check, Copy, Zap, Loader2, X, Heart, MessageCircleHeart } from 'lucide-react';
import { analyzeChatScreenshot, Suggestion } from '../services/geminiService';

interface HeroProps {
  onAction: () => void;
  user: any;
}



// Scenarios for the dynamic chat animation
const SCENARIOS = [
  {
    name: "Beatriz",
    avatar: "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=150&h=150&fit=crop&crop=faces",
    messages: [
      { text: "Tô muito puta com você.", isMe: false },
      { text: "Sério.", isMe: false }
    ],
    wrong: "Que exagero.",
    suggestion: "Meu bem, eu sei que você tá muito irritada. O que eu fiz agora pra te deixar assim?",
    color: "text-red-400"
  },
  {
    name: "Ficante com Tesão 🔥",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces",
    messages: [
      { text: "Não consigo parar de pensar em ontem.", isMe: false },
      { text: "Tô com muito tesão.", isMe: false }
    ],
    wrong: "👀😏",
    suggestion: "Então não sou só eu… ontem não saiu da minha cabeça também.",
    color: "text-pink-500"
  },
  {
    name: "Bianca",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
    messages: [
      { text: "Não começa.", isMe: false },
      { text: "Eu não tô no clima.", isMe: false }
    ],
    wrong: "Tá bom então.",
    suggestion: "Tudo bem, Bianca. Quando você quiser falar, eu tô aqui, sem briga.",
    color: "text-gray-400"
  },
  {
    name: "Namorada Fria 🧊",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=faces",
    messages: [
      { text: "aham", isMe: false }
    ],
    wrong: "kk",
    suggestion: "Meu bem, você tá estranha comigo. Aconteceu algo ou eu fiz merda?",
    color: "text-amber-400"
  },
  {
    name: "Confusa 🤯",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
    messages: [
      { text: "Eu nem sei o que eu tô sentindo.", isMe: false }
    ],
    wrong: "Relaxa.",
    suggestion: "Júlia, a gente não precisa resolver agora. Quer só falar e eu escuto?",
    color: "text-indigo-400"
  }
];

const TESTIMONIALS_DATA = [
  {
    image: '/depoimentos/depomento1.png',
    text: 'Você nunca mais vai ficar sem saber o que dizer'
  },
  {
    image: '/depoimentos/depomento2.png',
    text: 'Faça a conversa fluir sozinha. 💬'
  },
  {
    image: '/depoimentos/depoimento4.png',
    text: '"Crie assuntos que prendem a atenção. 😏'
  },
  {
    image: '/depoimentos/depomento3.png',
    text: 'Pare de ser ignorado agora mesmo💀'
  },
  {
    image: '/depoimentos/depomento5.png',
    text: 'Crie Respostas que geram curiosidade e desejo😏'
  },
  {
    image: '/depoimentos/depoimento6.png',
    text: 'Nunca mais fique sem assunto 🔥'
  }
];

// --- Components ---

// Typewriter Animation for Hero Title
const TITLE_PHRASES = [
  "Travou no meio da conversa?",
  "Ela visualizou e não respondeu?",
  "Não sabe puxar assunto?",
  "A conversa esfriou?",
  "Ela te respondeu seco?",
  "Quer deixar ela curiosa?",
];

const TypewriterTitle: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TITLE_PHRASES[phraseIndex];
    const typeSpeed = isDeleting ? 40 : 80;
    const pauseTime = 2500;

    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === currentPhrase) {
        // Pause before deleting
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && displayText === '') {
        // Move to next phrase
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % TITLE_PHRASES.length);
      } else {
        // Type or delete character
        setDisplayText(currentPhrase.substring(0, displayText.length + (isDeleting ? -1 : 1)));
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-red-500">
      {displayText}
      <span className="animate-pulse text-rose-400">|</span>
    </span>
  );
};

const ChatAnimation: React.FC = () => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (step === 0) timeout = setTimeout(() => setStep(1), 1800); // Mostra msgs dela
    else if (step === 1) timeout = setTimeout(() => setStep(2), 1500); // Mostra loading
    else if (step === 2) timeout = setTimeout(() => { // Mostra errada + sugestão juntas
      setStep(0);
      setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [step, scenarioIndex]);

  const currentScenario = SCENARIOS[scenarioIndex];

  return (
    <div className="relative w-full max-w-[380px] lg:max-w-[420px] mx-auto origin-top">
      {/* Floating Container */}
      <div className="relative w-full animate-float">
        {/* Contact Badge */}
        <div className="absolute -top-14 left-0 right-0 flex justify-center z-20">
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
                  <p className="text-sm md:text-xs leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Interaction Area */}
          <div className="min-h-[140px] relative mt-2">
            {/* Step 1: Puxe Assunto pensando */}
            {step === 1 && (
              <div className="absolute right-0 top-0 self-end animate-fade-in flex flex-col items-end gap-1">
                <span className="text-[10px] text-gray-400 font-medium italic mr-1">Puxe Assunto pensando...</span>
                <div className="bg-white/5 border border-white/5 p-2 rounded-xl rounded-tr-none">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Mostra resposta errada + sugestão juntas */}
            {step === 2 && (
              <div className="flex flex-col gap-3 animate-slide-up">
                {/* Resposta Errada */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-red-400/70 font-medium mr-1">❌ Você responderia:</span>
                  <div className="bg-red-900/20 border border-red-500/30 text-red-200 px-3 py-2 rounded-xl rounded-tr-none">
                    <p className="text-sm md:text-xs leading-relaxed">{currentScenario.wrong}</p>
                  </div>
                </div>

                {/* Sugestão do Puxe Assunto */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-green-400/70 font-medium mr-1">✨ Responda assim:</span>
                  <div className="relative bg-[#0a0a0a] border border-green-500/30 text-white px-4 py-3 rounded-xl rounded-tr-none shadow-xl flex items-start gap-3">
                    <p className="text-sm md:text-xs leading-relaxed font-medium">{currentScenario.suggestion}</p>
                    <MessageCircle size={12} className="text-green-400 shrink-0 mt-0.5" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TinderCarousel: React.FC<{ onAction?: () => void }> = ({ onAction }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  // Stable underneath index to prevent jumping
  const underneathIndex = (currentIndex + 1) % TESTIMONIALS_DATA.length;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating && dragStart === null) {
        setDirection('left');
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
          setIsAnimating(false);
          setDirection(null);
        }, 400);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [isAnimating, dragStart]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isAnimating) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStart(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStart === null || isAnimating) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragOffset(clientX - dragStart);
  };

  const handleDragEnd = () => {
    if (dragStart === null || isAnimating) return;

    const threshold = 100;
    if (Math.abs(dragOffset) > threshold) {
      // Swipe Left or Right (Both go to Next in a testimonial stack)
      setDirection(dragOffset > 0 ? 'right' : 'left');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
        setIsAnimating(false);
        setDirection(null);
        setDragOffset(0);
      }, 400);
    } else {
      setDragOffset(0);
    }
    setDragStart(null);
  };

  const rotation = dragOffset / 10;
  const opacity = Math.min(Math.abs(dragOffset) / 200, 1);

  return (
    <div className="relative w-full max-w-[340px] md:max-w-[400px] mx-auto select-none">
      {/* Card Stack Effect */}
      <div
        className="relative aspect-square cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* Background card (Visual depth only) */}
        <div className="absolute inset-0 bg-red-600/5 rounded-[2rem] transform rotate-6 scale-[0.92] translate-y-6 border border-red-500/5"></div>

        {/* Next Card (Visible underneath) */}
        <div
          className="absolute inset-0 bg-[#0a0a0a] rounded-[2rem] overflow-hidden shadow-xl border border-white/5"
          style={{
            transform: `scale(${0.96 + (Math.abs(dragOffset) / 2500)}) rotate(${-3 + (dragOffset / 200)}deg) translateY(${4 - (Math.abs(dragOffset) / 100)}px)`,
            opacity: 0.3 + (Math.abs(dragOffset) / 400),
            transition: dragStart !== null ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease'
          }}
        >
          <img
            src={TESTIMONIALS_DATA[underneathIndex].image}
            alt="Próximo depoimento"
            className="w-full h-full object-cover object-[center_15%]"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Main Card */}
        <div
          className={`
            absolute inset-0 bg-[#0a0a0a] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10
            z-10
            ${isAnimating && direction === 'left' ? 'translate-x-[-150%] rotate-[-20deg] opacity-0' : ''}
            ${isAnimating && direction === 'right' ? 'translate-x-[150%] rotate-[20deg] opacity-0' : ''}
            ${!isAnimating ? 'translate-x-0 rotate-0 opacity-100' : ''}
          `}
          style={!isAnimating ? {
            transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
            transition: dragStart !== null ? 'none' : 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          } : {
            transition: 'all 0.4s ease-in'
          }}
        >
          <img
            src={TESTIMONIALS_DATA[currentIndex].image}
            alt={`Depoimento ${currentIndex + 1}`}
            className="w-full h-full object-cover object-[center_15%] pointer-events-none"
          />

          {/* Swipe Indicators (Stamps) */}
          <div
            className="absolute top-8 left-8 border-4 border-red-500 text-red-500 font-black text-3xl px-4 py-1 rounded-xl uppercase tracking-tighter rotate-[-15deg] pointer-events-none transition-opacity"
            style={{ opacity: dragOffset > 20 ? opacity : 0 }}
          >
            NOPE
          </div>
          <div
            className="absolute top-8 right-8 border-4 border-green-500 text-green-500 font-black text-3xl px-4 py-1 rounded-xl uppercase tracking-tighter rotate-[15deg] pointer-events-none transition-opacity"
            style={{ opacity: dragOffset < -20 ? opacity : 0 }}
          >
            LIKE
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

          {/* Info Overlay */}
          <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
            <p className="text-white text-sm font-bold leading-tight drop-shadow-lg mb-1">
              {TESTIMONIALS_DATA[currentIndex].text}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-white/50 text-[10px] uppercase tracking-widest font-medium">Arraste para ver mais</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {TESTIMONIALS_DATA.map((_, idx) => (
          <button
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-red-500 w-8' : 'bg-white/10 w-2'}`}
          />
        ))}
      </div>

      {/* CTA Button */}
      {onAction && (
        <button
          onClick={onAction}
          className="mt-12 w-full bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 group"
        >
          <MessageCircleHeart className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Começar Agora
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
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
      transform transition-all duration-300 group-hover:scale-[1.02] group-hover:border-red-500/30 group-hover:shadow-red-900/20
      ${isDragging ? 'border-red-500 bg-red-900/20 scale-105' : ''}
    `}>

      {/* Floating Badge */}
      <div className="absolute -top-4 bg-gradient-to-r from-red-600 to-rose-600 px-4 py-1.5 rounded-full shadow-lg shadow-red-500/30">
        <span className="text-xs font-bold text-white uppercase tracking-wider">Teste Grátis</span>
      </div>

      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-rose-600 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse"></div>
        <div className="relative w-full h-full bg-[#111] border border-white/10 rounded-full flex items-center justify-center shadow-xl group-hover:-translate-y-1 transition-transform duration-300">
          <Upload size={32} className="text-white group-hover:text-rose-200 transition-colors" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
        Analise sua conversa
      </h3>
      <p className="text-sm text-gray-400 max-w-[240px] mx-auto mb-8 leading-relaxed">
        Arraste o print ou clique para enviar. O Puxe Assunto vai criar a resposta perfeita.
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
        <MessageCircle size={20} className="text-red-400" />
      </div>
    </div>
    <div className="absolute -left-4 bottom-20 animate-float z-30" style={{ animationDelay: '2s' }}>
      <div className="bg-[#1a1a1a] border border-white/10 p-3 rounded-2xl shadow-xl -rotate-12">
        <Heart size={20} className="text-rose-400" />
      </div>
    </div>
  </div>
);

const HeroResultCard: React.FC<{ suggestion: Suggestion, index: number, isLocked?: boolean, onUnlock?: () => void }> = ({ suggestion, index, isLocked = false, onUnlock }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(suggestion.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic border color based on tone
  const getToneStyle = (tone: string) => {
    const t = tone.toLowerCase();
    if (t.includes('engraçado') || t.includes('divertido')) return 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]';
    if (t.includes('romântico') || t.includes('sedutor') || t.includes('ousado')) return 'border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.05)]';
    if (t.includes('direto') || t.includes('sério')) return 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.05)]';
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

      {/* Content */}
      <div className="mt-2 mb-2 relative">
        {isLocked ? (
          <p className="text-xs md:text-sm text-white leading-relaxed font-medium">
            "{suggestion.message.split(' ').slice(0, 6).join(' ')} <span className="blur-sm select-none opacity-50">{suggestion.message.split(' ').slice(6).join(' ')}</span>
          </p>
        ) : (
          <p className="text-xs md:text-sm text-white leading-relaxed font-medium selection:bg-rose-500/40">
            "{suggestion.message}"
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
        <div className="flex items-start gap-1.5 flex-1 mr-2">
          <Zap size={10} className="text-red-400 flex-shrink-0 mt-[2px]" />
          <span className="text-[9px] text-gray-500 leading-tight">{suggestion.explanation}</span>
        </div>

        {isLocked ? (
          <button
            onClick={onUnlock}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white"
          >
            <ArrowRight size={10} />
            Ver
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

export const Hero: React.FC<HeroProps> = ({ onAction, user }) => {
  // --- Guest Logic ---
  const [guestImage, setGuestImage] = useState<string | null>(null);
  const [guestResults, setGuestResults] = useState<Suggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasUsedGuest, setHasUsedGuest] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [upsellType, setUpsellType] = useState<'unlock' | 'limit'>('unlock'); // Track upsell context
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (localStorage.getItem('puxe_assunto_guest_used')) {
      setHasUsedGuest(true);
    }
  }, []);

  const processFile = (file: File) => {
    // If they already used it and are trying again (without results on screen), prompt signup
    if (hasUsedGuest && guestResults.length === 0) {
      setUpsellType('limit'); // Limit reached type
      setShowUpsell(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const img = ev.target?.result as string;
      setGuestImage(img);
      setIsAnalyzing(true);

      try {
        const { suggestions } = await analyzeChatScreenshot(img, undefined, true);
        setGuestResults(suggestions);
        localStorage.setItem('puxe_assunto_guest_used', 'true');
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
    if (user) {
      onAction(); // Open app
    } else if (hasUsedGuest && guestResults.length === 0) {
      setShowUpsell(true); // Prompt signup with upsell
    } else if (guestResults.length > 0) {
      onAction(); // They have results, prompt signup to save/continue
    } else {
      fileInputRef.current?.click(); // Open upload
    }
  };

  const resetGuest = () => {
    setGuestImage(null);
    setGuestResults([]);
    // Do not reset hasUsedGuest
  };

  return (
    <section className="relative pt-24 pb-20 md:pt-48 md:pb-32">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleGuestUpload}
      />

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-y-0 lg:gap-x-20 items-center">

        {/* 1. Title Block (Badge + H1) */}
        <div className="lg:col-span-7 text-center lg:text-left z-10 lg:self-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium text-gray-300">Nunca mais fique sem assunto</span>
          </div>

          <div className="min-h-[120px] md:min-h-[160px] lg:min-h-[180px] flex flex-col justify-center lg:block">
            <h1 className="text-[2.3rem] md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6">
              <TypewriterTitle />
            </h1>
          </div>

          <p className="text-sm md:text-base text-gray-400 mt-0 mb-0 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Chega de ficar no vácuo. Envie o print da conversa e o <span className="text-rose-400 font-medium">Puxe Assunto</span> vai analisar o contexto e criar a resposta perfeita pra qualquer tipo de conversa.
          </p>

          {/* Chat Animation moved here */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-[400px] scale-90 lg:scale-100 origin-center lg:origin-left mx-auto lg:mx-0">
              <ChatAnimation />
            </div>
          </div>
        </div>

        {/* 2. Upload / Chat Visualization */}
        <div
          className="w-full mt-5 lg:col-span-5 flex justify-center relative lg:translate-x-0 lg:row-span-2 z-20"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >

          {/* State 1: Tinder Carousel (Replaces Chat Animation) */}
          {!guestImage && !isAnalyzing && !showUpsell && (
            <div className="animate-fade-in w-full flex flex-col items-center">
              <TinderCarousel onAction={onAction} />
            </div>
          )}

          {/* CARD DE TESTE GRÁTIS COMENTADO - Descomentar se quisermos voltar
          {!guestImage && !isAnalyzing && !showUpsell && (
            <div className="animate-fade-in w-full flex flex-col items-center">
              <UploadWidget onUpload={() => fileInputRef.current?.click()} isDragging={isDragging} />

              <div className="lg:hidden w-full flex justify-center">
                <ChatAnimation />
              </div>
            </div>
          )}
          */}

          {/* State 2: Results / Analysis (Phone UI) */}
          {(guestImage || isAnalyzing) && !showUpsell && (
            <div className="relative w-full max-w-[400px] aspect-[3/4] bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-fade-in">
              {/* Header */}
              {/* Header Removed for Minimalism */}
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
                      <img src={guestImage} alt="Upload" className="rounded-xl w-full object-cover max-h-48" />
                    </div>
                  </div>
                )}

                {/* AI Analyzing */}
                {isAnalyzing && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-gradient-to-br from-red-900/20 to-rose-900/20 border border-red-500/20 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                      <Loader2 className="animate-spin text-red-400" size={18} />
                      <span className="text-xs text-rose-200 font-medium animate-pulse">Analisando conversa...</span>
                    </div>
                  </div>
                )}

                {/* Results */}
                {!isAnalyzing && guestResults.slice(0, 5).map((res, idx) => (
                  <div key={idx} className="flex justify-start animate-slide-up" style={{ animationDelay: `${idx * 150}ms` }}>
                    <div className="max-w-[95%]">
                      <HeroResultCard
                        suggestion={res}
                        index={idx}
                        isLocked={true}
                        onUnlock={() => {
                          setUpsellType('unlock');
                          setShowUpsell(true);
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* CTA after results */}
                {!isAnalyzing && guestResults.length > 0 && (
                  <div className="flex justify-center pt-4 pb-2 animate-fade-in" style={{ animationDelay: '800ms' }}>
                    <button
                      onClick={() => {
                        setUpsellType('unlock');
                        setShowUpsell(true);
                      }}
                      className="px-5 py-2.5 bg-white hover:bg-gray-100 rounded-xl text-xs font-bold text-black transition-all flex items-center gap-2 group shadow-lg"
                    >
                      <MessageCircle size={14} className="group-hover:scale-110 transition-transform" />
                      <span>Ver Todas as Respostas</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Glow behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-red-600/20 to-rose-600/20 rounded-full blur-[60px] -z-10"></div>

          {/* Upsell Modal/Overlay - Fixed to viewport */}
          {/* State 3: Upsell Card (Replaces Upload/Results) */}
          {showUpsell && (
            <div className="relative w-full max-w-[400px] aspect-[3/4] mx-auto animate-slide-up">
              <div className="relative bg-[#111] border border-white/10 p-8 rounded-[2.5rem] w-full h-full flex flex-col items-center justify-center text-center shadow-2xl">

                {/* Close Button */}
                <div className="absolute top-4 right-4 z-10">
                  <button onClick={() => setShowUpsell(false)} className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors border border-white/10">
                    <X size={14} />
                  </button>
                </div>

                <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-red-600 to-rose-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/20 animate-pulse">
                  <MessageCircleHeart size={32} className="text-white" />
                </div>

                {upsellType === 'unlock' ? (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-2">Veja as respostas completas!</h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-[260px]">
                      Crie uma conta gratuita e desbloqueie as respostas + muito mais:
                    </p>

                    <ul className="text-left space-y-3 mb-8 w-full max-w-[260px]">
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="p-1 bg-green-500/10 rounded-full"><Check size={12} className="text-green-400" /></div>
                        Análises gratuitas
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="p-1 bg-green-500/10 rounded-full"><Check size={12} className="text-green-400" /></div>
                        Histórico de conversas
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="p-1 bg-green-500/10 rounded-full"><Check size={12} className="text-green-400" /></div>
                        Tons personalizados exclusivos
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-2">Desbloqueie tudo!</h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-[260px]">
                      Você já usou sua análise gratuita. Crie uma conta para continuar e ter acesso a:
                    </p>

                    <ul className="text-left space-y-3 mb-8 w-full max-w-[260px]">
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="p-1 bg-green-500/10 rounded-full"><Check size={12} className="text-green-400" /></div>
                        Mais análises gratuitas
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="p-1 bg-green-500/10 rounded-full"><Check size={12} className="text-green-400" /></div>
                        Histórico de conversas
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="p-1 bg-green-500/10 rounded-full"><Check size={12} className="text-green-400" /></div>
                        Tons exclusivos
                      </li>
                    </ul>
                  </>
                )}

                <button
                  onClick={onAction}
                  className="w-full max-w-[260px] py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  Criar Conta Grátis <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
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
    </section >
  );
};