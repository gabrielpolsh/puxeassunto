import React from 'react';
import { ArrowLeft, Flame, Sparkles, MessageCircle, Zap, Star, ArrowRight, Heart, Target, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';
import { SEOHead } from './SEOHead';

interface TinderDicasPageProps {
  onBack: () => void;
  onAction: () => void;
}

export const TinderDicasPage: React.FC<TinderDicasPageProps> = ({ onBack, onAction }) => {
  const dicasPerfil = [
    {
      titulo: "Foto principal matadora",
      descricao: "Sua primeira foto decide 80% dos swipes. Use uma foto clara, com boa luz, sorrindo naturalmente. Evite selfies no espelho.",
      icon: <Star className="w-6 h-6" />
    },
    {
      titulo: "Bio que gera curiosidade",
      descricao: "Nada de 'procurando alguém especial'. Use humor, mencione hobbies específicos e deixe ganchos para puxar assunto.",
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      titulo: "Variedade de fotos",
      descricao: "Mostre diferentes lados: viajando, com amigos, praticando hobby. 4-6 fotos é o ideal.",
      icon: <Target className="w-6 h-6" />
    },
    {
      titulo: "Sem erros básicos",
      descricao: "Nada de fotos de grupo onde não dá pra saber quem é você, fotos com ex (mesmo cortada), ou só fotos de academia.",
      icon: <Zap className="w-6 h-6" />
    }
  ];

  const primeirasMensagens = [
    {
      errado: "Oi, tudo bem?",
      certo: "Vi que você curte [hobby do perfil]. Qual foi a última vez que você [ação relacionada]?",
      porque: "Mostra que você leu o perfil e gera assunto imediato"
    },
    {
      errado: "Oi linda 😍",
      certo: "Okay, sua foto em [lugar] me fez parar de scrollar. Você mora lá ou foi viagem?",
      porque: "Elogio indireto + pergunta específica"
    },
    {
      errado: "Quer sair?",
      certo: "Seu perfil tem vibe de quem curte [algo]. Acertei ou chutei mal?",
      porque: "Cria um jogo e convida ela a responder"
    },
    {
      errado: "Você é muito gata",
      certo: "Acabei de ver sua bio e [comentário engraçado sobre algo específico]. Isso é real ou marketing pessoal? 😏",
      porque: "Humor + demonstra que você leu a bio"
    }
  ];

  const regrasOuro = [
    "Responda em até 24h - Tinder penaliza quem demora",
    "Leve a conversa para fora do app em até 10 mensagens",
    "Seja específico no convite: dia, hora e lugar",
    "Não seja o cara do 'vamos marcar qualquer dia'",
    "Se ela responder seco 2x seguidas, próximo match",
    "Não mande textão - mensagens curtas e dinâmicas",
    "Use o nome dela na conversa (cria conexão)",
    "Tenha um plano B se ela recusar a primeira proposta"
  ];

  const errosMatadores = [
    {
      erro: "Bio vazia ou 'pergunte'",
      impacto: "Reduz matches em até 40%"
    },
    {
      erro: "Só fotos de rosto/selfie",
      impacto: "Parece que você não tem vida social"
    },
    {
      erro: "Demorar dias para responder",
      impacto: "O match esfria e o algoritmo te pune"
    },
    {
      erro: "Pedir Instagram logo de cara",
      impacto: "Parece que você só quer followers"
    },
    {
      erro: "Conversa genérica por semanas",
      impacto: "Ela perde interesse - timing é tudo"
    },
    {
      erro: "Mandar 'kkk' ou 'rs' como resposta",
      impacto: "Mata qualquer fluxo de conversa"
    }
  ];

  const exemplosBio = [
    {
      bio: "Engenheiro de dia, chef de comida queimada à noite 🍳 Procurando alguém pra dividir uma pizza e debater se Die Hard é filme de Natal",
      porque: "Humor + hobby + gancho para conversa"
    },
    {
      bio: "1,80m porque aparentemente isso importa | Último livro: [nome] | Me convença a sair do sofá 🛋️",
      porque: "Auto-ironia + interesse + call to action"
    },
    {
      bio: "Advogado que não parece advogado | Trilhas > Baladas | Café > Álcool | Swipe direita se você discorda de pelo menos uma coisa",
      porque: "Profissão + personalidade + provocação"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-rose-500/30 relative overflow-hidden">
      <SEOHead
        title="Dicas de Tinder 2025: Como Conseguir Mais Matches e Conversas | Puxe Assunto"
        description="Guia completo de Tinder: como montar um perfil que gera matches, primeiras mensagens que funcionam, erros que destroem suas chances e como levar pro date."
        keywords="dicas tinder, como usar tinder, conseguir matches tinder, primeira mensagem tinder, bio tinder, perfil tinder, conversa tinder, tinder 2025"
        canonicalUrl="https://puxeassunto.com/blog/tinder-dicas"
        ogType="article"
        articlePublishedTime="2025-01-01T00:00:00Z"
        articleModifiedTime="2025-12-23T00:00:00Z"
      />
      
      {/* Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-orange-500/10 border border-pink-500/20 rounded-full text-pink-400 text-sm mb-6">
              <Flame size={16} />
              Guia Tinder 2025
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Como Dominar o <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-orange-400 to-red-500">Tinder</span>
              <br />e Conseguir Mais Matches
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Do perfil perfeito à primeira mensagem, passando pelos erros que estão destruindo suas chances. Guia completo para 2025.
            </p>

            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 rounded-full font-semibold text-lg transition-all shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105"
            >
              Gerar Mensagens com IA
              <ArrowRight size={20} />
            </button>
          </section>

          {/* Perfil Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Montando um <span className="text-pink-400">Perfil Irresistível</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {dicasPerfil.map((dica, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-pink-500/30 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400">
                      {dica.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{dica.titulo}</h3>
                  </div>
                  <p className="text-gray-400">{dica.descricao}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Exemplos de Bio */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">
              Exemplos de <span className="text-pink-400">Bio que Funcionam</span>
            </h2>
            
            <div className="space-y-4">
              {exemplosBio.map((exemplo, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <p className="text-gray-200 text-lg mb-3">"{exemplo.bio}"</p>
                  <p className="text-sm text-green-400 flex items-center gap-2">
                    <CheckCircle size={14} />
                    {exemplo.porque}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Primeiras Mensagens */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Primeira Mensagem: <span className="text-orange-400">Errado vs Certo</span>
            </h2>
            
            <div className="space-y-6">
              {primeirasMensagens.map((exemplo, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <div className="text-red-400 text-sm font-medium mb-2 flex items-center gap-2">
                        <XCircle size={14} />
                        Evite
                      </div>
                      <p className="text-gray-300">"{exemplo.errado}"</p>
                    </div>
                    
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="text-green-400 text-sm font-medium mb-2 flex items-center gap-2">
                        <CheckCircle size={14} />
                        Melhor
                      </div>
                      <p className="text-gray-300">"{exemplo.certo}"</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 italic">💡 {exemplo.porque}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Regras de Ouro */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">
              8 Regras de <span className="text-yellow-400">Ouro</span>
            </h2>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {regrasOuro.map((regra, index) => (
                  <div key={index} className="flex items-start gap-3 text-gray-300">
                    <span className="text-yellow-400 font-bold text-lg">{index + 1}.</span>
                    {regra}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Erros Matadores */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Erros que <span className="text-red-400">Destroem</span> seus Matches
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {errosMatadores.map((item, index) => (
                <div
                  key={index}
                  className="bg-red-500/5 border border-red-500/20 rounded-xl p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle size={16} className="text-red-400" />
                    <span className="font-medium text-gray-200">{item.erro}</span>
                  </div>
                  <p className="text-sm text-red-300/70">{item.impacto}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-pink-500/10 to-orange-500/10 border border-pink-500/20 rounded-2xl p-8 text-center">
              <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Travou na Conversa do Match?
              </h2>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                O <strong className="text-white">Puxe Assunto</strong> analisa sua conversa e sugere a resposta perfeita para manter o papo fluindo até o date.
              </p>
              <button
                onClick={onAction}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 rounded-full font-semibold transition-all shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105"
              >
                Testar Grátis
                <ArrowRight size={20} />
              </button>
            </div>
          </section>

          {/* Related Articles */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Artigos Relacionados</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/blog/cantadas"
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-pink-500/30 transition-all group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-pink-400 transition-colors">
                  100+ Cantadas Criativas →
                </h3>
                <p className="text-gray-500 text-sm">
                  Cantadas testadas para Tinder e apps de namoro
                </p>
              </Link>
              
              <Link
                to="/blog/flerte"
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-pink-500/30 transition-all group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-pink-400 transition-colors">
                  Como Flertar pelo Chat →
                </h3>
                <p className="text-gray-500 text-sm">
                  Técnicas avançadas para depois do match
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
