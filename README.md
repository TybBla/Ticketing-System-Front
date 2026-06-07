# Ticketing system frontend

Frontend aplikacji HelpDesk/Ticketing zbudowany w Nuxt 3/4, TypeScript, Vuetify 3/4 i Pinia. Aplikacja działa jako SPA, a zapytania do backendu ASP.NET Core przechodzą przez endpointy Nuxta `/api/...`.

## Uruchomienie

```bash
npm install
npm run dev
```

Domyślnie frontend startuje pod `http://localhost:3000`.

## Weryfikacja

```bash
npm run test
npm run build
```

## Mapa wymagań punktowanych

| Wymaganie | Realizacja | Gdzie pokazać |
| --- | --- | --- |
| Nuxt / metaframework | Projekt działa w Nuxt, CSR SPA, z proxy `/api/...` do backendu | `nuxt.config.ts`, `server/api/[...].ts` |
| TypeScript | Typy DTO, enumy i komponenty pisane w TS | `types/api.ts`, komponenty `.vue` |
| Vuetify | UI formularzy, tabel, kart, dialogów i nawigacji | `plugins/vuetify.ts`, widoki w `pages/` |
| Pinia / storage | Autoryzacja, preferencje, monitoring i powiadomienia w store | `stores/auth.ts`, `stores/preferences.ts`, `stores/monitoring.ts` |
| VueUse | Trwałe preferencje i logi przez `useLocalStorage` | `stores/preferences.ts`, `stores/monitoring.ts` |
| Routing i middleware | Widoki admin/user oraz ochrona tras | `pages/`, `middleware/auth.ts`, `middleware/admin.ts` |
| Composition API | `ref`, `computed`, `watch`, composables | `composables/`, `pages/index.vue` |
| Komponenty | Podział na formularze, tabele, analitykę, layouty | `components/` |
| Komponent asynchroniczny | Dialog szczegółów ładowany przez `defineAsyncComponent` z loaderem | `pages/index.vue`, `TicketDetailsDialogLoader.vue` |
| Komponent generyczny | Lista statystyk oparta na funkcjach `getKey/getLabel/getValue` | `components/ui/GenericStatList.vue` |
| Komponent funkcyjny | Status jako renderowany komponent funkcyjny | `components/ui/StatusPill.ts` |
| Props / emits / slots | Tabela zgłoszeń, filtry i dialogi komunikują się przez props/emits/slot empty | `TicketTable.vue`, `TicketFilters.vue` |
| Własny v-model | Dedykowany selector statusu zgłoszenia używa `defineModel` | `components/tickets/TicketStatusSelect.vue` |
| Formularze i walidacja | Logowanie, 2FA, tworzenie zgłoszeń i użytkowników | `pages/login.vue`, `TicketForm.vue`, `UsersCreateDialog.vue` |
| Własna dyrektywa | Autofocus pól formularza przez `v-focus` | `directives/focus.ts`, `plugins/vuetify.ts` |
| Provide/Inject | Globalne etykiety domenowe HelpDesk | `plugins/helpdesk-labels.ts`, `useHelpdeskLabels.ts` |
| Wielojęzykowość | Prosty słownik PL/EN i przełącznik języka | `utils/i18n.ts`, `LocaleSwitcher.vue` |
| Ikony | Ikony Material Design w nawigacji, kartach i akcjach | `@mdi/font`, komponenty Vuetify |
| Drag & drop | Tablica Kanban zmienia status zgłoszenia przez przeciąganie | `components/tickets/TicketKanbanBoard.vue` |
| Teleport | Toast powiadomień renderowany do `body` | `components/notifications/NotificationToast.vue` |
| Przejścia / animacje | Przejścia stron i animacja toastów | `nuxt.config.ts`, `NotificationToast.vue`, `assets/main.css` |
| Wizualizacja danych | Wykres doughnut Chart.js oraz statystyki statusów | `TicketAnalytics.vue`, `utils/ticketAnalytics.ts` |
| Vitest | Testy jednostkowe logiki analitycznej zgłoszeń | `tests/ticketAnalytics.test.ts` |
| Monitoring lokalny | Rejestr błędów frontendu, liczniki, eksport JSON i zdarzenie testowe | `plugins/local-monitoring.client.ts`, `pages/admin/diagnostics.vue` |
| QR 2FA | QR konfiguracji 2FA admina z biblioteki `qrcode` | `pages/login.vue` |

## Scenariusz prezentacji

1. Zalogować się jako admin.
2. Pokazać panel zgłoszeń, wykresy, Kanban drag & drop i tabelę.
3. Otworzyć szczegóły zgłoszenia ikoną oka.
4. Przełączyć język PL/EN i jasny/ciemny motyw.
5. Przejść do diagnostyki, dodać testowe zdarzenie i wyeksportować log.
6. Pokazać testy: `npm run test`.
