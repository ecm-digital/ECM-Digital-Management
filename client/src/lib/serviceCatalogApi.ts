import { Service } from '@/types';

// URL bazy aplikacji ServiceCatalog
const SERVICECATALOG_BASE_URL = 'https://servicecatalog.replit.app';

/**
 * Pobiera usługi z aplikacji ServiceCatalog
 */
export async function fetchServicesFromCatalog(): Promise<Service[]> {
  try {
    const response = await fetch(`${SERVICECATALOG_BASE_URL}/api/services`);
    
    if (!response.ok) {
      throw new Error(`Błąd podczas pobierania usług: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Mapowanie danych z ServiceCatalog na format Service używany w tej aplikacji
    return mapCatalogDataToServices(data);
  } catch (error) {
    console.error('Błąd pobierania usług z ServiceCatalog:', error);
    throw error;
  }
}

/**
 * Pobiera pojedynczą usługę z ServiceCatalog
 */
export async function fetchServiceFromCatalog(serviceId: string): Promise<Service | null> {
  try {
    const response = await fetch(`${SERVICECATALOG_BASE_URL}/api/services/${serviceId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Błąd podczas pobierania usługi: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Konwersja na format aplikacji
    const services = mapCatalogDataToServices([data]);
    return services.length > 0 ? services[0] : null;
  } catch (error) {
    console.error(`Błąd pobierania usługi ${serviceId} z ServiceCatalog:`, error);
    throw error;
  }
}

/**
 * Przesyła zamówienie do ServiceCatalog
 */
export async function submitOrderToCatalog(orderData: any): Promise<any> {
  try {
    const response = await fetch(`${SERVICECATALOG_BASE_URL}/api/orders`, {
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
function mapCatalogDataToServices(catalogData: any[]): Service[] {
  return catalogData.map(item => {
    // Założenie: ServiceCatalog ma podobną strukturę, ale może mieć inne nazwy pól
    // Dlatego mapujemy do naszego formatu
    return {
      id: item.id.toString(),
      name: item.name,
      description: item.description || '',
      basePrice: item.basePrice || item.base_price || 0,
      deliveryTime: item.deliveryTime || item.delivery_time || 14,
      features: item.features || [],
      steps: transformConfigSteps(item.configuration || item.steps || []),
      categories: item.categories || [],
    };
  });
}

/**
 * Transformuje kroki konfiguracji z formatu ServiceCatalog do formatu używanego w tej aplikacji
 */
function transformConfigSteps(configData: any[]): any[] {
  // Ta funkcja może wymagać dostosowania w zależności od rzeczywistego formatu danych w ServiceCatalog
  // Poniżej jest przykładowa implementacja
  return configData.map((step, index) => {
    return {
      id: step.id || `step-${index}`,
      title: step.title || `Krok ${index + 1}`,
      layout: step.layout || 'default',
      options: (step.options || []).map((option: any, optIndex: number) => {
        return {
          id: option.id || `option-${optIndex}`,
          type: option.type || 'select',
          label: option.label || `Opcja ${optIndex + 1}`,
          description: option.description || '',
          priceAdjustment: option.priceAdjustment || option.price_adjustment || 0,
          deliveryTimeAdjustment: option.deliveryTimeAdjustment || option.delivery_time_adjustment || 0,
          choices: option.choices || []
        };
      })
    };
  });
}