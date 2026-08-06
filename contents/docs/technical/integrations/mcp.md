---
title: MCP Server
description: How to connect Claude Desktop, Claude Code, Cursor, and other MCP clients to this documentation site for AI-assisted docs search and retrieval.
---

# 🔌 MCP Server Integration

This documentation site exposes a **Model Context Protocol (MCP)** server so AI clients (Claude Desktop, Claude Code, Cursor, ...) can search and read the docs directly instead of relying on stale training data or manual copy-paste.

- **Endpoint**: `/api/mcp` (Streamable HTTP transport, stateless)
- **Implementation**: `app/api/mcp/route.ts` using [`mcp-handler`](https://www.npmjs.com/package/mcp-handler)
- **Auth**: none — public read-only access to published docs

<Callout type="warn" title="No authentication">
  The endpoint is unauthenticated and read-only. Do not put sensitive/internal-only content in `contents/docs` if this server is publicly reachable.
</Callout>

## Available Tools

| Tool | Description | Input |
|---|---|---|
| `search_docs` | Full-text search across all docs. Hits are grouped by page, each with its URL, section breadcrumbs, and matching excerpts | `query: string`, `limit?: number` (max pages, default 10, cap 25) |
| `list_docs` | List every page with title, description, and URL | _(none)_ |
| `get_doc` | Fetch the full Markdown content of one page | `url: string` (e.g. `/docs/auth`) |

All three are annotated `readOnlyHint` / `openWorldHint: false`, so MCP clients can auto-approve them instead of prompting on every lookup.

Typical flow for an AI client: `list_docs` or `search_docs` to find the relevant page → `get_doc` to pull the full content for context.

`get_doc` normalizes whatever you give it, so URLs copied straight out of search results work as-is. All of these resolve to the same page:

```text
/docs/auth
auth
/docs/auth/
/docs/auth.md
/docs/auth#-authentication--authorization-module
https://<your-domain>/docs/auth
```

## Connect a Client

### Claude Code

```bash
claude mcp add --transport http smartos-ql-docs https://<your-domain>/api/mcp
```

Against a local dev server:

```bash
claude mcp add --transport http smartos-ql-docs http://localhost:3000/api/mcp
```

### Claude Desktop

Edit `claude_desktop_config.json` — Claude Desktop needs the explicit `"type": "http"`:

```json title="claude_desktop_config.json"
{
  "mcpServers": {
    "smartos-ql-docs": {
      "type": "http",
      "url": "https://<your-domain>/api/mcp"
    }
  }
}
```

### Cursor and other remote-MCP clients

Clients with native remote-MCP support accept a bare `url`:

```json title="mcp.json"
{
  "mcpServers": {
    "smartos-ql-docs": {
      "url": "https://<your-domain>/api/mcp"
    }
  }
}
```

### stdio Bridge

Clients that only support stdio-based MCP servers can use [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) as a bridge:

```json title="mcp.json"
{
  "mcpServers": {
    "smartos-ql-docs": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://<your-domain>/api/mcp"]
    }
  }
}
```

## Verify the Connection

After adding the config, restart the client and check that `smartos-ql-docs` shows up in its MCP/tools list.

To sanity-check the server itself without a client — the server is stateless, so `tools/list` works without an `initialize` handshake:

```bash
curl -s -X POST https://<your-domain>/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

A healthy response lists `search_docs`, `list_docs`, and `get_doc`. Responses come back as SSE frames (`event: message` / `data: {...}`), not bare JSON.

For an interactive check, use the official inspector:

```bash
npx @modelcontextprotocol/inspector
```

## MCP vs `llms.txt` vs `.md` URLs

MCP is not the only way to feed these docs to a model. Pick by access pattern:

| Use | Endpoint | When |
|---|---|---|
| Interactive search + retrieval | `/api/mcp` | The agent should decide what to look up, mid-conversation |
| Index of every page | [`/llms.txt`](/llms.txt) | Give a model a table of contents to pick from |
| Whole corpus in one request | [`/llms-full.txt`](/llms-full.txt) | Bulk ingest, embedding, or fine-tuning |
| One page as raw Markdown | `/docs/<path>.md` | Direct fetch when the URL is already known |

The `.md` suffix is handled by `middleware.ts`, which also serves Markdown from the normal `/docs/*` URL to any client sending `Accept: text/markdown`.

## Troubleshooting

- **`406 Not Acceptable: Client must accept both application/json and text/event-stream`** — your request is missing the `Accept: application/json, text/event-stream` header. Streamable HTTP requires both.
- **Browser-based MCP client fails on preflight** — the route has no CORS handler, so cross-origin browser clients are not supported. Use a desktop/CLI client or the stdio bridge.
- **404** — check the path is exactly `/api/mcp` and that you are hitting a deployed domain, not a preview URL that has been torn down.
- **Server added but no tools appear** — fully restart the client. Most clients only read MCP config at startup.
- **`No page found for url: ...`** — the error text includes the URL after normalization; feed that back through `search_docs` or `list_docs` to get a valid one.

## Adding More Tools

Tools are registered in `app/api/mcp/route.ts` via `server.registerTool(name, config, handler)`. To add a new one (e.g. a tool scoped to a single doc section), register it there following the same pattern as `search_docs` / `get_doc` — no changes needed elsewhere, since it reuses the existing `source` and `searchAPI` already wired for the website's own search bar.

Reuse the local `readOnly` annotations constant and the `resolvePage` helper rather than re-parsing URLs by hand.

### Not implemented yet

The server currently exposes **tools only**. Known gaps, in rough priority order:

- **Resources** — one MCP resource per page would let users attach a doc directly in the client UI instead of relying on the model to search for it.
- **Batch fetch** — a `get_docs(urls: string[])` tool to avoid N round-trips on multi-page questions.
- **Hierarchical `list_docs`** — `source.getPageTree()` exposes the real `meta.json` nav structure; the current output is a flat list.
- **Prompts** — a reusable `answer_from_docs` template.
- **CORS `OPTIONS` handler** — required for browser-hosted MCP clients.
