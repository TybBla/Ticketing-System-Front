<template>
  <v-main class="auth-layout">
    <slot />
  </v-main>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: var(--app-auth-bg);
}
</style>
