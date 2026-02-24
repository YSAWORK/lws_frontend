// src/components/modals/editEmailNotes/editAttorneyUrlTs.ts

// IMPORT TOOLS
    import { createApp, h } from "vue"
    import EditEmailNotesVueModal from "@/components/modals/editEmailNotes/editEmailNotesVue.vue"
    import type { EmailShortDTO } from "@/model_schemas/dto/components/email.dto"

// FUNCTIONS
    // openEditEmailNotesModal
    export function openEditEmailNotesModal(
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
                return h(EditEmailNotesVueModal, {
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

