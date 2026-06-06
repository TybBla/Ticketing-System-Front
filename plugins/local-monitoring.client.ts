export default defineNuxtPlugin((nuxtApp) => {
  const monitoringStore = useMonitoringStore()

  nuxtApp.vueApp.config.errorHandler = (error, _instance, info) => {
    monitoringStore.captureError(error, `Vue: ${info}`)
  }

  window.addEventListener('error', (event) => {
    monitoringStore.captureError(event.error || event.message, 'window.error')
  })

  window.addEventListener('unhandledrejection', (event) => {
    monitoringStore.captureError(event.reason, 'window.unhandledrejection')
  })
})
