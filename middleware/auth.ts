export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  authStore.hydrate()

  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: '/login',
      query: to.fullPath === '/' ? undefined : { redirect: to.fullPath },
    })
  }
})
