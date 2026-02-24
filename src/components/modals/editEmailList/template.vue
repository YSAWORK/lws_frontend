<!-- src/components/modals/editEmailNotes/template.vue -->

<script setup lang="ts">
  // IMPORT TOOLS
  import { ref } from "vue"
  import api from "@/api"
  import { normalizeApiError, type NormalizedErrors } from "@/lib/errorsUtils"
  import type { EmailShortDTO } from "@/model_schemas/dto/components/email.dto"
  import BaseButton from "@/components/ui/BaseButton.vue";
  import BaseLine from "@/components/ui/BaseLine.vue";
  import ContentContainer from "@/components/ui/ContentContainer.vue";
  import BaseTableList from "@/components/ui/BaseTableList.vue";
  import Base from "@/components/templates/base.vue";
  import BaseCollapse from "@/components/ui/BaseCollapse.vue";

  // SET UP PROPS AND EMITS
  const props = defineProps<{ emails: EmailShortDTO[] }>()
  const emit = defineEmits<{
    (e: "close"): void
    (e: "saved", updated: EmailShortDTO[]): void
  }>()
  const localEmails = ref<EmailShortDTO[]>([...props.emails])
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
      const { data } = await api.patch(emailPatchUrl(""), {
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
        <h3 class="chapter_title" style="text-align: center"> Email list </h3>
        <BaseLine size="full" width="norm"></BaseLine>
        <BaseTableList>
          <template #colgroup>
            <col style="width: 30%" />
            <col style="width: 60%" />
            <col style="width: 10%" />
          </template>
          <template #tbody_rows>
            <tr v-for="email in localEmails" :key="email.id">
              <td> {{ email.email }} </td>
              <td class="text_string">
                <BaseCollapse
                    title="Нотатки"
                    >  {{ email.notes }}</BaseCollapse>
              </td>
              <td>
                <BaseButton size="sm"></BaseButton>
              </td>
            </tr>
          </template>
        </BaseTableList>
        <div class="info-container">
          <p v-for="(msg, i) in errors.nonField" :key="i">{{ msg }}</p>
          <p v-for="(e, i) in errors.fields.notes" :key="i">{{ e }}</p>
        </div>
        <ContentContainer padding="none" justifyContent="center" flex="row">
          <BaseButton size="lg" :disabled="isSubmitting" @click="">Зберегти</BaseButton>
          <BaseButton size="lg" :disabled="isSubmitting" @click="close">Скасувати</BaseButton>
        </ContentContainer>
      </ContentContainer>
    </div>
  </div>
</template>

<style></style>

