import { db } from "../server/db";
import { services, InsertService } from "../shared/schema";
import { nanoid } from "nanoid";

const figmaServices: Array<Omit<InsertService, "serviceId">> = [
  {
    name: "AI Landing Pages",
    shortDescription: "Tworzymy responsywne strony w 72h dzięki Figma Sites – idealne do MVP, testów A/B i kampanii reklamowych.",
    description: "Tworzymy responsywne strony w 72h dzięki Figma Sites – idealne do MVP, testów A/B i kampanii reklamowych.",
    longDescription: "Dzięki nowym narzędziom Figma Sites jesteśmy w stanie przygotować i wdrożyć w pełni responsywne landing pages w zaledwie 72 godziny. Tego typu strony doskonale sprawdzają się jako szybkie MVP, strony do testów A/B różnych wersji treści oraz dedykowane landing page do kampanii reklamowych. Cały proces jest bardzo efektywny i pozwala na szybkie iteracje.",
    basePrice: 3200,
    deliveryTime: 3,
    features: [
      "Responsywna strona oparta o Figma Sites",
      "Implementacja w 72 godziny",
      "Integracja z Google Analytics",
      "Formularz kontaktowy",
      "Optymalizacja pod SEO"
    ],
    benefits: [
      "Szybka implementacja w 72 godziny",
      "Idealne do testowania produktów i kampanii",
      "Pełna responsywność na wszystkich urządzeniach",
      "Łatwa integracja z narzędziami analitycznymi",
      "Prosty w obsłudze CMS do aktualizacji treści"
    ],
    scope: [
      "Projekt UX/UI strony w Figma",
      "Implementacja przy użyciu Figma Sites",
      "Optymalizacja szybkości ładowania",
      "Konfiguracja domeny i hostingu",
      "Implementacja Google Analytics",
      "Szkolenie z obsługi CMS"
    ],
    category: "Web Development",
    status: "Aktywna"
  },
  {
    name: "AI Prototypy UI",
    shortDescription: "Na podstawie briefu generujemy 3 wersje UI z pomocą Figma Make. Ekspresowa walidacja pomysłów.",
    description: "Na podstawie briefu generujemy 3 wersje UI z pomocą Figma Make. Ekspresowa walidacja pomysłów.",
    longDescription: "Wykorzystując najnowsze narzędzie Figma Make, jesteśmy w stanie wygenerować 3 różne propozycje interfejsu na podstawie Twojego briefu. To pozwala na ekspresową walidację pomysłów i kierunków projektowych bez kosztownego i czasochłonnego procesu projektowania od zera. Każdy prototyp zawiera kluczowe ekrany i interakcje, co pozwala na szybkie przeprowadzenie testów z użytkownikami.",
    basePrice: 4500,
    deliveryTime: 5,
    features: [
      "3 różne koncepcje UI wygenerowane przez AI",
      "Interaktywne prototypy kluczowych ekranów",
      "Prezentacja wyników i rekomendacji",
      "Możliwość łatwej iteracji",
      "Przygotowanie do testów użytkowników"
    ],
    benefits: [
      "Szybka walidacja pomysłów biznesowych",
      "Oszczędność czasu i kosztów projektowania",
      "Eksploracja różnych kierunków designu",
      "Materiał gotowy do testów z użytkownikami",
      "Podstawa do finalnego projektu UI"
    ],
    scope: [
      "Przygotowanie briefu projektowego",
      "Generowanie 3 koncepcji UI w Figma Make",
      "Dopracowanie i uspójnienie wygenerowanych interfejsów",
      "Stworzenie interaktywnych prototypów",
      "Przygotowanie scenariuszy do testów",
      "Prezentacja wyników i rekomendacje"
    ],
    category: "UX/UI",
    status: "Aktywna"
  },
  {
    name: "Kampanie graficzne z AI",
    shortDescription: "Masowe tworzenie grafik (social media, banery) z użyciem Excela i Figma Buzz. Szybko, spójnie i z pomysłem.",
    description: "Masowe tworzenie grafik (social media, banery) z użyciem Excela i Figma Buzz. Szybko, spójnie i z pomysłem.",
    longDescription: "Dzięki połączeniu Excela z Figma Buzz, możemy masowo tworzyć spójne grafiki do kampanii w social mediach, banery reklamowe oraz inne materiały marketingowe. Proces jest zautomatyzowany, co pozwala na generowanie dużej liczby materiałów w krótkim czasie, jednocześnie zachowując spójność wizualną i wysoką jakość. To idealne rozwiązanie dla kampanii wymagających wielu wariantów grafik.",
    basePrice: 6800,
    deliveryTime: 10,
    features: [
      "Masowe generowanie grafik w oparciu o dane z Excela",
      "Jednolity styl wizualny dla całej kampanii",
      "Obsługa różnych formatów (Facebook, Instagram, Google Ads)",
      "System tagowania i kategoryzacji grafik",
      "Przygotowanie do publikacji w social mediach"
    ],
    benefits: [
      "Znaczna oszczędność czasu przy tworzeniu wielu materiałów",
      "Spójność wizualna wszystkich materiałów",
      "Łatwa aktualizacja grafik przy zmianie oferty",
      "Szybka adaptacja do różnych formatów reklamowych",
      "Możliwość generowania wariantów A/B do testów"
    ],
    scope: [
      "Przygotowanie struktury danych w Excelu",
      "Zaprojektowanie bazowych szablonów w Figma",
      "Konfiguracja Figma Buzz do automatyzacji",
      "Generowanie grafik dla wszystkich formatów",
      "Organizacja i tagowanie materiałów",
      "Eksport w formatach gotowych do publikacji",
      "Szkolenie z aktualizacji grafik"
    ],
    category: "Marketing",
    status: "Aktywna"
  },
  {
    name: "Ilustracje & ikony",
    shortDescription: "Unikalne wektory z Figma Draw – ikony, ilustracje, tła – bez potrzeby używania zewnętrznych narzędzi.",
    description: "Unikalne wektory z Figma Draw – ikony, ilustracje, tła – bez potrzeby używania zewnętrznych narzędzi.",
    longDescription: "Wykorzystując nowe narzędzie Figma Draw, tworzymy unikalne zestawy ilustracji i ikon wektorowych dopasowane do Twojej marki. Wszystko odbywa się w jednym środowisku, bez potrzeby używania zewnętrznych programów, co pozwala na pełną spójność z resztą projektu. Ilustracje są tworzone w formie wektorowej, co umożliwia ich skalowanie bez utraty jakości.",
    basePrice: 5400,
    deliveryTime: 14,
    features: [
      "Unikalne ilustracje wektorowe tworzone w Figma Draw",
      "Spójny zestaw ikon dla całego produktu",
      "Tła i grafiki dekoracyjne dopasowane do marki",
      "Biblioteka komponentów do ponownego wykorzystania",
      "Pełna dokumentacja stylistyczna"
    ],
    benefits: [
      "Unikalny styl graficzny wyróżniający markę",
      "Spójność wizualna wszystkich elementów",
      "Łatwe modyfikacje i rozbudowa w przyszłości",
      "Grafiki wektorowe działające na każdym urządzeniu",
      "Brak problemów z licencjami na stock grafiki"
    ],
    scope: [
      "Zdefiniowanie stylu ilustracji dopasowanego do marki",
      "Stworzenie 3 kluczowych ilustracji bohatera",
      "Zaprojektowanie zestawu 20 ikon systemowych",
      "Przygotowanie 5 wzorów tła/tekstur",
      "Organizacja biblioteki komponentów",
      "Eksport w formatach .svg, .ai oraz .fig",
      "Dokumentacja stylu i wytyczne"
    ],
    category: "UX/UI",
    status: "Aktywna"
  },
  {
    name: "Pixel-perfect Dev Ready",
    shortDescription: "Dzięki Grid + Dev Mode tworzymy układy gotowe do wdrożenia z CSS i responsywnością w standardzie.",
    description: "Dzięki Grid + Dev Mode tworzymy układy gotowe do wdrożenia z CSS i responsywnością w standardzie.",
    longDescription: "Wykorzystujemy Grid system i Dev Mode w Figma, aby tworzyć doskonale zorganizowane layouty, które są w pełni gotowe do implementacji przez programistów. Każdy element jest dokładnie wymiarowany, posiada odpowiednie marginesy i paddingi, a cały układ jest zaprojektowany z myślą o responsywności. Dodatkowo, generujemy gotowy kod CSS, co znacznie przyspiesza proces programowania.",
    basePrice: 7900,
    deliveryTime: 21,
    features: [
      "Precyzyjne layouty oparte o system Grid",
      "Pełna responsywność dla wszystkich breakpointów",
      "Automatycznie generowany kod CSS",
      "Kompletne specyfikacje dla developerów",
      "Interaktywne komponenty z dokumentacją stanów"
    ],
    benefits: [
      "Znaczne skrócenie czasu implementacji",
      "Eliminacja nieporozumień między designerami a developerami",
      "Spójność interfejsu na wszystkich urządzeniach",
      "Łatwiejsza konserwacja i rozbudowa w przyszłości",
      "Zgodność z najlepszymi praktykami UI/UX"
    ],
    scope: [
      "Analiza wymagań technicznych projektu",
      "Zaprojektowanie systemu Grid dla wszystkich breakpointów",
      "Przygotowanie layoutów dla wszystkich kluczowych widoków",
      "Konfiguracja Dev Mode dla elementów",
      "Generowanie specyfikacji i dokumentacji",
      "Przygotowanie biblioteki komponentów",
      "Wsparcie zespołu developerskiego podczas implementacji"
    ],
    category: "Web Development",
    status: "Aktywna"
  }
];

async function addFigmaServices() {
  try {
    console.log("Dodawanie usług Figma 2025...");
    
    // Pobierz aktualną listę ID usług
    const existingServices = await db.select().from(services);
    const existingIds = existingServices.map(s => parseInt(s.serviceId));
    let maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    
    const results = [];
    
    for (const service of figmaServices) {
      // Sprawdź, czy usługa już istnieje
      const exists = existingServices.some(s => s.name === service.name);
      
      if (!exists) {
        maxId++;
        const serviceWithId: InsertService = {
          ...service,
          serviceId: maxId.toString(),
        };
        
        const [insertedService] = await db.insert(services).values(serviceWithId).returning();
        
        results.push({
          name: insertedService.name,
          id: insertedService.serviceId,
          status: "success"
        });
        
        console.log(`Dodano usługę: ${insertedService.name} (ID: ${insertedService.serviceId})`);
      } else {
        results.push({
          name: service.name,
          status: "already exists"
        });
        
        console.log(`Usługa ${service.name} już istnieje - pominięto`);
      }
    }
    
    console.log("Podsumowanie:");
    console.table(results);
    
    console.log("Zakończono dodawanie usług Figma 2025");
  } catch (error) {
    console.error("Błąd podczas dodawania usług:", error);
  } finally {
    process.exit(0);
  }
}

addFigmaServices();