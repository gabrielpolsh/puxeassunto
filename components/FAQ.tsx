import React, { useState } from 'react';
import { ChevronDown, Plus, Minus, BadgeCheck } from 'lucide-react';

const faqs = [
  {
    question: "É gratuito para testar?",
    answer: "Sim! Você tem direito a 3 análises gratuitas por dia para testar a ferramenta e ver como ela transforma suas conversas."
  },
  {
    question: "Funciona com quais aplicativos?",
    answer: "O Puxe Assunto analisa prints de qualquer aplicativo de mensagens: WhatsApp, Instagram (Direct), Tinder, Bumble, Hinge, entre outros."
  },
  {
    question: "Minhas conversas são salvas?",
    answer: "Não. Priorizamos sua privacidade. As imagens são processadas pela IA e descartadas logo em seguida. Nenhuma conversa é armazenada em nossos servidores."
  },
  {
    question: "A IA entende áudio?",
    answer: "No momento, nossa tecnologia é focada na análise visual de prints (texto na imagem). Estamos trabalhando para suportar transcrição de áudio em breve!"
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative z-10 scroll-mt-32">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                <BadgeCheck size={14} className="text-green-400" />
                <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">Tire suas dúvidas</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
            Dúvidas Frequentes
            </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-white/5 rounded-xl bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <button 
                className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={`text-lg font-medium transition-colors ${openIndex === index ? 'text-white' : 'text-gray-200'}`}>
                    {faq.question}
                </span>
                {openIndex === index ? (
                  <Minus className="text-brand-pink" />
                ) : (
                  <Plus className="text-gray-500" />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-5 text-gray-400 leading-relaxed border-t border-white/5 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
