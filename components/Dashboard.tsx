import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutGrid,
  LogOut,
  Plus,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  Upload,
  Copy,
  Check,
  Search,
  Wand2,
  Zap,
  Menu,
  X,
  MessageCircleHeart,
  MessageCircle,
  Send,
  Heart,
  Calendar,
  Settings
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { analyzeChatScreenshot, Suggestion } from '../services/geminiService';
import { SettingsModal } from './SettingsModal';

interface DashboardProps {
  user: any;
  onUpgradeClick: () => void;
}

interface AnalysisSession {
  id: string;
  title: string;
  image_url?: string; // In a real app, this would be a storage URL
  created_at: string;
  results?: Suggestion[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onUpgradeClick }) => {
  // --- State ---
  const [sessions, setSessions] = useState<AnalysisSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Studio State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userContext, setUserContext] = useState('');
  const [results, setResults] = useState<Suggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // PRO / Limits State
  const [isPro, setIsPro] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const [nextPayment, setNextPayment] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    fetchSessions();
    checkUserStatus();
  }, [user.id]); // Add user.id dependency

  useEffect(() => {
    if (currentSessionId) {
      loadSessionData(currentSessionId);
      // Close sidebar on mobile when a session is selected
      setShowMobileSidebar(false);
    } else {
      resetStudio();
    }
  }, [currentSessionId]);

  // Auto-scroll to results on mobile when generated
  useEffect(() => {
    if (results.length > 0 && window.innerWidth < 768 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [results]);

  // --- Supabase Logic ---

  const checkUserStatus = async () => {
    if (!user?.id) return;

    // 1. Check PRO status & Subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_pro, next_payment_date')
      .eq('id', user.id)
      .single();

    if (profile) {
      setIsPro(profile.is_pro || false);
      if (profile.next_payment_date) {
        setNextPayment(new Date(profile.next_payment_date).toLocaleDateString('pt-BR'));
      }
    }
    setIsLoadingProfile(false);

    // 2. Count daily messages (Free Plan Limit)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user') // Count only user inputs/analyses
      .gte('created_at', today.toISOString());

    if (!error && count !== null) {
      setDailyCount(count);
    }
  };

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSessions(data.map(d => ({
        id: d.id,
        title: d.title || 'Nova Análise',
        created_at: d.created_at
      })));
    }
  };

  const loadSessionData = async (sessionId: string) => {
    // Get the last AI message for this session to show results
    // Also try to find the user image from the first message
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', sessionId)
      .order('created_at', { ascending: true });

    if (messages && messages.length > 0) {
      // Find image in user messages
      const userMsg = messages.find(m => m.role === 'user' && m.image_data);
      if (userMsg) {
        setSelectedImage(userMsg.image_data);
        setUserContext(userMsg.content || '');
      }

      // Find latest results in AI messages
      const aiMsg = [...messages].reverse().find(m => m.role === 'ai' && m.suggestions);
      if (aiMsg) {
        setResults(aiMsg.suggestions);
      }
    }
  };

  const createSession = async (title: string) => {
    const { data, error } = await supabase
      .from('chats')
      .insert([{ user_id: user.id, title }])
      .select()
      .single();

    if (error) throw error;
    setSessions(prev => [data, ...prev]);
    return data.id;
  };

  const saveInteraction = async (sessionId: string, image: string, context: string, suggestions: Suggestion[]) => {
    // Save User Part
    await supabase.from('messages').insert({
      chat_id: sessionId,
      role: 'user',
      content: context,
      image_data: image // Note: Storing base64 in DB is heavy, strictly for demo.
    });

    // Save AI Part
    await supabase.from('messages').insert({
      chat_id: sessionId,
      role: 'ai',
      suggestions: suggestions
    });

    // Increment local count for immediate feedback
    setDailyCount(prev => prev + 1);
  };

  const deleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Excluir esta análise?')) {
      await supabase.from('chats').delete().eq('id', id);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (currentSessionId === id) {
        setCurrentSessionId(null);
      }
    }
  };

  // --- Handlers ---

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      // Force redirect to home page to ensure clean state
      window.location.href = '/';
    }
  };

  const resetStudio = () => {
    setSelectedImage(null);
    setUserContext('');
    setResults([]);
    setShowMobileSidebar(false);
  };

  const handleNewAnalysis = () => {
    setCurrentSessionId(null);
    resetStudio();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async () => {
    if (!selectedImage || isAnalyzing) return;

    // CHECK LIMITS
    if (!isPro && dailyCount >= 2) {
      onUpgradeClick();
      return;
    }

    setIsAnalyzing(true);

    try {
      // 1. Analyze (Returns { title, suggestions })
      const { title: aiTitle, suggestions } = await analyzeChatScreenshot(selectedImage, userContext);
      setResults(suggestions);

      // 2. Persist
      let sessionId = currentSessionId;
      if (!sessionId) {
        // Create new session title based on AI Analysis or fallback
        const title = aiTitle || userContext.slice(0, 25) || `Análise ${new Date().toLocaleTimeString()}`;
        sessionId = await createSession(title);
        setCurrentSessionId(sessionId);
      }

      if (sessionId) {
        await saveInteraction(sessionId, selectedImage, userContext, suggestions);
      }

    } catch (err) {
      console.error(err);
      alert("Erro ao analisar. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen bg-[#050505] text-white font-sans md:overflow-hidden selection:bg-pink-500/30 relative">

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        isPro={isPro}
        nextPayment={nextPayment}
        isLoadingProfile={isLoadingProfile}
      />

      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />

      {/* --- MOBILE OVERLAY --- */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* --- LEFT: GALERIA / HISTORY (Responsive Drawer) --- */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none md:relative md:translate-x-0
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/20">
              <MessageCircleHeart size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm tracking-tight text-white">Puxe<span className="text-purple-400 font-light">Assunto</span></span>
          </div>
          <button onClick={() => setShowMobileSidebar(false)} className="md:hidden text-gray-500 p-1">
            <X size={20} />
          </button>
        </div>

        {/* New Project Button */}
        <div className="p-4 shrink-0">
          <button
            onClick={handleNewAnalysis}
            className="w-full py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 group"
          >
            <Plus size={16} className="text-gray-400 group-hover:text-white" />
            Nova Análise
          </button>
        </div>

        {/* Search (Visual Only) */}
        <div className="px-4 mb-2 shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input type="text" placeholder="Buscar..." className="w-full bg-[#050505] border border-white/5 rounded-lg py-2 pl-9 pr-3 text-xs text-gray-300 focus:outline-none focus:border-white/20" />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
          <div className="px-3 py-1 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Recentes</div>
          {sessions.map(session => (
            <div
              key={session.id}
              onClick={() => setCurrentSessionId(session.id)}
              className={`
                group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all
                ${currentSessionId === session.id ? 'bg-[#1a1a1a] border border-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'}
              `}
            >
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium truncate max-w-[160px]">{session.title}</span>
                <span className="text-[10px] text-gray-600">
                  {new Date(session.created_at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button
                onClick={(e) => deleteSession(e, session.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 transition-all md:block hidden"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-white/10 flex items-center justify-center text-xs font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium truncate text-gray-300">{user.email}</p>
                {isPro && <span className="text-[9px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-1.5 py-0.5 rounded font-bold">PRO</span>}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-white transition-colors"
                  title="Configurações"
                >
                  <Settings size={10} /> Conta
                </button>
                <div className="w-px h-3 bg-white/10"></div>
                <button onClick={handleLogout} className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-red-400 transition-colors">
                  <LogOut size={10} /> Sair
                </button>
              </div>

            </div>
          </div>
          {!isPro && (
            <button
              onClick={onUpgradeClick}
              className="w-full mt-3 py-2 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 hover:border-purple-500/50 rounded-lg text-xs font-bold text-purple-200 transition-all flex items-center justify-center gap-1"
            >
              <Zap size={12} />
              Seja PRO
            </button>
          )}
        </div>
      </div>

      {/* --- MAIN CONTENT WRAPPER (Right Side on Desktop) --- */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-visible md:overflow-hidden">

        {/* --- CENTER: CANVAS (IMAGE VIEWER) --- */}
        <div
          className="w-full md:flex-1 bg-[#050505] relative flex flex-col min-h-[65vh] md:h-full shrink-0 md:shrink order-1 md:border-r border-transparent md:border-white/5 transition-all duration-300 overflow-hidden"
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }}
        >
          {/* Toolbar / Mobile Header */}
          <div className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-[#050505]/90 backdrop-blur-md z-30 sticky top-0 md:absolute md:left-0 md:right-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-lg active:bg-white/10"
              >
                <Menu size={20} />
              </button>

              {/* Mobile Brand */}
              <div className="flex items-center gap-2 md:hidden">
                <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <MessageCircleHeart size={14} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-sm text-white">Puxe<span className="text-purple-400 font-light">Assunto</span></span>
              </div>

              {/* Desktop Title */}
              <h2 className="text-sm font-medium text-gray-400 hidden md:block">
                {currentSessionId ? 'Modo Visualização' : 'Estúdio de Criação'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {!isPro && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                  <span className="text-xs text-gray-400">Restam: <span className="text-white font-bold">{Math.max(0, 2 - dailyCount)}</span></span>
                  <button onClick={onUpgradeClick} className="text-xs font-bold text-purple-400 hover:text-purple-300">UPGRADE</button>
                </div>
              )}

              {selectedImage && (
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 backdrop-blur-md transition-colors"
                >
                  <span className="hidden sm:inline">Remover Print</span>
                  <Trash2 size={14} className="sm:hidden" />
                </button>
              )}
            </div>
          </div>

          {/* Main Area */}
          <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative md:pt-16">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#222 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.2 }}></div>

            {/* Aurora Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-purple-900/10 via-transparent to-pink-900/10 blur-3xl rounded-full pointer-events-none"></div>

            {/* Persistent Floating Icons (Tightened Positioning) */}
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
              {/* Floating Bubble 1 (Top Left - Closer) */}
              <div className="absolute top-[5%] left-[5%] md:top-[10%] md:left-[10%] animate-float opacity-90 scale-75 md:scale-100 z-20">
                <div className="bg-[#1a1a1a]/90 border border-white/10 px-4 py-2 rounded-2xl rounded-tl-none shadow-xl backdrop-blur-sm flex items-center gap-2 transform -rotate-6">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="h-2 w-12 bg-white/10 rounded-full"></div>
                </div>
              </div>

              {/* Floating Bubble 2 (Bottom Right - Moved DOWN on Mobile) */}
              <div className="absolute bottom-[3%] right-[5%] md:bottom-[15%] md:right-[10%] animate-float opacity-90 scale-75 md:scale-100 z-20" style={{ animationDelay: '1.5s' }}>
                <div className="bg-[#1a1a1a]/90 border border-white/10 px-4 py-2 rounded-2xl rounded-tr-none shadow-xl backdrop-blur-sm flex items-center gap-2 transform rotate-6">
                  <div className="h-2 w-16 bg-white/10 rounded-full"></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                </div>
              </div>

              {/* Floating Bubble 3 (Top Right - Extra - Closer) */}
              <div className="absolute top-[15%] right-[8%] md:top-[15%] md:right-[20%] animate-float opacity-60 scale-75 md:scale-90" style={{ animationDelay: '0.8s' }}>
                <div className="bg-[#1a1a1a]/90 border border-white/10 p-2 rounded-full shadow-xl backdrop-blur-sm">
                  <Heart size={16} className="text-pink-500 fill-pink-500/20" />
                </div>
              </div>

              {/* Icons */}
              <MessageCircle className="absolute top-[25%] right-[15%] md:right-[25%] text-white/5 w-12 h-12 animate-pulse-slow hidden md:block" />
              <Send className="absolute bottom-[15%] left-[15%] md:left-[25%] text-white/5 w-10 h-10 animate-pulse-slow hidden md:block" style={{ animationDelay: '1s' }} />
            </div>

            {!selectedImage ? (
              /* --- New Modern Upload State --- */
              <div
                onClick={triggerFileSelect}
                className={`
                            w-full h-full md:w-full md:max-w-2xl md:h-[80%] md:aspect-video 
                            flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group relative z-10 mt-8 md:mt-0
                        `}
              >
                {/* Main Center Card */}
                <div className={`
                            relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-12 text-center shadow-2xl z-10
                            w-[90%] md:w-full mx-auto
                            transform transition-all duration-300 group-hover:scale-[1.02] group-hover:border-purple-500/30 group-hover:shadow-purple-900/20
                            ${isDragging ? 'border-purple-500 bg-purple-900/20 scale-105' : ''}
                         `}>
                  <div className="relative w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse"></div>
                    <div className="relative w-full h-full bg-[#111] border border-white/10 rounded-full flex items-center justify-center shadow-xl group-hover:-translate-y-1 transition-transform duration-300">
                      <Upload size={24} className="md:w-8 md:h-8 text-white group-hover:text-purple-200 transition-colors" />
                    </div>
                  </div>

                  <h3 className="text-xl md:text-3xl font-bold text-white mb-2 md:mb-3 tracking-tight">
                    Analise sua conversa
                  </h3>
                  <p className="text-xs md:text-base text-gray-400 max-w-xs mx-auto mb-6 md:mb-8 leading-relaxed">
                    Arraste o print aqui ou clique para escolher. Nossa IA vai criar a resposta perfeita.
                  </p>

                  <div className="flex items-center justify-center gap-2 md:gap-3 text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="bg-white/5 px-2 md:px-3 py-1 rounded-full border border-white/5">WhatsApp</span>
                    <span className="bg-white/5 px-2 md:px-3 py-1 rounded-full border border-white/5">Tinder</span>
                    <span className="bg-white/5 px-2 md:px-3 py-1 rounded-full border border-white/5">Insta</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Image Preview State */
              <div className="relative w-full h-full flex items-center justify-center z-10 animate-fade-in p-2">
                <div className="relative max-w-full max-h-full shadow-2xl shadow-black rounded-lg overflow-hidden border border-white/10 group">
                  <img src={selectedImage} className="max-w-full max-h-[60vh] md:max-h-[80vh] object-contain" alt="Print" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT: CONTROL PANEL (Bottom on Mobile) --- */}
        <div ref={resultsRef} className="w-full md:w-[380px] h-auto md:h-full md:flex-none bg-[#050505] md:bg-[#0a0a0a] md:border-l border-transparent md:border-white/5 flex flex-col md:shadow-2xl z-20 order-2 md:order-2 md:overflow-hidden">

          {/* Panel Header */}
          <div className="h-14 md:h-16 border-b border-white/5 hidden md:flex items-center px-6 bg-[#0a0a0a] shrink-0">
            <Sparkles size={16} className="text-purple-400 mr-2" />
            <h3 className="font-bold text-sm">Gerador de Respostas</h3>
          </div>

          <div className="flex-1 md:overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-white/10 pb-20 md:pb-6">

            {/* Loading State */}
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-[#1a1a1a] border border-white/10 p-4 rounded-2xl shadow-2xl">
                    <MessageCircleHeart className="w-10 h-10 text-white animate-pulse" strokeWidth={2} />
                  </div>
                </div>
                <p className="mt-6 text-sm font-medium text-gray-300 animate-pulse">
                  O Puxe Assunto está pensando...
                </p>
              </div>
            ) : results.length > 0 ? (
              /* Results View (Reordered for Mobile Flow) */
              <div className="animate-slide-up pb-4">

                {/* 1. Header */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-px flex-1 bg-white/10"></div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sugestões do Puxe Assunto
                  </span>
                  <div className="h-px flex-1 bg-white/10"></div>
                </div>

                {/* 2. Suggestions List - Increased Spacing */}
                <div className="space-y-10 mb-8">
                  {results.map((res, idx) => (
                    <ResultCard key={idx} suggestion={res} index={idx} />
                  ))}
                </div>

                {/* 3. Refine Box */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-4 mb-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    <Sparkles size={12} className="text-yellow-400" />
                    Refinar Resposta (Opcional)
                  </label>
                  <textarea
                    value={userContext}
                    onChange={(e) => setUserContext(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none h-20"
                    placeholder="Ex: Ela gosta de sushi, seja engraçado..."
                  />
                  <p className="text-[10px] text-gray-500 mt-2 text-right">
                    Adicione contexto para personalizar
                  </p>
                </div>

                {/* 4. Regenerate Button (Secondary) */}
                <button
                  onClick={runAnalysis}
                  className="w-full py-4 bg-[#1a1a1a] border border-white/10 hover:bg-[#222] hover:border-purple-500/30 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircleHeart size={18} />
                  Regenerar Sugestões
                </button>

              </div>
            ) : (
              /* Initial / Empty State */
              <div className="mt-4">
                <button
                  onClick={runAnalysis}
                  disabled={!selectedImage}
                  className={`
                                w-full py-4 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                                ${!selectedImage
                      ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-95'}
                            `}
                >
                  <MessageCircleHeart size={18} className="fill-white/20" />
                  Gerar respostas com Puxe Assunto
                </button>

                <div className="flex flex-col items-center justify-center py-10 text-center opacity-30">
                  <p className="text-xs text-gray-400">Os resultados aparecerão aqui</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const ResultCard: React.FC<{ suggestion: Suggestion, index: number }> = ({ suggestion, index }) => {
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
      className={`bg-[#111] border rounded-xl p-4 md:p-5 relative group transition-all duration-300 hover:bg-[#161616] active:bg-[#161616] ${getToneStyle(suggestion.tone)}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Tone Badge */}
      <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-[#0a0a0a] border border-white/10 rounded-full text-[9px] md:text-[10px] font-bold text-gray-300 uppercase tracking-wider shadow-sm z-10">
        {suggestion.tone}
      </div>

      {/* Content */}
      <p className="text-sm text-white leading-relaxed mt-2 mb-3 font-medium selection:bg-purple-500/40">
        "{suggestion.message}"
      </p>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
        <div className="flex items-center gap-1.5 max-w-[70%]">
          <Zap size={12} className="text-purple-400 flex-shrink-0" />
          <span className="text-[10px] text-gray-500 truncate">{suggestion.explanation}</span>
        </div>

        <button
          onClick={copyToClipboard}
          className={`
                        flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all
                        ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400 active:bg-white/10 md:hover:bg-white/10 md:hover:text-white'}
                    `}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
    </div>
  );
}