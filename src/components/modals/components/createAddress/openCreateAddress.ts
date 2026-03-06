// .src/components/modals/components/createAddress/openCreateAddress.ts

/// IMPORT TOOLS
import { createApp, h } from "vue"
import CreateAddressModal from "@/components/modals/components/createAddress/createAddressVue.vue"
import api from "@/api"
import type { AddressTypesDTO } from "@/model_schemas/dto/libraries/address_types.dto"
import type { AddressTypes } from "@/model_schemas/models/libraries/address_types.model"
import { mapAddressType } from "@/model_schemas/mapped/libraries/address_types.mapped"
import type { OwnerDTO } from "@/model_schemas/dto/person/owner.dto"

type Options = {
    owner: OwnerDTO
    onCreated?: () => void | Promise<void>
}
let addressTypesCache: AddressTypes | null = null
let addressTypesPromise: Promise<AddressTypes> | null = null

async function fetchAddressTypes(): Promise<AddressTypes> {
    if (addressTypesCache) return addressTypesCache
    if (addressTypesPromise) return addressTypesPromise

    addressTypesPromise = api
        .get<AddressTypesDTO>("/libraries/address_types/")
        .then((r) => {
            const mapped = mapAddressType(r.data)
            addressTypesCache = mapped
            return mapped
        })
        .finally(() => (addressTypesPromise = null))

    return addressTypesPromise
}


export function openCreateAddressModal(opts: Options) {
    const host = document.createElement("div")
    document.body.appendChild(host)

    fetchAddressTypes().then((addressTypes) => {
        const app = createApp({
            render() {
                return h(CreateAddressModal, {
                    owner: opts.owner,
                    addressTypes,
                    onClose: () => {
                        app.unmount()
                        host.remove()
                    },
                    onCreated: async () => {
                        await opts.onCreated?.()
                        app.unmount()
                        host.remove()
                    },
                })
            },
        })

        app.mount(host)
    })
}