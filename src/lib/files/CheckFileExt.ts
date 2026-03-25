/// .src/lib/CheckFileExt.ts

/// Перевіряє чи є файл PDF
export function checkIsPdf(input: File | string | null): boolean {
    if (!input) return false

    // Якщо це File (новий вибраний файл)
    if (input instanceof File) {
        if (input.type === "application/pdf") return true
        return input.name.toLowerCase().endsWith(".pdf")
    }

    // Якщо це URL (поточний файл з бекенду)
    const cleanUrl = input.split("?")[0].split("#")[0]
    return cleanUrl.toLowerCase().endsWith(".pdf")
}