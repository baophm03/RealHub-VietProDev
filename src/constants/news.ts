const CATEGORY_COLOR_PALETTE = [
  {
    solid: "bg-blue-100 text-blue-700",
    soft: "bg-blue-100 text-blue-700",
    text: "text-blue-600",
  },
  {
    solid: "bg-emerald-100 text-emerald-700",
    soft: "bg-emerald-100 text-emerald-700",
    text: "text-emerald-600",
  },
  {
    solid: "bg-amber-100 text-amber-700",
    soft: "bg-amber-100 text-amber-700",
    text: "text-amber-600",
  },
  {
    solid: "bg-violet-100 text-violet-700",
    soft: "bg-violet-100 text-violet-700",
    text: "text-violet-600",
  },
  {
    solid: "bg-rose-100 text-rose-700",
    soft: "bg-rose-100 text-rose-700",
    text: "text-rose-600",
  },
  {
    solid: "bg-teal-100 text-teal-700",
    soft: "bg-teal-100 text-teal-700",
    text: "text-teal-600",
  },
] as const;

const FALLBACK = {
  solid: "bg-primary/10 text-primary",
  soft: "bg-primary/10 text-primary",
  text: "text-primary",
};

/**
 * Map category code -> màu badge ổn định (cùng code luôn ra cùng màu).
 */
export function getNewsCategoryColor(code?: string | null) {
  if (!code) return FALLBACK;
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash * 31 + code.charCodeAt(i)) >>> 0;
  }
  return CATEGORY_COLOR_PALETTE[hash % CATEGORY_COLOR_PALETTE.length];
}
