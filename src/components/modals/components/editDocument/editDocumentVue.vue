<!-- .src/components/modals/components/editDocument/editDocumentVue.vue -->

<script setup lang="ts">
  // IMPORT TOOLS
    import { ref, computed } from "vue"

  // import types
    import type { DocumentUpdateDTO } from "@/model_schemas/dto/components/document.dto";

  // import modals
    import { useEditDocumentModal } from "@/components/modals/components/editDocument/editDocumentTs"

  // import features
    import {getFileMeta, formatFileSize, isPreviewable} from "@/lib/files/getFileMeta"
    import {openLoadFile} from "@/lib/files/openLoadFile";
    import {useObjectUrlPreview} from "@/lib/files/useObjectUrlPreview";

  // import base elements
    import ContentContainer from "@/components/ui/ContentContainer.vue"
    import BaseInput from "@/components/ui/BaseInput.vue"
    import BaseButton from "@/components/ui/BaseButton.vue"
    import BaseTextArea from "@/components/ui/BaseTextArea.vue"
    import BaseCheckBox from "@/components/ui/BaseCheckBox.vue"
    import BaseFileButton from "@/components/ui/BaseFileButton.vue"
    import BaseLine from "@/components/ui/BaseLine.vue"
    import OpenFile from "@/assets/img/open_file.svg";
    import BaseImage from "@/components/ui/BaseImage.vue";


const props = defineProps<{ document: DocumentUpdateDTO }>()
const emit = defineEmits<{
  (e: "close"): void
  (e: "created"): void
}>()


/// ПОТОЧНИЙ ФАЙЛ
  // Отримання вхідних даних
  const vm = useEditDocumentModal(props.document, emit)

  // Змінна з даними поточного файлу
    const initialData = structuredClone(props.document)

  //
    const originalDocumentView = computed(() => ({
      name: initialData.name,
      extension: normalizeExt(initialData.extension) ?? "",
      fullName: `${initialData.name}${initialData.extension ?? ""}`,
      sizeFormatted: formatFileSize(initialData.size),
      file: initialData.file,
      mime: initialData.mime,
      fileUrl: initialData.existing_file_url,
      previewable: isPreviewable(initialData.extension || ""),
    }))

  // Функція відкриття preview поточного файлу
    function openCurrentFile() {
      if (!originalDocumentView.value.fileUrl) return
      openLoadFile(originalDocumentView.value.fileUrl)
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
      newFile.value = file
      newFileMeta.value = meta
      vm.form.value.file = file
      vm.form.value.extension = normalizeExt(meta.extension)
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
      vm.form.value.file = initialData.file
      vm.form.value.extension = initialData.extension
    }


/// ДОПОМІЖНІ ФУНКЦІЇ
  // Нормалізація формату розширення файлу
    const normalizeExt = (ext?: string | null) =>
        (ext ?? "").replace(".", "").toLowerCase()

  // Контроль зміни розширення файлу
    const isExtensionChanged = computed(() => {
      if (!newFileMeta.value) return false
      return vm.form.value.extension !== originalDocumentView.value.extension
    })

  // Контроль змін даних
    const isDirty = computed(() => {
      return (
          vm.form.value.name !== initialData.name ||
          vm.form.value.extension !== initialData.extension ||
          vm.form.value.date !== initialData.date ||
          vm.form.value.notes !== initialData.notes ||
          vm.form.value.is_personal !== initialData.is_personal ||
          vm.form.value.file !== initialData.file
      )
    })

  // Функція скидання всіх внесених змін
    function backToInitialData() {
      Object.assign(vm.form.value, structuredClone(initialData))
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
          Редагування файлу <br>
          <span class="prime_text_string">{{ originalDocumentView.fullName }}</span>
        </h3>
        <BaseLine width="bold"></BaseLine>

        <ContentContainer grid="100px 1fr 1fr" padding="bottom">
          <ContentContainer padding="right-left"  class="important_text">Файл</ContentContainer>
          <!-- ВЛАСТИВОСТІ ПОТОЧНОГО ФАЙЛУ -->
          <ContentContainer padding="left">
            <ContentContainer flex="row" padding="none">
              <ContentContainer padding="none" title="Властивості файлу, що міститься в базі даних">
                <div class="important_text">Властивості поточного файлу:</div>
                <BaseLine width="think"></BaseLine>
                <div>Назва: <span class="notes_string">{{ originalDocumentView.fullName }}</span></div>
                <div>Розмір: <span class="notes_string">{{ originalDocumentView.sizeFormatted }}</span></div>
                <div>Тип: <span class="notes_string">{{ originalDocumentView.mime }}</span></div>
              </ContentContainer>
            <BaseButton
                :disabled="!originalDocumentView.previewable"
                :title="originalDocumentView.previewable
                      ? `Відкрити поточний файл в браузері`
                      : `Формат файлу ( ` + originalDocumentView.extension + ` ) не дозволяє переглянути його в браузері`"
                @click="openCurrentFile"
                size="sm">
              <BaseImage  :src="OpenFile" size="icon"/>
            </BaseButton>
          </ContentContainer>

            <!-- Кнопка вибору файлу -->
              <BaseFileButton
                  title="Обрати інший файл на заміну завантаженому"
                  size="full"
                  @pickedOne="onFilePicked">
                Обрати інший файл
              </BaseFileButton>
          </ContentContainer>

          <!-- ВЛАСТИВОСТІ НОВОГО ФАЙЛУ-->
          <ContentContainer paddingStyle="0 1vw 0 1vw" v-if="newFile">

            <!-- Властивості обраного файлу -->
            <ContentContainer flex="row" padding="none" title="Властивості нового файлу, яким планується замінити поточний">
              <ContentContainer padding="none">
                <div class="important_text">Властивості нового файлу:</div>
                <BaseLine width="think"></BaseLine>
                <div>Назва: <span class="notes_string">{{ newFileMeta?.name }}</span> </div>
                <div>Розмір: <span class="notes_string">{{ newFileMeta?.sizeFormatted }} </span></div>
                <div>Тип: <span class="notes_string">{{ newFileMeta?.group }}</span></div>
              </ContentContainer>
              <BaseButton
                  :disabled="!newFileMeta?.previewable"
                  :title="newFileMeta?.previewable
                    ? `Відкрити новий файл в браузері`
                    : `Формат файлу ( ` + vm.form.value.extension + ` ) не дозволяє переглянути його в браузері`"
                  @click="openPickedFile"
                  size="sm">
                <BaseImage :src="OpenFile" size="icon"/>
              </BaseButton>
            </ContentContainer>
            <BaseButton
                @click="clearPickedFile"
                size="full">
              Відмінити вибір файлу
            </BaseButton>
          </ContentContainer>
        </ContentContainer>

        <BaseLine width="bold"></BaseLine>

        <ContentContainer padding="bottom">
        <!-- НАЗВА ФАЙЛУ -->
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
                size="fit-content"
                padding="none"
                flex="row"
                alignItems="center"
                title="Розширення файлу, обраного для завантаження"
                class="chapter_title">
              .{{ normalizeExt(vm.form.value.extension) }}
            </ContentContainer>
            <ContentContainer
                class="info-container"
                padding="left"
                flex="row"
                alignItems="center"
                v-if="isExtensionChanged">
                Увага! Формат файлу буде змінено з
              {{ originalDocumentView.extension
                ? originalDocumentView.extension
                : `NONE` }}
              на
              {{ vm.form.value.extension
                ? vm.form.value.extension
                : `NONE` }}
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
          <BaseCheckBox
              title="Ніхто, окрім Вас не буде бачити цей файл"
              style="padding-left: 6.5vw"
              v-model="vm.form.value.is_personal"
              label="Персональні дані">
          </BaseCheckBox>
        </ContentContainer>

        <p v-if="vm.errors.value.nonField.length" class="form-error">
          {{ vm.errors.value.nonField[0] }}
        </p>

        <!-- КНОПКИ УПРАВЛІННЯ -->
        <BaseLine width="bold"></BaseLine>
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