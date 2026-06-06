import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { Locale } from '~/utils/i18n'

export const usePreferencesStore = defineStore('preferences', () => {
  const locale = useLocalStorage<Locale>('helpdesk-locale', 'pl')

  const setLocale = (nextLocale: Locale) => {
    locale.value = nextLocale
  }

  return {
    locale,
    setLocale,
  }
})
