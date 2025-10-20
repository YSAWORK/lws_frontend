// .src/router/employees.ts
// Description: Employee related routes

// Import necessary components
// Define employee routes
import type { RouteRecordRaw } from 'vue-router'

const employeesRoutes: RouteRecordRaw[] = [
    {
        path: '/profile/me',
        name: 'CurrentUserProfile',
        component: () => import('@/components/templates/employees/CurrentUserProfile/CurrentUserProfile.vue'),
        meta: { requiresAuth: true },
    },
    ]
export default employeesRoutes
