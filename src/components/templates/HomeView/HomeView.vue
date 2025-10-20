<script setup lang="ts">
  import { HomeView} from './HomeView'
  import Base from "@/components/templates/base.vue";
  const {
    loading,
    error,
    onLogout,
  } = HomeView()
</script>

<template>
  <Base>
    <template #main_column_left>
      <div v-if="profile" class="list_container">
        <div class="profile_foto_links">
          {% for item in list %}
          <router-link :to="`/profiles/${item.pk}`">
            <img
                :src="item.avatar"
                alt="Фото"
                class="image_in_td"
            />
          </router-link>
          {% endfor %}
        </div>
        <h1> Профайл: {{ profile.full_name }}</h1>

        <div class="data_block">
          <div>
            <div class="foto_block">
              <!-- ФОТО -->
              <img class="profile_foto" v-if="profile.avatar" :src="profile.avatar" alt="Фото"/>
              <div>
                <!-- ПОСАДА -->
                <p><strong>Посада:</strong> {{ profile.position }}</p>

                <!-- ДАТА НАРОДЖЕННЯ -->
                <p><strong>Дата народження:</strong>
                  {{ new Date(profile.date_of_birth).toLocaleDateString('uk-UA', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) }}
                </p>

                <!-- БЛАНК ПІДПИСУ В ДОКУМЕНТАХ -->
                <div class="hr-line"><span>Для документів</span></div>
                <div v-if="profile.license" class="data_block" style="grid-template-columns: 85% 15%;">
                  <div id="InfoForDoc">
                    <strong>Адвокат {{profile.full_name}}</strong><br>
                    Свідоцтво про право на зайняття адвокатською діяльністю<br>
                    {{profile.license.series_number_license}} від
                    {{ new Date(profile.license.date_issued_license).toLocaleDateString('uk-UA', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'}) }},
                    видане {{profile.license.issuing_organization_license}}<br>
                    <span v-if="profile.primary_phone">
                        тел.: {{profile.primary_phone.phone_number}}<br>
                      </span>
                    <span v-else class="error">
                        <strong>!</strong>Не визначено основний номер телефону<br>
                      </span>
                    <span  v-if="profile.primary_mail">
                        ел. адреса: {{profile.primary_mail.email}}<br>
                      </span>
                    <span v-else class="error">
                        <strong>!</strong>Не визначено основну електронну адресу<br>
                      </span>
                    <span v-if="profile.primary_address">
                        {{profile.primary_address.postal_code}},
                        {{profile.primary_address.country}},
                        {{profile.primary_address.city}},
                        {{profile.primary_address.street_type}}
                        {{profile.primary_address.street}},
                        {{profile.primary_address.building}}/
                        <span v-if="profile.primary_address.apartment && profile.primary_address.apartment.length">
                          {{profile.primary_address.apartment}}
                        </span>
                      </span>
                    <span v-else class="error">
                        <strong>!</strong>Не визначено основну адресу
                      </span>
                  </div>
                  <div><button class="btn_file" @click="copyInfo">Скопіювати<br>текст</button></div>
                  <div v-if="showTooltip" class="tooltip">Скопійовано ✅</div>
                </div>
                <div v-else>Працівник не є адвокатом</div>

              </div>
            </div>

            <!-- EMAIL -->
            <div v-if="profile.mails && profile.mails.length" >
              <div class="hr-line"><span>Електронна пошта</span></div>
              <table class="list_table">
                <tbody>
                <tr v-for="mail in profile.mails" :key="mail.id">
                  <td><img src="@/assets/img/email.png"></td>
                  <td><strong>{{ mail.email }}</strong></td>
                  <td style="width: 70%;" class="notes_string">{{ mail.notes }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- ТЕЛЕФОН -->
            <div v-if="profile.phones && profile.phones.length" >
              <div class="hr-line"><span>Контактні телефони</span></div>
              <table class="list_table">
                <tbody>
                <tr v-for="phone in profile.phones" :key="phone.id">
                  <td><img src="@/assets/img/phone.png"></td>
                  <td><strong>{{ phone.phone_number }}</strong></td>
                  <td class="notes_string">{{ phone.notes }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- АДРЕСА -->
            <div v-if="profile.addresses && profile.addresses.length" >
              <div class="hr-line"><span>Адреси</span></div>
              <table class="list_table">
                <tbody>
                <tr v-for="address in profile.addresses" :key="address.id">
                  <td><img src="@/assets/img/address.png"></td>
                  <td>
                    <strong>{{address.postal_code}}, {{address.country}}, {{address.city}}, {{address.street_type}} {{address.street}}, {{address.building}}
                    </strong><span v-if="address.apartment && address.apartment.length"><strong>/{{address.apartment}}</strong></span>
                  </td>
                  <td style="width: 40%;" class="notes_string">{{ address.notes }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- СВІДОЦТВО АДВОКАТА -->
            <div v-if="profile.license" >
              <div class="hr-line"><span>Свідоцтво про право на зайняття адвокатською діяльністю</span></div>
              <table class="list_table">
                <tbody>
                <tr>
                  <td><img src="@/assets/img/certificate.png"></td>
                  <td>
                    {{profile.license.series_number_license}} від
                    {{ new Date(profile.license.date_issued_license).toLocaleDateString('uk-UA', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) }},
                    видане {{profile.license.issuing_organization_license}}
                  </td>
                  <td style="width: 30%;" class="notes_string">{{ profile.license.notes }}</td>
                  <td v-if="profile.license.license_file && profile.license.license_file.length">
                    <button class="btn_file" @click="openPDF(profile.license.license_file)">Свідоцтво (PDF)</button>
                  </td>
                  <td v-else> </td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- ПОСВІДЧЕННЯ АДВОКАТА -->
            <div v-if="profile.certificate" >
              <div class="hr-line"><span>Посвідчення адвоката</span></div>
              <table class="list_table">
                <tbody>
                <tr>
                  <td><img src="@/assets/img/certificate.png"></td>
                  <td>
                    {{profile.certificate.series_number_certificate}} від
                    {{ new Date(profile.certificate.date_issued_certificate).toLocaleDateString('uk-UA', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) }},
                    видане {{profile.certificate.issuing_organization_certificate}}
                  </td>
                  <td style="width: 30%;" class="notes_string" > {{ profile.certificate.notes }}</td>
                  <td v-if="profile.certificate.certificate_file && profile.certificate.certificate_file.length">
                    <button class="btn_file" @click="openPDF(profile.certificate.certificate_file)">Посвідчення (PDF)</button>
                  </td>
                  <td v-else> </td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- БІОГРАФіЯ -->
            <div>
              <div class="hr-line"><span>Біографія</span></div>
              <p style="text-align: justify">{{ profile.bio }}</p>
            </div>

            <!-- ОСВІТА -->
            <div v-if="profile.educations && profile.educations.length" >
              <div class="hr-line"><span>Освіта</span></div>
              <table class="list_table">
                <tbody>
                <tr v-for="education in profile.educations" :key="education.id">
                  <td><img src="@/assets/img/graduation.png"></td>
                  <td><strong>{{ education.graduation_year }}</strong></td>
                  <td>{{ education.institution }}</td>
                  <td>{{ education.degree }}</td>
                  <td style="width: 20%;" class="notes_string">{{ education.notes }}</td>
                  <td v-if="education.degree_file && education.degree_file.length">
                    <button class="btn_file" @click="openPDF(education.degree_file)">Диплом<br>(PDF)</button>
                  </td>
                  <td v-else> </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <button class="btn_func_1" @click="goToAdminProfile(profile.id)">
              Редагувати профайл
            </button>
            <router-link :to="`/profiles`">
              <button class="btn_func_1">Перелік працівників</button>
            </router-link>
          </div>

        </div>
      </div>
    </template>
  </Base>
  <span v-if="error" class="error">{{ error }}</span>
</template>
