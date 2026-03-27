<!-- src/components/modals/global/changeOwner/changeOwnerVue.vue -->

<script setup lang="ts">
// IMPORT TOOLS
import { ref, computed } from "vue"
import api from "@/api"
import { normalizeApiError, type NormalizedErrors } from "@/lib/errorsUtils"
import { ChangeOwnerModel } from "@/components/modals/global/changeOwner/changeOwnerRegistry"

// import base elements
import BaseModal from "@/components/ui/BaseModal.vue"
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseTextArea from "@/components/ui/BaseTextArea.vue";
import BaseLine from "@/components/ui/BaseLine.vue";
import ContentContainer from "@/components/ui/ContentContainer.vue";

// SET UP PROPS AND EMITS
const props = defineProps<{
  item: ChangeOwnerModel
  url: string
  title?: string
  displayValue?: string
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "saved", updated: ChangeOwnerModel): void
}>()

// Зберігаємо стан даних
const originalNotes = props.item.created_by ?? ""
const localNotes = ref(originalNotes)

// Вводимо змінну, що перевіряє стан даних (змінились чи ні)
const isDirty = computed(() => localNotes.value !== originalNotes)


const isSubmitting = ref(false)
const errors = ref<NormalizedErrors>({ nonField: [], fields: {} })

// RESET ERRORS
function resetErrors() {
  errors.value = { nonField: [], fields: {} }
}

// SAVE NOTES AND CLOSE MODAL
async function save() {
  if (!isDirty.value || isSubmitting.value) return
  resetErrors()
  isSubmitting.value = true
  try {
    const payload = { notes: localNotes.value }
    const { data } = await api.patch(props.url, payload)
    emit("saved", data)
    emit("close")
  } catch (err) {
    errors.value = normalizeApiError(err)
  } finally {
    isSubmitting.value = false
  }
}

function close() {
  emit("close")
}
</script>

<template>
  <div class="modal_overlay" >
    <div class="modal_box">
    <ContentContainer>

      <!-- ЗАГОЛОВОК -->
      <h3
          class="chapter_title"
          style="text-align: center">
        {{props.title}} {{props.displayValue}}
      </h3>
      <BaseLine size="full" width="norm"></BaseLine>

      <!-- ПОМИЛКИ -->
      <ContentContainer
          name="Контейнер з помилками"
          padding="none"
          class="info-container">
        <p v-for="(msg, i) in errors.nonField" :key="i">{{ msg }}</p>
        <p v-for="(e, i) in errors.fields.notes" :key="i">{{ e }}</p>
      </ContentContainer>

      <!-- КНОПКИ -->
      <ContentContainer
          name="контейнер з кнопками"
          padding="none"
          justifyContent="center"
          flex="row">
        <BaseButton
            :title="isDirty ? `Зберегти зміни` : `Дані не змінено`"
            size="lg"
            :disabled="isSubmitting || !isDirty"
            @click="save">
          Зберегти
        </BaseButton>
        <BaseButton
            title="Закрити без змін"
            size="lg"
            :disabled="isSubmitting"
            @click="close">
          Скасувати
        </BaseButton>
      </ContentContainer>
    </ContentContainer>
    </div>
  </div>
</template>

<style></style>

