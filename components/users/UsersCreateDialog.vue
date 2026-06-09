<script setup lang="ts">
import type { CreateUserRequest } from '~/types/api'
import { Role } from '~/types/api'
import {
  emailRule,
  minLengthRule,
  requiredRule,
} from '~/utils/formRules'

defineProps<{
  isSubmitting?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  create: [payload: CreateUserRequest]
}>()

const { t } = useAppI18n()
const labels = useHelpdeskLabels()
const isOpen = defineModel<boolean>({ default: false })
const form = ref()

const draft = ref<CreateUserRequest>({
  email: '',
  password: '',
  role: Role.Employee,
  contactInfo: '',
})

const roles = computed(() => [
  { title: labels.roles[Role.Employee], value: Role.Employee },
  { title: labels.roles[Role.Admin], value: Role.Admin },
])

const emailRules = [
  requiredRule(() => t('auth.emailRequired')),
  emailRule(() => t('auth.emailInvalid')),
]

const passwordRules = [
  requiredRule(() => t('auth.passwordRequired')),
  minLengthRule(6, () => t('users.passwordMin')),
]

const resetDraft = () => {
  draft.value = {
    email: '',
    password: '',
    role: Role.Employee,
    contactInfo: '',
  }
}

const submit = async () => {
  const result = await form.value?.validate()
  if (result && !result.valid) return

  emit('create', {
    ...draft.value,
    contactInfo: draft.value.contactInfo?.trim() || null,
  })
}

watch(isOpen, (open) => {
  if (open) {
    resetDraft()
  }
})
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <v-dialog v-model="isOpen" max-width="560" persistent>
        <v-card rounded="lg">
          <v-card-item>
            <v-card-title class="text-h5 font-weight-bold">
              {{ t('users.newUser') }}
            </v-card-title>
            <v-card-subtitle>
              {{ t('users.newUserSubtitle') }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              {{ errorMessage }}
            </v-alert>

            <v-form ref="form" @submit.prevent="submit">
              <v-text-field
                v-model="draft.email"
                v-focus
                :label="t('auth.email')"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                autocomplete="email"
                :rules="emailRules"
              />

              <v-text-field
                v-model="draft.password"
                :label="t('auth.password')"
                type="password"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                autocomplete="new-password"
                :rules="passwordRules"
              />

              <v-select
                v-model="draft.role"
                :label="t('users.role')"
                :items="roles"
                item-title="title"
                item-value="value"
                prepend-inner-icon="mdi-account-badge-outline"
                variant="outlined"
              />

              <v-text-field
                v-model="draft.contactInfo"
                :label="t('users.contact')"
                prepend-inner-icon="mdi-card-account-phone-outline"
                variant="outlined"
                :placeholder="t('users.contactPlaceholder')"
              />

              <v-card-actions class="px-0 pb-0">
                <v-spacer />
                <v-btn
                  variant="tonal"
                  :disabled="isSubmitting"
                  @click="isOpen = false"
                >
                  {{ t('app.cancel') }}
                </v-btn>
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="isSubmitting"
                >
                  {{ t('users.createAccount') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </Teleport>
  </ClientOnly>
</template>
