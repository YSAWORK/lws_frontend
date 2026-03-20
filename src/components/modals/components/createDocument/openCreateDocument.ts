// .src/components/modals/components/createDocument/openCreateDocument.ts

/// IMPORT TOOLS
import { createApp, h } from "vue"
import CreateDocumentModal from "./createDocumentVue.vue"
import type { OwnerDTO } from "@/model_schemas/dto/person/owner.dto"

type Options = {
    owner: OwnerDTO
    onCreated?: () => void | Promise<void>
}

export function openCreateDocumentModal(opts: Options) {
    const host = document.createElement("div")
    document.body.appendChild(host)

    const app = createApp({
        render() {
            return h(CreateDocumentModal, {
                owner: opts.owner,
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
}