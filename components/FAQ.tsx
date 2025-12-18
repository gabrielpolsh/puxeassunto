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
                  <Minus className="text-rose-500" />
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

        {/* Botão WhatsApp */}
        <div className="mt-12 text-center">
          <a
            href="https://wa.me/5561981620092?text=Olá!%20Vim%20pelo%20site%20Puxe%20Assunto%20e%20gostaria%20de%20saber%20mais."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 md:gap-3 px-5 py-3 md:px-8 md:py-4 bg-green-500 hover:bg-green-600 text-white text-sm md:text-base font-semibold rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all hover:scale-105"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 md:w-6 md:h-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="hidden md:inline">Dúvidas? Entre em contato com o suporte</span>
            <span className="md:hidden">Falar com suporte</span>
          </a>
        </div>
      </div>
    </section>
  );
};
