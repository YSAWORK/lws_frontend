// src/app/config.ts
// Змінна конфігурацій App

export const appConfig = {
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
    appVersion: import.meta.env.VITE_APP_VERSION,
    appBaseUrl: import.meta.env.VITE_APP_BASE_URL,
    appName: import.meta.env.VITE_APP_NAME,
    mode: import.meta.env.MODE,
    isProd: import.meta.env.PROD,
    isDev: import.meta.env.DEV,
}