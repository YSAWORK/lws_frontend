<!-- .src/components/ui/BaseLine.vue -->
<!-- A reusable horizontal line component with customizable width and size -->

<script setup lang="ts">
withDefaults(defineProps<{
  width?: 'think' | 'norm' | 'bold'
  size?: 'full' | 'half'
}>(), {
  width: 'norm',
  size: 'full',
})
</script>

<template>
  <hr class="base-line"
      :class="[
          `width-${width}`,
          `size-${size}`]"/>
</template>

<style scoped>

  /* === BASE LINE === */
  .base-line {
    border: 0;
    background-color: var(--border);
    margin: var(--margin-base);
  }

  /* === WIDTH === */
  .width-think {height: 1px;}
  .width-norm {height: 3px;}
  .width-bold {height: 5px;}

  /* === SIZE === */
  .size-full {width: 100%;}
  .size-half {width: 50%;}


</style>