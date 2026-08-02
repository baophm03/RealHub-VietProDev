# RealHub Design System

> Document này là nguồn sự thật duy nhất (single source of truth) cho phong cách UI/UX toàn bộ ứng dụng RealHub. Mọi component, page, layout phải tuân thủ document này.

---

## 1. Design Philosophy

### Archetype: Editorial Luxury + Soft Structuralism

RealHub là nền tảng Bất động sản cao cấp. Phong cách thiết kế kết hợp:

- **Editorial Luxury** — tông màu ấm (cream, sage, espresso), typography serif cao cấp cho heading, cảm giác giấy/nhựa vật lý
- **Soft Structuralism** — typography Grotesk lớn, component bay nổi, shadow khuếch tán siêu mềm
- **Premium Utilitarian Minimalism** — bento grid bất đối xứng, viền 1px tinh tế, màu sắc khan hiếm

### Nguyên tắc cốt lõi

| Nguyên tắc | Mô tả |
|------------|-------|
| **Color is scarce** | Màu chỉ dùng cho semantic meaning hoặc accent tinh tế. Nền luôn neutral ấm |
| **Typography is hero** | Hierarchy bằng weight + size + font family, không phụ thuộc màu |
| **Whitespace is luxury** | Padding tối thiểu `py-24` cho section. Để design "thở" |
| **Motion is invisible** | Animation có mặt nhưng không gây phân tâm. Spring physics, cubic-bezier |
| **Cards are physical** | Double-bezel nested architecture, không đặt card phẳng trên background |

---

## 2. Color System

### 2.1 Light Mode (Default)

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#FBFBFA` | Canvas nền (warm bone) |
| `--surface` | `#FFFFFF` | Card surface |
| `--surface-muted` | `#F7F6F3` | Secondary surface, input background |
| `--foreground` | `#1A1A1A` | Body text (off-black) |
| `--foreground-muted` | `#787774` | Secondary text |
| `--border` | `#EAEAEA` | Structural border, divider |
| `--border-strong` | `#D1D0CE` | Active border, focus ring |
| `--accent` | `#1A1A1A` | Primary CTA background |
| `--accent-foreground` | `#FFFFFF` | Primary CTA text |

### 2.2 Dark Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#0F0F0E` | Canvas nền (warm off-black) |
| `--surface` | `#1A1A19` | Card surface |
| `--surface-muted` | `#242423` | Secondary surface |
| `--foreground` | `#EDEDEC` | Body text |
| `--foreground-muted` | `#9C9B98` | Secondary text |
| `--border` | `rgba(255,255,255,0.08)` | Structural border |
| `--border-strong` | `rgba(255,255,255,0.15)` | Active border |
| `--accent` | `#EDEDEC` | Primary CTA background |
| `--accent-foreground` | `#0F0F0E` | Primary CTA text |

### 2.3 Semantic Accent Colors (Muted Pastels)

Màu chỉ dùng cho tag, badge, status indicator. **Tuyệt đối không dùng làm background cho section lớn hoặc button primary.**

| Token | Background | Text | Usage |
|-------|-----------|------|-------|
| `--accent-red` | `#FDEBEC` | `#9F2F2D` | Error, danger, overdue |
| `--accent-blue` | `#E1F3FE` | `#1F6C9F` | Info, pending |
| `--accent-green` | `#EDF3EC` | `#346538` | Success, available, active |
| `--accent-yellow` | `#FBF3DB` | `#956400` | Warning, draft, pending approval |
| `--accent-purple` | `#F0E9F7` | `#6B3B8C` | Special, featured |

### 2.4 Forbidden Colors

- **Tuyệt đối KHÔNG dùng**: AI purple/blue neon gradient, glow effect, pure black `#000000`, oversaturated accent
- **Không dùng gradient** trừ khi explicit request
- **Không dùng glow/shadow màu** làm primary affordance

---

## 3. Typography

### 3.1 Font Stack

| Role | Font | Fallback |
|------|------|----------|
| **Sans (Body, UI)** | `Geist` | `SF Pro Display`, `Helvetica Neue`, sans-serif |
| **Serif (Editorial Heading)** | `Newsreader` | `Instrument Serif`, `Playfair Display`, serif |
| **Mono (Data, Code, Meta)** | `Geist Mono` | `SF Mono`, `JetBrains Mono`, monospace |

> **Banned fonts**: Inter, Roboto, Arial, Open Sans, Helvetica (as primary)

### 3.2 Type Scale

| Token | Size | Weight | Line Height | Tracking | Font | Usage |
|-------|------|--------|-------------|----------|------|-------|
| `display` | `text-5xl md:text-7xl` | 600 | `leading-[1.05]` | `tracking-tighter` | Serif | Hero heading, landing page |
| `h1` | `text-4xl md:text-5xl` | 600 | `leading-[1.1]` | `tracking-tight` | Serif | Page title |
| `h2` | `text-3xl md:text-4xl` | 600 | `leading-[1.15]` | `tracking-tight` | Sans | Section heading |
| `h3` | `text-xl md:text-2xl` | 600 | `leading-[1.25]` | `tracking-tight` | Sans | Card title, subsection |
| `h4` | `text-lg` | 600 | `leading-[1.3]` | `normal` | Sans | Label heading |
| `body` | `text-base` | 400 | `leading-relaxed` | `normal` | Sans | Paragraph, body text |
| `body-sm` | `text-sm` | 400 | `leading-relaxed` | `normal` | Sans | Secondary text, description |
| `caption` | `text-xs` | 500 | `leading-normal` | `normal` | Sans | Caption, helper text |
| `label` | `text-xs` | 600 | `leading-normal` | `tracking-wide` | Sans | Form label, eyebrow tag |
| `mono` | `text-sm` | 500 | `leading-normal` | `normal` | Mono | Data, number, code, metadata |

### 3.3 Typographic Rules

- Heading dùng `text-balance` (Tailwind: `text-balance`)
- Body dùng `text-pretty` (Tailwind: `text-pretty`)
- Number/data dùng `tabular-nums` (Tailwind: `tabular-nums`)
- Serif font **chỉ** dùng cho heading editorial/landing page. **KHÔNG** dùng serif cho dashboard/software UI
- Eyebrow tag: `text-[10px] uppercase tracking-[0.2em] font-medium` trước heading lớn

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

Sử dụng Tailwind default spacing scale. Các giá trị thường dùng:

| Context | Padding/Gap |
|---------|-------------|
| Section vertical | `py-24` đến `py-40` |
| Section horizontal | `px-6 md:px-8 lg:px-12` |
| Card internal | `p-6` đến `p-10` |
| Component gap | `gap-4` đến `gap-8` |
| Form field gap | `gap-2` (label-input-error) |
| Tight UI (dense data) | `gap-2` đến `gap-3`, `p-3` đến `p-4` |

### 4.2 Container

```tsx
<div className="max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12">
  {/* content */}
</div>
```

### 4.3 Layout Archetypes

RealHub dùng 3 layout archetype chính, xen kẽ để tránh nhàm chán:

1. **Asymmetrical Bento** — Dashboard, feature grid. CSS Grid với `col-span` khác nhau
2. **Editorial Split** — Landing page, property detail. 50/50 split, typography lớn bên trái
3. **Z-Axis Cascade** — Card stack cho listing, deal pipeline. Overlap nhẹ với rotation

### 4.4 Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| `base` (mobile) | `<768px` | Single column, `w-full`, `px-4`, bottom nav |
| `md` (tablet) | `768px-1279px` | Collapsible sidebar, 2-col grid |
| `lg` (desktop) | `>=1280px` | Full sidebar + content, multi-col grid |

> **Quy tắc mobile**: Mọi layout asymmetric phải fallback single-column (`grid-cols-1`) với `gap-6` dưới `768px`. Gỡ bỏ rotation, overlap, negative margin.

### 4.5 Viewport Height

**Tuyệt đối không dùng `h-screen`**. Luôn dùng `min-h-[100dvh]` cho full-height section để tránh iOS Safari viewport jumping.

---

## 5. Component Architecture

### 5.1 Double-Bezel (Nested Card)

Mọi card premium phải có cấu trúc nested:

```tsx
{/* Outer Shell */}
<div className="bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 p-1.5 rounded-[2rem]">
  {/* Inner Core */}
  <div className="bg-white dark:bg-surface rounded-[calc(2rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] p-6">
    {/* content */}
  </div>
</div>
```

### 5.2 Button

| Variant | Style |
|---------|-------|
| **Primary** | `bg-accent text-accent-foreground rounded-md px-5 py-2.5 font-medium`. Hover: `bg-foreground/90`. Active: `scale-[0.98]` |
| **Secondary** | `bg-surface-muted text-foreground rounded-md border border-border px-5 py-2.5`. Hover: `bg-border/50` |
| **Ghost** | `text-foreground hover:bg-surface-muted rounded-md px-5 py-2.5` |
| **Destructive** | `bg-accent-red/10 text-accent-red-text rounded-md px-5 py-2.5` |

Button-in-Button pattern cho CTA có arrow:

```tsx
<button className="group inline-flex items-center gap-3 rounded-full bg-accent text-accent-foreground px-6 py-3">
  <span>Get Started</span>
  <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-px">
    <ArrowUpRight size={14} />
  </span>
</button>
```

### 5.3 Input

```tsx
<div className="flex flex-col gap-2">
  <label htmlFor="email" className="text-xs font-semibold tracking-wide text-foreground-muted">
    Email
  </label>
  <input
    id="email"
    type="email"
    className="rounded-md border border-border bg-surface px-4 py-2.5 text-base
               focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-border-strong/20
               placeholder:text-foreground-muted/50"
  />
  <p className="text-xs text-foreground-muted">Helper text</p>
</div>
```

### 5.4 Badge / Tag

```tsx
<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide"
      style={{ backgroundColor: 'var(--accent-green)', color: 'var(--accent-green-text)' }}>
  Available
</span>
```

### 5.5 Card (Minimal)

```tsx
<div className="rounded-xl border border-border bg-surface p-6 transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
  {/* content */}
</div>
```

### 5.6 Divider

```tsx
<hr className="border-border" />
// hoặc
<div className="border-t border-border" />
```

### 5.7 Sidebar Navigation

- Desktop (>=1280px): Fixed sidebar `w-64`, border-right
- Tablet (768-1279px): Collapsible, drawer
- Mobile (<768px): Bottom navigation bar

### 5.8 Keystroke

```tsx
<kbd className="rounded border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-xs">
  Ctrl + K
</kbd>
```

---

## 6. Iconography

### 6.1 Icon Library

Sử dụng **Phosphor Icons** (`@phosphor-icons/react`), weight `regular` hoặc `duotone`.

```tsx
import { House, Users, Calendar, ChartBar } from '@phosphor-icons/react'

<House size={20} weight="regular" />
```

> **Banned**: Lucide default thick-stroke, FontAwesome, Material Icons, emoji

### 6.2 Icon Rules

- Standardize `size` trong toàn app (20px cho nav, 16px cho inline, 24px cho heading)
- Icon-only button **bắt buộc** có `aria-label`
- Decorative icon: `aria-hidden="true"`
- Không dùng emoji thay icon trong bất kỳ trường hợp nào

---

## 7. Motion & Animation

### 7.1 Motion Principles

| Principle | Rule |
|-----------|------|
| **Spring physics** | `type: "spring", stiffness: 100, damping: 20` cho interactive |
| **Custom easing** | `cubic-bezier(0.16, 1, 0.3, 1)` cho entrance, `cubic-bezier(0.32, 0.72, 0, 1)` cho UI |
| **GPU only** | Chỉ animate `transform` + `opacity`. Không animate `width`, `height`, `top`, `left`, `margin`, `padding` |
| **Duration** | Interaction feedback: max 200ms. Entrance: 600-800ms |
| **Reduced motion** | Respect `prefers-reduced-motion` |

### 7.2 Entrance Animation (Scroll Reveal)

```tsx
// Framer Motion
<motion.div
  initial={{ opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
  {/* content */}
</motion.div>
```

### 7.3 Staggered Reveal

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}
```

### 7.4 Hover States

- Card: `transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]`
- Button: `active:scale-[0.98]` (physical press)
- Nested icon: `group-hover:translate-x-0.5 group-hover:-translate-y-px`

### 7.5 Forbidden Motion

- `linear` hoặc `ease-in-out` default
- `window.addEventListener('scroll')` — dùng `IntersectionObserver` hoặc Framer Motion `whileInView`
- `backdrop-blur` trên scrolling container
- Looping animation trên off-screen element (phải pause)
- Layout-triggering animation properties

---

## 8. Interaction States

Mọi component phải có đủ 4 trạng thái:

| State | Implementation |
|-------|---------------|
| **Loading** | Skeleton loader matching layout size. `aria-busy="true"`. Không dùng generic spinner |
| **Empty** | Empty state composition + 1 clear next action (CTA button) |
| **Error** | Inline error, `aria-describedby` link to field, `aria-invalid="true"` |
| **Success** | Subtle confirmation, không block workflow |

### Skeleton Loader Example

```tsx
<div className="animate-pulse rounded-xl border border-border bg-surface p-6">
  <div className="h-4 w-3/4 rounded bg-border/50" />
  <div className="mt-3 h-3 w-1/2 rounded bg-border/30" />
</div>
```

---

## 9. Accessibility Checklist

| Rule | Priority |
|------|----------|
| Mọi interactive control có accessible name | Critical |
| Icon-only button có `aria-label` | Critical |
| Mọi input có `<label>` associated | Critical |
| Tab key reach tất cả interactive element | Critical |
| Focus visible cho keyboard user | Critical |
| Modal trap focus + restore focus on close | Critical |
| Escape đóng dialog/overlay | Critical |
| Error link tới field qua `aria-describedby` | High |
| Required field được announced | High |
| `aria-live` cho critical form error | Medium-High |
| `prefers-reduced-motion` được respect | Medium |
| Image có alt text (meaningful hoặc empty) | Medium |

---

## 10. Data Display Patterns

### 10.1 DataGrid / Table

- Dùng TanStack Table v8
- Sorting, filtering, pagination
- Row selection cho bulk action
- `tabular-nums` cho numeric column
- Dense mode: `p-3`, standard: `p-4`
- Divider: `border-t border-border`, không dùng card box cho mỗi row

### 10.2 Kanban Board

- Column = status (fetch từ `/api/workflows`)
- Drag & drop: `@dnd-kit` hoặc Framer Motion `layoutId`
- Card: tên khách, phone (masked), giá, ngày tạo, avatar
- Column header: count badge

### 10.3 Charts

- Dùng Recharts
- Color: neutral foreground + 1 accent. Không dùng rainbow palette
- Axis: mono font, `text-xs`, muted color
- Grid line: `stroke="var(--border)"` ultra light
- Tooltip: card style, `rounded-md border border-border bg-surface p-3 shadow-sm`

### 10.4 Stat Card

```tsx
<div className="flex flex-col gap-1">
  <span className="text-xs font-medium tracking-wide text-foreground-muted uppercase">Total Deals</span>
  <span className="text-3xl font-semibold tabular-nums tracking-tight">1,247</span>
  <span className="text-xs text-foreground-muted">+12.4% vs last month</span>
</div>
```

> Không box mọi stat vào card. Dùng `border-t` hoặc negative space để group.

---

## 11. File Structure Convention

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (login, register)
│   ├── (dashboard)/        # Protected pages
│   │   ├── layout.tsx      # Dashboard layout (sidebar + topbar)
│   │   ├── page.tsx        # Dashboard home
│   │   ├── properties/
│   │   ├── customers/
│   │   ├── leads/
│   │   ├── appointments/
│   │   ├── deals/
│   │   ├── commission/
│   │   └── settings/
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles + CSS variables
├── components/
│   ├── ui/                 # Base primitives (button, card, input, ...)
│   ├── layout/             # Layout components (sidebar, topbar, footer)
│   ├── shared/             # Shared business components
│   └── icons/              # Custom icon wrappers
├── lib/
│   ├── api/                # API client, interceptors, endpoints
│   ├── stores/             # Zustand stores (auth, ui, tenant)
│   ├── hooks/              # Custom hooks (useAuth, usePermission, ...)
│   ├── utils/              # Utilities (cn, formatters, ...)
│   └── types/              # TypeScript types & enums
├── providers/              # Context providers (QueryProvider, ThemeProvider)
└── config/                 # App config (nav items, env, constants)
```

---

## 12. Theme & Branding

### 12.1 Dynamic Tenant Theme

Tenant settings (`GET /api/tenants/:id/settings`) trả về `primaryColor` và `logoUrl`. Áp dụng dynamic:

```tsx
// Trong root layout hoặc provider
useEffect(() => {
  const settings = tenantStore.settings
  if (settings?.primaryColor) {
    document.documentElement.style.setProperty('--accent', settings.primaryColor)
  }
}, [tenantStore.settings])
```

### 12.2 Dark Mode

- Toggle trong user menu
- Dùng `class` strategy (Tailwind)
- `prefers-color-scheme` làm default
- Lưu preference trong localStorage

### 12.3 Branding Assets

- Logo: load từ `tenantSettings.logoUrl`
- Favicon: dynamic per tenant
- Primary color: override CSS variable `--accent`

---

## 13. Z-Index Scale

| Layer | Z-Index | Usage |
|-------|---------|-------|
| Base | `0` | Normal content |
| Sticky | `10` | Sticky header, sidebar |
| Dropdown | `20` | Dropdown menu, popover |
| Drawer | `30` | Side drawer |
| Modal | `40` | Dialog, modal |
| Toast | `50` | Toast notification |
| Tooltip | `60` | Tooltip |

> **Không dùng** arbitrary `z-[9999]` hoặc `z-50` ngoài scale này.

---

## 14. Performance Guardrails

| Rule | Detail |
|------|--------|
| GPU-safe animation | Chỉ `transform` + `opacity` |
| Blur constraint | `backdrop-blur` chỉ cho fixed/sticky element |
| Noise/grain overlay | Chỉ cho `position: fixed; pointer-events: none` |
| `will-change` | Chỉ khi đang animate, gỡ sau khi xong |
| Image | Dùng `next/image`, set `width` + `height` hoặc `fill` |
| Bundle | Dynamic import cho heavy component (charts, maps, editor) |
| Perpetual motion | Isolate trong Client Component riêng, `React.memo` |

---

## 15. AI Tells — Forbidden Patterns

| Pattern | Why Banned |
|---------|-----------|
| Inter/Roboto font | Generic, không premium |
| AI purple/blue gradient | Cliché, không phù hợp BĐS cao cấp |
| 3-column equal card row | Generic AI layout |
| Centered hero | Nhàm chán, dùng asymmetric split |
| Generic names ("John Doe") | Dùng tên realistic tiếng Việt |
| Filler words ("Elevate", "Seamless") | Dùng ngôn ngữ cụ thể |
| Emoji in code/markup | Dùng icon proper |
| `h-screen` | Bug iOS Safari, dùng `min-h-[100dvh]` |
| Generic spinner | Dùng skeleton loader |
| Glow/neon shadow | Dùng inner border hoặc tinted shadow |

---

## 16. Content Guidelines

### 16.1 Voice & Tone

- **Professional nhưng gần gũi** — tiếng Việt là ngôn ngữ chính
- **Concrete, không sáo rỗng** — "Tạo bất động sản mới" thay vì "Elevate your property experience"
- **Action-oriented** — button label là động từ: "Lưu", "Tạo mới", "Xuất báo cáo"

### 16.2 Naming Convention

- Page title: Tiếng Việt, ngắn gọn — "Bất động sản", "Khách hàng", "Lịch hẹn"
- Button: Động từ + danh từ — "Thêm khách hàng", "Tạo lịch hẹn"
- Status: Tiếng Việt — "Mới", "Đã liên hệ", "Đã chuyển đổi"
- Table header: Ngắn, uppercase optional — "Tên", "Số điện thoại", "Trạng thái"

### 16.3 Placeholder Data

- Tên: "Nguyễn Văn An", "Trần Thị Bích", "Lê Minh Châu"
- SĐT: "0901 234 567", "0987 654 321"
- Email: "an.nguyen@abcrealestate.vn"
- Company: "ABC Real Estate", "Vinhomes Central", "Masteri Thao Dien"
