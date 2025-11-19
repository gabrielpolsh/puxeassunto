import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, MessageCircleHeart, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onLoginSuccess();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Se o signup for bem sucedido, verificamos se logou automaticamente ou precisa confirmar
        // Para simplificar a UX neste demo, tratamos como sucesso
        onLoginSuccess(); 
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#050505] text-white animate-fade-in">
      
      {/* Left Side - Visual & Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#0a0a0a] border-r border-white/5 flex-col justify-between p-16">
        {/* Background Effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20 border border-white/10">
              <MessageCircleHeart className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
            Puxe<span className="font-light text-purple-200">Assunto</span>
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
                Nunca mais deixe o assunto morrer.
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Junte-se a milhares de usuários que transformaram suas interações sociais com o poder da Inteligência Artificial.
            </p>
            
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                    <span className="text-gray-300">Análise de contexto em tempo real</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                    <span className="text-gray-300">Sugestões personalizadas de tom</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                    <span className="text-gray-300">Privacidade total das suas conversas</span>
                </div>
            </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 text-sm text-gray-500">
            © 2024 Puxe Assunto Inc.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        
        {/* Back Button */}
        <button 
            onClick={onBack}
            className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
        >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Voltar ao site</span>
        </button>

        <div className="w-full max-w-[400px]">
            <div className="text-center mb-10">
                <div className="lg:hidden w-12 h-12 mx-auto bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20 mb-6">
                    <MessageCircleHeart className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">
                    {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
                </h1>
                <p className="text-gray-400">
                    {isLogin ? 'Entre com seus dados para acessar.' : 'Preencha seus dados para começar.'}
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2 animate-shake">
                    <span className="block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-300 uppercase tracking-wide ml-1">Email</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            placeholder="seu@email.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-300 uppercase tracking-wide ml-1">Senha</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-[#050505] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-500/20"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                {isLogin ? 'Entrar na Plataforma' : 'Criar Conta Grátis'} 
                                <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(null); }}
                        className="ml-2 font-semibold text-white hover:text-purple-400 transition-colors"
                    >
                        {isLogin ? 'Cadastre-se agora' : 'Fazer Login'}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};