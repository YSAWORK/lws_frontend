<!-- .src/components/modals/components/createEmail/createEmailVue.vue -->

<script setup lang="ts">
/// IMPORT TOOLS
import type { OwnerDTO } from "@/model_schemas/dto/person/owner.dto"
import { useCreatePhoneModal } from "@/components/modals/components/createPhone/createPhoneTs"

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

const vm = useCreatePhoneModal(props.owner, emit)
</script>

<template>
  <div class="modal_overlay" >
    <div class="modal_box">
      <ContentContainer padding="none" flex="column">
        <h3 class="chapter_title"
            style="text-align: center">
          Прив'язати новий номер телефону
        </h3>

        <ContentContainer padding="none" flex="column">
          <BaseInput
              size="lg"
              grid="100px 1fr"
              placeholder="+380951112233"
              v-model="vm.form.value.phone_number">
            Номер
          </BaseInput>

          <ContentContainer
              v-if="vm.errors.value.fields.phone_number?.length"
              padding="none"
              class="info-container">
            {{ vm.errors.value.fields.phone_number[0] }}
          </ContentContainer>

          <BaseTextArea
              size="lg"
              grid="100px 1fr"
              paddingStyle="0 0 0 1vw"
              v-model="vm.form.value.notes">
            Нотатки
          </BaseTextArea>
          <p v-if="vm.errors.value.nonField.length" class="form-error">
            {{ vm.errors.value.nonField[0] }}
          </p>
          <BaseCheckBox
              title="Ніхто, окрім Вас не буде бачити цього контакту"
              style="padding-left: 6.5vw"
              v-model="vm.form.value.is_personal"
              label="Персональні дані">
          </BaseCheckBox>
        </ContentContainer>

        <ContentContainer padding="top" justifyContent="center" flex="row" no-background="true">
          <BaseButton
              title="Зберегти новий номер телефону"
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