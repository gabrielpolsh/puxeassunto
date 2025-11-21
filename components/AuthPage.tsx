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
  const [confirmPassword, setConfirmPassword] = useState('');
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
        // Validação de confirmação de senha no cadastro
        if (password !== confirmPassword) {
          throw new Error('As senhas não coincidem.');
        }
        if (password.length < 6) {
          throw new Error('A senha deve ter no mínimo 6 caracteres.');
        }
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
            © 2025 Puxe Assunto Inc.
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

            <div className="space-y-4 mb-8">
                <button
                    onClick={async () => {
                        try {
                            // Verifica se está rodando localmente
                            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                            
                            // Define a URL de redirecionamento baseada no ambiente
                            // IMPORTANTE: Adicione 'https://puxeassunto.com/dashboard' nas Redirect URLs do Supabase
                            const redirectTo = isLocal 
                                ? `${window.location.origin}/dashboard`
                                : 'https://puxeassunto.com/dashboard';

                            const { error } = await supabase.auth.signInWithOAuth({
                                provider: 'google',
                                options: {
                                    redirectTo,
                                },
                            });
                            if (error) throw error;
                        } catch (err: any) {
                            setError(err.message || 'Erro ao conectar com Google.');
                        }
                    }}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-[1.01]"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continuar com Google
                </button>

                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-wider">ou com email</span>
                    <div className="flex-grow border-t border-white/10"></div>
                </div>
            </div>

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

                {!isLogin && (
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-300 uppercase tracking-wide ml-1">Confirmar Senha</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                            </div>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                )}

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
                        onClick={() => { 
                            setIsLogin(!isLogin); 
                            setError(null); 
                            setConfirmPassword('');
                        }}
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