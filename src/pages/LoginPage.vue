<template>
  <div
    class="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-6"
  >
    <Card class="w-full max-w-md">
      <div class="mb-8">
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
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <Button variant="primary" size="lg" class="w-full bg-primary text-background" :disabled="isLoading" >
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </Button>
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
import { validateEmail, validatePassword } from '../lib/validation'
import Button from '../composables/Button.vue'
import Card from '../composables/Card.vue'
import Input from '../composables/Input.vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errors = ref({
  email: '',
  password: '',
})

const validateEmailField = () => {
  if (!email.value) {
    errors.value.email = 'Email is required'
  } else if (!validateEmail(email.value)) {
    errors.value.email = 'Please enter a valid email'
  } else {
    errors.value.email = ''
  }
}

const validatePasswordField = () => {
  if (!password.value) {
    errors.value.password = 'Password is required'
  } else if (!validatePassword(password.value)) {
    errors.value.password = 'Password must be at least 6 characters'
  } else {
    errors.value.password = ''
  }
}

const handleLogin = async () => {
  validateEmailField()
  validatePasswordField()

  if (errors.value.email || errors.value.password) return

  isLoading.value = true
  try {
    await login(email.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
