// src/logging/createLogger.ts
// logging layer - єдиний, стандартизований спосіб логувати події в додатку

// Імпорт контракту щодо інтерфейсу логера
import type { Logger, LogContext, LogLevel } from "./types"

// контракт (інтерфейс) для механізму логування.
interface LogTransport {
    log(level: LogLevel, message: string, context: LogContext): void
}

// реалізація логера, яка пише логи в console
class ConsoleTransport implements LogTransport {
    constructor(private readonly logger: Console = console) {}
    log(level: LogLevel, message: string, context: LogContext): void {
        const payload = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...context,
        }
        const method = this.logger[level] ?? this.logger.log
        // Виклик логування
        method.call(this.logger, payload)
    }
}

// ======= Головний логер ====== //
// - приймає лог-запити (debug/info/warn/error)
// - прокидує їх у всі transports
// - додає контекст
class AppLogger implements Logger {
    constructor(
        private readonly transports: LogTransport[],
        private readonly baseContext: LogContext = {},
    ) {}

    debug(message: string, context: LogContext = {}): void {
        this.write("debug", message, context)
    }

    info(message: string, context: LogContext = {}): void {
        this.write("info", message, context)
    }

    warn(message: string, context: LogContext = {}): void {
        this.write("warn", message, context)
    }

    error(message: string, context: LogContext = {}): void {
        this.write("error", message, context)
    }

    child(context: LogContext): Logger {
        return new AppLogger(this.transports, {
            ...this.baseContext,
            ...context,
        })
    }

    private write(level: LogLevel, message: string, context: LogContext): void {
        const merged = structuredClone({
            ...this.baseContext,
            ...context,
        })

        for (const transport of this.transports) {
            transport.log(level, message, merged)
        }
    }
}

// фабрична функція, яка створює готовий логер
export function createLogger(): Logger {
    return new AppLogger([new ConsoleTransport()], {
        app: "LegalWorkSpace",
    })
}
