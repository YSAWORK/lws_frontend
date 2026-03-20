<script setup lang="ts">
/// IMPORT TOOLS
    import { computed, ref, watch } from "vue"

  // import features
    import { useObjectUrlPreview } from "@/lib/files/useObjectUrlPreview"
    import { checkIsPdf } from "@/lib/CheckFileExt"
    import { getPdfInfo, formatTimestamp, getRemoteFileInfo, type RemoteFileInfo} from "@/lib/fileSettings"

  // import base elements
    import BaseLine from "@/components/ui/BaseLine.vue"
    import ContentContainer from "@/components/ui/ContentContainer.vue"
    import BaseInput from "@/components/ui/BaseInput.vue"
    import BaseButton from "@/components/ui/BaseButton.vue"
    import BaseSelect from "@/components/ui/BaseSelect.vue";
    import BaseFileButton from "@/components/ui/BaseFileButton.vue";

  // import types
    import type {
      LicensePayload,
      LicenseFieldMap,
      CommissionOption,
    } from "@/components/modals/employee/openEditLicenseModal/openEditLicenseModalTs"

 // import functions
    import { useEditLicenseModal } from "@/components/modals/employee/openEditLicenseModal/openEditLicenseModalScript"


// Опис зовнішніх даних
  const props = defineProps<{
    title: string
    employeeId: number
    current: LicensePayload
    fieldMap: LicenseFieldMap
    commissionOptions: CommissionOption[]
  }>()

// Emits
  const emit = defineEmits<{
    (e: "close"): void
    (e: "saved"): void
  }>()

// Виклик логіки модального вікна
  const vm = useEditLicenseModal(
      {
        employeeId: props.employeeId,
        current: props.current,
        fieldMap: props.fieldMap,
        commissionOptions: props.commissionOptions,
      },
      emit,
  )

  // Перегляд нового файлу
    const { objectUrl } = useObjectUrlPreview(vm.pickedFile)
    const previewObjectUrl = computed(() => objectUrl.value ?? null)
    const previewObjectIsPdf = computed(() => checkIsPdf(vm.pickedFile.value))

  // Властивості обраного файлу
    const previewFileInfo = computed(() => getPdfInfo(vm.pickedFile.value))

  // Перегляд поточного файлу
    const currentFileUrl = computed(() => props.current.File ?? null)
    const currentObjectIsPdf = computed(() => checkIsPdf(currentFileUrl.value))

  // Властивості поточного файлу
    const currentRemoteInfo = ref<RemoteFileInfo | null>(null)
    let reqId = 0
    watch(
        currentFileUrl,
        async (url) => {
          const id = ++reqId
          currentRemoteInfo.value = null
          if (!url) return
          const info = await getRemoteFileInfo(url)
          if (id !== reqId) return
          currentRemoteInfo.value = info
        },
        { immediate: true },
  )
</script>

<template>
  <div class="modal_overlay">
    <div class="modal_box" style="width: 70%">
      <ContentContainer
          name="Основний контейнер модалки"
          flex="column"
          padding="none"
          style="justify-content:
          space-between; align-items: center;">

        <ContentContainer
            name="Контейнер титульного напису"
            class="chapter_title"
            style="display: flex; justify-content: center;">
          {{ title }}
        </ContentContainer>
        <BaseLine />

        <ContentContainer
            name="Контейнер помилок"
            v-if="vm.error"
            padding="none"
            no-background="true">
          <div class="text_no_data" style="white-space: pre-wrap;">
            {{ vm.error }}
          </div>
        </ContentContainer>

        <ContentContainer
            name="Контейнер основного поля"
            flex="column"
            padding="none">

          <ContentContainer
              name="Контейнер вводу даних"
              flex="row"
              padding="none">
            <ContentContainer
                style="width: 40%"
                flex="column"
                padding="none"
                no-background="true" gap="1">
              <ContentContainer
                  name="Серія та номер"
                  padding="none"
                  no-background="true">
                <div class="important_text" > Серія та номер </div>
                <BaseInput
                    size="md"
                    paddingStyle="0"
                    v-model="vm.Number.value"
                    name="Поле для вводу Серії та номеру"
                    placeholder="Приклад: ЧН 000346"
                />
              </ContentContainer>
              <BaseLine size="full" width="think"></BaseLine>

              <ContentContainer
                  name="Дата видачі"
                  padding="none"
                  no-background="true">
                <ContentContainer
                    class="important_text"
                    padding="none">
                  Дата видачі
                </ContentContainer>
                <BaseInput
                    paddingStyle="0"
                    size="md"
                    v-model="vm.Date.value"
                    type="date"
                />
              </ContentContainer>
              <BaseLine size="full" width="think"></BaseLine>

              <ContentContainer
                  name="Орган видачі"
                  padding="none"
                  no-background="true">
                <ContentContainer
                    class="important_text"
                    padding="none">
                  Орган видачі
                </ContentContainer>

                <BaseSelect
                    name="Випадаючий список Рад адвокатів"
                    size="md"
                    v-model="vm.Commission.value"
                    :maxHeight="500"
                >
                  <option value="">—</option>
                  <option v-for="opt in vm.commissionOptionsLocal.value" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </BaseSelect>
              </ContentContainer>
              <BaseLine size="full" width="think"></BaseLine>

              <ContentContainer
                  padding="none"
                  no-background="true">
                <ContentContainer
                    class="important_text"
                    padding="none">
                  Прикріплений файл
                </ContentContainer>

                <ContentContainer
                    name="Контейнер інформації про файли"
                    flex="column"
                    padding="none"
                    no-background="true"
                    style="align-items: center; gap: 0.8vw;">
                  <BaseFileButton
                      title="Завантажити або змінити файл"
                      size="full"
                      accept="application/pdf"
                      @pickedOne="vm.onPickFile">
                    Завантажити файл
                  </BaseFileButton>

                  <ContentContainer
                      padding="none"
                      no-background="true">
                    <div class="important_text">Властивості поточного файлу:</div>
                    <div v-if="currentRemoteInfo?.size">
                      Розмір: <span class="notes_string">{{ (currentRemoteInfo.size / 1024).toFixed(2) }} KB</span>
                    </div>
                    <div v-if="currentRemoteInfo?.lastModified">
                      Збережено:
                      <span class="notes_string">{{ new Date(currentRemoteInfo.lastModified).toLocaleString("uk-UA") }}</span>
                    </div>
                    <div v-if="currentRemoteInfo?.contentType">
                      Тип: <span class="notes_string">{{ currentRemoteInfo.contentType }}</span>
                    </div>
                  </ContentContainer>

                  <ContentContainer padding="none" v-if="previewFileInfo">
                    <BaseLine size="full" width="think"></BaseLine>
                    <div class="important_text">Властивості обраного файлу:</div>
                    <div>Назва: <span class="notes_string">{{ previewFileInfo.name }}</span> </div>
                    <div>Розмір: <span class="notes_string">{{ (previewFileInfo.size / 1024).toFixed(2) }} KB</span></div>
                    <div v-if="previewFileInfo.lastModified">
                      Змінено: <span class="notes_string">{{ formatTimestamp(previewFileInfo.lastModified) }}</span>
                    </div>
                    <div>Тип: <span class="notes_string">{{ previewFileInfo.type || 'невідомо' }}</span></div>
                  </ContentContainer>

                </ContentContainer>
              </ContentContainer>
            </ContentContainer>

            <ContentContainer
                name="Контейнер з візуалом файлів"
                flex="row"
                gap="1"
                padding="left">
              <ContentContainer padding="none" style="width: 50%">
                <ContentContainer
                    class="important_text"
                    padding="bottom"
                    style="text-align: center">
                  Поточний файл
                </ContentContainer>
                <iframe
                    v-if="currentFileUrl && currentObjectIsPdf"
                    :src="currentFileUrl"
                    style="width: 100%; height: 70vh; border-radius: 6px;"
                />

                <!-- Якщо файл є, але не pdf -->
                <div v-else-if="currentFileUrl" class="notes_string">
                  Формат не підтримується для перегляду
                </div>

                <!-- Якщо файла немає -->
                <ContentContainer
                    flex="column"
                    alignItems="center"
                    justifyContent="center"
                    v-else class="notes_string">
                  <p> Файл відсутній </p>
                </ContentContainer>
              </ContentContainer>

              <ContentContainer
                  padding="none"
                  style="width: 50%"
                  no-background="true"

              >
                <ContentContainer
                    class="important_text"
                    padding="bottom"
                    style="text-align: center">
                  Новий файл
                </ContentContainer>
                <iframe
                    v-if="previewObjectUrl && previewObjectIsPdf"
                    :src="previewObjectUrl"
                    class="preview_file_documents"
                    style="height: 70vh; max-height: 100%"
                />

                <!-- Якщо файл є, але не pdf -->
              <ContentContainer
                  v-else-if="previewObjectUrl"
                  flex="column"
                  alignItems="center"
                  justifyContent="center"
                  class="important_no_data_text">
                  Формат файлу не PDF
              </ContentContainer>

                <!-- Якщо файла немає -->
                <ContentContainer
                    v-else
                    flex="column"
                    alignItems="center"
                    justifyContent="center"
                    class="important_no_data_text">
                  <p> Новий файл не обрано </p>
                </ContentContainer>
              </ContentContainer>
            </ContentContainer>

          </ContentContainer>


          <BaseLine />
        </ContentContainer>

        <ContentContainer
            flex="row"
            padding="none"
            no-background="true"
            style="justify-content: center; gap: 0.8vw;">
          <BaseButton
              size="lg"
              name="Зберегти"
              styleType="primary"
              :disabled="!vm.canSubmit.value"
              @click="vm.save"
          >
            {{ vm.isSubmitting.value ? "Збереження..." : "Зберегти" }}
          </BaseButton>
          <BaseButton
              size="lg"
              name="Скасувати" styleType="secondary" @click="vm.close">
            Скасувати
          </BaseButton>
        </ContentContainer>
      </ContentContainer>
    </div>
  </div>
</template>