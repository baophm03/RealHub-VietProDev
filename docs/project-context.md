# RealHub — Project Context (BA Master Document)

> **File này là nguồn sự thật duy nhất (single source of truth) cho business context của dự án RealHub.**
> Mọi AI agent (Claude Code, Cursor, Windsurf, Copilot, Cline...) phải đọc file này trước khi làm việc.
> Thiết kế UI/UX chi tiết xem tại `design.md`. Tech stack & API integration xem tại `README.md`.

---

## 1. ĐỊNH VỊ SẢN PHẨM

RealHub là **nền tảng hệ sinh thái Bất động sản đa tenant (multi-tenant)**, kết nối 5 nhóm đối tượng: Khách hàng — Chủ BĐS (Owner) — Sales/CTV — Agency — Vận hành.

Không chỉ là website đăng tin BĐS. Không chỉ là CRM nội bộ. Không chỉ là agency management. RealHub là nền tảng kết nối toàn vòng đời BĐS: **sản phẩm → khách hàng → lịch hẹn → giao dịch → hoa hồng**.

### Phục vụ các loại hình doanh nghiệp
- **Agency**: Công ty môi giới BĐS
- **Developer**: Chủ đầu tư tạo dự án/quỹ căn
- **Distributor**: Phân phối BĐS

### Nguyên tắc scope Phase 1 (MVP Core)

| Quyết định | Chốt |
|------------|------|
| Không payment | Không SePay, không cọc online, không subscription, không payout hoa hồng online |
| Owner tự bán được | Owner có thể tự nhận lead, tự xử lý khách, không bắt buộc qua sales |
| Customer tự phục vụ | Tự đăng ký, tìm/lưu/so sánh, gửi nhu cầu, đặt lịch, yêu cầu giữ chỗ |
| Hoa hồng động | Commission Engine: plan/rule/split/snapshot/ledger. Phase 1 chỉ tính dự kiến/xác nhận |
| Cấu hình động | Policy không hard-code: assignment, lead protection, visibility, form fields, SEO, feature flags |
| Multi-tenant-ready | Thiết kế sẵn nhiều agency/sàn. MVP có thể chạy 1 tenant |

---

## 2. VAI TRÒ NGƯỜI DÙNG (9 roles Phase 1)

| Role | Nhóm | Mô tả | Phạm quyền |
|------|------|-------|------------|
| GUEST | Khách hàng | Khách vãng lai, xem website, gửi form cơ bản | Không đăng nhập |
| CUSTOMER | Khách hàng | Mua/thuê/đầu tư tự phục vụ | Tự tạo nhu cầu, lưu/so sánh, đặt lịch, theo dõi giao dịch |
| OWNER | Nguồn BĐS | Chủ BĐS/người đăng, tự bán/tự cho thuê | Quản lý sản phẩm + lead của mình |
| SALES | Kinh doanh | Nhân viên bán hàng/môi giới | Nhận phụ trách sản phẩm, tạo link/QR, nhận lead, tạo deal |
| COLLABORATOR (CTV) | Kinh doanh | Cộng tác viên/referral | Chỉ tạo referral link/lead giới thiệu. Không xem dữ liệu nhạy cảm, không xử lý giao dịch sâu |
| TEAM_LEADER | Quản lý | Trưởng nhóm sales | Quản lý sales, duyệt giữ chỗ mềm, xử lý lead trong team |
| AGENCY_ADMIN | Doanh nghiệp | Admin sàn/agency | Quản lý tenant, users, sản phẩm, lead, deal, chính sách hoa hồng |
| OPERATOR | Vận hành | Kiểm duyệt/CSKH/vận hành | Xác minh chủ nguồn, sản phẩm, dữ liệu public, xử lý tranh chấp, audit |
| SUPER_ADMIN | Nền tảng | Quản trị toàn hệ thống | Quản trị tenant, role, plan, cấu hình platform. Permission: `*` |

**Quy tắc**: 1 user có thể có nhiều vai trò nghiệp vụ + nhiều tenant membership. Không thiết kế 1 tài khoản chỉ 1 vai trò cố định.

### Permission Format
`module:action` (VD: `properties:read`, `properties:write`, `properties:delete`, `properties:*`, `*`)

---

## 3. THUẬT NGỮ NGHIỆP VỤ

| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| Nguồn BĐS | Nguồn tạo sản phẩm: owner, chủ đầu tư, agency, import, đề xuất từ sales |
| Sản phẩm BĐS | Một căn/nhà/đất/mặt bằng/văn phòng/kho xưởng có thể bán/thuê |
| Chế độ khai thác (selling_mode) | Cách sản phẩm được bán/cho thuê |
| Nhận phụ trách (assignment) | Sales nhận quyền khai thác 1 sản phẩm trong thời hạn + điều kiện nhất định |
| Lead Pool | Nơi chứa lead chưa gán sales/sản phẩm rõ ràng hoặc cần phân bổ |
| Bảo hộ lead | Khoảng thời gian hệ thống bảo vệ quyền xử lý lead của owner/sales/CTV/agency |
| Commission Engine | Bộ máy hoa hồng động theo rule/split/snapshot/ledger |
| Customer Portal | Cổng khách hàng tự tìm/lưu/gửi nhu cầu/đặt lịch/theo dõi |
| Owner Portal | Cổng chủ BĐS quản lý sản phẩm/lead/tự bán |
| Revalidation | Kiểm tra lại sản phẩm định kỳ theo policy |

---

## 4. CHẾ ĐỘ KHAI THÁC (Selling Modes)

| selling_mode | Ý nghĩa | Lead gán cho ai | Hoa hồng |
|--------------|---------|-----------------|----------|
| SELF_SELL | Người đăng tự bán/tự cho thuê | Owner/chủ nguồn | Thường không có hoa hồng sales; có thể có phí dịch vụ |
| SALES_DISTRIBUTION | Sales/agency khai thác | Sales theo assignment/team | Áp dụng Commission Engine |
| HYBRID | Owner + sales cùng khai thác | Theo nguồn lead: owner link, sales link, CTV link, public | Tính theo nguồn lead + rule phù hợp |
| INTERNAL_ONLY | Chỉ nội bộ tenant thấy | Theo người được phân quyền | Theo chính sách nội bộ |
| MARKETPLACE_PUBLIC | Public trên RealHub marketplace | Theo lead source/policy | Theo rule tenant/platform |

---

## 5. LUỒNG NGHIỆP VỤ CHÍNH

### 5.1 Customer Self-Service
1. Khách truy cập public website/landing page
2. Tìm kiếm theo khu vực, loại BĐS, giá, diện tích, dự án
3. Tự đăng ký (email/SĐT) + xác thực OTP nếu áp dụng
4. Lưu, so sánh hoặc gửi yêu cầu tư vấn cho sản phẩm cụ thể
5. Tạo nhu cầu chung: mua/thuê/đầu tư với ngân sách/khu vực/loại BĐS
6. Hệ thống tạo lead/customer_need → Lead CRM/Lead Pool
7. Kiểm tra trùng lead + áp dụng bảo hộ lead
8. Lead gán cho owner/sales/team/agency tùy nguồn + policy
9. Khách đặt lịch xem nhà/dự án hoặc yêu cầu giữ chỗ
10. Khách theo dõi lịch hẹn, yêu cầu, trạng thái trong Customer Portal

### 5.2 Owner Self-Sell
1. Owner tự đăng ký hoặc được mời vào tenant
2. Xác thực SĐT/email + hoàn thiện hồ sơ chủ nguồn
3. Gửi Sản phẩm BĐS hoặc BĐS ký gửi
4. Operator/Agency Admin xác minh chủ nguồn + sản phẩm
5. Owner chọn selling_mode: SELF_SELL, SALES_DISTRIBUTION, HYBRID
6. SELF_SELL → lead gán trực tiếp Owner Portal
7. SALES_DISTRIBUTION → sales nhận phụ trách theo assignment policy
8. HYBRID → owner + sales cùng khai thác, lead theo nguồn
9. Owner quản lý lead, lịch hẹn, deal cơ bản, trạng thái sản phẩm
10. Owner có thể chuyển từ tự bán sang yêu cầu sales hỗ trợ

### 5.3 Sales/CTV Khai Thác
1. Sales login Sales Portal
2. Xem sản phẩm đúng tenant, khu vực, dự án, visibility policy
3. Bấm nhận phụ trách sản phẩm
4. Hệ thống kiểm tra assignment policy: max sales, thời hạn, trạng thái, quyền khu vực
5. Tạo assignment, link/QR riêng → "Sản phẩm tôi phụ trách"
6. Sales share link/QR/caption/tài liệu public cho khách
7. Lead từ link/QR gán cho sales nếu chưa trùng hoặc chưa bị bảo hộ
8. CTV: chỉ tạo referral link/lead giới thiệu, không xử lý giao dịch sâu, không xem dữ liệu nhạy cảm

### 5.4 Lead CRM & Bảo Hộ

| Nguồn lead | Xử lý Phase 1 |
|------------|---------------|
| Link/QR sales | Gán cho sales theo assignment nếu còn hiệu lực |
| Link owner/self-sell | Gán cho owner/chủ nguồn |
| CTV referral | Ghi nhận CTV là nguồn giới thiệu, phân sales/team xử lý |
| Public website | Vào Lead Pool hoặc gán theo rule khu vực/sản phẩm/agency |
| Customer need chung | Tạo customer_need + lead pool, gợi ý sản phẩm phù hợp |
| Sales nhập tay | Check trùng theo SĐT + policy bảo hộ |

| Tình huống trùng lead | Hành vi hệ thống |
|----------------------|-------------------|
| Chưa có lead | Tạo lead mới |
| Cùng sales/owner | Merge activity vào lead hiện tại |
| Khác sales cùng sản phẩm | Tạo cảnh báo/tranh chấp lead |
| Khác nguồn nhưng hết bảo hộ | Cho phép phân lại theo policy |
| Lead không chăm sóc X ngày | Nhắc việc hoặc chuyển Lead Pool theo policy |

### 5.5 Deal Phase 1 (Không thanh toán)
1. Lead đủ điều kiện → chuyển thành deal
2. Sales/Owner/Agency cập nhật sản phẩm quan tâm, giá dự kiến, trạng thái tư vấn
3. Khách có thể yêu cầu giữ chỗ
4. Sales/Owner tạo yêu cầu giữ chỗ mềm (SOFT reservation)
5. Team Leader/Agency Admin/Operator duyệt giữ chỗ mềm tùy quyền
6. Sản phẩm chuyển trạng thái "Đang giữ chỗ" nếu được duyệt
7. Khách hủy/quá hạn → sản phẩm quay lại trạng thái phù hợp
8. Deal thành công → Agency Admin/Operator xác nhận giao dịch thủ công
9. Hệ thống cập nhật trạng thái sản phẩm + tạo hoa hồng xác nhận

**KHÔNG**: cọc online, payment webhook, hoàn tiền online, đối soát SePay

### 5.6 Revalidation Sản phẩm
1. Sản phẩm đến kỳ kiểm tra lại theo revalidation policy
2. Hệ thống nhắc owner, sales phụ trách hoặc operator
3. Người phụ trách xác nhận còn hiệu lực, cập nhật giá/trạng thái hoặc tạm ngưng
4. Quá hạn không phản hồi → sản phẩm chuyển "Hết hiệu lực" hoặc ẩn public
5. Lịch sử giá + trạng thái được ghi nhận để audit/report

---

## 6. COMMISSION ENGINE (Động, không hard-code)

### Lớp cấu hình

| Lớp | Ý nghĩa |
|-----|---------|
| Commission Plan | Chính sách/gói hoa hồng có hiệu lực theo tenant/dự án/khu vực/thời gian |
| Commission Rule | Điều kiện áp dụng + cách tính: %, fixed amount, 1 tháng thuê, 50% tháng thuê đầu |
| Commission Split | Chia tổng hoa hồng cho sales, CTV, team leader, agency, owner hoặc bên liên quan |
| Commission Calculation | Kết quả tính dự kiến/xác nhận cho từng deal |
| Commission Snapshot | Lưu rule áp dụng tại thời điểm tạo deal → deal cũ không bị thay đổi khi rule mới active |
| Commission Ledger | Lưu lịch sử tạo, điều chỉnh, xác nhận hoặc hủy hoa hồng |

### Trạng thái hoa hồng Phase 1

| Trạng thái | Ý nghĩa |
|------------|---------|
| DRAFT | Nháp, chưa áp dụng |
| ESTIMATED | Hoa hồng dự kiến khi tạo/cập nhật deal |
| PENDING_CONFIRMATION | Chờ xác nhận khi deal gần hoàn tất |
| CONFIRMED | Đã xác nhận số tiền, chưa chi trả online |
| ADJUSTED | Có điều chỉnh |
| CANCELLED | Deal hủy hoặc không đủ điều kiện |

- Plan statuses: DRAFT → PENDING_APPROVAL → ACTIVE → ARCHIVED
- Calculation types: PERCENT, FIXED
- Calculation bases: EXPECTED_VALUE, ACTUAL_VALUE, NET_VALUE
- Split types: PERCENT, FIXED

---

## 7. POLICY ENGINE (Cấu hình động)

| Policy | Phase 1 | Mục đích |
|--------|---------|----------|
| Workflow states/transitions | Basic | Không hard-code chuyển trạng thái lead/deal/product |
| Dynamic Property Form | Có | Field khác nhau theo căn hộ, đất, thuê, văn phòng, kho xưởng |
| Visibility & Data Masking | Có | Ẩn/hiện trường nhạy cảm theo role/quyền/phụ trách |
| Assignment Policy | Có | Max sales, thời hạn phụ trách, gia hạn, expire behavior |
| Lead Protection Policy | Có | Thời gian bảo hộ theo source/tenant/campaign/activity |
| Commission Engine | Có | Hoa hồng động theo rule/split/snapshot/ledger |
| Notification Rules | Basic | Cấu hình event nào gửi cho ai qua kênh nào |
| SEO Templates | Có | Title/description/canonical/noindex động theo loại trang |
| Tenant Feature Flags | Có | Bật/tắt customer portal, owner self-sell, CTV, marketplace... |
| Tenant Limits | Basic | Giới hạn user, sản phẩm, lead, storage, imports |

---

## 8. VISIBILITY & DATA MASKING

### Ma trận hiển thị theo role

| Loại dữ liệu | Khách | Sales chưa phụ trách | Sales phụ trách | Owner | Agency/Admin/Operator |
|--------------|-------|---------------------|-----------------|-------|----------------------|
| Giá hiển thị, diện tích, mô tả public | Xem | Xem | Xem | Xem | Xem/Sửa |
| Địa chỉ chính xác | Ẩn/rút gọn | Ẩn | Theo quyền | Xem sản phẩm của mình | Xem |
| SĐT chủ BĐS | Ẩn | Ẩn | Theo quyền/log | Xem | Xem/log |
| Giá net/biên thương lượng | Ẩn | Ẩn | Theo quyền | Theo cấu hình | Xem |
| File pháp lý/hợp đồng | Ẩn | Ẩn | Theo quyền/log | Theo cấu hình | Xem/log |
| Lead/khách hàng | Chỉ của mình | Không | Lead của mình | Lead sản phẩm của mình | Theo tenant/quyền |

### Mask types (BE tự mask, FE chỉ hiển thị)
- phone: `090****567`
- price: `********` → FE hiện "Liên hệ" hoặc "Không có quyền xem"
- address: `District 1, ****`
- partial_text: `Luxury****`

---

## 9. KIẾN TRÚC KỸ THUẬT

### Stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | Next.js 16 App Router + React 19 + Tailwind CSS 4 |
| Backend | NestJS 11 Modular API (TypeScript strict) |
| ORM | Prisma 6 + PostgreSQL 16 |
| Cache/Queue | Redis 7 + BullMQ 5 |
| File Storage | MinIO (S3-compatible, signed URL) |
| Auth | JWT (passport-jwt) + bcrypt, httpOnly Cookie |
| API Docs | Swagger/OpenAPI |
| Logging | Pino |
| Validation | class-validator + class-transformer |

### FE Tech Stack chi tiết

| Layer | Công nghệ |
|-------|-----------|
| State Management | Zustand (global) + TanStack Query v5 (server state) |
| Forms | React Hook Form + Zod |
| Table/DataGrid | TanStack Table v8 |
| Charts | Recharts |
| Icons | Phosphor Icons |
| File Upload | react-dropzone |
| Date | date-fns |
| Maps | Leaflet + react-leaflet |
| Animation | Framer Motion (motion/react) + tw-animate-css |
| Components | Radix UI primitives + custom components |

### Auth & Session
- httpOnly Cookie, KHÔNG lưu token trong localStorage/sessionStorage
- Access token chứa: user_id, session_id, active_tenant_id, role_in_tenant, token_version, exp
- Access token TTL: 15 phút. Refresh token TTL: 7 ngày
- Subdomain tenant resolver: abc.realhub.vn → resolve tenant từ tenant_domains
- Mỗi request authenticated phải kiểm tra active_tenant_id khớp tenant được resolve

### Repo Structure (Monorepo — BE)
```
realhub/
  apps/web/      # Next.js App Router
  apps/api/      # NestJS API
  apps/worker/   # BullMQ/NestJS worker
  packages/shared/  # types, enums, schemas, utils
  prisma/        # schema.prisma, migrations, seed
  docs/          # product, architecture, api
  docker/        # docker-compose.yml
```

### FE Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/           # i18n locale segment (next-intl)
│   │   ├── (auth)/         # Auth pages (login, register, forgot-password)
│   │   ├── (public)/       # Public marketing pages (home, about, listings, ...)
│   │   └── dashboard/      # Protected pages (sidebar + topbar layout)
│   │       ├── (dashboard)/# Dashboard home (stats cards, charts)
│   │       ├── properties/ # Bất động sản (list + new + [id] + [id]/edit)
│   │       ├── projects/   # Dự án (list + new + [id] + [id]/edit)
│   │       ├── customers/  # Khách hàng
│   │       ├── leads/      # Leads (Kanban)
│   │       ├── appointments/ # Lịch hẹn
│   │       ├── deals/      # Giao dịch
│   │       ├── commission/ # Hoa hồng (plans + reports)
│   │       ├── news/       # Tin tức (news + categories)
│   │       ├── files/      # Tài liệu
│   │       ├── profile/    # Hồ sơ người dùng
│   │       └── settings/   # Cài đặt (workflows, locations, dynamic-fields, visibility, lead-protection)
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles + CSS variables
├── components/
│   ├── ui/                 # Base primitives (button, card, input, ...)
│   ├── layout/             # Layout components (sidebar, topbar, footer)
│   ├── sections/           # Landing page sections (hero, featured, ...)
│   └── shared/             # Shared business components
├── lib/
│   ├── api/                # API client, interceptors, endpoints
│   ├── stores/             # Zustand stores (auth, ui, tenant)
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utilities (cn, formatters, ...)
│   ├── types/              # TypeScript types & enums
│   └── mock/               # Mock data
├── i18n/                   # next-intl config (routing, navigation, request)
├── providers/              # Context providers (react-query, ...)
└── config/                 # App config (nav items, env, constants)
```

### Backend Modules (12)
Auth, Tenant, Users/Roles, Locations/Zones, Properties/Projects, Assignments, Leads CRM, Appointments/Deals, Commission Engine, Files, Reports, Audit Logs

### Database (Prisma schema groups)
- tenants, tenant_domains, tenant_settings
- users, roles, permissions, user_roles, teams, team_members
- locations, zones, sales_territories
- property_sources, properties, projects, property_media, property_documents
- product_assignments, assignment_histories
- customers, customer_needs, leads, lead_activities, lead_disputes
- appointments, deals, deal_status_histories, reservations
- commission_plans, commission_rules, commission_splits, deal_commissions, commission_ledgers
- files, notifications, audit_logs, settings

---

## 10. API TÍCH HỢP (FE ↔ BE)

### Config
- Base URL: `http://localhost:3001/api`
- Swagger: `http://localhost:3001/api/docs`
- Tenant header: `x-tenant-code` (bắt buộc, trừ public routes)
- Auth header: `Authorization: Bearer <accessToken>`
- Pagination: `limit` + `offset` (KHÔNG page/pageSize, không trả total count)
- Soft delete: DELETE chỉ set status=INACTIVE
- Response success: trả trực tiếp data. Error: `{ statusCode, message, error }`

### Public Routes (không cần tenant + auth)
`POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/tenants`, `GET /api/tenants/domain/:domain`, `GET /api/health*`

### API Routes (15 nhóm)

1. **Auth**: register, login, refresh, logout
2. **Users**: `POST /api/users`, `GET /api/users/me` (bao gồm permissions array)
3. **Tenants**: CRUD, settings, features (feature flags)
4. **Locations**: list, tree, CRUD. Types: COUNTRY → PROVINCE → DISTRICT → WARD → STREET
5. **Properties**: CRUD + filter đa tiêu chí (propertyTypeId, transactionType, businessStatus, publicationStatus, provinceId, districtId, wardId, projectId, zoneId, minPrice/maxPrice, minArea/maxArea, search)
6. **CRM**: customers, customer-needs, leads (+activities)
   - Lead statuses: NEW, CONTACTED, INTERESTED, NEGOTIATING, CONVERTED, LOST, RECYCLED
   - Lead sources: WEBSITE, PROPERTY_DETAIL, OWNER_PAGE, SALES_LINK, CTV_LINK, AGENCY_MARKETING, MANUAL_INPUT, LEAD_POOL, IMPORT
   - Activity types: CALL, NOTE, MESSAGE, SEND_PROPERTY, STATUS_CHANGE, APPOINTMENT_CREATED, DEAL_CREATED
7. **Appointments**: CRUD. Types: MEETING, CALL, SITE_VISIT, SIGNING
8. **Deals**: CRUD + activities. Transaction types: SALE, RENT, TRANSFER. Activity types: NOTE, STATUS_CHANGE, CALL, EMAIL, MEETING, DOCUMENT
9. **Reservations**: list, create, approve, reject. Types: SOFT, HARD
10. **Commission**: plans (CRUD + status), deals, estimate
11. **Workflow**: CRUD + transitions. `GET /api/workflows/:id/transitions/:currentStateCode`
12. **Files**: upload (multipart, field "file"/"files"), list, download (presigned URL), visibility, delete. Visibility: PUBLIC, TENANT, ASSIGNED, PRIVATE, SENSITIVE. Max 50MB, 10 files, MIME: jpeg/png/webp/gif/pdf/mp4
13. **Lead Protection**: policies, check, disputes, resolve
14. **Visibility Policies**: CRUD + rules
15. **Dynamic Fields**: groups, definitions, form-schemas (render động, không hardcode)

### Auth Flow
1. User nhập email + password + tenant code
2. `POST /api/auth/login` → `{ accessToken, refreshToken, user }`
3. Lưu tokens (Zustand store + httpOnly cookie)
4. Mọi request: `Authorization: Bearer` + `x-tenant-code`
5. 401 → `POST /api/auth/refresh` → retry
6. Logout: `POST /api/auth/logout` → clear tokens → redirect `/login`

### Dev Environment
- Tenant code: `DEMO`
- Seed: `admin@demo.realhub.local` / `Admin@123456` (SUPER_ADMIN), `sales@demo.realhub.local` / `Sales@123456` (SALES)
- FE env: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`, `NEXT_PUBLIC_TENANT_CODE=DEMO`

---

## 11. PHASE PLAN

| Phase | Mục tiêu | Có | Chưa có |
|-------|----------|----|---------:|
| Phase 1 — MVP Core | Chạy hệ sinh thái cốt lõi | Customer self-service, Owner self-sell, Sales assignment, Lead CRM, Deal cơ bản, giữ chỗ mềm, Commission Engine, SEO, MinIO, audit | Payment online, SePay, cọc, ngân hàng, pháp lý, nội thất |
| Phase 2 — Payment & Partner Finance | Thanh toán + vận hành giao dịch sâu | SePay, payment order/webhook, đối soát, cọc online, refund, subscription tenant, ngân hàng/tư vấn vay | Marketplace liên sàn, AI nâng cao |
| Phase 2/3 — Legal & Transaction Support | Hỗ trợ pháp lý | Pháp lý, công chứng, thẩm định hồ sơ, hợp đồng, tiến độ pháp lý | — |
| Phase 3 — Ecosystem Expansion | Mở rộng hệ sinh thái | Nội thất/xây dựng, quản lý tòa nhà, vận hành cho thuê, AI Sales Kit, marketplace liên sàn, đối tác marketing | — |

---

## 12. CHECKLIST P0 TRƯỚC KHI CHIA TASK

| Hạng mục | Trạng thái mong muốn |
|----------|---------------------|
| Scope Phase 1 | Chốt không payment, có owner self-sell, customer self-service, commission động |
| Role/Permission | Role MVP + multi-profile/multi-tenant membership |
| Product Visibility | Có visibility_scope và publication_status riêng |
| Selling Mode | Có SELF_SELL, SALES_DISTRIBUTION, HYBRID, INTERNAL_ONLY, MARKETPLACE_PUBLIC |
| Lead Policy | Có duplicate/protection/lead pool |
| Commission Engine | Có plan/rule/split/snapshot/ledger |
| Dynamic Config | Có assignment, visibility, lead protection, SEO, feature flags |
| QA Acceptance | Có test cho customer, owner, sales, CTV, lead, deal, commission |

---

## 13. GỢI Ý UI/UX (FE Pages)

| Trang | Route | Module BE | UI chính |
|-------|-------|-----------|----------|
| Dashboard | `/` | — | Stats cards, charts |
| Login | `/login` | Auth | Form login + tenant code |
| Register | `/register` | Auth | Form đăng ký |
| Properties | `/properties` | Properties | DataGrid + filter sidebar + map toggle |
| Property Detail | `/properties/:id` | Properties | Tabs: Info, Media, Documents, History |
| Property Form | `/properties/new` | Properties + Dynamic Fields | Dynamic form từ FormSchema API |
| Projects | `/projects` | Projects | DataGrid + search + developer filter |
| Project Detail | `/projects/:id` | Projects | Info + danh sách BĐS thuộc dự án |
| Project Form | `/projects/new` | Projects | Form tạo dự án (tên, mã, chủ đầu tư, khu vực) |
| Customers | `/customers` | CRM | DataGrid + search + type filter |
| Customer Detail | `/customers/:id` | CRM | Tabs: Info, Needs, Leads, Activities |
| Leads | `/leads` | CRM | Kanban board (theo status) + list toggle |
| Lead Detail | `/leads/:id` | CRM + Lead Protection | Tabs: Info, Activities, Protection, Disputes |
| Appointments | `/appointments` | Appointments | Calendar + list view |
| Deals | `/deals` | Deals + Workflow | Kanban theo workflow state + detail drawer |
| Deal Detail | `/deals/:id` | Deals + Commission | Tabs: Info, Activities, Reservation, Commission |
| Commission Plans | `/commission/plans` | Commission | Table + form tạo plan (rules + splits) |
| Commission Report | `/commission/reports` | Commission | Charts + table theo sales/time |
| Workflows | `/settings/workflows` | Workflow | Visual workflow editor |
| Locations | `/settings/locations` | Locations | Tree view + CRUD modal |
| Dynamic Fields | `/settings/dynamic-fields` | Dynamic Fields | Groups + definitions + form schema builder |
| Visibility Policies | `/settings/visibility` | Visibility | Policy list + rule editor |
| Lead Protection | `/settings/lead-protection` | Lead Protection | Policy list + dispute queue |
| Files | `/files` | Files | File manager grid/list view |
| Settings | `/settings` | Tenants | Tenant settings, feature flags, branding |
| User Profile | `/profile` | Users | Avatar, info, password change |

---

## 14. KEY NOTES CHO FE

1. **Tenant header bắt buộc** — Mọi API request (trừ public routes) phải gửi `x-tenant-code`. Nếu thiếu → `404 Tenant not found`.
2. **Token expiry** — Access token hết hạn sau 15 phút. Cần implement auto-refresh bằng interceptor.
3. **Data masking** — Dữ liệu trả về có thể đã bị mask (phone, price, address). KHÔNG cố gắng unmask ở FE.
4. **Soft delete** — DELETE endpoint chỉ set `status: INACTIVE`. UI nên ẩn item đã xóa.
5. **Dynamic fields** — Form tạo/sửa property phải render động từ API `/api/dynamic-fields/form-schemas`. Không hardcode fields.
6. **Workflow states** — Deal/Lead status có thể thay đổi theo tenant. Cần fetch `/api/workflows` để lấy states + transitions.
7. **File upload** — Dùng `multipart/form-data`, field name là `file` (single) hoặc `files` (multiple). Tối đa 10 files/request, 50MB/file.
8. **Permission-based UI** — Ẩn/hiện button, menu item dựa trên permission của user. Lấy từ `GET /api/users/me` (response bao gồm `permissions` array).
9. **Pagination** — Tất cả endpoint list dùng `limit` + `offset`. Response không trả total count — FE cần dùng infinite scroll hoặc estimated pagination.
10. **Swagger** — Luôn tham khảo `/api/docs` để xem schema chi tiết, request/response examples mới nhất.
