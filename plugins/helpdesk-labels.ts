import { helpdeskLabels, helpdeskLabelsKey } from '~/utils/helpdeskLabels'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide(helpdeskLabelsKey, helpdeskLabels)
})
