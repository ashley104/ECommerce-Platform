# Web App

Next.js storefront for browsing products, signing in with GitHub, and checking out orders.

## Local Development

- App URL: `http://localhost:3001`
- API reference: [docs/api.md](../../docs/api.md)
- Shared data layer: `packages/db`

## API Routes

- `/api/auth/[...nextauth]` for GitHub-based sign-in and sign-out
- `/api/checkout` for Stripe checkout session creation
- `/api/orders` for creating paid orders after checkout

## Client-specific features

- **Product catalog:** Browse products with categories and search, powered by `packages/db` queries.
- **Checkout & payments:** Creates Stripe Checkout sessions via `/api/checkout` and records paid orders via `/api/orders`.
- **Authentication:**  GitHub sign-in (NextAuth) for user accounts and order association.

## Client environment variables

Set these for the web app (e.g., in `apps/web/.env` or your hosting provider):

- `DATABASE_URL` — shared database connection used by `packages/db`.
- `STRIPE_API_KEY` — Secret Stripe API key for creating Checkout sessions.
- `NEXTAUTH_SECRET` — NextAuth secret for session signing.
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — GitHub OAuth app credentials

## Run & build (web)

From the repo root:

```bash
pnpm install
pnpm dev
```

Run or build the web app only:

```bash
pnpm --filter @repo/web dev     # run web locally on :3001
pnpm --filter @repo/web build   # build web for production]
```

## Run tests

`turbo test-1`

## Deployment notes (web)

- Stripe: set `STRIPE_API_KEY` in production
- Database & migrations: run Prisma migrations in CI before deploying; ensure `DATABASE_URL` points to production DB.
- NextAuth / OAuth: configure GitHub OAuth app with the web app's production callback URL, and set `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` plus `NEXTAUTH_SECRET`.