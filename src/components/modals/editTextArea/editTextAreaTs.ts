// .src/components/editTextArea/editTextArea.ts

/// IMPORT TOOLS
    import { createApp, h, ref } from "vue"
    import EditTextAreaModal from "@/components/modals/editTextArea/editTextAreaVue.vue"

/// FUNCTIONS
    export function openEditTextAreaModal(opts: {
        title: string
        id: number
        patchUrl: string
        initialValue?: string | null
        fieldName: string
        onSaved?: (newValue: string) => Promise<void> | void
    }): void {
        const host = document.createElement("div")
        document.body.appendChild(host)

        const valueRef = ref<string>(opts.initialValue ?? "")

        const app = createApp({
            render() {
                return h(EditTextAreaModal, {
                    title: opts.title,
                    entityId: opts.id,
                    patchUrl: opts.patchUrl,
                    fieldName: opts.fieldName,
                    currentValue: valueRef.value,
                    onClose: () => {
                        app.unmount()
                        host.remove()
                    },
                    onSaved: (newValue: string) => {
                        valueRef.value = newValue
                        app.unmount()
                        host.remove()
                        Promise.resolve(opts.onSaved?.(newValue)).catch((e) => {
                            console.error("Post-save refresh failed:", e)
                        })
                    },
                })
            },
        })

        app.mount(host)
    }
