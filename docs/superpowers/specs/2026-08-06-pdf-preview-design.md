# Design Document: PDF Preview & Download for MDX Links

## Overview
Update `components/mdx.tsx` to detect PDF links (`.pdf` extension) and render a custom PDF preview component instead of a standard inline link.

## Target Component
- File: `components/mdx.tsx`
- Functions: `isFilePdf(url)`, `createCustomLink`

## UI Layout (Option 1)
1. **Container**: `figure` / `div` with `my-6 w-full rounded-xl border border-fd-border bg-fd-card shadow-sm overflow-hidden`.
2. **Iframe Preview**: `<iframe src={href} className="w-full h-[550px] md:h-[650px] border-0" title={title} />`
3. **Footer Toolbar**: `div` with `px-4 py-2.5 bg-fd-muted/30 border-t border-fd-border flex items-center justify-between gap-3 text-xs`
   - Left side: `FileText` icon, title / filename, `PDF` badge (`bg-fd-primary/10 text-fd-primary font-bold px-1.5 py-0.5 rounded text-[10px]`).
   - Right side: Download button `<a href={href} download className="..."> <Download className="..." /> Tải về </a>`.

## Edge Cases
- Non-PDF file attachments (e.g. `.zip`, `.docx`): continue to render as inline file attachment tags.
- Non-attachment links: render standard `<a>` component.
