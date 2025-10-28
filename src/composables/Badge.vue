<template>
  <span :class="['px-3 py-1 rounded-full text-sm font-medium', variantClasses]">
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'danger'].includes(value)
  }
})

const variantClasses = computed(() => {
  const variants = {
    default: 'bg-muted bg-opacity-20 text-foreground',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800'
  }
  return variants[props.variant]
})
</script>

<style scoped>
</style>
