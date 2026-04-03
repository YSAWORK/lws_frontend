// src/app/setupGlobalRejectionHandler.ts
// Логіка перехоплення глобальних подій браузера

// імпорт інтерфейсу логера
import type { Logger } from "@/logging/types"

// захист від дублювання listener
let isRegistered = false

// Перехоплення та логування глобальних подій браузера
export function setupGlobalRejectionHandler(logger: Logger): void {
    // Захист від повторної реєстрації
    if (isRegistered) return
    isRegistered = true
    // Перехоплення глобальної події браузера
    window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
        // Логування
        logger.error("unhandled_promise_rejection", {
            reason: normalizeError(event.reason),
            promise: String(event.promise),
        })
    })
}

// Приведення будь-якої помилки до уніфікованого формату
function normalizeError(reason: unknown) {
    if (reason instanceof Error) {
        return {
            name: reason.name,
            message: reason.message,
            stack: reason.stack,
        }
    }
    return {
        value: String(reason),
        type: typeof reason,
    }
}