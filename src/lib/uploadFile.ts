/// src/components/lib/uploadFile.ts


/// IMPORT TOOLS
    import { ref } from "vue"
    import api from "@/api"


/// FUNCTIONS
    export function useResourceFileUpload(routeBuilder: (id: number | string) => string) {
        const isUploading = ref(false)
        const error = ref<string | null>(null)

        async function upload(
            id: number | string,
            field: string,
            file: File,
            opts?: { method?: "patch" | "post" | "put"; extraForm?: Record<string, string | Blob> },
        ) {
            const form = new FormData()
            form.append(field, file)
            if (opts?.extraForm) {
                for (const [k, v] of Object.entries(opts.extraForm)) form.append(k, v)
            }

            try {
                isUploading.value = true
                error.value = null
                const method = opts?.method ?? "patch"
                await api[method](routeBuilder(id), form, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
            } catch (err: any) {
                error.value = err?.response?.data?.detail ?? "Не вдалося завантажити файл."
                throw err
            } finally {
                isUploading.value = false
            }
        }

        return { upload, isUploading, error }
    }
