// src/lib/openPDF.ts

/**
 * Відкриває PDF-файл у новій вкладці або завантажує його.
 * @param fileUrl — шлях або повний URL до файлу
 * @param download — якщо true → файл завантажиться замість відкриття
 */
export function openPDF(fileUrl: string, download = false) {
    if (!fileUrl) return;
    const normalized = fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;
    const base = import.meta.env.VITE_BACKEND_ORIGIN || window.location.origin;
    const fullUrl = new URL(normalized, base).toString();

    if (download) {
        const a = document.createElement("a");
        a.href = fullUrl;
        a.download = "";
        a.target = "_blank";
        a.click();
    } else {
        window.open(fullUrl, "_blank");
    }
}