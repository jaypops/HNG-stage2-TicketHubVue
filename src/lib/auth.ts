export interface User {
  id: string
  email: string
  name: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export const getUser = (): User | null => {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export const setUser = (user: User): void => {
  localStorage.setItem("user", JSON.stringify(user))
}

export const clearUser = (): void => {
  localStorage.removeItem("user")
}

export const login = (email: string, password: string): User => {
  // Mock login - in production, this would call an API
  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name: email.split("@")[0],
  }
  setUser(user)
  return user
}

export const signup = (email: string, password: string, name: string): User => {
  // Mock signup - in production, this would call an API
  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name,
  }
  setUser(user)
  return user
}

export const logout = (): void => {
  clearUser()
}
