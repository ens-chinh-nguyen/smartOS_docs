# SmartOS Docs Homepage Design Document

**Date:** 2026-08-05  
**Topic:** SmartOS Documentation Homepage Clone & Integration  
**Target Project:** `fumadocs_start` (SmartOS x QL Docs)  
**Modules Covered:** Access Management Module & Maintenance Management Module  

---

## 1. Overview & Objectives

The goal is to create a clean, modern, and branded home page (`app/(home)/page.tsx`) for the SmartOS internal documentation site. 
The design draws style inspiration and branding elements from [smartos.space](https://smartos.space/) (SmartOS primary yellow/amber accents, modern typography, sleek card layouts) while staying clean and lightweight for internal engineering and product teams.

Key Objectives:
1. Provide a branded entry point for SmartOS technical documentation.
2. Clearly partition and highlight the two core independent modules:
   - **Access Management Module** (Quản lý truy cập & Kiểm soát ra vào).
   - **Maintenance Management Module** (Quản lý bảo trì & Xử lý sự cố).
3. Offer quick navigation links to developer guidelines, architecture overviews, and API documentation.

---

## 2. Branding & Design Tokens

- **Brand Color Accents:** 
  - SmartOS Primary Amber: `#FFB610` / `#FDCB36` / Tailwind `amber-500` & `yellow-500`
  - Text & Dark Accents: Slate/Neutral dark (`#1F2125`, `#344054`) with dark mode support built into Fumadocs UI.
- **Typography:** Modern clean sans-serif (Inter / Plus Jakarta Sans).
- **Component Styling:** Card components with subtle borders (`border-gray-200` / `dark:border-neutral-800`), gentle hover transitions, and badge indicators.

---

## 3. Page Structure (`app/(home)/page.tsx`)

### Section 1: Hero Section
- **Badge:** `SmartOS Internal Documentation` (Styled badge with amber ring/bg accent).
- **Headline:** `Tài liệu Kỹ thuật SmartOS`
- **Subtitle:** Hệ thống tài liệu phát triển & vận hành dành riêng cho Module Access Management và Module Maintenance Management.
- **Call-to-Action Buttons:**
  - Primary CTA: `Vào trang Tài liệu →` (Links to `/docs`)
  - Secondary CTA: `SmartOS.space ↗` (External link to main website)

### Section 2: Core Modules Grid (2 Cards)
- **Card 1: Access Management Module (Quản lý truy cập)**
  - **Icon:** Key / Lock Icon (`🔑`)
  - **Title:** Access Management Module
  - **Description:** Giải pháp kiểm soát ra vào tòa nhà, phân quyền ra vào, tích hợp thiết bị IoT (Khoá từ, QR Code, Vân tay, Thẻ từ) và quản lý log truy cập.
  - **Key Highlights:**
    - Cấu hình & Tích hợp thiết bị ra vào
    - Phân quyền người dùng & quản lý thẻ
    - API Unlocking & Real-time Event Logs
  - **Link:** Direct link to `/docs/access-management` (or `/docs`)

- **Card 3: Maintenance Management Module (Quản lý bảo trì)**
  - **Icon:** Wrench / Tools Icon (`🛠️`)
  - **Title:** Maintenance Management Module
  - **Description:** Quy trình tiếp nhận & xử lý sự cố kỹ thuật, lập lịch bảo dưỡng thiết bị định kỳ, quản lý ticket bảo trì và phân công kỹ thuật viên.
  - **Key Highlights:**
    - Quy trình xử lý Ticket sự cố
    - Lập lịch bảo dưỡng thiết bị định kỳ
    - Phân công KTV & Báo cáo chất lượng
  - **Link:** Direct link to `/docs/maintenance-management` (or `/docs`)

### Section 3: Quick Resources & Developer Links
Grid of 3 compact resource links for internal team members:
1. **Sơ đồ Kiến trúc Systems:** Tổng quan kiến trúc kết nối giữa các module độc lập.
2. **API & Authentication Guidelines:** Quy chuẩn RESTful API, Token authentication & Webhook.
3. **Quy trình Đóng góp Docs:** Hướng dẫn tạo bài viết MDX & cập nhật tài liệu kỹ thuật.

---

## 4. Technical Specifications

- **File modified:** `app/(home)/page.tsx`
- **Shared Options updated if needed:** `lib/layout.shared.tsx` / `lib/shared.ts` (Title update to `SmartOS Docs`).
- **Dependencies:** Standard Next.js & Fumadocs UI components (`fumadocs-ui`), Lucide React icons (`lucide-react`).

---

## 5. Self-Review & Verification

- **Placeholder Scan:** No remaining TODOs or ambiguous requirements.
- **Scope Check:** Fully focused on building the compact branded Home Page for internal docs.
- **Consistency:** Aligns with SmartOS branding from `smartos.space` and existing Fumadocs structure.
