# SmartOS Docs Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a clean, branded, and modern homepage for the SmartOS internal documentation site, highlighting the Access Management and Maintenance Management modules with SmartOS styling inspired by `smartos.space`.

**Architecture:** Update `app/(home)/page.tsx` with a clean Next.js React layout including Hero section, 2 Core Module Cards (Access & Maintenance Management), and Quick Developer Links. Update site layout title in `lib/shared.ts` / `lib/layout.shared.tsx`.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS, Fumadocs UI (`fumadocs-ui`), Lucide React Icons (`lucide-react`).

## Global Constraints

- Must follow SmartOS color scheme (Amber `#FFB610` / `#FDCB36` accents, neutral dark slate `#1F2125` / `#344054`).
- Must adhere to Fumadocs UI layout structure.
- Clean and lightweight design suited for internal documentation users.

---

### Task 1: Update Site Navigation & Shared Metadata

**Files:**
- Modify: `lib/shared.ts`
- Modify: `lib/layout.shared.tsx`

**Interfaces:**
- Consumes: Existing Fumadocs base options.
- Produces: Updated app title `SmartOS Technical Docs` in header and layout options.

- [ ] **Step 1: Update `lib/shared.ts` app name**

Edit `lib/shared.ts`:
```typescript
export const appName = 'SmartOS Docs';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

export const gitConfig = {
  user: 'fuma-nama',
  repo: 'fumadocs',
  branch: 'main',
};
```

- [ ] **Step 2: Verify `lib/layout.shared.tsx` title rendering**

Verify `lib/layout.shared.tsx`:
```tsx
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    links: [
      {
        text: 'Docs',
        url: '/docs',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
```

- [ ] **Step 3: Run TypeScript check**

Run: `pnpm types:check`  
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit Task 1**

```bash
git add lib/shared.ts lib/layout.shared.tsx
git commit -m "chore: update app name to SmartOS Docs in shared layout"
```

---

### Task 2: Implement Branded SmartOS Docs Homepage Component

**Files:**
- Create/Modify: `app/(home)/page.tsx`

**Interfaces:**
- Consumes: Next.js `Link`, `lucide-react` icons (`Key`, `Wrench`, `BookOpen`, `ArrowRight`, `ExternalLink`, `ShieldCheck`, `FileCode`, `Layers`).
- Produces: Modern, responsive SmartOS Docs Landing Page component.

- [ ] **Step 1: Write `app/(home)/page.tsx`**

Replace `app/(home)/page.tsx` with:
```tsx
import Link from 'next/link';
import { 
  Key, 
  Wrench, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  Layers, 
  Cpu,
  Clock
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-6 md:py-24 max-w-6xl mx-auto text-center w-full">
        {/* Background Accent Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* SmartOS Internal Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-6">
          <ShieldCheck className="w-4 h-4" />
          <span>SmartOS Internal Documentation Portal</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Tài liệu Kỹ thuật <span className="text-amber-500 underline decoration-amber-500/40 decoration-wavy underline-offset-8">SmartOS</span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Cổng thông tin lưu trữ tài liệu kiến trúc, API và quy trình vận hành cho 2 module độc lập: <span className="font-semibold text-neutral-800 dark:text-neutral-200">Access Management</span> và <span className="font-semibold text-neutral-800 dark:text-neutral-200">Maintenance Management</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-amber-500 hover:bg-amber-600 text-neutral-950 shadow-md hover:shadow-amber-500/20 transition-all duration-200"
          >
            <span>Vào trang Tài liệu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://smartos.space"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-all duration-200"
          >
            <span>SmartOS.space</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Core Modules Grid */}
      <section className="py-12 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            Danh mục Module Sản phẩm
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Chọn module bạn muốn xem tài liệu hướng dẫn và API specs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: Access Management */}
          <div className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                Module Access Management
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-normal">New</span>
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6 leading-relaxed">
                Giải pháp kiểm soát ra vào tòa nhà, phân quyền ra vào, tích hợp thiết bị IoT (Khoá từ, QR Code, Thẻ từ, Vân tay) và quản lý log sự kiện ra vào thời gian thực.
              </p>

              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <Cpu className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Cấu hình & Tích hợp thiết bị IoT Ra vào</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Phân quyền truy cập theo tầng/phòng/tòa nhà</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>API Unlocking & Real-time Access Event Logs</span>
                </div>
              </div>
            </div>

            <Link
              href="/docs"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 group-hover:bg-amber-500 group-hover:text-neutral-950 text-sm font-semibold transition-colors duration-200"
            >
              <span>Xem tài liệu Access Management</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Maintenance Management */}
          <div className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                Module Maintenance Management
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-normal">New</span>
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6 leading-relaxed">
                Quy trình tiếp nhận & xử lý sự cố kỹ thuật, lập lịch bảo dưỡng thiết bị định kỳ, quản lý ticket bảo trì và phân công kỹ thuật viên hiệu quả.
              </p>

              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Quy trình xử lý Ticket & Tiếp nhận sự cố</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Lập lịch bảo dưỡng thiết bị định kỳ</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <Layers className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Phân công Kỹ thuật viên & Báo cáo tình trạng</span>
                </div>
              </div>
            </div>

            <Link
              href="/docs"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 group-hover:bg-amber-500 group-hover:text-neutral-950 text-sm font-semibold transition-colors duration-200"
            >
              <span>Xem tài liệu Maintenance</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Developer Resources Section */}
      <section className="py-12 px-6 max-w-6xl mx-auto w-full border-t border-neutral-200 dark:border-neutral-800 mt-8 mb-12">
        <h3 className="text-lg font-bold mb-6 text-neutral-900 dark:text-neutral-100">
          Liên kết & Tài nguyên kỹ thuật nội bộ
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            href="/docs"
            className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-amber-500/40 transition-colors group"
          >
            <div className="font-semibold text-sm mb-1 group-hover:text-amber-500 transition-colors">
              📘 Overview Architecture
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Tổng quan kiến trúc kết nối các module SmartOS
            </div>
          </Link>

          <Link
            href="/docs"
            className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-amber-500/40 transition-colors group"
          >
            <div className="font-semibold text-sm mb-1 group-hover:text-amber-500 transition-colors">
              ⚡ API & Auth Guidelines
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Chuẩn RESTful API, Authentication Tokens & Webhooks
            </div>
          </Link>

          <Link
            href="/docs"
            className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-amber-500/40 transition-colors group"
          >
            <div className="font-semibold text-sm mb-1 group-hover:text-amber-500 transition-colors">
              📝 Hướng dẫn đóng góp Docs
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Quy trình cập nhật tài liệu kỹ thuật bằng MDX
            </div>
          </Link>
        </div>
      </section>

      {/* Footer Branding Banner */}
      <footer className="py-6 px-6 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-center text-xs text-neutral-500 dark:text-neutral-400 mt-auto">
        <p>© {new Date().getFullYear()} SmartOS Solutions. Internal Documentation Portal.</p>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Check TypeScript build & lint**

Run: `pnpm types:check`  
Expected: PASS with 0 errors.

- [ ] **Step 3: Commit Task 2**

```bash
git add app/\(home\)/page.tsx
git commit -m "feat: implement branded SmartOS Docs home page for Access and Maintenance modules"
```

---

### Task 3: Build & Verification

**Files:** None modified directly.

- [ ] **Step 1: Test Next.js build**

Run: `pnpm build`  
Expected: Successful Next.js static build without errors.

- [ ] **Step 2: Commit any final build updates**

```bash
git add .
git commit -m "chore: verify build readiness"
```
