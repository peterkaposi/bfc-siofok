# BFC Siófok — monorepo

Piros-fekete klubportál Sanity CMS-sel és Eredmenyek.com mérkőzésadatokkal.

```
bfc-siofok/
├── studio/     # Sanity Studio (standalone, localhost:3333)
├── web/        # Next.js frontend (localhost:3000) — includes /shop
└── commerce/   # Medusa backend (localhost:9000) — admin at /app
```

## Sanity projekt

- **Project ID:** `ko8gzdnf`
- **Dataset:** `production`

## Indítás

```bash
# Web app
npm run dev:web

# Sanity Studio
npm run dev:studio

# Medusa webshop backend (requires Docker Postgres — see commerce/README.md)
npm run dev:commerce
```

- Web: [http://localhost:3000](http://localhost:3000)
- Webshop: [http://localhost:3000/shop](http://localhost:3000/shop)
- Studio: [http://localhost:3333](http://localhost:3333)
- Medusa Admin: [http://localhost:9000/app](http://localhost:9000/app)

## Első lépések a Studio-ban

1. Futtasd: `cd studio && npm run dev`
2. Jelentkezz be Sanity fiókkal (`sanity login` ha szükséges)
3. Hozz létre **Hír** vagy **Esemény** dokumentumot
4. Publish — megjelenik a web oldalon

## Környezeti változók

Másold a `web/.env.example` fájlt `web/.env.local` néven (már elő van töltve a project ID-val).

## Deploy

- **Web:** Vercel — root directory: `web`
- **Studio:** `cd studio && npm run deploy`

## Logó

A logó: `web/public/logo.png`

## Mérkőzésadatok

Automatikusan frissül az [eredmenyek.com](https://www.eredmenyek.com/csapat/siofok/YFzGWgOR/) BFC oldaláról.
