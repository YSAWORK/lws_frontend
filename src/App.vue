<!-- App.vue -->
<!-- кореневий (root) компонент всього Vue-додатку
     - є точкою входу для UI
     - нічого не рендерить сам
     - просто делегує все router-->

<template>
  <!-- компонент з Vue Router, що підставляє .vue відповідно до URL з router -->
  <router-view />
</template>