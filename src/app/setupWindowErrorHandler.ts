// src/app/setupWindowErrorHandler.ts
// Логіка перехоплення глобальні sync-помилки JS

// імпорт інтерфейсу логера
import type { Logger } from "@/logging/types"

// захист від дублювання listener
let isRegistered = false

export function setupWindowErrorHandler(logger: Logger): void {
    // Захист від повторної реєстрації
    if (isRegistered) return
    isRegistered = true
    // Перехоплення глобальних sync-помилок JS
    window.addEventListener("error", (event: ErrorEvent) => {
        logger.error("window_error", {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
        })
    })
}