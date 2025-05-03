import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Najnowszy model OpenAI to "gpt-4o", wydany po 13 maja 2024
// nie zmieniaj tego modelu, chyba że użytkownik wyraźnie o to prosi
const MODEL = "gpt-4o";

interface PricingRecommendation {
  recommendedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  rationale: string;
  marketInsights: string[];
  competitivePositioning: string;
}

interface ServiceEstimation {
  scope: string[];
  timeEstimate: {
    min: number;
    max: number;
    recommended: number;
  };
  costBreakdown: Array<{
    item: string;
    hours: number;
    cost: number;
  }>;
  totalCost: number;
  risksAndAssumptions: string[];
  nextSteps: string[];
}

interface ServiceEstimationParams {
  serviceName: string;
  serviceDescription: string;
  clientRequirements?: string[];
  targetBudget?: number;
  targetDeadline?: number;
  complexity?: 'low' | 'medium' | 'high';
}

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

/**
 * AI Pricing Assistant - generuje rekomendacje cenowe dla usługi
 */
/**
 * AI Service Estimator - generuje szacowanie zakresu, czasu i kosztów dla usługi
 */
export async function generateServiceEstimation(
  params: ServiceEstimationParams
): Promise<ServiceEstimation> {
  const {
    serviceName,
    serviceDescription,
    clientRequirements = [],
    targetBudget,
    targetDeadline,
    complexity = 'medium'
  } = params;

  // Budowanie szczegółowego prompta dla AI
  let prompt = `Działasz jako doświadczony project manager i ekspert ds. wyceny projektów w agencji marketingowej ECM Digital w Polsce.
Dla poniższej usługi dokonaj profesjonalnego oszacowania zakresu prac, czasu realizacji i szczegółowego kosztorysu.

NAZWA USŁUGI: "${serviceName}"

OPIS USŁUGI: "${serviceDescription}"
`;

  if (clientRequirements && clientRequirements.length > 0) {
    prompt += `\nWYMAGANIA KLIENTA:\n${clientRequirements.map(req => `- ${req}`).join('\n')}`;
  }

  if (targetBudget) {
    prompt += `\nBUDŻET DOCELOWY: ${targetBudget} PLN`;
  }

  if (targetDeadline) {
    prompt += `\nDOCELOWY CZAS REALIZACJI: ${targetDeadline} dni`;
  }

  prompt += `\nPOZIOM ZŁOŻONOŚCI: ${
    complexity === 'low' ? 'Niski - projekt relatywnie prosty' :
    complexity === 'high' ? 'Wysoki - projekt złożony wymagający zaawansowanych umiejętności' :
    'Średni - typowy projekt dla agencji marketingowej'
  }`;

  prompt += `\nNa podstawie powyższych informacji, przygotuj szczegółowe szacowanie:
1. Szczegółowy zakres prac (co najmniej 5-7 konkretnych punktów)
2. Szacowany czas realizacji (minimalny, maksymalny i rekomendowany w dniach)
3. Szczegółowy kosztorys z rozbiciem na poszczególne elementy, godziny pracy i koszty (min. 4-6 pozycji)
4. Całkowity koszt realizacji w PLN
5. Ryzyka i założenia (3-5 punktów)
6. Propozycja kolejnych kroków (3 punkty)

Odpowiedz w formacie JSON:
{
  "scope": ["punkt zakresu 1", "punkt zakresu 2", ...],
  "timeEstimate": {
    "min": liczba_dni_min,
    "max": liczba_dni_max,
    "recommended": liczba_dni_zalecana
  },
  "costBreakdown": [
    {
      "item": "nazwa elementu",
      "hours": liczba_godzin,
      "cost": koszt_w_PLN
    },
    ...
  ],
  "totalCost": całkowity_koszt_w_PLN,
  "risksAndAssumptions": ["ryzyko/założenie 1", "ryzyko/założenie 2", ...],
  "nextSteps": ["krok 1", "krok 2", "krok 3"]
}

Zwróć TYLKO JSON bez dodatkowych wyjaśnień czy komentarzy.`;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const generatedContent = response.choices[0].message.content;
    
    if (!generatedContent) {
      throw new Error("Nie udało się wygenerować estymacji");
    }
    
    try {
      // Parsuj wynik jako JSON
      const parsedData = JSON.parse(generatedContent) as ServiceEstimation;
      
      // Upewnij się, że wszystkie pola istnieją
      return {
        scope: parsedData.scope || ["Analiza wymagań", "Projektowanie", "Implementacja", "Testowanie", "Wdrożenie"],
        timeEstimate: {
          min: parsedData.timeEstimate?.min || 7,
          max: parsedData.timeEstimate?.max || 30,
          recommended: parsedData.timeEstimate?.recommended || 14
        },
        costBreakdown: parsedData.costBreakdown || [
          { item: "Analiza i planowanie", hours: 4, cost: 1200 },
          { item: "Projektowanie i implementacja", hours: 16, cost: 4800 },
          { item: "Testowanie i poprawki", hours: 4, cost: 1200 },
          { item: "Wdrożenie", hours: 2, cost: 600 }
        ],
        totalCost: parsedData.totalCost || 7800,
        risksAndAssumptions: parsedData.risksAndAssumptions || [
          "Założono stabilne wymagania bez większych zmian w trakcie projektu",
          "Ryzyko opóźnień przy oczekiwaniu na materiały od klienta",
          "Zakłada się dostępność zasobów technicznych bez przerw"
        ],
        nextSteps: parsedData.nextSteps || [
          "Szczegółowe omówienie wymagań z klientem",
          "Przygotowanie dokumentacji projektowej",
          "Ustalenie harmonogramu prac"
        ]
      };
    } catch (parseError) {
      console.error("Błąd parsowania JSON:", parseError);
      console.error("Otrzymany tekst:", generatedContent);
      throw new Error("Nie udało się przetworzyć odpowiedzi AI do formatu JSON");
    }
  } catch (error) {
    console.error("Błąd podczas generowania estymacji usługi z OpenAI:", error);
    throw error;
  }
}

export async function generatePricingRecommendation(
  serviceName: string, 
  serviceDescription: string, 
  features: string[],
  scope: string[],
  currentPrice?: number
): Promise<PricingRecommendation> {
  // Budowanie szczegółowego prompta dla AI
  let prompt = `Działasz jako ekspert ds. wyceny usług marketingowych w agencji cyfrowej ECM Digital w Polsce.
Przeanalizuj poniższą usługę i zaproponuj optymalną wycenę w PLN opartą na wartości rynkowej i konkurencyjności.

NAZWA USŁUGI: "${serviceName}"

OPIS USŁUGI: "${serviceDescription}"

KLUCZOWE FUNKCJE:
${features.map(feature => `- ${feature}`).join('\n')}

ZAKRES PRAC:
${scope.map(item => `- ${item}`).join('\n')}
`;

  if (currentPrice) {
    prompt += `\nObecna cena usługi to ${currentPrice} PLN, ale chcemy sprawdzić czy jest optymalna.`;
  }

  prompt += `\nNa podstawie powyższych informacji, oceń wartość rynkową tej usługi i zaproponuj:
1. Rekomendowaną cenę w PLN
2. Sugerowany przedział cenowy (min-max) w PLN
3. Uzasadnienie rekomendacji
4. Spostrzeżenia dotyczące pozycjonowania cenowego na rynku
5. Kilka wskazówek rynkowych dotyczących wyceny

Odpowiedz w formacie JSON:
{
  "recommendedPrice": liczba,
  "priceRange": {
    "min": liczba,
    "max": liczba
  },
  "rationale": "tekst uzasadnienia",
  "marketInsights": ["insight 1", "insight 2", "insight 3"],
  "competitivePositioning": "tekst o pozycjonowaniu konkurencyjnym"
}

Zwróć TYLKO JSON bez dodatkowych wyjaśnień czy komentarzy.`;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const generatedContent = response.choices[0].message.content;
    
    if (!generatedContent) {
      throw new Error("Nie udało się wygenerować rekomendacji cenowej");
    }
    
    try {
      // Parsuj wynik jako JSON
      const parsedData = JSON.parse(generatedContent) as PricingRecommendation;
      
      // Upewnij się, że wszystkie pola istnieją
      return {
        recommendedPrice: parsedData.recommendedPrice || (currentPrice || 2500),
        priceRange: {
          min: parsedData.priceRange?.min || (parsedData.recommendedPrice ? parsedData.recommendedPrice * 0.8 : 2000),
          max: parsedData.priceRange?.max || (parsedData.recommendedPrice ? parsedData.recommendedPrice * 1.2 : 3000)
        },
        rationale: parsedData.rationale || "Brak uzasadnienia",
        marketInsights: parsedData.marketInsights || ["Brak dostępnych spostrzeżeń rynkowych"],
        competitivePositioning: parsedData.competitivePositioning || "Brak informacji o pozycjonowaniu konkurencyjnym"
      };
    } catch (parseError) {
      console.error("Błąd parsowania JSON:", parseError);
      console.error("Otrzymany tekst:", generatedContent);
      throw new Error("Nie udało się przetworzyć odpowiedzi AI do formatu JSON");
    }
  } catch (error) {
    console.error("Błąd podczas generowania rekomendacji cenowej:", error);
    throw error;
  }
}