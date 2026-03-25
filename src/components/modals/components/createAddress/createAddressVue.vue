<!-- .src/components/modals/components/createEmail/createEmailVue.vue -->

<script setup lang="ts">
/// IMPORT TOOLS
import type { OwnerDTO } from "@/model_schemas/dto/person/owner.dto"
import type { AddressTypes } from "@/model_schemas/models/libraries/address_types.model"
import { useCreateAddressModal } from "@/components/modals/components/createAddress/createAddressTs"

// import base elements
import ContentContainer from "@/components/ui/ContentContainer.vue";
import BaseInput from "@/components/ui/BaseInput.vue"
import BaseButton from "@/components/ui/BaseButton.vue"
import BaseTextArea from "@/components/ui/BaseTextArea.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import BaseToggle from "@/components/ui/BaseToggle.vue";

// import images
import PrivateImg from '@/assets/img/private.svg'
import PrivateNoImg from '@/assets/img/privateNo.svg'
import LockOther from "@/assets/img/lock-other.svg"
import LockFalse from "@/assets/img/lock-false.svg"

const props = defineProps<{
  owner: OwnerDTO
  addressTypes: AddressTypes
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "created"): void
}>()

const vm = useCreateAddressModal(props.owner, emit)
</script>

<template>
  <div class="modal_overlay" >
    <div class="modal_box">
      <ContentContainer padding="none" flex="column">
        <h3 class="chapter_title"
            style="text-align: center">
          Прив'язати нову адресу
        </h3>


        <ContentContainer
            padding="none"
            flex="column">
<!-- ІНДЕКС -->
          <ContentContainer
              padding="none"
              flex="column"
              no-background="true">
            <BaseInput
                size="lg"
                grid="5vw 1fr"
                placeholder="01000"
                v-model="vm.form.value.postal_code">
              Індекс
            </BaseInput>
            <ContentContainer
                v-if="vm.errors.value.fields.postal_code?.length"
                padding="none"
                class="info-container">
              {{ vm.errors.value.fields.postal_code[0] }}
            </ContentContainer>
          </ContentContainer>

<!-- КРАЇНА -->
          <ContentContainer
              no-background="true"
              padding="none"
              flex="column">
            <BaseInput
                size="lg"
                grid="5vw 1fr"
                placeholder="Україна"
                v-model="vm.form.value.country">
              Країна
            </BaseInput>
            <ContentContainer
                v-if="vm.errors.value.fields.country?.length"
                padding="none"
                class="info-container">
              {{ vm.errors.value.fields.country[0] }}
            </ContentContainer>
          </ContentContainer>

<!-- РЕГІОН -->
          <ContentContainer padding="none" flex="column" no-background="true">
            <BaseInput
                size="lg"
                grid="5vw 1fr"
                placeholder="Житомирська"
                v-model="vm.form.value.region">
                <span class="label-block">
                  <span>Область</span>
                  <span class="note_block">(опціонально)</span>
                </span>
            </BaseInput>
            <ContentContainer
                v-if="vm.errors.value.fields.region?.length"
                padding="none"
                class="info-container">
              {{ vm.errors.value.fields.region[0] }}
            </ContentContainer>
          </ContentContainer>

<!-- РАЙОН -->
          <ContentContainer padding="none" flex="column" no-background="true">
            <BaseInput
                size="lg"
                grid="5vw 1fr"
                placeholder="Броварський"
                v-model="vm.form.value.district">
                <span class="label-block">
                  <span>Район</span>
                  <span class="note_block">(опціонально)</span>
                </span>
            </BaseInput>
            <ContentContainer
                v-if="vm.errors.value.fields.district?.length"
                padding="none"
                class="info-container">
              {{ vm.errors.value.fields.district[0] }}
            </ContentContainer>
          </ContentContainer>

<!-- ТЕРИТОРІАЛЬНА ГРОМАДА -->
          <ContentContainer padding="none" flex="column" no-background="true">
            <BaseInput
                size="lg"
                grid="5vw 1fr"
                placeholder="Ірпінська міська територіальна громада"
                v-model="vm.form.value.community">
                <span class="label-block" title="Територіальна громада">
                  <span>Громада</span>
                  <span class="note_block">(опціонально)</span>
                </span>
            </BaseInput>
            <ContentContainer
                v-if="vm.errors.value.fields.community?.length"
                padding="none"
                class="info-container">
              {{ vm.errors.value.fields.community[0] }}
            </ContentContainer>
          </ContentContainer>

<!-- НАСЕЛЕНИЙ ПУНКТ -->
          <ContentContainer
              padding="none"
              flex="column"
              no-background="true">
            <ContentContainer
                padding="none"
                flex="row"
                grid="5vw 10vw 29vw"
                gap="1"
                no-background="true">
              <ContentContainer
                  padding="left"
                  grid="4vw 1fr"
                  no-background="true"
                  size="fit-content"
                  class="important_text"
                  title="Тип та назва населеного пункту">
                НП
              </ContentContainer>
              <BaseSelect
                  name="Випадаючий список типів населених пунктів"
                  size="mds"
                  v-model="vm.form.value.city_type"
                  :maxHeight="500"
              >
                <option value="">—</option>
                <option
                    v-for="opt in props.addressTypes.city_type"
                    :key="opt.value"
                    :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </BaseSelect>
              <BaseInput
                  v-model="vm.form.value.city"
                  placeholder="Київ"
                  size="100">
              </BaseInput>
            </ContentContainer>
            <ContentContainer
                v-if="vm.errors.value.fields.city?.length || vm.errors.value.fields.city_type?.length"
                padding="none"
                class="info-container">
              {{ vm.errors.value.fields.city[0] }}
            </ContentContainer>
          </ContentContainer>

<!-- ВУЛИЦЯ -->
          <ContentContainer
              padding="none"
              flex="column"
              no-background="true">
          <ContentContainer
              padding="none"
              flex="row"
              grid="5vw 10vw 24vw 4vw"
              gap="1"
              no-background="true">
            <ContentContainer
                padding="left"
                class="important_text"
                no-background="true"
                size="fit-content">
              Вулиця
            </ContentContainer>
            <BaseSelect
                name="Випадаючий список типів вулиць"
                size="mds"
                v-model="vm.form.value.street_type"
                :maxHeight="500"
            >
              <option value="">—</option>
              <option
                  v-for="opt in props.addressTypes.street_type"
                  :key="opt.value"
                  :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </BaseSelect>
            <BaseInput v-model="vm.form.value.street" placeholder="Хрещатик" size="100"></BaseInput>
            <BaseInput v-model="vm.form.value.building" placeholder="41" size="100"></BaseInput>
          </ContentContainer>
          <ContentContainer
              v-if="vm.errors.value.fields.street?.length || vm.errors.value.fields.street_type?.length || vm.errors.value.fields.building?.length"
              padding="none"
              class="info-container">
            {{ vm.errors.value.fields.street[0] }}
          </ContentContainer>
        </ContentContainer>

          <ContentContainer
              padding="none"
              flex="row"
              grid="5vw 10vw 29vw"
              gap="1"
              no-background="true">
            <ContentContainer
                padding="left"
                no-background="true"
                size="fit-content"
                title="Тип та номер приміщення (опціонально)"
                class="important_text">
              <span class="label-block">
                  <span>Прим.</span>
                  <span class="note_block">(опціонально)</span>
                </span>
            </ContentContainer>
            <BaseSelect
                name="Випадаючий список типів приміщень"
                size="mds"
                v-model="vm.form.value.unit_type"
                :maxHeight="500"
            >
              <option value="">—</option>
              <option
                  v-for="opt in props.addressTypes.unit_type"
                  :key="opt.value"
                  :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </BaseSelect>
            <BaseInput v-model="vm.form.value.unit_number" placeholder="101" size="100"></BaseInput>
          </ContentContainer>

          <BaseTextArea
              no-background="true"
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