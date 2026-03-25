// src/lib/sendEmail.ts

export function sendEmail(
    to: string,
    subject?: string,
    body?: string,
    cc?: string,
    bcc?: string
): void {
    if (!to) return;

    const params = new URLSearchParams();
    if (cc) params.append("cc", cc);
    if (bcc) params.append("bcc", bcc);
    if (subject) params.append("subject", subject);
    if (body) params.append("body", body);

    const mailto = `mailto:${to}${params.toString() ? "?" + params.toString() : ""}`;
    window.location.href = mailto;
}