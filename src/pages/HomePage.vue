<template>
  <div class="min-h-screen bg-gradient-to-b from-primary-light to-background">
    <WavyBackground />

    <nav class="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div class="text-2xl font-bold text-[#111]">TicketHub</div>
      <div class="flex gap-4">
        <router-link to="/login">
          <Button variant="outline">Login</Button>
        </router-link>
        <router-link to="/signup">
          <Button>Sign Up</Button>
        </router-link>
      </div>
    </nav>

    <div
      class="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center"
    >
      <div
        class="absolute top-20 left-10 w-32 h-32 bg-primary opacity-10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 right-10 w-40 h-40 bg-primary opacity-5 rounded-full blur-3xl"
      ></div>

      <div class="relative z-20 max-w-2xl">
        <h1 class="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          Manage Your Tickets with Ease
        </h1>
        <p class="text-xl text-muted-foreground mb-8 text-balance">
          Streamline your workflow, track issues, and collaborate with your team. All in one place.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/signup">
            <Button size="lg" class="w-full sm:w-auto"> Get Started Free </Button>
          </router-link>
          <router-link to="/login">
            <Button size="lg" variant="outline" class="w-full sm:w-auto bg-transparent">
              Sign In
            </Button>
          </router-link>
        </div>
      </div>

      <div class="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full max-w-4xl">
        <div class="p-6 bg-white rounded-lg border border-border shadow-sm">
          <div class="text-3xl mb-3">📋</div>
          <h3 class="font-semibold text-foreground mb-2">Easy Tracking</h3>
          <p class="text-sm text-muted-foreground">
            Track all your tickets in one centralized dashboard
          </p>
        </div>

        <div class="p-6 bg-white rounded-lg border border-border shadow-sm">
          <div class="text-3xl mb-3">⚡</div>
          <h3 class="font-semibold text-foreground mb-2">Fast & Responsive</h3>
          <p class="text-sm text-muted-foreground">
            Lightning-fast performance for seamless workflow
          </p>
        </div>

        <div class="p-6 bg-white rounded-lg border border-border shadow-sm">
          <div class="text-3xl mb-3">🔒</div>
          <h3 class="font-semibold text-foreground mb-2">Secure</h3>
          <p class="text-sm text-muted-foreground">Your data is safe with us, always encrypted</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '../composables/Button.vue'
import WavyBackground from '../composables/WavyBackground.vue'
</script>

<style scoped></style>
