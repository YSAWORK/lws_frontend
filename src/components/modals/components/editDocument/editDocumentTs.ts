// .src/components/modals/components/editDocument/editDocumentTs.ts

/// IMPORT TOOLS
import { ref } from "vue"
import api from "@/api"
import { normalizeApiError, type NormalizedErrors } from "@/lib/errorsUtils"
import { DocumentUpdateSchema, type DocumentUpdateDTO } from "@/model_schemas/dto/components/document.dto"

export function useEditDocumentModal(
    document: DocumentUpdateDTO,
    emit: {
        (e: "close"): void
        (e: "created"): void
    },
) {
    const isSubmitting = ref(false)
    const errors = ref<NormalizedErrors>({ nonField: [], fields: {} })

    const form = ref<DocumentUpdateDTO>({
        id: document.id,
        name: document.name,
        extension: document.extension,
        mime: document.mime,
        date: document.date,
        size: document.size,
        file: document.file,
        notes: document.notes,
        is_personal: document.is_personal,
        existing_file_url: document.existing_file_url,
    })

    async function submit() {
        try {
            errors.value = { nonField: [], fields: {} }
            isSubmitting.value = true
            const payload = DocumentUpdateSchema.parse(form.value)
            const formData = new FormData()
            formData.append("name", payload.name)
            if (payload.extension !== null) {
                formData.append("extension", payload.extension)
            }
            formData.append("is_personal", String(payload.is_personal))
            if (payload.date !== null) {
                formData.append("date", payload.date)
            }
            if (payload.notes !== null) {
                formData.append("notes", payload.notes)
            }
            if (payload.file instanceof File) {
                formData.append("file", payload.file)
            }
            await api.patch(`/components/document/${payload.id}/`, formData)
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