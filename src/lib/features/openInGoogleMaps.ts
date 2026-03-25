// src/lib/openInGoogleMaps.ts

export function openInGoogleMaps(address: string): void {
    const encoded = encodeURIComponent(address);
const url = `https://www.google.com/maps?q=${encoded}`;
window.open(url, "_blank");
}