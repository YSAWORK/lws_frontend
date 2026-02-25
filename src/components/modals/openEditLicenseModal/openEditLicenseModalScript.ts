// src/components/modals/openEditLicenseModal/openEditLicenseModalScript.ts
import { computed, ref } from "vue"
import api from "@/api"
import { useResourceFileUpload } from "@/lib/uploadFile"
import type {
    LicensePayload,
    LicenseFieldMap,
    CommissionOption,
} from "@/components/modals/openEditLicenseModal/openEditLicenseModalTs"

function toIsoDateOrNull(v: string): string | null {
    const s = v?.trim()
    if (!s) return null
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null
}

function trimOrNull(v: string): string | null {
    const s = v?.trim()
    return s ? s : null
}

export function useEditLicenseModal(
    props: {
        employeeId: number
        current: LicensePayload
        fieldMap: LicenseFieldMap
        commissionOptions: CommissionOption[]
    },
    emit: {
        (e: "close"): void
        (e: "saved"): void
    },
) {
    const isSubmitting = ref(false)
    const error = ref<string | null>(null)

    // refs (internal)
    const NumberRef = ref<string>(props.current.Number ?? "")
    const DateRef = ref<string>(props.current.Date?.slice(0, 10) ?? "")
    const CommissionRef = ref<string>(props.current.Commission ?? "")
    const pickedFileRef = ref<File | null>(null)

    // ✅ computed models for template (no .value needed)
    const Number = computed<string>({
        get: () => NumberRef.value,
        set: (v) => (NumberRef.value = v),
    })

    const Date = computed<string>({
        get: () => DateRef.value,
        set: (v) => (DateRef.value = v),
    })

    const Commission = computed<string>({
        get: () => CommissionRef.value,
        set: (v) => (CommissionRef.value = v),
    })

    const pickedFile = computed<File | null>({
        get: () => pickedFileRef.value,
        set: (v) => (pickedFileRef.value = v),
    })

    const pickedFileName = computed(() => pickedFileRef.value?.name ?? null)

    const commissionOptionsLocal = computed<CommissionOption[]>(
        () => props.commissionOptions ?? [],
    )

    const existingFileLabel = computed(() =>
        props.current.File ? "Файл вже завантажено" : "Файл відсутній",
    )

    const isDirty = computed(() => {
        const curNum = props.current.Number ?? ""
        const curDate = props.current.Date?.slice(0, 10) ?? ""
        const curComm = props.current.Commission ?? ""

        return (
            NumberRef.value !== curNum ||
            DateRef.value !== curDate ||
            CommissionRef.value !== curComm ||
            pickedFileRef.value !== null
        )
    })

    const canSubmit = computed(() => !isSubmitting.value && isDirty.value)

    const close = () => emit("close")

    function onPickFile(file: File | null) {
        pickedFileRef.value = file
    }

    function buildPatchPayload(): Record<string, string | null> {
        return {
            [props.fieldMap.number]: trimOrNull(NumberRef.value),
            [props.fieldMap.date]: toIsoDateOrNull(DateRef.value),
            [props.fieldMap.commission]: trimOrNull(CommissionRef.value),
        }
    }

    async function save() {
        if (!canSubmit.value) return
        isSubmitting.value = true
        error.value = null

        try {
            const payload = buildPatchPayload()
            await api.patch(`/person/employees/${props.employeeId}/`, payload)

            if (pickedFileRef.value) {
                const { upload } = useResourceFileUpload((id) => `/person/employees/${id}/`)
                await upload(props.employeeId, props.fieldMap.file, pickedFileRef.value)
            }

            emit("saved")
        } catch (e: any) {
            error.value =
                e?.response?.data?.detail ||
                e?.message ||
                "Не вдалося зберегти дані свідоцтва"
        } finally {
            isSubmitting.value = false
        }
    }

    return {
        // state
        isSubmitting, // still ref, but safe in template
        error,

        // template models
        Number,
        Date,
        Commission,
        commissionOptionsLocal,

        // file
        pickedFile,
        pickedFileName,
        existingFileLabel,
        onPickFile,

        // ui
        canSubmit,
        close,
        save,
    }
}