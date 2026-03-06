// src/lib/openPDF.ts

// Opens a PDF file in a new tab or triggers a download if specified.
    export async function openPDF(fileUrl: string, download = false) {
        if (!fileUrl) return
        const url = /^https?:\/\//i.test(fileUrl)
            ? fileUrl
            : (fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`)
        if (!download) {
            window.open(url, "_blank")
            return
        }
        const res = await fetch(url, { credentials: "include" })
        if (!res.ok) throw new Error(`Download failed: ${res.status}`)
        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = blobUrl
        a.download = guessFileName(url) ?? "file.pdf"
        a.click()
        URL.revokeObjectURL(blobUrl)
    }

    function guessFileName(url: string) {
        const clean = url.split("?")[0].split("#")[0]
        const name = clean.split("/").pop()
        return name || null
    }

// Triggers a download for the specified URL.
    function triggerDownload(url: string) {
        const a = document.createElement("a");
        a.href = url;
        a.download = "";
        a.target = "_blank";
        a.click();
    }