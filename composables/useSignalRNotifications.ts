import * as signalR from '@microsoft/signalr'
import type { TicketCreatedEvent } from '~/types/api'

export const useSignalRNotifications = () => {
  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()
  const config = useRuntimeConfig()

  const connection = shallowRef<signalR.HubConnection | null>(null)
  const isConnected = ref(false)
  const connectionError = ref('')

  const disconnect = async () => {
    if (!connection.value) return

    await connection.value.stop()
    connection.value = null
    isConnected.value = false
  }

  const connect = async () => {
    if (!import.meta.client || !authStore.token || !authStore.isAdmin || connection.value) {
      return
    }

    connectionError.value = ''

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(config.public.notificationHubPath, {
        accessTokenFactory: () => authStore.token || '',
      })
      .withAutomaticReconnect()
      .build()

    hubConnection.on('ReceiveNewTicket', (ticket: TicketCreatedEvent) => {
      notificationStore.showTicketCreated(ticket)
    })

    hubConnection.onreconnected(() => {
      isConnected.value = true
      connectionError.value = ''
    })

    hubConnection.onclose((error) => {
      isConnected.value = false
      if (error) {
        connectionError.value = error.message
      }
    })

    try {
      await hubConnection.start()
      connection.value = hubConnection
      isConnected.value = true
    } catch (error) {
      connectionError.value = error instanceof Error ? error.message : 'Nie udało się połączyć z SignalR.'
      connection.value = null
      isConnected.value = false
    }
  }

  watch(
    () => [authStore.token, authStore.isAdmin] as const,
    async ([token, isAdmin]) => {
      if (token && isAdmin) {
        await connect()
      } else {
        await disconnect()
      }
    },
  )

  onMounted(connect)
  onBeforeUnmount(disconnect)

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
  }
}
