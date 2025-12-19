import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

// Nomes brasileiros realistas
const nomesHomens = ['Lucas', 'Gabriel', 'Matheus', 'Pedro', 'Rafael', 'Bruno', 'Gustavo', 'Thiago', 'Felipe', 'João', 'Carlos', 'André', 'Diego', 'Marcos', 'Daniel'];
const nomesMulheres = ['Ana', 'Julia', 'Maria', 'Camila', 'Beatriz', 'Larissa', 'Fernanda', 'Amanda', 'Carolina', 'Patricia', 'Isabela', 'Leticia', 'Mariana', 'Bruna', 'Gabriela'];
const cidades = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Salvador', 'Brasília', 'Fortaleza', 'Recife', 'Goiânia', 'Campinas', 'Florianópolis'];

interface Notificacao {
    id: number;
    nome: string;
    cidade: string;
    tempoAtras: string;
}

const gerarNotificacao = (): Notificacao => {
    const todosNomes = [...nomesHomens, ...nomesMulheres];
    const nome = todosNomes[Math.floor(Math.random() * todosNomes.length)];
    const cidade = cidades[Math.floor(Math.random() * cidades.length)];
    
    // Tempo aleatório entre 1-15 minutos
    const minutos = Math.floor(Math.random() * 15) + 1;
    const tempoAtras = minutos === 1 ? '1 minuto atrás' : `${minutos} minutos atrás`;
    
    return {
        id: Date.now(),
        nome: nome + ' ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + '.',
        cidade,
        tempoAtras
    };
};

export const NotificacoesCompra: React.FC = () => {
    const [notificacao, setNotificacao] = useState<Notificacao | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Primeira notificação após 8-15 segundos
        const primeiroDelay = Math.random() * 7000 + 8000;
        
        const mostrarNotificacao = () => {
            const nova = gerarNotificacao();
            setNotificacao(nova);
            setIsVisible(true);
            
            // Esconder após 5 segundos
            setTimeout(() => {
                setIsVisible(false);
            }, 5000);
        };

        // Primeira exibição
        const primeiroTimeout = setTimeout(mostrarNotificacao, primeiroDelay);

        // Repetir a cada 25-45 segundos
        const intervalo = setInterval(() => {
            const delay = Math.random() * 20000 + 25000;
            setTimeout(mostrarNotificacao, delay);
        }, 45000);

        return () => {
            clearTimeout(primeiroTimeout);
            clearInterval(intervalo);
        };
    }, []);

    const fechar = () => {
        setIsVisible(false);
    };

    if (!notificacao) return null;

    return (
        <div 
            className={`fixed bottom-4 left-4 z-50 transition-all duration-500 ${
                isVisible 
                    ? 'translate-x-0 opacity-100' 
                    : '-translate-x-full opacity-0'
            }`}
        >
            <div className="bg-[#111] border border-green-500/30 rounded-xl p-4 shadow-2xl shadow-green-900/20 max-w-xs">
                {/* Close button */}
                <button 
                    onClick={fechar}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                    <X size={12} />
                </button>
                
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle2 size={20} className="text-green-400" />
                    </div>
                    
                    {/* Content */}
                    <div>
                        <p className="text-white text-sm font-semibold">
                            {notificacao.nome}
                        </p>
                        <p className="text-gray-400 text-xs">
                            Assinou o PRO de {notificacao.cidade}
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                            {notificacao.tempoAtras}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
