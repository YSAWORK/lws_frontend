/// ./src/components/modals/global/confirmPrivacy/confirmPrivacyTs.ts

/// IMPORT TOOLS
import { createApp, h, ref } from "vue"
import api from "@/api"
import BaseConfirm from "@/components/ui/BaseConfirm.vue"

export type ConfirmPrivacyModalOpts<TItem> = {
    item: TItem
    url: string
    isPersonalNow: boolean
    title?: string
    displayValue?: string
    confirmText?: string
    cancelText?: string
    onSaved?: (updated: TItem) => void | Promise<void>
    onError?: (err: unknown) => void
}

export function openConfirmPrivacyModal<TItem>(
    opts: ConfirmPrivacyModalOpts<TItem>,
): Promise<boolean> {
    return new Promise((resolve) => {
        const host = document.createElement("div")
        document.body.appendChild(host)

        const isOpen = ref(true)
        const isSubmitting = ref(false)
        let done = false

        const nextValue = !opts.isPersonalNow
        const nextStatusText = nextValue ? "персональною" : "публічною"
        const defaultTitle = opts.displayValue
            ? `${opts.title ?? "Змінити статус приватності:"}\n${opts.displayValue}`
            : opts.title ?? "Змінити статус приватності"

        const defaultMessage = nextValue
            ? "Після підтвердження цей елемент буде позначено як персональний. Його не бачитимуть інші члени команди."
            : "Після підтвердження цей елемент буде позначено як публічний. Його бачитимуть інші члени команди."

        const app = createApp({
            render() {
                return h(BaseConfirm, {
                    modelValue: isOpen.value,
                    title: defaultTitle,
                    message: defaultMessage,
                    confirmText: opts.confirmText ?? (isSubmitting.value ? "Зберігаємо..." : "Так"),
                    cancelText: opts.cancelText ?? "Ні",
                    disableConfirm: isSubmitting.value,

                    "onUpdate:modelValue": (v: boolean) => {
                        isOpen.value = v
                        if (!v) cleanup(false)
                    },

                    onCancel: () => cleanup(false),

                    onConfirm: async () => {
                        if (isSubmitting.value) return
                        isSubmitting.value = true

                        try {
                            await api.patch(opts.url, {
                                is_personal: nextValue,
                            })

                            await opts.onSaved?.(opts.item)
                            cleanup(true)
                        } catch (err) {
                            isSubmitting.value = false
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