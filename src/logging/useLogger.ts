// src/logging/useLogger.ts
import { inject } from "vue"
import type { Logger } from "./types"
import { LOGGER_KEY } from "@/app/plugins/loggerPlugin"

export function useLogger(): Logger {
    const logger = inject<Logger>(LOGGER_KEY)

    if (!logger) {
        throw new Error("Logger is not provided")
    }

    return logger
}