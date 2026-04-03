// .src/router/team.ts

// Import necessary components
import type { RouteRecordRaw } from 'vue-router'

const teamRoutes: RouteRecordRaw[] = [
    {
        path: '/team',
        name: 'TeamList',
        component: () => import('@/components/templates/team/TeamList.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/team/:id',
        name: 'EmployeeProfile',
        component: () => import('@/components/templates/team/EmployeeProfile.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/me',
        name: 'MyProfile',
        component: () => import('@/components/templates/team/MyProfile.vue'),
        meta: { requiresAuth: true },
    },
    ]
export default teamRoutes

