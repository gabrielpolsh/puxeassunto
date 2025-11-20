import React from 'react';
import { ArrowLeft, Shield, FileText } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onBack }) => {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Política de Privacidade' : 'Termos de Uso';
  const icon = isPrivacy ? <Shield className="w-8 h-8 text-purple-500" /> : <FileText className="w-8 h-8 text-purple-500" />;
  const lastUpdated = '20 de Novembro de 2025';

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Voltar
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
              {icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
              <p className="text-gray-400 mt-1">Última atualização: {lastUpdated}</p>
            </div>
          </div>

          <div className="prose prose-invert prose-purple max-w-none text-gray-300">
            {isPrivacy ? (
              <>
                <p>
                  A sua privacidade é importante para nós. É política do Puxe Assunto respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Puxe Assunto, e outros sites que possuímos e operamos.
                </p>

                <h3>1. Informações que coletamos</h3>
                <p>
                  Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
                </p>
                <p>
                  Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
                </p>

                <h3>2. Compartilhamento de dados</h3>
                <p>
                  Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
                </p>

                <h3>3. Cookies</h3>
                <p>
                  O nosso site usa cookies para melhorar a experiência do usuário. Ao usar nosso site, você concorda com o uso de cookies de acordo com nossa política de cookies.
                </p>

                <h3>4. Compromisso do Usuário</h3>
                <p>
                  O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Puxe Assunto oferece no site e com caráter enunciativo, mas não limitativo:
                </p>
                <ul>
                  <li>A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;</li>
                  <li>B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</li>
                  <li>C) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do Puxe Assunto, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.</li>
                </ul>

                <h3>5. Mais informações</h3>
                <p>
                  Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.
                </p>
              </>
            ) : (
              <>
                <h3>1. Termos</h3>
                <p>
                  Ao acessar ao site Puxe Assunto, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.
                </p>

                <h3>2. Uso de Licença</h3>
                <p>
                  É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Puxe Assunto , apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:
                </p>
                <ul>
                  <li>modificar ou copiar os materiais;</li>
                  <li>usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
                  <li>tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Puxe Assunto;</li>
                  <li>remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li>
                  <li>transferir os materiais para outra pessoa ou 'espelhe' os materiais em qualquer outro servidor.</li>
                </ul>
                <p>
                  Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por Puxe Assunto a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrónico ou impresso.
                </p>

                <h3>3. Isenção de responsabilidade</h3>
                <p>
                  Os materiais no site da Puxe Assunto são fornecidos 'como estão'. Puxe Assunto não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
                </p>
                <p>
                  Além disso, o Puxe Assunto não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ​​ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.
                </p>

                <h3>4. Limitações</h3>
                <p>
                  Em nenhum caso o Puxe Assunto ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Puxe Assunto, mesmo que Puxe Assunto ou um representante autorizado da Puxe Assunto tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos conseqüentes ou incidentais, essas limitações podem não se aplicar a você.
                </p>

                <h3>5. Precisão dos materiais</h3>
                <p>
                  Os materiais exibidos no site da Puxe Assunto podem incluir erros técnicos, tipográficos ou fotográficos. Puxe Assunto não garante que qualquer material em seu site seja preciso, completo ou atual. Puxe Assunto pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, Puxe Assunto não se compromete a atualizar os materiais.
                </p>

                <h3>6. Links</h3>
                <p>
                  O Puxe Assunto não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Puxe Assunto do site. O uso de qualquer site vinculado é por conta e risco do usuário.
                </p>

                <h3>Modificações</h3>
                <p>
                  O Puxe Assunto pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
                </p>

                <h3>Lei aplicável</h3>
                <p>
                  Estes termos e condições são regidos e interpretados de acordo com as leis do Puxe Assunto e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
