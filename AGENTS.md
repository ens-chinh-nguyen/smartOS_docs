# AGENTS.md

Guidance for AI coding agents working in this repository.

## Commands

```bash
pnpm dev              # dev server (localhost:3000)
pnpm build             # next build
pnpm start             # run production build
pnpm types:check       # next typegen && tsc --noEmit
```

Cloudflare Workers deployment (via `@opennextjs/cloudflare`):

```bash
pnpm preview           # opennextjs-cloudflare build + preview (runs worker locally)
pnpm deploy            # opennextjs-cloudflare build + deploy
pnpm upload            # opennextjs-cloudflare build + upload (new version, no deploy)
pnpm cf-typegen        # regenerate cloudflare-env.d.ts after wrangler.jsonc changes
```

No test suite is configured in this repo.

## Architecture

Next.js 16 (App Router) docs site built on **Fumadocs**, using `@fumadocs/base-ui` (aliased as `fumadocs-ui` in package.json) rather than the default Fumadocs UI package. Deployed to Cloudflare Workers via OpenNext.

### Content pipeline

- Docs content lives in `contents/docs/**/*.md`, organized into `meta.json`-driven navigation trees (nested folders = nested nav sections, e.g. `contents/docs/technical/integrations`).
- `source.config.ts` configures the MDX compiler (`fumadocs-mdx`): mermaid diagrams via `remarkMdxMermaid`, raw HTML passthrough via `rehype-raw`.
- `lib/source.ts` builds the `source` loader (`fumadocs-core/source` + `defineDocs`) that every route reads pages/page-tree from. It also exports:
  - `getPageImageUrl` — OG image URL for a page (consumed by `app/og/docs/[...slug]/route.tsx`)
  - `getPageMarkdownUrl` — raw markdown URL for a page
  - `getLLMText` — renders a page's processed markdown as `# Title (url)\n\n<content>`, used by the MCP server, `llms.txt`, `llms-full.txt`, and the `llms.mdx/docs/**` routes.
- `lib/shared.ts` centralizes cross-cutting constants: `appName`, `docsRoute` (`/docs`), `docsImageRoute` (`/og/docs`), `docsContentRoute` (`/llms.mdx/docs`), and `gitConfig` (GitHub org/repo used for the header link — currently a placeholder, update when wiring the real repo).

### Markdown content negotiation

`middleware.ts` (Next's "proxy" file convention, **kept as `middleware.ts` not renamed to `proxy.ts`** — see Cloudflare note below) rewrites requests using `fumadocs-core/negotiation`:
- `/docs/**.md` suffix → rewrites to `/llms.mdx/docs/**/content.md`
- Requests with an `Accept: text/markdown`-preferring header (`isMarkdownPreferred`) get transparently rewritten to the markdown route with `Vary: Accept`

This lets the same `/docs/*` URL serve HTML to browsers and raw markdown to LLM/agent clients without duplicate routes.

### Layouts

- `layouts/docs/**` and `layouts/notebook/**` are locally-ejected copies of Fumadocs UI layout components (via the Fumadocs CLI, see `cli.json`), broken into a `slots/` pattern (header, sidebar, container, toc, footer, breadcrumb) plus a shared `client.tsx`/`index.tsx`. `app/docs/layout.tsx` currently uses the **notebook** layout with two tabs (`Docs` / `Technical`).
- `layouts/shared/**` holds cross-layout slot components (search trigger, theme switch, language select).
- `lib/layout.shared.tsx` (`baseOptions()`) is the single place that defines the top nav title/links/GitHub URL, shared by both the docs layout and the home layout.
- Because these layouts are ejected/local (not imported from the package), changes to Fumadocs UI upstream won't automatically propagate — check `layouts/` when upgrading `@fumadocs/base-ui`.

### Routes of note (`app/`)

| Route | Purpose |
|---|---|
| `app/(home)` | Landing page, own layout |
| `app/docs/[[...slug]]` | Doc page renderer, reads from `source` |
| `app/api/search/route.ts` | Fumadocs search endpoint (`createFromSource`) |
| `app/api/mcp/route.ts` | MCP server (`mcp-handler`) exposing `search_docs`, `list_docs`, `get_doc` tools over the same `source` — lets AI clients query docs directly |
| `app/llms.txt`, `app/llms-full.txt` | Fumadocs `llms()` index / full-text dump for LLM consumption |
| `app/llms.mdx/docs/[[...slug]]/route.ts` | Per-page raw markdown, statically generated for every doc page |
| `app/og/docs/[...slug]/route.tsx` | Per-page OG image generation |

### Cloudflare / OpenNext

- `wrangler.jsonc` + `open-next.config.ts` configure the Workers build (`.open-next/worker.js`, static assets binding, `nodejs_compat` + `global_fetch_strictly_public` compat flags, `WORKER_SELF_REFERENCE` service binding). No KV/R2/D1 bindings are configured — add them to both files together if a feature needs one.
- **`middleware.ts` naming is intentional, not stale**: Next 16 renamed `middleware.ts` → `proxy.ts` and the new `proxy` convention only runs on the Node.js runtime (no edge option). `@opennextjs/cloudflare` (as of 1.20.x) doesn't support Node-runtime middleware and fails the build if it sees one. Keeping the legacy `middleware.ts` name makes Next compile it as Edge middleware, which OpenNext/Workers can run. Revert to `proxy.ts` once OpenNext ships Node-middleware support (tracked upstream: opennextjs/opennextjs-cloudflare#962).
- `next.config.mjs` calls `initOpenNextCloudflareForDev()` so `pnpm dev` can access Cloudflare bindings locally.
- After changing `wrangler.jsonc` bindings, rerun `pnpm cf-typegen` to refresh `cloudflare-env.d.ts`.

### Path aliases

`@/*` maps to the repo root (see `tsconfig.json`), e.g. `@/lib/source`, `@/lib/shared`.
