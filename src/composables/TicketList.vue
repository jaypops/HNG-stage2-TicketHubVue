<template>
  <div class="space-y-3">
    <!-- No tickets -->
    <Card v-if="tickets.length === 0" class="p-8 text-center">
      <p class="text-muted-foreground mb-4">No tickets found</p>
      <p class="text-sm text-muted-foreground">Create a new ticket to get started</p>
    </Card>

    <!-- Tickets List -->
    <Card v-else v-for="ticket in tickets" :key="ticket.id" class="p-4">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h3 class="font-semibold text-foreground mb-1">
            {{ ticket.title }}
          </h3>
          <p class="text-sm text-muted-foreground mb-3">
            {{ ticket.description }}
          </p>
          <div class="flex gap-2">
            <Badge :class="getStatusColor(ticket.status)">
              {{ ticket.status.replace('_', ' ') }}
            </Badge>
            <Badge :class="getPriorityColor(ticket.priority)">
              {{ ticket.priority }}
            </Badge>
          </div>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="$emit('edit', ticket)">Edit</Button>
          <Button
            size="sm"
            class="bg-red-500 hover:bg-red-400 text-white"
            @click="showConfirmPopup(ticket)"
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>

    <!-- Manual Delete Confirmation Popup -->
    <div
      v-if="confirmPopup.visible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="closePopup"
    >
      <div
        class="bg-background rounded-lg shadow-lg max-w-md w-full p-6"
        @click.stop
      >
        <h3 class="font-bold mb-2">Delete "{{ confirmPopup.ticket?.title }}"?</h3>
        <p class="text-sm text-muted-foreground mb-4">
          This action cannot be undone. It will permanently delete this ticket.
        </p>

        <div class="flex justify-end gap-3">
          <Button variant="outline" @click="closePopup">Cancel</Button>
          <Button
            class="bg-red-500 hover:bg-red-400 text-white"
            @click="confirmDelete"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { deleteTicket } from '../lib/tickets'
import { useToast } from './useToast'
import Card from './Card.vue'
import Button from './Button.vue'
import Badge from './Badge.vue'

const props = defineProps({
  tickets: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['edit', 'delete'])

const { toast } = useToast()

// Popup state
const confirmPopup = reactive({
  visible: false,
  ticket: null
})

// Show popup
const showConfirmPopup = (ticket) => {
  confirmPopup.visible = true
  confirmPopup.ticket = ticket
}

// Close popup
const closePopup = () => {
  confirmPopup.visible = false
  confirmPopup.ticket = null
}

// Confirm delete
const confirmDelete = () => {
  const ticket = confirmPopup.ticket
  if (!ticket) return

  if (deleteTicket(ticket.id)) {
    toast({
      title: 'Success',
      description: `"${ticket.title}" deleted successfully.`,
    })
    emit('delete')
  } else {
    toast({
      title: 'Error',
      description: 'Failed to delete ticket.',
    })
  }

  closePopup()
}

// Helpers
const getStatusColor = (status) => {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'closed':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-orange-100 text-orange-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>
