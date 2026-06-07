import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { Locale } from '~/utils/i18n'

export type UiTheme = 'helpdeskLight' | 'helpdeskDark'

export const usePreferencesStore = defineStore('preferences', () => {
  const locale = useLocalStorage<Locale>('helpdesk-locale', 'pl')
  const uiTheme = useLocalStorage<UiTheme>('helpdesk-ui-theme', 'helpdeskLight')

  const setLocale = (nextLocale: Locale) => {
    locale.value = nextLocale
  }

  const setUiTheme = (nextTheme: UiTheme) => {
    uiTheme.value = nextTheme
  }

  const toggleUiTheme = () => {
    uiTheme.value = uiTheme.value === 'helpdeskLight' ? 'helpdeskDark' : 'helpdeskLight'
  }

  return {
    locale,
    uiTheme,
    setLocale,
    setUiTheme,
    toggleUiTheme,
  }
})
