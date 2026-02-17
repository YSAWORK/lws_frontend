<!-- .src/components/ui/BaseThFilterableText.vue -->
<script setup lang="ts">
  import { computed, ref } from "vue"
  import { onClickOutside } from "@vueuse/core"
  import FilterImg from "@/assets/img/filter.svg"
  import FilterImgUsed from "@/assets/img/filter-used.svg"
  import BaseButton from "@/components/ui/BaseButton.vue"
  import BaseInput from "@/components/ui/BaseInput.vue"

  type SortOrder = "asc" | "desc"

  const props = defineProps<{
    label: string
    field: string
    sortBy: string | null
    sortOrder: SortOrder

    query: string
    isFilterActive: boolean

    filterTitle?: string
    inputPlaceholder?: string
  }>()

  const emit = defineEmits<{
    (e: "toggle-sort", field: string): void
    (e: "update:query", value: string): void
    (e: "clear"): void
  }>()

  const queryModel = computed({
    get: () => props.query,
    set: (v: string) => emit("update:query", v),
  })

  const detailsRef = ref<HTMLDetailsElement | null>(null)

  onClickOutside(detailsRef, () => {
    detailsRef.value?.removeAttribute("open")
  })
</script>

<template>
  <th
      class="filter-th"
      title="Сортувати за полем"
      @click="emit('toggle-sort', props.field)"
  >
    <div class="th-header">
      <span>{{ props.label }}</span>

      <details
          class="filter"
          ref="detailsRef"
          @click.stop>
        <summary
            class="filter-btn"
            @click.stop
            title="Відфільтрувати поле">
          <img
              class="filter-icon"
              :src="props.isFilterActive ? FilterImgUsed : FilterImg"
              alt="Фільтр"
          />
        </summary>

        <div class="filter-box" @click.stop>
          <BaseInput
              v-model="queryModel"
              size="md"
              flex="column"
              type='primary'
              justify='left'
              placeholder="Пошук..."
              :value="props.query"
              @input="emit('update:query', ($event.target as HTMLInputElement).value)"
          >
            <span class="filter-label">
              Введіть дані для пошуку
            </span>
          </BaseInput>

          <div>
            <BaseButton
                type="button"
                variant="white"
                @click="
                  emit('clear');
                  emit('update:query', '')
                ">
              Очистити
            </BaseButton>
          </div>
        </div>
      </details>

      <span v-if="props.sortBy === props.field">
        {{ props.sortOrder === 'asc' ? '▲' : '▼' }}
      </span>
    </div>
  </th>
</template>

<style scoped>
  .filter-th { position: relative; }

  .filter-th:hover {
    background-color: var(--button-primary-hover);
    color: var(--button-primary);
  }

  .th-header{
    display:flex;
    align-items:center;
    gap:0.5vw;
    cursor:pointer;
  }

  .filter { position: relative; }

  .filter-label{
    color: var(--text-disabled);
    font-size: var(--btn-font-size-sm);
  }

  .filter-btn{
    cursor:pointer;
    list-style:none;
    background: transparent;
  }

  .filter-box{
    font-size: var(--label-font-size);
    position:absolute;
    top: calc(100% + 7px);
    z-index: 3;

    min-width: 260px;
    max-width: 600px;

    background: rgba(var(--button-primary-rgb), 0.85);
    border-bottom-left-radius: calc(var(--border-radius) + 5px);
    border-bottom-right-radius: calc(var(--border-radius) + 5px);
    padding: 1vw;
    box-shadow: var(--shadow-dark);
  }

  .filter-icon{ width:16px; height:16px; display:block; }

  .btn-row{
    margin-top: 0.8vw;
    display:flex;
    justify-content: flex-end;
  }
</style>
