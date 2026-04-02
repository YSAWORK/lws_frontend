// src/api/private.ts

import axios, {
    AxiosError,
    AxiosHeaders,
    InternalAxiosRequestConfig,
} from "axios"
import { useAuthStore } from "@/stores/auth"
import { pinia } from "@/main"

type RetryableAxiosRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean
}

type RefreshResponse = {
    access: string
}

const privateApi = axios.create({
    baseURL: "/api",
    timeout: 15000,
})

function applyAuthHeaders(
    config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
    const auth = useAuthStore(pinia)

    config.headers = AxiosHeaders.from(config.headers)

    if (auth.access) {
        config.headers.set("Authorization", `Bearer ${auth.access}`)
    } else {
        config.headers.delete("Authorization")
    }

    if (auth.employeeId != null) {
        config.headers.set("X-Employee-Id", String(auth.employeeId))
    } else {
        config.headers.delete("X-Employee-Id")
    }

    return config
}

let refreshTokenPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
    const auth = useAuthStore(pinia)

    if (!auth.refresh) {
        auth.logout()
        throw new Error("No refresh token available")
    }

    const { data } = await axios.post<RefreshResponse>("/api/token/refresh/", {
        refresh: auth.refresh,
    })

    if (!data?.access || typeof data.access !== "string") {
        auth.logout()
        throw new Error("Invalid refresh response")
    }

    auth.setAccess(data.access)
    return data.access
}

privateApi.interceptors.request.use((config) => {
    return applyAuthHeaders(config)
})

privateApi.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (!error.config) {
            return Promise.reject(error)
        }

        const original = error.config as RetryableAxiosRequestConfig
        const auth = useAuthStore(pinia)

        if (error.response?.status !== 401) {
            return Promise.reject(error)
        }

        if (original._retry) {
            return Promise.reject(error)
        }

        if (original.url?.includes("/token/refresh/")) {
            auth.logout()
            return Promise.reject(error)
        }

        if (!auth.refresh) {
            auth.logout()
            return Promise.reject(error)
        }

        original._retry = true

        try {
            // All parallel 401 requests wait for the same refresh promise.
            if (!refreshTokenPromise) {
                refreshTokenPromise = refreshAccessToken().finally(() => {
                    refreshTokenPromise = null
                })
            }

            const newAccess = await refreshTokenPromise

            original.headers = AxiosHeaders.from(original.headers)
            original.headers.set("Authorization", `Bearer ${newAccess}`)

            return privateApi(original)
        } catch (refreshError) {
            auth.logout()
            return Promise.reject(refreshError)
        }
    }
)

export default privateApi