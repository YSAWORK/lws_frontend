// src/logging/sentryTransport.ts

// SDK для надсилання логів/помилок
import * as Sentry from "@sentry/vue"
// Формат логів
import type { LogContext, LogLevel } from "./types"

// Тип рівнів логування для Sentry
type SentryLevel = "debug" | "info" | "warning" | "error"

// Mapper рівнів логування між App та Sentry
function toSentryLevel(level: LogLevel): SentryLevel {
    switch (level) {
        case "debug":
            return "debug"
        case "info":
            return "info"
        case "warn":
            return "warning"
        case "error":
            return "error"
    }
}

// реалізація transport-а логера
export class SentryTransport {
    log(level: LogLevel, message: string, context: LogContext): void {
        // Фільтрація шуму: не відправляємо debug і info
        if (level === "debug" || level === "info") return
        // Конвертація рівня логування
        const sentryLevel = toSentryLevel(level)
        // Створює локальний контекст для одного логу
        Sentry.withScope((scope) => {
            // Встановлення рівня логу
            scope.setLevel(sentryLevel)
            // Додавання контексту логу
            scope.setContext("log_context", context)
            if (level === "error") {
                Sentry.captureException(new Error(message))
                return
            }
            Sentry.captureMessage(message, sentryLevel)
        })
    }
}