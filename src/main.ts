// src/main.ts
// точка входу фронтенду: зібрати додаток, ініціалізувати залежності і тільки потім показати UI.

// імпорт фабрики для створення Vue app
import { createApp } from "vue"
// імпорт кореневого компонента, з якого стартує весь UI
import App from "./App.vue"
// імпорт маршрутів
import router from "@/router"
// імпорт глобального сховища стану
import pinia from "@/app/getPinia"
// імпорт глобальних стилів
import "@/styles/tokens.css"
// відновлення/ініціалізація авторизації
import { initAuth } from "@/app/initAuth"
// завантаження або підготовка конфігурації застосунку
import { initConfig } from "@/app/initConfig"
// імпорт утиліти ініціалізації моніторингу через Sentry
import { initSentry } from "@/app/initSentry"
// імпорт утиліти створення об'єкта логера
import { createLogger } from "@/logging/createLogger"
// імпорт утиліти ініціалізації глобального логера
import { installLogger } from "@/app/plugins/loggerPlugin"
// імпорт логіки перехоплення помилок, не охоплених в коді
import { setupErrorHandler } from "@/app/setupErrorHandler"
// імпорт логіки перехоплення глобальних подій браузера
import { setupGlobalRejectionHandler } from "@/app/setupGlobalRejectionHandler"
// імпорт логіки перехоплення глобальних sync-помилок JS
import { setupWindowErrorHandler } from "@/app/setupWindowErrorHandler"
// імпорт логіки перехоплення помилок роутера
import { setupRouterErrorHandler } from "@/app/setupRouterErrorHandler"
// імпорт змінної з налаштуваннями App
import { appConfig } from "@/app/config";
import { useAuthStore } from "@/stores/auth"

// Створити готовий Vue app і підключити до нього базові плагіни: Pinia, Router
function createVueApp() {
        // створює екземпляр Vue-застосунку на основі кореневого компонента App
        const app = createApp(App)
        // підключає Pinia, щоб у всіх компонентах були доступні store
        app.use(pinia)
        // підключає Vue Router, щоб працювала навігація між сторінками
        app.use(router)
        // повертає готовий app для подальшого запуску
        return app
}

// Виконати всю стартову ініціалізацію перед тим, як показувати користувачу інтерфейс.
async function initApp() {
    // Асинхронно ініціалізує конфігурацію
    await initConfig()
    // Ініціалізує store авторизації через переданий pinia.
    useAuthStore(pinia).initFromStorage()
    // initAuth(pinia)
}

// Керує всім стартом застосунку:
// - створює app, logger
// - ініціалізує config, Sentry, auth (тільки після цього монтує UI)
async function bootstrap() {
    // Чекає завершення ініціалізації
    await initApp()
    // Отримує готовий Vue app з уже підключеними: Pinia, Router
    const app = createVueApp()
    // Отримуємо об'єкт логера з метаданими
    const logger = createLogger().child({
        env: appConfig.mode,
        appVersion: appConfig.appVersion,
    })
    // Ініціалізація глобального логера
    installLogger(app, logger)
    // Встановити перехоплення системних помилок
    setupErrorHandler(app, logger)
    // Встановити перехоплення глобальних подій браузера
    setupGlobalRejectionHandler(logger)
    // Встановити перехоплення глобальних sync-помилок JS
    setupWindowErrorHandler(logger)
    // Встановити перехоплення помилок роутера
    setupRouterErrorHandler(router, logger)
    // Ініціалізує логування через сервіс Sentry
    initSentry(app)
    logger.info("App initialized")
    // Монтує застосунок
    app.mount("#app")
}

// запускається весь процес старту застосунку
bootstrap().catch(console.error)
