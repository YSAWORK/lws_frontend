<template>
  <Base>
    <template #main_column_left>
      <div class="list_container">
        <h1>Працівники компанії</h1>
        <table class="list_table">
          <thead>
          <tr>
            <th>Фото</th>
            <th>Ім’я</th>
            <th>Посада</th>
            <th>Біографія</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="profile in store.profiles" :key="profile.id">
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
            <td style="font-weight: bold">{{ profile.full_name }}</td>
            <td>{{ profile.position }}</td>
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

const store = useProfilesStore()
onMounted(store.fetchProfiles)
</script>

<style src="@/assets/css/main.css"></style>

