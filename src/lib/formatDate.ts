// src/lib/formatDate.ts
// FORMAT DATE FUNCTION to "DD.MM.YYYY"

export function formatDate(dateString: string | Date | null | undefined): string {
    if (!dateString) return "";

    const date = typeof dateString === "string" ? new Date(dateString) : dateString;

    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
    });
}