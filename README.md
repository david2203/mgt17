# Mansgruppen

Ett litet internt verktyg för mansgruppen, byggt med **Next.js** (App Router) och **JSON-filer som "databas"**. Helt på svenska, med enkel navigering, brödsmulor/tillbaka-länkar och fokus på tillgänglighet.

## Innehåll / navigering

- **Start** (`/`) – visar de olika områdena.
- **Mötesstruktur** (`/motesstruktur`) – hur ett möte är upplagt, steg för steg.
- **Processväljaren** (`/processer`) – välj en process och se frågorna att ställa till en man.
- **Inför nästa möte** (`/infor-nasta-mote`) – ansvarsområden och vem som är tilldelad.
- **Admin** (`/admin`) – tilldela medlemmar till ansvarsområden, sätt datum/notering. Kräver adminlösenord.

## Kom igång

> Obs: mappen kan innehålla en `node_modules`- och `.next`-mapp som skapades vid verifiering på en Linux-miljö. **Ta bort båda innan du kör lokalt** så att rätt binärer installeras för din dator:

```bash
rm -rf node_modules .next
```

Sedan:

```bash
# 1. Installera beroenden
npm install

# 2. Skapa .env.local med lösenord (se nedan)
cp .env.local.example .env.local
# öppna .env.local och ändra värdena

# 3. Starta i utvecklingsläge
npm run dev
# öppna http://localhost:3000

# Eller bygg och kör i produktionsläge
npm run build
npm run start
```

## Inloggning (namn + lösenord)

Vid inloggning anger man **sin e-postadress** (som måste finnas i `members.json`) och ett **delat lösenord**. E-postadressen fungerar som ett extra säkerhetssteg – fel adress släpps inte in. Lösenorden sätts i `.env.local`:

- `SITE_PASSWORD` – det delade lösenordet som ger medlemmar åtkomst till hela sidan.
- `ADMIN_PASSWORD` – ger även åtkomst till `/admin` (redigering av ansvarsområden). Logga in genom att välja ditt namn och ange adminlösenordet.
- `AUTH_SECRET` – en lång slumpmässig sträng som används för att signera inloggningskakan. Generera t.ex. med `openssl rand -hex 32`.

Endast namn/e-post som finns i `members.json` kan logga in. Vill du lägga till eller ta bort någon, redigera den filen (se nedan). Inloggningen sparas i en signerad, `httpOnly`-kaka i 30 dagar, och den inloggades namn visas uppe till höger. Logga ut via länken där.

## Redigera innehållet (JSON)

Allt innehåll ligger i mappen `data/` och kan redigeras direkt i en texteditor:

- **`members.json`** – medlemmarna. Varje medlem har `id` (unikt, ändra inte i onödan), `name` och `email` (används som användarnamn vid inloggning).
- **`meeting-structure.json`** – mötets `title`, valfri `intro` och en lista `steps` (titel, valfri `durationMinutes`, beskrivning).
- **`processes.json`** – processerna. Varje process har `id`, `name`, valfri `description` och en lista `questions` (frågorna att ställa).
- **`responsibilities.json`** – ansvarsområden inför nästa möte: `nextMeetingDate` (format `ÅÅÅÅ-MM-DD`), valfri `nextMeetingNote` och `areas`. Varje område har `id`, `name`, valfri `description` och `assignees` (en lista med medlems-`id`).

Ansvarsområden kan tilldelas 1, 2 eller 3 personer (eller fler) – lägg bara till fler `id` i `assignees`. Tilldelningarna kan också ändras enkelt i **Admin**-vyn utan att redigera filen för hand.

> Tips: när du lägger till nya medlemmar eller områden, ge dem ett unikt `id` (små bokstäver, inga mellanslag).

## Teknik

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS.
- Inloggning via `middleware.ts` + signerad kaka (`lib/auth.ts`).
- Dataåtkomst i `lib/data.ts`; admin-sparning via server action i `lib/actions.ts` som skriver tillbaka till `data/responsibilities.json`.

> Eftersom admin skriver till JSON-filen behöver appen köras i en miljö med skrivrättigheter till `data/` (lokalt, eller en server/VPS – inte en helt statisk/serverless-hosting där filsystemet är skrivskyddat).
