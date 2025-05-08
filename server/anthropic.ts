import Anthropic from '@anthropic-ai/sdk';

// najnowszy model Anthropic to "claude-3-7-sonnet-20250219" który został wydany 24 lutego 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Model do użycia - najnowszy Claude 3.7 Sonnet
const CLAUDE_MODEL = 'claude-3-7-sonnet-20250219';

// Funkcja do generowania odpowiedzi z kontekstem
export async function generateChatResponse(messages: Array<{ role: string, content: string }>, systemPrompt?: string) {
  try {
    // Konwersja do formatu Anthropic
    const anthropicMessages = messages.map(msg => {
      if (msg.role === 'user') {
        return { role: 'user', content: msg.content };
      } else if (msg.role === 'assistant') {
        return { role: 'assistant', content: msg.content };
      }
      return null;
    }).filter(Boolean);

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      system: systemPrompt || "Jesteś asystentem ECM Digital, agencji UX/UI i AI. Odpowiadasz uprzejmie, konkretnie i pomocnie. Twoja główna rola to wspieranie klientów w zrozumieniu oferty ECM Digital i pomoc w doborze odpowiednich usług. Podajesz tylko faktyczne informacje i jeśli czegoś nie wiesz, przyznajesz się do tego.",
      max_tokens: 1024,
      messages: anthropicMessages as any,
    });

    // Sprawdź typ bloku treści i wyciągnij odpowiednią wartość
    const content = response.content[0].type === 'text' 
      ? (response.content[0] as { type: 'text', text: string }).text 
      : JSON.stringify(response.content[0]);

    return {
      content: content,
      model: CLAUDE_MODEL,
      provider: 'anthropic'
    };
  } catch (error: any) {
    console.error("Błąd przy generowaniu odpowiedzi z Anthropic:", error);
    throw new Error(`Nie udało się wygenerować odpowiedzi: ${error.message || 'Nieznany błąd'}`);
  }
}

// Analiza treści wiadomości pod kątem intencji, kategorii, sentymentu
export async function analyzeMessage(text: string): Promise<{
  intent: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  priority: 'high' | 'medium' | 'low';
  languageDetected: string;
}> {
  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      system: `Analizuj podany tekst i zwróć informacje o intencji (pytanie, prośba, reklamacja, itp.), 
        kategorii tematycznej (UX/UI, AI, marketing, itp.), sentymentu (positive, negative, neutral), 
        priorytetu (high, medium, low) i wykrytego języka. Zwróć tylko JSON bez wyjaśnień.`,
      max_tokens: 500,
      messages: [{ role: 'user', content: text }],
    });

    // Parsowanie odpowiedzi JSON
    const content = response.content[0].type === 'text' 
      ? (response.content[0] as { type: 'text', text: string }).text 
      : JSON.stringify(response.content[0]);
    
    const cleanedResponse = content.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleanedResponse);

    return {
      intent: result.intent,
      category: result.category,
      sentiment: result.sentiment,
      priority: result.priority,
      languageDetected: result.languageDetected
    };
  } catch (error: any) {
    console.error("Błąd przy analizie wiadomości:", error);
    return {
      intent: 'unknown',
      category: 'general',
      sentiment: 'neutral',
      priority: 'medium',
      languageDetected: 'pl'
    };
  }
}

// Funkcja do personalizacji promptu na podstawie danych użytkownika
export function createPersonalizedSystemPrompt(userData?: any): string {
  let prompt = "Jesteś asystentem ECM Digital, agencji UX/UI i AI. ";
  
  if (userData) {
    if (userData.username) {
      prompt += `Rozmawiasz z ${userData.username}. `;
    }
    
    if (userData.industry) {
      prompt += `Użytkownik działa w branży ${userData.industry}. `;
    }
    
    if (userData.projectType) {
      prompt += `Jest zainteresowany głównie projektami typu ${userData.projectType}. `;
    }
  }
  
  prompt += `Odpowiadasz uprzejmie, konkretnie i profesjonalnie. 
    Twoim zadaniem jest przedstawienie oferty ECM Digital, pomoc w doborze odpowiednich usług 
    i odpowiadanie na pytania związane z UX/UI, AI, marketingiem i automatyzacją.
    Jeśli czegoś nie wiesz, przyznajesz się do tego i proponujesz kontakt z zespołem ECM Digital.`;
  
  return prompt;
}