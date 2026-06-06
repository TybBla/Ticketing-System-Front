<script setup lang="ts">
import type { UserAccount } from '~/types/api'
import { Role } from '~/types/api'

defineProps<{
  users: UserAccount[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  delete: [user: UserAccount]
}>()

const labels = useHelpdeskLabels()
const { t } = useAppI18n()
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th>{{ t('auth.email') }}</th>
        <th>{{ t('users.role') }}</th>
        <th>{{ t('users.twoFactor') }}</th>
        <th>{{ t('users.contact') }}</th>
        <th class="text-right">{{ t('tickets.actions') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="!isLoading && users.length === 0">
        <td colspan="5" class="text-center text-medium-emphasis py-8">
          <slot name="empty">
            {{ t('users.noUsers') }}
          </slot>
        </td>
      </tr>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.email }}</td>
        <td>
          <v-chip size="small" :color="user.role === Role.Admin ? 'primary' : 'default'" variant="tonal">
            {{ labels.roles[user.role] }}
          </v-chip>
        </td>
        <td>{{ user.twoFactorEnabled ? t('users.active') : t('users.inactive') }}</td>
        <td>{{ user.contactInfo || t('users.noContact') }}</td>
        <td class="text-right">
          <slot name="actions" :user="user">
            <v-btn
              icon="mdi-delete-outline"
              color="error"
              variant="text"
              :aria-label="t('users.deleteLabel')"
              @click="emit('delete', user)"
            />
          </slot>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
