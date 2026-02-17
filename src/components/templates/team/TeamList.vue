<!-- .src/components/team/team/TeamList.vue -->

<script setup lang="ts">
// ===== IMPORT TOOLS ===== //
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// import base elements
import Base from "@/components/templates/base.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseImage from "@/components/ui/BaseImage.vue";
import BaseTableList from "@/components/ui/BaseTableList.vue";
import BaseThSortable from "@/components/ui/BaseThSortable.vue";
import BaseThFilterable from "@/components/ui/BaseThFilterable.vue";
import BaseThSearchable from "@/components/ui/BaseThSearchable.vue";
import ContentContainer from "@/components/ui/ContentContainer.vue";

// import images
import RedirectImg from '@/assets/img/redirect.svg'
import DefaultAvatar from "@/assets/img/default_avatar.jpg"

// import stores
import { useEmployeeListStore } from '@/stores/useEmployeeList'
import { useAuthStore } from "@/stores/auth";

// load API data
const store = useEmployeeListStore()
const {
  sortedEmployeeList,
  sortBy,
  sortOrder,
} = storeToRefs(store)
const auth = useAuthStore()

onMounted(() => store.fetchEmployeeList())

// routers
const router = useRouter()

const goToEmployee = async (id: number) => {
  const isMe = auth.employeeId != null && id === auth.employeeId
  await router.push(isMe ? "/me" : `/team/${id}`)
}

</script>

<template>
  <Base>
    <template #page_title>
      Команда
    </template>
    <template #path_bar>
      Головна |
    </template>
    <template #main_column_left>
      <ContentContainer>
        <BaseTableList variant="yellow">
          <template #thead_row>
            <th style="width: var(--avatar-column-width)"></th>
            <BaseThSearchable
                label="ЧЛЕН КОМАНДИ"
                field="FullName"
                :sortBy="sortBy"
                :sortOrder="sortOrder"
                :query="store.fullNameQuery"
                :isFilterActive="store.fullNameQuery.trim().length > 0"
                inputPlaceholder="Введіть ПІБ..."
                @toggle-sort="(filter) => store.toggleSort(filter as any)"
                @update:query="store.setFullNameQuery"
                @clear="store.clearFullNameFilter"
            />

            <BaseThFilterable
                label="Посада"
                field="Position"
                style="width: 20%"

                :sortBy="sortBy"
                :sortOrder="sortOrder"

                :filters="store.availablePositions"
                :isFilterActive="store.positionFilter.size > 0"
                :isChecked="(variant) => store.positionFilter.has(variant)"

                @toggle-sort="(filter) => store.toggleSort(filter as any)"
                @toggle-filter="(variant) => store.togglePosition(variant)"
                @clear-filter="store.clearPositionFilter()"
            />

            <BaseThSortable
                label="Адвокат"
                field="IsAttorney"
                :activeField="sortBy"
                :order="sortOrder"
                @toggle="(filter) => store.toggleSort(filter as any)"
                style="width: 10%"
            />


            <th></th>
          </template>
          <template #tbody_rows>
            <tr
                v-for="employee in sortedEmployeeList"
                :key="employee.Id">
              <td>
                <BaseImage :src="employee?.Avatar ? employee?.Avatar : DefaultAvatar" :alt="employee.FullName" size="sm"/>
              </td>
              <td>{{ employee.FullName }}</td>
              <td>{{ employee.Position }}</td>
              <td v-if="employee.IsAttorney">
                Так
              </td>
              <td v-else>—</td>
              <td>
                <BaseButton
                    size="sm"
                    border="small"
                    @click="goToEmployee(employee.Id)"
                    title="Перейти до профілю співробітника">
                    <BaseImage
                      :src="RedirectImg"
                      size="icon"
                      alt="Перейти до профілю співробітника">
                    </BaseImage>
                </BaseButton>
              </td>
            </tr>
          </template>
        </BaseTableList>
      </ContentContainer>
    </template>
  </Base>

</template>

<style scoped>

</style>