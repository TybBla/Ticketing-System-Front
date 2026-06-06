<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { UserAccount } from '~/types/api'
import UsersTable from '~/components/users/UsersTable.vue'

definePageMeta({
  middleware: 'admin',
})

const UsersCreateDialog = defineAsyncComponent(() => import('~/components/users/UsersCreateDialog.vue'))
const { t } = useAppI18n()

const {
  users,
  isLoading,
  errorMessage,
  successMessage,
  fetchUsers,
  createUser,
  deleteUser,
  clearMessages,
} = useUsers()

const isCreateDialogOpen = ref(false)
const isCreating = ref(false)
const successTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

const handleCreateUser = async (payload: Parameters<typeof createUser>[0]) => {
  isCreating.value = true
  const created = await createUser(payload)
  isCreating.value = false

  if (created) {
    isCreateDialogOpen.value = false
  }
}

const handleDeleteUser = async (user: UserAccount) => {
  const confirmed = window.confirm(t('users.deleteConfirm', { email: user.email }))
  if (!confirmed) return

  await deleteUser(user)
}

watch(isCreateDialogOpen, (open) => {
  if (open) {
    clearMessages()
  }
})

watchEffect((onCleanup) => {
  if (!successMessage.value) return

  successTimeout.value = setTimeout(() => {
    successMessage.value = ''
  }, 4000)

  onCleanup(() => {
    if (successTimeout.value) {
      clearTimeout(successTimeout.value)
    }
  })
})

onMounted(fetchUsers)
</script>

<template>
  <v-container class="py-8">
    <UiPageHeader
      :title="t('users.title')"
      :subtitle="t('users.subtitle')"
      back-to="/"
    >
      <template #actions>
        <v-btn
          color="primary"
          prepend-icon="mdi-account-plus-outline"
          @click="isCreateDialogOpen = true"
        >
          {{ t('users.newUser') }}
        </v-btn>
      </template>
    </UiPageHeader>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4">
      {{ errorMessage }}
    </v-alert>
    <v-alert v-if="successMessage" type="success" variant="tonal" class="mb-4">
      {{ successMessage }}
    </v-alert>

    <v-sheet rounded="lg" border>
      <v-progress-linear v-if="isLoading" indeterminate color="primary" />

      <UsersTable
        :users="users"
        :is-loading="isLoading"
        @delete="handleDeleteUser"
      >
        <template #empty>
          {{ t('users.noUsers') }}
        </template>
      </UsersTable>
    </v-sheet>

    <UsersCreateDialog
      v-if="isCreateDialogOpen"
      v-model="isCreateDialogOpen"
      :is-submitting="isCreating"
      :error-message="errorMessage"
      @create="handleCreateUser"
    />
  </v-container>
</template>
