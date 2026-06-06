<script setup lang="ts">
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

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

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
              v-if="requires2FASetup && secretKey"
              type="info"
              variant="tonal"
              density="comfortable"
              class="mb-4"
            >
              {{ t('auth.setup', { secret: secretKey }) }}
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
</style>
