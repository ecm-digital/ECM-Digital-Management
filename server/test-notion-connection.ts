import { notion, NOTION_PAGE_ID, getNotionDatabases } from "./notion";

// Funkcja testująca połączenie z Notion
async function testNotionConnection() {
    try {
        console.log("Testowanie połączenia z Notion API...");
        
        // Test 1: Pobierz informacje o stronie
        console.log(`Pobieranie informacji o stronie (ID: ${NOTION_PAGE_ID})...`);
        const pageInfo = await notion.pages.retrieve({ page_id: NOTION_PAGE_ID });
        console.log("✅ Udało się pobrać informacje o stronie");
        console.log("Tytuł strony:", pageInfo.url);
        
        // Test 2: Pobierz bazy danych na stronie
        console.log("\nPobieranie baz danych na stronie...");
        const databases = await getNotionDatabases();
        console.log(`✅ Znaleziono ${databases.length} baz danych`);
        
        if (databases.length > 0) {
            console.log("\nZnalezione bazy danych:");
            for (const db of databases) {
                const dbTitle = db.title && Array.isArray(db.title) && db.title.length > 0 
                    ? db.title[0]?.plain_text 
                    : "Bez tytułu";
                console.log(`- ${dbTitle} (ID: ${db.id})`);
            }
        }
        
        console.log("\n✅ Testy połączenia z Notion zakończone powodzeniem!");
        return true;
    } catch (error) {
        console.error("❌ Błąd podczas testowania połączenia z Notion:", error);
        return false;
    }
}

// Uruchom test połączenia
testNotionConnection()
    .then(success => {
        if (success) {
            console.log("\nMożna przystąpić do konfiguracji baz danych Notion.");
            console.log("Aby skonfigurować bazy danych, uruchom: node -r esbuild-register server/setup-notion.ts");
        } else {
            console.log("\nNapraw błędy połączenia przed konfiguracją baz danych.");
        }
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error("Nieoczekiwany błąd:", error);
        process.exit(1);
    });