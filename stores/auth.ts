import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

type JwtPayload = Record<string, unknown>

const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
const emailClaimKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'

const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) return null

    const normalizedPayload = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(normalizedPayload)) as JwtPayload
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(import.meta.client ? localStorage.getItem('token') : null)

  const hydrate = () => {
    if (!import.meta.client) return
    token.value = localStorage.getItem('token')
  }

  const login = (newToken: string) => {
    token.value = newToken
    if (import.meta.client) {
      localStorage.setItem('token', newToken)
    }
  }

  const logout = () => {
    token.value = null
    if (import.meta.client) {
      localStorage.removeItem('token')
    }
  }

  const payload = computed(() => token.value ? decodeJwtPayload(token.value) : null)

  const role = computed(() => {
    const claim = payload.value?.[roleClaimKey] || payload.value?.role
    return typeof claim === 'string' ? claim : null
  })

  const email = computed(() => {
    const claim = payload.value?.[emailClaimKey] || payload.value?.email
    return typeof claim === 'string' ? claim : null
  })

  const userId = computed(() => {
    const claim = payload.value?.sub || payload.value?.nameid
    return typeof claim === 'string' ? claim : null
  })

  const isAuthenticated = computed(() => Boolean(token.value))
  const isAdmin = computed(() => role.value === 'Admin')
  const isEmployee = computed(() => role.value === 'Employee')

  return {
    token,
    payload,
    role,
    email,
    userId,
    isAuthenticated,
    isAdmin,
    isEmployee,
    hydrate,
    login,
    logout,
  }
})
