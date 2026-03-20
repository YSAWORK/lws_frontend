// .src/components/modals/components/editDocument/openEditDocument.ts

/// IMPORT TOOLS
import { createApp, h } from "vue"
import EditDocumentModal from "@/components/modals/components/editDocument/editDocumentVue.vue"
import type { DocumentUpdateDTO } from "@/model_schemas/dto/components/document.dto.ts";

type Options = {
    document: DocumentUpdateDTO
    onCreated?: () => void | Promise<void>
}

export function openEditDocumentModal(opts: Options) {
    const host = document.createElement("div")
    document.body.appendChild(host)

    const app = createApp({
        render() {
            return h(EditDocumentModal, {
                document: opts.document,
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