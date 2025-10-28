<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b border-border bg-card">
      <!-- Desktop Header -->
      <div class="max-w-7xl mx-auto px-4 py-4 md:flex items-center justify-between hidden">
        <div>
          <h2 class="text-xl font-bold text-foreground">TicketHub</h2>
        </div>
        <div class="flex items-center gap-4">
          <span v-if="user" class="text-sm text-muted-foreground">
            Welcome, {{ user.name }}
          </span>
          <Button class="bg-[#111] text-[#fff]" size="sm" @click="handleLogout">
            Logout
          </Button>
        </div>
      </div>

      <!-- Mobile Header -->
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between md:hidden">
        <div>
          <h2 class="text-xl font-bold text-foreground">TicketHub</h2>
          <span v-if="user" class="text-sm text-muted-foreground">
            Welcome, {{ user.name }}
          </span>
        </div>
        <Button class="bg-[#111] text-[#fff]" size="sm" @click="handleLogout">
          Logout
        </Button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Card class="p-6">
          <div class="text-sm font-medium text-muted-foreground mb-2">Total Tickets</div>
          <div class="text-3xl font-bold text-foreground">{{ stats.total }}</div>
        </Card>

        <Card class="p-6">
          <div class="text-sm font-medium text-muted-foreground mb-2">Open</div>
          <div class="text-3xl font-bold text-blue-600">{{ stats.open }}</div>
        </Card>

        <Card class="p-6">
          <div class="text-sm font-medium text-muted-foreground mb-2">In Progress</div>
          <div class="text-3xl font-bold text-yellow-600">{{ stats.inProgress }}</div>
        </Card>

        <Card class="p-6 ">
          <div class="text-sm font-medium text-muted-foreground mb-2">Closed</div>
          <div class="text-3xl font-bold text-green-600">{{ stats.closed }}</div>
        </Card>
      </div>

      <!-- Recent Tickets -->
      <div>
        <h2 class="text-2xl font-bold text-foreground mb-6">Recent Tickets</h2>

        <div v-if="recentTickets.length === 0" class="text-center py-12">
          <p class="text-muted mb-4">No tickets yet. Create your first ticket to get started.</p>
          <router-link to="/tickets">
            <Button class="bg-[#111] text-[#fff]">Go to Tickets</Button>
          </router-link>
        </div>

        <div v-else class="space-y-4">
          <Card
            v-for="ticket in recentTickets"
            :key="ticket.id"
            class="flex items-center justify-between"
          >
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-foreground">{{ ticket.title }}</h3>
              <p class="text-muted text-sm mt-1">{{ ticket.description }}</p>
            </div>
            <div class="flex items-center gap-4">
              <Badge :variant="getStatusVariant(ticket.status)">
                {{ formatStatus(ticket.status) }}
              </Badge>
              <Badge :variant="getPriorityVariant(ticket.priority)">
                {{ formatPriority(ticket.priority) }}
              </Badge>
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
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, logout, type User } from '../lib/auth'
import { getTickets, getTicketStats, deleteTicket as deleteTicketUtil, type Ticket } from '../lib/tickets'
import Button from '../composables/Button.vue'
import Card from '../composables/Card.vue'
import Badge from '../composables/Badge.vue'

interface TicketStats {
  total: number
  open: number
  inProgress: number
  closed: number
}

const router = useRouter()
const user = ref<User | null>(null)
const tickets = ref<Ticket[]>([])
const stats = ref<TicketStats>({ total: 0, open: 0, inProgress: 0, closed: 0 })
const deletingId = ref<string | null>(null)

const loadTickets = () => {
  tickets.value = getTickets()
  stats.value = getTicketStats()
}

const recentTickets = computed(() => tickets.value.slice(0, 5))

const formatStatus = (status: string) =>
  status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')

const formatPriority = (priority: string) =>
  priority.charAt(0).toUpperCase() + priority.slice(1)

const getStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    open: 'success',
    in_progress: 'warning',
    closed: 'default',
  }
  return variants[status] || 'default'
}

const getPriorityVariant = (priority: string) => {
  const variants: Record<string, string> = {
    low: 'default',
    medium: 'warning',
    high: 'danger',
  }
  return variants[priority] || 'default'
}

const deleteTicket = async (id: string) => {
  if (!confirm('Are you sure you want to delete this ticket?')) return

  deletingId.value = id
  try {
    deleteTicketUtil(id)
    loadTickets()
  } finally {
    deletingId.value = null
  }
}

const handleLogout = () => {
  logout()
  router.push('/')
}

onMounted(() => {
  user.value = getUser()
  loadTickets()
})
</script>

<style scoped></style>
