<script setup lang="ts">
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const preferencesStore = usePreferencesStore()
const { isConnected } = useSignalRNotifications()
const { t } = useAppI18n()
const { uiTheme } = storeToRefs(preferencesStore)
const isDarkTheme = computed(() => uiTheme.value === 'helpdeskDark')

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
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            :icon="isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            variant="tonal"
            color="primary"
            class="mr-2"
            :aria-label="isDarkTheme ? t('app.lightTheme') : t('app.darkTheme')"
            @click="preferencesStore.toggleUiTheme()"
          />
        </template>
        <span>{{ isDarkTheme ? t('app.lightTheme') : t('app.darkTheme') }}</span>
      </v-tooltip>
      <v-chip
        v-if="authStore.isAdmin"
        :color="isConnected ? 'success' : 'warning'"
        variant="tonal"
        class="mr-2"
        :prepend-icon="isConnected ? 'mdi-bell-ring-outline' : 'mdi-bell-off-outline'"
      >
        {{ isConnected ? t('app.live') : t('app.liveOffline') }}
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
  border: 1px solid var(--app-card-border);
  border-radius: 20px;
  background: var(--app-bar-bg) !important;
  box-shadow: var(--app-bar-shadow);
  backdrop-filter: blur(12px);
}

.app-bar__title {
  flex: 0 0 auto;
  min-width: 320px;
  color: var(--app-title-color);
  font-family: "JetBrains Mono", "Cascadia Code", Consolas, monospace;
  font-size: 1.62rem;
  font-style: normal;
  font-weight: 800;
  letter-spacing: 0.045em;
  line-height: 1.2;
  overflow: visible;
  text-transform: uppercase;
  transform: none;
  transform-origin: left center;
  text-shadow:
    0 1px 0 rgba(255, 255, 255, 0.38),
    0 0 18px rgba(31, 78, 121, 0.12),
    var(--app-title-shadow);
}

.app-bar__title :deep(.v-toolbar-title__placeholder) {
  overflow: visible;
  text-overflow: clip;
  line-height: 1.2;
}

.app-bar__nav-btn {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.86;
}

:deep(.v-toolbar__content) {
  min-height: 72px !important;
  padding-inline: 20px;
}

:deep(.v-main) {
  padding-top: 96px;
}
</style>
