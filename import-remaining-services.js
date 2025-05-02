import fs from 'fs';
import axios from 'axios';

// Odczytaj dane usług z pliku
const allServices = JSON.parse(fs.readFileSync('./newServices.json', 'utf8'));

// Lista usług, które już zostały dodane
const addedServiceNames = [
  "Audyt UX z elementami AI",
  "Projektowanie lejków konwersji",
  "AI UX Assistant",
  "Strony w Wix Studio i Webflow",
  "E-commerce z AI",
  "Performance & SEO",
  "Facebook & Instagram Ads"
];

// Filtruj usługi, które jeszcze nie zostały dodane
const servicesToAdd = allServices.filter(service => !addedServiceNames.includes(service.name));

// Funkcja do dodawania usługi
async function addService(service) {
  try {
    const response = await axios.post('http://localhost:5000/api/services', service);
    console.log(`Dodano usługę: ${service.name} - ID: ${response.data.service.id}`);
    return response.data;
  } catch (error) {
    console.error(`Błąd podczas dodawania usługi ${service.name}:`, error.response?.data || error.message);
    return null;
  }
}

// Funkcja główna - dodaje usługi sekwencyjnie
async function importServices() {
  console.log(`Rozpoczynam import ${servicesToAdd.length} pozostałych usług...`);
  
  for (const service of servicesToAdd) {
    console.log(`Dodawanie usługi: ${service.name}`);
    await addService(service);
    // Krótkie opóźnienie między żądaniami
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('Import zakończony.');
}

// Uruchom import
importServices();