// ./router/auth.ts
// Description: Authentication related routes

// Import necessary components
// Define authentication routes
import type { RouteRecordRaw } from 'vue-router'

const authRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/components/templates/auth/LoginView/LoginView.vue'),
        meta: { guestOnly: true, layout: 'auth' },
    },
    ]
export default authRoutes