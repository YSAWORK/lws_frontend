<!-- src/components/modals/editEmailNotes/editAttorneyUrlVue.vue -->

<script setup lang="ts">
  // IMPORT TOOLS
  import { ref } from "vue"
  import api from "@/api"
  import { normalizeApiError, type NormalizedErrors } from "@/lib/errorsUtils"
  import type { EmailShortDTO } from "@/model_schemas/dto/components/email.dto"
  import BaseButton from "@/components/ui/BaseButton.vue";
  import BaseTextArea from "@/components/ui/BaseTextArea.vue";
  import BaseLine from "@/components/ui/BaseLine.vue";
  import ContentContainer from "@/components/ui/ContentContainer.vue";

  // SET UP PROPS AND EMITS
  const props = defineProps<{ email: EmailShortDTO }>()
  const emit = defineEmits<{
    (e: "close"): void
    (e: "saved", updated: EmailShortDTO): void
  }>()
  const localNotes = ref(props.email.notes ?? "")
  const isSubmitting = ref(false)
  const errors = ref<NormalizedErrors>({ nonField: [], fields: {} })

  // RESET ERRORS
  function resetErrors() {
    errors.value = { nonField: [], fields: {} }
  }

  // SAVE NOTES AND CLOSE MODAL
  async function save() {
    resetErrors()
    isSubmitting.value = true
    try {
      const emailPatchUrl = (id: number | string) => `/components/email/${id}/`
      const { data } = await api.patch(emailPatchUrl(props.email.id), {
        notes: localNotes.value.trim(),
      })
      emit("saved", data)
      emit("close")
    } catch (err) {
      errors.value = normalizeApiError(err)
    } finally {
      isSubmitting.value = false
    }
  }

  // CLOSE MODAL
  function close() {
    emit("close")
  }
</script>

<template>
  <div class="modal_overlay" @click.self="close">
    <div class="modal_box">
      <ContentContainer>
        <h3 class="chapter_title" style="text-align: center">Нотатки до email: <span class="important_text">{{ props.email.email }}</span></h3>
        <BaseLine size="full" width="norm"></BaseLine>
        <div class="info-container">
          <p v-for="(msg, i) in errors.nonField" :key="i">{{ msg }}</p>
          <p v-for="(e, i) in errors.fields.notes" :key="i">{{ e }}</p>
        </div>
        <BaseTextArea v-model="localNotes"></BaseTextArea>
        <ContentContainer padding="none" justifyContent="center" flex="row">
          <BaseButton size="lg" :disabled="isSubmitting" @click="save">Зберегти</BaseButton>
          <BaseButton size="lg" :disabled="isSubmitting" @click="close">Скасувати</BaseButton>
        </ContentContainer>
      </ContentContainer>
    </div>
  </div>
</template>

<style></style>

