// src/lib/openLoadFile.ts

// Opens a PDF file in a new tab or triggers a download if specified.
    type OpenFileOptions = {
        download?: boolean
    }

    export async function openLoadFile(fileUrl: string, options?: OpenFileOptions) {
        if (!fileUrl) return

        const url = normalizeUrl(fileUrl)

        if (!options?.download) {
            window.open(url, "_blank")
            return
        }

        const res = await fetch(url, { credentials: "include" })
        if (!res.ok) throw new Error(`Download failed: ${res.status}`)

        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = blobUrl
        a.download = guessFileName(url) ?? "file"
        a.click()

        URL.revokeObjectURL(blobUrl)
    }

    function normalizeUrl(url: string): string {
        if (/^https?:\/\//i.test(url)) return url
        return url.startsWith("/") ? url : `/${url}`
    }

    function guessFileName(url: string) {
        const clean = url.split("?")[0].split("#")[0]
        const name = clean.split("/").pop()
        return name || null
    }