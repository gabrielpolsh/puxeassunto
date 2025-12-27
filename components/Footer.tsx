import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-black border-t border-white/5 text-sm text-gray-400">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <span className="text-white font-bold text-lg">Puxe Assunto.</span>
            <p className="mt-2 text-gray-400">© 2025 Todos os direitos reservados.</p>
          </div>
          
          <div className="flex gap-8">
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Termos de Uso</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacidade</Link>
            <a href="mailto:contato@puxeassunto.com" className="text-gray-400 hover:text-white transition-colors">Contato</a>
          </div>
        </div>

        {/* SEO Blog Links */}
        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-xs">Aprenda mais:</p>
            <Link to="/blog" className="text-xs text-rose-400 hover:text-rose-300 transition-colors">
              Ver todos os artigos →
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <Link to="/blog/puxar-assunto" className="text-gray-400 hover:text-rose-400 transition-colors">
              Como Puxar Assunto
            </Link>
            <Link to="/blog/flerte" className="text-gray-400 hover:text-rose-400 transition-colors">
              Como Flertar pelo WhatsApp
            </Link>
            <Link to="/blog/conversas" className="text-gray-400 hover:text-rose-400 transition-colors">
              Conversas Interessantes
            </Link>
            <Link to="/blog/cantadas" className="text-gray-400 hover:text-rose-400 transition-colors">
              Cantadas Criativas
            </Link>
            <Link to="/blog/tinder-dicas" className="text-gray-400 hover:text-rose-400 transition-colors">
              Dicas de Tinder
            </Link>
            <Link to="/blog/respostas-whatsapp" className="text-gray-400 hover:text-rose-400 transition-colors">
              Respostas WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};