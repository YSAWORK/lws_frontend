<!-- .src/components/templates/team/EmployeeProfile.vue -->

<script setup lang="ts">
// ===== IMPORT TOOLS ===== //
// import general
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

// import features
import { formatDate } from "@/lib/formatDate";
import { openPDF } from "@/lib/openPDF";
import { openLink } from "@/lib/openLink";
import { sendEmail } from "@/lib/sendEmail";
import { openInGoogleMaps} from "@/lib/openInGoogleMaps";

// import base elements
import Base from "@/components/templates/base.vue";
import ContentContainer from "@/components/ui/ContentContainer.vue";
import BaseImage from "@/components/ui/BaseImage.vue";
import BaseLine from "@/components/ui/BaseLine.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCollapse from "@/components/ui/BaseCollapse.vue";

// import images
import OpenFile from "@/assets/img/open_file.svg";
import UNBALink from "@/assets/img/UNBA_Logo.png"
import DownloadFile from "@/assets/img/download.svg";
import DefaultAvatar from "@/assets/img/default_avatar.jpg"
import EmailImg from '@/assets/img/email.svg'
import PhoneImg from '@/assets/img/phone.png'
import AddressImg from '@/assets/img/address.png'
import EditImg from '@/assets/img/edit.png'
import LicenseImg from '@/assets/img/certificate.png'
import EditImg2 from '@/assets/img/edit_2.svg'

// import stores
import { useEmployeeFullGetStore } from '@/stores/useEmployee'
import BaseTableList from "@/components/ui/BaseTableList.vue";
const auth = useAuthStore()

// import modals
import { openEditEmailNotesModal } from "@/components/modals/editEmailNotes/editEmailNotesTs"
import { openEditEmailListModal } from "@/components/modals/editEmailList/script"
import { openEditPhoneNotesModal } from "@/components/modals/editPhoneNotes/editPhoneNotes"
import { openEditAddressNotesModal } from "@/components/modals/editAddressNotes/script"
import type { EmailShortDTO } from "@/model_schemas/dto/components/email.dto"
import type { PhoneShortDTO } from "@/model_schemas/dto/components/phone.dto"
import { mapAddressShort } from "@/model_schemas/mapped/components/address.mapped"
import type { AddressShort } from "@/model_schemas/models/components/address.model"
import type { AddressShortDTO } from "@/model_schemas/dto/components/address.dto"
import {useAuthStore} from "@/stores/auth";

// load API
const store = useEmployeeFullGetStore()
const { employee} = storeToRefs(store)

// ФУНКЦІЇ
// edit email notes
function handleEditEmailNotes(email: EmailShortDTO) {
  openEditEmailNotesModal(email,  (updated: EmailShortDTO) => {
    if (!employee.value?.emails) return
    employee.value.emails = employee.value.emails.map(e =>
        e.id === updated.id ? updated : e
    )
  })
}

// edit email list

function handleEditEmailList(emails: EmailShortDTO[]) {
  openEditEmailListModal(emails,  (updated: EmailShortDTO[]) => {
    if (!employee.value) return
    employee.value.emails = updated
  })
}

// edit phone notes
function handleEditPhoneNotes(email: PhoneShortDTO) {
  openEditPhoneNotesModal(email,  (updated: PhoneShortDTO) => {
    if (!employee.value?.phones) return
    employee.value.phones = employee.value.phones.map(e =>
        e.id === updated.id ? updated : e
    )
  })
}

// edit address notes
function handleEditAddressNotes(address: AddressShort) {
  const dto = {
    ...address,
    notes: address.notes ?? null,
  } as unknown as AddressShortDTO

  openEditAddressNotesModal(dto, (updatedDto) => {
    if (!employee.value?.addresses) return
    const updatedModel = mapAddressShort(updatedDto)
    employee.value.addresses = employee.value.addresses.map(a =>
        a.id === updatedModel.id ? updatedModel : a
    )
  })
}

// ЗБІР MOUNT
onMounted(() => {
  const myId = auth.employeeId
  if (myId !== null) {store.fetchEmployeeFullGet(myId)}
  else {console.error("Користувач не авторизований")}
})
</script>

<template>
  <Base>
    <!-- НАЗВА ВІКНА В ХЕДЕРІ -->
    <template #page_title>
      {{ employee?.FullName}}
    </template>

    <!-- ШЛЯХ В ХЕДЕРІ -->
    <template #path_bar>
      Головна |
      <RouterLink
          to="/team"
          class="header_link"
          title="Повернутися до списку працівників">
        Команда
      </RouterLink>
    </template>

    <!-- ОСНОВНЕ ВІКНО -->
    <template #main_column_left>
      <ContentContainer columns="70% 30%" padding="none" gap="2">

        <!-- ЛІВА КОЛОНКА ОСНОВНОГО ВІКНА -->
        <ContentContainer name="Головний контейнер профілю співробітника">
          <ContentContainer
              name="Контейнер з фото, :ПІБ, :(посадою та датою народження)"
              flex="row"
              padding="bottom">

            <!-- ФОТО -->
            <BaseImage
                :src="employee?.Avatar
                      ? employee?.Avatar
                      : DefaultAvatar"
                size="lg"
                alt="Фото працівника"
                title="Фото працівника">
            </BaseImage>
            <ContentContainer
                name="Контейнер з ПІБ, :(посадою та датою народження)"
                flex="column"
                padding="left">

              <!-- ПІБ -->
              <span class="title_string" title="ПІБ працівника">{{
                  employee?.FullName
                      ? employee?.FullName
                      : 'Відсутні дані'}}
                  </span>
              <BaseLine size="half"></BaseLine>

              <!-- ПОСАДА -->
              <ContentContainer
                  name="Контейнер з посадою"
                  flex="row"
                  padding="string">
                <span class="chapter_title"> Посада: </span>
                <span
                    class="subtitle_string_name_h2"
                    title="Посада працівника"> {{
                    employee?.Position
                        ? employee?.Position
                        : "Відсутні дані"}}
                  </span>
              </ContentContainer>

              <!-- ДАТА НАРОДЖЕННЯ -->
              <ContentContainer
                  name="Контейнер з датою народження"
                  flex="row"
                  padding="string">
                <span class="chapter_title"> Дата народження: </span>
                <span
                    class="subtitle_string_name_h2"
                    title="Дата народження працівника"> {{
                    employee?.Birthday
                        ? formatDate(employee?.Birthday)
                        : "Відсутні дані"}}
                  </span>
              </ContentContainer>
            </ContentContainer>
          </ContentContainer>
          <BaseLine width="think"/>

          <!-- КОНТАКТНА ІНФОРМАЦІЯ -->
          <ContentContainer
              name="Контейнер з контактною інформацією"
              padding="none"
              flex="column">

            <!-- ЕЛЕКТРОННА ПОШТА -->
            <BaseCollapse
                title="Електронна пошта"
                name="Контейнер з електронною поштою"
                marginStyle="bottom_1vw">
              <template #actions>
                <BaseButton
                size="icon">
                  <BaseImage
                      :src="EditImg2"
                      size="sm-icon"
                      alt="Редагувати перелік електронних адрес"
                      @click="handleEditEmailList(employee?.emails)"
                      title="Редагувати перелік електронних адрес">
                  ></BaseImage>

                </BaseButton>
              </template>
              <BaseTableList v-if="employee?.emails
                                  ? employee?.emails.length > 0
                                  : false">>
                <template #colgroup>
                  <col style="width:5%">
                  <col style="width:25%">
                  <col style="width:55%">
                  <col style="width:10%">
                </template>
                <template #tbody_rows>
                  <tr v-for="email in employee?.emails">
                    <td style="padding-left: 1vw">
                      <BaseImage
                          :src="EmailImg"
                          size="sm-icon"
                          alt="Перейти до профілю співробітника">
                      </BaseImage>
                    </td>
                    <td class="important_text"> {{ email.email }} </td>
                    <td class="notes_string"> {{ email.notes }} </td>
                    <td>
                      <ContentContainer
                          padding="none"
                          flex="row"
                          no-background="true">
                        <BaseButton
                            size="sm"
                            @click="sendEmail(email.email)"
                            :title="'Надіслати електронного листа на ' + email.email">
                          <BaseImage  :src="EmailImg" size="icon"/>
                        </BaseButton>
                        <BaseButton
                            size="sm"
                            @click="handleEditEmailNotes(email)"
                            title="Редагувати нотатки">
                          <BaseImage  :src="EditImg" size="icon"/>
                        </BaseButton>
                      </ContentContainer>
                    </td>
                  </tr>
                </template>
              </BaseTableList>
              <span class="text_no_data" v-else> Відсутні дані про електронні адреси </span>
            </BaseCollapse>
            <BaseLine width="think"/>

            <!-- ТЕЛЕФОН -->
            <BaseCollapse
                title="Телефон"
                marginStyle="bottom_1vw">
              <BaseTableList v-if="employee?.phones
                                  ? employee?.phones.length > 0
                                  : false">>
                <template #colgroup>
                  <col style="width:5%">
                  <col style="width:25%">
                  <col style="width:55%">
                  <col style="width:10%">
                </template>
                <template #tbody_rows>
                  <tr v-for="phone in employee?.phones">
                    <td style="padding-left: 1vw">
                      <BaseImage
                          :src="PhoneImg"
                          size="sm-icon"
                          alt="Перейти до профілю співробітника">
                      </BaseImage>
                    </td>
                    <td class="important_text"> {{ phone.phone_number }} </td>
                    <td class="notes_string"> {{ phone.notes }} </td>
                    <td>
                      <ContentContainer
                          padding="none"
                          flex="row"
                          no-background="true"
                          justifyContent="end">
                        <BaseButton
                            size="sm"
                            @click="handleEditPhoneNotes(phone)"
                            title="Редагувати нотатки">
                          <BaseImage  :src="EditImg" size="icon"/>
                        </BaseButton>
                      </ContentContainer>
                    </td>
                  </tr>
                </template>
              </BaseTableList>
              <span class="text_no_data" v-else> Відсутні дані про контактні номери телефону </span>
            </BaseCollapse>
            <BaseLine width="think"/>

            <!-- АДРЕСА -->
            <BaseCollapse
                title="Адреса"
                name="Контейнер з адресою"
                marginStyle="bottom_1vw">
              <BaseTableList
                  v-if="employee?.addresses
                                  ? employee?.addresses.length > 0
                                  : false">
                <template #colgroup>
                  <col style="width:5%">
                  <col style="width:55%">
                  <col style="width:30%">
                  <col style="width:10%">
                </template>
                <template #tbody_rows>
                  <tr v-for="address in employee?.addresses">
                    <td style="padding-left: 1vw">
                      <BaseImage
                          :src="AddressImg"
                          size="sm-icon"
                          alt="Перейти до профілю співробітника">
                      </BaseImage>
                    </td>
                    <td class="important_text"> {{
                        address?.address
                            ? address.address
                            : "Помилка відображення адреси" }}
                    </td>
                    <td class="notes_string"> {{
                        address?.notes
                            ? address.notes
                            : "" }}
                    </td>
                    <td>
                      <ContentContainer
                          padding="none"
                          flex="row"
                          no-background="true"
                          justifyContent="end">
                        <BaseButton
                            size="sm"
                            @click="openInGoogleMaps(address.address)"
                            title="Показати на мапі">
                          <BaseImage  :src="AddressImg" size="icon"/>
                        </BaseButton>
                        <BaseButton
                            size="sm"
                            @click="handleEditAddressNotes(address)"
                            title="Редагувати нотатки">
                          <BaseImage  :src="EditImg" size="icon"/>
                        </BaseButton>
                      </ContentContainer>
                    </td>
                  </tr>
                </template>
              </BaseTableList>
              <span class="text_no_data" v-else> Відсутні дані про адресу </span>
            </BaseCollapse>
          </ContentContainer>
          <BaseLine width="think"/>

          <!-- АДВОКАТСЬКА ДІЯЛЬНІСТЬ -->
          <ContentContainer padding="none" flex="column">
            <BaseCollapse
                title="Адвокатська діяльність"
                marginStyle="bottom_1vw">
              <ContentContainer
                  v-if="employee?.IsAttorney"
                  padding="none"
                  flex="column">

                <!-- ДОКУМЕНТИ АДВОКАТА -->
                <BaseTableList
                    name="Документи адвоката">
                  <template #colgroup>
                    <col style="width:5%">
                    <col style="width:95%">
                    <col style="width:10%">
                  </template>
                  <template #tbody_rows>

                    <!-- ВИТЯГ З ЄРАУ -->
                    <tr>
                      <td style="padding-left: 1vw">
                        <BaseImage
                            :src="LicenseImg"
                            size="sm-icon">
                        </BaseImage>
                      </td>
                      <td class="important_text"> Витяг з ЄРАУ </td>
                      <td>
                        <ContentContainer
                            padding="none"
                            flex="row"
                            no-background="true"
                            justifyContent="end">
                          <BaseButton
                              :disabled="!employee?.AttorneyUrl"
                              @click="employee?.AttorneyUrl && openLink(employee.AttorneyUrl)"
                              :title="employee?.AttorneyUrl
                                ? 'Відкрити профіль в ЄРАУ'
                                : 'Профіль в ЄРАУ відсутній'"
                              size="sm">
                            <BaseImage  :src="UNBALink" size="icon"/>
                          </BaseButton>
                        </ContentContainer>
                      </td>
                    </tr>

                    <!-- СВІДОЦТВО ПРО ПРАВО НА ЗАЙНЯТТЯ АДВОКАТСЬКОЮ ДІЯЛЬНІСТЮ -->
                    <tr>
                      <td style="padding-left: 1vw">
                        <BaseImage
                            :src="LicenseImg"
                            size="sm-icon">
                        </BaseImage>
                      </td>
                      <td>
                        <ContentContainer
                            flex="column"
                            padding="none"
                            no-background="true">
                          <ContentContainer
                              class="chapter_title"
                              no-background="true"
                              padding="none"
                          >
                            Свідоцтво про право на зайняття адвокатською діяльністю
                          </ContentContainer>
                          <ContentContainer
                              v-if="employee?.LicenseNumber"
                              class="text_string"
                              no-background="true"
                              padding="none">
                            № {{ employee?.LicenseNumber}} від {{ formatDate( employee?.LicenseDate )}} р., видане {{ employee?.LicenseCommission}}
                          </ContentContainer>
                          <span class="text_no_data" v-else> Відсутні дані про Свідоцтво про право на зайняття адвокатською діяльністю </span>
                        </ContentContainer>
                      </td>
                      <td>
                        <ContentContainer
                            name="Кнопки Свідоцтва"
                            flex="row"
                            no-background="true"
                            padding="none">
                          <BaseButton
                              v-if="employee?.LicenseFile"
                              size="sm"
                              @click="openPDF(employee?.LicenseFile)"
                              title="Відкрити PDF-файл Свідоцтва">
                            <BaseImage  :src="OpenFile" size="icon"/>
                          </BaseButton>
                          <BaseButton
                              size="sm"
                              v-if="employee?.LicenseFile"
                              @click="openPDF(employee?.LicenseFile,true)"
                              title="Завантажити PDF-файл Свідоцтва">
                            <BaseImage  :src="DownloadFile" size="icon"/>
                          </BaseButton>
                        </ContentContainer>
                      </td>
                    </tr>

                    <!-- ПОСВІДЧЕННЯ АДВОКАТА -->
                    <tr>
                      <td style="padding-left: 1vw">
                        <BaseImage
                            :src="LicenseImg"
                            size="sm-icon">
                        </BaseImage>
                      </td>
                      <td>
                        <ContentContainer
                            flex="column"
                            padding="none"
                            no-background="true">
                          <ContentContainer
                              class="chapter_title"
                              no-background="true"
                              padding="none"
                          >
                            Посвідчення адвоката
                          </ContentContainer>
                          <ContentContainer
                              v-if="employee?.LicenseNumber"
                              class="text_string"
                              no-background="true"
                              padding="none">
                            № {{ employee?.CertificateNumber}} від {{ formatDate( employee?.CertificateDate )}} р., видане {{ employee?.CertificateCommission}}
                          </ContentContainer>
                          <span class="text_no_data" v-else> Відсутні дані про посвідчення адвоката </span>
                        </ContentContainer>
                      </td>
                      <td>
                        <ContentContainer
                            name="Кнопки Свідоцтва"
                            flex="row"
                            no-background="true"
                            padding="none">
                          <BaseButton
                              v-if="employee?.LicenseFile"
                              size="sm"
                              @click="openPDF(employee?.LicenseFile)"
                              title="Відкрити PDF-файл Свідоцтва">
                            <BaseImage  :src="OpenFile" size="icon"/>
                          </BaseButton>
                          <BaseButton
                              size="sm"
                              v-if="employee?.LicenseFile"
                              @click="openPDF(employee?.LicenseFile,true)"
                              title="Завантажити PDF-файл Свідоцтва">
                            <BaseImage  :src="DownloadFile" size="icon"/>
                          </BaseButton>
                        </ContentContainer>
                      </td>
                    </tr>
                  </template>
                </BaseTableList>
              </ContentContainer>
              <span v-else class="text_no_data"> Відсутнє право на зайняття адвокатською діяльністю </span>
            </BaseCollapse>
          </ContentContainer>
          <BaseLine width="think"/>

          <!-- БІОГРАФІЯ -->
          <ContentContainer
              padding="bottom"
              flex="column">
            <BaseCollapse
                title="Біографія"
                marginStyle="bottom_1vw">
                <span
                    class="text_string"
                    v-if="employee?.Biography">
                  {{ employee?.Biography }}
                </span>
              <span class="text_no_data" v-else> Відсутні дані </span>
            </BaseCollapse>
          </ContentContainer>
        </ContentContainer>

        <!-- ПРАВА КОЛОНКА ОСНОВНОГО ВІКНА -->
        <ContentContainer align-items="center" justifyContent="center">
          <h1>PROJECT COLUMN</h1>
        </ContentContainer>
      </ContentContainer>
    </template>

    <!-- КОЛОНКА НАВІГАЦІЇ -->
    <template #main_column_right>
    </template>
  </Base>
</template>

<style src="@/styles/base.css">
</style>
