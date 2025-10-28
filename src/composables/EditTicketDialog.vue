<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
      <h2 class="text-xl font-bold text-foreground mb-4">Edit Ticket</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-foreground mb-2">
            Title
          </label>
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
          <p v-if="errors.description" class="text-sm text-destructive mt-1">{{ errors.description }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="status" class="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
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
              name="priority"
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

        <div class="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            @click="$emit('update:open', false)"
            :disabled="isLoading"
            class="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" :disabled="isLoading" class="flex-1">
            {{ isLoading ? 'Updating...' : 'Update Ticket' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue'
import { updateTicket } from '../lib/tickets'
import { ticketSchema } from '../lib/validation'
import { useToast } from './useToast'
import Button from './Button.vue'
import Input from './Input.vue'

const { toast } = useToast()

const props = defineProps({
  ticket: {
    type: Object,
    required: true
  },
  open: {
    type: Boolean,
    required: true
  },
  onTicketUpdated: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:open'])

const isLoading = ref(false)
const errors = ref({})
const formData = ref({
  title: '',
  description: '',
  status: 'open',
  priority: 'medium',
})

// Sync form data when ticket changes
watchEffect(() => {
  if (props.ticket) {
    formData.value = {
      title: props.ticket.title,
      description: props.ticket.description,
      status: props.ticket.status,
      priority: props.ticket.priority,
    }
  }
})

const handleChange = (field, value) => {
  formData.value[field] = value
  if (errors.value[field]) {
    errors.value[field] = ''
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  errors.value = {}

  try {
    const validatedData = ticketSchema.parse(formData.value)
    updateTicket(props.ticket.id, validatedData)

    toast({
      title: 'Success',
      description: 'Ticket updated successfully',
    })

    props.onTicketUpdated()
    emit('update:open', false)
  } catch (error) {
    if (error.errors) {
      const newErrors = {}
      error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message
      })
      errors.value = newErrors
    }
  } finally {
    isLoading.value = false
  }
}

// Watch for formData changes and update individual fields
watch(() => formData.value.title, (newVal) => handleChange('title', newVal))
watch(() => formData.value.description, (newVal) => handleChange('description', newVal))
watch(() => formData.value.status, (newVal) => handleChange('status', newVal))
watch(() => formData.value.priority, (newVal) => handleChange('priority', newVal))
</script>