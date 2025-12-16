import React from 'react';
import { ArrowLeft, MessageCircle, Lightbulb, Sparkles, Heart, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';

interface PuxarAssuntoPageProps {
  onBack: () => void;
  onAction: () => void;
}

export const PuxarAssuntoPage: React.FC<PuxarAssuntoPageProps> = ({ onBack, onAction }) => {
  const tips = [
    {
      title: "Observe o contexto",
      description: "Antes de puxar assunto, observe o ambiente, as fotos do perfil ou stories. Comentar algo específico mostra que você prestou atenção.",
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      title: "Faça perguntas abertas",
      description: "Evite perguntas que podem ser respondidas com 'sim' ou 'não'. Pergunte 'como', 'por que' ou 'o que você acha'.",
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      title: "Seja genuíno",
      description: "Não tente ser quem você não é. A autenticidade cria conexões mais profundas e duradouras.",
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: "Timing é tudo",
      description: "Saiba o momento certo de enviar mensagem. Evite horários inconvenientes e respeite o tempo de resposta.",
      icon: <Zap className="w-6 h-6" />
    }
  ];

  const examples = [
    {
      situation: "Ela postou foto na praia",
      bad: "Oi, tudo bem?",
      good: "Que praia incrível! É aqui no Brasil? Tô precisando de dicas de viagem 🏖️"
    },
    {
      situation: "Match no Tinder",
      bad: "Oi linda",
      good: "Vi que você curte [hobby do perfil]! Como você começou nisso?"
    },
    {
      situation: "Conhecida da faculdade",
      bad: "E aí, beleza?",
      good: "Lembrei de você quando vi [algo relacionado]! Como tá esse semestre?"
    }
  ];

  const mistakes = [
    "Mandar só 'oi' ou 'tudo bem?'",
    "Falar só de você mesmo",
    "Responder com monossílabos",
    "Demorar dias para responder",
    "Ser insistente demais",
    "Usar cantadas prontas e genéricas"
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-rose-500/30 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
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

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 text-sm mb-6">
              <MessageCircle size={16} />
              Guia Completo
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Como <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500">Puxar Assunto</span>
              <br />e Nunca Mais Travar
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Aprenda técnicas comprovadas para iniciar conversas interessantes e criar conexões genuínas com qualquer pessoa.
            </p>

            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 rounded-full font-semibold text-lg transition-all shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105"
            >
              Experimente o Puxe Assunto
              <ArrowRight size={20} />
            </button>
          </section>

          {/* Introduction */}
          <section className="mb-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4">Por que puxar assunto é tão difícil?</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Muitas pessoas travam na hora de iniciar uma conversa por medo de rejeição, falta de criatividade ou simplesmente por não saber o que dizer. A boa notícia é que <strong className="text-white">puxar assunto é uma habilidade que pode ser aprendida</strong>.
              </p>
              <p className="text-gray-400 leading-relaxed">
                O segredo não está em ter a frase perfeita, mas em criar uma abertura que gere curiosidade e convide a outra pessoa a participar da conversa. Neste guia, você vai aprender exatamente como fazer isso.
              </p>
            </div>
          </section>

          {/* Tips Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              4 Dicas <span className="text-rose-400">Essenciais</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-rose-500/30 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
                      {tip.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{tip.title}</h3>
                  </div>
                  <p className="text-gray-400">{tip.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Examples Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Exemplos <span className="text-rose-400">Práticos</span>
            </h2>
            
            <div className="space-y-6">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="text-sm text-rose-400 font-medium mb-4">
                    Situação: {example.situation}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <div className="text-red-400 text-sm font-medium mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        Evite
                      </div>
                      <p className="text-gray-300">"{example.bad}"</p>
                    </div>
                    
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="text-green-400 text-sm font-medium mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Melhor opção
                      </div>
                      <p className="text-gray-300">"{example.good}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mistakes Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Erros que Você Deve <span className="text-red-400">Evitar</span>
            </h2>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {mistakes.map((mistake, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-400">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-400 text-sm">✕</span>
                    </div>
                    {mistake}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* AI Section */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/20 rounded-2xl p-8 text-center">
              <Sparkles className="w-12 h-12 text-rose-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Deixe a IA Fazer o Trabalho Difícil
              </h2>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Com o <strong className="text-white">Puxe Assunto</strong>, você envia um print da conversa e recebe sugestões personalizadas de resposta em segundos. Sem mais travadas, sem mais respostas secas.
              </p>
              <button
                onClick={onAction}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 rounded-full font-semibold transition-all shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105"
              >
                Começar Agora - É Grátis
                <ArrowRight size={20} />
              </button>
            </div>
          </section>

          {/* Related Articles */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Artigos Relacionados</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/blog/flerte"
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-rose-500/30 transition-all group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-rose-400 transition-colors">
                  Como Flertar pelo WhatsApp →
                </h3>
                <p className="text-gray-500 text-sm">
                  Técnicas para criar tensão e interesse nas conversas
                </p>
              </Link>
              
              <Link
                to="/blog/conversas"
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-rose-500/30 transition-all group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-rose-400 transition-colors">
                  Conversas que Conectam →
                </h3>
                <p className="text-gray-500 text-sm">
                  Como manter conversas interessantes e criar conexões
                </p>
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};
