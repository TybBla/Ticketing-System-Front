import type { ApiMessage, CreateUserRequest, UserAccount } from '~/types/api'
import { getApiErrorMessage } from '~/utils/apiError'

export const useUsers = () => {
  const { apiFetch } = useApi()
  const { t } = useAppI18n()

  const users = ref<UserAccount[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  const clearMessages = () => {
    errorMessage.value = ''
    successMessage.value = ''
  }

  const fetchUsers = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      users.value = await apiFetch<UserAccount[]>('/api/Users')
    } catch (error) {
      errorMessage.value = getApiErrorMessage(error, t('users.fetchError'))
    } finally {
      isLoading.value = false
    }
  }

  const createUser = async (payload: CreateUserRequest) => {
    clearMessages()

    try {
      const response = await apiFetch<ApiMessage>('/api/Users', {
        method: 'POST',
        body: payload,
      })

      successMessage.value = response.message || t('users.createSuccess')
      await fetchUsers()
      return true
    } catch (error) {
      errorMessage.value = getApiErrorMessage(error, t('users.createError'))
      return false
    }
  }

  const deleteUser = async (user: UserAccount) => {
    clearMessages()

    try {
      const response = await apiFetch<ApiMessage>(`/api/Users/${user.id}`, {
        method: 'DELETE',
      })

      successMessage.value = response.message || t('users.deleteSuccess')
      await fetchUsers()
      return true
    } catch (error) {
      errorMessage.value = getApiErrorMessage(error, t('users.deleteError'))
      return false
    }
  }

  return {
    users,
    isLoading,
    errorMessage,
    successMessage,
    clearMessages,
    fetchUsers,
    createUser,
    deleteUser,
  }
}
