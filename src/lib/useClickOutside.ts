// .src/lib/useClickOutside.ts
//


// IMPORT TOOLS
import { onMounted, onBeforeUnmount, type Ref } from "vue"

// FUNCTION
export function useClickOutside(
    elementRef: Ref<HTMLElement | null>,
    callback: () => void,
): void {
    function handler(event: MouseEvent): void {
        const target = event.target as Node | null
        if (!elementRef.value || !target) return
        if (!elementRef.value.contains(target)) {
            callback()
        }
    }
    onMounted(() => {
        document.addEventListener("click", handler)
    })
    onBeforeUnmount(() => {
        document.removeEventListener("click", handler)
    })
}