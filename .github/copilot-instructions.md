# RealHub — GitHub Copilot Instructions

## Project Overview
RealHub là nền tảng hệ sinh thái Bất động sản đa tenant (multi-tenant). Phase 1 = MVP Core, KHÔNG payment.

## MUST READ before writing any code
1. `docs/project-context.md` — Full business context (roles, workflows, selling modes, commission engine, lead protection, visibility matrix, API routes). This is the single source of truth.
2. `design.md` — Design system (Editorial Luxury + Soft Structuralism + Premium Minimalism).
3. `README.md` — Tech stack, API integration, project structure.

## Key Rules
1. **Không hardcode** dynamic fields, workflow states, commission rules, lead statuses — fetch từ API.
2. **Tenant header bắt buộc** (`x-tenant-code`) trên mọi API request trừ public routes.
3. **Permission-based UI** — ẩn/hiện button/menu theo `permissions` array từ `GET /api/users/me`.
4. **Pagination** dùng `limit` + `offset`, không có total count → infinite scroll.
5. **BE tự mask dữ liệu** (phone, price, address) — FE chỉ hiển thị, KHÔNG unmask.
6. **File upload** — `multipart/form-data`, field `file`/`files`, max 50MB, 10 files.
7. **Soft delete** — DELETE chỉ set `status: INACTIVE`.
8. **Auto-refresh token** trên 401 via interceptor.
9. **Next.js 16** has breaking changes — check `node_modules/next/dist/docs/` before writing Next.js code.

## FE Tech Stack
Next.js 16 App Router + React 19 + Tailwind CSS 4 + Zustand + TanStack Query v5 + React Hook Form + Zod + Lucide React + Recharts + Base UI + react-dropzone + date-fns + Leaflet + Framer Motion

## Dev Environment
- API: `http://localhost:3001/api`
- Swagger: `http://localhost:3001/api/docs`
- Tenant code: `DEMO`
- Seed: `admin@demo.realhub.local` / `Admin@123456` (SUPER_ADMIN), `sales@demo.realhub.local` / `Sales@123456` (SALES)
