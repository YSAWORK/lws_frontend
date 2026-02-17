// src/lib/copyToClipboard.ts

/**
 * Копіює текст із HTML елемента з заданим id у буфер обміну.
 *
 * @param elementId - ID HTML елемента, текст якого потрібно скопіювати.
 * @param showTooltipRef - (необов’язково) ref<boolean> для відображення підказки “Скопійовано ✅”.
 * @param duration - (необов’язково) тривалість показу підказки в мс (за замовчуванням 2000).
 */

// IMPORTS
import {Ref} from "vue";

// FUNCTION
type BoolRef = Ref<boolean> | Ref<boolean, boolean>;
export async function copyToClipboard(
    elementId: string,
    showTooltipRef?: BoolRef,
    duration = 2000
) {
    const el = document.getElementById(elementId);
    if (!el) return;
    await navigator.clipboard.writeText(el.innerText.trim());
    if (showTooltipRef) {
        showTooltipRef.value = true;
        setTimeout(() => (showTooltipRef.value = false), duration);
    }
}