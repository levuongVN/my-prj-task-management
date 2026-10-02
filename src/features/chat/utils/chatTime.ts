/** Giờ cho từng message trong thread (vi dụ "3:45 PM") */
export function formatMessageTime(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
}

/** Nhãn thời gian gọn cho session list: hôm nay → giờ, khác → ngày/tháng */
export function formatSessionTime(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";

    const now = new Date();
    const sameDay =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    if (sameDay) {
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
    }

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** ISO → "YYYY-MM-DD" cho input type=date */
export function toDateInputValue(iso: string | null | undefined): string {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
