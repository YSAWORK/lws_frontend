<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
  titleStyle?: 'auto'
  marginStyle?: 'bottom_1vw'
}>()

const isOpen = ref(false)
</script>

<template>
  <div class="collapse-wrapper"
  :class="[
        `marginStyle-${marginStyle}`,
       ]">

    <div class="collapse_header" @click="isOpen = !isOpen">
      <div class="subtitle_string_type_h3" >
        {{ title }}
      </div>
      <div>
        {{ isOpen ? '▲' : '▼' }}
      </div>
      <div class="collapse_actions">
        <slot name="actions" />
      </div>
    </div>

    <transition name="collapse">
      <div v-if="isOpen" class="collapse-body">
        <slot />
      </div>
    </transition>
  </div>
</template>

<style >
  .marginStyle-bottom_1vw {
    margin-bottom: 1vw;
  }

  .collapse_header {
    display: flex;
    align-items: center;
  }

  .collapse_actions {
    margin-left: auto;
    display: flex;
    align-items: center;
  }
</style>