<!-- .src/components/modals/components/createEmail/createEmailVue.vue -->

<script setup lang="ts">
  /// IMPORT TOOLS
    import type { OwnerDTO } from "@/model_schemas/dto/person/owner.dto"
    import { useCreateEmailModal } from "@/components/modals/components/createEmail/createEmailTs"

    // import base elements
      import ContentContainer from "@/components/ui/ContentContainer.vue";
      import BaseInput from "@/components/ui/BaseInput.vue"
      import BaseButton from "@/components/ui/BaseButton.vue"
      import BaseTextArea from "@/components/ui/BaseTextArea.vue";
      import BaseCheckBox from "@/components/ui/BaseCheckBox.vue";

    const props = defineProps<{ owner: OwnerDTO }>()

    const emit = defineEmits<{
      (e: "close"): void
      (e: "created"): void
    }>()

    const vm = useCreateEmailModal(props.owner, emit)
</script>

<template>
  <div class="modal_overlay" >
    <div class="modal_box">
    <ContentContainer padding="none" flex="column">
      <h3 class="chapter_title"
          style="text-align: center">
        Прив'язати нову електронну пошту
      </h3>

      <ContentContainer padding="none" flex="column">
        <BaseInput
            size="lg"
            grid="100px 1fr"
            placeholder="example@mail.com"
            v-model="vm.form.value.email">
          Email
        </BaseInput>
        <ContentContainer
            v-if="vm.errors.value.fields.email?.length"
            padding="none"
            class="info-container">
          {{ vm.errors.value.fields.email[0] }}
        </ContentContainer>

        <BaseTextArea
            size="lg"
            grid="100px 1fr"
            paddingStyle="0 0 0 1vw"
            v-model="vm.form.value.notes">
          Нотатки
        </BaseTextArea>
        <BaseCheckBox
            title="Ніхто, окрім Вас не буде бачити цього контакту"
            style="padding-left: 6.5vw"
            v-model="vm.form.value.is_personal"
            label="Персональні дані">
        </BaseCheckBox>
        <p v-if="vm.errors.value.nonField.length" class="form-error">
          {{ vm.errors.value.nonField[0] }}
        </p>
      </ContentContainer>

      <ContentContainer padding="top" justifyContent="center" flex="row" no-background="true">
        <BaseButton
            title="Зберегти нову електронну пошту"
            size="lg"
            @click="vm.submit"
            :disabled="vm.isSubmitting.value">
          Зберегти
        </BaseButton>
        <BaseButton
            title="Закрити вікно без змін"
            size="lg"
            @click="$emit('close')">
          Скасувати
        </BaseButton>
      </ContentContainer>
    </ContentContainer>
    </div>
  </div>
</template>