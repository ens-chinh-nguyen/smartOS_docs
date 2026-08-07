# HTTP Basic Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Protect all non-homepage routes (e.g. `/docs`, `/api/search`, `/api/mcp`, `/llms.txt`, etc.) with browser HTTP Basic Authentication via Next.js 16 Edge Middleware.

**Architecture:** Extend existing `middleware.ts` to inspect the `Authorization` header on non-public routes before delegating to existing Fumadocs MDX content negotiation rewrites.

**Tech Stack:** Next.js 16 (App Router / Edge Middleware), TypeScript, `@opennextjs/cloudflare`.

## Global Constraints

- Preserve legacy `middleware.ts` filename convention (required for `@opennextjs/cloudflare` Edge Middleware compilation).
- Default credentials when environment variables are unset: Username = `admin`, Password = `123456`.
- Public routes bypass auth: `/`, `/_next/*`, `/favicon.ico`, `/icon.svg`.

---

### Task 1: Update `middleware.ts` to enforce HTTP Basic Authentication

**Files:**
- Modify: `middleware.ts`

**Interfaces:**
- Consumes: `NextRequest`, `NextResponse` from `next/server`, `process.env.AUTH_USER`, `process.env.AUTH_PASSWORD`.
- Produces: `401 Unauthorized` response with `WWW-Authenticate: Basic realm="Protected Area"` header when unauthorized; or continues request pipeline when authorized.

- [ ] **Step 1: Update `middleware.ts` with HTTP Basic Auth logic**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute } from '@/lib/shared';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

function isPublicRoute(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.svg'
  );
}

function checkBasicAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const base64Credentials = authHeader.split(' ')[1];
  if (!base64Credentials) return false;

  try {
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(':');

    const expectedUser = process.env.AUTH_USER || 'admin';
    const expectedPassword = process.env.AUTH_PASSWORD || '123456';

    return username === expectedUser && password === expectedPassword;
  } catch {
    return false;
  }
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isPublicRoute(pathname)) {
    if (!checkBasicAuth(request)) {
      return new NextResponse('Authentication Required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Protected Area"',
        },
      });
    }
  }

  const result = rewriteSuffix(pathname);
  if (result) {
    return NextResponse.rewrite(new URL(result, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(pathname);

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl), {
        headers: { Vary: 'Accept' },
      });
    }
  }

  return NextResponse.next();
}
```

- [ ] **Step 2: Check TypeScript types**

Run: `pnpm types:check`
Expected: Clean output with 0 errors.

- [ ] **Step 3: Commit changes**

```bash
git add middleware.ts
git commit -m "feat: add HTTP Basic Auth to middleware for non-homepage routes"
```

---

### Task 2: Runtime Verification

**Files:**
- Verify: `middleware.ts`

- [ ] **Step 1: Run type check again to confirm no regressions**

Run: `pnpm types:check`
Expected: 0 errors.

- [ ] **Step 2: Commit plan document**

```bash
git add docs/superpowers/plans/2026-08-07-http-basic-auth.md
git commit -m "docs: add HTTP Basic Auth implementation plan"
```
