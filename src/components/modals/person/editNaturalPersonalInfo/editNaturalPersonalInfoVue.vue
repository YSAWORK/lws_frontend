<!-- .src/components/modals/person/editNaturalPersonalInfo/editNaturalPersonalInfoVue.vue -->

<script setup lang="ts">
// IMPORT TOOLS
import { ref, computed } from "vue"

// import types
import type {NaturalPersonEditDTO } from "@/model_schemas/dto/person/natural_person.dto";

// import modals
import { useEditNaturalPersonInfoModal } from "@/components/modals/person/editNaturalPersonalInfo/editNaturalPersonalInfoTs"

// import features
import {getFileMeta, isPreviewable, extractExtension} from "@/lib/files/getFileMeta"
import {openLoadFile} from "@/lib/files/openLoadFile";
import {useObjectUrlPreview} from "@/lib/files/useObjectUrlPreview";

// import base elements
import ContentContainer from "@/components/ui/ContentContainer.vue"
import BaseInput from "@/components/ui/BaseInput.vue"
import BaseButton from "@/components/ui/BaseButton.vue"
import BaseFileButton from "@/components/ui/BaseFileButton.vue"
import BaseLine from "@/components/ui/BaseLine.vue"
import OpenFile from "@/assets/img/open_file.svg";
import BaseImage from "@/components/ui/BaseImage.vue";


const props = defineProps<{ personInfo: NaturalPersonEditDTO }>()
const emit = defineEmits<{
  (e: "close"): void
  (e: "created"): void
}>()


/// ПОТОЧНІ ДАНІ
  // Отримання вхідних даних
  const vm = useEditNaturalPersonInfoModal(props.personInfo, emit)

  // Змінна з даними поточного файлу
  const initialData = structuredClone(props.personInfo)

  // Функція перевірки можливості preview поточного файлу
  function IsCurrentAvatarPreviewable() {
    if (!initialData.avatar) return
    const expt = extractExtension(initialData.avatar)
    isPreviewable(expt)
  }

  // Функція відкриття preview поточного файлу Avatar
  function openCurrentFile() {
    if (!initialData.avatar) return
    openLoadFile(initialData.avatar)
  }

/// НОВИЙ ФАЙЛ
// Змінні нового файлу
const newFileMeta = ref<ReturnType<typeof getFileMeta> | null>(null)
const newFile = ref<File | null>(null)
const { objectUrl: newFileObjectUrl } = useObjectUrlPreview(newFile)


// Отримання даних нового файлу
function onFilePicked(file: File | null) {
  if (!file) return
  const meta = getFileMeta(file)
  if (meta.group === "image") {
    newFile.value = file
    newFileMeta.value = meta
    vm.form.value.avatar_file = file
    vm.errors.value.fields.avatar = []
  } else {
    vm.errors.value.fields.avatar = ["Обраний файл не є зображенням, оберіть інший"]
  }
}

// Функція відкриття preview нового файлу
function openPickedFile() {
  if (!newFileObjectUrl.value) return
  openLoadFile(newFileObjectUrl.value)
}

// Функція скидання обраного файлу
function clearPickedFile() {
  newFile.value = null
  newFileMeta.value = null
  vm.form.value.avatar_file = null
  vm.form.value.avatar = initialData.avatar
}


/// ДОПОМІЖНІ ФУНКЦІЇ
// Нормалізація формату розширення файлу
const normalizeExt = (ext?: string | null) =>
    (ext ?? "").replace(".", "").toLowerCase()


// Контроль змін даних
const isDirty = computed(() => {
  return (
      vm.form.value.first_name !== initialData.first_name ||
      vm.form.value.last_name !== initialData.last_name ||
      vm.form.value.surname !== initialData.surname ||
      vm.form.value.register_id !== initialData.register_id ||
      vm.form.value.date_birth !== initialData.date_birth ||
      vm.form.value.passport !== initialData.passport ||
      vm.form.value.avatar !== initialData.avatar ||
      !!vm.form.value.avatar_file
  )
})

// Функція скидання всіх внесених змін
function backToInitialData() {
  Object.assign(vm.form.value, structuredClone(initialData))
  vm.form.value.avatar_file = null
  newFile.value = null
  newFileMeta.value = null
}
</script>

<template>
  <!-- TEMPLATE (editDocumentVue.vue)-->
  <div class="modal_overlay">
    <div class="modal_box">
      <ContentContainer maxHeight="90vh" padding="none" flex="column">
        <h3 class="chapter_title" style="text-align: center; padding: 0;">
          Редагування персональних даних <br>
          <span class="prime_text_string">{{ initialData.last_name }} {{ initialData.first_name }} {{ initialData.surname }}</span>
        </h3>
        <BaseLine width="bold" size="auto"></BaseLine>
        <ContentContainer padding="top">

  <!-- ПРІЗВИЩЕ -->
          <BaseInput
              placeholder="Іванов"
              size="auto"
              grid="9vw 1fr"
              v-model="vm.form.value.last_name">
            Прізвище
          </BaseInput>
          <ContentContainer
              v-if="vm.errors.value.fields.last_name?.length"
              padding="none"
              class="info-container">
            {{ vm.errors.value.fields.last_name[0] }}
          </ContentContainer>

<!-- ІМ'Я -->
          <BaseInput
              placeholder="Іван"
              size="auto"
              grid="9vw 1fr"
              v-model="vm.form.value.first_name">
            Ім'я
          </BaseInput>
          <ContentContainer
              v-if="vm.errors.value.fields.first_name?.length"
              padding="none"
              class="info-container">
            {{ vm.errors.value.fields.first_name[0] }}
          </ContentContainer>

<!-- ПО-БАТЬКОВІ -->
          <BaseInput
              placeholder="Іванович"
              size="auto"
              grid="9vw 1fr"
              v-model="vm.form.value.surname">
            <span class="label-block">
              <span>По-батькові</span>
              <span class="note_block">(за наявності)</span>
            </span>
          </BaseInput>
          <ContentContainer
              v-if="vm.errors.value.fields.surname?.length"
              padding="none"
              class="info-container">
            {{ vm.errors.value.fields.surname[0] }}
          </ContentContainer>

<!-- ПОДАТКОВИЙ НОМЕР -->
          <BaseInput
              title="Реєстраційний номер облікової картки платника податків, або аналог податкового коду для нерезидентів"
              placeholder="3207819545"
              size="auto"
              grid="9vw 1fr"
              v-model="vm.form.value.register_id">
            <span class="label-block">
              <span>РНОКПП</span>
              <span class="note_block">(опціонально)</span>
            </span>
          </BaseInput>
          <ContentContainer
              v-if="vm.errors.value.fields.register_id?.length"
              padding="none"
              class="info-container">
            {{ vm.errors.value.fields.register_id[0] }}
          </ContentContainer>

<!-- ДАТА НАРОДЖЕННЯ -->
          <BaseInput
              title="Дата народження"
              grid="9vw 1fr"
              paddingStyle="0 0 0 1vw"
              size="25"
              v-model="vm.form.value.date_birth"
              type="date">
            <span class="label-block">
              <span>Дата народження</span>
              <span class="note_block">(опціонально)</span>
            </span>
          </BaseInput>
          <ContentContainer
              v-if="vm.errors.value.fields.date_birth?.length"
              padding="none"
              class="info-container">
            {{ vm.errors.value.fields.date_birth[0] }}
          </ContentContainer>

<!-- ПАСПОРТ -->
          <BaseInput
              title="Серія та номер основного паспорту, ким/коли виданий"
              placeholder="ВК 234567 від 23.04.1986, виданий Броварським РВ УМВС України "
              size="auto"
              grid="9vw 1fr"
              v-model="vm.form.value.passport">
            <span class="label-block">
              <span>Паспорт</span>
              <span class="note_block">(опціонально)</span>
            </span>
          </BaseInput>
          <ContentContainer
              v-if="vm.errors.value.fields.passport?.length"
              padding="none"
              class="info-container">
            {{ vm.errors.value.fields.passport[0] }}
          </ContentContainer>

          <BaseLine size="auto"></BaseLine>

<!-- ФОТО -->
          <ContentContainer padding="left" grid="9vw 1fr">
            <ContentContainer
                padding="none"
                class="important_text" text-align="left">
              Фото
            </ContentContainer>
            <ContentContainer padding="none">
              <ContentContainer padding="none" grid="9vw 3vw 1fr">
                <ContentContainer padding="none" class="important_no_data_text">Поточний файл</ContentContainer>
                <BaseButton
                    :disabled="!IsCurrentAvatarPreviewable"
                    @click="openCurrentFile"
                    size="sm">
                  <BaseImage  :src="OpenFile" size="icon"/>
                </BaseButton>
                <BaseFileButton
                    @pickedOne="onFilePicked"
                    size="lg">
                  Обрати інше фото
                </BaseFileButton>
              </ContentContainer>
              <BaseLine width="think" size="auto"></BaseLine>
              <ContentContainer
                  v-if="newFile"
                  padding="none"
                  grid="9vw 1fr">
                <ContentContainer padding="none" class="important_no_data_text">Новий файл</ContentContainer>
                <ContentContainer padding="none">
                  <ContentContainer padding="none" grid="3vw 1fr">
                    <BaseButton
                        :disabled="!newFileMeta?.previewable"
                        @click="openPickedFile"
                        size="sm">
                      <BaseImage  :src="OpenFile" size="icon"/>
                    </BaseButton>
                    <BaseButton
                        @click="clearPickedFile"
                        size="lg">
                      Скасувати вибір
                    </BaseButton>
                  </ContentContainer>
                  <ContentContainer padding="none" class="notes_string">
                    Ім'я: {{ newFileMeta?.baseName}}.{{ normalizeExt(newFileMeta?.extension)}} <br>
                    Розмір: {{ newFileMeta?.sizeFormatted}}
                  </ContentContainer>
                </ContentContainer>
              </ContentContainer>
              <ContentContainer
                  v-if="vm.errors.value.fields.avatar?.length"
                  padding="none"
                  class="info-container">
                {{ vm.errors.value.fields.avatar[0] }}
              </ContentContainer>
          </ContentContainer>
        </ContentContainer>
        </ContentContainer>


        <p v-if="vm.errors.value.nonField.length" class="form-error">
          {{ vm.errors.value.nonField[0] }}
        </p>

        <!-- КНОПКИ УПРАВЛІННЯ -->
        <BaseLine width="bold" size="auto"></BaseLine>
        <ContentContainer padding="none" justifyContent="center" flex="row" no-background="true">
          <BaseButton
              title="Скинути всі зміни"
              @click="backToInitialData"
              :disabled="vm.isSubmitting.value || !isDirty"
              size="lg">
            Скинути зміни
          </BaseButton>
          <BaseButton
              title="Зберегти новий файл"
              size="lg"
              @click="vm.submit"
              :disabled="vm.isSubmitting.value || !isDirty">
            Зберегти
          </BaseButton>
          <BaseButton
              title="Закрити вікно без змін"
              size="lg"
              @click="$emit('close')">
            Скасувати
          </BaseButton>
        </ContentContainer>
      </ContentContainer>
    </div>
  </div>
</template>