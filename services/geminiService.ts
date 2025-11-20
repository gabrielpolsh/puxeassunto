import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export interface Suggestion {
  tone: string;
  message: string;
  explanation: string;
}

export interface AnalysisResult {
  title: string;
  suggestions: Suggestion[];
}

export const analyzeChatScreenshot = async (base64Image: string, userContext?: string): Promise<AnalysisResult> => {
  if (!API_KEY) {
    // Fallback for demo purposes if no API key is present in environment
    console.warn("No API Key found. Returning mock data.");
    return new Promise(resolve => setTimeout(() => resolve({
      title: "Conversa Exemplo",
      suggestions: [
        { tone: "Engraçado", message: "Essa é a hora que eu finjo que não vi e a gente recomeça? 😂", explanation: "Quebra o gelo com humor." },
        { tone: "Curioso", message: "Tô curioso... o que aconteceu depois disso?", explanation: "Mostra interesse na história." },
        { tone: "Direto", message: "Topa continuar esse papo pessoalmente?", explanation: "Para quem quer agilizar o encontro." },
        { tone: "Ousado", message: "Se você for tão interessante ao vivo quanto por msg, tô com problemas.", explanation: "Elogio com desafio." },
        { tone: "Descontraído", message: "Nota 10 pra essa história, mas quero saber a versão sem cortes.", explanation: "Mantém a leveza e curiosidade." }
      ]
    }), 2000));
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Remove header if present (data:image/png;base64,)
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    let prompt = `
      Atue como um especialista em "Game" e conquista digital (Tinder, Bumble, Instagram, WhatsApp).
      
      ANÁLISE VISUAL CRÍTICA:
      - Mensagens à DIREITA (Verde/Azul/etc) são MINHAS (do usuário).
      - Mensagens à ESQUERDA (Cinza/Branco) são DELA/DELE (do "alvo").
      - O objetivo é sugerir o que EU (Direita) devo enviar para ELA/ELE (Esquerda).

      CENÁRIOS POSSÍVEIS (Identifique qual se aplica):
      1. RESPOSTA: Se a última mensagem for da Esquerda, sugira uma resposta inteligente/engraçada/provocativa.
      2. CONTINUAÇÃO: Se a última mensagem for da Direita (vácuo ou conversa morreu), sugira um "reviver" de assunto ou uma mudança de tópico (double text estratégico).
      3. ABERTURA: Se for um perfil ou foto sem chat, sugira um abridor (opener) criativo baseado em detalhes da foto/bio.

      Diretrizes de Estilo:
      - EXTREMAMENTE CONCISO: Mensagens curtas (1-2 frases).
      - NATURALIDADE: Use gírias leves, sem pontuação excessiva, pareça humano.
      - ZERO GENÉRICO: Proibido "Oi tudo bem". Use detalhes específicos da imagem.
      
      Tarefas:
      1. Crie um TÍTULO curto (max 4 palavras) resumindo o contexto.
      2. Gere 5 sugestões de resposta com tons variados (ex: Engraçado, Ousado, Casual, Provocativo, Curioso).
      
      Retorne APENAS um JSON válido com o seguinte formato (sem markdown):
      {
        "title": "Título do Contexto",
        "suggestions": [
          { "tone": "Tom (ex: Ousado)", "message": "Texto da mensagem", "explanation": "Por que funciona" }
        ]
      }
    `;

    if (userContext) {
      prompt += `\n\nCONTEXTO ADICIONAL DO USUÁRIO (Considere isso na resposta): "${userContext}"`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', 
              data: cleanBase64
            }
          },
          { text: prompt }
        ]
      }
    });

    const text = response.text || '{}';
    // Clean up potential markdown code blocks
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(cleanText);
    
    // Ensure compatibility if AI returns array directly (legacy handling)
    if (Array.isArray(parsed)) {
      return { title: "Nova Análise", suggestions: parsed };
    }
    
    return parsed as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini:", error);
    throw error;
  }
};