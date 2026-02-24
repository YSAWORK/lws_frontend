<!-- src/components/ui/BaseConfirm.vue -->
<script setup lang="ts">
  // IMPORT TOOLS
  import ContentContainer from "@/components/ui/ContentContainer.vue"
  import BaseButton from "@/components/ui/BaseButton.vue"
  import BaseLine from "@/components/ui/BaseLine.vue";

  const props = withDefaults(defineProps<{
    modelValue: boolean
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    disableConfirm?: boolean
  }>(), {
    title: "Підтвердження",
    message: "Ви впевнені?",
    confirmText: "Так",
    cancelText: "Ні",
    disableConfirm: false,
  })

  const emit = defineEmits<{
    (e: "update:modelValue", v: boolean): void
    (e: "confirm"): void
    (e: "cancel"): void
  }>()

  function close() {
    emit("update:modelValue", false)
  }

  function onCancel() {
    emit("cancel")
    close()
  }

  function onConfirm() {
    if (props.disableConfirm) return
    emit("confirm")
    close()
  }
</script>

<template>
  <div
      v-if="modelValue"
      class="modal_overlay"
      @click.self="onCancel">
    <div
        class="confirm_box"
        role="dialog"
        aria-modal="true">
      <div
          class="chapter_title"
          style="text-align: center">
        {{ title }}
      </div>
      <BaseLine></BaseLine>
      <div class="confirm_message" >
        <slot>
          {{ message }}
        </slot>
      </div>

      <ContentContainer
          padding="none"
          justifyContent="center"
          flex="row"
          class="confirm_actions"
          gap="1">
        <BaseButton
            size="lg"
            title="Підтвердити зміни"
            :disabled="disableConfirm"
            @click="onConfirm">
          {{ confirmText }}
        </BaseButton>
        <BaseButton
            size="lg"
            title="Закрити вікно без змін"
            @click="onCancel">
          {{ cancelText }}
        </BaseButton>
      </ContentContainer>
    </div>
  </div>
</template>

<style scoped>
  .confirm_box{
    width: min(600px, 92vw);
    padding: 1vw;
    background: var(--bg);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-dark);
  }

  .confirm_message{
    text-align: center;
    opacity: 0.9;
    margin-bottom: 1vw;
  }

</style>