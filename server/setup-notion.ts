import { notion, NOTION_PAGE_ID, createDatabaseIfNotExists, findDatabaseByTitle } from "./notion";

// Weryfikacja zmiennych środowiskowych
if (!process.env.NOTION_INTEGRATION_SECRET) {
    throw new Error("NOTION_INTEGRATION_SECRET nie jest zdefiniowany. Dodaj go do zmiennych środowiskowych.");
}

if (!process.env.NOTION_PAGE_URL) {
    throw new Error("NOTION_PAGE_URL nie jest zdefiniowany. Dodaj go do zmiennych środowiskowych.");
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
                                content: "# Podstawy dostępności cyfrowej WCAG 2.1\n\nDostępność cyfrowa to dziedzina projektowania, która ma na celu tworzenie stron internetowych i aplikacji dostępnych dla wszystkich użytkowników, w tym osób z niepełnosprawnościami. Standard WCAG 2.1 (Web Content Accessibility Guidelines) definiuje wytyczne, które pomagają tworzyć bardziej dostępne treści cyfrowe.\n\n## Cztery główne zasady WCAG\n\n1. **Postrzegalność** - Informacje oraz komponenty interfejsu użytkownika muszą być przedstawione w sposób, który użytkownicy mogą postrzegać.\n2. **Funkcjonalność** - Komponenty interfejsu użytkownika i nawigacja muszą być funkcjonalne i dostępne dla wszystkich.\n3. **Zrozumiałość** - Informacje i obsługa interfejsu użytkownika muszą być zrozumiałe.\n4. **Solidność** - Treść musi być wystarczająco solidna, aby mogła być interpretowana przez różne przeglądarki i technologie wspomagające.\n\n## Najważniejsze wytyczne WCAG 2.1\n\n### Alternatywy tekstowe\nZapewnij alternatywy tekstowe dla treści nietekstowych, aby można je było przekształcić w inne formy według potrzeb użytkowników, takie jak duży druk, Braille, mowa, symbole lub prostszy język.\n\n### Dostosowanie prezentacji\nTwórz treści, które można zaprezentować na różne sposoby (np. prostszy układ) bez utraty informacji czy struktury.\n\n### Rozróżnialność\nUłatw użytkownikom dostrzeganie i słyszenie treści, w tym oddzielenie warstwy prezentacyjnej od treści.\n\n### Dostępność z klawiatury\nSpraw, aby wszystkie funkcje były dostępne z klawiatury.\n\n### Wystarczający czas\nZapewnij użytkownikom wystarczająco dużo czasu na przeczytanie i skorzystanie z treści.\n\n### Zrozumiały tekst\nTwórz treści tekstowe, które są czytelne i zrozumiałe.\n\n### Przewidywalność\nSpraw, aby strony internetowe były przewidywalne w działaniu.\n\n## Podsumowanie\n\nDostępność cyfrowa to nie tylko wymóg prawny w wielu krajach, ale także kwestia etyki i dobrego projektowania. Tworzenie dostępnych stron internetowych i aplikacji zwiększa zasięg odbiorców, poprawia doświadczenia użytkowników i wspiera różnorodność w internecie."
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
                                content: "# 7 trendów UX/UI na rok 2025\n\nW świecie projektowania cyfrowego, trendy ewoluują nieustannie w odpowiedzi na nowe technologie, zmieniające się oczekiwania użytkowników i innowacje w branży. Rok 2025 zapowiada się jako przełomowy dla UX/UI, z kilkoma kluczowymi trendami, które mogą zrewolucjonizować sposób, w jaki projektujemy i wchodzimy w interakcje z interfejsami cyfrowymi.\n\n## 1. Projektowanie generatywne oparte na AI\n\nSztuczna inteligencja przejmuje coraz większą rolę w projektowaniu interfejsów. W 2025 roku zobaczymy więcej narzędzi AI, które nie tylko wspierają projektantów, ale również generują projekty interfejsów na podstawie danych o użytkowniku i kontekstu użycia. Narzędzia te będą w stanie tworzyć spersonalizowane interfejsy dostosowane do indywidualnych preferencji i potrzeb użytkownika.\n\n## 2. Interfejsy biometryczne\n\nBiometria wykracza poza proste odblokowanie urządzenia odciskiem palca. W 2025 roku interfejsy będą wykorzystywać dane biometryczne do adaptacji do stanu emocjonalnego użytkownika, poziomu skupienia i nawet stanu zdrowia. Interfejsy adaptacyjne będą mogły dostosowywać się do tego, czy użytkownik jest zrelaksowany, skoncentrowany, zmęczony czy rozproszony.\n\n## 3. Immersyjne doświadczenia 3D\n\nZ rozwojem technologii AR i VR, granica między światem fizycznym a cyfrowym zaciera się coraz bardziej. W 2025 roku zobaczymy więcej immersyjnych interfejsów 3D, które wychodzą poza płaski ekran. Te interfejsy będą bardziej intuicyjne i naturalne, pozwalając użytkownikom na interakcję z cyfrowymi obiektami w sposób przypominający interakcję z obiektami fizycznymi.\n\n## 4. Mikrointerakcje oparte na gestach\n\nGesty stają się coraz ważniejszym elementem interakcji człowiek-komputer. W 2025 roku zobaczymy bardziej wyrafinowane mikrointerakcje oparte na gestach, które będą wykorzystywać zaawansowane technologie śledzenia ruchów do tworzenia bardziej intuicyjnych i angażujących doświadczeń użytkownika.\n\n## 5. Projektowanie głosowe i konwersacyjne\n\nInterakcje głosowe i konwersacyjne staną się jeszcze bardziej powszechne i zaawansowane. W 2025 roku interfejsy konwersacyjne będą bardziej naturalne, kontekstowe i zdolne do zrozumienia niuansów ludzkiej komunikacji. Zobaczymy też więcej interfejsów multimodalnych, które łączą interakcje głosowe z wizualnymi i dotykowymi.\n\n## 6. Zrównoważone projektowanie UX\n\nZrównoważony rozwój staje się coraz ważniejszym aspektem projektowania UX. W 2025 roku zobaczymy więcej projektów, które uwzględniają wpływ na środowisko poprzez optymalizację zużycia energii, redukcję danych i promowanie zrównoważonych zachowań użytkowników.\n\n## 7. Hiperpersonalizacja bez kompromisów w prywatności\n\nPersonalizacja będzie ewoluować w kierunku hiperpersonalizacji, gdzie każdy aspekt interfejsu jest dostosowany do indywidualnego użytkownika. Jednocześnie, w odpowiedzi na rosnące obawy o prywatność, zobaczymy rozwój technologii umożliwiających głęboką personalizację bez naruszania prywatności użytkowników.\n\n## Podsumowanie\n\nRok 2025 zapowiada się jako fascynujący czas dla projektantów UX/UI, pełen innowacji i nowych możliwości. Trendy te nie tylko zmienią sposób, w jaki projektujemy interfejsy, ale także jak użytkownicy wchodzą w interakcje z technologią. Firmy i projektanci, którzy będą w stanie szybko adaptować się do tych trendów, zyskają przewagę konkurencyjną w coraz bardziej cyfrowym świecie."
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

        console.log("Dodawanie przykładowych danych zakończone.");
    } catch (error) {
        console.error("Błąd podczas tworzenia przykładowych danych:", error);
    }
}

// Uruchom konfigurację
setupNotionDatabases().then(() => {
    return createSampleData();
}).then(() => {
    console.log("Konfiguracja zakończona!");
    process.exit(0);
}).catch(error => {
    console.error("Konfiguracja nie powiodła się:", error);
    process.exit(1);
});