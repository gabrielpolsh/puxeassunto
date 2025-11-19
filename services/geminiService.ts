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
        { tone: "Direto", message: "Topa continuar esse papo pessoalmente?", explanation: "Para quem quer agilizar o encontro." }
      ]
    }), 2000));
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Remove header if present (data:image/png;base64,)
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    let prompt = `
      Você é um especialista em namoro e comunicação social ("Puxe Assunto").
      Analise a imagem fornecida, que é um print de uma conversa (provavelmente WhatsApp, Instagram ou Tinder).
      
      Tarefas:
      1. Identifique o assunto principal ou contexto e crie um TÍTULO curto e atrativo para essa conversa (Máximo 4 palavras).
      2. Sugira 3 opções de resposta criativas e distintas em Português do Brasil.
      
      Retorne APENAS um JSON válido com o seguinte formato (sem markdown):
      {
        "title": "Título curto do assunto (ex: Flerte na Academia, Discussão sobre Filmes)",
        "suggestions": [
          { "tone": "Nome do Tom", "message": "A sugestão de texto", "explanation": "Breve explicação" }
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