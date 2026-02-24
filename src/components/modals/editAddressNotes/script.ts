// src/components/modals/editAddressNotes/editAttorneyUrlTs.ts

// IMPORT TOOLS
import { createApp, h } from "vue"
import EditAddressNotesModal from "@/components/modals/editAddressNotes/template.vue"
import type { AddressShortDTO } from "@/model_schemas/dto/components/address.dto";

export function openEditAddressNotesModal(
    address: AddressShortDTO,
    onSaved: (updated: AddressShortDTO) => void,
): void {
    const host = document.createElement("div")
    document.body.appendChild(host)

    const close = () => {
        app.unmount()
        host.remove()
    }

    const app = createApp({
        render() {
            return h(EditAddressNotesModal, {
                address,
                onSaved: (updated: AddressShortDTO) => {
                    onSaved(updated)
                    close()
                },
                onClose: close,
            })
        },
    })

    app.mount(host)
}

