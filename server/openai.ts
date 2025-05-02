import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Najnowszy model OpenAI to "gpt-4o", wydany po 13 maja 2024
// nie zmieniaj tego modelu, chyba że użytkownik wyraźnie o to prosi
const MODEL = "gpt-4o";

interface ServiceGenerationParams {
  name?: string;
  category?: string;
  basePrice?: number;
  keywords?: string[];
  isDetailed?: boolean;
}

interface GeneratedServiceData {
  name: string;
  shortDescription: string;
  description: string;
  longDescription: string;
  basePrice: number;
  deliveryTime: number;
  features: string[];
  benefits: string[];
  scope: string[];
  category: string;
  status: string;
}

/**
 * Generuje dane usługi przy użyciu modelu OpenAI
 */
export async function generateServiceData(params: ServiceGenerationParams): Promise<GeneratedServiceData> {
  // Domyślne wartości, jeśli nie zostały podane
  const name = params.name || "";
  const category = params.category || "";
  const basePrice = params.basePrice || 0;
  const keywords = params.keywords || [];
  const isDetailed = params.isDetailed || false;

  // Prompt dla AI zależny od podanych parametrów
  let prompt = `Stwórz nową usługę marketingową dla agencji digital marketingowej ECM Digital.`;
  
  if (name) {
    prompt += ` Nazwa usługi to: "${name}".`;
  }
  
  if (category) {
    prompt += ` Kategoria usługi to: "${category}".`;
  }
  
  if (basePrice > 0) {
    prompt += ` Cena bazowa usługi to około ${basePrice} PLN.`;
  }
  
  if (keywords.length > 0) {
    prompt += ` Uwzględnij następujące słowa kluczowe: ${keywords.join(', ')}.`;
  }
  
  if (isDetailed) {
    prompt += ` Stwórz rozbudowane opisy z dużą ilością szczegółów.`;
  }

  prompt += `
Wygeneruj dane w następującym formacie JSON:
{
  "name": "Nazwa usługi",
  "shortDescription": "Krótki opis usługi do 15 słów",
  "description": "Podstawowy opis usługi do 30 słów",
  "longDescription": "Szczegółowy opis usługi w 2-3 zdaniach, opisujący jej główne zalety",
  "basePrice": liczba (cena bazowa w PLN),
  "deliveryTime": liczba (czas realizacji w dniach),
  "features": ["Funkcja 1", "Funkcja 2", "Funkcja 3", "Funkcja 4"],
  "benefits": ["Korzyść 1", "Korzyść 2", "Korzyść 3", "Korzyść 4"],
  "scope": ["Zakres usługi 1", "Zakres usługi 2", "Zakres usługi 3", "Zakres usługi 4"],
  "category": "Kategoria usługi",
  "status": "Aktywna"
}

Dla ceny wybierz realną wartość rynkową między 1500 a 15000 PLN, dla czasu realizacji między 7 a 60 dni.
Zwróć TYLKO JSON bez dodatkowych wyjaśnień czy tekstu.`;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const generatedContent = response.choices[0].message.content;
    
    if (!generatedContent) {
      throw new Error("Nie udało się wygenerować danych");
    }
    
    try {
      // Parsuj wynik jako JSON
      const parsedData = JSON.parse(generatedContent) as GeneratedServiceData;
      
      // Upewnij się, że wszystkie pola istnieją
      return {
        name: parsedData.name || (name || "Nowa usługa"),
        shortDescription: parsedData.shortDescription || "",
        description: parsedData.description || "",
        longDescription: parsedData.longDescription || "",
        basePrice: parsedData.basePrice || (basePrice || 2500),
        deliveryTime: parsedData.deliveryTime || 14,
        features: parsedData.features || [],
        benefits: parsedData.benefits || [],
        scope: parsedData.scope || [],
        category: parsedData.category || (category || "Inne"),
        status: parsedData.status || "Aktywna"
      };
    } catch (parseError) {
      console.error("Błąd parsowania JSON:", parseError);
      console.error("Otrzymany tekst:", generatedContent);
      throw new Error("Nie udało się przetworzyć odpowiedzi AI do formatu JSON");
    }
  } catch (error) {
    console.error("Błąd podczas generowania danych usługi z OpenAI:", error);
    throw error;
  }
}

/**
 * Generuje listę korzyści dla usługi
 */
export async function generateBenefits(serviceName: string, serviceDescription: string): Promise<string[]> {
  const prompt = `Dla usługi marketingowej "${serviceName}" o opisie: "${serviceDescription}", 
  wygeneruj listę 5 konkretnych korzyści dla klienta. Każda korzyść powinna być krótkim zdaniem zaczynającym się od mocnego czasownika.
  Odpowiedz w formacie JSON: { "benefits": ["korzyść 1", "korzyść 2", "korzyść 3", "korzyść 4", "korzyść 5"] }
  Zwróć TYLKO JSON bez dodatkowych wyjaśnień.`;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const generatedContent = response.choices[0].message.content;
    
    if (!generatedContent) {
      return [];
    }
    
    try {
      const parsedData = JSON.parse(generatedContent);
      return parsedData.benefits || [];
    } catch (error) {
      console.error("Błąd parsowania JSON:", error);
      return [];
    }
  } catch (error) {
    console.error("Błąd podczas generowania korzyści:", error);
    return [];
  }
}

/**
 * Generuje listę punktów zakresu usługi
 */
export async function generateScope(serviceName: string, serviceDescription: string): Promise<string[]> {
  const prompt = `Dla usługi marketingowej "${serviceName}" o opisie: "${serviceDescription}", 
  wygeneruj listę 5 konkretnych punktów zakresu usługi. Każdy punkt powinien opisywać konkretny element pracy jaki zostanie wykonany.
  Odpowiedz w formacie JSON: { "scope": ["zakres 1", "zakres 2", "zakres 3", "zakres 4", "zakres 5"] }
  Zwróć TYLKO JSON bez dodatkowych wyjaśnień.`;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const generatedContent = response.choices[0].message.content;
    
    if (!generatedContent) {
      return [];
    }
    
    try {
      const parsedData = JSON.parse(generatedContent);
      return parsedData.scope || [];
    } catch (error) {
      console.error("Błąd parsowania JSON:", error);
      return [];
    }
  } catch (error) {
    console.error("Błąd podczas generowania zakresu usługi:", error);
    return [];
  }
}

/**
 * Generuje ulepszony opis usługi
 */
export async function enhanceServiceDescription(serviceName: string, originalDescription: string): Promise<string> {
  const prompt = `Ulepsz następujący opis usługi marketingowej "${serviceName}": 
  "${originalDescription}"
  
  Stwórz profesjonalny, przekonujący i bardziej szczegółowy opis używając języka marketingowego. 
  Opis powinien mieć 2-3 zdania. Odpowiedz w formacie JSON: { "description": "ulepszony opis" }
  Zwróć TYLKO JSON bez dodatkowych wyjaśnień.`;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const generatedContent = response.choices[0].message.content;
    
    if (!generatedContent) {
      return originalDescription;
    }
    
    try {
      const parsedData = JSON.parse(generatedContent);
      return parsedData.description || originalDescription;
    } catch (error) {
      console.error("Błąd parsowania JSON:", error);
      return originalDescription;
    }
  } catch (error) {
    console.error("Błąd podczas ulepszania opisu:", error);
    return originalDescription;
  }
}