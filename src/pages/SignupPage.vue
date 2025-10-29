<template>
  <div
    class="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-6"
  >
    <Card class="w-full max-w-md">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-foreground mb-2">Create Account</h1>
        <p class="text-muted-foreground">Join us and start managing your tickets</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <Input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="John Doe"
            :disabled="isLoading"
            :class="errors.name ? 'border-destructive' : ''"
            @input="clearError('name')"
          />
          <p v-if="errors.name" class="text-sm text-destructive mt-1">{{ errors.name }}</p>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-foreground mb-2"> Email </label>
          <Input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="you@example.com"
            :disabled="isLoading"
            :class="errors.email ? 'border-destructive' : ''"
            @input="clearError('email')"
          />
          <p v-if="errors.email" class="text-sm text-destructive mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <Input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="••••••••"
            :disabled="isLoading"
            :class="errors.password ? 'border-destructive' : ''"
            @input="clearError('password')"
          />
          <p v-if="errors.password" class="text-sm text-destructive mt-1">{{ errors.password }}</p>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-foreground mb-2">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            placeholder="••••••••"
            :disabled="isLoading"
            :class="errors.confirmPassword ? 'border-destructive' : ''"
            @input="clearError('confirmPassword')"
          />
          <p v-if="errors.confirmPassword" class="text-sm text-destructive mt-1">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <button
          type="submit"
          class="w-full bg-black text-white py-2 rounded-md font-medium hover:bg-black/90 disabled:opacity-50 disabled:pointer-events-none transition-all"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Creating account...' : 'Sign Up' }}
        </button>

        <p class="text-center text-sm text-muted-foreground">
          Already have an account?
          <router-link to="/login" class="text-primary hover:underline font-medium">
            Sign in
          </router-link>
        </p>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Card from '../composables/Card.vue'
import Input from '../composables/Input.vue'
import { signupSchema, type SignupInput } from '../lib/validation'
import { setUser } from '../lib/auth'
import { useToast } from '../composables/useToast.ts'

const router = useRouter()
const { toast } = useToast()
const isLoading = ref(false)
const errors = reactive<Record<string, string>>({})

const formData = reactive<SignupInput>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const clearError = (field: string) => {
  if (errors[field]) {
    delete errors[field]
  }
}

const handleSubmit = async () => {
  isLoading.value = true

  Object.keys(errors).forEach((key) => delete errors[key])

  try {
    console.log('Validating data...')
    const validatedData = signupSchema.parse(formData)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = {
      id: Math.random().toString(36).substring(2),
      email: validatedData.email,
      name: validatedData.name,
      password: validatedData.password,
    }

    setUser(user)

    toast({
      title: 'Success',
      description: 'Account created successfully',
    })

    router.push('/dashboard')
  } catch (error) {
    if (error instanceof Error) {
      const zodError = error as any
      if (zodError.errors) {
        console.log('Zod validation errors:', zodError.errors)
        zodError.errors.forEach((err: any) => {
          errors[err.path[0]] = err.message
        })
      } else {
        toast({
          title: 'Error',
          description: error.message,
        })
      }
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
