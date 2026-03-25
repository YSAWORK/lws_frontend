// src/stores/auth.ts
import { defineStore } from "pinia"

type AuthState = {
    access: string | null
    refresh: string | null
    employeeId: number | null
    IsAdmin: boolean | null
}

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        access: null,
        refresh: null,
        employeeId: null,
        IsAdmin: null,
    }),

    actions: {
        initFromStorage() {
            const access = localStorage.getItem("access")
            const refresh = localStorage.getItem("refresh")
            const employeeId = localStorage.getItem("employee_id")
            const IsAdmin = localStorage.getItem("is_administrator")

            this.access = access
            this.refresh = refresh
            this.employeeId = employeeId ? Number(employeeId) : null
            this.IsAdmin = !!IsAdmin
        },

        setAuth(data: { access: string; refresh?: string | null; employee_id: number | null; is_administrator: boolean | null }) {
            this.access = data.access
            this.employeeId = data.employee_id
            this.IsAdmin = data.is_administrator

            localStorage.setItem("access", data.access)

            if (data.refresh !== undefined) {
                this.refresh = data.refresh
                if (data.refresh != null) localStorage.setItem("refresh", data.refresh)
                else localStorage.removeItem("refresh")
            }

            if (data.employee_id != null) {
                localStorage.setItem("employee_id", String(data.employee_id))
            } else {
                localStorage.removeItem("employee_id")
            }
        },

        setAccess(access: string) {
            this.access = access
            localStorage.setItem("access", access)
        },

        logout() {
            this.access = null
            this.refresh = null
            this.employeeId = null

            localStorage.removeItem("access")
            localStorage.removeItem("refresh")
            localStorage.removeItem("employee_id")
        }
    },
})
