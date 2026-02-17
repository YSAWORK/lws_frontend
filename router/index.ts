import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import authRoutes from './auth'
import teamRoutes from "./team";
import componentRoutes from "./components";


const baseRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/components/templates/team/TeamList.vue'),
        meta: { requiresAuth: true },
    },
]

const routes: RouteRecordRaw[] = [
    ...baseRoutes,
    ...authRoutes,
    ...teamRoutes,
    ...componentRoutes,
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to) => {
    const isAuthed = !!localStorage.getItem('access')

    if (to.meta?.requiresAuth && !isAuthed) {
        if (to.name === 'Login') return true
        return { name: 'Login', query: { redirect: to.fullPath } }
    }

    if (to.meta?.guestOnly && isAuthed) {
        if (to.name === 'Home') return true
        return { name: 'Home' }
    }

    return true
})

export default router
