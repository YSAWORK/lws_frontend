<!-- .src/components/templates/base.vue -->

<script setup lang="ts">
  import { ref} from "vue";
  import { BaseView } from "./base";
  import BaseButton from "@/components/ui/BaseButton.vue";
  const { loading, onLogout } = BaseView();
</script>

<template>
  <div id="header">
    <div class="header_block" id="logo_block">

    </div>
    <div class="header_block">
      <div id="page_title">
        <slot name="page_title">
          Page Title
        </slot>
      </div>
      <div id="path_bar">
        <slot name="path_bar">
          HomePage | Section | Subsection
        </slot>
      </div>
    </div>
    <div class="header_block">
      <button type="button" :disabled="loading" @click="onLogout">
        {{ loading ? 'Вихід…' : 'Logout' }}
      </button>
    </div>
  </div>

  <div id = 'main_div'>
    <div id = 'main_column_left'>
      <slot name="main_column_left"></slot>
    </div>
    <div id = 'main_column_right'>
      <slot name="main_column_right">
        <BaseButton size="lg"> Кабінет </BaseButton>
      </slot>
    </div>
  </div>

  <div id="footer" class="header_row">
    <div>
      FOOTER
    </div>
  </div>
</template>

<style src="@/styles/base.css"></style>
