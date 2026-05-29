# Admin App

Next.js admin interface for managing products, orders, and authenticated admin workflows.

## Local Development

- App URL: `http://localhost:3002`
- API reference: [docs/api.md](../../docs/api.md)
- Shared data layer: `packages/db`

## API Routes

- `/api/auth/[...nextauth]` for GitHub-based sign-in and sign-out
- `/api/products` for creating and updating products
- `/api/products/[id]` for deleting products
- `/api/purchase` for listing purchases in the dashboard

## Admin-specific features

- **Dashboard:** Product list, quick stats, and recent orders view.
- **Product management (CRUD):** Create, update and delete products from the dashboard. Server-side validations mirror `apps/admin/src/lib/validations/product.ts`.
- **Purchase management:** Browse and inspect orders placed by customers via the `/api/purchase` route.
- **On-demand revalidation:** Product changes call `revalidatePath()` to keep the storefront up to date after edits.
- **Authentication:** Admin sign-in is handled with NextAuth (GitHub provider)

## Admin environment variables

Place these in `apps/admin/.env` (or set them in your hosting provider):

- `DATABASE_URL` — shared database connection (in `packages/db/.env`).
- `GITHUB_CLIENT_ID` — GitHub OAuth app client ID.
- `GITHUB_CLIENT_SECRET` — GitHub OAuth app client secret.
- `NEXTAUTH_SECRET` — NextAuth secret used to sign/encrypt session tokens.

## Run & build (admin)

From the repo root (recommended):

```bash
pnpm install
pnpm dev           # starts all apps via turbo (uses next dev for admin on port 3002)
```

Run or build the admin app only:

```bash
pnpm --filter @repo/admin dev     # run admin locally on :3002
pnpm --filter @repo/admin build   # build admin for production
```

## Run tests

```turbo test-2```

## Deployment notes (admin)

- Database & migrations: run Prisma migrations from the repo or CI before starting the app. Ensure `DATABASE_URL` for production points to your managed database.
- NextAuth / GitHub OAuth: configure a GitHub OAuth app with the admin app's production callback URL and set `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` in the environment. Set `NEXTAUTH_SECRET`.
- Environment secrets: do not check secrets into source control. Use your hosting provider's secret store for `DATABASE_URL`, OAuth secrets and `NEXTAUTH_SECRET`.
- Ports: the admin app runs on port `3002` in development; in production the host will assign the port.
- CI / Build: use `pnpm --filter @repo/admin build` in CI and deploy the `.next` output per your hosting provider (Vercel, Netlify with Next support, Docker image, or other).
- Seeding: run seed scripts from `packages/db/seed.ts` as part of CI if needed.