import React from 'react';
import { ArrowLeft, MessageCircle, Sparkles, Zap, ArrowRight, CheckCircle, Copy, Lightbulb, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';
import { SEOHead } from './SEOHead';

interface RespostasWhatsAppPageProps {
  onBack: () => void;
  onAction: () => void;
}

export const RespostasWhatsAppPage: React.FC<RespostasWhatsAppPageProps> = ({ onBack, onAction }) => {
  const situacoes = [
    {
      situacao: "Ela respondeu seco",
      mensagemDela: "aham",
      respostaRuim: "kk",
      respostasBoas: [
        "Percebi uma vibe estranha... aconteceu algo ou eu fiz alguma coisa? 🤔",
        "Ok, parece que você tá ocupada. Me chama quando quiser conversar de verdade 😊",
        "Hmm, essa resposta me deixou curioso. O que você tá fazendo de interessante aí?"
      ]
    },
    {
      situacao: "Ela disse que está ocupada",
      mensagemDela: "Tô ocupada agora",
      respostaRuim: "Tá bom então",
      respostasBoas: [
        "Sem stress! Me manda um salve quando estiver livre. Vou estar por aqui (provavelmente procrastinando) 😄",
        "Entendo! Só passa aqui depois, tenho uma coisa pra te contar",
        "Tudo bem! Boa sorte aí. Não trabalha demais 💪"
      ]
    },
    {
      situacao: "Ela visualizou e não respondeu",
      mensagemDela: "[visualizado]",
      respostaRuim: "'???' ou 'oi?'",
      respostasBoas: [
        "[Espere 24h] Ei, lembrei de você quando vi [algo relacionado a ela]. Como você tá?",
        "[Mude o assunto] Acabei de ver uma coisa que você ia achar muito engraçado...",
        "[Seja direto após alguns dias] Opa, sumiu! Tudo bem por aí?"
      ]
    },
    {
      situacao: "A conversa esfriou",
      mensagemDela: "kkkk verdade",
      respostaRuim: "pois é kkk",
      respostasBoas: [
        "Falando nisso, você já [pergunta sobre hobby/interesse dela]?",
        "Mudando de assunto... preciso da sua opinião expert sobre uma coisa",
        "Ei, isso me lembrou... você ainda [atividade que ela mencionou antes]?"
      ]
    },
    {
      situacao: "Ela está brava com você",
      mensagemDela: "Tô puta com você",
      respostaRuim: "Que exagero",
      respostasBoas: [
        "Entendo que você tá chateada. Quer me contar o que aconteceu?",
        "Ok, respiro fundo. O que eu fiz? Quero entender de verdade",
        "Eu sei que você tá irritada, e provavelmente tem razão. Vamos conversar?"
      ]
    },
    {
      situacao: "Primeiro contato após match",
      mensagemDela: "[Match recente]",
      respostaRuim: "Oi, tudo bem?",
      respostasBoas: [
        "Vi que você curte [hobby do perfil]. Qual foi a última vez que você [atividade]?",
        "Ok, sua foto em [lugar] me ganhou. Você mora lá ou foi viagem?",
        "Seu perfil me fez rir. Especialmente a parte do [detalhe específico]. Isso é real? 😂"
      ]
    }
  ];

  const dicasGerais = [
    {
      titulo: "Nunca responda monossilábico",
      descricao: "Se ela mandou 'aham', não mande 'kk'. Sempre adicione algo novo ou mude o assunto.",
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      titulo: "Faça perguntas abertas",
      descricao: "Perguntas que não podem ser respondidas com sim/não mantêm a conversa viva.",
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      titulo: "Use o nome dela",
      descricao: "Chamar pelo nome cria conexão e atenção. Use com moderação, 1-2x por conversa.",
      icon: <Heart className="w-6 h-6" />
    },
    {
      titulo: "Timing é tudo",
      descricao: "Não responda instantaneamente sempre, mas também não demore dias. 15min a 2h é ideal.",
      icon: <Zap className="w-6 h-6" />
    }
  ];

  const frasesProibidas = [
    { frase: "Oi, tudo bem?", problema: "Genérico demais, não gera engajamento" },
    { frase: "'???' ou 'oi?'", problema: "Parece desespero, pressiona ela" },
    { frase: "'kkkk' como resposta única", problema: "Mata a conversa instantaneamente" },
    { frase: "Fala cmg", problema: "Soa carente e desesperado" },
    { frase: "Tá me ignorando?", problema: "Pressão negativa, afasta mais" },
    { frase: "Oi sumida", problema: "Clichê, não demonstra criatividade" }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-rose-500/30 relative overflow-hidden">
      <SEOHead
        title="O Que Responder no WhatsApp: 50+ Respostas para Toda Situação | Puxe Assunto"
        description="Não sabe o que responder? Respostas prontas para quando ela responde seco, visualiza e não responde, a conversa esfria ou ela está brava. Exemplos práticos!"
        keywords="o que responder no whatsapp, respostas para whatsapp, ela visualizou e não respondeu, conversa travou, ela respondeu seco, como responder crush, respostas criativas whatsapp"
        canonicalUrl="https://puxeassunto.com/blog/respostas-whatsapp"
        ogType="article"
        articlePublishedTime="2025-01-01T00:00:00Z"
        articleModifiedTime="2025-12-23T00:00:00Z"
      />
      
      {/* Background Effects */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm mb-6">
              <MessageCircle size={16} />
              Respostas Prontas
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              O Que <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Responder</span>
              <br />em Toda Situação
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Ela respondeu seco? Visualizou e sumiu? Conversa travou? Aqui estão as respostas que funcionam para cada situação.
            </p>

            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-full font-semibold text-lg transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105"
            >
              Gerar Respostas com IA
              <ArrowRight size={20} />
            </button>
          </section>

          {/* Dicas Gerais */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Regras de <span className="text-green-400">Ouro</span> para Respostas
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {dicasGerais.map((dica, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-green-500/30 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
                      {dica.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{dica.titulo}</h3>
                  </div>
                  <p className="text-gray-400">{dica.descricao}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Situações */}
          {situacoes.map((item, index) => (
            <section key={index} className="mb-12">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                    Situação {index + 1}
                  </span>
                  <h2 className="text-xl font-bold">{item.situacao}</h2>
                </div>
                
                <div className="mb-6">
                  <span className="text-gray-500 text-sm">Ela mandou:</span>
                  <div className="bg-gray-800/50 rounded-lg p-3 mt-1 inline-block">
                    <p className="text-gray-300">{item.mensagemDela}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <span className="text-red-400 text-sm font-medium flex items-center gap-2 mb-2">
                      ❌ Não responda assim
                    </span>
                    <p className="text-gray-400">"{item.respostaRuim}"</p>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <span className="text-green-400 text-sm font-medium flex items-center gap-2 mb-2">
                      ✓ Opções melhores
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {item.respostasBoas.map((resposta, idx) => (
                    <div
                      key={idx}
                      className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 flex items-center justify-between group hover:border-green-500/40 transition-colors"
                    >
                      <p className="text-gray-200">"{resposta}"</p>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg">
                        <Copy size={16} className="text-green-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}

          {/* Frases Proibidas */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Frases <span className="text-red-400">Proibidas</span>
            </h2>
            
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
              <div className="grid gap-4">
                {frasesProibidas.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="text-red-400 text-xl">✕</span>
                    <div>
                      <p className="text-gray-200 font-medium">"{item.frase}"</p>
                      <p className="text-gray-500 text-sm mt-1">{item.problema}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8 text-center">
              <Sparkles className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Respostas Personalizadas com IA
              </h2>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Cada conversa é única. O <strong className="text-white">Puxe Assunto</strong> analisa o contexto real da sua conversa e sugere a resposta perfeita para a situação.
              </p>
              <button
                onClick={onAction}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-full font-semibold transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105"
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
                to="/blog/conversas"
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-green-500/30 transition-all group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-green-400 transition-colors">
                  Como Ter Conversas Interessantes →
                </h3>
                <p className="text-gray-500 text-sm">
                  Técnicas para nunca deixar a conversa morrer
                </p>
              </Link>
              
              <Link
                to="/blog/puxar-assunto"
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-green-500/30 transition-all group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-green-400 transition-colors">
                  Como Puxar Assunto →
                </h3>
                <p className="text-gray-500 text-sm">
                  Comece conversas da forma certa
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
