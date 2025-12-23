import React from 'react';
import { ArrowLeft, MessageCircle, Heart, Flame, Zap, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';
import { SEOHead } from './SEOHead';

interface BlogIndexPageProps {
  onBack: () => void;
  onAction: () => void;
}

export const BlogIndexPage: React.FC<BlogIndexPageProps> = ({ onBack, onAction }) => {
  const articles = [
    {
      slug: '/blog/puxar-assunto',
      title: 'Como Puxar Assunto',
      subtitle: 'e Nunca Mais Travar na Conversa',
      description: 'Aprenda técnicas comprovadas para iniciar conversas interessantes e criar conexões genuínas com qualquer pessoa.',
      icon: <MessageCircle className="w-8 h-8" />,
      color: 'rose',
      gradient: 'from-rose-500 to-red-500',
      bgGlow: 'bg-rose-600/10',
      readTime: '8 min',
      category: 'Iniciando Conversas'
    },
    {
      slug: '/blog/flerte',
      title: 'Como Flertar pelo WhatsApp',
      subtitle: 'Sem Parecer Desesperado',
      description: 'Domine a arte do flerte digital com técnicas que criam atração e interesse de forma natural e autêntica.',
      icon: <Heart className="w-8 h-8" />,
      color: 'pink',
      gradient: 'from-pink-500 to-rose-500',
      bgGlow: 'bg-pink-600/10',
      readTime: '10 min',
      category: 'Flerte'
    },
    {
      slug: '/blog/conversas',
      title: 'Como Ter Conversas Interessantes',
      subtitle: 'e Envolventes',
      description: 'Aprenda a arte de manter conversas que fluem naturalmente e deixam as pessoas querendo mais.',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'purple',
      gradient: 'from-purple-500 to-blue-500',
      bgGlow: 'bg-purple-600/10',
      readTime: '12 min',
      category: 'Comunicação'
    },
    {
      slug: '/blog/cantadas',
      title: '100+ Cantadas Criativas',
      subtitle: 'que Realmente Funcionam',
      description: 'As melhores cantadas para WhatsApp, Tinder e Instagram, organizadas por categoria com dicas de uso.',
      icon: <Flame className="w-8 h-8" />,
      color: 'orange',
      gradient: 'from-orange-500 to-rose-500',
      bgGlow: 'bg-orange-600/10',
      readTime: '7 min',
      category: 'Cantadas'
    },
    {
      slug: '/blog/tinder-dicas',
      title: 'Guia Completo do Tinder',
      subtitle: 'Como Conseguir Mais Matches',
      description: 'Do perfil perfeito à primeira mensagem: tudo que você precisa saber para dominar o Tinder em 2025.',
      icon: <Zap className="w-8 h-8" />,
      color: 'pink',
      gradient: 'from-pink-500 to-orange-500',
      bgGlow: 'bg-pink-600/10',
      readTime: '15 min',
      category: 'Apps de Namoro'
    },
    {
      slug: '/blog/respostas-whatsapp',
      title: 'O Que Responder no WhatsApp',
      subtitle: 'em Toda Situação',
      description: 'Respostas prontas para quando ela responde seco, visualiza e não responde, ou a conversa esfria.',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      bgGlow: 'bg-green-600/10',
      readTime: '9 min',
      category: 'WhatsApp'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { text: string; border: string; bg: string }> = {
      rose: { text: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
      pink: { text: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-500/10' },
      purple: { text: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
      orange: { text: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10' },
      green: { text: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10' }
    };
    return colors[color] || colors.rose;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-rose-500/30 relative overflow-hidden">
      <SEOHead
        title="Blog Puxe Assunto - Dicas de Conversa, Flerte e Relacionamentos"
        description="Aprenda como puxar assunto, flertar pelo WhatsApp, usar o Tinder e ter conversas interessantes. Guias completos e dicas práticas para melhorar suas conversas."
        keywords="blog puxe assunto, dicas de conversa, como flertar, dicas tinder, puxar assunto, conversas interessantes, cantadas criativas, respostas whatsapp"
        canonicalUrl="https://puxeassunto.com/blog"
      />
      
      {/* Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-pink-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Voltar
            </button>
            <Link to="/" className="text-xl font-bold text-white">
              Puxe Assunto<span className="text-rose-500">.</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 text-sm mb-6">
              <BookOpen size={16} />
              Blog & Guias
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Aprenda a <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400">Conversar Melhor</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Guias práticos e dicas testadas para você nunca mais ficar sem assunto, seja no WhatsApp, Tinder ou pessoalmente.
            </p>

            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 rounded-full font-semibold text-lg transition-all shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105"
            >
              Experimentar o Puxe Assunto
              <ArrowRight size={20} />
            </button>
          </section>

          {/* Articles Grid */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article, index) => {
                const colorClasses = getColorClasses(article.color);
                
                return (
                  <Link
                    key={index}
                    to={article.slug}
                    className={`group bg-white/5 border border-white/10 rounded-2xl p-6 hover:${colorClasses.border} transition-all duration-300 hover:bg-white/[0.07] relative overflow-hidden`}
                  >
                    {/* Background glow on hover */}
                    <div className={`absolute top-0 right-0 w-32 h-32 ${article.bgGlow} rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                    
                    <div className="relative">
                      {/* Category & Read time */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-xs font-medium ${colorClasses.text} ${colorClasses.bg} px-3 py-1 rounded-full`}>
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {article.readTime} de leitura
                        </span>
                      </div>

                      {/* Icon */}
                      <div className={`inline-flex p-3 ${colorClasses.bg} rounded-xl ${colorClasses.text} mb-4`}>
                        {article.icon}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold mb-1 group-hover:text-white transition-colors">
                        {article.title}
                      </h2>
                      <p className={`text-sm ${colorClasses.text} mb-3`}>
                        {article.subtitle}
                      </p>

                      {/* Description */}
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {article.description}
                      </p>

                      {/* Read more */}
                      <div className={`flex items-center gap-2 ${colorClasses.text} text-sm font-medium group-hover:gap-3 transition-all`}>
                        Ler artigo
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8 text-center">
              <Sparkles className="w-12 h-12 text-rose-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Cansado de Ler? Deixe a IA Fazer o Trabalho
              </h2>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                O <strong className="text-white">Puxe Assunto</strong> analisa sua conversa e gera respostas personalizadas em segundos. Sem teoria, só prática.
              </p>
              <button
                onClick={onAction}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 rounded-full font-semibold transition-all shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105"
              >
                Experimentar Grátis
                <ArrowRight size={20} />
              </button>
            </div>
          </section>

          {/* Topics Quick Links */}
          <section className="mb-16">
            <h2 className="text-xl font-bold mb-6 text-center text-gray-300">Tópicos Populares</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {['Puxar Assunto', 'Flerte', 'Tinder', 'WhatsApp', 'Cantadas', 'Conversas', 'Relacionamentos', 'Dicas de Paquera'].map((topic, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors cursor-default"
                >
                  {topic}
                </span>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};
