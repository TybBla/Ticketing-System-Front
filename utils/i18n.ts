import { enMessages } from './i18n/en'
import { plMessages } from './i18n/pl'
import type { Locale, TranslationTree } from './i18nTypes'

export const locales: Array<{ code: Locale, label: string }> = [
  { code: 'pl', label: 'PL' },
  { code: 'en', label: 'EN' },
]

export const messages: Record<Locale, TranslationTree> = {
  pl: plMessages,
  en: enMessages,
}

export const resolveMessage = (locale: Locale, key: string) => {
  const parts = key.split('.')
  let current: string | TranslationTree | undefined = messages[locale]

  for (const part of parts) {
    if (typeof current !== 'object' || current === null) return key
    current = current[part]
  }

  return typeof current === 'string' ? current : key
}
