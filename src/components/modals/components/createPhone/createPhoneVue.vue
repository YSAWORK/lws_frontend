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
import BaseToggle from "@/components/ui/BaseToggle.vue";

// import images
import PrivateImg from '@/assets/img/private.svg'
import PrivateNoImg from '@/assets/img/privateNo.svg'
import LockOther from "@/assets/img/lock-other.svg"
import LockFalse from "@/assets/img/lock-false.svg"

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
          <ContentContainer flex="row" paddingStyle="0 0 0 calc(100px + 1vw)">
            <BaseToggle
                v-model="vm.form.value.is_personal"
                :image="vm.form.value.is_personal ? PrivateImg : PrivateNoImg"
                :title="vm.form.value.is_personal ? `Приватний компонент. Видимий лише Вам. Натисніть щоб змінити` : 'Публічний компонент. Видимий команді. Натисніть щоб змінити'"
                buttonSize="md"
                imageSize="icon"
            />
            <BaseToggle
                v-model="vm.form.value.is_blocked"
                :image="vm.form.value.is_blocked ? LockOther : LockFalse"
                :title="vm.form.value.is_personal ? `Компонент не заблоковано. Дозволена зміна та видалення. Натисніть щоб змінити` : 'Компонент заблоковано. Заборонена зміна та видалення. Натисніть щоб змінити'"
                buttonSize="md"
                imageSize="icon"
            />
          </ContentContainer>
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