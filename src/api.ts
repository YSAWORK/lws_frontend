/* .src/api.ts */

/* IMPORTS */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import router from '../router'

export const api = axios.create({
    baseURL: '/',
    withCredentials: false,
})


api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const access = localStorage.getItem('access')
    if (access) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${access}`
    }
    return config
})

let isRefreshing = false
let waiters: Array<(t: string | null) => void> = []
const notifyAll = (t: string | null) => { waiters.forEach(cb => cb(t)); waiters = [] }

api.interceptors.response.use(
    (r) => r,
    async (error: AxiosError) => {
        const original: any = error.config
        if (error.response?.status === 401 && !original?._retry) {
            original._retry = true

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    waiters.push((newToken) => {
                        if (!newToken) return reject(error)
                        original.headers.Authorization = `Bearer ${newToken}`
                        resolve(api(original))
                    })
                })
            }

            isRefreshing = true
            try {
                const refresh = localStorage.getItem('refresh')
                if (!refresh) throw new Error('No refresh token')
                const { data } = await axios.post('/api/auth/token/refresh/', { refresh })
                const access = (data as any).access as string
                localStorage.setItem('access', access)
                isRefreshing = false
                notifyAll(access)
                original.headers.Authorization = `Bearer ${access}`
                return api(original)
            } catch (e) {
                isRefreshing = false
                notifyAll(null)
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                if (router.currentRoute.value.name !== 'Login') {
                    router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } })
                }
                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    }
)
