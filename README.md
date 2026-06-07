# Ticketing system frontend

Frontend aplikacji HelpDesk/Ticketing zbudowany w Nuxt, TypeScript, Vuetify i Pinia.

## Do zrobienia

- Dodać testy jednostkowe w Vitest.
- Dodać testy E2E w Playwright.
- Rozważyć dedykowaną bibliotekę do wykresów, jeśli chcemy pewniej zaliczyć punkt za wizualizację danych.

## Zrealizowane wymagania punktowane

- `provide/inject`: globalne etykiety HelpDesk są dostarczane przez plugin i pobierane w composable.
- Komponent generyczny: `components/ui/GenericStatList.vue`.
- Komponent funkcyjny: `components/ui/StatusPill.ts`.
- QR code dla konfiguracji 2FA admina: generowany z URI `otpauth://` przy użyciu biblioteki `qrcode`.
- Drag & drop: tablica kanban zgłoszeń pozwala administratorowi przeciągać zgłoszenia między statusami.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
