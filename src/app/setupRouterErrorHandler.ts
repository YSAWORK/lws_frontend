// src/app/setupRouterErrorHandler.ts
// Логіка перехоплення помилок роутера

// імпорт об'єкта роутера
import type { Router } from "vue-router"
// імпорт інтерфейсу логера
import type { Logger } from "@/logging/types"

// Перехоплення та логування помилок роутера
export function setupRouterErrorHandler(router: Router, logger: Logger): void {
    router.onError((error) => {
        logger.error("router_navigation_error", {
            error: normalizeError(error),
        })
    })
}

// Приведення будь-якої помилки до уніфікованого формату
function normalizeError(error: unknown) {
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
        }
    }

    return {
        value: String(error),
    }
}