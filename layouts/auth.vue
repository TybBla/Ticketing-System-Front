<template>
  <v-main class="auth-layout">
    <slot />
  </v-main>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 12%, rgba(31, 78, 121, 0.16), transparent 26rem),
    radial-gradient(circle at 88% 18%, rgba(196, 127, 23, 0.1), transparent 20rem),
    linear-gradient(135deg, #e5e9ee 0%, #dce2e9 52%, #e8ecef 100%);
}
</style>
