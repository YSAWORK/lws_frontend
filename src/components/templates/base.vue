<script setup lang="ts">
  import { ref } from 'vue';  import { BaseView} from './base'
  const {
    loading,
    error,
    onLogout,
  } = BaseView()
</script>

<template>
  <div id="header">
    <div class="header_block" id="logo_block">
      <img id="img_logo" src="@/assets/img/logo.png" alt="Logo" />
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
        <h1>Right column</h1>
      </slot>
    </div>
  </div>

  <div id="footer" class="header_row">
    <div>
      FOOTER
    </div>
  </div>
</template>

<style src="@/assets/css/main.css"></style>
