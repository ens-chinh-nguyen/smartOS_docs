# PDF Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render PDF links in MDX documents as an iframe preview with a download bar below.

**Architecture:** Update `createCustomLink` in `components/mdx.tsx` to detect `.pdf` links, rendering a `<figure>` card with an `<iframe>` preview and a styled download footer.

**Tech Stack:** Next.js 16 (App Router), React, Lucide React icons (`FileText`, `Download`), Fumadocs UI CSS theme variables (`fd-border`, `fd-card`, `fd-muted`, `fd-primary`, `fd-foreground`).

## Global Constraints

- Modify `/Volumes/Cinny/Work/Simon_proj/fumadocs_start/components/mdx.tsx`
- Ensure type checking passes via `pnpm types:check`

---

### Task 1: Update `components/mdx.tsx` to support PDF iframe preview

**Files:**
- Modify: `components/mdx.tsx`

**Interfaces:**
- Consumes: `React.AnchorHTMLAttributes<HTMLAnchorElement>`
- Produces: Enhanced `CustomLink` component handling PDF URLs with iframe preview and download bar.

- [ ] **Step 1: Update `components/mdx.tsx` with PDF detection and rendering logic**

Update `components/mdx.tsx` to add `isPdfFile` helper and handle `isPdfFile(href)` in `CustomLink`.

- [ ] **Step 2: Run type check**

Run: `pnpm types:check`
Expected: Success with 0 errors.

- [ ] **Step 3: Commit changes**

```bash
git add components/mdx.tsx docs/superpowers/specs/2026-08-06-pdf-preview-design.md docs/superpowers/plans/2026-08-06-pdf-preview-plan.md
git commit -m "feat: render PDF links as iframe preview with download button in MDX"
```
