// .src/router/person.ts

// Import necessary components
import type { RouteRecordRaw } from 'vue-router'

const personRoutes: RouteRecordRaw[] = [
    {
        path: '/natural_person/:id',
        name: 'NaturalPersonProfile',
        component: () => import('@/components/templates/person/NaturalPersonProfile.vue'),
        meta: { requiresAuth: true },
    },
]
export default personRoutes

