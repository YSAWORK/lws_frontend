<!-- .src/components/ui/BaseButton.vue -->
<!-- A reusable button component with customizable variants and sizes -->

<script setup lang="ts">
  withDefaults(defineProps<{
    variant?: 'light' | 'white'
    size?: 'sm' | 'md' | 'lg' | 'icon' | "full"
    border?: 'none' | 'small' | 'large'
    disabled?: boolean
  }>(), {
    variant: 'light',
    size: 'md',
    border: 'none',
    disabled: false,
  })
</script>

<template>
  <button
      class="base-button"
      :class="[
          `variant-${variant}`,
          `size-${size}`,
          `border-${border}`]"
      :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
  /* === BASE BUTTON === */
  .base-button {
    min-width: var(--btn-min-width);
    min-height: var(--btn-min-height);
    margin: var(--margin-base);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-light);
    font-family: var(--font-button), serif;
    cursor: pointer;
    transition: 0.4s;
  }

  .base-button:hover {
    box-shadow: var(--shadow-dark);
    transform: scale(1.008);
  }

  .base-button:disabled {
    background-color: var(--button-disabled);
    color: var(--text-disabled);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  /* === VARIANT === */
  /* === light === */
  .variant-light {
    background-color: var(--button-primary);
    color: var(--text-button);
  }

  .variant-light:hover {
    background-color: var(--button-primary-hover);
    color: var(--button-primary);
    font-weight: bold;
  }

  .variant-light:active {
    background-color: var(--text-button);
    color: var(--button-primary-hover);
    font-weight: bold;
  }

  .variant-light:disabled {
    background-color: var(--button-disabled);
    color: var(--text-disabled);
    font-weight: normal;
  }

  /* === white === */
  .variant-white {
    background-color: rgb(var(--bg_header-rgb)) !important;
    color: rgb(var(--text-button-rgb));
  }

  .variant-white:active {
    background-color: var(--button-primary-hover) !important;
    color: var(--bg_header) !important;
  }

  /* === SIZE === */
  .size-sm { width: 50px; height: 50px; font-size: var(--btn-font-size-sm); padding: 0}
  .size-md { width: 150px; height: 50px; font-size: var(--btn-font-size-md); }
  .size-lg { width: 300px; height: 50px; font-size: var(--btn-font-size-lg); }
  .size-full { width: 100%; height: 50px; font-size: var(--btn-font-size-lg); }
  .size-icon {width: 30px; height: 30px; min-height: 12px; min-width: 12px; padding: 0; transition: none;}


  /* === BORDER === */
  .border-none { border: none; }
  .border-small { border: 1px solid var(--button-primary-hover); }

</style>