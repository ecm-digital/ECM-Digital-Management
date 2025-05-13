// Prosty skrypt testowy do sprawdzenia połączenia z Notion API
import { Client } from '@notionhq/client';

// Funkcja do wyodrębnienia ID strony z URL Notion
function extractPageIdFromUrl(pageUrl) {
  const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
  if (match && match[1]) {
      return match[1];
  }
  throw Error("Nie udało się wyodrębnić ID strony z URL");
}

async function testNotionConnection() {
  try {
    // Inicjalizacja klienta Notion
    const notion = new Client({
      auth: process.env.NOTION_INTEGRATION_SECRET,
    });

    console.log("Testowanie połączenia z Notion API...");
    
    // Pobierz ID strony z URL
    const pageId = extractPageIdFromUrl(process.env.NOTION_PAGE_URL);
    console.log(`ID strony Notion: ${pageId}`);
    
    // Test 1: Pobierz informacje o stronie
    console.log(`\nPobieranie informacji o stronie (ID: ${pageId})...`);
    const pageInfo = await notion.pages.retrieve({ page_id: pageId });
    console.log("✅ Udało się pobrać informacje o stronie");
    console.log("ID strony:", pageInfo.id);
    
    // Test 2: Pobierz bloki podrzędne na stronie (znajdź bazy danych)
    console.log("\nPobieranie bloków na stronie...");
    const blocksResponse = await notion.blocks.children.list({ block_id: pageId });
    
    const databaseBlocks = blocksResponse.results.filter(block => 
      'type' in block && block.type === 'child_database'
    );
    
    console.log(`✅ Znaleziono ${databaseBlocks.length} baz danych`);
    
    // Test 3: Jeśli znaleziono bazy danych, pobierz szczegóły o pierwszej z nich
    if (databaseBlocks.length > 0) {
      const firstDbId = databaseBlocks[0].id;
      console.log(`\nPobieranie szczegółów bazy danych (ID: ${firstDbId})...`);
      
      const dbInfo = await notion.databases.retrieve({ database_id: firstDbId });
      console.log("✅ Udało się pobrać informacje o bazie danych");
      
      // Pobierz tytuł bazy danych
      let dbTitle = "Bez tytułu";
      if (dbInfo.title && Array.isArray(dbInfo.title) && dbInfo.title.length > 0) {
        dbTitle = dbInfo.title[0]?.plain_text || "Bez tytułu";
      }
      
      console.log("Tytuł bazy danych:", dbTitle);
      
      // Test 4: Pobierz dane z bazy danych
      console.log(`\nPobieranie danych z bazy ${dbTitle}...`);
      const dbData = await notion.databases.query({ database_id: firstDbId });
      
      console.log(`✅ Pobrano ${dbData.results.length} wierszy z bazy danych`);
    }
    
    console.log("\n✅ Wszystkie testy połączenia z Notion zakończone powodzeniem!");
    return true;
  } catch (error) {
    console.error("❌ Błąd podczas testowania połączenia z Notion:", error);
    return false;
  }
}

// Uruchom test
testNotionConnection()
  .then(success => {
    if (success) {
      console.log("\nMożna przystąpić do konfiguracji baz danych Notion.");
      console.log("Aby utworzyć tabele śledzące synchronizację, uruchom: node scripts/create-notion-tables.js");
    } else {
      console.log("\nNapraw błędy połączenia z Notion przed kontynuowaniem.");
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error("Nieoczekiwany błąd:", error);
    process.exit(1);
  });