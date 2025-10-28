import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import App from "./App.vue"
import "./style.css"
import { getUser } from "./lib/auth"

// Pages
import HomePage from "./pages/HomePage.vue"
import LoginPage from "./pages/LoginPage.vue"
import SignupPage from "./pages/SignupPage.vue"
import DashboardPage from "./pages/DashboardPage.vue"
import TicketsPage from "./pages/TicketsPage.vue"

const routes = [
  { path: "/", component: HomePage },
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignupPage },
  { path: "/dashboard", component: DashboardPage, meta: { requiresAuth: true } },
  { path: "/tickets", component: TicketsPage, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const user = getUser()
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !user) {
    next("/login")
  } else if ((to.path === "/login" || to.path === "/signup") && user) {
    next("/dashboard")
  } else {
    next()
  }
})

const app = createApp(App)
app.use(router)
app.mount("#app")
