<!-- .src/components/ui/ContentContainer.vue -->

<script setup lang="ts">
defineProps<{
  size?: 'fit-content' | '50' | 'full'
  flex?: 'column' | 'row'
  padding?: 'none' | 'string' | 'bottom' | 'bottom-left' | 'left' | 'top'
  gap?: '1' | '2' | '5'
  noBackground?: 'true'
  alignItems?: 'center' | 'start' | 'end'
  justifyContent?: 'center' | 'start' | 'end' | 'between'
  columns?: string
  divStyle? : 'icon_wrapper' | 'counter_badge'
  maxHeight?: string
  overflow?: 'auto' | 'hidden' | 'scroll'
}>()

</script>

<template>
  <div
      class="content_container"
      :class="[
          `size-${size}`,
          `flex-${flex}`,
          `padding-${padding}`,
          `gap-${gap}`,
          `no-background-${noBackground}`,
          `align-items-${alignItems}`,
          `justifyContent-${justifyContent}`,
          `divStyle-${divStyle}`,
      ]"
      :style="{
        ...(columns ? { display: 'grid', gridTemplateColumns: columns } : {}),
        ...(maxHeight ? { maxHeight, overflowY: overflow ?? 'auto' } : {})
      }"
  >
    <slot />
  </div>
</template>

<style scoped>
  .content_container {
    width: 100%;
    height: auto;
    padding: 20px;
    box-sizing: border-box;
    background-color: var(--bg);
  }

  .padding-none {
    padding: 0;
  }

  .padding-string {
    padding: 0;
    gap: 0.3vw;
  }

  .padding-bottom {
    padding: 0 0 0.5vw 0;
  }

  .padding-bottom-left {
    padding: 0 0 0.5vw 1vw;
  }

  .padding-left {
    padding: 0 0 0 1vw;
  }

  .padding-top {
    padding: 1vw 0 0 0;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
  }

  .size-fit-content {
    width: fit-content;
    gap: 1vw;
  }

  .gap-2 {
    gap: 2vw;
  }

  .no-background-true {
    background-color: transparent;
  }

  .justifyContent-center {
    justify-content: center;
  }

  .justifyContent-end {
    justify-content: flex-end;
  }

  .divStyle-icon_wrapper {
    position: relative;
    display: inline-block;
  }

  .divStyle-counter_badge {
    position: absolute;
    top:-8px;
    right:-8px;
    width: 1vw;
    min-width: 15px;
    height: 1vw;
    min-height: 15px;
    background: var(--button-primary-hover);
    color: var(--font-primary);
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--counter-radius);
  }

</style>