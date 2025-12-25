import React from 'react';
import { ArrowLeft, MessageSquare, Users, Sparkles, Brain, Lightbulb, Target, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';
import { SEOHead } from './SEOHead';

interface ConversasPageProps {
  onBack: () => void;
  onAction: () => void;
}

export const ConversasPage: React.FC<ConversasPageProps> = ({ onBack, onAction }) => {
  const pillars = [
    {
      title: "Escuta Ativa",
      description: "Preste atenção no que a pessoa diz e faça perguntas de acompanhamento. Isso mostra interesse genuíno.",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Vulnerabilidade",
      description: "Compartilhe suas próprias histórias e experiências. Isso cria intimidade e encoraja a outra pessoa a se abrir.",
      icon: <Brain className="w-6 h-6" />
    },
    {
      title: "Curiosidade",
      description: "Seja genuinamente curioso sobre a vida da outra pessoa. Faça perguntas que vão além do superficial.",
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      title: "Energia Positiva",
      description: "Mantenha um tom leve e positivo. Evite reclamações excessivas ou negatividade.",
      icon: <Sparkles className="w-6 h-6" />
    }
  ];

  const topics = [
    {
      category: "Sonhos e Ambições",
      questions: [
        "Se você pudesse fazer qualquer coisa sem medo de falhar, o que seria?",
        "Onde você se vê daqui a 5 anos?",
        "Qual é o maior sonho que você ainda quer realizar?"
      ]
    },
    {
      category: "Experiências e Memórias",
      questions: [
        "Qual foi a viagem mais marcante que você já fez?",
        "Qual é a sua melhor lembrança de infância?",
        "O que você faria se ganhasse na loteria amanhã?"
      ]
    },
    {
      category: "Personalidade e Valores",
      questions: [
        "O que mais te irrita nas pessoas?",
        "O que você mais valoriza em uma amizade?",
        "Se você pudesse jantar com qualquer pessoa, viva ou morta, quem seria?"
      ]
    },
    {
      category: "Diversão e Hobbies",
      questions: [
        "O que você faz quando quer relaxar?",
        "Qual série você está assistindo agora?",
        "Se você pudesse aprender qualquer habilidade instantaneamente, qual seria?"
      ]
    }
  ];

  const flowTechniques = [
    {
      name: "Técnica do 'E'",
      description: "Adicione 'e você?' após responder para devolver a pergunta e manter o fluxo.",
      example: "Adoro pizza de pepperoni! E você, qual é a sua favorita?"
    },
    {
      name: "Técnica da Expansão",
      description: "Pegue um detalhe da resposta e faça uma nova pergunta sobre ele.",
      example: "Ela: 'Fui para Gramado' → Você: 'Nossa, sempre quis ir! O que você mais gostou de lá?'"
    },
    {
      name: "Técnica da História",
      description: "Quando ela compartilhar algo, conte uma história relacionada sua.",
      example: "Ela: 'Amo cachorros' → Você: 'Eu também! Tenho um golden que faz as maiores confusões...'"
    },
    {
      name: "Técnica do Callback",
      description: "Volte a mencionar algo que ela disse antes para mostrar que você prestou atenção.",
      example: "Lembra daquela série que você mencionou ontem? Comecei a assistir!"
    }
  ];

  const redFlags = [
    "Responder só com 'sim', 'não' ou 'legal'",
    "Demorar horas ou dias para responder",
    "Nunca fazer perguntas de volta",
    "Falar só sobre si mesmo",
    "Mudar de assunto abruptamente",
    "Deixar a conversa morrer sem tentar reviver"
  ];

  const greenFlags = [
    "Fazer perguntas de acompanhamento",
    "Compartilhar histórias pessoais",
    "Usar o nome da pessoa na conversa",
    "Lembrar de detalhes mencionados antes",
    "Manter um ritmo de resposta consistente",
    "Adicionar humor e leveza à conversa"
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-rose-500/30 relative overflow-hidden">
      <SEOHead
        title="Como Ter Conversas Interessantes: Guia Definitivo | Puxe Assunto"
        description="Domine a arte de manter conversas que fluem naturalmente. Aprenda os 4 pilares, técnicas de fluxo, 50+ perguntas para conversar e nunca mais deixe a conversa morrer."
        keywords="como ter conversas interessantes, assuntos para conversar, manter conversa, conversa fluir, perguntas para conhecer alguém, técnicas de conversa, como não deixar conversa morrer"
        canonicalUrl="https://puxeassunto.com/blog/conversas"
        ogType="article"
        articlePublishedTime="2025-01-01T00:00:00Z"
        articleModifiedTime="2025-12-23T00:00:00Z"
      />
      
      {/* Background Effects */}
      <div className="fixed top-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed top-1/2 left-[-10%] w-[30%] h-[30%] bg-rose-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm mb-6">
              <MessageSquare size={16} />
              Guia Definitivo
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Como Ter <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Conversas</span>
              <br />Interessantes e Envolventes
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Aprenda a arte de manter conversas que fluem naturalmente, criam conexões profundas e deixam as pessoas querendo mais.
            </p>

            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-full font-semibold text-lg transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
            >
              Gerar Respostas Inteligentes
              <ArrowRight size={20} />
            </button>
          </section>

          {/* Introduction */}
          <section className="mb-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4">O segredo das conversas que conectam</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Uma boa conversa não é sobre ter as melhores respostas - é sobre fazer as <strong className="text-white">melhores perguntas</strong> e demonstrar <strong className="text-white">interesse genuíno</strong>. As pessoas adoram falar sobre si mesmas quando sentem que alguém realmente se importa.
              </p>
              <p className="text-gray-400 leading-relaxed">
                O problema é que muitas conversas morrem porque as pessoas não sabem como mantê-las fluindo. Neste guia, você vai aprender técnicas práticas para nunca mais deixar uma conversa esfriar.
              </p>
            </div>
          </section>

          {/* Pillars */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Os 4 Pilares de uma <span className="text-purple-400">Boa Conversa</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {pillars.map((pillar, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                      {pillar.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{pillar.title}</h3>
                  </div>
                  <p className="text-gray-400">{pillar.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Flow Techniques */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Técnicas para Manter a <span className="text-purple-400">Conversa Fluindo</span>
            </h2>
            
            <div className="space-y-4">
              {flowTechniques.map((technique, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <h3 className="text-xl font-semibold mb-2 text-purple-400">{technique.name}</h3>
                  <p className="text-gray-400 mb-4">{technique.description}</p>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <span className="text-sm text-purple-300">Exemplo:</span>
                    <p className="text-white mt-1">"{technique.example}"</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Topics */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Assuntos para <span className="text-purple-400">Conversar</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target size={18} className="text-purple-400" />
                    {topic.category}
                  </h3>
                  <ul className="space-y-3">
                    {topic.questions.map((question, qIndex) => (
                      <li key={qIndex} className="text-gray-400 text-sm flex items-start gap-2">
                        <span className="text-purple-400 mt-1">→</span>
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Green and Red Flags */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Sinais de uma <span className="text-green-400">Boa</span> e <span className="text-red-400">Má</span> Conversa
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
                <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle size={20} />
                  Green Flags 🟢
                </h3>
                <ul className="space-y-3">
                  {greenFlags.map((flag, index) => (
                    <li key={index} className="text-gray-400 flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border-2 border-red-400 flex items-center justify-center text-xs">✕</span>
                  Red Flags 🔴
                </h3>
                <ul className="space-y-3">
                  {redFlags.map((flag, index) => (
                    <li key={index} className="text-gray-400 flex items-center gap-2">
                      <span className="text-red-400">✕</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Conversation Recovery */}
          <section className="mb-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Como Reviver uma Conversa que Esfriou</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Não leve para o pessoal</h3>
                    <p className="text-gray-400 text-sm">Às vezes as pessoas estão ocupadas. Espere alguns dias antes de tentar novamente.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Mande algo de valor</h3>
                    <p className="text-gray-400 text-sm">Um meme engraçado, um vídeo interessante ou algo que lembre vocês de uma conversa anterior.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Faça uma pergunta específica</h3>
                    <p className="text-gray-400 text-sm">"E aí, como foi aquela prova que você tava estudando?" mostra que você lembra e se importa.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Seja direto (se necessário)</h3>
                    <p className="text-gray-400 text-sm">"Ei, senti falta de conversar com você. Tá tudo bem?" - às vezes a honestidade funciona melhor.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Section */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-8 text-center">
              <MessageSquare className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Nunca Mais Fique Sem Resposta
              </h2>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                O <strong className="text-white">Puxe Assunto</strong> usa inteligência artificial para analisar suas conversas e sugerir as melhores respostas para manter o papo fluindo.
              </p>
              <button
                onClick={onAction}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-full font-semibold transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
              >
                Testar Gratuitamente
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
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                  Como Puxar Assunto →
                </h3>
                <p className="text-gray-500 text-sm">
                  Técnicas para iniciar conversas interessantes
                </p>
              </Link>
              
              <Link
                to="/blog/flerte"
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                  Como Flertar pelo WhatsApp →
                </h3>
                <p className="text-gray-500 text-sm">
                  Técnicas para criar atração nas conversas
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
