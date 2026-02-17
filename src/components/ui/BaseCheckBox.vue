<!-- .src/components/ui/BaseCheckBox.vue -->
<!-- A reusable checkbox component with customizable label -->

<script setup lang="ts">
  const props = defineProps<{
    checked: boolean
    disabled?: boolean
    label: string
  }>()

  const emit = defineEmits<{
    (e: "change", value: boolean): void
  }>()
</script>

<template>
  <label class="base-checkbox">
    <input
        type="checkbox"
        :checked="props.checked"
        :disabled="props.disabled"
        @change="emit('change', ($event.target as HTMLInputElement).checked)"
    />
    <span class="base-checkbox-box"></span>
    <span class="base-checkbox-label"> {{ label }} </span>
    <slot />
  </label>
</template>

<style scoped>
  /* === BASE CHECKBOX === */
  .base-checkbox {
    text-align: left;
    font-size: var(--label-font-size);
    font-family: var(--font-primary), serif;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.4vw;
    cursor: pointer;
  }

  .base-checkbox input {
    display: none;
  }

  .base-checkbox-box {
    width: 1vw;
    height: 1vw;
    border: 2px solid var(--text-disabled);
    border-radius: var(--border-radius);
    position: relative;
  }

  .base-checkbox input:checked + .base-checkbox-box {
    background: var(--text-disabled);
    border-color: var(--text-disabled);
    box-shadow: var(--shadow-dark);
  }

  .base-checkbox:hover .base-checkbox-box {
    background-color: var(--button-primary);
  }

  .base-checkbox input:checked + .base-checkbox-box::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 1px;
    width: 6px;
    height: 0.5vw;
    border: solid var(--button-primary);
    border-width: 0 4px 4px 0;
    transform: rotate(45deg);
  }
</style>