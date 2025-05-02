// Service Interface
export interface Service {
  id: string;
  name: string;
  shortDescription?: string;   // Krótki opis
  description: string;         // Podstawowy opis
  longDescription?: string;    // Długi/szczegółowy opis
  basePrice: number;
  deliveryTime: number;
  features?: string[];         // Główne cechy (dla wstecznej kompatybilności)
  benefits?: string[];         // Lista korzyści
  scope?: string[];            // Zakres usługi
  steps?: ConfigStep[];
  category?: string;
  status?: string;
}

// Configuration Step Interface
export interface ConfigStep {
  id: string;
  title: string;
  layout?: 'grid' | 'checkbox-grid' | 'default';
  options?: ConfigOption[];
}

// Configuration Option Interface
export interface ConfigOption {
  id: string;
  type: 'select' | 'checkbox' | 'text';
  label: string;
  description?: string;
  priceAdjustment?: number;
  deliveryTimeAdjustment?: number;
  choices?: {
    value: string;
    label: string;
    priceAdjustment?: number;
    deliveryTimeAdjustment?: number;
  }[];
}

// Service Order Interface
export interface ServiceOrder {
  service: Service | null;
  configuration: Record<string, any>;
  contactInfo: Record<string, any>;
  totalPrice: number;
  deliveryTime?: number;
  uploadedFile: File | null;
}

// Order Interface
export interface Order {
  id: string;
  serviceId: string;
  configuration: Record<string, any>;
  contactInfo: Record<string, any>;
  totalPrice: number;
  deliveryTime: number;
  fileUrl?: string;
  createdAt: string;
}
