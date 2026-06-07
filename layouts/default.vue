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

      <nav class="app-bar__nav" aria-label="Główna nawigacja">
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
      </nav>

      <div class="app-bar__actions">
        <I18nLocaleSwitcher />
        <div class="theme-toggle">
          <v-btn
            :icon="isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            variant="tonal"
            color="primary"
            :aria-label="isDarkTheme ? t('app.lightTheme') : t('app.darkTheme')"
            @click="preferencesStore.toggleUiTheme()"
          />
          <span class="theme-toggle__tooltip" role="tooltip">
            {{ isDarkTheme ? t('app.lightTheme') : t('app.darkTheme') }}
          </span>
        </div>
        <v-chip
          v-if="authStore.isAdmin"
          :color="isConnected ? 'success' : 'warning'"
          variant="tonal"
          :prepend-icon="isConnected ? 'mdi-bell-ring-outline' : 'mdi-bell-off-outline'"
        >
          {{ isConnected ? t('app.live') : t('app.liveOffline') }}
        </v-chip>
        <v-chip v-if="authStore.email" variant="tonal" color="primary">
          {{ authStore.email }}
        </v-chip>
        <v-btn variant="text" prepend-icon="mdi-logout" @click="logout">
          {{ t('app.logout') }}
        </v-btn>
      </div>
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

.app-bar__nav {
  display: grid;
  flex: 1 1 auto;
  grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
  gap: 8px;
  min-width: 360px;
  margin-inline: 20px;
}

.app-bar__nav-btn {
  width: 100%;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.86;
  justify-content: center;
}

.app-bar__actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
}

.theme-toggle {
  position: relative;
  display: inline-flex;
  overflow: visible;
}

.theme-toggle__tooltip {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  z-index: 4000;
  width: max-content;
  max-width: 260px;
  padding: 7px 11px;
  border-radius: 8px;
  color: #f4f8fc;
  background: #18283a;
  box-shadow: 0 10px 22px rgba(30, 43, 58, 0.24);
  font-size: 0.82rem;
  font-weight: 650;
  line-height: 1.2;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -4px);
  transition: opacity 140ms ease, transform 140ms ease;
  white-space: nowrap;
}

.theme-toggle:hover .theme-toggle__tooltip,
.theme-toggle:focus-within .theme-toggle__tooltip {
  opacity: 1;
  transform: translate(-50%, 0);
}

:deep(.v-toolbar__content) {
  min-height: 72px !important;
  padding-inline: 20px;
  overflow: visible;
}

:deep(.v-main) {
  padding-top: 96px;
}

@media (max-width: 1280px) {
  .app-bar__title {
    min-width: 270px;
    font-size: 1.38rem;
  }

  .app-bar__nav {
    grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
    min-width: 300px;
    margin-inline: 12px;
  }
}
</style>
