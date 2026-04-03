// src/app/plugins/loggerPlugin.ts

// тип Vue application (type safety)
import type { App } from "vue"
// імпорт інтерфейсу логера
import type { Logger } from "@/logging/types"

// Створюється унікальний ключ для інжекції
export const LOGGER_KEY = Symbol("LOGGER")

// реєстрація логера в глобальному контейнері Vue
export function installLogger(app: App, logger: Logger): void {
    app.provide(LOGGER_KEY, logger)
    app.config.globalProperties.$logger = logger
}