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
- Statiskt innehåll (medlemmar, processer, mötesstruktur, arbetsrunda, riktlinjer) bundlas in från `data/*.json`.
- Det enda som ändras via admin – ansvarsområdena – lagras:
  - **lokalt** i `data/responsibilities.json`, och
  - **i produktion** i Upstash Redis (eftersom serverless-filsystem är skrivskyddat).

## Driftsättning på Vercel

1. Lägg projektet i ett Git-repo (GitHub/GitLab) och importera det på [vercel.com](https://vercel.com). Vercel känner igen Next.js automatiskt.
2. **Lägg till en Redis-databas** (för att admin-sparningar ska bli kvar): i Vercel-projektet → fliken **Storage** → **Marketplace** → **Upstash → Redis** → skapa och koppla till projektet. Det sätter automatiskt `UPSTASH_REDIS_REST_URL` och `UPSTASH_REDIS_REST_TOKEN`.
3. **Lägg till miljövariabler** under Settings → Environment Variables:
   - `SITE_PASSWORD` – medlemslösenordet
   - `ADMIN_PASSWORD` – adminlösenordet
   - `AUTH_SECRET` – en lång slumpmässig sträng (`openssl rand -hex 32`)
4. Deploya. Sidan ligger sedan på `https://<projekt>.vercel.app`.

> Utan Redis fungerar sidan på Vercel men **admin-ändringar sparas inte** (de återställs vid omstart/deploy). Med Redis sparas de korrekt.
>
> När Redis är tomt (första gången) används innehållet i `data/responsibilities.json` som utgångsläge. Därefter är Redis källan – vill du nollställa kan du tömma nyckeln `mansgrupp:responsibilities` i Upstash.

Lokalt behövs ingen Redis – då används JSON-filen automatiskt.
