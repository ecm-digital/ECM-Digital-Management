export const newServices = [
  {
    id: "1",
    name: "Audyt UX",
    description: "Kompleksowy audyt doświadczenia użytkownika witryny i aplikacji",
    basePrice: 4500,
    deliveryTime: 21, // 2-3 tygodnie
    features: [
      "Analiza interfejsu użytkownika",
      "Testowanie użyteczności",
      "Raport z rekomendacjami",
      "Mapa doznań użytkownika (user journey map)"
    ],
    steps: [
      {
        id: "audyt-ux-zakres",
        title: "Zakres audytu",
        layout: "grid",
        options: [
          {
            id: "audyt-ux-zakres-wybor",
            type: "select",
            label: "Wybierz zakres audytu",
            choices: [
              {
                label: "Podstawowy",
                value: "podstawowy",
                priceAdjustment: 0,
                deliveryTimeAdjustment: 0
              },
              {
                label: "Rozszerzony",
                value: "rozszerzony",
                priceAdjustment: 1500,
                deliveryTimeAdjustment: 7
              },
              {
                label: "Premium",
                value: "premium",
                priceAdjustment: 3000,
                deliveryTimeAdjustment: 14
              }
            ]
          },
          {
            id: "audyt-ux-typ-projektu",
            type: "select",
            label: "Typ projektu",
            choices: [
              {
                label: "Strona internetowa",
                value: "strona",
                priceAdjustment: 0,
                deliveryTimeAdjustment: 0
              },
              {
                label: "Aplikacja mobilna",
                value: "aplikacja-mobilna",
                priceAdjustment: 1000,
                deliveryTimeAdjustment: 7
              },
              {
                label: "Aplikacja webowa",
                value: "aplikacja-webowa",
                priceAdjustment: 800,
                deliveryTimeAdjustment: 5
              }
            ]
          }
        ]
      },
      {
        id: "audyt-ux-dodatkowe",
        title: "Dodatkowe usługi",
        layout: "checkbox-grid",
        options: [
          {
            id: "audyt-ux-badania-uzytkownikow",
            type: "checkbox",
            label: "Badania z użytkownikami",
            description: "Testy z rzeczywistymi użytkownikami (do 5 osób)",
            priceAdjustment: 2000,
            deliveryTimeAdjustment: 7
          },
          {
            id: "audyt-ux-prototyp",
            type: "checkbox",
            label: "Prototyp poprawionego interfejsu",
            description: "Interaktywny prototyp z poprawkami",
            priceAdjustment: 3000,
            deliveryTimeAdjustment: 14
          },
          {
            id: "audyt-ux-prezentacja",
            type: "checkbox",
            label: "Prezentacja wyników",
            description: "Prezentacja wyników audytu online dla zespołu",
            priceAdjustment: 800,
            deliveryTimeAdjustment: 3
          }
        ]
      }
    ],
    categories: ["UX", "AI"]
  },
  {
    id: "2",
    name: "Kampania Social Media",
    description: "Profesjonalna obsługa mediów społecznościowych dla Twojej firmy",
    basePrice: 2500,
    deliveryTime: 30, // Abonament miesięczny
    features: [
      "Obsługa profili w mediach społecznościowych",
      "Tworzenie treści",
      "Planowanie publikacji",
      "Raportowanie wyników"
    ],
    steps: [
      {
        id: "social-media-kanaly",
        title: "Wybór kanałów",
        layout: "checkbox-grid",
        options: [
          {
            id: "social-media-facebook",
            type: "checkbox",
            label: "Facebook",
            description: "Obsługa profilu firmowego na Facebooku",
            priceAdjustment: 0,
            deliveryTimeAdjustment: 0
          },
          {
            id: "social-media-instagram",
            type: "checkbox",
            label: "Instagram",
            description: "Obsługa profilu firmowego na Instagramie",
            priceAdjustment: 500,
            deliveryTimeAdjustment: 0
          },
          {
            id: "social-media-linkedin",
            type: "checkbox",
            label: "LinkedIn",
            description: "Obsługa profilu firmowego na LinkedIn",
            priceAdjustment: 1000,
            deliveryTimeAdjustment: 0
          },
          {
            id: "social-media-tiktok",
            type: "checkbox",
            label: "TikTok",
            description: "Obsługa profilu firmowego na TikToku",
            priceAdjustment: 1500,
            deliveryTimeAdjustment: 0
          }
        ]
      },
      {
        id: "social-media-czestotliwosc",
        title: "Częstotliwość publikacji",
        layout: "grid",
        options: [
          {
            id: "social-media-posty-miesiecznie",
            type: "select",
            label: "Liczba postów miesięcznie",
            choices: [
              {
                label: "8 postów (2 tygodniowo)",
                value: "8",
                priceAdjustment: 0,
                deliveryTimeAdjustment: 0
              },
              {
                label: "12 postów (3 tygodniowo)",
                value: "12",
                priceAdjustment: 500,
                deliveryTimeAdjustment: 0
              },
              {
                label: "16 postów (4 tygodniowo)",
                value: "16",
                priceAdjustment: 1000,
                deliveryTimeAdjustment: 0
              },
              {
                label: "20 postów (5 tygodniowo)",
                value: "20",
                priceAdjustment: 1500,
                deliveryTimeAdjustment: 0
              }
            ]
          }
        ]
      }
    ],
    categories: ["Social Media"]
  },
  {
    id: "3",
    name: "Strona E-commerce",
    description: "Profesjonalny sklep internetowy dostosowany do potrzeb Twojego biznesu",
    basePrice: 15000,
    deliveryTime: 70, // 8-12 tygodni
    features: [
      "Responsywny design",
      "Integracja z systemami płatności",
      "Panel administracyjny",
      "Optymalizacja SEO"
    ],
    steps: [
      {
        id: "ecommerce-funkcje",
        title: "Funkcje sklepu",
        layout: "checkbox-grid",
        options: [
          {
            id: "ecommerce-koszyk",
            type: "checkbox",
            label: "Zaawansowany koszyk zakupowy",
            description: "Koszyk z zapisywaniem produktów, kodami rabatowymi itp.",
            priceAdjustment: 1000,
            deliveryTimeAdjustment: 7
          },
          {
            id: "ecommerce-platnosci",
            type: "checkbox",
            label: "Dodatkowe formy płatności",
            description: "Integracja z dodatkowymi bramkami płatności",
            priceAdjustment: 800,
            deliveryTimeAdjustment: 5
          },
          {
            id: "ecommerce-dostawy",
            type: "checkbox",
            label: "Integracja z firmami kurierskimi",
            description: "Automatyczne generowanie listów przewozowych",
            priceAdjustment: 1200,
            deliveryTimeAdjustment: 7
          },
          {
            id: "ecommerce-program-lojalnosciowy",
            type: "checkbox",
            label: "Program lojalnościowy",
            description: "System punktów i nagród dla klientów",
            priceAdjustment: 2500,
            deliveryTimeAdjustment: 14
          }
        ]
      },
      {
        id: "ecommerce-system",
        title: "System e-commerce",
        layout: "grid",
        options: [
          {
            id: "ecommerce-platforma",
            type: "select",
            label: "Platforma",
            choices: [
              {
                label: "WooCommerce (WordPress)",
                value: "woocommerce",
                priceAdjustment: 0,
                deliveryTimeAdjustment: 0
              },
              {
                label: "Shopify",
                value: "shopify",
                priceAdjustment: 2000,
                deliveryTimeAdjustment: -14
              },
              {
                label: "PrestaShop",
                value: "prestashop",
                priceAdjustment: 1000,
                deliveryTimeAdjustment: 0
              },
              {
                label: "Magento",
                value: "magento",
                priceAdjustment: 5000,
                deliveryTimeAdjustment: 21
              },
              {
                label: "Rozwiązanie dedykowane",
                value: "custom",
                priceAdjustment: 10000,
                deliveryTimeAdjustment: 30
              }
            ]
          }
        ]
      }
    ],
    categories: ["Strony", "E-commerce"]
  },
  {
    id: "4",
    name: "Automatyzacja Procesów Biznesowych",
    description: "Automatyzacja i optymalizacja procesów biznesowych przy użyciu nowoczesnych technologii",
    basePrice: 8000,
    deliveryTime: 35, // 4-6 tygodni
    features: [
      "Analiza procesów biznesowych",
      "Projektowanie rozwiązań automatyzacyjnych",
      "Implementacja narzędzi",
      "Szkolenie pracowników"
    ],
    steps: [
      {
        id: "automatyzacja-zakres",
        title: "Zakres automatyzacji",
        layout: "checkbox-grid",
        options: [
          {
            id: "automatyzacja-marketing",
            type: "checkbox",
            label: "Procesy marketingowe",
            description: "Automatyzacja kampanii marketingowych, newsletterów itp.",
            priceAdjustment: 2000,
            deliveryTimeAdjustment: 7
          },
          {
            id: "automatyzacja-sprzedaz",
            type: "checkbox",
            label: "Procesy sprzedażowe",
            description: "Automatyzacja obsługi zapytań, ofertowania, CRM",
            priceAdjustment: 2500,
            deliveryTimeAdjustment: 10
          },
          {
            id: "automatyzacja-obsluga-klienta",
            type: "checkbox",
            label: "Obsługa klienta",
            description: "Automatyzacja helpdesku, system ticketów, chatbot",
            priceAdjustment: 3000,
            deliveryTimeAdjustment: 14
          },
          {
            id: "automatyzacja-administracja",
            type: "checkbox",
            label: "Procesy administracyjne",
            description: "Automatyzacja dokumentów, fakturowania, raportowania",
            priceAdjustment: 2000,
            deliveryTimeAdjustment: 10
          }
        ]
      },
      {
        id: "automatyzacja-integracje",
        title: "Integracje",
        layout: "checkbox-grid",
        options: [
          {
            id: "automatyzacja-crm",
            type: "checkbox",
            label: "Integracja z CRM",
            description: "Połączenie z istniejącym systemem CRM",
            priceAdjustment: 1500,
            deliveryTimeAdjustment: 7
          },
          {
            id: "automatyzacja-erp",
            type: "checkbox",
            label: "Integracja z ERP",
            description: "Połączenie z istniejącym systemem ERP",
            priceAdjustment: 2500,
            deliveryTimeAdjustment: 14
          },
          {
            id: "automatyzacja-e-commerce",
            type: "checkbox",
            label: "Integracja z e-commerce",
            description: "Połączenie z istniejącym sklepem internetowym",
            priceAdjustment: 1800,
            deliveryTimeAdjustment: 10
          }
        ]
      }
    ],
    categories: ["Automatyzacje", "AI"]
  },
  {
    id: "5",
    name: "AI Chatbot",
    description: "Inteligentny chatbot oparty na sztucznej inteligencji dla Twojej strony internetowej lub aplikacji",
    basePrice: 9500,
    deliveryTime: 42, // 4-8 tygodni
    features: [
      "Sztuczna inteligencja oparta na GPT",
      "Integracja z Twoją stroną lub aplikacją",
      "Panel administracyjny",
      "Analityka rozmów"
    ],
    steps: [
      {
        id: "chatbot-zakres",
        title: "Zakres funkcjonalności",
        layout: "checkbox-grid",
        options: [
          {
            id: "chatbot-faq",
            type: "checkbox",
            label: "Odpowiedzi na FAQ",
            description: "Chatbot odpowiadający na najczęściej zadawane pytania",
            priceAdjustment: 0,
            deliveryTimeAdjustment: 0
          },
          {
            id: "chatbot-produkt",
            type: "checkbox",
            label: "Doradztwo produktowe",
            description: "Chatbot pomagający w wyborze produktu lub usługi",
            priceAdjustment: 2000,
            deliveryTimeAdjustment: 7
          },
          {
            id: "chatbot-zamowienia",
            type: "checkbox",
            label: "Obsługa zamówień",
            description: "Chatbot umożliwiający składanie zamówień",
            priceAdjustment: 3000,
            deliveryTimeAdjustment: 14
          },
          {
            id: "chatbot-rezerwacje",
            type: "checkbox",
            label: "System rezerwacji",
            description: "Chatbot do rezerwacji terminów lub zasobów",
            priceAdjustment: 2500,
            deliveryTimeAdjustment: 10
          }
        ]
      },
      {
        id: "chatbot-integracje",
        title: "Integracje",
        layout: "checkbox-grid",
        options: [
          {
            id: "chatbot-crm",
            type: "checkbox",
            label: "Integracja z CRM",
            description: "Połączenie z istniejącym systemem CRM",
            priceAdjustment: 1800,
            deliveryTimeAdjustment: 7
          },
          {
            id: "chatbot-analityka",
            type: "checkbox",
            label: "Rozszerzona analityka",
            description: "Zaawansowane raporty i analiza konwersacji",
            priceAdjustment: 1500,
            deliveryTimeAdjustment: 7
          },
          {
            id: "chatbot-wielojezyczny",
            type: "checkbox",
            label: "Obsługa wielu języków",
            description: "Chatbot komunikujący się w kilku językach",
            priceAdjustment: 2000,
            deliveryTimeAdjustment: 10
          }
        ]
      }
    ],
    categories: ["Automatyzacje", "AI"]
  }
];