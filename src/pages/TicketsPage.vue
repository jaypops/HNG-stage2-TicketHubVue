<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="bg-white border-b border-border">
      <div class="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-foreground">Tickets</h1>
          <p class="text-muted mt-1">Manage all your tickets</p>
        </div>
        <div class="flex gap-4">
          <Button @click="showCreateDialog = true" variant="primary"> Create Ticket </Button>
          <router-link to="/dashboard">
            <Button variant="ghost">Back to Dashboard</Button>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      <!-- Filter Section -->
      <div class="mb-8 flex gap-4">
        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <!-- Tickets List -->
      <div v-if="filteredTickets.length === 0" class="text-center py-12">
        <p class="text-muted mb-4">No tickets found.</p>
      </div>

      <div v-else class="space-y-4">
        <Card v-for="ticket in filteredTickets" :key="ticket.id" class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-foreground">{{ ticket.title }}</h3>
              <p class="text-muted text-sm mt-2">{{ ticket.description }}</p>
            </div>
            <div class="flex gap-2 ml-4">
              <Badge :variant="getStatusVariant(ticket.status)">
                {{ formatStatus(ticket.status) }}
              </Badge>
              <Badge :variant="getPriorityVariant(ticket.priority)">
                {{ formatPriority(ticket.priority) }}
              </Badge>
            </div>
          </div>

          <div class="flex gap-2 pt-4 border-t border-border">
            <Button variant="outline" size="sm" @click="editTicket(ticket)"> Edit </Button>
            <Button
              variant="destructive"
              size="sm"
              @click="deleteTicket(ticket.id)"
              :disabled="deletingId === ticket.id"
            >
              {{ deletingId === ticket.id ? 'Deleting...' : 'Delete' }}
            </Button>
          </div>
        </Card>
      </div>
    </main>

    <!-- Create Ticket Dialog -->
    <div
      v-if="showCreateDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <Card class="w-full max-w-md">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-foreground">Create Ticket</h2>
          <button @click="closeCreateDialog" class="text-muted hover:text-foreground">
            ✕
          </button>
        </div>

        <form @submit.prevent="handleCreateTicket" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Title</label>
            <Input
              v-model="createForm.title"
              placeholder="Ticket title"
            />
            <p v-if="createErrors.title" class="text-red-500 text-sm mt-1">
              {{ createErrors.title }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              v-model="createForm.description"
              placeholder="Ticket description"
              class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows="4"
            ></textarea>
            <p v-if="createErrors.description" class="text-red-500 text-sm mt-1">
              {{ createErrors.description }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Priority</label>
            <select
              v-model="createForm.priority"
              class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="flex gap-2 pt-4">
            <Button variant="outline" @click="closeCreateDialog" class="flex-1">
              Cancel
            </Button>
            <Button variant="primary" type="submit" class="flex-1" :disabled="isCreating">
              {{ isCreating ? 'Creating...' : 'Create' }}
            </Button>
          </div>
        </form>
      </Card>
    </div>

    <!-- Edit Ticket Dialog -->
    <div
      v-if="showEditDialog && editingTicket"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <Card class="w-full max-w-md">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-foreground">Edit Ticket</h2>
          <button @click="closeEditDialog" class="text-muted hover:text-foreground">
            ✕
          </button>
        </div>

        <form @submit.prevent="handleEditTicket" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Title</label>
            <Input v-model="editForm.title" placeholder="Ticket title" />
            <p v-if="editErrors.title" class="text-red-500 text-sm mt-1">
              {{ editErrors.title }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              v-model="editForm.description"
              placeholder="Ticket description"
              class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows="4"
            ></textarea>
            <p v-if="editErrors.description" class="text-red-500 text-sm mt-1">
              {{ editErrors.description }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Status</label>
            <select
              v-model="editForm.status"
              class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Priority</label>
            <select
              v-model="editForm.priority"
              class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="flex gap-2 pt-4">
            <Button variant="outline" @click="closeEditDialog" class="flex-1">
              Cancel
            </Button>
            <Button variant="primary" type="submit" class="flex-1" :disabled="isEditing">
              {{ isEditing ? 'Saving...' : 'Save' }}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, computed, onMounted } from 'vue'
import {
  getTickets,
  createTicket as createTicketUtil,
  updateTicket,
  deleteTicket as deleteTicketUtil,
} from '../lib/tickets'
import { createTicketSchema, editTicketSchema } from '../lib/validation'
import Button from '../composables/Button.vue'
import Card from '../composables/Card.vue'
import Badge from '../composables/Badge.vue'
import Input from '../composables/Input.vue'

const tickets = ref([])
const filterStatus = ref('')
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const isCreating = ref(false)
const isEditing = ref(false)
const deletingId = ref(null)
const editingTicket = ref(null)

const createForm = ref({
  title: '',
  description: '',
  priority: 'medium',
})

const editForm = ref({
  title: '',
  description: '',
  status: 'open',
  priority: 'medium',
})

const createErrors = ref({
  title: '',
  description: '',
})

const editErrors = ref({
  title: '',
  description: '',
})

const filteredTickets = computed(() => {
  if (!filterStatus.value) return tickets.value
  return tickets.value.filter((t) => t.status === filterStatus.value)
})

const formatStatus = (status) => {
  return status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
}

const formatPriority = (priority) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

const getStatusVariant = (status) => {
  const variants = {
    open: 'success',
    in_progress: 'warning',
    closed: 'default',
  }
  return variants[status] || 'default'
}

const getPriorityVariant = (priority) => {
  const variants = {
    low: 'default',
    medium: 'warning',
    high: 'danger',
  }
  return variants[priority] || 'default'
}

const resetCreateForm = () => {
  createForm.value = { title: '', description: '', priority: 'medium' }
  createErrors.value = { title: '', description: '' }
}

const resetEditForm = () => {
  editForm.value = { title: '', description: '', status: 'open', priority: 'medium' }
  editErrors.value = { title: '', description: '' }
}

const closeCreateDialog = () => {
  showCreateDialog.value = false
  resetCreateForm()
}

const closeEditDialog = () => {
  showEditDialog.value = false
  editingTicket.value = null
  resetEditForm()
}

const handleCreateTicket = async () => {
  // Reset errors
  createErrors.value = { title: '', description: '' }

  // Validate with Zod
  const result = createTicketSchema.safeParse(createForm.value)

  if (!result.success) {
    // Map Zod errors to form errors
    result.error.errors.forEach((error) => {
      const field = error.path[0]
      if (field === 'title' || field === 'description') {
        createErrors.value[field] = error.message
      }
    })
    return
  }

  isCreating.value = true
  try {
    createTicketUtil(
      createForm.value.title,
      createForm.value.description,
      createForm.value.priority,
    )
    tickets.value = getTickets()
    closeCreateDialog()
  } finally {
    isCreating.value = false
  }
}

const editTicket = (ticket) => {
  editingTicket.value = ticket
  editForm.value = {
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
  }
  showEditDialog.value = true
}

const handleEditTicket = async () => {
  // Reset errors
  editErrors.value = { title: '', description: '' }

  // Validate with Zod
  const result = editTicketSchema.safeParse(editForm.value)

  if (!result.success) {
    // Map Zod errors to form errors
    result.error.errors.forEach((error) => {
      const field = error.path[0]
      if (field === 'title' || field === 'description') {
        editErrors.value[field] = error.message
      }
    })
    return
  }

  isEditing.value = true
  try {
    updateTicket(editingTicket.value.id, editForm.value)
    tickets.value = getTickets()
    closeEditDialog()
  } finally {
    isEditing.value = false
  }
}

const deleteTicket = async (id) => {
  if (!confirm('Are you sure you want to delete this ticket?')) return

  deletingId.value = id
  try {
    deleteTicketUtil(id)
    tickets.value = getTickets()
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  tickets.value = getTickets()
})
</script>

<style scoped></style>