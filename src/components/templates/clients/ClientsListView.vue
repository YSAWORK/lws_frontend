<template>
  <Base>
    <template #main_column_left>
      <div class="list_container">
        <h1>Клієнти</h1>
        <table class="list_table">
          <thead>
          <tr>
            <th>Фото</th>
            <th>Ім’я/Назва</th>
            <th>Вид діяльності</th>
            <th>TaxID</th>
            <th>Опис</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="profile in store.clients" :key="profile.id">
            <td>
              <template v-if="profile.avatar">
                <router-link :to="`/profiles/${profile.id}`">
                  <img
                      :src="profile.avatar"
                      alt="Фото"
                      class="image_in_td"
                  />
                </router-link>
              </template>
              <template v-else>
                <span>—</span>
              </template>
            </td>
            <td style="font-weight: bold">{{ profile.name }}</td>
            <td v-for="business in profile.business" :key="business.id">
              {{ business.name }}
            </td>
            <td>{{ profile.taxID }}</td>
            <td style="text-align: justify">{{ profile.bio || '—' }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </template>

  </Base>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProfilesStore } from '@/stores/useEmployeeProfiles.js'
import {useClientsStore} from "@/stores/useClientProfiles.js";

const store = useClientsStore()
onMounted(store.fetchProfiles)
</script>

<style src="@/assets/css/main.css"></style>

