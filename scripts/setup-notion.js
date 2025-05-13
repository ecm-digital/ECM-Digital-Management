import { Client } from '@notionhq/client';

// Funkcja do wyodrębnienia ID strony z URL Notion
function extractPageIdFromUrl(pageUrl) {
  const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
  if (match && match[1]) {
      return match[1];
  }
  throw Error("Nie udało się wyodrębnić ID strony z URL");
}

// Inicjalizacja klienta Notion
const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
});

const NOTION_PAGE_ID = extractPageIdFromUrl(process.env.NOTION_PAGE_URL);

// Znajdź bazę danych Notion o określonym tytule
async function findDatabaseByTitle(title) {
  try {
    // Pobierz wszystkie bloki podrzędne na określonej stronie
    const response = await notion.blocks.children.list({
      block_id: NOTION_PAGE_ID
    });

    // Znajdź bloki typu child_database
    const databaseBlocks = response.results.filter(
      block => 'type' in block && block.type === 'child_database'
    );

    // Dla każdego bloku bazy danych sprawdź jego tytuł
    for (const block of databaseBlocks) {
      const databaseId = block.id;
      
      try {
        const databaseInfo = await notion.databases.retrieve({
          database_id: databaseId,
        });
        
        // Pobierz tytuł bazy danych
        if (databaseInfo.title && Array.isArray(databaseInfo.title) && databaseInfo.title.length > 0) {
          const dbTitle = databaseInfo.title[0]?.plain_text || "";
          if (dbTitle.toLowerCase() === title.toLowerCase()) {
            return databaseInfo;
          }
        }
      } catch (error) {
        console.error(`Błąd podczas pobierania bazy danych ${databaseId}:`, error);
      }
    }
    
    return null;
  } catch (error) {
    console.error("Błąd podczas wyszukiwania bazy danych:", error);
    throw error;
  }
}

// Utwórz nową bazę danych, jeśli taka o określonym tytule nie istnieje
async function createDatabaseIfNotExists(title, properties) {
  try {
    // Sprawdź, czy baza danych już istnieje
    const existingDb = await findDatabaseByTitle(title);
    if (existingDb) {
      console.log(`Baza danych "${title}" już istnieje (ID: ${existingDb.id})`);
      return existingDb;
    }
    
    // Utwórz nową bazę danych
    console.log(`Tworzenie nowej bazy danych "${title}"...`);
    const response = await notion.databases.create({
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
    
    console.log(`✅ Utworzono bazę danych "${title}" (ID: ${response.id})`);
    return response;
  } catch (error) {
    console.error(`Błąd podczas tworzenia bazy danych "${title}":`, error);
    throw error;
  }
}

// Funkcja do konfiguracji baz danych w Notion dla aplikacji
async function setupNotionDatabases() {
  console.log("Rozpoczynanie konfiguracji baz danych Notion...");

  // Tworzenie bazy danych dla artykułów bazy wiedzy
  await createDatabaseIfNotExists("Baza Wiedzy", {
    // Każda baza danych potrzebuje właściwości Title
    Tytuł: {
      title: {}
    },
    Treść: {
      rich_text: {}
    },
    Slug: {
      rich_text: {}
    },
    Kategoria: {
      select: {
        options: [
          { name: "UX/UI", color: "blue" },
          { name: "E-commerce", color: "green" },
          { name: "Marketing", color: "orange" },
          { name: "AI", color: "purple" },
          { name: "Automatyzacja", color: "red" },
          { name: "Development", color: "yellow" }
        ]
      }
    },
    Autor: {
      rich_text: {}
    },
    DataPublikacji: {
      date: {}
    },
    Opublikowany: {
      checkbox: {}
    },
    ObrazekURL: {
      url: {}
    }
  });

  // Tworzenie bazy danych dla wpisów na blogu
  await createDatabaseIfNotExists("Blog", {
    Tytuł: {
      title: {}
    },
    Treść: {
      rich_text: {}
    },
    Slug: {
      rich_text: {}
    },
    Kategoria: {
      select: {
        options: [
          { name: "UX/UI", color: "blue" },
          { name: "E-commerce", color: "green" },
          { name: "Marketing", color: "orange" },
          { name: "AI", color: "purple" },
          { name: "Automatyzacja", color: "red" },
          { name: "Development", color: "yellow" }
        ]
      }
    },
    Autor: {
      rich_text: {}
    },
    DataPublikacji: {
      date: {}
    },
    Opublikowany: {
      checkbox: {}
    },
    ObrazekURL: {
      url: {}
    },
    SkróconyOpis: {
      rich_text: {}
    }
  });

  // Tworzenie bazy danych dla lead magnet
  await createDatabaseIfNotExists("Lead Magnets", {
    Nazwa: {
      title: {}
    },
    Opis: {
      rich_text: {}
    },
    Typ: {
      select: {
        options: [
          { name: "E-book", color: "blue" },
          { name: "Checklist", color: "green" },
          { name: "Szablon", color: "orange" },
          { name: "Webinar", color: "purple" }
        ]
      }
    },
    URL: {
      url: {}
    },
    ObrazekURL: {
      url: {}
    },
    Aktywny: {
      checkbox: {}
    }
  });

  console.log("Konfiguracja baz danych Notion zakończona.");
}

// Funkcja do utworzenia przykładowych danych
async function createSampleData() {
  try {
    console.log("Dodawanie przykładowych danych...");

    // Znajdź bazy danych
    const kbDatabase = await findDatabaseByTitle("Baza Wiedzy");
    const blogDatabase = await findDatabaseByTitle("Blog");
    const leadMagnetsDatabase = await findDatabaseByTitle("Lead Magnets");

    if (!kbDatabase || !blogDatabase || !leadMagnetsDatabase) {
      throw new Error("Nie znaleziono wymaganych baz danych.");
    }

    // Dodaj przykładowy artykuł do bazy wiedzy
    await notion.pages.create({
      parent: {
        database_id: kbDatabase.id
      },
      properties: {
        Tytuł: {
          title: [
            {
              text: {
                content: "Dostępność cyfrowa - podstawy WCAG 2.1"
              }
            }
          ]
        },
        Slug: {
          rich_text: [
            {
              text: {
                content: "dostepnosc-cyfrowa-podstawy-wcag"
              }
            }
          ]
        },
        Kategoria: {
          select: {
            name: "UX/UI"
          }
        },
        Autor: {
          rich_text: [
            {
              text: {
                content: "Karol Czechowski"
              }
            }
          ]
        },
        DataPublikacji: {
          date: {
            start: new Date().toISOString()
          }
        },
        Opublikowany: {
          checkbox: true
        },
        ObrazekURL: {
          url: "https://ecmdigital.pl/images/blog/accessibility.jpg"
        },
        Treść: {
          rich_text: [
            {
              text: {
                content: "# Podstawy dostępności cyfrowej WCAG 2.1\n\nDostępność cyfrowa to dziedzina projektowania, która ma na celu tworzenie stron internetowych i aplikacji dostępnych dla wszystkich użytkowników, w tym osób z niepełnosprawnościami. Standard WCAG 2.1 (Web Content Accessibility Guidelines) definiuje wytyczne, które pomagają tworzyć bardziej dostępne treści cyfrowe.\n\n## Cztery główne zasady WCAG\n\n1. **Postrzegalność** - Informacje oraz komponenty interfejsu użytkownika muszą być przedstawione w sposób, który użytkownicy mogą postrzegać.\n2. **Funkcjonalność** - Komponenty interfejsu użytkownika i nawigacja muszą być funkcjonalne i dostępne dla wszystkich.\n3. **Zrozumiałość** - Informacje i obsługa interfejsu użytkownika muszą być zrozumiałe.\n4. **Solidność** - Treść musi być wystarczająco solidna, aby mogła być interpretowana przez różne przeglądarki i technologie wspomagające."
              }
            }
          ]
        }
      }
    });

    // Dodaj przykładowy wpis na blog
    await notion.pages.create({
      parent: {
        database_id: blogDatabase.id
      },
      properties: {
        Tytuł: {
          title: [
            {
              text: {
                content: "7 trendów UX/UI na rok 2025"
              }
            }
          ]
        },
        Slug: {
          rich_text: [
            {
              text: {
                content: "7-trendow-ux-ui-na-rok-2025"
              }
            }
          ]
        },
        Kategoria: {
          select: {
            name: "UX/UI"
          }
        },
        Autor: {
          rich_text: [
            {
              text: {
                content: "Mario Świderski"
              }
            }
          ]
        },
        DataPublikacji: {
          date: {
            start: new Date().toISOString()
          }
        },
        Opublikowany: {
          checkbox: true
        },
        ObrazekURL: {
          url: "https://ecmdigital.pl/images/blog/ui-trends.jpg"
        },
        SkróconyOpis: {
          rich_text: [
            {
              text: {
                content: "Poznaj najnowsze trendy w projektowaniu UX/UI, które zdominują rok 2025 i dowiedz się, jak wdrożyć je w swoich projektach."
              }
            }
          ]
        },
        Treść: {
          rich_text: [
            {
              text: {
                content: "# 7 trendów UX/UI na rok 2025\n\nW świecie projektowania cyfrowego, trendy ewoluują nieustannie w odpowiedzi na nowe technologie, zmieniające się oczekiwania użytkowników i innowacje w branży. Rok 2025 zapowiada się jako przełomowy dla UX/UI, z kilkoma kluczowymi trendami, które mogą zrewolucjonizować sposób, w jaki projektujemy i wchodzimy w interakcje z interfejsami cyfrowymi."
              }
            }
          ]
        }
      }
    });

    // Dodaj przykładowy lead magnet
    await notion.pages.create({
      parent: {
        database_id: leadMagnetsDatabase.id
      },
      properties: {
        Nazwa: {
          title: [
            {
              text: {
                content: "E-book: UX/UI dla początkujących"
              }
            }
          ]
        },
        Opis: {
          rich_text: [
            {
              text: {
                content: "Kompletny przewodnik dla początkujących projektantów UX/UI. Poznaj podstawy projektowania interfejsów, metodologie badawcze i najlepsze praktyki."
              }
            }
          ]
        },
        Typ: {
          select: {
            name: "E-book"
          }
        },
        URL: {
          url: "https://ecmdigital.pl/ebooks/ux-ui-dla-poczatkujacych.pdf"
        },
        ObrazekURL: {
          url: "https://ecmdigital.pl/images/lead-magnets/ux-ebook-cover.jpg"
        },
        Aktywny: {
          checkbox: true
        }
      }
    });

    console.log("Dodano przykładowe dane do baz danych Notion");
  } catch (error) {
    console.error("Błąd podczas tworzenia przykładowych danych:", error);
  }
}

// Sprawdź, czy wymagane zmienne środowiskowe są ustawione
if (!process.env.NOTION_INTEGRATION_SECRET) {
  console.error("❌ Brak zmiennej środowiskowej NOTION_INTEGRATION_SECRET");
  process.exit(1);
}

if (!process.env.NOTION_PAGE_URL) {
  console.error("❌ Brak zmiennej środowiskowej NOTION_PAGE_URL");
  process.exit(1);
}

// Uruchom konfigurację
setupNotionDatabases()
  .then(() => {
    return createSampleData();
  })
  .then(() => {
    console.log("Konfiguracja Notion zakończona pomyślnie!");
    console.log("\nMożesz teraz korzystać z integracji z Notion poprzez API:");
    console.log("- GET /api/notion/databases - pobierz listę baz danych");
    console.log("- POST /api/notion/sync/blog - synchronizuj wpisy z Notion do lokalnej bazy danych");
    console.log("- POST /api/notion/sync/blog/:id - synchronizuj pojedynczy wpis do Notion");
    console.log("- GET /api/notion/sync/status - pobierz status synchronizacji");
    process.exit(0);
  })
  .catch(error => {
    console.error("Konfiguracja Notion nie powiodła się:", error);
    process.exit(1);
  });