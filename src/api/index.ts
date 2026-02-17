// src/api/index.ts
import axios from "axios"
import { useAuthStore } from "@/stores/auth"
import { pinia } from "@/main"

const api = axios.create({ baseURL: "/api" })

api.interceptors.request.use((config) => {
    const auth = useAuthStore(pinia)

    config.headers = config.headers ?? {}

    if (auth.access) config.headers.Authorization = `Bearer ${auth.access}`
    if (auth.employeeId != null) config.headers["X-Employee-Id"] = String(auth.employeeId)

    return config
})

let refreshing: Promise<string> | null = null

api.interceptors.response.use(
    (r) => r,
    async (error) => {
        const original = error.config
        if (error.response?.status === 401 && !original?._retry) {
            original._retry = true

            const auth = useAuthStore(pinia)
            if (!auth.refresh) {
                auth.logout()
                return Promise.reject(error)
            }

            if (!refreshing) {
                refreshing = axios
                    .post("/api/token/refresh/", { refresh: auth.refresh })
                    .then(({ data }) => {
                        auth.setAccess(data.access)
                        return data.access as string
                    })
                    .finally(() => (refreshing = null))
            }

            const newAccess = await refreshing
            original.headers = original.headers ?? {}
            original.headers.Authorization = `Bearer ${newAccess}`

            return api(original)
        }

        return Promise.reject(error)
    }
)

export default api
