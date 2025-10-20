<!-- ./src/components/templates/auth/LoginView.vue -->
<!-- Component for user login with email/password and safecode verification -->


<script setup lang="ts">
// IMPORT TS
import { LoginView } from './LoginView'
const {
  // STATE
  username,
  password,
  loginLoading,
  loginError,
  loginSucceeded,
  safe_code,
  safeLoading,
  safeError,
  countdownActive,
  mmss,
  // METHODS
  onLoginSubmit, onSafeSubmit,
} = LoginView()
</script>

<template>
  <div class="container">
    <h1>Login</h1>

    <!-- LOGIN FORM -->
    <form id="login-form" @submit.prevent="onLoginSubmit">
      <label class="input_label">Ім'я користувача</label>
      <input v-model="username" type="text" required />

      <label class="input_label">Пароль</label>
      <input v-model="password" type="password" required />

      <button
          :disabled="loginLoading || countdownActive"
          type="submit"
          :title="countdownActive ? 'Після спливу часу код безпеки буде не актуальним' : 'Введіть користувача та пароль і отримайте код безпеки на email'"
      >
        <template v-if="countdownActive"> {{ mmss }} </template>
        <template v-else>Отримати код безпеки</template>
      </button>
    </form>

    <!-- SAFECODE FORM -->
    <form id="safecode-form" @submit.prevent="onSafeSubmit">
      <label class="input_label">Код безпеки</label>
      <input v-model="safe_code" type="text" required />

      <button
          :disabled="safeLoading || !loginSucceeded"
          type="submit"
          :title='loginSucceeded ? "Увійти до системи" : "Спочатку введіть користувача та пароль і отримайте код безпеки на email"'
      >
        Увійти до системи
      </button>
    </form>
  </div>
  <!-- MESSAGES -->
  <p v-if="safeError" class="error">{{ safeError }}</p>
  <p v-if="loginError" class="error">{{ loginError }}</p>
  <p v-if="loginSucceeded" class="info">{{ loginSucceeded }}</p>
</template>

<style src="@/assets/css/auth.css"></style>
