import { Client } from "@notionhq/client";
import type { BlockObjectResponse, DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";

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
 * @returns {Promise<Array<DatabaseObjectResponse>>} - Tablica obiektów baz danych
 */
export async function getNotionDatabases() {
    // Tablica do przechowywania baz danych
    const childDatabases: DatabaseObjectResponse[] = [];

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
                if ('type' in block && block.type === "child_database") {
                    const databaseId = block.id;

                    // Pobierz informacje o bazie danych
                    try {
                        const databaseInfo = await notion.databases.retrieve({
                            database_id: databaseId,
                        });

                        // Dodaj bazę danych do listy
                        childDatabases.push(databaseInfo as DatabaseObjectResponse);
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
        const titleProperty = db.title || [];
        if (titleProperty.length > 0) {
            const dbTitle = titleProperty[0]?.plain_text?.toLowerCase() || "";
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

// Pobieranie danych z bazy danych Notion
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

// Synchronizuj zawartość z Notion do lokalnej bazy danych
export async function syncBlogPostsFromNotion(databaseId: string) {
    try {
        const pages = await getDataFromDatabase(databaseId);
        const blogPosts = [];

        for (const page of pages) {
            // Konwersja strony Notion na format lokalnej bazy danych
            if ('properties' in page) {
                const properties = page.properties;
                const title = properties.Tytuł?.title?.[0]?.plain_text || 'Bez tytułu';
                const slug = properties.Slug?.rich_text?.[0]?.plain_text || title.toLowerCase().replace(/\s+/g, '-');
                const content = properties.Treść?.rich_text?.[0]?.plain_text || '';
                const excerpt = properties.SkróconyOpis?.rich_text?.[0]?.plain_text || '';
                const category = properties.Kategoria?.select?.name || 'Inne';
                const author = properties.Autor?.rich_text?.[0]?.plain_text || 'Admin';
                const thumbnailUrl = properties.ObrazekURL?.url || '';
                const isPublished = properties.Opublikowany?.checkbox || false;
                const publishedDate = properties.DataPublikacji?.date?.start 
                    ? new Date(properties.DataPublikacji.date.start) 
                    : new Date();

                blogPosts.push({
                    notionPageId: page.id,
                    title,
                    slug,
                    content,
                    excerpt,
                    category,
                    author,
                    thumbnailUrl,
                    isPublished,
                    publishedDate
                });
            }
        }

        return blogPosts;
    } catch (error) {
        console.error("Błąd podczas synchronizacji wpisów z Notion:", error);
        throw new Error("Nie udało się zsynchronizować wpisów z Notion");
    }
}

// Synchronizuj zawartość z lokalnej bazy danych do Notion
export async function syncBlogPostToNotion(databaseId: string, blogPost: any) {
    try {
        // Konwersja wpisu na format Notion
        const properties = {
            Tytuł: {
                title: [
                    {
                        text: {
                            content: blogPost.title
                        }
                    }
                ]
            },
            Slug: {
                rich_text: [
                    {
                        text: {
                            content: blogPost.slug
                        }
                    }
                ]
            },
            Treść: {
                rich_text: [
                    {
                        text: {
                            content: blogPost.content.substring(0, 2000) // Ograniczenie do 2000 znaków
                        }
                    }
                ]
            },
            SkróconyOpis: {
                rich_text: [
                    {
                        text: {
                            content: blogPost.excerpt || ''
                        }
                    }
                ]
            },
            Kategoria: {
                select: {
                    name: blogPost.category || 'Inne'
                }
            },
            Autor: {
                rich_text: [
                    {
                        text: {
                            content: blogPost.author || 'Admin'
                        }
                    }
                ]
            },
            ObrazekURL: {
                url: blogPost.thumbnailUrl || ''
            },
            Opublikowany: {
                checkbox: blogPost.status === 'published'
            },
            DataPublikacji: {
                date: {
                    start: blogPost.publishedAt?.toISOString() || new Date().toISOString()
                }
            }
        };

        // Sprawdź, czy wpis już istnieje w Notion
        if (blogPost.notionPageId) {
            // Aktualizuj istniejącą stronę
            return await notion.pages.update({
                page_id: blogPost.notionPageId,
                properties
            });
        } else {
            // Utwórz nową stronę
            return await notion.pages.create({
                parent: {
                    database_id: databaseId,
                },
                properties
            });
        }
    } catch (error) {
        console.error("Błąd podczas synchronizacji wpisu do Notion:", error);
        throw new Error("Nie udało się zsynchronizować wpisu do Notion");
    }
}