# BFC Siófok — Medusa Commerce

Medusa v2 backend for the club webshop. The Next.js storefront lives in `../web/` at `/shop`.

## Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL + Redis) **or** a hosted Postgres (Neon, Supabase, …)

## Quick start

### 1. Start database

From the repo root:

```bash
docker compose up -d
```

### 2. Configure backend

```bash
cp commerce/apps/backend/.env.template commerce/apps/backend/.env
```

### 3. Migrate & seed

From the repo root:

```bash
npm run commerce:migrate
npm run commerce:seed
```

### 4. Create admin user

```bash
cd commerce/apps/backend
npx medusa user -e admin@bfcsiofok.hu -p your-secure-password
```

### 5. Start Medusa

```bash
npm run dev:commerce
```

- **API:** http://localhost:9000
- **Admin UI:** http://localhost:9000/app — manage products, orders, customers

### 6. Connect Next.js storefront

1. Open Admin → **Settings → Publishable API Keys**
2. Copy the publishable key
3. Add to `web/.env.local`:

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
```

4. Start the site: `npm run dev:web`
5. Open http://localhost:3000/shop

## What's included

- Medusa Admin for **order & product management**
- Demo seed with **BFC Siófok hazai mez** (+ sample products)
- Hungary (`hu`) in supported countries
- Next.js shop pages: `/shop`, `/shop/products/[handle]`, `/shop/cart`

## Next steps (not yet implemented)

- Stripe / SimplePay checkout
- Order confirmation emails
- Wasabi for product image storage
- Production deploy (Medusa Cloud, Railway, or Fly.io)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:commerce` | Start Medusa backend + admin |
| `npm run commerce:migrate` | Run DB migrations |
| `npm run commerce:seed` | Seed demo products & API key |
