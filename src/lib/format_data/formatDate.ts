// src/lib/formatDate.ts
// FORMAT DATE FUNCTION to "DD.MM.YYYY"

export function formatDate(
    dateValue: string | number | Date | null | undefined
): string {
    if (dateValue === null || dateValue === undefined || dateValue === "") {
        return ""
    }

    const date =
        typeof dateValue === "string" || typeof dateValue === "number"
            ? new Date(dateValue)
            : dateValue

    if (isNaN(date.getTime())) return ""

    return date.toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}