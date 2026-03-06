<!-- .src/components/ui/BaseInput.vue -->
<!-- A reusable input component with customizable size and type -->


<script setup lang="ts">
  withDefaults(defineProps<{
    size?: 'sm' | 'md' | 'lg' | '100' | '50' | '25' | 'auto'
    paddingStyle?: string // 0 0 0 1vw
    row_width?: string    // ширина поля вводу
    gap?: string          // відстань між написом та полем вводу
    grid?: string         // приклад: "200px 1fr" або "12rem minmax(0, 1fr)"
    placeholder?: string
    disabled?: boolean
    modelValue: string | null | undefined
    type?: HTMLInputElement["type"]
  }>(), {
    size: '50',
    paddingStyle: '0 0 0 1vw',
    row_width: '10vw',
    grid: undefined,
    placeholder: '',
    disabled: false,
    type: 'text',
  })

  const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>()
</script>

<template>
  <label
        :style="{
            padding: paddingStyle,
            gap: gap,
            ...(grid ? { display: 'grid', gridTemplateColumns: grid, alignItems: 'start' } : {}),
  }">
    <span
          style="font-size: var(--input-font-size)"
          :style="{ width: row_width }">
      <slot />
    </span>
    <input
        :type="type"
        class="base_input"
        :class="[
          `size-${size}`,
          `type-${type}`,
          ]"
        :placeholder="placeholder"
        :value="modelValue ?? ''"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :disabled="disabled">
  </label>
</template>

<style scoped>
  /* === BASE INPUT === */
  .base_input {
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
    height: var(--input-min-height);
    font-size: var(--input-font-size);
    text-align: left;
    font-family: var(--font-button), sans-serif;
    color: var(--text-primary);
    padding: 0 0.2vw;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-light);
    border: 1px solid var(--border);
    margin: var(--margin-base);
    background-color: transparent;
  }

  .base_input:focus {
    outline: none;
    box-shadow: var(--shadow-dark);
    border: 1px solid var(--text-disabled);
  }

  .base_input:disabled {
    background-color: var(--button-disabled);
    color: var(--text-disabled);
    cursor: not-allowed;
    box-shadow: none;
  }

  input::placeholder {
    color: var(--text-disabled);
    opacity: 0.4;
  }

  /* === SIZE === */
  .size-sm {width: clamp(50px, 2vw, 100px);}
  .size-md {width: clamp(50px, 20vw, 400px);}
  .size-lg {width: clamp(100px, 40vw, 80000px);}
  .size-100 {width: 100%;}
  .size-50 {width: 50%;}
  .size-25 {width: 25%;}
  .size-auto {width: auto;}

  /* === JUSTIFY === */
  .justify-left {align-items: flex-start;}
  .justify-center {align-items: center;}
  .justify-right {align-items: flex-end;}

</style>