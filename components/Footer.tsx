import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-black border-t border-white/5 text-sm text-gray-500">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-white font-bold text-lg">Puxe Assunto.</span>
          <p className="mt-2">© 2024 Todos os direitos reservados.</p>
        </div>
        
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          <a href="#" className="hover:text-white transition-colors">Contato</a>
        </div>
      </div>
    </footer>
  );
};