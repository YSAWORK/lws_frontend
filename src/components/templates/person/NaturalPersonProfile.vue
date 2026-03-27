<!-- .src/components/templates/person/NaturalPersonProfile.vue -->

<script setup lang="ts">
// ===== IMPORT TOOLS ===== //
  // import general
    import { onMounted, ref, watch, computed} from 'vue'
    import { storeToRefs } from 'pinia'
    import { useRoute } from 'vue-router'

  // import features
    import { formatDate } from "@/lib/format_data/formatDate";
    import { openLoadFile } from "@/lib/files/openLoadFile";
    import { sendEmail } from "@/lib/features/sendEmail";
    import { openInGoogleMaps} from "@/lib/features/openInGoogleMaps";
    import { formatPhoneNumber } from "@/lib/format_data/formatPhoneNumber";
    import { formatAddress } from "@/lib/format_data/formatAddress";
    import { getFileIcon } from "@/lib/files/getFileMeta";
    import { useTableQuery } from "@/lib/useTableQuery"
    import { isPreviewable } from "@/lib/files/getFileMeta"


// import base elements
    import Base from "@/components/templates/base.vue";
    import ContentContainer from "@/components/ui/ContentContainer.vue";
    import BaseImage from "@/components/ui/BaseImage.vue";
    import BaseLine from "@/components/ui/BaseLine.vue";
    import BaseButton from "@/components/ui/BaseButton.vue";
    import BaseCollapse from "@/components/ui/BaseCollapse.vue";
    import BaseTableList from "@/components/ui/BaseTableList.vue";
    import BaseThOption from "@/components/ui/BaseThOption.vue"

  // import images
    import OpenFile from "@/assets/img/open_file.svg";
    import DownloadFile from "@/assets/img/download.svg";
    import DefaultAvatar from "@/assets/img/default_avatar.jpg"
    import EmailImg from '@/assets/img/email.svg'
    import PhoneImg from '@/assets/img/phone.png'
    import AddressImg from '@/assets/img/address.png'
    import EditImg from '@/assets/img/edit.png'
    import FeedbackImg from '@/assets/img/feedback.svg'
    import DeleteImg from '@/assets/img/delete.svg'
    import NewImg from '@/assets/img/new.svg'
    import PrivateImg from '@/assets/img/private.svg'
    import PrivateNoImg from '@/assets/img/privateNo.svg'
    import NextImg from '@/assets/img/navigation/next.svg'
    import PrevImg from '@/assets/img/navigation/previous.svg'
    import OwnerYou from "@/assets/img/ownerYou.svg";
    import OwnerOther from "@/assets/img/ownerOther.svg";
    import LockOther from "@/assets/img/lock-other.svg"
    import LockTrue from "@/assets/img/lock-true.svg"
    import LockFalse from "@/assets/img/lock-false.svg"
    import ReminderOn from "@/assets/img/reminderOn.svg"
    import ReminderOff from "@/assets/img/reminderOff.svg"

  // import stores
    import { useNaturalPersonFullGetStore } from '@/stores/useNaturalPerson'
    import { useAuthStore } from "@/stores/auth"
    import { useEmployeeListStore } from "@/stores/useEmployeeList";

  // import modals
    import { openEditNotesModal } from "@/components/modals/global/editNotes/editNotesTs"
    import { openFeedbacksModal } from "@/components/modals/global/open&addFeedback/open&addFeedbackTs";
    import { openEditTextAreaModal } from "@/components/modals/global/editTextArea/editTextAreaTs"
    import { openCreateEmailModal } from "@/components/modals/components/createEmail/openCreateEmail"
    import { openCreatePhoneModal } from "@/components/modals/components/createPhone/openCreatePhone"
    import { openCreateAddressModal } from "@/components/modals/components/createAddress/openCreateAddress"
    import { openCreateDocumentModal } from "@/components/modals/components/createDocument/openCreateDocument"
    import { openConfirmDeleteModal } from "@/components/modals/global/confirmDelete/confirmDeleteTs";
    import { openConfirmPrivacyModal } from "@/components/modals/global/confirmPrivacy/confirmPrivacyTs"
    import { openEditDocumentModal } from "@/components/modals/components/editDocument/openEditDocument"
    import { openEditNaturalPersonInfoModal } from "@/components/modals/person/editNaturalPersonalInfo/openEditNaturalPersonalInfo"

// import types
    import type { FeedbackShortDTO } from "@/model_schemas/dto/feedback/feedback.dto";
    import {DocumentDTO, mapDocumentToEditDTO, } from "@/model_schemas/dto/components/document.dto";
    import { mapNaturalPersonFullToEditDTO } from "@/model_schemas/mapped/person/natural_person.mapped"

  // РОУТЕРИ
    const route = useRoute()

  // load API
    const authStore = useAuthStore()
    const { employeeId } = storeToRefs(authStore)
    const employeeListStore = useEmployeeListStore()
    const store = useNaturalPersonFullGetStore()
    const { naturalPerson } = storeToRefs(store)
    const personId = computed(() => Number(route.params.id))

    const currentEmployee = computed(() => {
          const currentEmployeeId = Number(employeeId.value)
          if (!Number.isFinite(currentEmployeeId)) return undefined
          return employeeListStore.getEmployeeById(currentEmployeeId)
        })
    watch(
        () => personId.value,
        async (newId) => {
          if (newId) {
            await store.fetchNaturalPersonFullGet(newId)
          }
        },
        { immediate: true } // завантажить дані відразу при вході на сторінку
    )


/// ФУНКЦІЇ
function getOwner(id: number | string): string {
  const employee = employeeListStore.getEmployeeById(Number(id))
  if (!employee) return ""
  return [employee.Position, employee.FullName].filter(Boolean).join(" ")
}

  // Блоки вкладки
    type SectionKey =
        | "biography"
        | "contacts"
        | "files"
        | "tasks"
        | "connections"
        | "notifications"
        | "notes"
        | "global_comments"

    const activeSection = ref<SectionKey>("biography")

    function setActiveSection(section: SectionKey) {
      activeSection.value = section
    }

  // Сортування
    const documents = computed<DocumentDTO[]>(() => {
      return (naturalPerson.value?.documents ?? []) as DocumentDTO[]
    })

    const {
      paginatedItems: sortedDocuments,
      columnFilters,
      setSort,
      getSortIndicator,
      setColumnFilter,
      setDateRangeFilter,
      currentPage,
      totalPages,
      nextPage,
      prevPage,
    } = useTableQuery(documents, {
      initialKey: "date",
      initialDirection: "desc",
      pageSize: 10,
      globalSearchKeys: ["name", "extension", "notes"],
      dateKeys: ["date"],
    })


  // Створення нового Email
    function handleEmailCreate() {
      if (!naturalPerson.value) return
      openCreateEmailModal({
        owner: { key: "app_person.Person", id: naturalPerson.value.id },
        onCreated: async () => {
          await store.fetchNaturalPersonFullGet(personId.value)
        },
      })
    }

  // Створення нового номеру телефону
    function handlePhoneCreate() {
      if (!naturalPerson.value) return
      openCreatePhoneModal({
        owner: { key: "app_person.Person", id: naturalPerson.value.id },
        onCreated: async () => {
          await store.fetchNaturalPersonFullGet(personId.value)
        },
      })
    }

  // Створення нової адреси
    function handleAddressCreate() {
      if (!naturalPerson.value) return
      openCreateAddressModal({
        owner: { key: "app_person.Person", id: naturalPerson.value.id },
        onCreated: async () => {
          await store.fetchNaturalPersonFullGet(personId.value)
        },
      })
    }

  // Створення нового файлу
  function handleDocumentCreate() {
    if (!naturalPerson.value) return
    openCreateDocumentModal({
      owner: { key: "app_person.Person", id: naturalPerson.value.id },
      onCreated: async () => {
        await store.fetchNaturalPersonFullGet(personId.value)
      },
    })
  }


  // Редагувати файл
  function handleDocumentEdit(document: DocumentDTO) {
    openEditDocumentModal({
      document: mapDocumentToEditDTO(document),
      onCreated: async () => {
        await store.fetchNaturalPersonFullGet(personId.value)
      },
    })
  }

  // Визначення можливості попереднього перегляду файлу
    function canPreview(document: DocumentDTO) {
      if (!document) return false
      return isPreviewable(document.extension)
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
      display: (p: any) => formatAddress(p) ?? "",},
    documents: {
      url: (id: IdModelToggle["id"]) => `/components/document/${id}/`,
      title: "Видалити документ",
      display: (d: any) => `${d.name ?? ""}${d.extension ?? ""}`,
    },
  } as const
  export type ComponentDeleteKey = keyof typeof ComponentDeleteRegistry

  // Функція-декоратор, що перевіряє наявність батьківської моделі
  function deleteComponent(key: ComponentDeleteKey, model: IdModelDel) {
    if (!naturalPerson.value) return
    handledeleteComponent(key, model, naturalPerson.value)
  }

  // Функція виклику модального вікна
  function handledeleteComponent<K extends ComponentDeleteKey>(
      key: K,
      model: IdModelDel,
      parent: Record<string, any>,
  ) {
    const cfg = ComponentDeleteRegistry[key]
    // Виклик модального вікна
    openConfirmDeleteModal({
      item: model,
      url: cfg.url(model.id),
      title: cfg.title,
      displayValue: cfg.display?.(model),
      onSaved: async () => {
        await store.fetchNaturalPersonFullGet(personId.value)
      },
    })
  }

import { ChangeOwnerKey, ChangeOwnerRegistry, ChangeOwnerModel } from "@/components/modals/global/changeOwner/changeOwnerRegistry"
import { openEditOwnerModal } from "@/components/modals/global/changeOwner/changeOwner"

// Редагування власника компонента
  // Функція-декоратор, що перевіряє наявність батьківської моделі
  function editOwner(key: ChangeOwnerKey, model: ChangeOwnerModel) {
    if (!naturalPerson.value) return
    handleEditOwner(key, model, naturalPerson.value)
  }

  // Функція виклику модального вікна
    function handleEditOwner<K extends ChangeOwnerKey>(
        key: K,
        model: ChangeOwnerModel,
        parent: Record<string, any>,
    ) {
      const cfg = ChangeOwnerRegistry[key]
      // Виклик модального вікна
      openEditOwnerModal({
        item: model,
        url: cfg.url(model.id),
        title: cfg.title,
        displayValue: cfg.display?.(model),
        // Оновлення DOM
        onSaved: async (updated) => {
          if (key === "natural_person") {
            parent.created_by = updated.created_by ?? null
            return
          }

          const list = parent[key]
          if (!Array.isArray(list)) return

          parent[key] = list.map((x: any) =>
              x.id === updated.id ? { ...x, created_by: updated.created_by ?? null } : x
          )
          await store.fetchNaturalPersonFullGet(personId.value)
        },
      })
    }



  // Редагування Нотаток
    type IdModel = {
      id: number | string
      notes?: string | null
      is_personal?: boolean
    }

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
      natural_person: {
        url: (id: IdModel["id"]) => `/person/natural_person/${id}/`,
        title: "Нотатки до фізичної особи:",
        display: (e: any) => e.FullName ?? "",
        maxlength: 10000,},
    } as const
    export type NotesKey = keyof typeof NotesRegistry

  // Функція-декоратор, що перевіряє наявність батьківської моделі
    function editNotes(key: NotesKey, model: IdModel) {
      if (!naturalPerson.value) return
      handleEditNotes(key, model, naturalPerson.value)
    }

  // Функція виклику модального вікна
    function handleEditNotes<K extends NotesKey>(
        key: K,
        model: IdModel,
        parent: Record<string, any>,
    ) {
      const cfg = NotesRegistry[key]
      // Виклик модального вікна
      openEditNotesModal({
        item: model,
        url: cfg.url(model.id),
        title: cfg.title,
        maxlength: cfg.maxlength,
        displayValue: cfg.display?.(model),
        // Оновлення DOM
        onSaved: async (updated) => {
          if (key === "natural_person") {
            parent.notes = updated.notes ?? null
            return
          }

          const list = parent[key]
          if (!Array.isArray(list)) return

          parent[key] = list.map((x: any) =>
              x.id === updated.id ? { ...x, notes: updated.notes ?? null } : x
          )
          await store.fetchNaturalPersonFullGet(personId.value)
        },
      })
    }

// Зміна статусу блокування компонента
  type IdModelBlockToggle = {
    id: number | string
    is_blocked: boolean
  }

  type ToggleRegistryBlockModel = IdModelBlockToggle & Record<string, any>

  const ComponentIsBlockedRegistry = {
    emails: {
      url: (id: IdModelBlockToggle["id"]) => `/components/email/${id}/`,
      title: "Змінити блокування email:",
      display: (e: any) => e.email ?? "",
    },
    phones: {
      url: (id: IdModelBlockToggle["id"]) => `/components/phone/${id}/`,
      title: "Змінити блокування номера телефону:",
      display: (p: any) => formatPhoneNumber(p.phone_number) ?? "",
    },
    addresses: {
      url: (id: IdModelBlockToggle["id"]) => `/components/address/${id}/`,
      title: "Змінити блокування адреси:",
      display: (a: any) => formatAddress(a) ?? "",
    },
    documents: {
      url: (id: IdModelBlockToggle["id"]) => `/components/document/${id}/`,
      title: "Змінити блокування файлу:",
      display: (d: any) => `${d.name ?? ""}${d.extension ?? ""}`,
    },
    natural_person: {
      url: (id: IdModelToggle["id"]) => `/person/natural_person/${id}/`,
      title: "Змінити блокування профайлу фізичної особи:",
      display: (n: any) => n.FullName ?? "",
    },
  } as const

  export type ComponentIsBlockedKey = keyof typeof ComponentIsBlockedRegistry

  function toggleComponentIsBlocked(
      key: ComponentIsBlockedKey,
      model: IdModelBlockToggle,
  ) {
    if (!naturalPerson.value) return
    handleToggleComponentIsBlocked(key, model)
  }

  function handleToggleComponentIsBlocked<K extends ComponentIsBlockedKey>(
      key: K,
      model: ToggleRegistryBlockModel,
  ) {
    const cfg = ComponentIsBlockedRegistry[key]

    openConfirmPrivacyModal({
      item: model,
      url: cfg.url(model.id),
      isStatusNow: model.is_blocked,
      title: cfg.title,
      field: "is_blocked",
      message: model.is_blocked
          ? "Ви впевнені, що хочете дозволити редагування/видалення елементу"
          : "Ви впевнені, що хочете заблокувати редагування/видалення елементу",
      displayValue: cfg.display?.(model),
      onSaved: async () => {
        model.is_blocked = !model.is_blocked
        await store.fetchNaturalPersonFullGet(personId.value)},
    })
  }

// Зміна статусу блокування компонента
  type IdModelToggle = {
    id: number | string
    is_personal: boolean
  }
  type ToggleRegistryModel = IdModelToggle & Record<string, any>

// Зміна статусу персонального компонента
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
  documents: {
    url: (id: IdModelToggle["id"]) => `/components/document/${id}/`,
    title: "Змінити приватність документу:",
    display: (d: any) => `${d.name ?? ""}${d.extension ?? ""}`,
  },
  natural_person: {
    url: (id: IdModelToggle["id"]) => `/person/natural_person/${id}/`,
    title: "Змінити приватність профайлу фізичної особи:",
    display: (n: any) => n.FullName ?? "",
  },
} as const

export type ComponentPersonalKey = keyof typeof ComponentPersonalRegistry

function toggleComponentPersonal(
    key: ComponentPersonalKey,
    model: IdModelToggle,
) {
  if (!naturalPerson.value) return
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
    isStatusNow: model.is_personal,
    title: cfg.title,
    displayValue: cfg.display?.(model),
    onSaved: async () => {
      model.is_personal = !model.is_personal
      await store.fetchNaturalPersonFullGet(personId.value)},
  })
}

// Глобальні коментарі
type FeedbackOwner = { feedbacks?: FeedbackShortDTO[] | null }
function handleOpenFeedbacks(
    entity: FeedbackOwner,
    opts: { employeeCode?: string | null; elementCode?: string | null; title: string },
) {

  if (!opts.employeeCode || !opts.elementCode) {
    return
  }
  openFeedbacksModal(
      () => entity.feedbacks ?? [],
      opts.employeeCode!,
      opts.elementCode!,
      opts.title,
      async () => {
        const employeeId = naturalPerson.value?.id
        if (!employeeId) return
        await store.fetchNaturalPersonFullGet(personId.value)
      }
  )
}

// Редагувати персональні дані
function handleEditPersonalInfo() {
  if (!store.naturalPersonDto) return
  openEditNaturalPersonInfoModal({
    personInfo: mapNaturalPersonFullToEditDTO(store.naturalPersonDto),
    onCreated: async () => {
      await store.fetchNaturalPersonFullGet(personId.value)
    },
  })
}

// Редагувати Біографію
function handleEditBiography(id: number) {
  openEditTextAreaModal({
    title: "Біографія працівника",
    id,
    patchUrl: `/person/natural_person/${id}/`,
    initialValue: naturalPerson.value?.Biography ?? "",
    fieldName: "info",
    maxlength: 10000,
    onSaved: (newValue) => {
      if (naturalPerson.value) {
        naturalPerson.value.Biography = newValue
      }
    },
  })
}


// ЗБІР MOUNT
onMounted(async () => {
  if (!employeeListStore.employeeList.length) {
    await employeeListStore.fetchEmployeeList()
  }
  await store.fetchNaturalPersonFullGet(personId.value)
})

</script>
<template>
  <Base>
    <!-- НАЗВА ВІКНА В ХЕДЕРІ -->
    <template #page_title>
      {{ naturalPerson?.FullName}}
    </template>

    <!-- ШЛЯХ В ХЕДЕРІ -->
    <template #path_bar>
      Головна | Фізичні особи
    </template>

    <template #main_column_left >
        <ContentContainer v-if="naturalPerson && (!naturalPerson.is_personal || currentEmployee?.IsAdmin || employeeId === naturalPerson.created_by)" padding="none">
          <ContentContainer padding="none" grid="1fr 6vw">
            <ContentContainer flex="row" padding="none" no-background="true" style="background: rgba(var(--bg-rgb), 0.8); margin-top: auto; flex-wrap: wrap;">
              <BaseButton
                  size="md"
                  variant="tab"
                  :styleType="activeSection === 'biography' ? 'primary' : 'secondary'"
                  @click="setActiveSection('biography')"
              >
                Біографія
              </BaseButton>

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
                  :styleType="activeSection === 'files' ? 'primary' : 'secondary'"
                  @click="setActiveSection('files')"
              >
                Файли
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
                  :styleType="activeSection === 'connections' ? 'primary' : 'secondary'"
                  @click="setActiveSection('connections')"
              >
                Зв'язки
              </BaseButton>

              <BaseButton
                  size="md"
                  variant="tab"
                  :styleType="activeSection === 'notifications' ? 'primary' : 'secondary'"
                  @click="setActiveSection('notifications')"
              >
                Нагадування
              </BaseButton>

              <BaseButton
                  size="md"
                  variant="tab"
                  :styleType="activeSection === 'notes' ? 'primary' : 'secondary'"
                  @click="setActiveSection('notes')"
              >
                Нотатки
              </BaseButton>

              <BaseButton
                  size="md"
                  variant="tab"
                  :styleType="activeSection === 'global_comments' ? 'primary' : 'secondary'"
                  @click="setActiveSection('global_comments')"
              >
                Коментарі
              </BaseButton>
            </ContentContainer>
            <ContentContainer padding="none" flex="row">
              <!-- ПРИВАТНІСТЬ -->
              <ContentContainer paddingStyle="0 0.5vw 0 0" style="min-width: 40px" noBackground="true">
                <BaseImage
                    v-if="employeeId === naturalPerson.created_by || currentEmployee?.IsAdmin"
                    paddingStyle="0"
                    cursorStyle="pointer"
                    size="icon"
                    :title="naturalPerson.is_personal
                                  ? 'Інші не бачать цю електронну адресу. Натисніть щоб змінити'
                                  : 'Цю електронну адресу бачать інші. Натисніть щоб змінити'"
                    @click="toggleComponentPersonal('natural_person', naturalPerson)"
                    :src="naturalPerson.is_personal ? PrivateImg : PrivateNoImg">
                </BaseImage>
              </ContentContainer>

              <!-- БЛОКУВАННЯ -->
              <ContentContainer paddingStyle="0 0.5vw 0 0" style="min-width: 40px" noBackground="true">
                <BaseImage
                    v-if="naturalPerson.is_blocked && naturalPerson.created_by !== employeeId && !currentEmployee?.IsAdmin"
                    title="Редагування/видалення заблоковано власником"
                    paddingStyle="0"
                    size="icon"
                    :src="LockOther">
                </BaseImage>
                <BaseImage
                    v-if="naturalPerson.created_by === employeeId || currentEmployee?.IsAdmin"
                    paddingStyle="0"
                    size="icon"
                    cursorStyle="pointer"
                    @click="toggleComponentIsBlocked('natural_person', naturalPerson)"
                    :title="naturalPerson.is_blocked
                                ? 'Ви заблокували редагування/видалення. Натисніть щоб змінити' : 'Ви дозволили редагування/видалення. Натисніть щоб змінити'"
                    :src="naturalPerson.is_blocked ? LockTrue : LockFalse">
                </BaseImage>
              </ContentContainer>

              <!-- ВЛАСНИК ЕЛЕМЕНТУ -->
              <ContentContainer padding="none" style="min-width: 40px" noBackground="true">
                <BaseImage
                    v-if="!currentEmployee?.IsAdmin"
                    size="icon"
                    paddingStyle="0"
                    :title="naturalPerson.created_by === employeeId
                                  ? 'Ви власник елемента'
                                  : 'Власник елемента: ' + getOwner(naturalPerson.created_by)"
                    :src="naturalPerson.created_by === employeeId ? OwnerYou : OwnerOther">
                </BaseImage>
                <BaseImage
                    v-if="currentEmployee?.IsAdmin"
                    size="icon"
                    paddingStyle="0"
                    cursorStyle="pointer"
                    :title="naturalPerson.created_by === employeeId
                                  ? 'Ви власник елемента. Натисніть, щоб змінити'
                                  : 'Власник елемента: ' + getOwner(naturalPerson.created_by) + '. Натисніть, щоб змінити'"
                    :src="naturalPerson.created_by === employeeId ? OwnerYou : OwnerOther">
                </BaseImage>
              </ContentContainer>
            </ContentContainer>
            <BaseLine style="padding: 0; margin: 0"></BaseLine>
          </ContentContainer>
          <!-- КОНТАКТНА ІНФОРМАЦІЯ -->
          <ContentContainer padding="left" no-background="true" v-if="activeSection === 'contacts'" flex="column">
              <!-- ЕЛЕКТРОННА ПОШТА -->
              <BaseCollapse
                  title="Електронна пошта"
                  name="Контейнер з електронною поштою"
                  marginStyle="bottom_1vw">
                <template #actions>
                  <BaseButton
                      size="sm"
                      :title="naturalPerson?.id
                        ? `Прив'язати нову електронну пошту`
                        : `Неможливо визначити ID користувача`"
                      :disabled="!naturalPerson?.id || naturalPerson.is_blocked"
                      @click="handleEmailCreate">
                    <BaseImage size="icon" :src="NewImg"></BaseImage>
                  </BaseButton>
                </template>

                <BaseTableList v-if="naturalPerson.emails && naturalPerson.emails.length > 0">
                  <template #colgroup>
                    <col style="width:5%">
                    <col style="width:20%">
                    <col style="width:65%">
                    <col style="width:10%">
                  </template>
                  <template #tbody_rows>
                    <tr v-for="email in naturalPerson.emails" :key="email.id">
                      <td style="padding-left: 1vw">
                        <ContentContainer padding="none" flex="row" no-background="true">

                          <!-- ІКОНКА ЕЛЕМЕНТУ -->
                          <ContentContainer padding="none" noBackground="true">
                            <BaseImage
                                :src="EmailImg"
                                size="sm-icon"
                                alt="Електронна адреса фізичної особи">
                            </BaseImage>
                          </ContentContainer>

                          <!-- ВЛАСНИК ЕЛЕМЕНТУ -->
                          <ContentContainer padding="none" style="min-width: 15px" noBackground="true">
                            <BaseImage
                                v-if="!currentEmployee?.IsAdmin"
                                size="sm-icon"
                                paddingStyle="0"
                                :title="email.created_by === employeeId
                                  ? 'Ви власник елемента'
                                  : 'Власник елемента: ' + getOwner(email.created_by)"
                                :src="email.created_by === employeeId ? OwnerYou : OwnerOther">
                            </BaseImage>
                            <BaseImage
                                v-if="currentEmployee?.IsAdmin"
                                size="sm-icon"
                                paddingStyle="0"
                                cursorStyle="pointer"
                                @click="editOwner('emails', email)"
                                :title="email.created_by === employeeId
                                  ? 'Ви власник елемента. Натисніть, щоб змінити'
                                  : 'Власник елемента: ' + getOwner(email.created_by) + '. Натисніть, щоб змінити'"
                                :src="email.created_by === employeeId ? OwnerYou : OwnerOther">
                            </BaseImage>
                          </ContentContainer>

                          <!-- БЛОКУВАННЯ -->
                          <ContentContainer padding="none" style="min-width: 15px" noBackground="true">
                              <BaseImage
                                  v-if="email.is_blocked && (email.created_by !== employeeId) && !currentEmployee?.IsAdmin"
                                  title="Редагування/видалення заблоковано власником"
                                  paddingStyle="0"
                                  size="sm-icon"
                                  :src="LockOther">
                              </BaseImage>
                              <BaseImage
                                  v-if="email.created_by === employeeId || currentEmployee?.IsAdmin"
                                  paddingStyle="0"
                                  size="sm-icon"
                                  cursorStyle="pointer"
                                  @click="toggleComponentIsBlocked('emails', email)"
                                  :title="email.is_blocked
                                ? 'Ви заблокували редагування/видалення. Натисніть щоб змінити' : 'Ви дозволили редагування/видалення. Натисніть щоб змінити'"
                                  :src="email.is_blocked ? LockTrue : LockFalse">
                              </BaseImage>
                          </ContentContainer>

                          <!-- ПРИВАТНІСТЬ -->
                          <ContentContainer padding="none" style="min-width: 15px" noBackground="true">
                              <BaseImage
                                  v-if="employeeId === email.created_by || currentEmployee?.IsAdmin"
                                  paddingStyle="0"
                                  cursorStyle="pointer"
                                  size="sm-icon"
                                  :title="email.is_personal
                                    ? 'Інші не бачать цю електронну адресу. Натисніть щоб змінити'
                                    : 'Цю електронну адресу бачать інші. Натисніть щоб змінити'"
                                  @click="toggleComponentPersonal('emails', email)"
                                  :src="email.is_personal ? PrivateImg : PrivateNoImg">
                              </BaseImage>
                          </ContentContainer>
                        </ContentContainer>
                      </td>
                      <td
                          class="important_text"
                          style="padding: 0 0 0 1vw"
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
                                  employeeCode: naturalPerson?.global_code,
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
                              :disabled="email.is_blocked || naturalPerson.is_blocked"
                              name="Кнопка видалення email"
                              size="sm"
                              @click="deleteComponent('emails', email)"
                              :title="email.is_blocked ? `Видалення заблоковано` : 'Видалити ' + email.email">
                            <BaseImage :src="DeleteImg" size="icon"/>
                          </BaseButton>
                          <BaseButton
                              :disabled="email.is_blocked || naturalPerson.is_blocked"
                              name="Кнопка редагування нотаток"
                              size="sm"
                              @click="editNotes('emails', email)"
                              :title="email.is_blocked ? `Редагування заблоковано` : `Редагувати нотатки до ` + email.email">
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
                      :title="naturalPerson?.id
                        ? `Прив'язати новий контактний номер телефону`
                        : `Неможливо визначити ID користувача`"
                      :disabled="!naturalPerson?.id || naturalPerson.is_blocked"
                      @click="handlePhoneCreate">
                    <BaseImage size="icon" :src="NewImg"></BaseImage>
                  </BaseButton>
                </template>
                <BaseTableList v-if="naturalPerson.phones && naturalPerson.phones.length > 0">
                  <template #colgroup>
                    <col style="width:5%">
                    <col style="width:20%">
                    <col style="width:65%">
                    <col style="width:10%">
                  </template>
                  <template #tbody_rows>
                    <tr v-for="phone in naturalPerson.phones" :key="phone.id">
                      <td style="padding-left: 1vw">
                        <ContentContainer padding="none" flex="row" no-background="true">

                          <!-- ІКОНКА ЕЛЕМЕНТУ -->
                          <ContentContainer padding="none" noBackground="true">
                            <BaseImage
                                :src="PhoneImg"
                                size="sm-icon"
                                alt="Телефонний номер фізичної особи">
                            </BaseImage>
                          </ContentContainer>

                          <!-- ВЛАСНИК ЕЛЕМЕНТУ -->
                          <ContentContainer padding="none" style="min-width: 15px" noBackground="true">
                            <BaseImage
                                v-if="!currentEmployee?.IsAdmin"
                                size="sm-icon"
                                paddingStyle="0"
                                :title="phone.created_by === employeeId
                                  ? 'Ви власник елемента'
                                  : 'Власник елемента: ' + getOwner(phone.created_by)"
                                :src="phone.created_by === employeeId ? OwnerYou : OwnerOther">
                            </BaseImage>
                            <BaseImage
                                v-if="currentEmployee?.IsAdmin"
                                size="sm-icon"
                                paddingStyle="0"
                                cursorStyle="pointer"
                                :title="phone.created_by === employeeId
                                  ? 'Ви власник елемента. Натисніть, щоб змінити'
                                  : 'Власник елемента: ' + getOwner(phone.created_by) + '. Натисніть, щоб змінити'"
                                :src="phone.created_by === employeeId ? OwnerYou : OwnerOther">
                            </BaseImage>
                          </ContentContainer>

                          <!-- БЛОКУВАННЯ -->
                          <ContentContainer padding="none" style="min-width: 15px" noBackground="true">
                            <BaseImage
                                v-if="phone.is_blocked && phone.created_by !== employeeId && !currentEmployee?.IsAdmin"
                                title="Редагування/видалення заблоковано власником"
                                paddingStyle="0"
                                size="sm-icon"
                                :src="LockOther">
                            </BaseImage>
                            <BaseImage
                                v-if="phone.created_by === employeeId || currentEmployee?.IsAdmin"
                                paddingStyle="0"
                                size="sm-icon"
                                cursorStyle="pointer"
                                @click="toggleComponentIsBlocked('phones', phone)"
                                :title="phone.is_blocked
                                ? 'Ви заблокували редагування/видалення. Натисніть щоб змінити' : 'Ви дозволили редагування/видалення. Натисніть щоб змінити'"
                                :src="phone.is_blocked ? LockTrue : LockFalse">
                            </BaseImage>
                          </ContentContainer>

                          <!-- ПРИВАТНІСТЬ -->
                          <ContentContainer padding="none" style="min-width: 15px" noBackground="true">
                            <BaseImage
                                v-if="employeeId === phone.created_by || currentEmployee?.IsAdmin"
                                paddingStyle="0"
                                cursorStyle="pointer"
                                size="sm-icon"
                                :title="phone.is_personal
                                  ? 'Інші не бачать цей номер телефону. Натисніть щоб змінити'
                                  : 'Цей номер телефону бачать інші. Натисніть щоб змінити'"
                                @click="toggleComponentPersonal('phones', phone)"
                                :src="phone.is_personal ? PrivateImg : PrivateNoImg">
                            </BaseImage>
                          </ContentContainer>
                        </ContentContainer>
                      </td>
                      <td
                          title="Контактний номер телефону"
                          style="padding: 0 0 0 1vw"
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
                                  employeeCode: naturalPerson?.global_code,
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
                              :disabled="phone.is_blocked || naturalPerson.is_blocked"
                              name="Кнопка видалення номеру телефону"
                              size="sm"
                              @click="deleteComponent('phones', phone)"
                              :title="phone.is_blocked ? `Видалення заблоковано` : 'Видалити ' + formatPhoneNumber(phone.phone_number)">
                            <BaseImage :src="DeleteImg" size="icon"/>
                          </BaseButton>
                          <BaseButton
                              :disabled="phone.is_blocked || naturalPerson.is_blocked"
                              size="sm"
                              name="Кнопка редагування нотаток"
                              :title="phone.is_blocked ? `Редагування заблоковано` : `Редагувати нотатки до ` + formatPhoneNumber(phone.phone_number)"
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
                      :title="naturalPerson?.id
                        ? `Прив'язати нову адресу`
                        : `Неможливо визначити ID користувача`"
                      :disabled="!naturalPerson?.id || naturalPerson.is_blocked"
                      @click="handleAddressCreate">
                    <BaseImage size="icon" :src="NewImg"></BaseImage>
                  </BaseButton>
                </template>

                <BaseTableList v-if="naturalPerson.addresses && naturalPerson.addresses.length > 0">
                  <template #colgroup>
                    <col style="width:5%">
                    <col style="width:45%">
                    <col style="width:40%">
                    <col style="width:10%">
                  </template>
                  <template #tbody_rows>
                    <tr v-for="address in naturalPerson.addresses" :key="address.id">
                      <td style="padding-left: 1vw">
                        <ContentContainer padding="none" flex="row" no-background="true">

                          <!-- ІКОНКА ЕЛЕМЕНТУ -->
                          <ContentContainer padding="none" noBackground="true">
                            <BaseImage
                                :src="PhoneImg"
                                size="sm-icon"
                                alt="Адреса фізичної особи">
                            </BaseImage>
                          </ContentContainer>

                          <!-- ВЛАСНИК ЕЛЕМЕНТУ -->
                          <ContentContainer padding="none" style="min-width: 15px" noBackground="true">
                            <BaseImage
                                v-if="!currentEmployee?.IsAdmin"
                                size="sm-icon"
                                paddingStyle="0"
                                :title="address.created_by === employeeId
                                  ? 'Ви власник елемента'
                                  : 'Власник елемента: ' + getOwner(address.created_by)"
                                :src="address.created_by === employeeId ? OwnerYou : OwnerOther">
                            </BaseImage>
                            <BaseImage
                                v-if="currentEmployee?.IsAdmin"
                                size="sm-icon"
                                paddingStyle="0"
                                cursorStyle="pointer"
                                :title="address.created_by === employeeId
                                  ? 'Ви власник елемента. Натисніть, щоб змінити'
                                  : 'Власник елемента: ' + getOwner(address.created_by) + '. Натисніть, щоб змінити'"
                                :src="address.created_by === employeeId ? OwnerYou : OwnerOther">
                            </BaseImage>
                          </ContentContainer>

                          <!-- БЛОКУВАННЯ -->
                          <ContentContainer padding="none" style="min-width: 15px" noBackground="true">
                            <BaseImage
                                v-if="address.is_blocked && address.created_by !== employeeId && !currentEmployee?.IsAdmin"
                                title="Редагування/видалення заблоковано власником"
                                paddingStyle="0"
                                size="sm-icon"
                                :src="LockOther">
                            </BaseImage>
                            <BaseImage
                                v-if="address.created_by === employeeId || currentEmployee?.IsAdmin"
                                paddingStyle="0"
                                size="sm-icon"
                                cursorStyle="pointer"
                                @click="toggleComponentIsBlocked('addresses', address)"
                                :title="address.is_blocked
                                ? 'Ви заблокували редагування/видалення. Натисніть щоб змінити' : 'Ви дозволили редагування/видалення. Натисніть щоб змінити'"
                                :src="address.is_blocked ? LockTrue : LockFalse">
                            </BaseImage>
                          </ContentContainer>

                          <!-- ПРИВАТНІСТЬ -->
                          <ContentContainer padding="none" style="min-width: 15px" noBackground="true">
                            <BaseImage
                                v-if="employeeId === address.created_by || currentEmployee?.IsAdmin"
                                paddingStyle="0"
                                cursorStyle="pointer"
                                size="sm-icon"
                                :title="address.is_personal
                                  ? 'Інші не бачать цю адресу. Натисніть щоб змінити'
                                  : 'Цю адресу бачать інші. Натисніть щоб змінити'"
                                @click="toggleComponentPersonal('addresses', address)"
                                :src="address.is_personal ? PrivateImg : PrivateNoImg">
                            </BaseImage>
                          </ContentContainer>
                        </ContentContainer>
                      </td>
                      <td
                          title="Адреса"
                          style="padding: 0 0 0 1vw"
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
                                  employeeCode: naturalPerson?.global_code,
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
                              :disabled="address.is_blocked || naturalPerson.is_blocked"
                              name="Кнопка видалення адреси"
                              size="sm"
                              @click="deleteComponent('addresses', address)"
                              :title="address.is_blocked ? `Видалення заблоковано` : 'Видалити ' + formatAddress(address)">
                            <BaseImage :src="DeleteImg" size="icon"/>
                          </BaseButton>
                          <BaseButton
                              :disabled="address.is_blocked || naturalPerson.is_blocked"
                              size="sm"
                              @click="editNotes('addresses', address)"
                              name="Кнопка редагування нотаток"
                              :title="address.is_blocked ? `Редагування заблоковано` : `Редагувати нотатки до ` + formatAddress(address)">
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

          <!-- ФАЙЛИ -->
          <ContentContainer
                padding="none"
                no-background="true"
                v-if="activeSection === 'files'">
              <ContentContainer class="prime_text_string" no-background="true" padding="none" v-if="naturalPerson && naturalPerson.documents.length > 0">
                  <BaseTableList variant="light">

                    <template #colgroup>
                      <col style="width:3%">
                      <col style="width:5%">
                      <col style="width:42%">
                      <col style="width:8%">
                      <col style="width:12%">
                      <col style="width:20%">
                      <col style="width:10%">
                    </template>

                    <template #thead_row>
                      <th colspan="2">
                        <BaseButton
                            size="sm"
                            :title="naturalPerson?.id
                        ? `Додати файл`
                        : `Неможливо визначити ID користувача`"
                            :disabled="!naturalPerson?.id || naturalPerson.is_blocked"
                            @click=" handleDocumentCreate">
                          <BaseImage size="icon" :src="NewImg"></BaseImage>
                        </BaseButton>
                      </th>
                      <BaseThOption
                          label="Назва файлу"
                          sort-key="name"
                          title="Сортувати за назвою файлу"
                          :set-sort="setSort"
                          :indicator="getSortIndicator('name')"
                          :set-column-filter="setColumnFilter"
                          searchPlaceholder="Пошук по назві файлу..."
                          searchable
                      />
                      <BaseThOption
                          label="Розмір"
                          sort-key="size"
                          :set-sort="setSort"
                          :indicator="getSortIndicator('size')"
                          align="center"
                      />
                      <BaseThOption
                          label="Дата"
                          sort-key="date"
                          :set-sort="setSort"
                          :indicator="getSortIndicator('date')"
                          align="center"
                          searchable
                          filter-type="date-range"
                          :date-from="columnFilters.date?.type === 'date-range' ? columnFilters.date.from : ''"
                          :date-to="columnFilters.date?.type === 'date-range' ? columnFilters.date.to : ''"
                          :set-date-range-filter="setDateRangeFilter"
                      />
                      <th>Нотатки</th>
                      <th>
                        <ContentContainer
                            padding="none"
                            flex="row"
                            justifyContent="center"
                            no-background="true">
                          <BaseButton
                              title="Попередні 10 файлів"
                              size="sm"
                              :disabled="currentPage === 1"
                              @click="prevPage">
                            <BaseImage
                            size="icon" :src="PrevImg"></BaseImage>
                          </BaseButton>

                          <ContentContainer
                              flex="row"
                              justifyContent="center"
                              padding="none"
                              alignItems="center"
                              no-background="true">
                            {{ currentPage }} | {{ totalPages }}
                          </ContentContainer>

                          <BaseButton
                              title="Наступні 10 файлів"
                              size="sm"
                              :disabled="currentPage === totalPages"
                              @click="nextPage">
                            <BaseImage
                                size="icon" :src="NextImg"></BaseImage>
                          </BaseButton>
                        </ContentContainer>
                      </th>
                    </template>

                    <template #tbody_rows>
                      <tr v-for="document in sortedDocuments" :key="document.id">
                        <!-- Іконка формату -->
                        <td style="padding-left: 1vw">
                          <BaseImage
                              size="sm-icon"
                              padding="none"
                              :title="`Тип файлу: ` + document.mime"
                              :src="getFileIcon(document.extension)"></BaseImage>
                        </td>

                        <!-- Іконка блокування -->
                        <td>
                          <ContentContainer padding="none" flex="row" no-background="true">
                            <!-- ВЛАСНИК ЕЛЕМЕНТУ -->
                            <ContentContainer padding="none" style="min-width: 15px" noBackground="true">
                              <BaseImage
                                  v-if="!currentEmployee?.IsAdmin"
                                  size="sm-icon"
                                  paddingStyle="0"
                                  :title="document.created_by === employeeId
                                  ? 'Ви власник елемента'
                                  : 'Власник елемента: ' + getOwner(document.created_by)"
                                  :src="document.created_by === employeeId ? OwnerYou : OwnerOther">
                              </BaseImage>
                              <BaseImage
                                  v-if="currentEmployee?.IsAdmin"
                                  size="sm-icon"
                                  paddingStyle="0"
                                  cursorStyle="pointer"
                                  :title="document.created_by === employeeId
                                  ? 'Ви власник елемента. Натисніть, щоб змінити'
                                  : 'Власник елемента: ' + getOwner(document.created_by) + '. Натисніть, щоб змінити'"
                                  :src="document.created_by === employeeId ? OwnerYou : OwnerOther">
                              </BaseImage>
                            </ContentContainer>

                            <!-- БЛОКУВАННЯ -->
                            <ContentContainer padding="none" style="min-width: 15px" noBackground="true">
                              <BaseImage
                                  v-if="document.is_blocked && document.created_by !== employeeId && !currentEmployee?.IsAdmin"
                                  title="Редагування/видалення заблоковано власником"
                                  paddingStyle="0"
                                  size="sm-icon"
                                  :src="LockOther">
                              </BaseImage>
                              <BaseImage
                                  v-if="document.created_by === employeeId || currentEmployee?.IsAdmin"
                                  paddingStyle="0"
                                  size="sm-icon"
                                  cursorStyle="pointer"
                                  @click="toggleComponentIsBlocked('documents', document)"
                                  :title="document.is_blocked
                                ? 'Ви заблокували редагування/видалення. Натисніть щоб змінити' : 'Ви дозволили редагування/видалення. Натисніть щоб змінити'"
                                  :src="document.is_blocked ? LockTrue : LockFalse">
                              </BaseImage>
                            </ContentContainer>

                            <!-- ПРИВАТНІСТЬ -->
                            <ContentContainer padding="none" style="min-width: 15px" noBackground="true">
                              <BaseImage
                                  v-if="employeeId === document.created_by || currentEmployee?.IsAdmin"
                                  paddingStyle="0"
                                  cursorStyle="pointer"
                                  size="sm-icon"
                                  :title="document.is_personal
                                  ? 'Інші не бачать файл. Натисніть щоб змінити'
                                  : 'Файл бачать інші. Натисніть щоб змінити'"
                                  @click="toggleComponentPersonal('documents', document)"
                                  :src="document.is_personal ? PrivateImg : PrivateNoImg">
                              </BaseImage>
                            </ContentContainer>
                          </ContentContainer>
                        </td>

                        <!-- Назва документу -->
                        <td>
                          <ContentContainer
                              class="prime_text_string"
                              no-background="true"
                              title="Назва документу"
                              paddingStyle="0 0 0 1vw">
                            {{ document.name}}{{document.extension}}
                          </ContentContainer>
                        </td>

                        <!-- Розмір документу -->
                        <td>
                          <ContentContainer
                              class="text_string"
                              no-background="true"
                              title="Розмір документу (в мегабайтах)"
                              padding="left">
                            {{ Number((document.size / (1024 * 1024)).toFixed(2))}} Mb
                          </ContentContainer>
                        </td>

                        <!-- Дата документу -->
                        <td>
                          <ContentContainer
                              padding="left"
                              title="Дата документу"
                              no-background="true"
                              class="text_string">
                            {{formatDate( document.date )}}
                          </ContentContainer>
                        </td>

                        <!-- Нотатки -->
                        <td class="text_no_data">
                          <ContentContainer
                              class="text_no_data hidden_text"
                              no-background="true"
                              :title="`Нотатки : ` + document.notes"
                              padding="none">
                            {{document.notes}}
                          </ContentContainer>
                        </td>

                        <!-- Кнопки -->
                        <td>
                          <ContentContainer
                              flex="row"
                              no-background="true"
                              padding="none">
                            <BaseButton
                                size="sm"
                                :disabled="!canPreview(document)"
                                @click="document.file && openLoadFile(document.file)"
                                :title="canPreview(document) ? 'Відкрити файл в браузері' : 'Формат файлу не підтримується браузером'">
                              <BaseImage  :src="OpenFile" size="icon"/>
                            </BaseButton>
                            <BaseButton
                                size="sm"
                                :disabled="!document.file"
                                @click="document.file && openLoadFile(document.file,{ download: true })"
                                :title="document.file ? `Завантажити файл` : 'Файл не знайдено'">
                              <BaseImage  :src="DownloadFile" size="icon"/>
                            </BaseButton>
                            <BaseButton
                                :disabled="document.is_blocked || naturalPerson.is_blocked"
                                title="Редагувати дані файлу"
                                size="sm"
                                @click="handleDocumentEdit(document)"
                            >
                              <BaseImage :src="EditImg" size="icon" />
                            </BaseButton>
                            <BaseButton
                                :disabled="document.is_blocked || naturalPerson.is_blocked"
                                name="Кнопка видалення документу"
                                size="sm"
                                @click="deleteComponent('documents', document)"
                                title="Видалити файл">
                              <BaseImage :src="DeleteImg" size="icon"/>
                            </BaseButton>

                          </ContentContainer>
                        </td>
                      </tr>

                    </template>
                  </BaseTableList>
              </ContentContainer>
              <ContentContainer v-else>
                <BaseButton
                    size="sm"
                    :title="naturalPerson?.id
                        ? `Додати файл`
                        : `Неможливо визначити ID користувача`"
                    :disabled="!naturalPerson?.id"
                    @click=" handleDocumentCreate">
                  <BaseImage size="icon" :src="NewImg"></BaseImage>
                </BaseButton>
                <ContentContainer  class="no_data_label" no-background="true" paddingStyle="11vw 0 0 0">
                  Файли відсутні
                </ContentContainer>
              </ContentContainer>
            </ContentContainer>

          <!-- НАГАДУВАННЯ -->
          <ContentContainer
              padding="none"
              no-background="true"
              v-if="activeSection === 'notifications'">
            <ContentContainer class="prime_text_string" no-background="true" padding="none" v-if="!naturalPerson">
              <BaseTableList variant="light">
              </BaseTableList>
            </ContentContainer>
            <ContentContainer v-else>
              <BaseButton
                  size="sm"
                  :title="naturalPerson?.id
                      ? `Додати нагадування`
                      : `Неможливо визначити ID користувача`"
                  :disabled="!naturalPerson?.id"
                  @click=" handleDocumentCreate">
                <BaseImage size="icon" :src="NewImg"></BaseImage>
              </BaseButton>
              <ContentContainer  class="no_data_label" no-background="true" paddingStyle="11vw 0 0 0">
                Нагадування відсутні
              </ContentContainer>
            </ContentContainer>
          </ContentContainer>

          <!-- НОТАТКИ -->
          <ContentContainer
              padding="left"
              no-background="true"
              v-if="activeSection === 'notes'"
              flex="row"
              grid="95% 5%">
            <ContentContainer class="prime_text_string" no-background="true" padding="top" v-if="naturalPerson?.notes" maxHeight="750px">
              {{ naturalPerson?.notes }}
            </ContentContainer>
            <ContentContainer  v-else class="no_data_label" no-background="true" paddingStyle="15vw 0 0 0">
              Нотатки відсутні
            </ContentContainer>
            <ContentContainer
                padding="none"
                noBackground="true"
                flex="row"
                justifyContent="end"
                alignItems="start">
              <BaseButton
                  name="Кнопка редагування нотаток"
                  title="Редагувати нотатки"
                  size="sm"
                  :disabled="naturalPerson.is_blocked"
                  v-if="naturalPerson"
                  @click="editNotes('natural_person', {id: naturalPerson.id, notes: naturalPerson.notes})"
              >
                <BaseImage :src="EditImg" size="icon" />
              </BaseButton>
            </ContentContainer>
          </ContentContainer>

          <!-- ГЛОБАЛЬНІ КОМЕНТАРІ -->
          <ContentContainer
              padding="left"
              no-background="true"
              v-if="activeSection === 'global_comments'"
              flex="row"
              grid="95% 5%">
            <ContentContainer
                v-if="naturalPerson && naturalPerson?.feedbacks?.length > 0"
                padding="top"
                no-background="true"
                maxHeight="750px">
              <ContentContainer
                  v-for="feedback in naturalPerson?.feedbacks"
                  :key="feedback.id"
                  no-background="true"
                  padding="bottom">
                <div class="important_text" title="Дата публікації коментаря"> {{ formatDate(feedback.created_at) }} </div>
                <div class="prime_text_string"> {{ feedback.notes ?? "—" }} </div>
                <BaseLine width="think"></BaseLine>
              </ContentContainer>
            </ContentContainer>
            <ContentContainer  v-else class="no_data_label" no-background="true" paddingStyle="15vw 0 0 0">
              Глобальні коментарі відсутні
            </ContentContainer>
            <ContentContainer
                padding="none"
                no-background="true"
                flex="row"
                justifyContent="end"
                alignItems="start">
              <BaseButton
                  title="Додати глобальний коментар"
                  size="sm"
                  @click="handleOpenFeedbacks(naturalPerson, {
                title: naturalPerson.FullName,
                employeeCode: naturalPerson.global_code,
                elementCode:  naturalPerson.global_code,
                })"
              >
                <BaseImage :src="NewImg" size="icon" />
              </BaseButton>
            </ContentContainer>
          </ContentContainer>

          <!-- БІОГРАФІЯ -->
          <ContentContainer
              v-if="activeSection === 'biography'"
              padding="none"
              no-background="true">
            <ContentContainer maxHeight="750px">
                <ContentContainer
                    grid="15vw 1fr 3vw"
                    paddingStyle="0 0 1vw 0">

                  <!-- ФОТО -->
                  <BaseImage
                      :src="naturalPerson?.Avatar
                    ? naturalPerson?.Avatar
                    : DefaultAvatar"
                      size="lg"
                      alt="Фото фізичної особи"
                      title="Фото фізичної особи"
                      shadow="norm">
                  </BaseImage>
                  <ContentContainer padding="none" flex="column" no-background="true" style="min-height: 20vh; justify-content: space-between;">
                    <ContentContainer
                        flex="column"
                        padding="left"
                        style="margin-left: 1vw">

                      <!-- ПІБ -->
                        <span
                          class="title_string"
                          title="ПІБ фізичної особи">
                          {{naturalPerson?.FullName
                                ? naturalPerson?.FullName
                                : 'Відсутні дані'}}
                        </span>
                      <BaseLine size="half"></BaseLine>

                      <!-- ДАТА НАРОДЖЕННЯ -->
                      <ContentContainer
                          name="Контейнер з датою народження"
                          flex="row"
                          style="min-height: 2vw"
                          padding="string">
                        <span class="chapter_title"> Дата народження: </span>
                        <span
                            class="subtitle_string_name_h2"
                            title="Дата народження фізичної особи"> {{
                            naturalPerson?.Birthday
                                ? formatDate(naturalPerson?.Birthday)
                                : "Відсутні дані"}}
                        </span>
                      </ContentContainer>

                      <!-- ПОДАТКОВИЙ НОМЕР -->
                      <ContentContainer
                          flex="row"
                          style="min-height: 2vw"
                          padding="string">
                        <span class="chapter_title"> Реєстраційний номер: </span>
                        <span
                            class="subtitle_string_name_h2"
                            title="Податковий номер фізичної особи"> {{
                            naturalPerson?.TaxId
                                ? naturalPerson?.TaxId
                                : "Відсутні дані"}}
                        </span>
                      </ContentContainer>

                      <!-- ПАСПОРТ -->
                      <ContentContainer
                          flex="row"
                          style="min-height: 2vw"
                          padding="string">
                        <span class="chapter_title"> Паспортні дані: </span>
                        <span
                            class="subtitle_string_name_h2"
                            title="Паспортні дані фізичної особи"> {{
                            naturalPerson?.Passport
                                ? naturalPerson?.Passport
                                : "Відсутні дані"}}
                        </span>
                      </ContentContainer>

                    </ContentContainer>
              </ContentContainer>
                  <ContentContainer
                      padding="none"
                      flex="column"
                      noBackground="true">
                    <BaseButton
                        :disabled="naturalPerson.is_blocked"
                        name="Кнопка редагування персональних даних"
                        title="Редагувати персональні дані"
                        size="sm"
                        @click="handleEditPersonalInfo"
                    >
                      <BaseImage :src="EditImg" size="icon" />
                    </BaseButton>
                    <BaseButton
                        size="sm">
                      <BaseImage size="icon" :src="ReminderOff"></BaseImage>
                    </BaseButton>
                  </ContentContainer>
                </ContentContainer>
              <BaseLine></BaseLine>
              <ContentContainer grid="1fr 3vw" padding="none">
                <ContentContainer padding="none">
                  <ContentContainer class="chapter_title" padding="left">
                    Біографія
                  </ContentContainer>
                  <ContentContainer class="prime_text_string" no-background="true" v-if="naturalPerson?.Biography">
                    {{ naturalPerson?.Biography }}
                  </ContentContainer>
                  <ContentContainer v-else class="text_no_data" no-background="true">
                    Відсутні дані
                  </ContentContainer>
                </ContentContainer>
                <ContentContainer
                    padding="none"
                    noBackground="true">
                  <BaseButton
                      :disabled="naturalPerson.is_blocked"
                      name="Кнопка редагування біографії"
                      title="Редагувати біографію"
                      size="sm"
                      @click="handleEditBiography(naturalPerson.id)"
                  >
                    <BaseImage :src="EditImg" size="icon" />
                  </BaseButton>
                </ContentContainer>
              </ContentContainer>
            </ContentContainer>
      </ContentContainer>
      </ContentContainer>

      <!-- КОНТЕЙНЕР ПРИВАТНОГО ЕЛЕМЕНТА -->
      <ContentContainer v-else class="chapter_title" paddingStyle="5vw 15vw 0 15vw" style="text-align: center;">
          <span class="subtitle_string_type_h2">Профіль захищено налаштуваннями приватності</span><br>
          <BaseLine size="full"></BaseLine><br>
          Для доступу зверніться до власника: <span class="subtitle_string_type_h2">{{ getOwner(naturalPerson ? naturalPerson.created_by : "")}}</span>, <br>
          або працівника з рівнем доступу <span class="subtitle_string_type_h2">Адміністратор</span>
      </ContentContainer>

    </template>

    <!-- КОЛОНКА НАВІГАЦІЇ -->
    <template #main_column_right>
      <ContentContainer no-background="true">
        <h1>RIGHT COLUMN</h1>
      </ContentContainer>
    </template>
  </Base>
</template>