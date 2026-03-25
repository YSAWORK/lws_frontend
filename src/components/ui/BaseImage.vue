<!-- .src/components/ui/BaseImage.vue -->
<!-- A reusable image component with customizable size and shape -->

<script setup lang="ts">
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'icon' | 'sm-icon'
    src?: string
    alt?: string
    shadow?: 'norm'
    paddingStyle?: string // 0 0 0 1vw
    cursorStyle?: string
  }>()
</script>

<template>
  <img class="base-image"
       :src="src"
       :alt="alt"
       :style="{
            padding: paddingStyle,
            cursor: cursorStyle,
        }"
       :class="[
           `size-${size}`,
           `shadow-${shadow}`
       ]"/>
</template>

<style scoped>
  /* === BASE IMAGE === */
  .base-image {
    background: none;
  }

  /* === SIZE === */
  .size-sm {
    width: 5vw;
    height: 7vw;
    object-fit: cover;
  }
  .size-md {
    width: 10vw;
    height: 14vw;
    object-fit: cover;
  }
  .size-lg {
    width: 15vw;
    height: 19vw;
    object-fit: cover;
  }
  .size-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border: none;
    border-radius: 3px;
    opacity: 0.5;
  }

  .size-sm-icon {
    width: 25px;
    height: 25px;
    object-fit: contain;
    border: none;
    border-radius: 3px;
    opacity: 0.5;
  }

  .size-icon:hover{
    opacity: 1;
  }

  .shadow-norm {
    box-shadow: var(--shadow-dark);
    border-radius: var(--border-radius-image);
  }


</style>