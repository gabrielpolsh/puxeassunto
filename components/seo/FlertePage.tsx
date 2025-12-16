import React from 'react';
import { ArrowLeft, Heart, Flame, Sparkles, MessageCircle, Zap, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';

interface FlertePageProps {
  onBack: () => void;
  onAction: () => void;
}

export const FlertePage: React.FC<FlertePageProps> = ({ onBack, onAction }) => {
  const techniques = [
    {
      title: "Crie tensão com pausas",
      description: "Não responda imediatamente sempre. Uma pequena espera pode aumentar a expectativa e o interesse.",
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: "Use humor e provocações leves",
      description: "Brincar e provocar de forma saudável cria uma dinâmica divertida e gera conexão emocional.",
      icon: <Flame className="w-6 h-6" />
    },
    {
      title: "Elogie de forma inteligente",
      description: "Evite elogios óbvios sobre aparência. Elogie a personalidade, o humor ou algo específico que ela disse.",
      icon: <Star className="w-6 h-6" />
    },
    {
      title: "Deixe mistério no ar",
      description: "Não conte tudo sobre você de uma vez. Deixe assuntos em aberto para criar curiosidade.",
      icon: <Sparkles className="w-6 h-6" />
    }
  ];

  const doAndDont = [
    {
      do: "Seja confiante, mas não arrogante",
      dont: "Ser inseguro ou carente demais"
    },
    {
      do: "Demonstre interesse genuíno",
      dont: "Fingir ser quem você não é"
    },
    {
      do: "Use emojis com moderação",
      dont: "Encher de emojis em cada mensagem"
    },
    {
      do: "Flerte de forma sutil e gradual",
      dont: "Ser direto demais logo de cara"
    },
    {
      do: "Saiba a hora de parar",
      dont: "Insistir quando não há reciprocidade"
    }
  ];

  const examples = [
    {
      context: "Ela disse que está cansada",
      response: "Cansada de ser tão interessante assim? Deve ser exaustivo 😏",
      why: "Transforma uma reclamação em elogio bem-humorado"
    },
    {
      context: "Ela mandou uma foto bonita",
      response: "Ok, você tá proibida de fazer isso. Tô tentando me concentrar aqui 😅",
      why: "Elogio indireto que demonstra interesse sem ser óbvio"
    },
    {
      context: "Conversa sobre comida favorita",
      response: "Pizza de calabresa? Acho que acabei de me apaixonar um pouquinho 🍕",
      why: "Usa humor para criar conexão sobre interesses em comum"
    },
    {
      context: "Ela perguntou o que você faz",
      response: "Sou [profissão], mas meu verdadeiro talento é fazer pessoas sorrirem... tá funcionando aí?",
      why: "Responde a pergunta e adiciona uma provocação divertida"
    }
  ];

  const stages = [
    {
      stage: "1. Abertura",
      description: "Comece com algo específico e interessante. Evite o 'oi, tudo bem?'.",
      tip: "Comente algo do perfil ou de uma situação em comum"
    },
    {
      stage: "2. Construção",
      description: "Desenvolva a conversa com perguntas e histórias. Mostre interesse genuíno.",
      tip: "Encontre pontos em comum e expanda sobre eles"
    },
    {
      stage: "3. Flerte leve",
      description: "Introduza brincadeiras e provocações sutis. Teste a reciprocidade.",
      tip: "Se ela responder positivamente, continue. Se não, recue."
    },
    {
      stage: "4. Intensificação",
      description: "Se houver reciprocidade, aumente gradualmente a intensidade do flerte.",
      tip: "Use elogios mais diretos e crie mais intimidade"
    },
    {
      stage: "5. Proposta",
      description: "Convide para um encontro ou próximo passo quando sentir que é a hora.",
      tip: "Seja específico: 'Vamos tomar um café sábado?'"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-rose-500/30 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed top-1/3 left-1/3 w-[30%] h-[30%] bg-red-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 text-sm mb-6">
              <Heart size={16} />
              Guia de Flerte
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Como <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">Flertar</span> pelo WhatsApp
              <br />Sem Parecer Desesperado
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Domine a arte do flerte digital com técnicas que criam atração e interesse de forma natural e autêntica.
            </p>

            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-full font-semibold text-lg transition-all shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105"
            >
              Gerar Respostas com IA
              <ArrowRight size={20} />
            </button>
          </section>

          {/* Introduction */}
          <section className="mb-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4">O que é flertar bem?</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Flertar não é sobre ter a melhor cantada ou ser o mais bonito. É sobre criar uma <strong className="text-white">conexão emocional</strong> através de brincadeiras, provocações e demonstrações sutis de interesse.
              </p>
              <p className="text-gray-400 leading-relaxed">
                O flerte eficaz é um jogo de <strong className="text-white">push and pull</strong> - você demonstra interesse, mas também mantém um pouco de mistério. Você elogia, mas também provoca. É essa dinâmica que cria atração.
              </p>
            </div>
          </section>

          {/* Techniques */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Técnicas de <span className="text-pink-400">Flerte</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {techniques.map((technique, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-pink-500/30 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400">
                      {technique.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{technique.title}</h3>
                  </div>
                  <p className="text-gray-400">{technique.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stages */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              As 5 <span className="text-pink-400">Fases</span> do Flerte
            </h2>
            
            <div className="space-y-4">
              {stages.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0 font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{item.stage}</h3>
                      <p className="text-gray-400 mb-3">{item.description}</p>
                      <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg px-4 py-2 inline-block">
                        <span className="text-pink-400 text-sm">💡 {item.tip}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Examples */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Exemplos de <span className="text-pink-400">Respostas</span>
            </h2>
            
            <div className="space-y-6">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                >
                  <div className="bg-pink-500/10 px-6 py-3 border-b border-white/10">
                    <span className="text-pink-400 text-sm font-medium">
                      Contexto: {example.context}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-lg p-4 mb-4">
                      <p className="text-white text-lg">"{example.response}"</p>
                    </div>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <Sparkles size={14} className="text-pink-400" />
                      {example.why}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Do and Don't */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              O que <span className="text-green-400">Fazer</span> e <span className="text-red-400">Evitar</span>
            </h2>
            
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-6 border-b md:border-b-0 md:border-r border-white/10">
                  <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Faça isso
                  </h3>
                  <ul className="space-y-3">
                    {doAndDont.map((item, index) => (
                      <li key={index} className="text-gray-400 flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        {item.do}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6">
                  <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    Evite isso
                  </h3>
                  <ul className="space-y-3">
                    {doAndDont.map((item, index) => (
                      <li key={index} className="text-gray-400 flex items-center gap-2">
                        <span className="text-red-400">✕</span>
                        {item.dont}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* AI Section */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-2xl p-8 text-center">
              <Flame className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Respostas de Flerte Geradas por IA
              </h2>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Travou e não sabe como responder? O <strong className="text-white">Puxe Assunto</strong> analisa a conversa e gera respostas perfeitas para criar atração e interesse.
              </p>
              <button
                onClick={onAction}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-full font-semibold transition-all shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105"
              >
                Experimentar Grátis
                <ArrowRight size={20} />
              </button>
            </div>
          </section>

          {/* Related Articles */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Artigos Relacionados</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/blog/puxar-assunto"
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-pink-500/30 transition-all group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-pink-400 transition-colors">
                  Como Puxar Assunto →
                </h3>
                <p className="text-gray-500 text-sm">
                  Técnicas para iniciar conversas interessantes
                </p>
              </Link>
              
              <Link
                to="/blog/conversas"
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-pink-500/30 transition-all group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-pink-400 transition-colors">
                  Conversas que Conectam →
                </h3>
                <p className="text-gray-500 text-sm">
                  Como manter conversas fluindo naturalmente
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
