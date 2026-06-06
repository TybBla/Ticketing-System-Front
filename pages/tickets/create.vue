<script setup lang="ts">
import { TicketCategory } from '~/types/api'
import type { ApiMessage } from '~/types/api'
import { getApiErrorMessage } from '~/utils/apiError'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const { apiFetch } = useApi()
const { t } = useAppI18n()

const draft = ref({
  title: '',
  description: '',
  category: TicketCategory.Hardware,
})
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await apiFetch<ApiMessage>('/api/Tickets', {
      method: 'POST',
      body: {
        title: draft.value.title,
        description: draft.value.description,
        category: Number(draft.value.category),
      },
    })

    await router.push('/')
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, t('tickets.createError'))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <UiPageHeader
          :title="t('tickets.createTitle')"
          :subtitle="t('tickets.createSubtitle')"
          back-to="/"
        />

        <TicketsTicketForm
          v-model="draft"
          :is-submitting="isSubmitting"
          :error-message="errorMessage"
          @submit="handleSubmit"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
