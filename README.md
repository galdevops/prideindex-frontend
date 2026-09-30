# PrideAtlas

Frontend for [PrideAtlas](https://prideatlas.io): an interactive world map for discovering LGBTQ+ contributors across countries and fields. Pick a country, browse the areas of impact in its Pride Index, and open individual profiles with their roles, contributions, and sources.

## Stack

- Next.js 15 (App Router, Turbopack), React 19, plain JavaScript
- Tailwind CSS 4 (CSS-first, no `tailwind.config`)
- Mapbox GL JS for the map
- `react-icons` (Feather set) for icons
- Geist Sans and Geist Mono via `next/font`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Create `.env.local` with your Mapbox public token:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=<your token>
```

Other scripts: `npm run build` (production build), `npm start` (serve the build).

## Data

- **Country dataset:** fetched once on load from `GET https://pridedc.vercel.app/api/pride_index`, a GeoJSON `FeatureCollection` with each country's geometry, `iso_a2`, name, continent, UN region, and `pride_index` (aspect name to score). There is no local copy: if the request fails the app shows an error state with a retry button.
- **Profiles:** fetched on country selection from the PrideAtlas API, `GET https://pridedc.vercel.app/api/p/{iso_a2}`. The API only allows `localhost:3000` and `prideatlas.io` as origins, so test on `localhost`, not a LAN address.
- `app/data/example.json` is a sample of the profile payload shape.

## Project structure

```txt
app/
  layout.js             Root layout, fonts, metadata, theme init script, providers
  page.js               Home: map, top bar, country search, panels
  about/page.js         About page
  globals.css           Design tokens (colors, type scale, radius) and dark theme block
  context/
    CountryContext.js   Selected country, profile fetching, loading/error/notice state
    ThemeContext.js     Light / Dark / System theme state
  components/
    WorldMapTest.js     Mapbox map, country hover/select, aspect and profile modals
    CountryInfoPanel.js Country side panel / mobile bottom sheet
    AspectModal.js      People list for one aspect
    IndividualModal.js  Profile detail
    Topbar.js           Header, slide-out menu, theme toggle
    CountrySearch.js    Country autocomplete
    ThemeToggle.js      Light / Dark / System control
    ui/                 Small shared primitives: Modal, IconButton, Avatar, Chip
  lib/
    visibility.js       Visibility levels (Local to Global): rank and color
    theme.js            Theme storage key
ai/
  refactor_v1.md        Brand, UX/UI and design-system spec
```

## Design system

The spec lives in `ai/refactor_v1.md`. In short:

- Components use semantic tokens (`bg-surface`, `text-foreground`, `border-border`, `text-brand`), not raw Tailwind colors. Tokens are defined in `app/globals.css`.
- Deep violet is the brand color. Rainbow and spectrum colors are for data, not chrome.
- Radius scale: `sm` 6px, `md` 10px, `lg` 16px, `xl` 24px. Tailwind's `rounded-sm/md/lg/xl` map to it.
- Red (`text-danger`) is only for real errors. Yellow (`text-warning`) is for empty or informational states.

## Theming

Light, Dark, and System, chosen in the top bar menu and saved in `localStorage` under `prideatlas-theme`. An inline script in `layout.js` sets `data-theme` on `<html>` before first paint to avoid a flash. There is one dark token block in `globals.css`. The map keeps the Mapbox `dark-v11` style in both themes.

## Accessibility

Escape closes only the topmost modal. Modals move focus in on open and return it on close. Country aspects and people are real buttons, so the country-to-profile path works from the keyboard. Mapbox attribution is left visible.

## Deployment

Pushes to `main` deploy to production on Vercel.
