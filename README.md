# RealHub Frontend

Nền tảng Bất động sản đa tenant — Frontend Next.js 16 + React 19 + Tailwind CSS 4.

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Components | Radix UI primitives + custom components |
| State Management | Zustand (global) + TanStack Query v5 (server state) |
| Forms | React Hook Form + Zod |
| Table/DataGrid | TanStack Table v8 |
| Charts | Recharts |
| Icons | Phosphor Icons |
| File Upload | react-dropzone |
| Date | date-fns |
| Maps | Leaflet + react-leaflet |
| Animation | Framer Motion (motion/react) + tw-animate-css |

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy env
cp .env.example .env.local

# Start dev server
pnpm dev
# → http://localhost:3000
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_TENANT_CODE=DEMO
NEXT_PUBLIC_SWAGGER_URL=http://localhost:3001/api/docs
```

## Seed Accounts (Dev)

| Email | Password | Role |
|-------|----------|------|
| `admin@demo.realhub.local` | `Admin@123456` | SUPER_ADMIN |
| `sales@demo.realhub.local` | `Sales@123456` | SALES |

**Tenant code (dev):** `DEMO`

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (login, register)
│   ├── (dashboard)/        # Protected pages
│   │   ├── layout.tsx      # Dashboard layout (sidebar + topbar)
│   │   ├── page.tsx        # Dashboard home
│   │   ├── properties/     # Bất động sản
│   │   ├── customers/      # Khách hàng
│   │   ├── leads/          # Leads (Kanban)
│   │   ├── appointments/   # Lịch hẹn
│   │   ├── deals/          # Giao dịch
│   │   ├── commission/     # Hoa hồng
│   │   └── settings/       # Cài đặt
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles + CSS variables
├── components/
│   ├── ui/                 # Base primitives (button, card, input, ...)
│   ├── layout/             # Layout components (sidebar, topbar, footer)
│   └── shared/             # Shared business components
├── lib/
│   ├── api/                # API client, interceptors, endpoints
│   ├── stores/             # Zustand stores (auth, ui, tenant)
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utilities (cn, formatters, ...)
│   └── types/              # TypeScript types & enums
├── providers/              # Context providers
└── config/                 # App config (nav items, env, constants)
```

## API Integration

### Base URL & Prefix

```
Base URL:     http://localhost:3001/api
Swagger:      http://localhost:3001/api/docs
```

### Authentication

```
Authorization: Bearer <access_token>
x-tenant-code: DEMO
```

- Access token TTL: 15 phút
- Refresh token TTL: 7 ngày
- Auto-refresh via axios interceptor on 401

### Key API Routes

| Module | Endpoint | Permission |
|--------|----------|------------|
| Auth | `POST /api/auth/login` | - |
| Users | `GET /api/users/me` | `users:read` |
| Properties | `GET /api/properties` | `properties:read` |
| Customers | `GET /api/customers` | `customers:read` |
| Leads | `GET /api/leads` | `leads:read` |
| Appointments | `GET /api/appointments` | `appointments:read` |
| Deals | `GET /api/deals` | `deals:read` |
| Commission | `GET /api/commission/plans` | `commission:read` |
| Files | `POST /api/files/upload` | `files:write` |

### Pagination

Tất cả endpoint list dùng `limit` + `offset` (không phải page/pageSize).

### Soft Delete

DELETE endpoint chỉ set `status: 'INACTIVE'`. UI ẩn item đã xóa.

### Data Masking

BE tự động mask dữ liệu nhạy cảm (phone, price, address). FE chỉ hiển thị đúng dữ liệu nhận được, không cần unmask.

## Design System

Xem chi tiết tại [`design.md`](./design.md) — nguồn sự thật duy nhất cho phong cách UI/UX toàn app.

### Tóm tắt

- **Archetype**: Editorial Luxury + Soft Structuralism + Premium Minimalism
- **Color**: Warm monochrome (cream/espresso) + muted pastel accents
- **Typography**: Geist (sans) + Newsreader (serif heading) + Geist Mono (data)
- **Layout**: Asymmetric bento grid, editorial split, generous whitespace
- **Motion**: Spring physics, cubic-bezier, scroll reveal, subtle hover
- **Icons**: Phosphor Icons (regular/duotone weight)

## Scripts

```bash
pnpm dev      # Dev server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # ESLint
```

## Key Notes

1. **Tenant header bắt buộc** — Mọi API request (trừ public routes) phải gửi `x-tenant-code`
2. **Token expiry** — Access token hết hạn sau 15 phút, cần auto-refresh interceptor
3. **Dynamic fields** — Form tạo/sửa property render động từ API, không hardcode
4. **Workflow states** — Deal/Lead status fetch từ `/api/workflows`, không hardcode
5. **Permission-based UI** — Ẩn/hiện button, menu dựa trên permission từ `GET /api/users/me`
6. **Pagination** — Dùng `limit` + `offset`, không có total count — dùng infinite scroll
