# Ticketing System Frontend

## Uruchomienie całej aplikacji przez Docker Compose

Ten wariant uruchamia cały system: bazę MariaDB, RabbitMQ, główne API, worker powiadomień oraz frontend.

Wymagania:

- Docker Desktop
- Docker Compose

Przed pierwszym uruchomieniem utwórz w katalogu projektu plik `.env`:

```env
MARIADB_ROOT_PASSWORD=root_password
DB_PASSWORD=ticketing_password
JWT_SECRET=very-long-secret-key-for-ticketing-system-123456789=
```

Następnie uruchom cały system:

```bash
docker compose up -d
```

Po uruchomieniu aplikacja będzie dostępna pod adresem:

```text
http://localhost:3000
```

Przydatne adresy usług:

- frontend: `http://localhost:3000`
- backend API: `http://localhost:5000`
- worker powiadomień: `http://localhost:5001`
- RabbitMQ Management: `http://localhost:15672`
- MariaDB: `localhost:3307`

Zatrzymanie kontenerów bez usuwania danych:

```bash
docker compose down
```

Pełne wyczyszczenie kontenerów razem z wolumenem bazy danych:

```bash
docker compose down -v
```

Frontend aplikacji HelpDesk/Ticketing zbudowany w Nuxt, TypeScript, Vuetify i Pinia. Aplikacja działa jako SPA i komunikuje się z backendem przez lokalne endpointy Nuxta `/api/...` oraz `/notifications`, które przekazują żądania do backendu ASP.NET Core.

## Wymagania

- Node.js
- npm
- uruchomiony backend aplikacji

## Konfiguracja

Domyślne adresy backendu:

```env
NUXT_API_BASE_URL=http://127.0.0.1:5000
NUXT_NOTIFICATION_HUB_BASE_URL=http://127.0.0.1:5001
```

Jeśli backend działa na innych portach, utwórz lub edytuj plik `.env` w katalogu projektu i ustaw właściwe wartości.

## Uruchomienie

Zainstaluj zależności:

```bash
npm install
```

Uruchom aplikację w trybie developerskim:

```bash
npm run dev
```

Frontend będzie dostępny pod adresem:

```text
http://localhost:3000
```

## Testowanie

Testy znajdują się w katalogu `tests`.

Struktura testów:

- `tests/ticketAnalytics.test.ts` - testy jednostkowe logiki analitycznej zgłoszeń uruchamiane przez Vitest
- `tests/e2e/ticket-flow.spec.ts` - test E2E w Playwright sprawdzający logowanie pracownika i utworzenie zgłoszenia

Uruchomienie testów jednostkowych:

```bash
npm run test
```

Uruchomienie testu E2E:

```bash
npm run test:e2e
```

Test E2E uruchamia aplikację przez konfigurację Playwrighta z pliku `playwright.config.ts`. Jeśli aplikacja działa już lokalnie pod `http://localhost:3000`, Playwright użyje istniejącego serwera.

## Build Produkcyjny

```bash
npm run build
```

Podgląd zbudowanej aplikacji:

```bash
npm run preview
```
