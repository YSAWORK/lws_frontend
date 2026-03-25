// .src/components/modals/components/createPhone/createPhoneTs.ts

/// IMPORT TOOLS
import { ref } from "vue"
import api from "@/api"
import { normalizeApiError, type NormalizedErrors } from "@/lib/errorsUtils"
import { PhoneCreateSchema, type PhoneCreateFormDTO, } from "@/model_schemas/dto/components/phone.dto"
import type { OwnerDTO } from "@/model_schemas/dto/person/owner.dto"

export function useCreatePhoneModal(
    owner: OwnerDTO,
    emit: {
        (e: "close"): void
        (e: "created"): void
    },
) {
    const isSubmitting = ref(false)
    const errors = ref<NormalizedErrors>({nonField: [], fields: {}})

    const form = ref<PhoneCreateFormDTO>({
        phone_number: "",
        is_personal: false,
        notes: null,
        is_blocked: false,
        owner,
    })

    async function submit() {
        try {
            errors.value = {nonField: [], fields: {}}
            isSubmitting.value = true

            const payload = PhoneCreateSchema.parse(form.value) // може кинути ZodError
            await api.post("/components/phones/create/", payload) // може кинути AxiosError

            emit("created")
            emit("close")
        } catch (e) {
            errors.value = normalizeApiError(e)
        } finally {
            isSubmitting.value = false
        }
    }

    return {form, submit, isSubmitting, errors}
}