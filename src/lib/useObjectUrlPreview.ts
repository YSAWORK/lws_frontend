/// .src/lib/useObjectUrlPreview.ts


/// IMPORT TOOLS
    import { ref, watch, onBeforeUnmount, type Ref } from "vue"


/// FUNCTIONS
    // Створює реактивний об'єкт URL прев'ю для Файлу
        export function useObjectUrlPreview(fileRef: Ref<File | null>) {
            const objectUrl = ref<string | null>(null)

            watch(
                fileRef,
                (file) => {
                    // cleanup previous url
                    if (objectUrl.value) {
                        URL.revokeObjectURL(objectUrl.value)
                        objectUrl.value = null
                    }

                    // create new blob url
                    if (file) {
                        objectUrl.value = URL.createObjectURL(file)
                    }
                },
                { immediate: true },
            )

            onBeforeUnmount(() => {
                if (objectUrl.value) {
                    URL.revokeObjectURL(objectUrl.value)
                }
            })

            return {
                objectUrl,
            }
        }