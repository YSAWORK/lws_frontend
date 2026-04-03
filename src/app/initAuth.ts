// src/app/initAuth.ts

import type { Pinia } from "pinia"
import { useAuthStore } from "@/stores/auth"
import { authApi } from "@/api/auth"

export async function initAuth(pinia: Pinia): Promise<void> {
    const authStore = useAuthStore(pinia)

    try {
        authStore.loadFromStorage()

        if (!authStore.access && !authStore.refresh) {
            authStore.logout()
            return
        }

        if (!authStore.access && authStore.refresh) {
            const refreshed = await authApi.refresh(authStore.refresh)
            authStore.setTokens({
                access: refreshed.access,
            })
        }

        try {
            const me = await authApi.me(authStore.access as string)
            authStore.setUser(me)
            authStore.isAuthenticated = true
        } catch {
            if (!authStore.refresh) {
                throw new Error("No refresh token for recovery")
            }

            const refreshed = await authApi.refresh(authStore.refresh)
            authStore.setTokens({
                access: refreshed.access,
            })

            const me = await authApi.me(refreshed.access)
            authStore.setUser(me)
            authStore.isAuthenticated = true
        }
    } catch (error) {
        console.error("Failed to initialize auth:", error)
        authStore.logout()
    } finally {
        authStore.markAuthReady()
    }
}