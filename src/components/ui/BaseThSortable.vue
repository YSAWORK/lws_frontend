<!-- src/components/ui/BaseThSortable.vue -->

<script setup lang="ts">
const props = defineProps<{
  label: string
  field: string
  activeField: string | null
  order: 'asc' | 'desc'
}>()

const emit = defineEmits<{
  (e: 'toggle', field: string): void
}>()
</script>

<template>
  <th
      class="sortable_th"
      @click="emit('toggle', props.field)"
      style="cursor:pointer;"
      title="Сортувати за полем"
  >
    <span>{{ props.label }}</span>
    <span v-if="props.activeField === props.field">
      {{ props.order === 'asc' ? '▲' : '▼' }}
    </span>
  </th>
</template>

<style scoped>
  .sortable_th:hover {
    background-color: var(--button-primary-hover);
    color: var(--button-primary);
  }
</style>