// src/components/modals/editEmailNotes/script.ts

import { createApp, h } from "vue"
import EditEmailListModal from "@/components/modals/editEmailList/template.vue"
import type { EmailShortDTO } from "@/model_schemas/dto/components/email.dto"

export function openEditEmailListModal(
    email: EmailShortDTO,
    onSaved: (updated: EmailShortDTO) => void,
): void {
    const host = document.createElement("div")
    document.body.appendChild(host)

    const close = () => {
        app.unmount()
        host.remove()
    }

    const app = createApp({
        render() {
            return h(EditEmailListModal, {
                email,
                onSaved: (updated: EmailShortDTO) => {
                    onSaved(updated)
                    close()
                },
                onClose: close,
            })
        },
    })

    app.mount(host)
}

