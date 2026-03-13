// .src/stores/useNaturalPerson.ts

// IMPORT TOOLS
import { defineStore } from "pinia"
import { ref } from "vue"
import { api } from "@/api"

// IMPORT SCHEMAS AND TYPES
import {NaturalPersonFullGetSchema } from "@/model_schemas/dto/person/natural_person.dto";
import { mapNaturalPersonFullGet } from "@/model_schemas/mapped/person/natural_person.mapped";
import type {NaturalPersonFullGet } from "@/model_schemas/models/person/natural_person.model"

// DEFINE STORE
export const useNaturalPersonFullGetStore = defineStore("naturalPersonFullGet", () => {
    // STATE
    const NaturalPerson = ref<NaturalPersonFullGet | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // ACTIONS
    async function fetchNaturalPersonFullGet(id: number): Promise<NaturalPersonFullGet | null> {
        isLoading.value = true
        error.value = null

        try {
            const {data} = await api.get(`person/natural_person/${id}/`)
            const dto = NaturalPersonFullGetSchema.parse(data)
            const mapped = mapNaturalPersonFullGet(dto)
            NaturalPerson.value = mapped
            return mapped

        } catch (err) {
            error.value = 'Помилка завантаження даних фізичної особи.'
            console.error(err)
            NaturalPerson.value = null
            return null
        } finally {
            isLoading.value = false}
    }

    function clear() {
        NaturalPerson.value = null
        error.value = null
    }

    return {
        NaturalPerson,
        isLoading,
        error,
        fetchNaturalPersonFullGet,
        clear
    }
})