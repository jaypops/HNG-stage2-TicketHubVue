<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="bg-white border-b border-border">
      <div class="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ticket Management</h1>
        </div>
        <div class="flex gap-4">
          <router-link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">All Tickets</h2>
          <p className="text-sm text-muted-foreground">Manage and track all your tickets</p>
        </div>
        <Button @click="showCreateDialog = true">Create Ticket</Button>
      </div>
      <!-- Filter Section -->
      <div class="mb-8 flex gap-4">
        <div class="flex gap-2">
          <Button
            v-for="status in ['all', 'open', 'in_progress', 'closed']"
            :key="status"
            :variant="filterStatus === status ? 'default' : 'outline'"
            @click="filterStatus = status"
            size="sm"
          >
            {{ status === 'all' ? 'All' : status.replace('_', ' ') }}
          </Button>
        </div>
      </div>

      <!-- Tickets List -->
      <TicketList :tickets="filteredTickets" @edit="editTicket" @delete="refreshTickets" />
    </main>

    <!-- Create Ticket Dialog -->
    <CreateTicketDialog
      :open="showCreateDialog"
      @update:open="showCreateDialog = $event"
      @ticket-created="handleTicketCreated"
    />

    <!-- Edit Ticket Dialog -->
    <EditTicketDialog
      :ticket="editingTicket"
      :open="showEditDialog"
      @update:open="showEditDialog = $event"
      @ticket-updated="handleTicketUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getTickets } from '../lib/tickets'
import CreateTicketDialog from '../composables/CreateTicketDialog.vue'
import EditTicketDialog from '../composables/EditTicketDialog.vue'
import TicketList from '../composables/TicketList.vue'
import Button from '../composables/Button.vue'

const tickets = ref([])
const filterStatus = ref('')
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const editingTicket = ref(null)

const filteredTickets = computed(() => {
  if (!filterStatus.value) return tickets.value
  return tickets.value.filter((t) => t.status === filterStatus.value)
})

const refreshTickets = () => {
  tickets.value = getTickets()
}

const handleTicketCreated = () => {
  refreshTickets()
  showCreateDialog.value = false
}

const handleTicketUpdated = () => {
  refreshTickets()
  showEditDialog.value = false
  editingTicket.value = null
}

const editTicket = (ticket) => {
  editingTicket.value = ticket
  showEditDialog.value = true
}

onMounted(() => {
  refreshTickets()
})
</script>
