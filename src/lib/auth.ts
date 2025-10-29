export interface User {
  id: string
  email: string
  name: string
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const USERS_KEY = "users"
const CURRENT_USER_KEY = "current_user"

export const getAllUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

const setAllUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const getUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

export const setUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

export const clearUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY)
}


export const signup = (email: string, password: string, name: string): User => {
  const users = getAllUsers()

  if (users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists.")
  }

  const user: User = {
    id: Math.random().toString(36).substring(2, 10),
    email,
    name,
    password,
  }

  users.push(user)
  setAllUsers(users)
  setUser(user)
  return user
}


export const login = (email: string, password: string): User => {
  const users = getAllUsers()
  const existingUser = users.find((u) => u.email === email)

  if (!existingUser) {
    throw new Error("No account found. Please sign up first.")
  }

  if (existingUser.password !== password) {
    throw new Error("Invalid email or password.")
  }

  setUser(existingUser)
  return existingUser
}

export const logout = (): void => {
  clearUser()
}
