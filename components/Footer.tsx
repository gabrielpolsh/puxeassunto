import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-black border-t border-white/5 text-sm text-gray-500">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <span className="text-white font-bold text-lg">Puxe Assunto.</span>
            <p className="mt-2">© 2025 Todos os direitos reservados.</p>
          </div>
          
          <div className="flex gap-8">
            <Link to="/terms" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
            <a href="mailto:contato@puxeassunto.com" className="hover:text-white transition-colors">Contato</a>
          </div>
        </div>

        {/* SEO Blog Links */}
        <div className="pt-6 border-t border-white/5">
          <p className="text-gray-600 text-xs mb-3">Aprenda mais:</p>
          <div className="flex flex-wrap gap-4 text-xs">
            <Link to="/blog/puxar-assunto" className="hover:text-rose-400 transition-colors">
              Como Puxar Assunto
            </Link>
            <Link to="/blog/flerte" className="hover:text-rose-400 transition-colors">
              Como Flertar pelo WhatsApp
            </Link>
            <Link to="/blog/conversas" className="hover:text-rose-400 transition-colors">
              Conversas Interessantes
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};