<script setup lang="ts">
import { TicketCategory } from '~/types/api'

export interface TicketDraft {
  title: string
  description: string
  category: TicketCategory
}

defineProps<{
  isSubmitting?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  submit: []
}>()

const { t } = useAppI18n()

const draft = defineModel<TicketDraft>({
  required: true,
})

const labels = useHelpdeskLabels()

const categories = computed(() => [
  { title: labels.ticketCategories[TicketCategory.Hardware], value: TicketCategory.Hardware },
  { title: labels.ticketCategories[TicketCategory.Software], value: TicketCategory.Software },
])

const titleRules = [
  (value: string) => Boolean(value) || t('tickets.titleRequired'),
  (value: string) => value.length >= 5 || t('tickets.titleMin'),
]

const descriptionRules = [
  (value: string) => Boolean(value) || t('tickets.descriptionRequired'),
  (value: string) => value.length >= 10 || t('tickets.descriptionMin'),
]
</script>

<template>
  <v-card rounded="lg" elevation="0" border>
    <v-card-text>
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>

      <v-form @submit.prevent="emit('submit')">
        <v-text-field
          v-model="draft.title"
          v-focus
          :label="t('tickets.title')"
          variant="outlined"
          prepend-inner-icon="mdi-format-title"
          :rules="titleRules"
        />

        <v-select
          v-model="draft.category"
          :label="t('tickets.category')"
          :items="categories"
          item-title="title"
          item-value="value"
          variant="outlined"
          prepend-inner-icon="mdi-shape-outline"
        />

        <v-textarea
          v-model="draft.description"
          :label="t('tickets.description')"
          variant="outlined"
          prepend-inner-icon="mdi-text-box-outline"
          rows="5"
          :rules="descriptionRules"
        />

        <slot name="actions">
          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            :loading="isSubmitting"
          >
            {{ t('tickets.createSubmit') }}
          </v-btn>
        </slot>
      </v-form>
    </v-card-text>
  </v-card>
</template>
