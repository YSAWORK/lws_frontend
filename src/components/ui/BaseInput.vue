<!-- .src/components/ui/BaseInput.vue -->
<!-- A reusable input component with customizable size and type -->


<script setup lang="ts">
  withDefaults(defineProps<{
    size?: 'sm' | 'md' | 'lg' | '100' | '50' | '25' | 'auto'
    type?: 'primary' | 'success' | 'error'
    justify?: 'left' | 'center' | 'right'
    flex?: 'row' | 'column'
    row_width?: string
    disabled?: boolean
    modelValue: string
  }>(), {
    size: '50',
    type: 'primary',
    justify: 'left',
    flex: 'row',
    row_width: '10vw',
    disabled: false,
  })

  const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>()
</script>

<template>
  <label
        :class="[
          `flex-${flex}`,
          `justify-${justify}`,]">
    <span
          style="font-size: var(--input-font-size)"
          :style="[`width:${row_width}`,
    ]">
      <slot />
    </span>
    <input
        class="base_input"
        :class="[
          `size-${size}`,
          `type-${type}`,
          ]"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :disabled="disabled">
  </label>
</template>

<style scoped>
  /* === BASE INPUT === */
  .base_input {
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
    color: var(--border);
  }

  /* === SIZE === */
  .size-sm {width: clamp(50px, 2vw, 100px);}
  .size-md {width: clamp(100px, 20vw, 400px);}
  .size-lg {width: clamp(400px, 40vw, 80000px);}
  .size-100 {width: 100%;}
  .size-50 {width: 50%;}
  .size-25 {width: 25%;}
  .size-auto {width: auto;}

  /* === TYPE === */
  .type-primary {
  }
  .type-error {
    background-color: var(--bg_error);
  }
  .type-success {
    background-color: var(--bg_success);
  }

  /* === JUSTIFY === */
  .justify-left {align-items: flex-start;}
  .justify-center {align-items: center;}
  .justify-right {align-items: flex-end;}

  /* === FLEX DIRECTION === */
  .flex-row {flex-direction: row; gap: 0.5vw;}
  .flex-column {flex-direction: column; gap: 0;}

</style>