import { GoogleGenAI } from "@google/genai";
import { supabase } from '../lib/supabase';

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

// Helper function to compress base64 image
const compressBase64Image = async (base64String: string, maxSizeKB: number = 200): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions to reduce file size
      const maxDimension = 1024;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Try different quality levels to meet size requirement
      let quality = 0.8;
      let compressed = canvas.toDataURL('image/jpeg', quality);
      
      // Iteratively reduce quality if still too large
      while (compressed.length > maxSizeKB * 1024 && quality > 0.1) {
        quality -= 0.1;
        compressed = canvas.toDataURL('image/jpeg', quality);
      }
      
      resolve(compressed);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = base64String;
  });
};

// Helper function to save guest image to Supabase Storage
const saveGuestImageToStorage = async (base64Image: string): Promise<string | null> => {
  try {
    // Convert base64 to blob
    const base64Data = base64Image.split(',')[1] || base64Image;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // Generate unique filename with timestamp
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(7);
    const fileName = `guest_${timestamp}_${randomStr}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('puxeassunto-sem-login')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading to Supabase Storage:', error);
      return null;
    }

    console.log('Image saved to Storage:', data.path);
    return data.path;
  } catch (error) {
    console.error('Error saving guest image:', error);
    return null;
  }
};

// Function for /face page - uses gemini-3-pro and returns 11 suggestions
export const analyzeChatScreenshotFace = async (base64Image: string): Promise<AnalysisResult> => {
  // Save image to Storage (non-blocking)
  saveGuestImageToStorage(base64Image).catch(err => 
    console.error('Failed to save face image:', err)
  );

  if (!API_KEY) {
    // Fallback for demo purposes if no API key is present in environment
    console.warn("No API Key found. Returning mock data for Face page.");
    return new Promise(resolve => setTimeout(() => resolve({
      title: "Conversa Analisada",
      suggestions: [
        { tone: "Engraçado", message: "Essa é a hora que eu finjo que não vi e a gente recomeça? 😂", explanation: "Quebra o gelo com humor." },
        { tone: "Curioso", message: "Tô curioso... o que aconteceu depois disso?", explanation: "Mostra interesse na história." },
        { tone: "Direto", message: "Topa continuar esse papo pessoalmente?", explanation: "Para quem quer agilizar o encontro." },
        { tone: "Ousado", message: "Se você for tão interessante ao vivo quanto por msg, tô com problemas.", explanation: "Elogio com desafio." },
        { tone: "Descontraído", message: "Nota 10 pra essa história, mas quero saber a versão sem cortes.", explanation: "Mantém a leveza e curiosidade." },
        { tone: "Romântico", message: "Adorei conversar com você... tô começando a gostar disso.", explanation: "Demonstra interesse genuíno." },
        { tone: "Provocativo", message: "Você sempre demora assim pra responder ou sou especial?", explanation: "Brincadeira leve sobre tempo de resposta." },
        { tone: "Empático", message: "Entendo completamente o que você tá passando...", explanation: "Mostra que você se importa." },
        { tone: "Misterioso", message: "Tenho uma teoria sobre você, mas vou guardar pra mim por enquanto 😏", explanation: "Cria intriga e curiosidade." },
        { tone: "Confiante", message: "Sabia que você ia responder, ninguém resiste.", explanation: "Demonstra autoconfiança." },
        { tone: "Fofo", message: "Adorei essa conversa, você é muito especial sabia?", explanation: "Elogio sincero e carinhoso." }
      ]
    }), 2000));
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Compress image before sending
    const compressedImage = await compressBase64Image(base64Image);
    
    // Remove header if present (data:image/png;base64,)
    const cleanBase64 = compressedImage.split(',')[1] || compressedImage;

    const prompt = `
      Atue como um especialista em "Game" e conquista digital (Tinder, Bumble, Instagram, WhatsApp).
      
      ANÁLISE VISUAL CRÍTICA:
      - Mensagens à DIREITA (Verde/Azul/etc) são MINHAS (do usuário).
      - Mensagens à ESQUERDA (Cinza/Branco) são DELA/DELE (do "alvo").
      - O objetivo é sugerir o que EU (Direita) devo enviar para ELA/ELE (Esquerda).

      CENÁRIOS POSSÍVEIS (Identifique qual se aplica):
      1. RESPOSTA: Se a última mensagem for da Esquerda, sugira uma resposta adequada ao contexto.
      2. CONTINUAÇÃO: Se a última mensagem for da Direita (vácuo ou conversa morreu), sugira um "reviver" de assunto ou uma mudança de tópico.
      3. ABERTURA: Se for um perfil ou foto sem chat, sugira um abridor (opener) criativo.

      ANÁLISE DE SENTIMENTO E TONS (CRUCIAL):
      - Antes de gerar, IDENTIFIQUE O CLIMA da conversa (Triste, Sério, Divertido, Flertando, Tenso, etc).
      - ADAPTE OS TONS AO CLIMA.
      - ERRO GRAVE: Não use tons engraçados, sexys ou ousados se a conversa for séria, triste, de desabafo ou rejeição.
      
      Exemplos de adaptação (NÃO SE LIMITE A ESTES, CRIE TONS NOVOS SE PRECISAR):
      - Conversa Triste/Séria? Use tons como: "Empático", "Acolhedor", "Compreensivo", "Apoio".
      - Conversa Tensa/Briga? Use tons como: "Apaziguador", "Maduro", "Resolutivo".
      - Conversa Divertida? Use tons como: "Engraçado", "Provocativo", "Ousado".
      * O importante é o tom ser coerente com o sentimento da conversa.

      Diretrizes de Estilo:
      - EXTREMAMENTE CONCISO: Mensagens curtas (1-2 frases).
      - NATURALIDADE: Use gírias leves, sem pontuação excessiva, pareça humano.
      - ZERO GENÉRICO: Proibido "Oi tudo bem". Use detalhes específicos da imagem.
      
      Tarefas:
      1. Crie um TÍTULO curto (max 4 palavras) resumindo o contexto.
      2. Gere 11 sugestões de resposta com tons variados ADAPTADOS AO SENTIMENTO IDENTIFICADO.
      
      Retorne APENAS um JSON válido com o seguinte formato (sem markdown):
      {
        "title": "Título do Contexto",
        "suggestions": [
          { "tone": "Tom (ex: Ousado)", "message": "Texto da mensagem", "explanation": "Por que funciona" }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', 
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
    console.error("Error calling Gemini for Face page:", error);
    throw error;
  }
};

export const analyzeChatScreenshot = async (base64Images: string | string[], userContext?: string, isGuest: boolean = false): Promise<AnalysisResult> => {
  // Normaliza para array
  const imagesArray = Array.isArray(base64Images) ? base64Images : [base64Images];
  
  // Save guest image to Storage (non-blocking - don't wait for it)
  if (isGuest && imagesArray.length > 0) {
    saveGuestImageToStorage(imagesArray[0]).catch(err => 
      console.error('Failed to save guest image:', err)
    );
  }

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
    
    // Compress all images before sending
    const compressedImages = await Promise.all(
      imagesArray.map(img => compressBase64Image(img))
    );
    
    // Clean base64 headers from all images
    const cleanBase64Images = compressedImages.map(img => img.split(',')[1] || img);

    const isMultipleImages = cleanBase64Images.length > 1;
    
    let prompt = `
      Atue como um especialista em "Game" e conquista digital (Tinder, Bumble, Instagram, WhatsApp).
      
      ${isMultipleImages ? `IMPORTANTE: Você está recebendo ${cleanBase64Images.length} PRINTS DE CONVERSA em sequência. Analise TODOS juntos para entender o contexto completo da conversa antes de sugerir respostas. Os prints estão em ORDEM CRONOLÓGICA (primeiro print = mais antigo).` : ''}
      
      ANÁLISE VISUAL CRÍTICA:
      - Mensagens à DIREITA (Verde/Azul/etc) são MINHAS (do usuário).
      - Mensagens à ESQUERDA (Cinza/Branco) são DELA/DELE (do "alvo").
      - O objetivo é sugerir o que EU (Direita) devo enviar para ELA/ELE (Esquerda).
      ${isMultipleImages ? '- CONSIDERE todo o histórico das imagens para entender a evolução da conversa.' : ''}

      CENÁRIOS POSSÍVEIS (Identifique qual se aplica):
      1. RESPOSTA: Se a última mensagem for da Esquerda, sugira uma resposta adequada ao contexto.
      2. CONTINUAÇÃO: Se a última mensagem for da Direita (vácuo ou conversa morreu), sugira um "reviver" de assunto ou uma mudança de tópico.
      3. ABERTURA: Se for um perfil ou foto sem chat, sugira um abridor (opener) criativo.

      ANÁLISE DE SENTIMENTO E TONS (CRUCIAL):
      - Antes de gerar, IDENTIFIQUE O CLIMA da conversa (Triste, Sério, Divertido, Flertando, Tenso, etc).
      - ADAPTE OS TONS AO CLIMA.
      - ERRO GRAVE: Não use tons engraçados, sexys ou ousados se a conversa for séria, triste, de desabafo ou rejeição.
      
      Exemplos de adaptação (NÃO SE LIMITE A ESTES, CRIE TONS NOVOS SE PRECISAR):
      - Conversa Triste/Séria? Use tons como: "Empático", "Acolhedor", "Compreensivo", "Apoio".
      - Conversa Tensa/Briga? Use tons como: "Apaziguador", "Maduro", "Resolutivo".
      - Conversa Divertida? Use tons como: "Engraçado", "Provocativo", "Ousado".
      * O importante é o tom ser coerente com o sentimento da conversa.

      REGRAS PROIBIDAS (NUNCA FAÇA ISSO):
      - NÃO sugira encerrar, pausar, "esfriar a cabeça" ou fugir da conversa.
      - NÃO sugira conversa pessoalmente OU fora do chat SE o clima for tenso, triste ou conflituoso.
      - Conversa fora do chat só é permitida se o clima for positivo, leve e recíproco.
      - NUNCA use pedidos de desculpa condicionais ("se eu te magoei", "caso tenha soado", "não foi minha intenção").
      - Quando pedir desculpas, ASSUMA responsabilidade direta.
      - Demonstre interesse e empatia SEM parecer carente, dependente ou suplicante.
      - NUNCA implore por resposta ou validação.
      - Foque em respostas que MANTÊM o diálogo ativo e interessante.

      Diretrizes de Estilo:
      - NATURALIDADE: Use gírias leves, sem pontuação excessiva, pareça humano.
      - ZERO GENÉRICO: Proibido "Oi tudo bem". Use detalhes específicos da imagem.
      
      Tarefas:
      1. Crie um TÍTULO curto (max 4 palavras) resumindo o contexto.
      2. Gere 5 sugestões de resposta com TONS e ESTRATÉGIAS DIFERENTES (ex: validação emocional, leve provocação, clarificação direta, humor sutil, reconexão afetiva), todas ADAPTADAS AO SENTIMENTO IDENTIFICADO.
      
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

    // Use different model based on guest or logged-in user
    const modelName = isGuest ? 'gemini-3-flash-preview' : 'gemini-3-flash-preview';

    // Build parts array with all images
    const parts: any[] = cleanBase64Images.map((imgData, index) => ({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imgData
      }
    }));
    
    // Add prompt as last part
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts
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

export const generatePickupLines = async (context?: string, base64Image?: string): Promise<AnalysisResult> => {
  if (!API_KEY) {
    console.warn("No API Key found. Returning mock pickup lines.");
    return new Promise(resolve => setTimeout(() => resolve({
      title: context ? context.slice(0, 30) : base64Image ? "Cantadas Personalizadas" : "Cantadas Criativas",
      suggestions: [
        { tone: "Engraçado", message: "Se beleza fosse crime, você pegaria prisão perpétua 😏", explanation: "Clássico mas funciona" },
        { tone: "Ousado", message: "Vou te processar por roubo... você roubou meu coração", explanation: "Direto ao ponto" },
        { tone: "Inteligente", message: "Você acredita em amor à primeira vista ou devo passar de novo?", explanation: "Confiante e bem-humorado" },
        { tone: "Criativo", message: "Se você fosse uma transformação matemática, seria uma senóide... porque você tem todas as curvas perfeitas", explanation: "Para nerds" },
        { tone: "Romântico", message: "Desculpa, mas acho que você deixou cair algo... meu queixo", explanation: "Doce e fofo" }
      ]
    }), 1500));
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    let prompt = `
      Você é um especialista em cantadas criativas, engraçadas e originais para paquera.
      
      OBJETIVO: Gerar cantadas que sejam:
      - ORIGINAIS e CRIATIVAS (evite clichês muito batidos)
      - ENGRAÇADAS mas não ofensivas
      - CURTAS (1-2 frases no máximo)
      - VARIADAS em tom e estilo
      
      ANÁLISE DE CONTEXTO E TONS (ADAPTATIVO):
      Não use tons genéricos. Analise a imagem ou texto para identificar a "vibe" e escolha tons que combinem com o contexto específico.
      
      Exemplos de adaptação:
      - Vibe intelectual? Use tons: "Sagaz", "Observador", "Culto"
      - Vibe festa/balada? Use tons: "Energético", "Direto", "Divertido"
      - Vibe natureza/chill? Use tons: "Good Vibes", "Poético", "Leve"
      
      Se não houver contexto claro, varie entre: Engraçado, Ousado, Inteligente, Romântico e Criativo.
      
      ${base64Image ? 'IMPORTANTE: Analise a imagem fornecida e crie cantadas personalizadas baseadas em detalhes específicos da foto (roupas, ambiente, expressão, hobbies visíveis, etc). Use esses detalhes para criar um título descritivo.' : ''}
      ${context ? `CONTEXTO ESPECIAL: ${context}\nUse esse contexto para personalizar as cantadas e criar um título que reflita o tema.` : ''}
      
      Tarefas:
      1. Crie um TÍTULO descritivo e criativo (2-4 palavras) que resuma o tema/estilo das cantadas.
      2. Gere 5 cantadas com tons variados.
      
      Exemplos de títulos bons:
      - "Cantadas de Café"
      - "Estilo Nerd"
      - "Românticas Clássicas"
      - "Ousadas e Divertidas"
      
      Retorne APENAS um JSON válido (sem markdown) no seguinte formato:
      {
        "title": "Título criativo",
        "suggestions": [
          { "tone": "Tom da cantada", "message": "Texto da cantada", "explanation": "Por que é boa" }
        ]
      }
    `;

    const parts: any[] = [];
    
    if (base64Image) {
      // Compress image before sending
      const compressedImage = await compressBase64Image(base64Image);
      const cleanBase64 = compressedImage.split(',')[1] || compressedImage;
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64
        }
      });
    }
    
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts
      }
    });

    const text = response.text || '{}';
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(cleanText);
    
    // Ensure compatibility if AI returns array directly (legacy handling)
    if (Array.isArray(parsed)) {
      return { 
        title: context || (base64Image ? "Cantadas Personalizadas" : "Cantadas Criativas"),
        suggestions: parsed 
      };
    }
    
    // Ensure title is never empty
    if (!parsed.title || parsed.title.trim() === '') {
      parsed.title = context || (base64Image ? "Cantadas Personalizadas" : "Cantadas Criativas");
    }
    
    return parsed as AnalysisResult;

  } catch (error) {
    console.error("Error generating pickup lines:", error);
    throw error;
  }
};