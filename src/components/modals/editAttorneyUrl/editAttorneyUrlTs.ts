// .src/components/modals/editAttorneyUrl

// IMPORT TOOLS
    import { createApp, h, ref } from "vue"
    import EditAttorneyUrlVue from "@/components/modals/editAttorneyUrl/editAttorneyUrlVue.vue"

// FUNCTIONS
    export function openAttorneyUrlModal(opts: {
        employeeId: number
        currentUrl?: string | null
        title?: string
        onSaved?: (newUrl: string | null) => void | Promise<void>
    }): void {
        const host = document.createElement("div")
        document.body.appendChild(host)

        const urlRef = ref<string | null>(opts.currentUrl ?? null)

        const app = createApp({
            render() {
                return h(EditAttorneyUrlVue, {
                    title: opts.title ?? "Посилання адвоката",
                    employeeId: opts.employeeId,
                    currentUrl: urlRef.value,
                    onClose: () => {
                        app.unmount()
                        host.remove()
                    },
                    onSaved: async (newUrl: string | null) => {
                        urlRef.value = newUrl
                        await opts.onSaved?.(newUrl)
                    },
                })
            },
        })

        app.mount(host)
    }