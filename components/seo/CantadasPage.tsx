import React from 'react';
import { ArrowLeft, Heart, Sparkles, MessageCircle, Zap, Star, ArrowRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';
import { SEOHead } from './SEOHead';

interface CantadasPageProps {
  onBack: () => void;
  onAction: () => void;
}

export const CantadasPage: React.FC<CantadasPageProps> = ({ onBack, onAction }) => {
  const cantadasCriativas = [
    {
      categoria: "Divertidas",
      cantadas: [
        "Se a beleza fosse crime, você estaria cumprindo prisão perpétua 🔒",
        "Você acredita em amor à primeira vista ou eu passo de novo? 😏",
        "Meu médico disse que estou com falta de vitamina 'Você' 💊",
        "Se eu fosse um semáforo, ficaria sempre vermelho pra você parar do meu lado 🚦"
      ]
    },
    {
      categoria: "Inteligentes",
      cantadas: [
        "Você deve ser Wi-Fi, porque estou sentindo uma conexão aqui 📶",
        "Se você fosse uma equação, seria a solução de todos os meus problemas ✨",
        "Você é como uma constante matemática: irracional e infinitamente interessante",
        "Se beleza fosse tempo, você seria a eternidade ⏰"
      ]
    },
    {
      categoria: "Românticas",
      cantadas: [
        "Você é o tipo de pessoa que eu gostaria de conhecer melhor... muito melhor 💫",
        "Seu sorriso é daqueles que fazem o dia parecer mais bonito ☀️",
        "Eu não acreditava em destino até cruzar com você",
        "Você tem algo especial que eu ainda não consigo explicar 💝"
      ]
    },
    {
      categoria: "Para Tinder/Apps",
      cantadas: [
        "Ok, você parece ser mais interessante que 99% dos perfis aqui. Prove que estou certo 😏",
        "Vi que você curte [hobby]. Aposto que tem uma história boa sobre isso",
        "Seu perfil me fez parar de scrollar. Isso é raro por aqui",
        "Entre todos os matches possíveis, eu escolhi você. Nenhuma pressão 😄"
      ]
    }
  ];

  const dicas = [
    {
      titulo: "Personalização é tudo",
      descricao: "Uma cantada genérica pode funcionar, mas uma personalizada baseada no perfil dela funciona 10x melhor.",
      icon: <Star className="w-6 h-6" />
    },
    {
      titulo: "Timing certo",
      descricao: "Não comece com cantada. Primeiro quebre o gelo, depois use com moderação.",
      icon: <Zap className="w-6 h-6" />
    },
    {
      titulo: "Leia o ambiente",
      descricao: "Se ela não reagir bem à primeira, não force. Mude o tom da conversa.",
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      titulo: "Humor > Seriedade",
      descricao: "Cantadas engraçadas funcionam melhor que as românticas logo de cara.",
      icon: <Flame className="w-6 h-6" />
    }
  ];

  const errosComuns = [
    "Usar cantadas muito longas - keep it short",
    "Ser vulgar ou sexual logo de cara",
    "Repetir a mesma cantada se não funcionou",
    "Não ter plano B se ela não reagir bem",
    "Usar cantadas copiadas do Google sem adaptar",
    "Parecer que você treinou isso o dia todo"
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-rose-500/30 relative overflow-hidden">
      <SEOHead
        title="100+ Cantadas Criativas para WhatsApp e Tinder que Funcionam | Puxe Assunto"
        description="As melhores cantadas criativas, inteligentes e engraçadas para usar no WhatsApp, Tinder e Instagram. Cantadas que realmente funcionam + dicas de como usar."
        keywords="cantadas criativas, cantadas para whatsapp, cantadas para tinder, cantadas engraçadas, cantadas inteligentes, melhores cantadas, cantadas que funcionam, cantadas romanticas"
        canonicalUrl="https://puxeassunto.com/blog/cantadas"
        ogType="article"
        articlePublishedTime="2025-01-01T00:00:00Z"
        articleModifiedTime="2025-12-23T00:00:00Z"
      />
      
      {/* Background Effects */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm mb-6">
              <Flame size={16} />
              Cantadas que Funcionam
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">100+ Cantadas</span>
              <br />Criativas e Inteligentes
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              As melhores cantadas para WhatsApp, Tinder e Instagram, organizadas por categoria. Plus: dicas de como usar sem parecer forçado.
            </p>

            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 rounded-full font-semibold text-lg transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
            >
              Gerar Cantadas com IA
              <ArrowRight size={20} />
            </button>
          </section>

          {/* Introduction */}
          <section className="mb-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4">Cantadas funcionam em 2025?</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                A verdade é: <strong className="text-white">cantadas ruins afundam conversas, mas cantadas certas criam conexão instantânea</strong>. O segredo não é a cantada em si, mas como e quando você usa.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Uma cantada bem colocada mostra senso de humor e confiança. Usada errado, parece desespero. Neste guia, você vai aprender a diferença.
              </p>
            </div>
          </section>

          {/* Cantadas por Categoria */}
          {cantadasCriativas.map((categoria, catIndex) => (
            <section key={catIndex} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Heart className="text-rose-400" size={24} />
                Cantadas {categoria.categoria}
              </h2>
              
              <div className="grid gap-4">
                {categoria.cantadas.map((cantada, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-orange-500/30 transition-colors group"
                  >
                    <p className="text-gray-200 text-lg">"{cantada}"</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Dicas */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Como Usar <span className="text-orange-400">Sem Parecer Forçado</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {dicas.map((dica, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-orange-500/30 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
                      {dica.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{dica.titulo}</h3>
                  </div>
                  <p className="text-gray-400">{dica.descricao}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Erros */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Erros que <span className="text-red-400">Destroem</span> sua Cantada
            </h2>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {errosComuns.map((erro, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-400">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-400 text-sm">✕</span>
                    </div>
                    {erro}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-orange-500/10 to-rose-500/10 border border-orange-500/20 rounded-2xl p-8 text-center">
              <Sparkles className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Cansado de Cantadas Genéricas?
              </h2>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                O <strong className="text-white">Puxe Assunto</strong> analisa a conversa e cria respostas personalizadas que parecem naturais, não decoradas.
              </p>
              <button
                onClick={onAction}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 rounded-full font-semibold transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
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
                to="/blog/flerte"
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-orange-500/30 transition-all group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-orange-400 transition-colors">
                  Como Flertar pelo WhatsApp →
                </h3>
                <p className="text-gray-500 text-sm">
                  Técnicas avançadas de flerte para depois da cantada
                </p>
              </Link>
              
              <Link
                to="/blog/puxar-assunto"
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-orange-500/30 transition-all group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-orange-400 transition-colors">
                  Como Puxar Assunto →
                </h3>
                <p className="text-gray-500 text-sm">
                  Quando a cantada não é a melhor opção
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
