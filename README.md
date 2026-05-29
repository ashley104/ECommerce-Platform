# Checkout webs at:
- Storefront: https://e-commerce-platform-storefront.vercel.app
- Admin: https://e-commerce-platform-admin.vercel.app

# ECommerce Platform

## Project Overview

This repository is a monorepo for a full-stack Next.js platform with a shared database layer, separate admin and client apps, and common packages for UI, utilities, configuration, and environment handling.

The project is set up for local development with `pnpm` and Turborepo, and it includes a dedicated API reference in [docs/api.md](docs/api.md).

## Monorepo Structure

- `apps/admin` - Admin app for managing content and internal workflows
- `apps/web` - Client-facing storefront app
- `packages/db` - Shared Prisma data layer
- `packages/ui` - Shared UI components
- `packages/utils` - Shared utility helpers
- `packages/eslint-config`, `packages/tailwind-config`, `packages/typescript-config` - Shared workspace configuration packages
- `tests/playwright` - End-to-end test workspace
- `tests/storybook` - Storybook workspace for isolated UI development

## Tech Stack

- Next.js
- React
- TypeScript
- Turborepo
- pnpm
- Prisma
- NextAuth
- Tailwind CSS
- Stripe
- Vitest
- Playwright

## Global Setup

1. Install dependencies from the repository root with `pnpm install`.
2. Copy the required `.env.example` files where they exist and create matching `.env` files.
3. Start both apps and shared workspaces with `pnpm dev`.
4. If you plan to run the E2E tests locally, install the browser binaries with `pnpx playwright install` in the Playwright test workspace.

## Apps Overview

### Admin

The admin app runs on `http://localhost:3002` in development. It uses GitHub sign-in through NextAuth and is responsible for admin-only management flows.

### Client

The client app runs on `http://localhost:3001` in development. It is the storefront-facing app for browsing data, signing in, and checkout flows.

## Shared Environment Requirements

### Shared database

- `DATABASE_URL` is required by `packages/db`.

### Admin app

- `PASSWORD`
- `JWT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `NEXTAUTH_URL=http://localhost:3002`
- `NEXTAUTH_SECRET`

### Client app

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `NEXTAUTH_URL=http://localhost:3001`
- `NEXTAUTH_SECRET`
- `STRIPE_API_KEY`

## Deployment Overview

Deploy the admin and client apps separately, then point both at the same production database and shared auth provider settings.

- Provision a hosted database and set `DATABASE_URL` in the deployment environment.
- Configure GitHub OAuth for both apps with their production callback URLs.
- Set the correct `NEXTAUTH_URL` and `NEXTAUTH_SECRET` values for each app.
- Set `STRIPE_API_KEY` for the client app if checkout is enabled in production.
- Run Prisma migrations before or during release so the database schema matches the deployed code.
- Keep the admin and client deployments on their own hostnames or routes so their auth callbacks stay isolated.