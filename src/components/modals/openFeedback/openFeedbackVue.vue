<!-- src/components/modals/openFeedback/editAttorneyUrlVue.vue -->

<script setup lang="ts">
  // IMPORT TOOLS
  import { ref, computed } from "vue"
  import api from "@/api"
  import type { FeedbackShortDTO } from "@/model_schemas/dto/feedback/feedback.dto"
  import { formatDate } from "@/lib/formatDate";
  import ContentContainer from "@/components/ui/ContentContainer.vue";
  import BaseButton from "@/components/ui/BaseButton.vue";
  import BaseLine from "@/components/ui/BaseLine.vue";
  import BaseTextArea from "@/components/ui/BaseTextArea.vue";
  import BaseConfirm from "@/components/ui/BaseConfirm.vue";

  const props = defineProps<{
    title: string
    feedbacks: FeedbackShortDTO[]
    employeeCode?: string
    elementCode?: string
  }>()

  const feedbacksLocal = ref<FeedbackShortDTO[]>(props.feedbacks ?? [])

  const emit = defineEmits<{
    (e: "close"): void
    (e: "published"): void
  }>()

  const isAdding = ref(false)
  const draft = ref("")
  const askPublish = ref(false)
  const isLoading = ref(false)
  const errorText = ref<string | null>(null)

  const canPublish = computed(() => draft.value.trim().length > 0)

  function onClickPublish() {
    if (!canPublish.value || isLoading.value) return
    askPublish.value = true
  }

  async function confirmPublish() {
    const notes = draft.value.trim()
    if (!notes) return

    const employeeCode = props.employeeCode?.trim()
    const elementCode = props.elementCode?.trim()

    if (!employeeCode || !elementCode) {
      errorText.value = "Відсутній employeeCode або elementCode"
      askPublish.value = false
      return
    }

    try {
      isLoading.value = true
      errorText.value = null

      await api.post(`/feedbacks/${elementCode}/create/`, {
        employeeCode,
        notes,
      })

      const { data: list } = await api.get(`/feedbacks/${elementCode}/`)
      feedbacksLocal.value = list

      // reset UI
      draft.value = ""
      isAdding.value = false
      askPublish.value = false

      emit("published")
    } catch (e) {
      console.error(e)
      errorText.value = "Не вдалося опублікувати коментар. Спробуй ще раз."
    } finally {
      isLoading.value = false
    }
  }

  function cancelPublish() {
    askPublish.value = false
  }

  function close() {
    emit("close")
  }
</script>

<template>
  <div class="modal_overlay">
    <div class="modal_box">
      <ContentContainer>
        <h3
            class="chapter_title"
            style="text-align: center"
            title="Глобальні коментарі щодо елемента. Формуються спільнотою LWS">
          Глобальні коментарі:
          <span class="important_text">{{ title }}</span>
        </h3>
        <BaseLine size="full" width="norm"></BaseLine>

        <!-- FEEDBACKs -->
        <ContentContainer
            v-if="feedbacksLocal.length > 0"
            padding="none"
            maxHeight="400px">
          <ContentContainer
              v-for="feedback in feedbacksLocal"
              :key="feedback.id"
              padding="bottom">
            <div class="important_text" title="Дата публікації коментаря"> {{ formatDate(feedback.created_at) }} </div>
            <div> {{ feedback.notes ?? "—" }} </div>
          </ContentContainer>
        </ContentContainer>

        <!-- no-FEEDBACKS TITLE --->
        <ContentContainer
            v-else class="important_no_data_text"
            justifyContent="center" flex="row">
          На даний момент коментарі відсутні
        </ContentContainer>

        <!-- TEXTAREA FOR NEW FEEDBACK -->
        <BaseLine></BaseLine>
        <ContentContainer v-if="isAdding">
          <BaseTextArea
              v-model="draft"
              maxHeight="200px"
              title="Поле для вводу тексту нового коментаря">
          </BaseTextArea>
          <div v-if="errorText" class="important_no_data_text">
            {{ errorText }}
          </div>
        </ContentContainer>

        <!-- BUTTON CONTAINER -->
        <ContentContainer padding="none" justifyContent="center" flex="row">
          <!-- ADD FEEDBACK -->
          <BaseButton
              v-if="!isAdding"
              size="lg"
              @click="isAdding = true"
              title="Кнопка, що відкриває поле для створення нового коментаря">
            Додати коментар
          </BaseButton>
          <!-- PUBLISH FEEDBACK -->
          <BaseButton
              v-if="isAdding"
              size="lg"
              :disabled="!canPublish || isLoading"
              @click="onClickPublish"
              title="Кнопка для публікації нового коментаря. Не активна, доки поле введення тексту порожнє"
          >
            {{ isLoading ? "Публікую..." : "Опублікувати" }}
          </BaseButton>
          <!-- CLOSE MODAL -->
          <BaseButton
              @click="close"
              size="lg"
              title="Закрити вікно">
            Закрити
          </BaseButton>
        </ContentContainer>
      </ContentContainer>

      <!-- CONFIRMATION PUBLISH -->
      <BaseConfirm
          v-model="askPublish"
          title="Опублікувати коментар?"
          confirmText="Так"
          cancelText="Ні"
          :disableConfirm="!canPublish || isLoading"
          @confirm="confirmPublish"
          @cancel="cancelPublish"
      >
        <div
            class="important_text"
            style="text-align: justify; max-height: 60vh; overflow-y: auto;"
            title="Текст нового коментаря">
          "{{ draft.trim() }}"
        </div>
        <div class="info-container" style="padding-top: 1vw;">
          Глобальний коментар неможливо змінити чи видалити після публікації
        </div>
      </BaseConfirm>
    </div>
  </div>
</template>

<style></style>