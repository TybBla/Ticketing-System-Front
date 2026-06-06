import type { FetchOptions } from 'ofetch'

type ApiFetchOptions = FetchOptions<'json'>

export const useApi = () => {
  const authStore = useAuthStore()
  const monitoringStore = useMonitoringStore()

  const apiFetch = async <T>(url: string, options: ApiFetchOptions = {}) => {
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
      throw error
    }
  }

  return {
    apiFetch,
  }
}
