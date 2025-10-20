// src/components/templates/auth/LoginView/LoginView.ts

// IMPORT TOOLS
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'

export function LoginView() {
    const router = useRouter()

    // --- login form state ---
    const username = ref('')
    const password = ref('')
    const loginLoading = ref(false)
    const loginError = ref<string | null>(null)
    const loginSucceeded = ref<string | null>(null)

    // --- safecode form state ---
    const safe_code = ref('')
    const safeLoading = ref(false)
    const safeError = ref<string | null>(null)

    // --- countdown ---
    const countdownActive = ref(false)
    const remainingMs = ref(0)
    let intervalId: ReturnType<typeof setInterval> | null = null
    let deadline = 0

    // --- countdown computed ---
    const remainingSec = computed(() => Math.max(0, Math.ceil(remainingMs.value / 1000)))
    const mmss = computed(() => {
        const m = Math.floor(remainingSec.value / 60).toString().padStart(2, '0')
        const s = (remainingSec.value % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    })

    // --- countdown methods ---
    // update remaining time
    function tick() {
        const ms = deadline - Date.now()
        remainingMs.value = ms
        if (ms <= 0) stopCountdown()
    }

    // start countdown
    function startCountdown(durationMs: number) {
        deadline = Date.now() + durationMs
        remainingMs.value = durationMs
        countdownActive.value = true
        if (intervalId) clearInterval(intervalId)
        intervalId = setInterval(tick, 250)
    }

    // stop countdown
    function stopCountdown() {
        if (intervalId) { clearInterval(intervalId); intervalId = null }
        countdownActive.value = false
        remainingMs.value = 0
    }
    onUnmounted(() => stopCountdown())

    // --- form methods ---
    // submit login form
    async function onLoginSubmit() {
        if (countdownActive.value) return
        loginError.value = null
        loginLoading.value = true
        try {
            const { data } = await api.post('/api/auth/login/', {
                username: username.value,
                password: password.value,
            })
            loginSucceeded.value = data?.detail
            const timeoutSec = Number(data?.timeout)
            const durationMs = Number.isFinite(timeoutSec) && timeoutSec > 0
                ? timeoutSec * 1000
                : 5 * 60 * 1000
            startCountdown(durationMs)
        } catch (e: any) {
            loginError.value = e?.response?.data?.detail || 'Помилка авторизації'
        } finally {
            loginLoading.value = false
        }
    }

    // submit safecode form
    async function onSafeSubmit() {
        safeError.value = null
        safeLoading.value = true
        try {
            const { data } = await api.post('/api/auth/safe_code/', {
                username: username.value,
                safe_code: safe_code.value,
            })
            if (data?.access) localStorage.setItem('access', data.access)
            if (data?.refresh) localStorage.setItem('refresh', data.refresh)

            const q = router.currentRoute.value.query
            const nextParam = typeof q.next === 'string' && q.next ? q.next : null
            router.replace(nextParam || { name: 'Home' })
        } catch (e: any) {
            safeError.value = e?.response?.data?.detail || 'Помилка введення коду доступу'
        } finally {
            safeLoading.value = false
        }
    }

    return {
        // STATE
        username,
        password,
        loginLoading,
        loginError,
        loginSucceeded,
        safe_code,
        safeLoading,
        safeError,
        countdownActive,
        remainingMs,
        remainingSec,
        mmss,
        // METHODS
        onLoginSubmit,
        onSafeSubmit,
    }
}
