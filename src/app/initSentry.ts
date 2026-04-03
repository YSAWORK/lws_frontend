// src/app/initSentry.ts
// Ініціалізація моніторингу через Sentry

// SDK для Vue
import * as Sentry from "@sentry/vue"
// тип Vue application (type safety)
import {App} from "vue";
// щоб Sentry відслідковував переходи
import router from "@/router"
import { appConfig } from "@/app/config";

// Функція ініціалізації моніторингу через Sentry
export function initSentry(app: App) {
    if (!appConfig.isProd || !appConfig.sentryDsn) {
        return
    }
    Sentry.init({
        app,
        dsn: appConfig.sentryDsn,
        // включає performance monitoring: переходи між сторінками, вимірювання: час завантаження, API calls, rendering
        integrations: [
            Sentry.browserTracingIntegration({
                router,
            }),
        ],
        release: appConfig.appVersion,
        debug: !appConfig.isProd,
        environment: appConfig.mode,
        // Ігнорування зайвого шуму
        ignoreErrors: [
            "ResizeObserver loop limit exceeded",
        ],
        // Ступінь логування
        tracesSampleRate: appConfig.isProd ? 0.2 : 1.0, // 10%
        // НЕ записувати всі сесії користувачів
        replaysSessionSampleRate: 0.0,
        // якщо сталася помилка — записати replay 100% випадків
        replaysOnErrorSampleRate: 1.0,
    })
}
