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
const isTwoFactorStep = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const qrCodeDataUrl = ref('')
const isDarkTheme = computed(() => uiTheme.value === 'helpdeskDark')

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

const backToPasswordStep = () => {
  isTwoFactorStep.value = false
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
      <AuthLoginBrandPanel />
      <AuthLoginCard
        v-model:email="email"
        v-model:password="password"
        v-model:code="code"
        :error-message="errorMessage"
        :is-loading="isLoading"
        :is-two-factor-step="isTwoFactorStep"
        :qr-code-data-url="qrCodeDataUrl"
        :should-show-qr-setup="shouldShowQrSetup"
        @back="backToPasswordStep"
        @login="handleLogin"
        @verify="handle2FA"
      />
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
}

@media (max-width: 600px) {
  .login-controls {
    left: 18px;
    justify-content: flex-end;
  }
}
</style>
