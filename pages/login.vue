<script setup lang="ts">
import { storeToRefs } from 'pinia'
import QRCode from 'qrcode'
import type { LoginResponse } from '~/types/api'
import { getApiErrorMessage } from '~/utils/apiError'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const preferencesStore = usePreferencesStore()
const { apiFetch } = useApi()
const { t } = useAppI18n()
const { uiTheme } = storeToRefs(preferencesStore)

const email = ref('')
const password = ref('')
const code = ref('')
const preAuthToken = ref('')
const secretKey = ref('')
const requires2FASetup = ref(false)
const isTwoFactorStep = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const qrCodeDataUrl = ref('')
const isDarkTheme = computed(() => uiTheme.value === 'helpdeskDark')

const loginRules = {
  email: [
    (value: string) => Boolean(value) || t('auth.emailRequired'),
    (value: string) => /.+@.+\..+/.test(value) || t('auth.emailInvalid'),
  ],
  password: [
    (value: string) => Boolean(value) || t('auth.passwordRequired'),
  ],
  code: [
    (value: string) => /^\d{6}$/.test(value) || t('auth.codeInvalid'),
  ],
}

const redirectAfterLogin = async () => {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  await router.push(redirect)
}

const otpAuthUri = computed(() => {
  if (!secretKey.value) return ''

  const issuer = t('app.title')
  const account = email.value || 'admin'
  const label = `${issuer}:${account}`
  const params = new URLSearchParams({
    secret: secretKey.value.replace(/\s/g, ''),
    issuer,
    algorithm: 'SHA1',
    digits: '6',
    period: '30',
  })

  return `otpauth://totp/${encodeURIComponent(label)}?${params.toString()}`
})

const shouldShowQrSetup = computed(() => {
  return isTwoFactorStep.value && Boolean(secretKey.value)
})

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true
  requires2FASetup.value = false
  secretKey.value = ''

  try {
    const response = await apiFetch<LoginResponse>('/api/Auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })

    if (response.token) {
      authStore.login(response.token)
      await redirectAfterLogin()
      return
    }

    if (response.requires2FA || response.requires2FASetup) {
      isTwoFactorStep.value = true
      requires2FASetup.value = Boolean(response.requires2FASetup)
      preAuthToken.value = response.preAuthToken || ''
      secretKey.value = response.secretKey || ''
      return
    }

    errorMessage.value = response.message || t('auth.tokenMissing')
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, t('auth.loginFailed'))
  } finally {
    isLoading.value = false
  }
}

const handle2FA = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const response = await apiFetch<LoginResponse>('/api/Auth/verify-2fa', {
      method: 'POST',
      body: {
        preAuthToken: preAuthToken.value,
        code: code.value,
      },
    })

    if (!response.token) {
      errorMessage.value = response.message || t('auth.tokenMissing')
      return
    }

    authStore.login(response.token)
    await redirectAfterLogin()
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, t('auth.twoFactorFailed'))
  } finally {
    isLoading.value = false
  }
}

watch(
  () => [shouldShowQrSetup.value, otpAuthUri.value] as const,
  async ([shouldGenerateQr, uri]) => {
    qrCodeDataUrl.value = ''

    if (!shouldGenerateQr || !uri) return

    qrCodeDataUrl.value = await QRCode.toDataURL(uri, {
      width: 220,
      margin: 2,
      color: {
        dark: '#17344d',
        light: '#ffffff',
      },
    })
  },
  { immediate: true },
)
</script>

<template>
  <v-container fluid class="login-page">
    <div class="login-controls">
      <I18nLocaleSwitcher />
      <v-btn
        :icon="isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        variant="tonal"
        color="primary"
        :aria-label="isDarkTheme ? t('app.lightTheme') : t('app.darkTheme')"
        @click="preferencesStore.toggleUiTheme()"
      />
    </div>

    <div class="login-shell">
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

            <v-form v-if="!isTwoFactorStep" @submit.prevent="handleLogin">
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

            <v-form v-else @submit.prevent="handle2FA">
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
                  @click="isTwoFactorStep = false"
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
    </div>
  </v-container>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  display: grid;
  place-items: center;
  padding: 32px;
  overflow: hidden;
}

.login-page::before {
  position: absolute;
  inset: 0;
  content: "";
  background-image:
    linear-gradient(rgba(var(--v-theme-on-background), 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--v-theme-on-background), 0.035) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent);
  pointer-events: none;
}

.login-controls {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 2;
  display: flex;
  gap: 8px;
  align-items: center;
}

.login-shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(360px, 430px);
  width: min(960px, 100%);
  min-height: 390px;
  overflow: hidden;
  border: 1px solid var(--app-card-border);
  border-radius: 8px;
  background: var(--app-card-bg);
  box-shadow: var(--app-card-shadow);
}

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

@media (max-width: 900px) {
  .login-page {
    align-items: start;
    padding: 88px 18px 24px;
  }

  .login-controls {
    top: 18px;
    right: 18px;
  }

  .login-shell {
    grid-template-columns: 1fr;
  }

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

@media (max-width: 600px) {
  .login-controls {
    left: 18px;
    justify-content: flex-end;
  }

  .two-factor-setup {
    grid-template-columns: 1fr;
  }

  .two-factor-setup__qr {
    width: 100%;
  }
}
</style>
