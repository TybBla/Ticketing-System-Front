<script setup lang="ts">
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
const { apiFetch } = useApi()
const { t } = useAppI18n()

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
  <v-container class="fill-height login-page">
    <v-row justify="center" align="center" class="w-100">
      <v-col cols="12" sm="9" md="6" lg="4">
        <v-card elevation="10" rounded="lg">
          <v-card-item>
            <v-card-title class="text-h4 font-weight-bold">
              {{ t('app.title') }}
            </v-card-title>
            <v-card-subtitle>
              {{ t('auth.subtitle') }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
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
              class="mb-4"
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
                <div>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
}

.two-factor-setup {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
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

@media (max-width: 600px) {
  .two-factor-setup {
    grid-template-columns: 1fr;
  }

  .two-factor-setup__qr {
    width: 100%;
  }
}
</style>
