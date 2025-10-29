<template>
  <div class="fixed bottom-6 right-6 z-50 space-y-3 w-full max-w-sm">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="px-6 py-5 rounded-2xl shadow-xl bg-white text-gray-900 border border-gray-200 text-sm"
      >
        <!-- Remove title check since it doesn't exist in the type -->
        <p class="text-gray-600">
          {{ toast.message }}
        </p>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToast } from './useToast'
const { toasts } = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
