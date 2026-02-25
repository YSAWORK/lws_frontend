<script setup lang="ts">
/// IMPORT TOOLS
    import { computed, ref, watch } from "vue"

  // import features
    import { useObjectUrlPreview } from "@/lib/useObjectUrlPreview"
    import { checkIsPdf } from "@/lib/CheckFileExt"
    import {getPdfInfo, formatTimestamp, getRemoteFileInfo, type RemoteFileInfo} from "@/lib/fileSettings"

  // import base elements
    import BaseLine from "@/components/ui/BaseLine.vue"
    import ContentContainer from "@/components/ui/ContentContainer.vue"
    import BaseInput from "@/components/ui/BaseInput.vue"
    import BaseButton from "@/components/ui/BaseButton.vue"
    import BaseSelect from "@/components/ui/BaseSelect.vue";
    import BaseFileButton from "@/lib/BaseFileButton.vue";

  // import types
    import type {
      LicensePayload,
      LicenseFieldMap,
      CommissionOption,
    } from "@/components/modals/openEditLicenseModal/openEditLicenseModalTs"

 // import functions
    import { useEditLicenseModal } from "@/components/modals/openEditLicenseModal/openEditLicenseModalScript"


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
                    :modelValue="vm.Number.value"
                    @update:modelValue="vm.Number.value = $event"
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
                    size="md"
                    v-model="vm.Date.value"
                    type="date"
                />
              </ContentContainer>
              <BaseLine size="full" width="think"></BaseLine>

              <ContentContainer padding="none" no-background="true">
                <ContentContainer class="important_text" padding="none">Орган видачі</ContentContainer>

                <BaseSelect
                    size="md"
                    :value="vm.Commission.value"
                    @change="vm.Commission.value = ($event.target as HTMLSelectElement).value"
                    :maxHeight="500"
                >
                  <option value="">—</option>
                  <option v-for="opt in vm.commissionOptionsLocal.value" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </BaseSelect>
              </ContentContainer>
              <BaseLine size="full" width="think"></BaseLine>

              <ContentContainer padding="top" no-background="true">
                <ContentContainer
                    class="important_text"
                    padding="none">
                  Прікріплений файл
                </ContentContainer>

                <ContentContainer flex="column" padding="none" no-background="true" style="align-items: center; gap: 0.8vw;">
                  <BaseFileButton
                      title="Завантажити або змінити файл"
                      size="full"
                      accept="application/pdf"
                      @pickedOne="vm.onPickFile"
                  >
                    Завантажити файл
                  </BaseFileButton>
                  <ContentContainer padding="none" no-background="true">
                    <div class="important_text">Властивості поточного файлу:</div>
                    <div v-if="currentRemoteInfo?.contentType">
                      Тип: <span class="notes_string">{{ currentRemoteInfo.contentType }}</span>
                    </div>

                    <div v-if="currentRemoteInfo?.size">
                      Розмір: <span class="notes_string">{{ (currentRemoteInfo.size / 1024).toFixed(2) }} KB</span>
                    </div>

                    <div v-if="currentRemoteInfo?.lastModified">
                      Змінено:
                      <span class="notes_string">{{ new Date(currentRemoteInfo.lastModified).toLocaleString("uk-UA") }}</span>
                    </div>
                  </ContentContainer>
                  <ContentContainer padding="none" v-if="previewFileInfo">
                    <BaseLine size="full" width="think"></BaseLine>
                    <div class="important_text">Властивості обраного файлу:</div>
                    <div>Назва: <span class="notes_string">{{ previewFileInfo.name }}</span> </div>
                    <div>Розмір: <span class="notes_string">{{ (previewFileInfo.size / 1024).toFixed(2) }} KB</span></div>
                    <div>Тип: <span class="notes_string">{{ previewFileInfo.type || 'невідомо' }}</span></div>
                    <div v-if="previewFileInfo.lastModified">
                      Змінено:
                      <span class="notes_string">{{ formatTimestamp(previewFileInfo.lastModified) }}</span>
                    </div>
                  </ContentContainer>
                </ContentContainer>
              </ContentContainer>
            </ContentContainer>
            <ContentContainer
                padding="none"
                no-background="true"
                style="min-width: 20vw; max-width: 25vw;"
            >
              <div class="text_string" style="margin-bottom: 0.5vw;">
                Поточний файл
              </div>
              <iframe
                  v-if="currentFileUrl && currentObjectIsPdf"
                  :src="currentFileUrl"
                  style="width: 100%; height: 70vh; border: 1px solid #e0e0e0; border-radius: 6px;"
              />

              <!-- Якщо файл є, але не pdf -->
              <div v-else-if="currentFileUrl" class="notes_string">
                Формат не підтримується для перегляду
              </div>

              <!-- Якщо файла немає -->
              <div v-else class="notes_string">
                Файл відсутній
              </div>
            </ContentContainer>
            <ContentContainer
                padding="none"
                no-background="true"
                style="min-width: 20vw; max-width: 25vw;"
            >
              <div class="text_string" style="margin-bottom: 0.5vw;">
                Поточний файл
              </div>
              <iframe
                  v-if="previewObjectUrl && previewObjectIsPdf"
                  :src="previewObjectUrl"
                  style="width: 100%; height: 70vh; border: 1px solid #e0e0e0; border-radius: 6px;"
              />

              <!-- Якщо файл є, але не pdf -->
              <div v-else-if="previewObjectUrl" class="notes_string">
                Формат не підтримується для перегляду
              </div>

              <!-- Якщо файла немає -->
              <div v-else class="notes_string">
                Файл відсутній
              </div>
            </ContentContainer>
          </ContentContainer>


          <BaseLine />
        </ContentContainer>

        <ContentContainer flex="row" padding="none" no-background="true" style="justify-content: center; gap: 0.8vw;">
          <BaseButton
              size="lg"
              name="Скасувати" styleType="secondary" @click="vm.close">
            Скасувати
          </BaseButton>
          <BaseButton
              size="lg"
              name="Зберегти"
              styleType="primary"
              :disabled="!vm.canSubmit.value"
              @click="vm.save"
          >
            {{ vm.isSubmitting.value ? "Збереження..." : "Зберегти" }}
          </BaseButton>
        </ContentContainer>
      </ContentContainer>
    </div>
  </div>
</template>