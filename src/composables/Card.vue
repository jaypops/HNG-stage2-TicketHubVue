<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    :class="[
      'rounded-2xl transition-all duration-300 ease-in-out border shadow-sm overflow-hidden',
      variantClasses,
      hoverable ? 'hover:shadow-md hover:-translate-y-1' : '',
      className,
    ]"
  >
    <!-- Optional header -->
    <div v-if="$slots.header" class="border-b border-border/50 px-6 py-4 bg-muted/10">
      <slot name="header" />
    </div>

    <!-- Card content -->
    <div class="p-6">
      <slot />
    </div>

    <!-- Optional footer -->
    <div v-if="$slots.footer" class="border-t border-border/50 px-6 py-3 bg-muted/10">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'BaseCard', // better naming convention
})

const props = defineProps({
  variant: {
    type: String,
    default: 'elevated', // 'elevated' | 'outline' | 'flat'
    validator: (v: string) => ['elevated', 'outline', 'flat'].includes(v),
  },
  hoverable: {
    type: Boolean,
    default: true,
  },
  className: {
    type: String,
    default: '',
  },
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'outline':
      return 'bg-transparent border-border'
    case 'flat':
      return 'bg-background border-none shadow-none'
    default:
      return 'bg-white border-border shadow-sm'
  }
})
</script>

<style scoped>
div {
  will-change: transform, box-shadow;
}
</style>
