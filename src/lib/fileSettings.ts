// .src/lib/fileSettings.ts

// Отримати метаданні pdf файлу (файл)
type PdfInfo = {
    name: string
    size: number
    type: string
    lastModified: number
}

export function getPdfInfo(file: File | null): PdfInfo | null {
    if (!file) return null
    return {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
    }
}

// Отримати метаданні pdf файлу (URL)
export type RemoteFileInfo = {
    size: number | null
    lastModified: string | null
    contentType: string | null
}

export async function getRemoteFileInfo(url: string): Promise<RemoteFileInfo | null> {
    try {
        const res = await fetch(url, { method: "HEAD" })
        if (!res.ok) return null

        const sizeRaw = res.headers.get("Content-Length")
        const lastModified = res.headers.get("Last-Modified")
        const contentType = res.headers.get("Content-Type")

        return {
            size: sizeRaw ? Number(sizeRaw) : null,
            lastModified: lastModified ?? null,
            contentType: contentType ?? null,
        }
    } catch (e) {
        console.error("getRemoteFileInfo failed:", e)
        return null
    }
}

// Форматувати pdf дати в нормальний вид
    export function formatTimestamp(ts?: number | null): string | null {
        if (!ts) return null

        return new Date(ts).toLocaleString("uk-UA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
    }