import { storeToRefs } from 'pinia'
import type { Locale } from '~/utils/i18nTypes'
import { locales, resolveMessage } from '~/utils/i18n'

type Params = Record<string, string | number>

export const useAppI18n = () => {
  const preferencesStore = usePreferencesStore()
  const { locale } = storeToRefs(preferencesStore)

  const t = (key: string, params: Params = {}) => {
    const template = resolveMessage(locale.value, key)

    return Object.entries(params).reduce((text, [paramKey, value]) => {
      return text.replaceAll(`{${paramKey}}`, String(value))
    }, template)
  }

  const setLocale = (locale: Locale) => {
    preferencesStore.setLocale(locale)
  }

  return {
    locale,
    locales,
    setLocale,
    t,
  }
}
