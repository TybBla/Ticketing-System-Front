<script setup lang="ts">
const { t } = useAppI18n()
</script>

<template>
  <section class="login-brand-panel" aria-labelledby="login-title">
    <p class="login-kicker">
      {{ t('auth.panelLabel') }}
    </p>
    <h1 id="login-title">
      {{ t('app.title') }}
    </h1>
    <p class="login-brand-copy">
      {{ t('auth.subtitle') }}
    </p>
  </section>
</template>

<style scoped>
.login-brand-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(28px, 3.4vw, 42px);
  border-right: 1px solid var(--app-card-border);
  background:
    linear-gradient(135deg, rgba(var(--v-theme-primary), 0.14), transparent 46%),
    rgba(var(--v-theme-surface-bright), 0.28);
}

.login-kicker {
  margin: 0 0 14px;
  color: rgb(var(--v-theme-primary));
  font-family: "JetBrains Mono", "Cascadia Code", Consolas, monospace;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.login-brand-panel h1 {
  max-width: 520px;
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
  font-size: clamp(2.25rem, 4.4vw, 3.6rem);
  font-weight: 850;
  line-height: 1;
  letter-spacing: 0;
}

.login-brand-copy {
  max-width: 430px;
  margin: 16px 0 0;
  color: rgba(var(--v-theme-on-surface), 0.68);
  font-size: 1.05rem;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .login-brand-panel {
    border-right: 0;
    border-bottom: 1px solid var(--app-card-border);
  }

  .login-kicker {
    margin-top: 0;
  }

  .login-brand-panel h1 {
    font-size: 2.15rem;
  }
}
</style>
