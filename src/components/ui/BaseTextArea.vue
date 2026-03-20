<!-- .src/components/ui/BaseTextArea.vue -->
<!-- A reusable textarea component with customizable size and type -->


<script setup lang="ts">
import { ref, nextTick, watch, onMounted, computed } from "vue"
import ContentContainer from "@/components/ui/ContentContainer.vue";


const props = withDefaults(defineProps<{
  modelValue?: string | null
  size?: 'sm' | 'md' | 'lg' | '100' | '50' | '25' | 'auto'
  paddingStyle?: string // 0 0 0 1vw
  row_width?: string    // ширина поля вводу
  gap?: string          // відстань між написом та полем вводу
  grid?: string         // приклад: "200px 1fr" або "12rem minmax(0, 1fr)"
  type?: 'primary' | 'note'
  disabled?: boolean
  maxlength?: number
  maxHeight?: string
  overflow?: 'auto' | 'hidden' | 'scroll'
}>(), {
  size: '100',
  type: 'primary',
  flex: 'column',
  maxHeight: '60vh',
  maxlength: 1000,
  disabled: false,
})
const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>()
const length = computed(() => props.modelValue?.length ?? 0)
const textarea = ref<HTMLTextAreaElement | null>(null)

// Автоматично змінювати висоту поля
  const autoResize = async () => {
    await nextTick()
    if (!textarea.value) return
    textarea.value.style.height = "auto"
    textarea.value.style.height = textarea.value.scrollHeight + "px"
  }

onMounted(autoResize)
watch(() => props.modelValue, () => autoResize())
</script>

<template>
  <label class="important_text"
         :style="{
            padding: paddingStyle,
            gap: gap,
            ...(grid ? { display: 'grid', gridTemplateColumns: grid, alignItems: 'center' } : {}),
         }">
    <span :style="[`width:${row_width}`]">
      <slot />
    </span>


    <ContentContainer padding="none" class="textarea-wrap">
      <textarea
          class="base-textarea"
          ref="textarea"
          :maxlength="maxlength"
          :value="modelValue ?? ''"
          @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
          :class="[`size-${size}`, `type-${type}`]"
          :disabled="disabled"
          :style="{ ...(maxHeight ? { maxHeight, overflowY: overflow ?? 'auto' } : {}) }"
      />

      <ContentContainer
          v-if="maxlength"
          padding="none"
          class="counter"
      >
        {{ length }} / {{ maxlength }}
      </ContentContainer>
    </ContentContainer>


  </label>
</template>

<style scoped>
  /* === BASE TEXTAREA === */
  .base-textarea {
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
    min-height: var(--input-min-height);
    max-height: calc(var(--input-min-height) * 15);
    font-size: var(--input-font-size);
    font-family: var(--font-button), sans-serif;
    color: var(--text-primary);
    text-align: justify;
    hyphens: auto;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-light);
    border: 1px solid var(--border);
    margin: var(--margin-base);
    padding-top: calc(var(--padding-base) + 5px);
    resize: none;
    scrollbar-width: auto;
    scrollbar-color: var(--border) transparent;
  }

  .base-textarea:focus {
    outline: none;
    box-shadow: var(--shadow-dark);
    border: 1px solid var(--text-disabled);
  }

  .base-textarea:disabled {
    background-color: var(--button-disabled);
    color: var(--text-disabled);
    cursor: not-allowed;
    box-shadow: none;
  }

  .textarea-wrap{
    position: relative;
    width: 100%;
    max-width: 100%;
  }

  .counter{
    position: absolute;
    top: 6px;
    left: 10px;
    font-size: 0.8rem;
    opacity: 0.6;
    background: transparent;
    pointer-events: none; /* щоб кліки/виділення не ламалися */
  }

  /* === TYPE === */
  .type-note {
    color: var(--text-disabled);
    font-style: italic;
    font-size: calc(var(--input-font-size) * 0.8);
  }

  /* === SIZE === */
  .size-sm {width: clamp(50px, 2vw, 100px);}
  .size-md {width: clamp(100px, 20vw, 400px);}
  .size-lg {width: clamp(400px, 40vw, 80000px);}
  .size-100 {width: 100%;}
  .size-50 {width: 50%;}
  .size-25 {width: 25%;}
  .size-auto {width: auto;}

  .input-text-label {
    display: flex;
    font-size: var(--label-font-size);
  }

</style>