<template>
  <div v-if="open" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
      <h2 class="text-xl font-bold text-foreground mb-4">Create New Ticket</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-foreground mb-2"> Title </label>
          <Input
            id="title"
            name="title"
            placeholder="Ticket title"
            v-model="formData.title"
            :disabled="isLoading"
            :class="errors.title ? 'border-destructive' : ''"
          />
          <p v-if="errors.title" class="text-sm text-destructive mt-1">{{ errors.title }}</p>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Ticket description"
            v-model="formData.description"
            :disabled="isLoading"
            :class="`w-full px-3 py-2 border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.description ? 'border-destructive' : 'border-input'
            }`"
            rows="4"
          />
          <p v-if="errors.description" class="text-sm text-destructive mt-1">
            {{ errors.description }}
          </p>
        </div>

        <!-- Status & Priority -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="status" class="block text-sm font-medium text-foreground mb-2">Status</label>
            <select
              id="status"
              v-model="formData.status"
              :disabled="isLoading"
              class="w-full px-3 py-2 border border-input rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label for="priority" class="block text-sm font-medium text-foreground mb-2">
              Priority
            </label>
            <select
              id="priority"
              v-model="formData.priority"
              :disabled="isLoading"
              class="w-full px-3 py-2 border border-input rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            @click="handleCancel"
            :disabled="isLoading"
            class="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" :disabled="isLoading" class="flex-1">
            {{ isLoading ? 'Creating...' : 'Create Ticket' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { createTicket } from '../lib/tickets'
import { ticketSchema } from '../lib/validation'
import { useToast } from './useToast'
import Button from './Button.vue'
import Input from './Input.vue'

const { showToast } = useToast()

const props = defineProps({
  open: { type: Boolean, required: true },
  onTicketCreated: { type: Function, required: true },
})

const emit = defineEmits(['update:open'])

const isLoading = ref(false)
const errors = ref<Record<string, string>>({})
const formData = ref({
  title: '',
  description: '',
  status: 'open',
  priority: 'medium',
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) errors.value = {}
  },
)

const handleCancel = () => {
  formData.value = { title: '', description: '', status: 'open', priority: 'medium' }
  errors.value = {}
  emit('update:open', false)
}

const handleSubmit = async () => {
  isLoading.value = true
  errors.value = {}

  try {
    const validatedData = ticketSchema.parse(formData.value)
    await createTicket(validatedData.title, validatedData.description, validatedData.priority)

    showToast('Ticket created successfully 🎉')

    formData.value = { title: '', description: '', status: 'open', priority: 'medium' }
    props.onTicketCreated()
    emit('update:open', false)
  } catch (error: any) {
    if (error?.errors) {
      const newErrors: Record<string, string> = {}
      error.errors.forEach((err: any) => {
        newErrors[err.path?.[0] ?? ''] = err.message
      })
      errors.value = newErrors
    } else if (error?.message) {
      showToast(`Error: ${error.message}`)
    } else {
      showToast('Failed to create ticket. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}
</script>
