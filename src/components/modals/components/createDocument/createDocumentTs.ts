// .src/components/modals/components/createDocument/createDocumentTs.ts

/// IMPORT TOOLS
import { ref } from "vue"
import api from "@/api"
import { normalizeApiError, type NormalizedErrors } from "@/lib/errorsUtils"
import { DocumentCreateSchema, type DocumentCreateDTO } from "@/model_schemas/dto/components/document.dto"
import type { OwnerDTO } from "@/model_schemas/dto/person/owner.dto"

export function useCreateDocumentModal(
    owner: OwnerDTO,
    emit: {
        (e: "close"): void
        (e: "created"): void
    },
) {
    const isSubmitting = ref(false)
    const errors = ref<NormalizedErrors>({ nonField: [], fields: {} })

    const form = ref<DocumentCreateDTO>({
        name: "",
        extension: "",
        date: null,
        file: null,
        is_personal: false,
        notes: null,
        owner,
    })

    async function submit() {
        try {
            errors.value = { nonField: [], fields: {} }
            isSubmitting.value = true
            const payload = DocumentCreateSchema.parse(form.value)
            const formData = new FormData()
            formData.append("name", payload.name)
            formData.append("extension", payload.extension)
            formData.append("is_personal", String(payload.is_personal))
            if (payload.date) {formData.append("date", payload.date)}
            if (payload.notes) {formData.append("notes", payload.notes)}
            if (payload.file) {formData.append("file", payload.file)}
            formData.append("owner_id", String(payload.owner.id))
            formData.append("owner_key", payload.owner.key)
            await api.post("/components/documents/create/", formData)
            emit("created")
            emit("close")
        } catch (e: unknown) {
            errors.value = normalizeApiError(e)
        } finally {
            isSubmitting.value = false
        }
    }
    return {
        form,
        submit,
        isSubmitting,
        errors,
    }
}