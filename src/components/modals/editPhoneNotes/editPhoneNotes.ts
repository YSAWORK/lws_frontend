// src/components/modals/editEmailNotes/editAttorneyUrlTs.ts

// IMPORT TOOLS
import { createApp, h } from "vue"
import  EditPhoneNotesModal from "@/components/modals/editPhoneNotes/editPhoneNotes.vue"
import type { PhoneShortDTO } from "@/model_schemas/dto/components/phone.dto";

export function openEditPhoneNotesModal(
    phone: PhoneShortDTO,
    onSaved: (updated: PhoneShortDTO) => void,
): void {
    const host = document.createElement("div")
    document.body.appendChild(host)

    const close = () => {
        app.unmount()
        host.remove()
    }

    const app = createApp({
        render() {
            return h(EditPhoneNotesModal, {
                phone,
                onSaved: (updated: PhoneShortDTO) => {
                    onSaved(updated)
                    close()
                },
                onClose: close,
            })
        },
    })

    app.mount(host)
}

