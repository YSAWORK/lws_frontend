<!-- .src/components/modals/components/createDocument/createDocumentVue.vue -->

<script setup lang="ts">
  // IMPORT TOOLS
  import {ref, onMounted, } from "vue"

  // import types
    import type { OwnerDTO } from "@/model_schemas/dto/person/owner.dto"

  // import modals
    import { useCreateDocumentModal } from "@/components/modals/components/createDocument/createDocumentTs"

  // import features
    import {getFileMeta, } from "@/lib/files/getFileMeta"
    import {useObjectUrlPreview} from "@/lib/files/useObjectUrlPreview";
    import {openLoadFile} from "@/lib/files/openLoadFile";

  // import base elements
    import ContentContainer from "@/components/ui/ContentContainer.vue"
    import BaseInput from "@/components/ui/BaseInput.vue"
    import BaseButton from "@/components/ui/BaseButton.vue"
    import BaseTextArea from "@/components/ui/BaseTextArea.vue"
    import BaseFileButton from "@/components/ui/BaseFileButton.vue"
    import BaseLine from "@/components/ui/BaseLine.vue"
    import OpenFile from "@/assets/img/open_file.svg";
    import BaseImage from "@/components/ui/BaseImage.vue";
    import BaseToggle from "@/components/ui/BaseToggle.vue";

    // import images
    import PrivateImg from '@/assets/img/private.svg'
    import PrivateNoImg from '@/assets/img/privateNo.svg'
    import LockOther from "@/assets/img/lock-other.svg"
    import LockFalse from "@/assets/img/lock-false.svg"

const props = defineProps<{ owner: OwnerDTO, }>()
const emit = defineEmits<{
  (e: "close"): void
  (e: "created"): void
}>()

const vm = useCreateDocumentModal(props.owner, emit)

/// ДАННІ ФАЙЛУ
  // Змінні файлу
    const fileMeta = ref<ReturnType<typeof getFileMeta> | null>(null)
    const fileItem = ref<File | null>(null)
    const { objectUrl: fileObjectUrl } = useObjectUrlPreview(fileItem)

  // Отримання даних файлу
    function onFilePicked(file: File | null) {
      if (!file) return
      const meta = getFileMeta(file)
      fileMeta.value = meta
      fileItem.value = file
      vm.form.value.file = file
      vm.form.value.name = meta.baseName
      vm.form.value.extension = normalizeExt(meta.extension)
      }

  // Функція відкриття preview файлу
    function openPickedFile() {
      if (!fileObjectUrl.value) return
      openLoadFile(fileObjectUrl.value)
    }

/// ДОПОМІЖНІ ФУНКЦІЇ
  // Нормалізація формату розширення файлу
    const normalizeExt = (ext?: string | null) =>
        (ext ?? "").replace(".", "").toLowerCase()

onMounted(() => {
  // Дата за замовчуванням => поточна дата
    if (!vm.form.value.date) {
      vm.form.value.date = new Date().toISOString().split("T")[0]
    }
})
</script>

<template>
<!-- TEMPLATE -->
  <div class="modal_overlay">
    <div class="modal_box">
      <ContentContainer padding="none" flex="column">
        <h3 class="chapter_title"
            style="text-align: center; padding-bottom: 0;">
          Додати новий файл
        </h3>
        <BaseLine></BaseLine>

        <!-- КНОПКА ВИБОРУ ФАЙЛУ -->
        <ContentContainer padding="right-left" grid="100px 1fr" >
          <ContentContainer padding="right-left" class="important_text">Файл</ContentContainer>
          <BaseFileButton
              title="Обрати файл для завантаження"
              size="full"
              @pickedOne="onFilePicked">
            Обрати новий файл
          </BaseFileButton>
        </ContentContainer>


        <ContentContainer padding="none" flex="row" v-if="vm.form.value.file">
          <!-- ВЛАСТИВОСТІ ФАЙЛУ -->
          <ContentContainer paddingStyle="0 0 0 calc(100px + 1vw)">
            <div class="important_text">Властивості обраного файлу:</div>
            <BaseLine width="think"></BaseLine>
            <div>Назва: <span class="notes_string">{{ fileMeta?.baseName }}.{{ vm.form.value.extension }}</span> </div>
            <div>Розмір: <span class="notes_string">{{ fileMeta?.sizeFormatted }} </span></div>
            <div v-if="fileMeta?.lastModified">
              Змінено: <span class="notes_string">{{ fileMeta?.lastModified }}</span>
            </div>
            <div>Тип: <span class="notes_string">{{ fileMeta?.group }}</span></div>
          </ContentContainer>

          <!-- КНОПКА ПЕРЕГЛЯДУ ФАЙЛУ -->
          <ContentContainer
              title="Файл, що обраний для завантаження"
              padding="right-left">
            <BaseButton
                :disabled="!fileMeta?.previewable"
                :title="fileMeta?.previewable
                    ? `Відкрити новий файл в браузері`
                    : `Формат файлу ( ` + vm.form.value.extension + ` ) не дозволяє переглянути його в браузері`"
                @click="openPickedFile"
                size="sm">
              <BaseImage :src="OpenFile" size="icon"/>
            </BaseButton>
          </ContentContainer>
        </ContentContainer>

        <!-- НАЗВА ФАЙЛУ -->
        <BaseLine width="think"></BaseLine>
        <ContentContainer padding="none">
          <ContentContainer
              padding="none"
              no-background="true"
              flex="row">
            <BaseInput
                title="Назва файлу (можна змінити)"
                size="md"
                grid="100px 1fr"
                placeholder="нова назва файлу"
                v-model="vm.form.value.name">
              Ім'я
            </BaseInput>
            <ContentContainer
                v-if="vm.form.value.extension"
                padding="none"
                flex="row"
                alignItems="center"
                title="Розширення файлу, обраного для завантаження"
                class="chapter_title">
              .{{vm.form.value.extension }}
            </ContentContainer>
          </ContentContainer>
          <ContentContainer
              v-if="vm.errors.value.fields.name?.length"
              padding="none"
              class="info-container">
            {{ vm.errors.value.fields.name[0] }}
          </ContentContainer>
          <ContentContainer
              v-if="vm.errors.value.fields.file?.length"
              padding="none"
              class="info-container">
            {{ vm.errors.value.fields.file[0] }}
          </ContentContainer>

          <!-- ДАТА ФАЙЛУ -->
          <ContentContainer
              name="Дата видачі"
              grid="100px 1fr"
              padding="none"
              title="Дата файлу (за замовчуванням - поточна дата | можна змінити)"
              no-background="true">
            <ContentContainer
                class="important_text"
                padding="left">
              Дата
            </ContentContainer>
            <BaseInput
                paddingStyle="0 0 0 1vw"
                size="md"
                v-model="vm.form.value.date"
                type="date"
            />
          </ContentContainer>

          <!-- НОТАТКИ ФАЙЛУ -->
          <BaseTextArea
              size="lg"
              grid="100px 1fr"
              title="Нотатки до файлу (опційно)"
              paddingStyle="0 0 0 1vw"
              v-model="vm.form.value.notes">
              <span class="label-block">
                <span>Нотатки</span>
                <span class="note_block">(опціонально)</span>
              </span>
          </BaseTextArea>

          <!-- ПЕРСОНАЛЬНІСТЬ ФАЙЛУ -->
          <ContentContainer flex="row" paddingStyle="0 0 0 calc(100px + 1vw)">
            <BaseToggle
                v-model="vm.form.value.is_personal"
                :image="vm.form.value.is_personal ? PrivateImg : PrivateNoImg"
                :title="vm.form.value.is_personal ? `Приватний компонент. Видимий лише Вам. Натисніть щоб змінити` : 'Публічний компонент. Видимий команді. Натисніть щоб змінити'"
                buttonSize="md"
                imageSize="icon"
            />
            <BaseToggle
                v-model="vm.form.value.is_blocked"
                :image="vm.form.value.is_blocked ? LockOther : LockFalse"
                :title="vm.form.value.is_personal ? `Компонент не заблоковано. Дозволена зміна та видалення. Натисніть щоб змінити` : 'Компонент заблоковано. Заборонена зміна та видалення. Натисніть щоб змінити'"
                buttonSize="md"
                imageSize="icon"
            />
          </ContentContainer>
        </ContentContainer>

        <p v-if="vm.errors.value.nonField.length" class="form-error">
          {{ vm.errors.value.nonField[0] }}
        </p>

        <!-- КНОПКИ УПРАВЛІННЯ -->
        <ContentContainer padding="top" justifyContent="center" flex="row" no-background="true">
          <BaseButton
              title="Зберегти новий файл"
              size="lg"
              @click="vm.submit"
              :disabled="vm.isSubmitting.value || !vm.form.value.file">
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