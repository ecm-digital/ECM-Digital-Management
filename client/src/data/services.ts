import { Service } from "@/types";

export const services: Service[] = [
  {
    id: "1",
    name: "Audyt SEO",
    description: "Kompleksowy audyt strony internetowej pod kątem optymalizacji dla wyszukiwarek",
    basePrice: 1500,
    deliveryTime: 7,
    features: ["Analiza techniczna", "Analiza treści", "Analiza konkurencji", "Raport z rekomendacjami"],
    steps: [
      {
        id: "audyt-seo-zakres",
        title: "Zakres audytu",
        layout: "grid",
        options: [
          {
            id: "audyt-seo-zakres-wybor",
            type: "select",
            label: "Wybierz zakres audytu",
            choices: [
              {
                value: "podstawowy",
                label: "Podstawowy",
                priceAdjustment: 0,
                deliveryTimeAdjustment: 0
              },
              {
                value: "rozszerzony",
                label: "Rozszerzony",
                priceAdjustment: 500,
                deliveryTimeAdjustment: 3
              },
              {
                value: "premium",
                label: "Premium",
                priceAdjustment: 1000,
                deliveryTimeAdjustment: 5
              }
            ]
          },
          {
            id: "audyt-seo-konkurencja",
            type: "select",
            label: "Analiza konkurencji",
            choices: [
              {
                value: "3",
                label: "3 konkurentów",
                priceAdjustment: 0,
                deliveryTimeAdjustment: 0
              },
              {
                value: "5",
                label: "5 konkurentów",
                priceAdjustment: 300,
                deliveryTimeAdjustment: 2
              },
              {
                value: "10",
                label: "10 konkurentów",
                priceAdjustment: 700,
                deliveryTimeAdjustment: 4
              }
            ]
          }
        ]
      },
      {
        id: "audyt-seo-dodatkowe",
        title: "Dodatkowe usługi",
        layout: "checkbox-grid",
        options: [
          {
            id: "audyt-seo-konsultacja",
            type: "checkbox",
            label: "Konsultacja z ekspertem",
            description: "Godzinna konsultacja z ekspertem SEO po audycie",
            priceAdjustment: 300,
            deliveryTimeAdjustment: 1
          },
          {
            id: "audyt-seo-plan-dzialan",
            type: "checkbox",
            label: "Plan działań naprawczych",
            description: "Szczegółowy plan krok po kroku do wdrożenia przez programistów",
            priceAdjustment: 500,
            deliveryTimeAdjustment: 3
          },
          {
            id: "audyt-seo-monitoring",
            type: "checkbox",
            label: "Monitoring wdrożenia",
            description: "Kontrola poprawności wdrożenia zmian przez 30 dni",
            priceAdjustment: 700,
            deliveryTimeAdjustment: 2
          },
          {
            id: "audyt-seo-prezentacja",
            type: "checkbox",
            label: "Prezentacja wyników",
            description: "Prezentacja wyników audytu online dla zespołu",
            priceAdjustment: 400,
            deliveryTimeAdjustment: 1
          }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Kampania Google Ads",
    description: "Profesjonalna kampania reklamowa w wyszukiwarce Google",
    basePrice: 2000,
    deliveryTime: 10,
    features: ["Analiza słów kluczowych", "Tworzenie reklam", "Optymalizacja konwersji", "Raportowanie"],
    steps: [
      {
        id: "google-ads-zakres",
        title: "Zakres kampanii",
        layout: "grid",
        options: [
          {
            id: "google-ads-typ",
            type: "select",
            label: "Typ kampanii",
            choices: [
              {
                value: "wyszukiwarka",
                label: "Wyszukiwarka",
                priceAdjustment: 0,
                deliveryTimeAdjustment: 0
              },
              {
                value: "display",
                label: "Sieć reklamowa",
                priceAdjustment: 300,
                deliveryTimeAdjustment: 2
              },
              {
                value: "zakupowa",
                label: "Zakupowa",
                priceAdjustment: 600,
                deliveryTimeAdjustment: 3
              },
              {
                value: "kompleksowa",
                label: "Kompleksowa (wszystkie typy)",
                priceAdjustment: 1000,
                deliveryTimeAdjustment: 5
              }
            ]
          },
          {
            id: "google-ads-czas",
            type: "select",
            label: "Czas trwania kampanii",
            choices: [
              {
                value: "30dni",
                label: "30 dni",
                priceAdjustment: 0,
                deliveryTimeAdjustment: 0
              },
              {
                value: "60dni",
                label: "60 dni",
                priceAdjustment: 800,
                deliveryTimeAdjustment: 0
              },
              {
                value: "90dni",
                label: "90 dni",
                priceAdjustment: 1500,
                deliveryTimeAdjustment: 0
              }
            ]
          }
        ]
      },
      {
        id: "google-ads-dodatkowe",
        title: "Dodatkowe usługi",
        layout: "checkbox-grid",
        options: [
          {
            id: "google-ads-reklamy",
            type: "checkbox",
            label: "Responsywne reklamy",
            description: "Tworzenie responsywnych reklam tekstowych",
            priceAdjustment: 400,
            deliveryTimeAdjustment: 2
          },
          {
            id: "google-ads-remarketing",
            type: "checkbox",
            label: "Remarketing",
            description: "Kampania remarketingowa dla odwiedzających stronę",
            priceAdjustment: 600,
            deliveryTimeAdjustment: 3
          },
          {
            id: "google-ads-analityka",
            type: "checkbox",
            label: "Rozszerzona analityka",
            description: "Szczegółowa analityka wyników kampanii",
            priceAdjustment: 500,
            deliveryTimeAdjustment: 2
          }
        ]
      }
    ]
  },
  {
    id: "3",
    name: "Strona internetowa",
    description: "Profesjonalna, responsywna strona internetowa dopasowana do potrzeb Twojego biznesu",
    basePrice: 3500,
    deliveryTime: 14,
    features: ["Responsywny design", "SEO-friendly", "Szybkie ładowanie", "CMS"],
    steps: [
      {
        id: "strona-internetowa-typ",
        title: "Typ strony",
        layout: "grid",
        options: [
          {
            id: "strona-internetowa-rodzaj",
            type: "select",
            label: "Rodzaj strony",
            choices: [
              {
                value: "wizytowka",
                label: "Strona wizytówkowa (do 5 podstron)",
                priceAdjustment: 0,
                deliveryTimeAdjustment: 0
              },
              {
                value: "firmowa",
                label: "Strona firmowa (do 10 podstron)",
                priceAdjustment: 1500,
                deliveryTimeAdjustment: 7
              },
              {
                value: "sklep",
                label: "Sklep internetowy (do 100 produktów)",
                priceAdjustment: 4000,
                deliveryTimeAdjustment: 14
              }
            ]
          },
          {
            id: "strona-internetowa-jezyki",
            type: "select",
            label: "Wersje językowe",
            choices: [
              {
                value: "1",
                label: "Jedna wersja językowa",
                priceAdjustment: 0,
                deliveryTimeAdjustment: 0
              },
              {
                value: "2",
                label: "Dwie wersje językowe",
                priceAdjustment: 1000,
                deliveryTimeAdjustment: 5
              },
              {
                value: "3",
                label: "Trzy wersje językowe",
                priceAdjustment: 2000,
                deliveryTimeAdjustment: 10
              }
            ]
          }
        ]
      },
      {
        id: "strona-internetowa-funkcje",
        title: "Dodatkowe funkcje",
        layout: "checkbox-grid",
        options: [
          {
            id: "strona-internetowa-blog",
            type: "checkbox",
            label: "Blog",
            description: "System zarządzania artykułami i treścią",
            priceAdjustment: 1000,
            deliveryTimeAdjustment: 5
          },
          {
            id: "strona-internetowa-formularz",
            type: "checkbox",
            label: "Zaawansowany formularz kontaktowy",
            description: "Formularze z wieloma polami i walidacją",
            priceAdjustment: 600,
            deliveryTimeAdjustment: 3
          },
          {
            id: "strona-internetowa-newsletter",
            type: "checkbox",
            label: "Newsletter",
            description: "System zapisów do newslettera z integracją",
            priceAdjustment: 800,
            deliveryTimeAdjustment: 4
          },
          {
            id: "strona-internetowa-chat",
            type: "checkbox",
            label: "Czat na stronie",
            description: "Integracja z systemem live chat",
            priceAdjustment: 700,
            deliveryTimeAdjustment: 2
          }
        ]
      }
    ]
  },
  {
    id: "4",
    name: "Strategia marketingowa",
    description: "Kompleksowa strategia marketingowa dla Twojej firmy",
    basePrice: 5000,
    deliveryTime: 21,
    features: ["Analiza rynku", "Analiza konkurencji", "Plan działań", "Harmonogram"],
    steps: [
      {
        id: "strategia-marketingowa-zakres",
        title: "Zakres strategii",
        layout: "grid",
        options: [
          {
            id: "strategia-marketingowa-obszar",
            type: "select",
            label: "Obszar strategii",
            choices: [
              {
                value: "digitalowa",
                label: "Digital marketing",
                priceAdjustment: 0,
                deliveryTimeAdjustment: 0
              },
              {
                value: "kompleksowa",
                label: "Marketing kompleksowy (online + offline)",
                priceAdjustment: 2000,
                deliveryTimeAdjustment: 7
              },
              {
                value: "rebranding",
                label: "Rebranding i strategia komunikacji",
                priceAdjustment: 3000,
                deliveryTimeAdjustment: 14
              }
            ]
          },
          {
            id: "strategia-marketingowa-czas",
            type: "select",
            label: "Horyzont czasowy",
            choices: [
              {
                value: "kwartal",
                label: "Kwartał",
                priceAdjustment: 0,
                deliveryTimeAdjustment: 0
              },
              {
                value: "polrocze",
                label: "Pół roku",
                priceAdjustment: 1000,
                deliveryTimeAdjustment: 5
              },
              {
                value: "rok",
                label: "Rok",
                priceAdjustment: 2500,
                deliveryTimeAdjustment: 10
              }
            ]
          }
        ]
      },
      {
        id: "strategia-marketingowa-dodatkowe",
        title: "Dodatkowe elementy",
        layout: "checkbox-grid",
        options: [
          {
            id: "strategia-marketingowa-badania",
            type: "checkbox",
            label: "Badania rynkowe",
            description: "Przeprowadzenie badań rynkowych",
            priceAdjustment: 1500,
            deliveryTimeAdjustment: 7
          },
          {
            id: "strategia-marketingowa-persony",
            type: "checkbox",
            label: "Persony marketingowe",
            description: "Opracowanie person marketingowych",
            priceAdjustment: 800,
            deliveryTimeAdjustment: 4
          },
          {
            id: "strategia-marketingowa-kpi",
            type: "checkbox",
            label: "System KPI",
            description: "Opracowanie systemu wskaźników efektywności",
            priceAdjustment: 1000,
            deliveryTimeAdjustment: 5
          },
          {
            id: "strategia-marketingowa-prezentacja",
            type: "checkbox",
            label: "Prezentacja dla zarządu",
            description: "Przygotowanie prezentacji dla zarządu",
            priceAdjustment: 1200,
            deliveryTimeAdjustment: 3
          }
        ]
      }
    ]
  }
];