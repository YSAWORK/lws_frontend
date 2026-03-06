// src/components/modals/editNotes/editAttorneyUrlTs.ts

// IMPORT TOOLS
import { createApp, h } from "vue"
import EditNotesVue from "@/components/modals/global/editNotes/editNotesVue.vue"

// FUNCTIONS
export type NotesModel = { id: number | string; notes?: string | null }
export type EditNotesModalOptions<T extends NotesModel> = {
    item: T
    url: string
    title?: string
    displayValue?: string
    onSaved: (updated: NotesModel) => void
}
export function openEditNotesModal<T extends NotesModel>(
    opts: EditNotesModalOptions<T>,
): void {
    const host = document.createElement("div")
    document.body.appendChild(host)

    let app: ReturnType<typeof createApp> | null = null

    const close = () => {
        app?.unmount()
        host.remove()
        app = null
    }

    app = createApp({
        render() {
            return h(EditNotesVue, {
                item: opts.item,
                url: opts.url,
                title: opts.title,
                displayValue: opts.displayValue,
                onSaved: (updated: NotesModel) => {
                    opts.onSaved(updated)
                    close()
                },
                onClose: close,
            })
        },
    })

    app.mount(host)
}

