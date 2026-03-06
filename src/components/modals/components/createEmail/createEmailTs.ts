// .src/components/modals/components/createEmail/createEmailTs.ts

/// IMPORT TOOLS
import { ref } from "vue"
import api from "@/api"
import { normalizeApiError, type NormalizedErrors } from "@/lib/errorsUtils"
import { EmailCreateSchema, type EmailCreateDTO, } from "@/model_schemas/dto/components/email.dto"
import type { OwnerDTO } from "@/model_schemas/dto/person/owner.dto"


export function useCreateEmailModal(
    owner: OwnerDTO,
    emit: {
        (e: "close"): void
        (e: "created"): void
    },
) {
    const isSubmitting = ref(false)
    const errors = ref<NormalizedErrors>({nonField: [], fields: {}})

    const form = ref<EmailCreateDTO>({
        email: "",
        is_personal: false,
        notes: null,
        owner,
    })

    async function submit() {
        try {
            errors.value = {nonField: [], fields: {}}
            isSubmitting.value = true

            const payload = EmailCreateSchema.parse(form.value) // може кинути ZodError
            await api.post("/components/emails/create/", payload) // може кинути AxiosError

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