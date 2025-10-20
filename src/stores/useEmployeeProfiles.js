import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useProfilesStore = defineStore('profiles', () => {
    const profiles = ref([])
    const sortField = ref('full_name')
    const sortDirection = ref('asc')
    const loading = ref(false)
    const lastFetched = ref(null)

    async function fetchProfiles(force = false) {
        if (!force && profiles.value.length > 0) return

        loading.value = true
        try {
            const response = await axios.get('/api/profiles/')
            profiles.value = response.data.results || response.data
            lastFetched.value = new Date()
        } finally {
            loading.value = false
        }
    }

    return {
        profiles,
        loading,
        sortField,
        sortDirection,
        fetchProfiles,
    }
})