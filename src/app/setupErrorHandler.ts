// src/app/setupErrorHandler.ts
// Логіка перехоплення помилок, не охоплених в коді

// тип Vue application (type safety)
import type { App } from "vue"
// імпорт інтерфейсу логера
import type { Logger } from "@/logging/types"

// Функція перехоплення системних помилок
export function setupErrorHandler(app: App, logger: Logger): void {
    app.config.errorHandler = (error, instance, info) => {
        logger.error("vue_unhandled_error", {
            error,
            info,
            component: instance?.$options?.name,
        })
    }
}