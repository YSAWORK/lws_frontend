<!-- .src/components/editTextArea/editTextArea.vue -->

<script setup lang="ts">
  /// IMPORT TOOLS
    import { computed, ref, watch } from "vue"
    import api from "@/api"

    // import base elements
    import BaseLine from "@/components/ui/BaseLine.vue";
    import ContentContainer from "@/components/ui/ContentContainer.vue";
    import BaseButton from "@/components/ui/BaseButton.vue";
    import BaseTextArea from "@/components/ui/BaseTextArea.vue";


  /// CONSTs
    const props = defineProps<{
      title: string
      entityId: number
      patchUrl: string
      fieldName: string
      currentValue: string
    }>()

    const emit = defineEmits<{
      (e: "close"): void
      (e: "saved", newValue: string): void
    }>()

    const isSubmitting = ref(false)
    const error = ref<string | null>(null)

    const draft = ref<string>(props.currentValue ?? "")

    watch(
        () => props.currentValue,
        (v) => {
          if (!isDirty.value) draft.value = v ?? ""
        },
    )

    const normalizedDraft = computed(() => (draft.value ?? "").trim())

    const isDirty = computed(() => normalizedDraft.value !== (props.currentValue ?? "").trim())

    const canSubmit = computed(() => {
      if (isSubmitting.value) return false
      return isDirty.value;

    })

    function close() {
      emit("close")
    }

    async function save() {
      if (!canSubmit.value) return
      isSubmitting.value = true
      error.value = null

      try {
        const payload: Record<string, unknown> = { [props.fieldName]: normalizedDraft.value }
        await api.patch(props.patchUrl, payload)
        emit("saved", normalizedDraft.value)
      } catch (e: any) {
        error.value =
            e?.response?.data?.detail ??
            e?.response?.data?.message ??
            "Не вдалося зберегти зміни. Спробуй ще раз."
        console.error("EditTextAreaModal save error:", e)
      } finally {
        isSubmitting.value = false
      }
    }
</script>

<template>
  <div class="modal_overlay">
    <div class="modal_box">
      <ContentContainer>
        <h3 class="chapter_title" style="text-align: center">
          {{ title }}
        </h3>

        <BaseLine size="full" width="norm" />

        <div v-if="error" class="error_text" style="margin: 1vw 0">
          {{ error }}
        </div>
        <BaseTextArea
            v-model="draft"
            name="textarea"
            placeholder="Введи текст..."
            :disabled="isSubmitting"
            :rows="8"
        />
        <ContentContainer style="display: flex; justify-content: center;">
          <!-- Кнопка ЗБЕРЕГТИ -->
          <BaseButton
              title="Зберегти зміни"
              size="lg"
              :disabled="!canSubmit"
              :loading="isSubmitting"
              @click="save"
          >
            Зберегти
          </BaseButton>
          <!-- Кнопка ЗАКРИТИ -->
          <BaseButton
              title="Закрити вікно без змін"
              size="lg"
              :disabled="isSubmitting"
              @click="close"
          >
            Скасувати
          </BaseButton>
        </ContentContainer>
      </ContentContainer>
    </div>
  </div>
</template>

<style scoped>

</style>