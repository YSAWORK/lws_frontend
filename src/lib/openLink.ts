// .src/lib/openLink.ts
// OPEN EXTERNAL LINK IN NEW TAB SAFELY


export function openLink(rawUrl: string): void {
    if (!rawUrl) return;

    try {
        const url = encodeURI(rawUrl);
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";

        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        console.error("Помилка при відкритті зовнішнього посилання:", error);
        window.location.assign(rawUrl);
    }
}
