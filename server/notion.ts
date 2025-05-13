import { Client } from "@notionhq/client";

// Inicjalizacja klienta Notion
export const notion = new Client({
    auth: process.env.NOTION_INTEGRATION_SECRET!,
});

// Ekstrakcja ID strony z URL Notion
function extractPageIdFromUrl(pageUrl: string): string {
    const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
    if (match && match[1]) {
        return match[1];
    }

    throw Error("Nie udało się wyodrębnić ID strony z URL");
}

export const NOTION_PAGE_ID = extractPageIdFromUrl(process.env.NOTION_PAGE_URL!);

/**
 * Pobiera listę wszystkich baz danych na stronie Notion
 * @returns {Promise<Array<{id: string, title: string}>>} - Tablica obiektów zawierających id i tytuł bazy danych
 */
export async function getNotionDatabases() {
    // Tablica do przechowywania baz danych
    const childDatabases = [];

    try {
        // Pobierz wszystkie bloki podrzędne na określonej stronie
        let hasMore = true;
        let startCursor: string | undefined = undefined;

        while (hasMore) {
            const response = await notion.blocks.children.list({
                block_id: NOTION_PAGE_ID,
                start_cursor: startCursor,
            });

            // Przetwarzanie wyników
            for (const block of response.results) {
                // Sprawdź, czy blok jest bazą danych
                if (block.type === "child_database") {
                    const databaseId = block.id;

                    // Pobierz informacje o bazie danych
                    try {
                        const databaseInfo = await notion.databases.retrieve({
                            database_id: databaseId,
                        });

                        // Dodaj bazę danych do listy
                        childDatabases.push(databaseInfo);
                    } catch (error) {
                        console.error(`Błąd podczas pobierania bazy danych ${databaseId}:`, error);
                    }
                }
            }

            // Sprawdź, czy są więcej wyników do pobrania
            hasMore = response.has_more;
            startCursor = response.next_cursor || undefined;
        }

        return childDatabases;
    } catch (error) {
        console.error("Błąd podczas pobierania baz danych:", error);
        throw error;
    }
}

// Znajdź bazę danych Notion o określonym tytule
export async function findDatabaseByTitle(title: string) {
    const databases = await getNotionDatabases();

    for (const db of databases) {
        if (db.title && Array.isArray(db.title) && db.title.length > 0) {
            const dbTitle = db.title[0]?.plain_text?.toLowerCase() || "";
            if (dbTitle === title.toLowerCase()) {
                return db;
            }
        }
    }

    return null;
}

// Utwórz nową bazę danych, jeśli taka o określonym tytule nie istnieje
export async function createDatabaseIfNotExists(title: string, properties: any) {
    const existingDb = await findDatabaseByTitle(title);
    if (existingDb) {
        return existingDb;
    }
    return await notion.databases.create({
        parent: {
            type: "page_id",
            page_id: NOTION_PAGE_ID
        },
        title: [
            {
                type: "text",
                text: {
                    content: title
                }
            }
        ],
        properties
    });
}

// Przykładowa funkcja do pobierania danych z bazy danych Notion
export async function getDataFromDatabase(databaseId: string) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
        });

        return response.results;
    } catch (error) {
        console.error("Błąd podczas pobierania danych z bazy Notion:", error);
        throw new Error("Nie udało się pobrać danych z bazy Notion");
    }
}

// Zapisz dane do bazy danych Notion
export async function saveToNotion(databaseId: string, data: any) {
    try {
        const response = await notion.pages.create({
            parent: {
                database_id: databaseId,
            },
            properties: data,
        });
        
        return response;
    } catch (error) {
        console.error("Błąd podczas zapisywania danych do Notion:", error);
        throw new Error("Nie udało się zapisać danych do Notion");
    }
}