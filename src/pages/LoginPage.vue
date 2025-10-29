<template>
  <div
    class="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-6"
  >
    <Card class="w-full max-w-md">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
        <p class="text-[#737373]">Sign in to your account to continue</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Email</label>
          <Input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            @blur="validateEmailField"
            @input="clearError('email')"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Password</label>
          <Input
            v-model="password"
            type="password"
            placeholder="••••••••"
            @blur="validatePasswordField"
            @input="clearError('password')"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <button
          type="submit"
          class="w-full bg-black text-white py-2 rounded-md font-medium hover:bg-black/90 disabled:opacity-50 disabled:pointer-events-none transition-all"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-[#737373]">
          Don't have an account?
          <router-link to="/signup" class="text-primary font-medium hover:underline">
            Sign up
          </router-link>
        </p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../lib/auth'
import { getEmailError, getPasswordError } from '../lib/validation'
import { useToast } from '../composables/useToast'
import Card from '../composables/Card.vue'
import Input from '../composables/Input.vue'

const router = useRouter()
const { showToast } = useToast()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errors = ref({
  email: '',
  password: '',
})

const clearError = (field: keyof typeof errors.value) => {
  errors.value[field] = ''
}

const validateEmailField = () => {
  errors.value.email = getEmailError(email.value)
}

const validatePasswordField = () => {
  errors.value.password = getPasswordError(password.value)
}

const handleLogin = () => {
  validateEmailField()
  validatePasswordField()

  if (errors.value.email || errors.value.password) return

  isLoading.value = true
  try {
    login(email.value, password.value)
    showToast('Login successful! 🎉', 'success')
    router.push('/dashboard')
  } catch (error: any) {
    showToast(error.message || 'Invalid email or password', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>
