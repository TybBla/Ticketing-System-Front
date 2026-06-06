<script setup lang="ts">
import { useOnline } from '@vueuse/core'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const online = useOnline()
const { isConnected } = useSignalRNotifications()
const { t } = useAppI18n()

const logout = async () => {
  authStore.logout()
  await router.push('/login')
}

watch(
  () => notificationStore.isToastVisible,
  (visible) => {
    if (!visible) return

    window.setTimeout(() => {
      notificationStore.hideToast()
    }, 5000)
  },
)
</script>

<template>
  <v-layout class="app-layout">
    <v-app-bar class="app-bar" elevation="0">
      <v-app-bar-title class="font-weight-bold app-bar__title">
        {{ t('app.title') }}
      </v-app-bar-title>

      <v-btn to="/" variant="text" prepend-icon="mdi-view-dashboard" class="app-bar__nav-btn">
        {{ t('app.tickets') }}
      </v-btn>
      <v-btn to="/tickets/create" variant="text" prepend-icon="mdi-plus-circle" class="app-bar__nav-btn">
        {{ t('app.newTicket') }}
      </v-btn>
      <v-btn
        v-if="authStore.isAdmin"
        to="/admin/users"
        variant="text"
        prepend-icon="mdi-account-group"
        class="app-bar__nav-btn"
      >
        {{ t('app.users') }}
      </v-btn>
      <v-btn
        v-if="authStore.isAdmin"
        to="/admin/diagnostics"
        variant="text"
        prepend-icon="mdi-monitor-dashboard"
        class="app-bar__nav-btn"
      >
        {{ t('app.diagnostics') }}
      </v-btn>

      <v-spacer />

      <I18nLocaleSwitcher class="mr-2" />
      <v-chip
        v-if="authStore.isAdmin"
        :color="isConnected ? 'success' : 'warning'"
        variant="tonal"
        class="mr-2"
      >
        {{ isConnected ? t('app.live') : t('app.liveOffline') }}
      </v-chip>
      <v-chip
        :color="online ? 'success' : 'error'"
        variant="tonal"
        class="mr-2"
      >
        {{ online ? t('app.online') : t('app.offline') }}
      </v-chip>
      <v-chip v-if="authStore.email" variant="tonal" color="primary" class="mr-3">
        {{ authStore.email }}
      </v-chip>
      <v-btn variant="text" prepend-icon="mdi-logout" @click="logout">
        {{ t('app.logout') }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <NotificationsNotificationToast
      :message="notificationStore.isToastVisible ? notificationStore.lastMessage : null"
      @close="notificationStore.hideToast"
    />
  </v-layout>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: transparent;
}

.app-bar {
  margin: 12px;
  border: 1px solid rgba(95, 109, 126, 0.18);
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(250, 251, 253, 0.94) 0%, rgba(238, 242, 247, 0.94) 100%) !important;
  box-shadow: 0 18px 42px rgba(42, 53, 70, 0.08);
  backdrop-filter: blur(12px);
}

.app-bar__title {
  color: #17344d;
}

.app-bar__nav-btn {
  color: #34495d;
}

:deep(.v-toolbar__content) {
  min-height: 72px !important;
  padding-inline: 20px;
}

:deep(.v-main) {
  padding-top: 96px;
}
</style>
