// src/views/useHomeView.ts
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '@/api'

type Profile = Record<string, unknown>

export function BaseView(idFromProp?: string | number) {
    const router = useRouter()
    const route = useRoute()

    const loading = ref(false)
    const error = ref<string | null>(null)
    const profile = ref<Profile | null>(null)

    async function fetchProfile(id?: string | number) {
        try {
            loading.value = true
            error.value = null
            const pid = id ?? idFromProp ?? (route.params.id as string | number)
            if (pid == null) throw new Error('ID не задано')
            const { data } = await api.get(`/api/profiles/${pid}/`)
            profile.value = data
        } catch (e: any) {
            error.value = e?.response?.data?.detail || 'Помилка при завантаженні профілю'
        } finally {
            loading.value = false
        }
    }

    function localCleanupAndRedirect(msg?: string) {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        if (msg) error.value = msg
        const back = route.fullPath !== '/login' ? route.fullPath : undefined
        router.push({ name: 'Login', query: back ? { redirect: back } : undefined })
    }

    async function onLogout() {
        error.value = null
        loading.value = true
        const refresh = localStorage.getItem('refresh')
        if (!refresh) {
            localCleanupAndRedirect()
            return
        }
        try {
            await api.post('/api/auth/logout/', { refresh })
            localCleanupAndRedirect()
        } catch (e: any) {
            localCleanupAndRedirect(e?.response?.data?.detail || 'Сесію завершено')
        } finally {
            loading.value = false
        }
    }

    onMounted(() => fetchProfile())

    return {
        // state
        loading, error, profile,
        // actions
        fetchProfile, onLogout,
    }
}
