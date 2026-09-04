/**
 * Format helpers cho giá BĐS (VND).
 *
 * Quy ước rút gọn:
 *  - >= 1 tỷ      → "X.Y tỷ"
 *  - >= 1 triệu   → "Z triệu"
 *  - nhỏ hơn      → phân tách hàng nghìn theo vi-VN
 */

const BILLION = 1_000_000_000;
const MILLION = 1_000_000;

/**
 * Format một con số giá thành chuỗi rút gọn tiếng Việt.
 * Chấp nhận cả number và string (API thường trả string).
 */
export function formatPrice(price: number | string): string {
  const n = typeof price === "string" ? Number(price || 0) : price;
  if (n >= BILLION) return `${(n / BILLION).toFixed(1)} tỷ`;
  if (n >= MILLION) return `${(n / MILLION).toFixed(0)} triệu`;
  return n.toLocaleString("vi-VN");
}

/**
 * Format giá kèm theo loại giao dịch.
 * Với RENT thì thêm hậu tố "/tháng" (hoặc "đ/tháng" khi giá nhỏ).
 */
export function formatPriceWithTransaction(
  priceStr: string,
  transactionType: string,
): string {
  const price = Number(priceStr || 0);
  if (transactionType === "RENT") {
    if (price >= MILLION) return `${(price / MILLION).toFixed(0)} triệu/tháng`;
    return `${price.toLocaleString("vi-VN")} đ/tháng`;
  }
  if (price >= BILLION) return `${(price / BILLION).toFixed(1)} tỷ`;
  if (price >= MILLION) return `${(price / MILLION).toFixed(0)} triệu`;
  return `${price.toLocaleString("vi-VN")} đ`;
}

/**
 * Format giá trên mỗi m². Trả chuỗi rỗng nếu không có diện tích hợp lệ.
 */
export function formatPricePerSqm(priceStr: string, area: number): string {
  const price = Number(priceStr || 0);
  if (!area || area <= 0) return "";
  const perSqm = Math.round(price / area);
  if (perSqm >= MILLION) return `~${(perSqm / MILLION).toFixed(1)} tr/m²`;
  return `~${perSqm.toLocaleString("vi-VN")} đ/m²`;
}

/**
 * Format khoảng ngân sách (min — max). Hỗ trợ thiếu một trong hai đầu.
 */
export function formatBudget(min?: string, max?: string): string {
  if (!min && !max) return "—";
  if (min && max) return `${formatPrice(min)} — ${formatPrice(max)}`;
  if (min) return `từ ${formatPrice(min)}`;
  if (max) return `đến ${formatPrice(max)}`;
  return "—";
}
