// src/app/initConfig.ts
// Ініціалізація конфігурації застосунку з кількох джерел з пріоритетами, кешуванням і валідацією.

// Імпортує TypeScript-тип та Zod-схему конфігу
import { type AppConfig, AppConfigSchema } from "@/model_schemas/dto/app/config.dto"
// Імпорт функції, яка перевіряє чи є значення звичайним об'єктом
import { isPlainObject } from "@/tools/checkIsPlainObject"

// максимальний час очікування відповіді від сервера при запиті (в мс)
const CONFIG_REQUEST_TIMEOUT_MS = 5000 // 5 секунд
// зберігає URL для завантаження віддаленої конфігурації
const REMOTE_CONFIG_URL = "/config.json"
//  назва застосунку за замовчуванням, яка використовується якщо жодне з джерел не надало значення
const DEFAULT_APP_NAME = "Legal Work Space"
// базовий URL для API-запитів за замовчуванням
const DEFAULT_API_BASE_URL = "/api"
// середовище виконання за замовчуванням
const DEFAULT_ENVIRONMENT: AppConfig["environment"] = "development"

// локальний тип AppConfig, який робить всі поля необов'язковими
type AppConfigInput = Partial<AppConfig>

// розширення глобального типу Window в TypeScript (додає необов`язкове поле .__APP_CONFIG__)
declare global {
    interface Window {
        __APP_CONFIG__?: unknown
    }
}

// змінна кешу для збереження ініціалізованої конфігурації
let appConfig: AppConfig | null = null
// змінна, що зберігає поточний in-flight проміс ініціалізації
// захищає, коли initConfig() викликається одночасно з кількох місць до ініціалізації
let initConfigPromise: Promise<AppConfig> | null = null

// скидає змінні в початковий стан (потрібно для тестів)
export function resetConfigState(): void {
    appConfig = null
    initConfigPromise = null
}

///===== HELPERS ======///
// Функція-нормалізатор для поля environment:
// якщо значення є одним з трьох валідних — повертає його. В іншому випадку — DEFAULT_ENVIRONMENT
function normalizeEnvironment(value: unknown): AppConfig["environment"] {
    switch (value) {
        case "production":
        case "staging":
        case "development":
            return value as AppConfig["environment"]
        default:
            return DEFAULT_ENVIRONMENT
    }
}

// функція яка повертає об'єкт з дефолтними значеннями конфігурації
function getDefaultConfig(): AppConfigInput {
    return {
        appName: DEFAULT_APP_NAME,
        apiBaseUrl: DEFAULT_API_BASE_URL,
        environment: DEFAULT_ENVIRONMENT,
        debug: false,
    }
}

//  функція яка перетворює об'єкт на валідний AppConfigInput, перевіряючи кожне поле
function normalizeConfigSource(source: unknown): AppConfigInput {
    if (!isPlainObject(source)) {
        return {}
    }
    const result: AppConfigInput = {}
    if (typeof source.appName === "string" && source.appName.trim()) {
        result.appName = source.appName.trim()
    }
    if (typeof source.apiBaseUrl === "string" && source.apiBaseUrl.trim()) {
        result.apiBaseUrl = source.apiBaseUrl.trim()
    }
    if ("environment" in source) {
        result.environment = normalizeEnvironment(source.environment)
    }
    if (typeof source.debug === "boolean") {
        result.debug = source.debug
    }
    return result
}

// функція яка зливає кілька конфігурацій в одну, де джерела з вищим пріоритетом перезаписують нижчі
// ...sources - rest-параметр, що приймає довільну кількість об'єктів AppConfigInput
function mergeConfigSources(...sources: AppConfigInput[]): AppConfigInput {
    // reduce проходить по масиву sources зліва направо, накопичуючи результат в acc
    return sources.reduce<AppConfigInput>((acc, source) => {
        // Object.fromEntries() — збирає назад в об'єкт
        const cleaned = Object.fromEntries(
            // Object.entries(source) — перетворює поточне джерело на масив пар [ключ, значення]
            // .filter(([, v]) => v !== undefined) — видаляє пари з undefined
            Object.entries(source).filter(([, v]) => v !== undefined)
        ) as AppConfigInput
        // { ...acc, ...cleaned } — зливає результат з поточним джерелом, де cleaned перезаписує acc
        return { ...acc, ...cleaned }
    }, {})
}

// Функція яка зчитує конфігурацію зі змінних середовища Vite.
function readEnvConfig(): AppConfigInput {
    // import.meta.env — спеціальний об'єкт Vite який містить змінні середовища
    const env = import.meta.env
    return normalizeConfigSource({
        appName: env.VITE_APP_NAME,
        apiBaseUrl: env.VITE_API_BASE_URL,
        environment: env.MODE,
        debug: env.DEV,
    })
}

// Функція яка зчитує конфігурацію з глобального об'єкта window.__APP_CONFIG__
function readWindowConfig(): AppConfigInput {
    if (typeof window === "undefined") {
        return {}
    }
    try {
        return normalizeConfigSource(window.__APP_CONFIG__)
    } catch (error) {
        if (import.meta.env.DEV) {
            console.warn("Failed to read window.__APP_CONFIG__.", error)
        }
        return {}
    }
}

// Функція яка робить GET-запит з обмеженням часу очікування.
async function fetchJsonWithTimeout(url: string, timeoutMs: number): Promise<unknown> {
    // вбудований браузерний API для скасування fetch запиту
    const controller = new AbortController()
    // запускає таймер який викликає controller.abort() після timeoutMs мілісекунд
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
            signal: controller.signal,
        })
        //  файл відсутній, повертає {} без помилки, бо це нормальна ситуація
        if (response.status === 404) {
            return {}
        }
        //  будь-який інший HTTP помилковий статус (500, 403 тощо) — кидає помилку
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
        }
        //  парсить і повертає JSON
        return await response.json()
    } catch (error: unknown) {
        //  перехоплює AbortError який виникає при controller.abort() і замінює його на зрозуміліше повідомлення про таймаут
        if (error instanceof DOMException && error.name === "AbortError") {
            throw new Error(`Request timed out after ${timeoutMs} ms`)
        }
        throw error
    } finally {
        clearTimeout(timeoutId)
    }
}

// Обгортка над fetchJsonWithTimeout() яка додає два параметри:
// - fetchJsonWithTimeout() — відповідає за мережу (таймаут, статуси, парсинг JSON)
// - fetchRemoteConfig() — відповідає за конкретний ресурс (URL, таймаут) і форму
async function fetchRemoteConfig(): Promise<AppConfigInput> {
    const rawData = await fetchJsonWithTimeout(REMOTE_CONFIG_URL, CONFIG_REQUEST_TIMEOUT_MS)
    return normalizeConfigSource(rawData)
}

// Фінальна функція яка збирає всі джерела в один валідний AppConfig
function resolveAppConfig(...sources: AppConfigInput[]): AppConfig {
    // зливає всі джерела в один об'єкт з урахуванням пріоритетів
    const mergedConfig = mergeConfigSources(...sources)
    // передає злитий об'єкт в Zod схему
    const result = AppConfigSchema.safeParse(mergedConfig)
    if (!result.success) {
        throw new Error(`App config validation failed: ${result.error.message}`)
    }
    return result.data
}

// Функція доступу до закешованого конфігу
export function getAppConfig(): AppConfig {
    if (appConfig === null) {
        throw new Error("App config is not initialized. Call initConfig() before using config.")
    }
    return appConfig
}

// Функція яка перевіряє чи конфіг вже ініціалізований
export function isConfigInitialized(): boolean {
    return appConfig !== null
}

// Головна функція яка оркеструє весь процес ініціалізації конфігурації
export async function initConfig(): Promise<AppConfig> {
    if (appConfig !== null) { // вже ініціалізовано
        return appConfig
    }

    if (initConfigPromise !== null) { // вже в процесі
        return initConfigPromise
    }
    //  Проміс який зберігається в локальну змінну promise
    const promise = (async () => {
        const defaults = getDefaultConfig()
        const envConfig = readEnvConfig()
        const windowConfig = readWindowConfig()
        let remoteConfig: AppConfigInput = {}
        try {
            remoteConfig = await fetchRemoteConfig()
        } catch (error: unknown) {
            if (import.meta.env.DEV) {
                console.warn(
                    "Remote config fetch failed. Falling back to defaults/env/window.",
                    error,
                )
            }
        }

        // Order here defines priority — do not reorder without updating JSDoc.
        const resolvedConfig = resolveAppConfig(
            defaults,
            envConfig,
            remoteConfig,
            windowConfig,
        )

        appConfig = resolvedConfig
        return resolvedConfig
    })()

    initConfigPromise = promise

    try {
        return await promise
    } catch (error) {
        if (initConfigPromise === promise) {
            initConfigPromise = null
        }
        throw error
    }
}
