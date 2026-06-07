import type { FetchOptions } from 'ofetch'

type ApiFetchOptions = FetchOptions<'json'>

const getResponseStatus = (error: unknown) => {
  if (!error || typeof error !== 'object') return null

  const apiError = error as {
    status?: number
    statusCode?: number
    response?: {
      status?: number
    }
  }

  return apiError.response?.status || apiError.statusCode || apiError.status || null
}

export const useApi = () => {
  const authStore = useAuthStore()
  const monitoringStore = useMonitoringStore()
  const route = useRoute()

  const apiFetch = async <T>(url: string, options: ApiFetchOptions = {}) => {
    const hadToken = Boolean(authStore.token)
    const headers = new Headers(options.headers as HeadersInit)

    if (authStore.token) {
      headers.set('Authorization', `Bearer ${authStore.token}`)
    }

    try {
      return await $fetch<T>(url, {
        ...options,
        headers,
      })
    } catch (error) {
      monitoringStore.captureError(error, `API ${options.method || 'GET'} ${url}`)

      if (getResponseStatus(error) === 401 && hadToken && route.path !== '/login') {
        authStore.logout()

        if (import.meta.client) {
          await navigateTo({
            path: '/login',
            query: { redirect: route.fullPath },
          })
        }
      }

      throw error
    }
  }

  return {
    apiFetch,
  }
}
