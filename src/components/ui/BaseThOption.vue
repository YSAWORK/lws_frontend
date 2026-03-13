<script setup lang="ts">
import { ref, watch } from "vue"
import { useClickOutside } from "@/lib/useClickOutside"
import ContentContainer from "@/components/ui/ContentContainer.vue"
import BaseImage from "@/components/ui/BaseImage.vue"
import FilterImg from "@/assets/img/filter.svg"
import SearchImg from "@/assets/img/navigation/search.svg"
import BaseInput from "@/components/ui/BaseInput.vue";
import CalendarImg from "@/assets/img/navigation/calendar.svg"
import BaseButton from "@/components/ui/BaseButton.vue";
import DeleteImg from '@/assets/img/delete.svg'

const props = defineProps<{
  label: string
  sortKey: string
  indicator?: SortIndicator
  setSort: (key: string) => void

  searchable?: boolean
  filterType?: FilterType

  searchValue?: string
  setColumnFilter?: (key: string, value: string) => void
  searchPlaceholder?: string

  dateFrom?: string
  dateTo?: string
  setDateRangeFilter?: (key: string, from: string, to: string) => void

  title?: string
  disabled?: boolean
  align?: "left" | "center" | "right"
}>()

const isFilterOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const localSearch = ref(props.searchValue ?? "")

useClickOutside(rootRef, () => {
  isFilterOpen.value = false
})

function toggleFilter(): void {
  if (props.disabled) return
  isFilterOpen.value = !isFilterOpen.value
}

function getAlignClass(align?: "left" | "center" | "right"): string {
  switch (align) {
    case "center":
      return "sortable_th--center"
    case "right":
      return "sortable_th--right"
    default:
      return "sortable_th--left"
  }
}

function onInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  props.setColumnFilter?.(props.sortKey, value)
}

function onDateFromInput(event: Event): void {
  const from = (event.target as HTMLInputElement).value
  props.setDateRangeFilter?.(props.sortKey, from, props.dateTo ?? "")
}

function onDateToInput(event: Event): void {
  const to = (event.target as HTMLInputElement).value
  props.setDateRangeFilter?.(props.sortKey, props.dateFrom ?? "", to)
}

function clearSearch(): void {
  localSearch.value = ""
  props.setColumnFilter?.(props.sortKey, "")
}

watch(
    () => props.searchValue,
    (value) => {
      localSearch.value = value ?? ""
    }
)
</script>

<template>
  <th
      ref="rootRef"
      :class="[
      'sortable_th',
      getAlignClass(align),
      { 'sortable_th--disabled': disabled }
    ]"
      :title="title ?? `Сортувати за полем: ${label}`"
  >
    <ContentContainer
        padding="none"
        no-background="true"
        class="sortable_th__wrapper">
      <span
          class="sortable_th__content"
          @click="!disabled && setSort(sortKey)"
      >

<!-- НАЗВА КОЛОНКИ З ІНДИКАТОРОМ СОРТУВАННЯ -->
        <span class="sortable_th__label">
          {{ label }}
          <span
            v-if="indicator"
            class="sortable_th__indicator"
            aria-hidden="true">
            {{ indicator }}
          </span>
        </span>

<!-- КНОПКА ВІДКРИТТЯ ПОШУКУ/ФІЛЬТРУ -->
        <BaseButton
            size="icon"
            v-if="searchable"
            type="button"
            class="sortable_th__filter_button"
            @click.stop="toggleFilter"
        >
          <BaseImage
              v-if="(filterType ?? 'text') === 'text'"
              :src="SearchImg"
              title="Відкрити пошуковий рядок"
              size="sm-icon"
          />
          <BaseImage
              v-else-if="(filterType ?? 'date-range')  === 'date-range'"
              :src="CalendarImg"
              title="Відкрити фільтр за датою"
              size="sm-icon"
          >
          </BaseImage>
        </BaseButton>
      </span>

<!-- ПОШУК ЗА ТЕКСТОМ -->
      <ContentContainer
          v-if="searchable && (filterType ?? 'text') === 'text' && isFilterOpen"
          class="sortable_th__search_filter"
          padding="none"
          no-background="true"
          @click.stop
      >
        <BaseInput
            size="100"
            title="Введіть бажане значення, щоб застосувати фільтр"
            styleModel="table_search"
            paddingStyle="0"
            :model-value="localSearch"
            @update:model-value="(value) => {
            localSearch = value
            setColumnFilter?.(sortKey, value)
          }"/>
        <BaseButton
            size="icon"
            title="Очистити фільтр"
            @click.stop="clearSearch">
          <BaseImage :src="DeleteImg" size="sm-icon" />
        </BaseButton>
      </ContentContainer>

<!-- ФІЛЬТР ЗА ДАТОЮ -->
      <ContentContainer
          flex="column"
          padding="none"
          no-background="true"
          v-if="searchable && filterType === 'date-range' && isFilterOpen"
          class="sortable_th__date_range"
          @click.stop>

        <ContentContainer no-background="true" padding="none">
          <BaseInput
              size="100"
              styleModel="table_search"
              paddingStyle="0"
              type="date"
              :model-value="dateFrom ?? ''"
              @click.stop
              @update:model-value="(value) => setDateRangeFilter?.(sortKey, value, dateTo ?? '')">
          </BaseInput>
          <BaseInput
              size="100"
              styleModel="table_search"
              paddingStyle="0"
              type="date"
              :model-value="dateTo ?? ''"
              @click.stop
              @update:model-value="(value) => setDateRangeFilter?.(sortKey, dateFrom ?? '', value)">
          </BaseInput>
        </ContentContainer>

        <BaseButton
            size="icon"
            title="Очистити фільтр"
            @click.stop="setDateRangeFilter?.(sortKey, '', '')">
          <BaseImage :src="DeleteImg" size="sm-icon" />
        </BaseButton>

      </ContentContainer>
    </ContentContainer>
  </th>
</template>

<style scoped>
.sortable_th {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  position: relative;
}

  .sortable_th--disabled {
    cursor: default;
    opacity: 0.55;
  }

  .sortable_th--disabled:hover {
    opacity: 0.55;
  }

  .sortable_th--left {
    text-align: left;
  }

  .sortable_th--center {
    text-align: center;
  }

  .sortable_th--right {
    text-align: right;
  }

  .sortable_th__wrapper {
    display: flex;
    flex-direction: column;
  }

  .sortable_th__content {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  label {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .sortable_th__indicator {
    display: inline-block;
    min-width: 12px;
    font-size: 0.85em;
    line-height: 1;
  }

  .sortable_th__date_range {
    background-color: RGB(var(--button-primary-rgb), 0.7);
    display: flex;
    flex-direction: row;
    position: absolute;
    gap: 3px;
    top: 100%;
    z-index: 50;
    padding: 0.5vw;
    width: 150%;
    justify-content: center;
    align-items: center;
  }

  .sortable_th__search_filter {
    background-color: RGB(var(--button-primary-rgb), 0.7);
    display: flex;
    flex-direction: row;
    gap: 4px;
    position: absolute;
    top: 100%;
    z-index: 50;
    padding: 0.5vw;
    width: 100%;
  }

  .sortable_th__filter_button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    opacity: 0.5;
  }

  .sortable_th__filter_button:hover {
    opacity: 1;
  }
</style>