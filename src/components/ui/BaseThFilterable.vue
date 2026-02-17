<!-- .src/components/ui/BaseThFilterable.vue -->
<script setup lang="ts">
  import {ref} from "vue";
  import { onClickOutside } from "@vueuse/core"
  import FilterImg from '@/assets/img/filter.svg'
  import FilterImgUsed from '@/assets/img/filter-used.svg'
  import BaseCheckBox from "@/components/ui/BaseCheckBox.vue";
  import BaseButton from "@/components/ui/BaseButton.vue";

  type SortOrder = "asc" | "desc"

  const props = defineProps<{
    label: string
    field: string
    sortBy: string | null
    sortOrder: SortOrder
    filters: string[]
    isFilterActive: boolean
    isChecked: (value: string) => boolean
    filterTitle?: string
  }>()

  const emit = defineEmits<{
    (e: "toggle-sort", field: string): void
    (e: "toggle-filter", value: string): void
    (e: "clear-filter"): void
  }>()

  const detailsRef = ref<HTMLDetailsElement | null>(null)

  onClickOutside(detailsRef, () => {
    detailsRef.value?.removeAttribute("open")
  })
</script>

<template>
  <th
      class="filter-th"
      title="Сортувати за полем"
      @click="emit('toggle-sort', props.field)">

    <div class="th-header">

      <span> {{ props.label }} </span>

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
          <div class="filter-list">
              <BaseCheckBox
                  v-for="filter in filters" :key="filter"
                  :checked="isChecked(filter)"
                  :label="filter"
                  @change="emit('toggle-filter', filter)"
              />
          </div>

          <div>
            <BaseButton
                type="button"
                variant="white"
                @click="emit('clear-filter')"
            >
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
    width: 15vw;
    background: rgba(var(--button-primary-rgb), 0.85);
    border-bottom-left-radius: calc(var(--border-radius) + 5px);
    border-bottom-right-radius: calc(var(--border-radius) + 5px);
    padding: 1vw;
    box-shadow: var(--shadow-dark);
  }

  .filter-icon{ width:16px; height:16px; display:block; }

  .filter-list{
    max-height: 400px;
    display:flex;
    align-items: flex-start;
    flex-direction:column;
    gap:0.5vw;
  }

</style>