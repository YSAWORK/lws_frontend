<script setup lang="ts">
import BaseButton from "@/components/ui/BaseButton.vue"
import BaseImage from "@/components/ui/BaseImage.vue";

const props = defineProps<{
  modelValue: boolean
  title?: string
  image?: string
  disabled?: boolean
  buttonSize?: 'sm' | 'md' | 'lg' | 'icon' | "full"
  imageSize?: 'sm' | 'md' | 'lg' | 'icon' | 'sm-icon'
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

function toggle() {
  if (props.disabled) return
  emit("update:modelValue", !props.modelValue)
}
</script>

<template>
  <BaseButton
      :size="buttonSize"
      class="base-toggle"
      :title="title"
      :class="{
      active: modelValue,
      disabled: disabled,
    }"
      @click="toggle"
  >
    <!-- image -->
    <BaseImage
        v-if="image"
        :src="image"
        :size="imageSize"
        class="toggle-image" />
  </BaseButton>
</template>

<style scoped>
.base-toggle.active {
  background: var(--button-primary-hover);
  transform: scale(0.97);
  box-shadow: inset 0 4px 4px rgba(0,0,0,0.2);
}
</style>