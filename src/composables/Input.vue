<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :class="[
      'w-full px-4 py-2 border border-border rounded-lg',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
      'transition-colors',
      $attrs.class
    ]"
    v-bind="$attrs"
  />
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  modelValue: String
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
</style>
