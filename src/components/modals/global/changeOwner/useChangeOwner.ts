// .src/components/modals/global/changeOwner/useChangeOwner.ts

import { ref, computed } from "vue"
import api from "@/api"
import axios from "axios"
import { normalizeApiError, type NormalizedErrors } from "@/lib/errorsUtils"
import {
    ChangeOwnerRegistry,
    type ChangeOwnerKey,
} from "@/components/modals/global/changeOwner/changeOwnerRegistry"

export type EmployeeOption = {
    Id: number
    FullName: string
}

export function useChangeOwner<TItem extends { id: number | string; created_by: number }>(
    type: ChangeOwnerKey,
    item: TItem,
    emit: {
        (e: "close"): void
        (e: "updated", value: TItem): void
    },
) {
    const registryItem = ChangeOwnerRegistry[type]
    const isSubmitting = ref(false)
    const errors = ref<NormalizedErrors>({ nonField: [], fields: {} })
    const selectedEmployeeId = ref<number | null>(item.created_by ?? null)
    const isDirty = computed(() => selectedEmployeeId.value !== item.created_by)
    async function submit() {
        if (selectedEmployeeId.value == null) {
            errors.value = {
                nonField: [],
                fields: {
                    created_by: ["Оберіть працівника"],
                },
            }
            return
        }

        isSubmitting.value = true
        errors.value = { nonField: [], fields: {} }
        try {
            const { data } = await api.patch(registryItem.url(item.id), {
                created_by: selectedEmployeeId.value,
            })
            const updated = {
                ...item,
                ...data,
                created_by: data.created_by ?? selectedEmployeeId.value,
            }
            emit("updated", updated)
            emit("close")
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                errors.value = normalizeApiError(err)
            } else {
                errors.value = {
                    nonField: ["Помилка зміни відповідального"],
                    fields: {},
                }
            }
        } finally {
            isSubmitting.value = false
        }
    }
    function close() {
        emit("close")
    }

    return {
        registryItem,
        selectedEmployeeId,
        isSubmitting,
        errors,
        isDirty,
        submit,
        close,
    }
}