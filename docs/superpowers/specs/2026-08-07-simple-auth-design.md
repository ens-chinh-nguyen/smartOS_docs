# Simple Authentication Design Document

## 1. Overview
Add simple authentication protection to all routes except the Homepage (`/`), login routes, and static assets. The system uses a fixed password with cookie sessions in Next.js 16 Edge Middleware and is modularly structured to allow adding Lark OAuth in the future seamlessly.

## 2. Requirements & Scope
### Public Routes (No Auth Required)
- `/` (Home page)
- `/login` (Login UI page)
- `/api/auth/login` (Authentication API endpoint)
- `/api/auth/logout` (Logout API endpoint)
- Static assets (`/_next/*`, `/*.svg`, `/*.png`, `/*.ico`, `/*.jpg`, etc.)

### Protected Routes (Auth Required)
- `/docs` and all sub-routes (`/docs/*`)
- `/llms.txt`, `/llms-full.txt`, `/llms.mdx/*`
- `/api/search`
- `/api/mcp`
- Any non-public routes.

## 3. Technical Design

### A. Authentication Module (`lib/auth.ts`)
- **Crypto & Signing**: Uses Web Crypto API (HMAC SHA-256) compatible with Cloudflare Workers / Edge Runtime.
- **Session Token**: Signed payload containing timestamp and session ID.
- **Environment Variables**:
  - `AUTH_PASSWORD`: Fixed password for login (default fallback for development: `123456`).
  - `AUTH_SECRET`: Secret key for signing cookies (default fallback for dev).

### B. Middleware Integration (`middleware.ts`)
- Intercepts incoming requests.
- Checks if the requested route is public.
- Reads `auth_session` HTTP-only cookie.
- If unauthenticated:
  - HTML pages redirect to `/login?from=<pathname>`.
  - API / MCP / LLMs requests return `401 Unauthorized` or redirect to `/login`.
- If authenticated:
  - Continues processing (including existing Fumadocs MDX content negotiation rewrites).

### C. Login Interface & API (`app/login/page.tsx`, `app/api/auth/login/route.ts`)
- **UI (`app/login/page.tsx`)**:
  - Premium glassmorphism card matching site theme.
  - Password input field with toggle visibility and submit button.
  - Placeholder / disabled button for **"Đăng nhập bằng Lark (OAuth)"** to support future expansion.
  - Error feedback on invalid password.
- **API (`app/api/auth/login/route.ts`)**:
  - `POST` endpoint processing `{ password }`.
  - Verifies password against `AUTH_PASSWORD`.
  - Sets HTTP-only, Secure, SameSite=Lax cookie `auth_session`.

### D. Logout Endpoint (`app/api/auth/logout/route.ts`)
- Clears the `auth_session` cookie and redirects to `/login` or `/`.

## 4. Future Lark OAuth Integration Plan
When enabling Lark OAuth:
1. Add Lark OAuth credentials to environment variables (`LARK_APP_ID`, `LARK_APP_SECRET`).
2. Add `/api/auth/lark` to initiate OAuth flow and `/api/auth/lark/callback` to handle callback.
3. On successful Lark authentication, issue the standard `auth_session` cookie via `lib/auth.ts`.

## 5. Verification Plan
1. Test accessing `/` -> Should load without login.
2. Test accessing `/docs` while logged out -> Should redirect to `/login?from=%2Fdocs`.
3. Test logging in with wrong password -> Show error.
4. Test logging in with correct password (`123456` or `AUTH_PASSWORD`) -> Set cookie and redirect to `/docs`.
5. Test accessing `/docs` while logged in -> Should render documentation page properly.
6. Test logout -> Should clear cookie and redirect.
7. Run `pnpm types:check` and `pnpm dev` to ensure no build or runtime errors.
