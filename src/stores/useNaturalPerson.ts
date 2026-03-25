// .src/stores/useNaturalPerson.ts

import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { api } from "@/api"
import {
    NaturalPersonFullGetSchema,
    type NaturalPersonFullGetDTO,
} from "@/model_schemas/dto/person/natural_person.dto"

import { mapNaturalPersonFullGet } from "@/model_schemas/mapped/person/natural_person.mapped"
import type { NaturalPersonFullGet } from "@/model_schemas/models/person/natural_person.model"

export const useNaturalPersonFullGetStore = defineStore("naturalPersonFullGet", () => {
    // STATE
    const naturalPersonDto = ref<NaturalPersonFullGetDTO | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // DERIVED UI MODEL
    const naturalPerson = computed<NaturalPersonFullGet | null>(() => {
        if (!naturalPersonDto.value) return null
        return mapNaturalPersonFullGet(naturalPersonDto.value)
    })

    // ACTIONS
    async function fetchNaturalPersonFullGet(id: number): Promise<NaturalPersonFullGetDTO | null> {
        isLoading.value = true
        error.value = null

        try {
            const { data } = await api.get(`person/natural_person/${id}/`)
            const dto = NaturalPersonFullGetSchema.parse(data)
            naturalPersonDto.value = dto
            return dto
        } catch (err) {
            error.value = "Помилка завантаження даних фізичної особи."
            console.error(err)
            naturalPersonDto.value = null
            return null
        } finally {
            isLoading.value = false
        }
    }

    function clear() {
        naturalPersonDto.value = null
        error.value = null
    }

    return {
        naturalPersonDto,
        naturalPerson,
        isLoading,
        error,
        fetchNaturalPersonFullGet,
        clear,
    }
})