/* .src/components/templates/employees/CurrentUserProfile/CurrentUserProfile.ts */


// IMPORT TOOLS
import { ref } from 'vue'
import { api } from '@/api'

// SCHEMA
export interface Profile {
    id: number
    first_name?: string
    last_name?: string
    email?: string
    role?: string
    avatar?: string
    [key: string]: unknown
}

export function useCurrentUser() {
    const me = ref<Profile | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchMe = async () => {
        loading.value = true
        error.value = null
        try {
            // шляхи: припускаю /api/v1/profile/me/ (підстав свій префікс)
            const { data } = await api.get('/v1/profile/me/')
            // GET повертає чистий профіль, а POST повертає {"profile": {...}}
            me.value = (data?.profile ?? data) as Profile
        } catch (e: any) {
            error.value = e?.response?.data?.detail || e?.message || 'Помилка завантаження профілю'
        } finally {
            loading.value = false
        }
    }

    return { me, loading, error, fetchMe }
}