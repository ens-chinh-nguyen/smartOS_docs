# HTTP Basic Authentication Design Document

## 1. Overview
Implement simple HTTP Basic Authentication directly in `middleware.ts`. When a user visits any page or API route other than the homepage (`/`) and static assets, the browser will automatically trigger its native authentication dialog prompt for username and password.

## 2. Requirements & Scope
### Public Routes (No Auth Required)
- `/` (Home page)
- Static assets (`/_next/*`, `/favicon.ico`, `/icon.svg`)

### Protected Routes (Auth Required)
- `/docs` and all sub-routes (`/docs/*`)
- `/llms.txt`, `/llms-full.txt`, `/llms.mdx/*`
- `/api/search`, `/api/mcp`
- Any other route outside of public assets.

## 3. Credentials & Environment Variables
- `AUTH_USER`: Username (default: `admin` if env variable is not set).
- `AUTH_PASSWORD`: Password (default: `123456` if env variable is not set).

## 4. Middleware Implementation (`middleware.ts`)
1. Parse the request URL path.
2. If the request is for a public route (`/`, `/_next/*`, `/favicon.ico`, `/icon.svg`), proceed immediately.
3. Otherwise, check the `Authorization` header:
   - Extract the `Basic <base64>` credential string.
   - Decode standard Base64 string to `username:password`.
   - Validate against `AUTH_USER` and `AUTH_PASSWORD`.
4. If missing or invalid, return `401 Unauthorized` response with header:
   `WWW-Authenticate: Basic realm="Protected Area"`
5. If valid, proceed with existing content negotiation logic (Fumadocs markdown rewrite).

## 5. Verification Plan
1. Visit `/` -> Homepage renders cleanly without browser auth prompt.
2. Visit `/docs` -> Browser opens native authentication modal asking for User & Password.
3. Enter invalid credentials -> Re-prompts or denies access with 401.
4. Enter valid credentials (`admin` / `123456`) -> Successfully access documentation.
5. Check TypeScript types via `pnpm types:check`.
