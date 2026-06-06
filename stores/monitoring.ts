import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export type MonitoringLevel = 'info' | 'warning' | 'error'

export interface MonitoringEvent {
  id: string
  level: MonitoringLevel
  message: string
  source: string
  createdAt: string
  details?: string
}

const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error.stack,
    }
  }

  if (typeof error === 'string') {
    return {
      message: error,
      details: undefined,
    }
  }

  return {
    message: 'Unknown error',
    details: JSON.stringify(error),
  }
}

export const useMonitoringStore = defineStore('monitoring', () => {
  const events = useLocalStorage<MonitoringEvent[]>('helpdesk-monitoring-events', [])

  const capture = (event: Omit<MonitoringEvent, 'id' | 'createdAt'>) => {
    events.value = [
      {
        ...event,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
      ...events.value,
    ].slice(0, 50)
  }

  const captureError = (error: unknown, source: string) => {
    const serialized = serializeError(error)
    capture({
      level: 'error',
      source,
      message: serialized.message,
      details: serialized.details,
    })
  }

  const captureInfo = (message: string, source: string, details?: string) => {
    capture({
      level: 'info',
      source,
      message,
      details,
    })
  }

  const clear = () => {
    events.value = []
  }

  return {
    events,
    capture,
    captureError,
    captureInfo,
    clear,
  }
})
