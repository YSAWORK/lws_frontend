<!-- src/components/modals/attorneyUrl/template.ts -->

<script setup lang="ts">
  /// IMPORT TOOLS
    import { computed, ref, watch } from "vue"
    import api from "@/api"
    import BaseLine from "@/components/ui/BaseLine.vue";

    // import base elements
    import ContentContainer from "@/components/ui/ContentContainer.vue";
    import BaseInput from "@/components/ui/BaseInput.vue";
    import BaseButton from "@/components/ui/BaseButton.vue";

  /// CONSTs
    // PROPs
    const props = defineProps<{
      title: string
      employeeId: number
      currentUrl: string | null
    }>()

    // EMITS
    const emit = defineEmits<{
      (e: "close"): void
      (e: "saved", newUrl: string | null): void
    }>()

    const isSubmitting = ref(false)

    const canSubmit = computed(() => {
      if (isSubmitting.value) return false
      if (!isDirty.value) return false
      return isValidUrlOrEmpty(normalizedDraft.value)
    })

    // ERRORs
    const error = ref<string | null>(null)

  /// SET DRAFT_FIELD SETTINGS
    // Створює змінну поля введення AttorneyUrl
    const draftField = ref<string>(props.currentUrl ?? "")
    // Відслідковує зміни draftField
    watch(
        () => props.currentUrl,
        (v) => {
          draftField.value = v ?? ""
        },
    )
    // Нормалізує draftField
    const normalizedDraft = computed(() => {
      const v = draftField.value.trim()
      return v.length ? v : null
    })

    // Нормалізує вхідний AttorneyUrl
    const normalizedCurrent = computed(() =>
        props.currentUrl?.trim() || null
    )

    // Перевіряє чи відрізнається поточний draftField від вхідного AttorneyUrl
    const isDirty = computed(() =>
        normalizedCurrent.value !== normalizedDraft.value
    )

  /// FUNCTIONS
    // Валідація url на відповідність протоколам http/https та шляху https://erau.unba.org.ua/profile/
    function isValidUrlOrEmpty(v: string | null): boolean {
      if (!v?.trim()) return true
      try {
        const u = new URL(v.trim())
        return (
            u.protocol === "https:" &&
            u.hostname === "erau.unba.org.ua" &&
            u.pathname.startsWith("/profile/")
        )
      } catch {
        return false
      }
    }


    // Закриття модального вікна
    function close() {
      emit("close")
    }

    // Внесення змін до AttorneyUrl
    async function submit() {
      error.value = null
      const newUrl = normalizedDraft.value
      if (!isValidUrlOrEmpty(newUrl)) {
        error.value = "Некоректний URL. Дозволено лише http/https або порожнє значення."
        return
      }
      isSubmitting.value = true
      try {
        const AttorneyUrlPatchUrl = (id: number) => `/person/employees/${id}/`
        const { data } = await api.patch(AttorneyUrlPatchUrl(props.employeeId), {
          attorney_register_url: newUrl,
        })
        emit("saved", data.attorney_register_url ?? newUrl ?? null)
        emit("close")
      } catch (e: any) {
        error.value =
            e?.response?.data?.detail ||
            e?.message ||
            "Не вдалося оновити посилання. Спробуйте ще раз."
      } finally {
        isSubmitting.value = false
      }
    }
</script>

<template>
  <div
      class="modal_overlay"
      @click.self="close">

    <!-- Модальне вікно -->
    <div class="modal_box">
      <ContentContainer name="Контейнер модального вікна">
        <h3 class="chapter_title" style="text-align:center">{{ title }}</h3>
        <BaseLine size="full" width="norm"></BaseLine>

        <ContentContainer
            name="Контейнер поточного посилання на профіль в ЄРАУ"
            title="Поточне посилання на профіль адвоката на сайті ЄРАУ"
            padding="none"
            class="important_text">
          Поточне посилання:  {{ normalizedCurrent ? normalizedCurrent : `значення не задано`}}
        </ContentContainer>

        <ContentContainer padding="top">
          <ContentContainer
              padding="none"
              class="important_text">
            Нове посилання:
          </ContentContainer>
          <BaseInput
              flex="column"
              size="lg"
              justify="center"
              v-model="draftField"
              placeholder="https://erau.unba.org.ua/..."
          >
          </BaseInput>

          <div v-if="error" class="error_text" style="margin-top: 10px">
            {{ error }}
          </div>
        </ContentContainer>

        <ContentContainer padding="none" style="display: flex; justify-content: center;">
          <BaseButton
              name="Кнопка закриття модального вікна"
              title="Закрити вікно без змін"
              size="lg"
              @click="close"
              :disabled="isSubmitting"
          >
            Скасувати
          </BaseButton>
          <BaseButton
              name="Кнопка внесення затвердження змін"
              :title="canSubmit
                ? 'Змінити посилання на ЄРАУ'
                : 'Змін не внесено, або посилання не дійсне'"
              size="lg"
              @click="submit"
              :disabled="!canSubmit"
          >
            {{ isSubmitting ? "Збереження..." : "Зберегти" }}
          </BaseButton>
        </ContentContainer>
      </ContentContainer>
    </div>
  </div>
</template>

<style></style>
