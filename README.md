# League of Legends Randomizer

En nettside som randomiserer champions, summoner spells og items for League of Legends spillere.

## Funksjoner

- Velg mellom 1-5 spillere
- Automatisk generering av champions for hver lane
- Tilfeldige summoner spells (med riktige regler for jungle)
- Tilfeldige items for hver spiller
- **Ekte bilder** fra Riot Games Data Dragon CDN
  - Champion portraits
  - Summoner spell ikoner
  - Item ikoner
- Responsivt design
- Fallback bilder hvis CDN feiler

## Kom i gang

### Installasjon

```powershell
npm install
```

### Kjør utviklingsserver

```powershell
npm run dev
```

### Bygg for produksjon

```powershell
npm run build
```

## Struktur

```
src/
├── components/       # React komponenter
├── data/            # Game data (champions, items, spells)
├── types/           # TypeScript type definitions
├── utils/           # Hjelpefunksjoner (randomizer logic)
└── App.tsx          # Hoved app komponent
```

## Neste steg

- Legg til flere champions i `src/data/gameData.ts`
- Oppdater Data Dragon versjon i `src/utils/imageUrls.ts` når nye patches kommer
- Integrer med Riot Games API for live data
- Legg til lagring av tidligere game plans (localStorage)
- Legg til mulighet for å re-roll individuelle spillere
- Eksporter/del game plan med venner
- Legg til favoritter/presets

## Data Dragon

Prosjektet bruker Riot Games' Data Dragon CDN for bilder:
- **Versjon**: 14.23.1 (oppdater i `src/utils/imageUrls.ts`)
- **Sjekk siste versjon**: https://ddragon.leagueoflegends.com/api/versions.json
- **Dokumentasjon**: https://developer.riotgames.com/docs/lol#data-dragon
