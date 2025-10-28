<template>
  <Card>
    <div class="p-6">
      <div v-if="recentTickets.length !== 0">
        <h3 class="text-lg font-semibold text-foreground mb-4">Recent Tickets</h3>
      </div>

      <div v-if="recentTickets.length === 0" class="">
        <p class="text-muted-foreground text-center">
          No tickets yet. Create your first ticket to get started!
        </p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="ticket in recentTickets"
          :key="ticket.id"
          class="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div class="flex-1">
            <h4 class="font-medium text-foreground mb-1">{{ ticket.title }}</h4>
            <p class="text-sm text-muted-foreground line-clamp-1">{{ ticket.description }}</p>
          </div>
          <div class="flex gap-2 ml-4">
            <Badge :class="getStatusColor(ticket.status)">
              {{ formatStatus(ticket.status) }}
            </Badge>
            <Badge :class="getPriorityColor(ticket.priority)">
              {{ formatPriority(ticket.priority) }}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Ticket } from '../lib/tickets'
import Card from './Card.vue'
import Badge from './Badge.vue'

interface RecentTicketsProps {
  tickets: Ticket[]
}

const props = defineProps<RecentTicketsProps>()

const recentTickets = computed(() => props.tickets.slice(-5).reverse())

const getStatusColor = (status: string) => {
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

const getPriorityColor = (priority: string) => {
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

const formatStatus = (status: string) => status.replace('_', ' ')

const formatPriority = (priority: string) => priority
</script>
