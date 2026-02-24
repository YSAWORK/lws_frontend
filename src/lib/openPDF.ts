// src/lib/openPDF.ts

// Opens a PDF file in a new tab or triggers a download if specified.
export function openPDF(fileUrl: string, download = false) {
    if (!fileUrl) return;
    if (/^https?:\/\//i.test(fileUrl)) {
        return download ? triggerDownload(fileUrl) : window.open(fileUrl, "_blank");
    }
    const url = fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;
    return download ? triggerDownload(url) : window.open(url, "_blank");
}

// Triggers a download for the specified URL.
function triggerDownload(url: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    a.target = "_blank";
    a.click();
}