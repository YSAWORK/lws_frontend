<script setup lang="ts">
import { ref, computed } from "vue"
import BaseButton from "@/components/ui/BaseButton.vue"

const props = withDefaults(defineProps<{
  // BaseButton props
  variant?: "light" | "white"
  size?: "sm" | "md" | "lg" | "icon" | "full"
  border?: "none" | "small" | "large"
  disabled?: boolean

  // file input props
  accept?: string
  multiple?: boolean
  capture?: boolean | "user" | "environment"
  resetOnPick?: boolean // щоб можна було вибрати той самий файл ще раз
}>(), {
  variant: "light",
  size: "md",
  border: "none",
  disabled: false,
  multiple: false,
  resetOnPick: true,
})

const emit = defineEmits<{
  (e: "picked", files: File[]): void
  (e: "pickedOne", file: File | null): void
  (e: "error", reason: string): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const isDisabled = computed(() => props.disabled)

function openPicker() {
  if (isDisabled.value) return
  inputRef.value?.click()
}

function onChange(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])

  emit("picked", files)
  emit("pickedOne", files[0] ?? null)

  if (props.resetOnPick) {
    // дозволяє вибрати той самий файл повторно
    input.value = ""
  }
}
</script>

<template>
  <input
      ref="inputRef"
      class="sr-only"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :capture="capture"
      @change="onChange"
  />

  <BaseButton
      :variant="variant"
      :size="size"
      :border="border"
      :disabled="isDisabled"
      @click="openPicker"
  >
    <slot>Обрати файл</slot>
  </BaseButton>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>