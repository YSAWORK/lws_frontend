// .src/components/modals/global/confirmDelete/confirmDeleteTs.ts

/// IMPORT TOOLS
    import { createApp, h, ref } from "vue"
    import api from "@/api"
    import BaseConfirm from "@/components/ui/BaseConfirm.vue"

export type ConfirmDeleteModalOpts<TItem> = {
    item: TItem
    url: string
    title?: string
    displayValue?: string
    confirmText?: string
    cancelText?: string
    onSaved?: (deleted: TItem) => void | Promise<void>
    onError?: (err: unknown) => void
}

export function openConfirmDeleteModal<TItem>(
    opts: ConfirmDeleteModalOpts<TItem>,
): Promise<boolean> {
    return new Promise((resolve) => {
        const host = document.createElement("div")
        document.body.appendChild(host)
        const isOpen = ref(true)
        const isDeleting = ref(false)
        let done = false
        const app = createApp({
            render() {
                return h(BaseConfirm, {
                    modelValue: isOpen.value,
                    title: opts.displayValue
                        ? `${opts.title}\n${opts.displayValue}`
                        : opts.title ?? "Підтвердження видалення",
                    message: "",
                    confirmText: opts.confirmText ?? (isDeleting.value ? "Видаляємо..." : "Так"),
                    cancelText: opts.cancelText ?? "Ні",

                    disableConfirm: isDeleting.value,

                    "onUpdate:modelValue": (v: boolean) => {
                        isOpen.value = v
                        if (!v) cleanup(false)
                    },

                    onCancel: () => cleanup(false),

                    onConfirm: async () => {
                        if (isDeleting.value) return
                        isDeleting.value = true
                        try {
                            await api.delete(opts.url)
                            await opts.onSaved?.(opts.item)
                            cleanup(true)
                        } catch (err) {
                            isDeleting.value = false
                            opts.onError?.(err)
                        }
                    },
                })
            },
        })

        function cleanup(result: boolean) {
            if (done) return
            done = true
            resolve(result)
            app.unmount()
            host.remove()
        }

        app.mount(host)
    })
}