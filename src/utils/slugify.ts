/**
 * Chuyển đổi chuỗi (hỗ trợ tiếng Việt có dấu) thành slug URL-friendly.
 * VD: "Vinhomes Central Park - 2PN" -> "vinhomes-central-park-2pn"
 */
export function slugify(input: string): string {
    return input
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}
