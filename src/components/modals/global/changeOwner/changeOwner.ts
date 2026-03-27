// ./src/components/modals/global/changeOwner/changeOwner.ts

// IMPORT TOOLS
import { createApp, h } from "vue"
import EditOwnerVue from "@/components/modals/global/changeOwner/changeOwnerVue.vue"
import { ChangeOwnerModel } from "@/components/modals/global/changeOwner/changeOwnerRegistry"


// FUNCTIONS
export type EditOwnerModalOptions<T extends ChangeOwnerModel> = {
    item: T
    url: string
    title?: string
    displayValue?: string
    onSaved: (updated: ChangeOwnerModel) => void
}
export function openEditOwnerModal<T extends ChangeOwnerModel>(
    opts:  EditOwnerModalOptions<T>,
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
            return h(EditOwnerVue, {
                item: opts.item,
                url: opts.url,
                title: opts.title,
                displayValue: opts.displayValue,
                onSaved: (updated: ChangeOwnerModel) => {
                    opts.onSaved(updated)
                    close()
                },
                onClose: close,
            })
        },
    })

    app.mount(host)
}

