<script setup lang="ts">
import {
  emailRule,
  requiredRule,
  twoFactorCodeRule,
} from '~/utils/formRules'

defineProps<{
  errorMessage?: string
  isLoading?: boolean
  isTwoFactorStep?: boolean
  qrCodeDataUrl?: string
  shouldShowQrSetup?: boolean
}>()

const emit = defineEmits<{
  back: []
  login: []
  verify: []
}>()

const email = defineModel<string>('email', { default: '' })
const password = defineModel<string>('password', { default: '' })
const code = defineModel<string>('code', { default: '' })
const { t } = useAppI18n()

const loginRules = {
  email: [
    requiredRule(() => t('auth.emailRequired')),
    emailRule(() => t('auth.emailInvalid')),
  ],
  password: [
    requiredRule(() => t('auth.passwordRequired')),
  ],
  code: [
    twoFactorCodeRule(() => t('auth.codeInvalid')),
  ],
}
</script>

<template>
  <v-card class="login-card" elevation="0">
    <v-card-text>
      <div class="login-card__header">
        <p>{{ t('auth.loginPanel') }}</p>
        <h2>
          {{ isTwoFactorStep ? t('auth.twoFactorTitle') : t('auth.signInTitle') }}
        </h2>
      </div>

      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        density="comfortable"
        class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>

      <v-alert
        v-if="isTwoFactorStep && !shouldShowQrSetup"
        type="info"
        variant="tonal"
        density="comfortable"
        class="mb-4"
      >
        <div class="font-weight-bold mb-1">
          {{ t('auth.existing2FATitle') }}
        </div>
        <div class="text-body-2">
          {{ t('auth.existing2FASubtitle') }}
        </div>
      </v-alert>

      <v-alert
        v-if="shouldShowQrSetup"
        type="info"
        variant="tonal"
        density="comfortable"
        :icon="false"
        class="mb-4 two-factor-alert"
      >
        <div class="two-factor-setup">
          <div class="two-factor-setup__qr">
            <v-img
              v-if="qrCodeDataUrl"
              :src="qrCodeDataUrl"
              :alt="t('auth.setupQrAlt')"
              width="180"
              height="180"
            />
            <v-progress-circular v-else indeterminate color="primary" />
          </div>
          <div class="two-factor-setup__content">
            <div class="font-weight-bold mb-1">
              {{ t('auth.setupQrTitle') }}
            </div>
            <div class="text-body-2 mb-3">
              {{ t('auth.setupQrSubtitle') }}
            </div>
          </div>
        </div>
      </v-alert>

      <v-form v-if="!isTwoFactorStep" @submit.prevent="emit('login')">
        <v-text-field
          v-model="email"
          v-focus
          :label="t('auth.email')"
          type="email"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          autocomplete="email"
          :rules="loginRules.email"
        />

        <v-text-field
          v-model="password"
          :label="t('auth.password')"
          type="password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          autocomplete="current-password"
          :rules="loginRules.password"
        />

        <v-btn
          type="submit"
          block
          color="primary"
          size="large"
          :loading="isLoading"
        >
          {{ t('auth.login') }}
        </v-btn>
      </v-form>

      <v-form v-else @submit.prevent="emit('verify')">
        <v-text-field
          v-model="code"
          v-focus
          :label="t('auth.code')"
          prepend-inner-icon="mdi-shield-key-outline"
          variant="outlined"
          inputmode="numeric"
          autocomplete="one-time-code"
          :rules="loginRules.code"
        />

        <div class="d-flex ga-3">
          <v-btn
            variant="tonal"
            :disabled="isLoading"
            @click="emit('back')"
          >
            {{ t('app.back') }}
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            class="flex-grow-1"
            :loading="isLoading"
          >
            {{ t('auth.verify') }}
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.login-card {
  display: flex;
  align-items: center;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  background: rgba(var(--v-theme-surface), 0.48) !important;
  backdrop-filter: none;
}

.login-card :deep(.v-card-text) {
  width: 100%;
  padding: clamp(28px, 3.2vw, 42px);
}

.login-card__header {
  margin-bottom: 24px;
}

.login-card__header p {
  margin: 0 0 6px;
  color: rgb(var(--v-theme-primary));
  font-family: "JetBrains Mono", "Cascadia Code", Consolas, monospace;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.login-card__header h2 {
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.2;
}

.login-card :deep(.v-field) {
  border-radius: 8px;
}

.login-card :deep(.v-btn) {
  min-height: 48px;
  border-radius: 8px;
}

.two-factor-setup {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  justify-items: center;
}

.two-factor-setup__qr {
  display: grid;
  place-items: center;
  width: 196px;
  min-height: 196px;
  padding: 8px;
  border-radius: 16px;
  background: white;
}

.two-factor-setup__content {
  min-width: 0;
  width: 100%;
  line-height: 1.45;
  text-align: center;
}

.two-factor-alert :deep(.v-alert__content) {
  width: 100%;
}

@media (max-width: 600px) {
  .two-factor-setup {
    grid-template-columns: 1fr;
  }

  .two-factor-setup__qr {
    width: 100%;
  }
}
</style>
