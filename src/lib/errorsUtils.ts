// @/lib/errorUtils.ts


// ===== IMPORTS ===== //
import type { AxiosError } from "axios";


// ===== TYPES & EXPORTS ===== //
export type NormalizedErrors = {
    nonField: string[];
    fields: Record<string, string[]>;
    status?: number;
};


// ===== NORMALIZE API ERROR ===== //
export function normalizeApiError(err: unknown): NormalizedErrors {
    const res = (err as AxiosError)?.response;
    const data = res?.data as any;

    const out: NormalizedErrors = { nonField: [], fields: {}, status: res?.status };

    if (!res) {
        out.nonField.push("Помилка мережі або сервер недоступний.");
        return out;
    }

    // 1) If there's a 'detail' field: { detail: "some message" }
    if (data?.detail) {
        out.nonField.push(String(data.detail));
    }

    // 2) If there are field-specific errors: { field_name: ["error1", "error2"] }
    if (data && typeof data === "object") {
        Object.entries(data).forEach(([key, val]) => {
            if (key === "detail") return;
            if (Array.isArray(val)) {
                out.fields[key] = val.map(v => String(v));
            } else if (typeof val === "string") {
                out.fields[key] = [val];
            }
        });
    }

    // 3) If no errors were found, add a generic message
    if (out.nonField.length === 0 && Object.keys(out.fields).length === 0) {
        out.nonField.push(`Сталася помилка (${res.status ?? "?"}). Спробуйте ще раз.`);
    }

    return out;
}
