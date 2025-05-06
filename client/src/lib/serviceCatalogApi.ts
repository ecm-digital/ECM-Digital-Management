import { Service } from '@/types';
import i18next from 'i18next';

// URL bazy aplikacji ServiceCatalog - możesz zmienić to na właściwy URL
let SERVICECATALOG_BASE_URL = 'https://servicecatalog.replit.app';

// Kurs wymiany: 4.3 PLN = 1 EUR
const PLN_TO_EUR_RATE = 4.3;

// Funkcja do konwersji cen z PLN na EUR
export function convertToEuro(priceInPLN: number): number {
  return +(priceInPLN / PLN_TO_EUR_RATE).toFixed(2);
}

// Funkcja do zmiany URL bazowego - używana w trybie deweloperskim
export function setServiceCatalogBaseUrl(url: string): void {
  SERVICECATALOG_BASE_URL = url;
  console.log('ServiceCatalog URL zmieniony na:', url);
}

/**
 * Pobiera usługi z aplikacji ServiceCatalog poprzez proxy
 */
export async function fetchServicesFromCatalog(): Promise<Service[]> {
  try {
    console.log('Próba połączenia z ServiceCatalog (przez proxy):', SERVICECATALOG_BASE_URL);
    
    // Korzystamy z proxy na backendzie, aby uniknąć problemów z CORS
    const response = await fetch(`/api/proxy/servicecatalog/services?url=${encodeURIComponent(SERVICECATALOG_BASE_URL)}`);
    
    if (!response.ok) {
      throw new Error(`Błąd podczas pobierania usług: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Pobrano dane z ServiceCatalog (przez proxy):', data);
    
    // Mapowanie danych z ServiceCatalog na format Service używany w tej aplikacji
    return mapCatalogDataToServices(data);
  } catch (error: any) {
    console.error('Błąd pobierania usług z ServiceCatalog:', error.message || error);
    
    // W przypadku błędu, zwracamy pustą tablicę
    throw new Error(`Nie można połączyć się z ServiceCatalog: ${error.message || 'Nieznany błąd'}`);
  }
}

/**
 * Pobiera pojedynczą usługę z ServiceCatalog poprzez proxy
 */
export async function fetchServiceFromCatalog(serviceId: string): Promise<Service | null> {
  try {
    const response = await fetch(`/api/proxy/servicecatalog/services/${serviceId}?url=${encodeURIComponent(SERVICECATALOG_BASE_URL)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Błąd podczas pobierania usługi: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Jeśli otrzymaliśmy null z proxy, zwróć null
    if (data === null) {
      return null;
    }
    
    // Konwersja na format aplikacji
    // Sprawdź, czy mamy niemiecki język i potrzebna jest konwersja cen
    const needsPriceConversion = i18next.language === 'de';
    const services = mapCatalogDataToServices([data]);
    
    // Dodajemy konwersję dla kroków konfiguracji jeśli istnieją
    if (services.length > 0 && needsPriceConversion && services[0].steps) {
      services[0].steps = transformConfigSteps(services[0].steps, true);
    }
    
    return services.length > 0 ? services[0] : null;
  } catch (error) {
    console.error(`Błąd pobierania usługi ${serviceId} z ServiceCatalog:`, error);
    throw error;
  }
}

/**
 * Przesyła zamówienie do ServiceCatalog poprzez proxy
 */
export async function submitOrderToCatalog(orderData: any): Promise<any> {
  try {
    const response = await fetch(`/api/proxy/servicecatalog/orders?url=${encodeURIComponent(SERVICECATALOG_BASE_URL)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      throw new Error(`Błąd podczas przesyłania zamówienia: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Błąd przesyłania zamówienia do ServiceCatalog:', error);
    throw error;
  }
}

/**
 * Mapuje dane z formatu ServiceCatalog na format Service używany w tej aplikacji
 */
function mapCatalogDataToServices(catalogData: any): Service[] {
  // Obsługa przypadku, gdy catalogData nie jest tablicą (np. jest HTMLem lub innym formatem)
  if (!Array.isArray(catalogData)) {
    console.warn('Otrzymane dane nie są tablicą, zwracam dane testowe');
    // Jeśli dane nie są w oczekiwanym formacie, zwracamy puste tablice lub dane testowe
    return [];
  }
  
  return catalogData.map(item => {
    // Założenie: ServiceCatalog ma podobną strukturę, ale może mieć inne nazwy pól
    // Dlatego mapujemy do naszego formatu
    const basePrice = item.basePrice || item.base_price || 0;
    
    // Konwersja ceny na euro dla niemieckiej wersji
    const priceToUse = i18next.language === 'de' 
      ? convertToEuro(basePrice)
      : basePrice;
    
    return {
      id: item.id ? item.id.toString() : 'unknown-id',
      name: item.name || 'Nieznana usługa',
      description: item.description || '',
      basePrice: priceToUse,
      deliveryTime: item.deliveryTime || item.delivery_time || 14,
      features: item.features || [],
      steps: transformConfigSteps(item.configuration || item.steps || [], i18next.language === 'de'),
      categories: item.categories || [],
    };
  });
}

/**
 * Transformuje kroki konfiguracji z formatu ServiceCatalog do formatu używanego w tej aplikacji
 * @param configData Dane konfiguracji z ServiceCatalog
 * @param convertPrices Czy konwertować ceny na EUR
 */
function transformConfigSteps(configData: any[], convertPrices: boolean = false): any[] {
  // Ta funkcja może wymagać dostosowania w zależności od rzeczywistego formatu danych w ServiceCatalog
  // Poniżej jest przykładowa implementacja
  return configData.map((step, index) => {
    return {
      id: step.id || `step-${index}`,
      title: step.title || `Krok ${index + 1}`,
      layout: step.layout || 'default',
      options: (step.options || []).map((option: any, optIndex: number) => {
        const priceAdjustment = option.priceAdjustment || option.price_adjustment || 0;
        
        // Konwertuj cenę na EUR jeśli potrzeba
        const adjustedPrice = convertPrices 
          ? convertToEuro(priceAdjustment)
          : priceAdjustment;
          
        // Transformacja wyborów opcji (np. dla elementów select)
        let transformedChoices = option.choices || [];
        
        if (convertPrices && Array.isArray(transformedChoices) && transformedChoices.length > 0) {
          transformedChoices = transformedChoices.map((choice: any) => {
            if (choice.priceAdjustment) {
              return {
                ...choice,
                priceAdjustment: convertToEuro(choice.priceAdjustment)
              };
            }
            return choice;
          });
        }
          
        return {
          id: option.id || `option-${optIndex}`,
          type: option.type || 'select',
          label: option.label || `Opcja ${optIndex + 1}`,
          description: option.description || '',
          priceAdjustment: adjustedPrice,
          deliveryTimeAdjustment: option.deliveryTimeAdjustment || option.delivery_time_adjustment || 0,
          choices: transformedChoices
        };
      })
    };
  });
}