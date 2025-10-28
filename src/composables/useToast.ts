import { ref } from 'vue'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning'
  duration?: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
  const addToast = (options: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const duration = options.duration ?? 3000

    const toast: Toast = {
      id,
      variant: 'default',
      ...options
    }

    toasts.value.push(toast)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const toast = (options: Omit<Toast, 'id'>) => {
    return addToast(options)
  }

  return {
    toast,
    toasts,
    removeToast
  }
}
