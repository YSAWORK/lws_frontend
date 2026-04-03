// srclogging/types.ts
// контракт (типізація) для системи логування

// допустимі рівні логування
export type LogLevel =
    | "debug"   // технічні деталі (dev)
    | "info"    // нормальні події
    | "warn"    // щось підозріле
    | "error"   // помилки

// Інтерфейс обʼєкта з метаданими логу
export interface LogContext {
    [key: string]: unknown
}

// Основний контракт логера
export interface Logger {
    debug(message: string, context?: LogContext): void
    info(message: string, context?: LogContext): void
    warn(message: string, context?: LogContext): void
    error(message: string, context?: LogContext): void
    child(context: LogContext): Logger // Створює дочірній логер з дефолтним контекстом
}
