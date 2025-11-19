import React from 'react';
import { Star, Quote, BadgeCheck } from 'lucide-react';

const testimonials = [
  {
    name: "Pedro Henrique",
    handle: "@pedroh_99",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
    text: "Simples e direto. Tira o print, manda e pronto. Ajudou demais a quebrar o gelo naquele match que eu não sabia o que falar.",
    platform: "Tinder"
  },
  {
    name: "Lucas Silva",
    handle: "@lucassilva",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    text: "Cara, salvou meu date! Eu não sabia o que responder e a sugestão foi perfeita. Estamos saindo até hoje. Recomendo muito!",
    platform: "WhatsApp"
  },
  {
    name: "Julia Medeiros",
    handle: "@juliam_",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
    text: "Adorei as opções de tom. Às vezes quero ser engraçada, às vezes mais séria. Funciona muito bem para manter o papo vivo.",
    platform: "Instagram"
  },
  {
    name: "Fernanda Costa",
    handle: "@fefecosta",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
    text: "Eu sempre travava na hora de começar a conversa. O app me deu confiança pra mandar mensagem sem medo de ser chata.",
    platform: "Bumble"
  },
  {
    name: "Ricardo Oliveira",
    handle: "@rick_oli",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces",
    text: "Achei que ia ser robótico, mas as respostas são super naturais. Ninguém percebeu que tive uma 'ajudinha' haha.",
    platform: "WhatsApp"
  },
  {
    name: "Marina Dias",
    handle: "@mari_dias",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces",
    text: "Melhor ferramenta pra quem é tímida como eu. Uso sempre que o assunto morre.",
    platform: "Instagram"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section id="depoimentos" className="py-32 relative overflow-hidden bg-transparent">
      {/* Content */}
      <div className="relative z-10 mb-16 text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
           <BadgeCheck size={14} className="text-green-400" />
           <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">Social Proof</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Quem usou, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">aprovou.</span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          Junte-se a milhares de pessoas que melhoraram sua comunicação e conseguiram mais encontros.
        </p>
      </div>

      {/* Infinite Scroll Wrapper with CSS Mask for true transparency */}
      <div 
        className="relative w-full"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
      >
        
        <div className="flex flex-col gap-8">
          
          {/* Row 1 - Normal Direction */}
          <div className="flex w-max gap-6 animate-scroll group hover:[animation-play-state:paused]">
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={`row1-${i}`} data={t} />
            ))}
          </div>

          {/* Row 2 - Reverse Direction */}
          <div className="flex w-max gap-6 animate-scroll-reverse group hover:[animation-play-state:paused]">
            {[...testimonials.slice().reverse(), ...testimonials.slice().reverse()].map((t, i) => (
              <TestimonialCard key={`row2-${i}`} data={t} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

const TestimonialCard: React.FC<{ data: typeof testimonials[0] }> = ({ data }) => (
  <div className="w-[350px] md:w-[400px] bg-[#111]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-[#161616]/60 hover:border-white/10 transition-all duration-300 group cursor-default relative overflow-hidden">
    
    {/* Subtle Glow on Hover */}
    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

    <div className="flex items-start justify-between mb-4 relative z-10">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={data.avatar} alt={data.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/5" />
          <div className="absolute -bottom-1 -right-1 bg-[#111] rounded-full p-0.5">
            <div className="bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-[#111]"></div>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm">{data.name}</h4>
          <p className="text-xs text-gray-500">{data.handle}</p>
        </div>
      </div>
      <Quote className="text-white/10 fill-current group-hover:text-purple-500/20 transition-colors" size={32} />
    </div>
    
    <p className="text-gray-300 text-sm leading-relaxed mb-4 relative z-10">
      "{data.text}"
    </p>

    <div className="flex items-center justify-between border-t border-white/5 pt-4 relative z-10">
      <span className="text-xs font-medium text-gray-500 bg-white/5 px-2 py-1 rounded-md">
        {data.platform}
      </span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className="w-3.5 h-3.5 text-yellow-500 fill-current" />
        ))}
      </div>
    </div>
  </div>
);
