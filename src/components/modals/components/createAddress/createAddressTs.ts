// .src/components/modals/components/createAddress/createAddressTs.ts

/// IMPORT TOOLS
import { ref } from "vue"
import api from "@/api"
import axios from "axios"
import { normalizeApiError, type NormalizedErrors } from "@/lib/errorsUtils"
import { AddressCreateSchema, type AddressCreateDTO, } from "@/model_schemas/dto/components/address.dto"
import type { OwnerDTO } from "@/model_schemas/dto/person/owner.dto"


export function useCreateAddressModal(
    owner: OwnerDTO,
    emit: {
        (e: "close"): void
        (e: "created"): void
    },
) {
    const isSubmitting = ref(false)
    const errors = ref<NormalizedErrors>({nonField: [], fields: {}})

    const form = ref<AddressCreateDTO>({
        postal_code: "",
        country: "",
        region: "",
        district: null,
        community: null,
        city_type: "",
        city: "",
        street: "",
        street_type: "",
        building: "",
        unit_type: null,
        unit_number: null,
        notes: "",
        is_personal: false,
        owner,
    })

    async function submit() {
        try {
            errors.value = {nonField: [], fields: {}}
            isSubmitting.value = true

            const payload = AddressCreateSchema.parse(form.value)
            await api.post("/components/addresses/create/", payload)

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

    return {form, submit, isSubmitting, errors}
}