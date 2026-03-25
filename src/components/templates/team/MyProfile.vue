<!-- .src/components/templates/team/EmployeeProfile.vue -->

<script setup lang="ts">
// ===== IMPORT TOOLS ===== //
  // import general
    import { onMounted, ref, computed} from 'vue'
    import { storeToRefs } from 'pinia'

  // import features
    import { formatDate } from "@/lib/format_data/formatDate";
    import { openLoadFile } from "@/lib/files/openLoadFile";
    import { openLink } from "@/lib/openLink";
    import { sendEmail } from "@/lib/features/sendEmail";
    import { openInGoogleMaps} from "@/lib/features/openInGoogleMaps";
    import { formatPhoneNumber } from "@/lib/format_data/formatPhoneNumber";
    import { formatAddress } from "@/lib/format_data/formatAddress";
    import {filterComponentByOwner} from "@/lib/filterByOwner";

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
    import FeedbackImg from '@/assets/img/feedback.svg'
    import DeleteImg from '@/assets/img/delete.svg'
    import NewImg from '@/assets/img/new.svg'
    import PrivateImg from '@/assets/img/lock-true.svg'
    import PrivateNoImg from '@/assets/img/lock-false.svg'

  // import stores
    import { useMeFullGetStore } from '@/stores/useMeProfile'
    import BaseTableList from "@/components/ui/BaseTableList.vue";

  // import modals
    import { openEditNotesModal } from "@/components/modals/global/editNotes/editNotesTs"
    import { openFeedbacksModal } from "@/components/modals/global/open&addFeedback/open&addFeedbackTs";
    import { openAttorneyUrlModal } from "@/components/modals/employee/editAttorneyUrl/editAttorneyUrlTs"
    import { openEditTextAreaModal } from "@/components/modals/global/editTextArea/editTextAreaTs"
    import { openEditLicenseModal } from "@/components/modals/employee/openEditLicenseModal/openEditLicenseModalTs"
    import { openCreateEmailModal } from "@/components/modals/components/createEmail/openCreateEmail"
    import { openCreatePhoneModal } from "@/components/modals/components/createPhone/openCreatePhone"
    import { openCreateAddressModal } from "@/components/modals/components/createAddress/openCreateAddress"
    import { openConfirmDeleteModal } from "@/components/modals/global/confirmDelete/confirmDeleteTs";
    import { openConfirmPrivacyModal } from "@/components/modals/global/confirmPrivacy/confirmPrivacyTs"
    import type { FeedbackShortDTO } from "@/model_schemas/dto/feedback/feedback.dto";
    import type { EmployeeFullGet } from "@/model_schemas/models/person/employee.model";


// load API
    const store = useMeFullGetStore()
    const { employee } = storeToRefs(store)

/// ФУНКЦІЇ
  // Блоки вкладки
    type SectionKey =
        | "contacts"
        | "clients"
        | "projects"
        | "tasks"
        | "calendar"
        | "biography"

    const activeSection = ref<SectionKey>("contacts")

    function setActiveSection(section: SectionKey) {
      activeSection.value = section
    }

  // Отримати видимі компоненти
    /// Телефони
      const visiblePhones = computed(() =>
          filterComponentByOwner(employee.value?.phones ?? [], employee.value?.Id)
      )

    /// Електронна пошта
      const visibleEmails = computed(() =>
          filterComponentByOwner(employee.value?.emails ?? [], employee.value?.Id)
      )

    /// Адреси
      const visibleAddresses = computed(() =>
          filterComponentByOwner(employee.value?.addresses ?? [], employee.value?.Id)
      )

  // Створення нового Email
    function handleEmailCreate(ownerId: number) {
      openCreateEmailModal({
        owner: { key: "Person", id: ownerId },
        onCreated: async () => {
          await store.fetchMeFullGet()
        },
      })
    }

  // Створення нового номеру телефону
    function handlePhoneCreate(ownerId: number) {
      openCreatePhoneModal({
        owner: { key: "Person", id: ownerId },
        onCreated: async () => {
          await store.fetchMeFullGet()
        },
      })
    }

  // Створення нової адвреси
    function handleAddressCreate(ownerId: number) {
      openCreateAddressModal({
        owner: { key: "Person", id: ownerId },
        onCreated: async () => {
          await store.fetchMeFullGet()
        },
      })
    }

  // Видалення компонентів (email, телефон, адреса)
    type IdModelDel = { id: number | string;}

    // Формуємо реєстр змінних
      const ComponentDeleteRegistry = {
        emails: {
          url: (id: IdModelDel['id']) => `/components/email/${id}/`,
          title: "Видалити інформацію про email:",
          display: (e: any) => e.email ?? "",},
        phones: {
          url: (id: IdModelDel['id']) => `/components/phone/${id}/`,
          title: "Видалити інформацію про номер телефону:",
          display: (p: any) => formatPhoneNumber(p.phone_number) ?? "",},
        addresses: {
          url: (id: IdModelDel['id']) => `/components/address/${id}/`,
          title: "Видалити інформацію про адресу:",
          display: (p: any) => formatAddress(p) ?? "",}
        } as const
        export type ComponentDeleteKey = keyof typeof ComponentDeleteRegistry

      // Функція-декоратор, що перевіряє наявність батьківської моделі
        function deleteComponent(key: ComponentDeleteKey, model: IdModelDel) {
          if (!employee.value) return
          handledeleteComponent(key, model, employee.value)
        }

      // Хендлер виклику модалки
      function handledeleteComponent<K extends ComponentDeleteKey>(
          key: K,
          model: IdModelDel,
          parent: Record<string, any>,
      ) {
        const cfg = ComponentDeleteRegistry[key]
        // Виклик модалки
        openConfirmDeleteModal({
          item: model,
          url: cfg.url(model.id),
          title: cfg.title,
          displayValue: cfg.display?.(model),
          onSaved: async () => {
            await store.fetchMeFullGet()
          },
        })
      }


  // Редагування Нотаток
    type IdModel = { id: number | string; notes?: string | null; is_personal?: boolean | false }

    // Формуємо реєстр змінних
      const NotesRegistry = {
        emails: {
          url: (id: IdModel["id"]) => `/components/email/${id}/`,
          title: "Нотатки до email:",
          display: (e: any) => e.email ?? "",
          maxlength: 1000,},
        phones: {
          url: (id: IdModel["id"]) => `/components/phone/${id}/`,
          title: "Нотатки до номеру телефону:",
          display: (p: any) => formatPhoneNumber(p.phone_number) ?? "",
          maxlength: 1000,},
        addresses: {
          url: (id: IdModel["id"]) => `/components/address/${id}/`,
          title: "Нотатки до адреси:",
          display: (p: any) => formatAddress(p) ?? "",
          maxlength: 1000,},
        } as const
      export type NotesKey = keyof typeof NotesRegistry

      // Функція-декоратор, що перевіряє наявність батьківської моделі
      function editNotes(key: NotesKey, model: IdModel) {
        if (!employee.value) return
        handleEditNotes(key, model, employee.value)
        }

      // Хендлер виклику модалки
        function handleEditNotes<K extends NotesKey>(
            key: K,
            model: IdModel,
            parent: Record<string, any>,
        ) {
          const cfg = NotesRegistry[key]
      // Виклик модалки
          openEditNotesModal({
            item: model,
            url: cfg.url(model.id),
            title: cfg.title,
            maxlength: cfg.maxlength,
            displayValue: cfg.display?.(model),
      // Оновлення DOM
            onSaved: (updated) => {
              const list = parent[key]
              if (!Array.isArray(list)) return
              parent[key] = list.map((x: any) =>
                  x.id === updated.id ? {...x, notes: updated.notes ?? null} : x
              )
            },
          })
        }

  // Зміна статусу персонального компонента
      type IdModelToggle = {
        id: number | string
        is_personal: boolean
      }

      type ToggleRegistryModel = IdModelToggle & Record<string, any>

      const ComponentPersonalRegistry = {
        emails: {
          url: (id: IdModelToggle["id"]) => `/components/email/${id}/`,
          title: "Змінити приватність email:",
          display: (e: any) => e.email ?? "",
        },
        phones: {
          url: (id: IdModelToggle["id"]) => `/components/phone/${id}/`,
          title: "Змінити приватність номера телефону:",
          display: (p: any) => formatPhoneNumber(p.phone_number) ?? "",
        },
        addresses: {
          url: (id: IdModelToggle["id"]) => `/components/address/${id}/`,
          title: "Змінити приватність адреси:",
          display: (a: any) => formatAddress(a) ?? "",
        },
      } as const

      export type ComponentPersonalKey = keyof typeof ComponentPersonalRegistry

      function toggleComponentPersonal(
          key: ComponentPersonalKey,
          model: IdModelToggle,
      ) {
        if (!employee.value) return
        handleToggleComponentPersonal(key, model)
      }

      function handleToggleComponentPersonal<K extends ComponentPersonalKey>(
          key: K,
          model: ToggleRegistryModel,
      ) {
        const cfg = ComponentPersonalRegistry[key]

        openConfirmPrivacyModal({
          item: model,
          url: cfg.url(model.id),
          isPersonalNow: model.is_personal,
          title: cfg.title,
          displayValue: cfg.display?.(model),
          onSaved: async () => {
            model.is_personal = !model.is_personal
            await store.fetchMeFullGet()
          },
          onError: (err) => {
            console.error(`Помилка зміни приватності (${String(key)}):`, err)
          },
        })
      }


  // Редагування URL в ЄРАУ
  function handleEditAttorneyUrl(employeeId: number, currentUrl: string | null) {
    openAttorneyUrlModal({
      employeeId,
      currentUrl,
      title: "Посилання на профіль адвоката в ЄРАУ",
      onSaved: async (newUrl) => {
        if (employee.value) employee.value.AttorneyUrl = newUrl
        await store.fetchMeFullGet()
      },
    })
  }

  // Глобальні коментарі
  type FeedbackOwner = { feedbacks?: FeedbackShortDTO[] | null }
  function handleOpenFeedbacks(
      entity: FeedbackOwner,
      opts: { employeeCode?: string | null; elementCode?: string | null; title: string },
  ) {

    if (!opts.employeeCode || !opts.elementCode) {
      console.warn("Cannot open feedbacks modal: missing codes", opts)
      return
    }
    openFeedbacksModal(
        () => entity.feedbacks ?? [],
        opts.employeeCode!,
        opts.elementCode!,
        opts.title,
        async () => {
          const employeeId = employee.value?.Id
          if (!employeeId) return
          await store.fetchMeFullGet()
        }
    )
  }

  // Редагувати документи адвоката (Свідоцтво/Посвідчення)
    // Тип даних, що передаються модалці
      type DocPayload = {
        Number: string | null
        Date: string | null
        Commission: string | null
        File: string | null
      }
    // Регістр даних, що передаються модалці з ключами
      const DocsRegistry = {
        license: {
          title: "Свідоцтво про право на зайняття адвокатською діяльністю",
          current: (e: EmployeeFullGet): DocPayload => ({
            Number: e.LicenseNumber,
            Date: e.LicenseDate,
            Commission: e.LicenseCommission,
            File: e.LicenseFile,
          }),
          fieldMap: {
            number: "series_number_license",
            date: "date_issued_license",
            commission: "issuing_organization_license",
            file: "attorney_license_file",
          },
        },
        certificate: {
          title: "Посвідчення адвоката",
          current: (e: EmployeeFullGet): DocPayload => ({
            Number: e.CertificateNumber,
            Date: e.CertificateDate,
            Commission: e.CertificateCommission,
            File: e.CertificateFile,
          }),
          fieldMap: {
            number: "series_number_certificate",
            date: "date_issued_certificate",
            commission: "issuing_organization_certificate",
            file: "attorney_certificate_file",
          },
        },
      } as const
      export type DocKey = keyof typeof DocsRegistry

    // Функція-декоратор, що перевіряє наявність батьківської моделі
      function editDoc(key: DocKey) {
        if (!employee.value) return
        handleEditDoc(key, employee.value)
      }

    // Хендлер виклику модалки
      function handleEditDoc<K extends DocKey>(key: K, e: EmployeeFullGet) {
        const cfg = DocsRegistry[key]

    // Виклик модалки
      openEditLicenseModal({
        employeeId: e.Id,
        title: cfg.title,
        current: cfg.current(e),
        fieldMap: cfg.fieldMap,

    // Оновлення DOM
        onSaved: async () => {
          await store.fetchMeFullGet()
        },
      })
    }

  // Редагувати Біографію
    function handleEditBiography(id: number) {
      openEditTextAreaModal({
        title: "Біографія працівника",
        id,
        patchUrl: `/person/employees/${id}/`,
        initialValue: employee.value?.Biography ?? "",
        fieldName: "info",
        maxlength: 10000,
        onSaved: (newValue) => {
          if (employee.value) employee.value.Biography = newValue
        },
      })
    }

  // ЗБІР MOUNT
  onMounted(() => store.fetchMeFullGet())
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
      <ContentContainer>
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
                size="md"
                alt="Фото працівника"
                title="Фото працівника"
                shadow="norm">
            </BaseImage>
            <ContentContainer padding="none" flex="column" no-background="true" style="min-height: 20vh; justify-content: space-between;">
              <ContentContainer
                  name="Контейнер з ПІБ, :(посадою та датою народження)"
                  flex="column"
                  padding="left"
                  style="margin-left: 1vw">

                <!-- ПІБ -->
                <span
                    class="title_string"
                    title="ПІБ працівника">
                      {{employee?.FullName
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
              <ContentContainer flex="row" padding="none" no-background="true" style="margin-top: auto; flex-wrap: wrap;">
                <BaseButton
                    size="md"
                    variant="tab"
                    :styleType="activeSection === 'contacts' ? 'primary' : 'secondary'"
                    @click="setActiveSection('contacts')"
                >
                  Контакти
                </BaseButton>

                <BaseButton
                    size="md"
                    variant="tab"
                    :styleType="activeSection === 'clients' ? 'primary' : 'secondary'"
                    @click="setActiveSection('clients')"
                >
                  Клієнти
                </BaseButton>

                <BaseButton
                    size="md"
                    variant="tab"
                    :styleType="activeSection === 'projects' ? 'primary' : 'secondary'"
                    @click="setActiveSection('projects')"
                >
                  Проекти
                </BaseButton>

                <BaseButton
                    size="md"
                    variant="tab"
                    :styleType="activeSection === 'tasks' ? 'primary' : 'secondary'"
                    @click="setActiveSection('tasks')"
                >
                  Задачі
                </BaseButton>
                <BaseButton
                    size="md"
                    variant="tab"
                    :styleType="activeSection === 'calendar' ? 'primary' : 'secondary'"
                    @click="setActiveSection('calendar')"
                >
                  Календар
                </BaseButton>
                <BaseButton
                    size="md"
                    variant="tab"
                    :styleType="activeSection === 'biography' ? 'primary' : 'secondary'"
                    @click="setActiveSection('biography')"
                >
                  Біографія
                </BaseButton>
              </ContentContainer>
              <BaseLine style="padding: 0; margin: 0"></BaseLine>
            </ContentContainer>
          </ContentContainer>

          <!-- КОНТАКТНА ІНФОРМАЦІЯ -->
          <ContentContainer padding="none" no-background="true" v-if="activeSection === 'contacts'">
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
                      size="sm"
                      :title="employee?.Id
                        ? `Прив'язати нову електронну пошту`
                        : `Неможливо визначити ID користувача`"
                      :disabled="!employee?.Id"
                      @click="handleEmailCreate(employee!.Id)">
                    <BaseImage size="icon" :src="NewImg"></BaseImage>
                  </BaseButton>
                </template>

                <BaseTableList v-if="visibleEmails
                                    ? visibleEmails.length > 0
                                    : false">>
                  <template #colgroup>
                    <col style="width:5%">
                    <col style="width:20%">
                    <col style="width:65%">
                    <col style="width:10%">
                  </template>
                  <template #tbody_rows>
                    <tr v-for="email in visibleEmails">
                      <td style="padding-left: 1vw">
                        <ContentContainer padding="none" flex="row" no-background="true">
                          <BaseImage
                              :src="EmailImg"
                              size="sm-icon"
                              alt="Електронна адреса співробітника">
                          </BaseImage>
                          <BaseImage
                              size="sm-icon"
                              :title="email.is_personal
                                ? 'Інші не бачать цю електронну адресу'
                                : 'Цю електронну адресу бачать інші'"
                              @click="toggleComponentPersonal('emails', email)"
                              :src="email.is_personal ? PrivateImg : PrivateNoImg">
                          </BaseImage>
                        </ContentContainer>
                      </td>
                      <td
                          class="important_text"
                          title="Адреса електронної пошти">
                        {{ email.email }}
                      </td>
                      <td class="collapse_string">
                        <ContentContainer
                            padding="none"
                            no-background="true"
                            v-if="email.notes"
                            :title="email.notes">
                          {{ email.notes }}
                        </ContentContainer>
                      </td>
                      <td>
                        <ContentContainer
                            padding="none"
                            flex="row"
                            no-background="true">
                          <BaseButton
                              name="Кнопка відправки електронного листа"
                              size="sm"
                              @click="sendEmail(email.email)"
                              :title="'Надіслати електронного листа на ' + email.email">
                            <BaseImage :src="EmailImg" size="icon"/>
                          </BaseButton>
                          <BaseButton
                              name="Кнопка перегляду глобальних коментарів"
                              size="sm"
                              :title="'Переглянути глобальні коментарі до ' + email.email"
                              alt="Кнопка глобальних коментарів"
                              @click="handleOpenFeedbacks(email, {
                                  title: email.email,
                                  employeeCode: employee?.global_code,
                                  elementCode: email.global_code,
                                })">
                            <ContentContainer
                                no-background="true"
                                padding="none"
                                divStyle="icon_wrapper">
                              <BaseImage :src="FeedbackImg" size="icon"></BaseImage>
                              <ContentContainer
                                  name="Контейнер ярлику лічильника коментарів на кнопці перегляду глобальних коментарів"
                                  :title="`Кількість глобальних коментарів для ` + email.email"
                                  padding="none"
                                  class="counter_badge"
                                  divStyle="counter_badge"
                                  v-if="email.feedbacks?.length > 0">
                                {{ email.feedbacks.length > 99 ? "99+" : email.feedbacks.length }}
                              </ContentContainer>
                            </ContentContainer>
                          </BaseButton>
                          <BaseButton
                              name="Кнопка видалення email"
                              size="sm"
                              @click="deleteComponent('emails', email)"
                              :title="'Видалити ' + email.email">
                            <BaseImage :src="DeleteImg" size="icon"/>
                          </BaseButton>
                          <BaseButton
                              name="Кнопка редагування нотаток"
                              size="sm"
                              @click="editNotes('emails', email)"
                              :title="`Редагувати нотатки до ` + email.email">
                            <BaseImage :src="EditImg" size="icon"/>
                          </BaseButton>
                        </ContentContainer>
                      </td>
                    </tr>
                  </template>
                </BaseTableList>
                <span
                    v-else
                    title="За особою не зареєстровано жодної електронної адреси"
                    class="text_no_data"
                > Відсутні дані про електронні адреси </span>
              </BaseCollapse>
              <BaseLine width="think"/>

              <!-- ТЕЛЕФОН -->
              <BaseCollapse
                  title="Телефон"
                  marginStyle="bottom_1vw">
                <template #actions>
                  <BaseButton
                      size="sm"
                      :title="employee?.Id
                        ? `Прив'язати новий контактний номер телефону`
                        : `Неможливо визначити ID користувача`"
                      :disabled="!employee?.Id"
                      @click="handlePhoneCreate(employee!.Id)">
                    <BaseImage size="icon" :src="NewImg"></BaseImage>
                  </BaseButton>
                </template>
                <BaseTableList v-if="visiblePhones
                                    ? visiblePhones.length > 0
                                    : false">>
                  <template #colgroup>
                    <col style="width:5%">
                    <col style="width:20%">
                    <col style="width:65%">
                    <col style="width:10%">
                  </template>
                  <template #tbody_rows>
                    <tr v-for="phone in visiblePhones">
                        <td style="padding-left: 1vw">
                          <ContentContainer padding="none" flex="row" no-background="true">
                            <BaseImage
                                :src="PhoneImg"
                                size="sm-icon"
                                alt="Телефонний номер співробітника">
                            </BaseImage>
                            <BaseImage
                                size="sm-icon"
                                :title="phone.is_personal
                                  ? 'Інші не бачать цей номер телефону'
                                  : 'Цей номер телефону бачать інші'"
                                @click="toggleComponentPersonal('phones', phone)"
                                :src="phone.is_personal ? PrivateImg : PrivateNoImg">
                            </BaseImage>
                          </ContentContainer>
                        </td>
                        <td
                            title="Контактний номер телефону"
                            class="important_text">
                          {{ formatPhoneNumber(phone.phone_number) }}
                        </td>
                        <td
                            :title="'Нотатки до номеру телефону '+ formatPhoneNumber(phone.phone_number)"
                            class="notes_string">
                          {{ phone.notes }}
                        </td>
                        <td>
                          <ContentContainer
                              padding="none"
                              flex="row"
                              no-background="true"
                              justifyContent="end">
                            <BaseButton
                                size="sm"
                                name="Кнопка перегляду глобальних коментарів"
                                :title="'Переглянути глобальні коментарі до ' + formatPhoneNumber(phone.phone_number)"
                                alt="Кнопка глобальних коментарів"
                                @click="handleOpenFeedbacks(phone, {
                                  title: formatPhoneNumber(phone.phone_number),
                                  employeeCode: employee?.global_code,
                                  elementCode: phone.global_code,
                                })">
                              <ContentContainer no-background="true" padding="none" divStyle="icon_wrapper">
                                <BaseImage :src="FeedbackImg" size="icon"></BaseImage>
                                <ContentContainer
                                    name="Контейнер ярлику лічильника коментарів на кнопці перегляду глобальних коментарів"
                                    :title="`Кількість глобальних коментарів для ` + formatPhoneNumber(phone.phone_number)"
                                    padding="none"
                                    class="counter_badge"
                                    divStyle="counter_badge"
                                    v-if="phone.feedbacks?.length > 0">
                                  {{ phone.feedbacks.length > 99 ? "99+" : phone.feedbacks.length }}
                                </ContentContainer>
                              </ContentContainer>
                            </BaseButton>
                            <BaseButton
                                name="Кнопка видалення номеру телефону"
                                size="sm"
                                @click="deleteComponent('phones', phone)"
                                :title="'Видалити ' + formatPhoneNumber(phone.phone_number)">
                              <BaseImage :src="DeleteImg" size="icon"/>
                            </BaseButton>
                            <BaseButton
                                size="sm"
                                name="Кнопка редагування нотаток"
                                :title="`Редагувати нотатки до ` + formatPhoneNumber(phone.phone_number)"
                                @click="editNotes('phones', phone)">
                              <BaseImage  :src="EditImg" size="icon"/>
                            </BaseButton>
                          </ContentContainer>
                        </td>
                    </tr>
                  </template>
                </BaseTableList>
                <span
                    v-else
                    title="За особою не зареєстровано жодного контактного номеру телефону"
                    class="text_no_data">
                    Відсутні дані про контактні номери телефону
                  </span>
              </BaseCollapse>
              <BaseLine width="think"/>

              <!-- АДРЕСА -->
              <BaseCollapse
                  title="Адреса"
                  name="Контейнер з адресою"
                  marginStyle="bottom_1vw">
                <template #actions>
                  <BaseButton
                      size="sm"
                      :title="employee?.Id
                        ? `Прив'язати нову адресу`
                        : `Неможливо визначити ID користувача`"
                      :disabled="!employee?.Id"
                      @click="handleAddressCreate(employee!.Id)">
                    <BaseImage size="icon" :src="NewImg"></BaseImage>
                  </BaseButton>
                </template>

                <BaseTableList
                    v-if="visibleAddresses
                                    ? visibleAddresses.length > 0
                                    : false">
                  <template #colgroup>
                    <col style="width:5%">
                    <col style="width:45%">
                    <col style="width:40%">
                    <col style="width:10%">
                  </template>
                  <template #tbody_rows>
                    <tr v-for="address in visibleAddresses">
                      <td style="padding-left: 1vw">
                        <ContentContainer padding="none" flex="row" no-background="true">
                          <BaseImage
                              :src="PhoneImg"
                              size="sm-icon"
                              alt="Aдреса співробітника">
                          </BaseImage>
                          <BaseImage
                              size="sm-icon"
                              :title="address.is_personal
                                ? 'Інші не бачать цю адресу'
                                : 'Цю адресу бачать інші'"
                              @click="toggleComponentPersonal('addresses', address)"
                              :src="address.is_personal ? PrivateImg : PrivateNoImg">
                          </BaseImage>
                        </ContentContainer>
                      </td>
                      <td
                          title="Адреса"
                          class="important_text"> {{
                          formatAddress(address)
                              ? formatAddress(address)
                              : "Помилка відображення адреси" }}
                      </td>
                      <td
                          :title="`Нотатки до адреси: ` + formatAddress(address)"
                          class="notes_string"> {{
                          address?.notes
                              ? address?.notes
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
                              name="Кнопка відкриття адреси на мапі"
                              @click="openInGoogleMaps(formatAddress(address))"
                              :title="`Показати на мапі адресу: ` + formatAddress(address)">
                            <BaseImage  :src="AddressImg" size="icon"/>
                          </BaseButton>
                          <BaseButton
                              size="sm"
                              name="Кнопка перегляду глобальних коментарів"
                              :title="'Переглянути глобальні коментарі до ' + formatAddress(address)"
                              alt="Кнопка глобальних коментарів"
                              @click="handleOpenFeedbacks(address, {
                                  title: formatAddress(address),
                                  employeeCode: employee?.global_code,
                                  elementCode: address.global_code,
                                })">
                            <ContentContainer no-background="true" padding="none" divStyle="icon_wrapper">
                              <BaseImage :src="FeedbackImg" size="icon"></BaseImage>
                              <ContentContainer
                                  name="Контейнер ярлику лічильника коментарів на кнопці перегляду глобальних коментарів"
                                  :title="`Кількість глобальних коментарів для ` + formatAddress(address)"
                                  padding="none"
                                  class="counter_badge"
                                  divStyle="counter_badge"
                                  v-if="address.feedbacks?.length > 0">
                                {{ address.feedbacks.length > 99 ? "99+" : address.feedbacks.length }}
                              </ContentContainer>
                            </ContentContainer>
                          </BaseButton>
                          <BaseButton
                              name="Кнопка видалення адреси"
                              size="sm"
                              @click="deleteComponent('addresses', address)"
                              :title="'Видалити ' + formatAddress(address)">
                            <BaseImage :src="DeleteImg" size="icon"/>
                          </BaseButton>
                          <BaseButton
                              size="sm"
                              @click="editNotes('addresses', address)"
                              name="Кнопка редагування нотаток"
                              :title="`Редагувати нотатки до ` + formatAddress(address)">
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
                                name="Кнопка переходу на профіль в ЄРАУ"
                                :title="employee?.AttorneyUrl
                                    ? 'Перейти на сторінку профілю адвоката в ЄРАУ: ' + employee?.AttorneyUrl
                                    : 'Профіль в ЄРАУ відсутній'"
                                :disabled="!employee?.AttorneyUrl"
                                @click="employee?.AttorneyUrl && openLink(employee.AttorneyUrl)"
                                size="sm">
                              <BaseImage  :src="UNBALink" size="icon"/>
                            </BaseButton>
                            <BaseButton
                                name="Кнопка редагування url-адреси до ЄРАУ"
                                title="Редагувати url-адресу до ЄРАУ"
                                size="sm"
                                @click="handleEditAttorneyUrl(employee.Id, employee?.AttorneyUrl)"
                                >
                              <BaseImage :src="EditImg" size="icon"/>
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
                                title="Реквізити Свідоцтва про право на зайняття адвокатською діяльністю"
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
                                name="Кнопка відкриття файлу Свідоцтва"
                                size="sm"
                                :disabled="!employee?.LicenseFile"
                                @click="employee?.LicenseFile && openLoadFile(employee.LicenseFile)"
                                :title="employee?.LicenseFile ? `Відкрити PDF-файл Свідоцтва` : 'PDF-файл Свідоцтва відсутній'">
                              <BaseImage  :src="OpenFile" size="icon"/>
                            </BaseButton>
                            <BaseButton
                                name="Кнопка завантаження файлу Свідоцтва"
                                size="sm"
                                :disabled="!employee?.LicenseFile"
                                @click="employee?.LicenseFile && openLoadFile(employee?.LicenseFile,{download: true})"
                                :title="employee?.LicenseFile ? `Завантажити PDF-файл Свідоцтва` : 'PDF-файл Свідоцтва відсутній'">
                              <BaseImage  :src="DownloadFile" size="icon"/>
                            </BaseButton>
                            <BaseButton
                                name="Кнопка редагування даних свідоцтва"
                                title="Редагувати дані Свідоцтва"
                                styleType="secondary"
                                size="sm"
                                @click="editDoc('license')"
                            >
                              <BaseImage :src="EditImg" size="icon" />
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
                                title="Реквізити посвідчення адвоката"
                                v-if="employee?.CertificateNumber"
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
                              name="Кнопки Посвідчення"
                              flex="row"
                              no-background="true"
                              padding="none">
                            <BaseButton
                                name="Кнопка відкриття файлу посвідчення"
                                size="sm"
                                :disabled="!employee?.CertificateFile"
                                @click="employee?.CertificateFile && openLoadFile(employee?.CertificateFile)"
                                :title="employee?.CertificateFile ? 'Відкрити PDF-файл Посвідчення' : 'PDF-файл Посвідчення відсутній'">
                              <BaseImage  :src="OpenFile" size="icon"/>
                            </BaseButton>
                            <BaseButton
                                name="Кнопка завантаження файлу посвідчення"
                                size="sm"
                                :disabled="!employee?.CertificateFile"
                                @click="employee?.CertificateFile && openLoadFile(employee?.CertificateFile,{download: true})"
                                :title="employee?.CertificateFile ? `Завантажити PDF-файл Посвідчення` : 'PDF-файл Посвідчення відсутній'">
                              <BaseImage  :src="DownloadFile" size="icon"/>
                            </BaseButton>
                            <BaseButton
                                name="Кнопка редагування даних свідоцтва"
                                title="Редагувати дані Свідоцтва"
                                styleType="secondary"
                                size="sm"
                                @click="editDoc('certificate')"
                            >
                              <BaseImage :src="EditImg" size="icon" />
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
          </ContentContainer>

          <!-- КЛІЄНТИ -->
          <ContentContainer v-else-if="activeSection === 'clients'">
            <p>КЛІЄНТИ</p>
          </ContentContainer>

          <!-- ПРОЕКТИ -->
          <ContentContainer v-else-if="activeSection === 'projects'">
            <p>ПРОЕКТИ</p>
          </ContentContainer>

          <!-- ЗАДАЧІ -->
          <ContentContainer v-else-if="activeSection === 'tasks'">
            <p>ЗАДАЧІ</p>
          </ContentContainer>

          <!-- КАЛЕНДАР-->
          <ContentContainer v-else-if="activeSection === 'calendar'">
            <p>КАЛЕНДАР</p>
          </ContentContainer>
        </ContentContainer>

        <!-- БІОГРАФІЯ -->
        <ContentContainer
            padding="none"
            no-background="true"
            v-if="activeSection === 'biography'"
            flex="row"
            grid="95% 5%">
          <ContentContainer class="prime_text_string" no-background="true" padding="top" v-if="employee?.Biography">
            {{ employee?.Biography }}
          </ContentContainer>
          <ContentContainer v-else class="text_no_data" no-background="true">
            Відсутні дані
          </ContentContainer>
          <ContentContainer
              padding="none"
              noBackground="true"
              flex="row"
              justifyContent="end"
              alignItems="start">
            <BaseButton
                name="Кнопка редагування біографії"
                title="Редагувати біографію"
                size="sm"
                @click="handleEditBiography(employee.Id)"
            >
              <BaseImage :src="EditImg" size="icon" />
            </BaseButton>
          </ContentContainer>
        </ContentContainer>

      </ContentContainer>
    </template>

    <!-- КОЛОНКА НАВІГАЦІЇ -->
    <template #main_column_right>
      <ContentContainer>
        <h1>RIGHT COLUMN</h1>
      </ContentContainer>
    </template>
  </Base>
</template>

<style src="@/styles/base.css">
</style>
