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
          <span v-if="user" class="text-sm text-muted-foreground"> Welcome, {{ user.name }} </span>
          <Button variant="outline" size="sm" @click="handleLogout"> Logout </Button>
        </div>
      </div>

      <!-- Mobile Header -->
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between md:hidden">
        <div>
          <h2 class="text-xl font-bold text-foreground">TicketHub</h2>
          <span v-if="user" class="text-sm text-muted-foreground"> Welcome, {{ user.name }} </span>
        </div>
        <Button class="bg-[#111] text-[#fff]" size="sm" @click="handleLogout"> Logout </Button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p class="text-muted-foreground">Welcome back! Here's an overview of your tickets.</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Card>
          <div>
            <div class="text-sm font-medium text-muted-foreground mb-2">Total Tickets</div>
            <div class="text-3xl pt-5 font-bold text-foreground">{{ stats.total }}</div>
          </div>
        </Card>

        <Card>
          <div>
            <div class="text-sm font-medium text-muted-foreground mb-2">Open</div>
            <div class="text-3xl pt-5 font-bold text-blue-600">{{ stats.open }}</div>
          </div>
        </Card>

        <Card>
          <div>
            <div class="text-sm font-medium text-muted-foreground mb-2">In Progress</div>
            <div class="text-3xl pt-5 font-bold text-yellow-600">{{ stats.inProgress }}</div>
          </div>
        </Card>

        <Card>
          <div>
            <div class="text-sm font-medium text-muted-foreground mb-2">Closed</div>
            <div class="text-3xl pt-5 font-bold text-green-600">{{ stats.closed }}</div>
          </div>
        </Card>
      </div>

      <RecentTickets :tickets="tickets" />
      <div class="pt-12">
        <router-link to="/tickets">
          <Button class="bg-[#111] text-[#fff]"> Manage Tickets</Button>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, logout, type User } from '../lib/auth'
import { getTickets, getTicketStats, type Ticket } from '../lib/tickets'
import Button from '../composables/Button.vue'
import Card from '../composables/Card.vue'
import RecentTickets from '../composables/RecentTickets.vue'

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

const loadTickets = () => {
  tickets.value = getTickets()
  stats.value = getTicketStats()
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
