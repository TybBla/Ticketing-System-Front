export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  authStore.hydrate()

  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  if (!authStore.isAdmin) {
    return navigateTo('/')
  }
})
