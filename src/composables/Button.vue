<template>
  <button
    :type="props.type"
    :class="buttonClasses"
    :disabled="disabled"
    v-bind="attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

type ButtonType = 'button' | 'submit' | 'reset'

defineOptions({
  name: 'AppButton',
  inheritAttrs: false,
})

const props = defineProps({
  variant: {
    type: String as () =>
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link',
    default: 'default',
  },
  size: {
    type: String as () =>
      | 'default'
      | 'sm'
      | 'lg'
      | 'icon'
      | 'icon-sm'
      | 'icon-lg',
    default: 'default',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as () => ButtonType,
    default: 'button',
  },
})

const attrs = useAttrs()

const baseClasses =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'

const variantClasses = computed(() => {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive:
      'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
    outline:
      'border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
    link: 'text-primary underline-offset-4 hover:underline',
  } as const

  return variants[props.variant]
})

const sizeClasses = computed(() => {
  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md gap-1.5 px-3',
    lg: 'h-10 rounded-md px-6',
    icon: 'size-9',
    'icon-sm': 'size-8',
    'icon-lg': 'size-10',
  } as const

  return sizes[props.size]
})

const buttonClasses = computed(() => {
  return [
    baseClasses,
    variantClasses.value,
    sizeClasses.value,
    (attrs.class as string) || '',
  ]
    .filter(Boolean)
    .join(' ')
})
</script>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
}
</style>
