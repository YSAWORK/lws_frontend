// vite.config.ts
// конфігурація для Vite (білд-інструмент для фронтенду)

// loadEnv - читає .env.development змінні
// defineConfig — helper для типізації і автокомпліту
import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
// vue() — підключає Vue підтримку
import vue from '@vitejs/plugin-vue'
// fileURLToPath + URL - конвертація import.meta.url у нормальний файловий
import { fileURLToPath, URL } from 'node:url'

// Перетворює шлях ./src у абсолютний шлях системи (використовується в шляхах імпортів)
const SRC_PATH = fileURLToPath(new URL('./src', import.meta.url))

// Дефолтний URL для бекенду
const DEFAULT_BACKEND_URL = 'http://127.0.0.1:8002'

// Функція перевірки валідності Backend URL (URL з .env.development або default)
function getBackendTarget(rawUrl?: string): string {
    // Береться URL з .env.development, якщо немає — дефолт
    const value = rawUrl?.trim() || DEFAULT_BACKEND_URL
    try {
        // Перевіряється валідність URL
        return new URL(value).toString()
    } catch {
        // Якщо URL кривий — fallback та warning в console
        console.warn(`Invalid VITE_BACKEND_URL: "${value}". Fallback to default: ${DEFAULT_BACKEND_URL}`)
        return DEFAULT_BACKEND_URL
    }
}

// Функція, яка повертає конфіг Vite
    // mode = dev / production / test (дозволяє міняти конфіг залежно від середовища)
export default defineConfig(({ mode }: ConfigEnv) => {
    // Завантажує змінні з .env.development (тільки ті, що починаються з VITE_)
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    // Backend URL логіка (URL з .env.development або default)
    const backendTarget = getBackendTarget(env.VITE_BACKEND_URL)
    // Proxy конфіг для перенаправлення запитів з фронта на бекенд
    const proxyConfig = {
        '/api': { target: backendTarget, changeOrigin: true },
        '/media': { target: backendTarget, changeOrigin: true },
    }

    return {
        // Додає підтримку Vue SFC (.vue файлів)
        plugins: [vue()],
        // Додає короткі імпорти (@/.../template.ts)
        resolve: {
            alias: {
                '@': SRC_PATH,
            },
        },
        // Конфігурація взаємодії з сервером
        server: {
            port: 5173, // порт dev сервера
            strictPort: true, // не шукати інший порт якщо зайнятий
            proxy: proxyConfig // проксі на бекенд
        },
        // вимикає sourcemaps у production
        // sourcemaps - це “карта відповідності” між: оригінальним кодом (TS / Vue / сучасний JS) і збілдженим кодом (мінімізований JS)
        build: {
            sourcemap: false,
        },
    }
})