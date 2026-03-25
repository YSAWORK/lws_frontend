// .src/components/modals/person/editNaturalPersonalInfo/editNaturalPersonalInfoTs.ts

/// IMPORT TOOLS
import { ref } from "vue"
import api from "@/api"
import axios from "axios"
import { normalizeApiError, type NormalizedErrors } from "@/lib/errorsUtils"
import {
    NaturalPersonEditSchema,
    type NaturalPersonEditDTO,
} from "@/model_schemas/dto/person/natural_person.dto"


export function useEditNaturalPersonInfoModal(
    personInfo: NaturalPersonEditDTO,
    emit: {
        (e: "close"): void
        (e: "created"): void
    },
) {
    const isSubmitting = ref(false)
    const errors = ref<NormalizedErrors>({ nonField: [], fields: {} })
    const initialForm = { ...personInfo }
    const form = ref<NaturalPersonEditDTO>({
        ...initialForm,
        avatar_file: null,
    })

    async function submit() {
        try {
            errors.value = { nonField: [], fields: {} }
            isSubmitting.value = true

            // Validate only serializable/text fields
            const validated = NaturalPersonEditSchema.parse({
                id: form.value.id,
                first_name: form.value.first_name,
                last_name: form.value.last_name,
                surname: form.value.surname,
                register_id: form.value.register_id,
                date_birth: form.value.date_birth,
                passport: form.value.passport,
                avatar: form.value.avatar,
            })

            const data = new FormData()

            data.append("first_name", validated.first_name ?? "")
            data.append("last_name", validated.last_name ?? "")
            data.append("surname", validated.surname ?? "")
            data.append("register_id", validated.register_id ?? "")
            data.append("date_birth", validated.date_birth ?? "")
            data.append("passport", validated.passport ?? "")
            if (form.value.avatar_file instanceof File) {
                data.append("avatar", form.value.avatar_file)
            }

            await api.patch(`person/natural_person/${form.value.id}/`, data)

            emit("created")
            emit("close")
        } catch (e: unknown) {
            console.log("RAW error:", e)

            if (axios.isAxiosError(e)) {
                console.log("AXIOS status:", e.response?.status)
                console.log("AXIOS data:", e.response?.data)
                console.log("AXIOS headers:", e.response?.headers)
            } else {
                console.log("NON-axios error:", e)
            }

            errors.value = normalizeApiError(e)
        } finally {
            isSubmitting.value = false
        }
    }

    function resetForm() {
        form.value = structuredClone(initialForm)
    }

    return { form, submit, resetForm, isSubmitting, errors }
}