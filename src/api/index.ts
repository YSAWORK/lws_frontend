// src/api/index.ts
import axios, { type InternalAxiosRequestConfig } from "axios"
import { useAuthStore } from "@/stores/auth"
import pinia from "@/app/getPinia"
import { createLogger } from "@/logging/createLogger"

const logger = createLogger()

// --- types ---
interface RetryConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

// --- axios instance ---
const api = axios.create({
    baseURL: "/api",
    timeout: 10000,
})

// --- request interceptor ---
api.interceptors.request.use((config) => {
    const auth = useAuthStore(pinia)

    config.headers = config.headers ?? {}

    if (auth.access) {
        config.headers.Authorization = `Bearer ${auth.access}`
    }

    if (auth.employeeId != null) {
        config.headers["X-Employee-Id"] = String(auth.employeeId)
    }

    return config
})

// --- refresh mutex ---
let refreshPromise: Promise<string> | null = null

async function refreshToken(auth: ReturnType<typeof useAuthStore>): Promise<string> {
    const { data } = await axios.post("/api/token/refresh/", {
        refresh: auth.refresh,
    })

    auth.setAccess(data.access)
    return data.access as string
}

async function getFreshToken(auth: ReturnType<typeof useAuthStore>): Promise<string> {
    if (!refreshPromise) {
        refreshPromise = refreshToken(auth).finally(() => {
            refreshPromise = null
        })
    }
    return refreshPromise
}

// --- response interceptor ---
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config as RetryConfig | undefined
        const auth = useAuthStore(pinia)

        // --- логування ВСІХ помилок ---
        logger.error("api_request_failed", {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            responseData: error.response?.data,
        })

        // --- якщо нема config — нічого не робимо ---
        if (!original) {
            return Promise.reject(error)
        }

        // --- якщо вже був retry → logout ---
        if (original._retry) {
            auth.logout()
            return Promise.reject(error)
        }

        // --- тільки для 401 ---
        if (error.response?.status === 401) {
            original._retry = true

            if (!auth.refresh) {
                auth.logout()
                return Promise.reject(error)
            }

            try {
                const newAccess = await getFreshToken(auth)

                original.headers = original.headers ?? {}
                original.headers.Authorization = `Bearer ${newAccess}`

                return api(original)
            } catch (refreshError) {
                auth.logout()

                logger.error("token_refresh_failed", {
                    reason: refreshError,
                })

                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    },
)

export default api