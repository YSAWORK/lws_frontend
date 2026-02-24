import { createApp, h, ref } from "vue"
import OpenFeedbackVue from "@/components/modals/openFeedback/openFeedbackVue.vue"
import type { FeedbackShortDTO } from "@/model_schemas/dto/feedback/feedback.dto"

export function openFeedbacksModal(
    getFeedbacks: () => FeedbackShortDTO[],
    employeeCode: string,
    elementCode: string,
    title: string,
    onPublished: () => Promise<void> | void,
): void {
    const host = document.createElement("div")
    document.body.appendChild(host)

    const app = createApp({
        setup() {
            const feedbacksRef = ref<FeedbackShortDTO[]>(getFeedbacks())

            const refresh = () => {
                feedbacksRef.value = [...getFeedbacks()]
            }

            const close = () => {
                app.unmount()
                host.remove()
            }

            const handlePublished = async () => {
                await onPublished()
                refresh()
            }

            return () =>
                h(OpenFeedbackVue, {
                    title,
                    feedbacks: feedbacksRef.value,
                    employeeCode,
                    elementCode,
                    onClose: close,
                    onPublished: handlePublished,
                })
        },
    })

    app.mount(host)
}