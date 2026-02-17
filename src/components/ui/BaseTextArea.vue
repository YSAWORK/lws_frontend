<!-- .src/components/ui/BaseTextArea.vue -->
<!-- A reusable textarea component with customizable size and type -->


<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from "vue"


const props = withDefaults(defineProps<{
  modelValue: string
  size?: '100' | '50' | '25'
  type?: 'primary' | 'note'
  flex?: 'row' | 'column'
  row_width?: string
  disabled?: boolean
}>(), {
  size: '100',
  type: 'primary',
  flex: 'column',
  row_width: '10vw',
  disabled: false,
})
const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>()

const textarea = ref<HTMLTextAreaElement | null>(null)

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
  <label class="input-text-label"
        :class="[
          `flex-${flex}`,]">
    <span :style="[`width:${row_width}`]">
      <slot />
    </span>
    <textarea
          class="base-textarea"
          ref="textarea"
          :value="props.modelValue"
          @input="(e) => { emit('update:modelValue', (e.target as HTMLTextAreaElement).value); autoResize() }"
          :class="[
          `size-${size}`,
          `type-${type}`,]"
          :disabled="disabled"
      />

  </label>
</template>

<style scoped>
  /* === BASE TEXTAREA === */
  .base-textarea {
    max-width: 96%;
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
    padding: var(--padding-base);
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

  /* === TYPE === */
  .type-note {
    color: var(--text-disabled);
    font-style: italic;
    font-size: calc(var(--input-font-size) * 0.8);
  }

  /* === SIZE === */
  .size-100 {width: 100%;}
  .size-50 {width: 50%;}
  .size-25 {width: 25%;}

  /* === FLEX DIRECTION === */
  .flex-row {flex-direction: row; gap: 0.5vw;}
  .flex-column {flex-direction: column; gap: 0;}

  .input-text-label {
    display: flex;
    font-size: var(--label-font-size);
  }

</style>